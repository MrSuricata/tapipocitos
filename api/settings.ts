import type { VercelRequest, VercelResponse } from '@vercel/node'
import { settingsHandler } from './_lib/handlers.js'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const result = await settingsHandler(
    process.env,
    req.method || 'GET',
    req.body,
    req.headers as Record<string, any>
  )
  res.status(result.status).json(result.body)
}
