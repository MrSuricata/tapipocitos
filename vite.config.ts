import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react-swc";
import { defineConfig, loadEnv, type Plugin } from "vite";
import { resolve } from 'path'
import {
  resourceHandler,
  uploadHandler,
  authHandler,
  leadsHandler,
  agendaHandler,
  isValidTable,
  type Env,
} from './api/_lib/handlers'

const projectRoot = process.env.PROJECT_ROOT || import.meta.dirname

function readJsonBody(req: any): Promise<any> {
  return new Promise((resolveBody) => {
    let raw = ''
    req.on('data', (chunk: any) => {
      raw += chunk
    })
    req.on('end', () => {
      if (!raw) return resolveBody(undefined)
      try {
        resolveBody(JSON.parse(raw))
      } catch {
        resolveBody(undefined)
      }
    })
    req.on('error', () => resolveBody(undefined))
  })
}

// Serves /api/* locally under `npm run dev` using the SAME handlers that run on
// Vercel, so local behaviour matches production.
function devApiPlugin(env: Env): Plugin {
  return {
    name: 'tapipocitos-dev-api',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        const url = req.url || ''
        if (!url.startsWith('/api/')) return next()

        const parsed = new URL(url, 'http://localhost')
        const resource = parsed.pathname.replace(/^\/api\//, '').split('/')[0]
        const query = Object.fromEntries(parsed.searchParams) as Record<string, string | undefined>
        const method = req.method || 'GET'
        const body = method === 'GET' ? undefined : await readJsonBody(req)

        let result: { status: number; body: unknown }
        try {
          if (resource === 'upload') {
            result = await uploadHandler(env, body)
          } else if (resource === 'auth') {
            result = authHandler(env, body)
          } else if (resource === 'leads') {
            result = await leadsHandler(env, method, query, body, req.headers as any)
          } else if (resource === 'agenda') {
            result = await agendaHandler(env, method, query, body, req.headers as any)
          } else if (isValidTable(resource)) {
            result = await resourceHandler(env, resource, method, query, body)
          } else {
            result = { status: 404, body: { error: 'No encontrado' } }
          }
        } catch (e: any) {
          result = { status: 500, body: { error: e?.message || 'Error del servidor' } }
        }

        res.statusCode = result.status
        res.setHeader('Content-Type', 'application/json')
        res.end(JSON.stringify(result.body))
      })
    },
  }
}

export default defineConfig(({ mode }) => {
  // Load ALL env vars (including non-VITE_ ones like SUPABASE_SERVICE_ROLE_KEY
  // and ADMIN_PASSWORD). These are only used server-side inside devApiPlugin —
  // they are NOT exposed to client code.
  const env = loadEnv(mode, projectRoot, '') as Env

  return {
    plugins: [
      react(),
      tailwindcss(),
      devApiPlugin(env),
    ],
    server: {
      port: 5000,
      host: true,
    },
    resolve: {
      alias: {
        '@': resolve(projectRoot, 'src'),
      },
    },
  }
})
