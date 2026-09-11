#!/usr/bin/env bash
set -Eeuo pipefail

SCRIPT_DIR=$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)
DEPLOY_DIR=$(cd -- "${SCRIPT_DIR}/.." && pwd)
ENV_FILE=${1:-production.env}
COMPOSE_FILE=${DEPLOY_DIR}/compose.yml
ROLLBACK_FILE=${DEPLOY_DIR}/.rollback-images.yml

cd "${DEPLOY_DIR}"

if [[ ! -f ${ROLLBACK_FILE} ]]; then
  echo "No previous image record exists; rollback is unavailable for the first deployment." >&2
  exit 1
fi

docker compose --env-file "${ENV_FILE}" \
  -f "${COMPOSE_FILE}" -f "${ROLLBACK_FILE}" \
  up -d --no-build --remove-orphans

echo "Previous backend and frontend images restored."
docker compose --env-file "${ENV_FILE}" \
  -f "${COMPOSE_FILE}" -f "${ROLLBACK_FILE}" ps
