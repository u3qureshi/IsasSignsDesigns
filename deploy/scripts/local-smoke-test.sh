#!/usr/bin/env bash
set -Eeuo pipefail

SCRIPT_DIR=$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)
DEPLOY_DIR=$(cd -- "${SCRIPT_DIR}/.." && pwd)
ENV_FILE=${1:-local.env}

cd "${DEPLOY_DIR}"

if [[ ! -f ${ENV_FILE} ]]; then
  echo "Missing ${DEPLOY_DIR}/${ENV_FILE}. Copy production.env.example to ${ENV_FILE} first." >&2
  exit 1
fi

compose=(docker compose --env-file "${ENV_FILE}" -f compose.yml)

cleanup() {
  "${compose[@]}" down >/dev/null 2>&1 || true
}
trap cleanup EXIT

"${compose[@]}" config --quiet
"${compose[@]}" build app web
"${compose[@]}" up -d

for attempt in {1..30}; do
  if curl --fail --silent --show-error http://127.0.0.1:8080/health >/dev/null; then
    break
  fi
  sleep 4
done

curl --fail --silent --show-error http://127.0.0.1:8080/health
curl --fail --silent --show-error http://127.0.0.1:8080/ >/dev/null
curl --fail --silent --show-error http://127.0.0.1:8080/api/products >/dev/null

if "${compose[@]}" exec -T app \
    wget --quiet --output-document=/dev/null http://127.0.0.1:8081/v3/api-docs; then
  echo "Swagger unexpectedly responded successfully in the production profile." >&2
  exit 1
fi

"${compose[@]}" ps
echo "Local production smoke test passed."
