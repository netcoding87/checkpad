#!/usr/bin/env sh
set -eu

: "${KEYCLOAK_REALM:?KEYCLOAK_REALM is required}"
: "${KEYCLOAK_CLIENT_ID:?KEYCLOAK_CLIENT_ID is required}"
: "${KEYCLOAK_CLIENT_SECRET:?KEYCLOAK_CLIENT_SECRET is required}"
: "${KEYCLOAK_APP_ORIGIN:?KEYCLOAK_APP_ORIGIN is required}"
: "${KEYCLOAK_APP_CALLBACK_URL:?KEYCLOAK_APP_CALLBACK_URL is required}"
: "${KEYCLOAK_SUPER_ADMIN_USERNAME:?KEYCLOAK_SUPER_ADMIN_USERNAME is required}"
: "${KEYCLOAK_SUPER_ADMIN_EMAIL:?KEYCLOAK_SUPER_ADMIN_EMAIL is required}"
: "${KEYCLOAK_SUPER_ADMIN_PASSWORD:?KEYCLOAK_SUPER_ADMIN_PASSWORD is required}"
: "${KEYCLOAK_SUPER_ADMIN_EMAIL:?KEYCLOAK_SUPER_ADMIN_EMAIL is required}"
: "${KEYCLOAK_SUPER_ADMIN_FIRST_NAME:?KEYCLOAK_SUPER_ADMIN_FIRST_NAME is required}"
: "${KEYCLOAK_SUPER_ADMIN_LAST_NAME:?KEYCLOAK_SUPER_ADMIN_LAST_NAME is required}"
: "${KEYCLOAK_ADMIN:?KEYCLOAK_ADMIN is required}"
: "${KEYCLOAK_ADMIN_PASSWORD:?KEYCLOAK_ADMIN_PASSWORD is required}"

IMPORT_DIR="${KEYCLOAK_IMPORT_DIR:-/opt/keycloak/data/import}"
REALM_FILE="${IMPORT_DIR}/checkpad-realm.json"
LOGIN_THEME="${KEYCLOAK_LOGIN_THEME:-checkpad}"

mkdir -p "${IMPORT_DIR}"

cat > "${REALM_FILE}" <<EOF
{
  "realm": "${KEYCLOAK_REALM}",
  "enabled": true,
  "sslRequired": "none",
  "registrationAllowed": false,
  "rememberMe": true,
  "loginTheme": "${LOGIN_THEME}",
  "loginWithEmailAllowed": false,
  "duplicateEmailsAllowed": false,
  "resetPasswordAllowed": true,
  "editUsernameAllowed": false,
  "roles": {
    "realm": [
      {
        "name": "super_admin",
        "description": "checkPAD super admin role"
      }
    ]
  },
  "clients": [
    {
      "clientId": "${KEYCLOAK_CLIENT_ID}",
      "name": "checkPAD Web",
      "enabled": true,
      "protocol": "openid-connect",
      "publicClient": false,
      "secret": "${KEYCLOAK_CLIENT_SECRET}",
      "standardFlowEnabled": true,
      "directAccessGrantsEnabled": false,
      "serviceAccountsEnabled": false,
      "redirectUris": [
        "${KEYCLOAK_APP_CALLBACK_URL}",
        "${KEYCLOAK_APP_ORIGIN}/*"
      ],
      "webOrigins": [
        "${KEYCLOAK_APP_ORIGIN}"
      ],
      "attributes": {
        "pkce.code.challenge.method": "S256"
      },
      "defaultClientScopes": [
        "web-origins",
        "profile",
        "roles",
        "email"
      ]
    }
  ],
  "users": [
    {
      "username": "${KEYCLOAK_SUPER_ADMIN_USERNAME}",
      "enabled": true,
      "email": "${KEYCLOAK_SUPER_ADMIN_EMAIL}",
      "emailVerified": true,
      "firstName": "${KEYCLOAK_SUPER_ADMIN_FIRST_NAME}",
      "lastName": "${KEYCLOAK_SUPER_ADMIN_LAST_NAME}",
      "credentials": [
        {
          "type": "password",
          "value": "${KEYCLOAK_SUPER_ADMIN_PASSWORD}",
          "temporary": false
        }
      ],
      "realmRoles": [
        "super_admin"
      ]
    }
  ]
}
EOF

if [ "${KEYCLOAK_SKIP_START:-false}" = "true" ]; then
  exit 0
fi

case "${KEYCLOAK_START_MODE:-dev}" in
  dev)
    exec /opt/keycloak/bin/kc.sh start-dev --import-realm
    ;;
  prod)
    exec /opt/keycloak/bin/kc.sh start --import-realm
    ;;
  *)
    echo "Invalid KEYCLOAK_START_MODE='${KEYCLOAK_START_MODE}'. Use 'dev' or 'prod'." >&2
    exit 1
    ;;
esac
