import type { VercelRequest, VercelResponse } from '@vercel/node'
import { pushHandler } from './_lib/push.js'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const result = await pushHandler(
    process.env,
    req.method || 'GET',
    req.body,
    req.headers as Record<string, any>
  )
  res.status(result.status).json(result.body)
}
