import type { VercelRequest, VercelResponse } from '@vercel/node'
import { leadsHandler } from './_lib/handlers.js'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const result = await leadsHandler(
    process.env,
    req.method || 'GET',
    req.query as Record<string, string | undefined>,
    req.body,
    req.headers as Record<string, any>
  )
  res.status(result.status).json(result.body)
}
