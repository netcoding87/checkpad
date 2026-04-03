import { execFile } from 'node:child_process'
import { mkdtemp, readFile, rm } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join, resolve } from 'node:path'
import { promisify } from 'node:util'

const execFileAsync = promisify(execFile)

describe('init-keycloak.sh', () => {
  it('writes a realm import file with the configured super-admin email and profile fields', async () => {
    const importDir = await mkdtemp(join(tmpdir(), 'checkpad-keycloak-'))

    try {
      await execFileAsync('sh', ['keycloak/init-keycloak.sh'], {
        cwd: resolve(__dirname, '..'),
        env: {
          ...process.env,
          KEYCLOAK_ADMIN: 'admin',
          KEYCLOAK_ADMIN_PASSWORD: 'admin',
          KEYCLOAK_APP_CALLBACK_URL:
            'http://localhost:5371/api/auth/oauth2/callback/keycloak',
          KEYCLOAK_APP_ORIGIN: 'http://localhost:5371',
          KEYCLOAK_CLIENT_ID: 'checkpad-web',
          KEYCLOAK_CLIENT_SECRET: 'dev-secret',
          KEYCLOAK_IMPORT_DIR: importDir,
          KEYCLOAK_REALM: 'checkpad',
          KEYCLOAK_SKIP_START: 'true',
          KEYCLOAK_SUPER_ADMIN_EMAIL: 'elite.jet@checkpad.local',
          KEYCLOAK_SUPER_ADMIN_FIRST_NAME: 'Elite',
          KEYCLOAK_SUPER_ADMIN_LAST_NAME: 'Jet',
          KEYCLOAK_SUPER_ADMIN_PASSWORD: '1234test',
          KEYCLOAK_SUPER_ADMIN_USERNAME: 'elite.jet',
        },
      })

      const realmFile = join(importDir, 'checkpad-realm.json')
      const realm = JSON.parse(await readFile(realmFile, 'utf8')) as {
        loginWithEmailAllowed: boolean
        roles: {
          realm: Array<{ name: string }>
        }
        clients: Array<{
          clientId: string
          secret: string
          redirectUris: string[]
          webOrigins: string[]
          attributes: Record<string, string>
          defaultClientScopes: string[]
        }>
        users: Array<{
          email: string
          emailVerified: boolean
          firstName: string
          lastName: string
          username: string
          realmRoles: string[]
        }>
      }

      // Realm-level settings
      expect(realm.loginWithEmailAllowed).toBe(false)

      // Realm roles
      expect(realm.roles.realm.map((r) => r.name)).toContain('super_admin')

      // Client configuration
      expect(realm.clients).toHaveLength(1)
      expect(realm.clients[0]).toMatchObject({
        clientId: 'checkpad-web',
        secret: 'dev-secret',
        redirectUris: expect.arrayContaining([
          'http://localhost:5371/api/auth/oauth2/callback/keycloak',
          'http://localhost:5371/*',
        ]),
        webOrigins: ['http://localhost:5371'],
        attributes: { 'pkce.code.challenge.method': 'S256' },
        defaultClientScopes: expect.arrayContaining([
          'web-origins',
          'profile',
          'roles',
          'email',
        ]),
      })

      // Super-admin user
      expect(realm.users).toHaveLength(1)
      expect(realm.users[0]).toMatchObject({
        email: 'elite.jet@checkpad.local',
        emailVerified: true,
        firstName: 'Elite',
        lastName: 'Jet',
        username: 'elite.jet',
        realmRoles: expect.arrayContaining(['super_admin']),
      })
    } finally {
      await rm(importDir, { force: true, recursive: true })
    }
  })
})