import type { VercelRequest, VercelResponse } from '@vercel/node'
import { notifyDueHandler } from './_lib/push.js'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const result = await notifyDueHandler(process.env, req.headers as Record<string, any>)
  res.status(result.status).json(result.body)
}
