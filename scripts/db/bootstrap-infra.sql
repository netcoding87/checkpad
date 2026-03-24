\set QUIET 1

-- Create runtime roles when missing.
SELECT format('CREATE ROLE %I LOGIN PASSWORD %L', :'app_db_user', :'app_db_password')
WHERE NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = :'app_db_user')
\gexec

SELECT format('CREATE ROLE %I LOGIN PASSWORD %L', :'keycloak_db_user', :'keycloak_db_password')
WHERE NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = :'keycloak_db_user')
\gexec

-- Keep passwords aligned with environment values.
SELECT format('ALTER ROLE %I LOGIN PASSWORD %L', :'app_db_user', :'app_db_password')
\gexec

-- ElectricSQL requires REPLICATION to start WAL sender sessions.
SELECT format('ALTER ROLE %I WITH REPLICATION', :'app_db_user')
\gexec

SELECT format('ALTER ROLE %I LOGIN PASSWORD %L', :'keycloak_db_user', :'keycloak_db_password')
\gexec

-- Create databases only when missing.
SELECT format('CREATE DATABASE %I OWNER %I', :'app_db_name', :'app_db_user')
WHERE NOT EXISTS (SELECT 1 FROM pg_database WHERE datname = :'app_db_name')
\gexec

SELECT format('CREATE DATABASE %I OWNER %I', :'keycloak_db_name', :'keycloak_db_user')
WHERE NOT EXISTS (SELECT 1 FROM pg_database WHERE datname = :'keycloak_db_name')
\gexec

-- Ensure runtime roles can connect and own their DBs.
SELECT format('ALTER DATABASE %I OWNER TO %I', :'app_db_name', :'app_db_user')
\gexec
SELECT format('GRANT CONNECT ON DATABASE %I TO %I', :'app_db_name', :'app_db_user')
\gexec

SELECT format('ALTER DATABASE %I OWNER TO %I', :'keycloak_db_name', :'keycloak_db_user')
\gexec
SELECT format('GRANT CONNECT ON DATABASE %I TO %I', :'keycloak_db_name', :'keycloak_db_user')
\gexec
