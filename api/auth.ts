import type { VercelRequest, VercelResponse } from '@vercel/node'
import { authHandler } from './_lib/handlers'

export default function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Método no permitido' })
    return
  }
  const result = authHandler(process.env, req.body)
  res.status(result.status).json(result.body)
}
