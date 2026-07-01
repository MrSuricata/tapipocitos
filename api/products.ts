import type { VercelRequest, VercelResponse } from '@vercel/node'
import { resourceHandler } from './_lib/handlers.js'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const result = await resourceHandler(
    process.env,
    'products',
    req.method || 'GET',
    req.query as Record<string, string | undefined>,
    req.body
  )
  res.status(result.status).json(result.body)
}
