import type { VercelRequest, VercelResponse } from '@vercel/node'
import { leadsHandler } from './_lib/handlers.js'
import { notifyNewLead } from './_lib/push.js'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const result = await leadsHandler(
    process.env,
    req.method || 'GET',
    req.query as Record<string, string | undefined>,
    req.body,
    req.headers as Record<string, any>
  )
  // Consulta nueva → push al celular del taller (antes de responder: en
  // serverless no hay "después de responder").
  if (req.method === 'POST' && result.status === 201) {
    await notifyNewLead(process.env, result.body)
  }
  res.status(result.status).json(result.body)
}
