import type { VercelRequest, VercelResponse } from '@vercel/node'
import { uploadHandler } from './_lib/handlers.js'

export const config = {
  api: {
    bodyParser: { sizeLimit: '8mb' },
  },
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Método no permitido' })
    return
  }
  const result = await uploadHandler(process.env, req.body)
  res.status(result.status).json(result.body)
}
