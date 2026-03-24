#!/usr/bin/env bash

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(cd "${SCRIPT_DIR}/../.." && pwd)"

if [[ -f "${ROOT_DIR}/.env" ]]; then
  set -a
  # shellcheck disable=SC1091
  source "${ROOT_DIR}/.env"
  set +a
fi

: "${BOOTSTRAP_DATABASE_URL:?BOOTSTRAP_DATABASE_URL is required}"
: "${APP_DB_NAME:?APP_DB_NAME is required}"
: "${APP_DB_USER:?APP_DB_USER is required}"
: "${APP_DB_PASSWORD:?APP_DB_PASSWORD is required}"
: "${KEYCLOAK_DB_NAME:?KEYCLOAK_DB_NAME is required}"
: "${KEYCLOAK_DB_USER:?KEYCLOAK_DB_USER is required}"
: "${KEYCLOAK_DB_PASSWORD:?KEYCLOAK_DB_PASSWORD is required}"

run_psql() {
  if command -v psql >/dev/null 2>&1; then
    psql "${BOOTSTRAP_DATABASE_URL}" "$@"
    return
  fi

  if command -v docker >/dev/null 2>&1; then
    docker exec -i checkpad-postgres psql "${BOOTSTRAP_DATABASE_URL}" "$@"
    return
  fi

  echo "Neither psql nor docker is available. Install one of them to run db:bootstrap." >&2
  exit 1
}

if command -v psql >/dev/null 2>&1; then
  run_psql \
    -v ON_ERROR_STOP=1 \
    -v app_db_name="${APP_DB_NAME}" \
    -v app_db_user="${APP_DB_USER}" \
    -v app_db_password="${APP_DB_PASSWORD}" \
    -v keycloak_db_name="${KEYCLOAK_DB_NAME}" \
    -v keycloak_db_user="${KEYCLOAK_DB_USER}" \
    -v keycloak_db_password="${KEYCLOAK_DB_PASSWORD}" \
    -f "${SCRIPT_DIR}/bootstrap-infra.sql"
else
  run_psql \
    -v ON_ERROR_STOP=1 \
    -v app_db_name="${APP_DB_NAME}" \
    -v app_db_user="${APP_DB_USER}" \
    -v app_db_password="${APP_DB_PASSWORD}" \
    -v keycloak_db_name="${KEYCLOAK_DB_NAME}" \
    -v keycloak_db_user="${KEYCLOAK_DB_USER}" \
    -v keycloak_db_password="${KEYCLOAK_DB_PASSWORD}" \
    < "${SCRIPT_DIR}/bootstrap-infra.sql"
fi

echo "Database bootstrap completed successfully."
