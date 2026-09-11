#!/usr/bin/env bash
set -Eeuo pipefail

SCRIPT_DIR=$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)
DEPLOY_DIR=$(cd -- "${SCRIPT_DIR}/.." && pwd)
ENV_FILE=${1:-production.env}
COMPOSE_FILE=${DEPLOY_DIR}/compose.yml
ROLLBACK_FILE=${DEPLOY_DIR}/.rollback-images.yml

cd "${DEPLOY_DIR}"

if [[ ! -f ${ENV_FILE} ]]; then
  echo "Missing ${DEPLOY_DIR}/${ENV_FILE}. Copy production.env.example and fill it first." >&2
  exit 1
fi

compose=(docker compose --env-file "${ENV_FILE}" -f "${COMPOSE_FILE}")
"${compose[@]}" config --quiet

current_app=$(docker inspect --format '{{.Config.Image}}' threadandbutter-app-1 2>/dev/null || true)
current_web=$(docker inspect --format '{{.Config.Image}}' threadandbutter-web-1 2>/dev/null || true)

if [[ -n ${current_app} && -n ${current_web} ]]; then
  cat > "${ROLLBACK_FILE}" <<EOF
services:
  app:
    image: ${current_app}
  web:
    image: ${current_web}
EOF
  chmod 600 "${ROLLBACK_FILE}"
fi

"${compose[@]}" pull db app web
"${compose[@]}" up -d --no-build --remove-orphans

for attempt in {1..30}; do
  db_health=$(docker inspect --format '{{.State.Health.Status}}' threadandbutter-db-1 2>/dev/null || true)
  app_health=$(docker inspect --format '{{.State.Health.Status}}' threadandbutter-app-1 2>/dev/null || true)
  web_health=$(docker inspect --format '{{.State.Health.Status}}' threadandbutter-web-1 2>/dev/null || true)

  if [[ ${db_health} == healthy && ${app_health} == healthy && ${web_health} == healthy ]]; then
    echo "Deployment is healthy."
    "${compose[@]}" ps
    exit 0
  fi
  sleep 4
done

echo "Deployment did not become healthy. Recent logs:" >&2
"${compose[@]}" logs --tail=120 app web >&2

if [[ -f ${ROLLBACK_FILE} ]]; then
  echo "A previous release is available. Run deploy/scripts/rollback.sh ${ENV_FILE}." >&2
fi
exit 1
