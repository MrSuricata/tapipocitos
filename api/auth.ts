import type { VercelRequest, VercelResponse } from '@vercel/node'

function setCors(res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  setCors(res)

  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { password } = req.body

    if (!password) {
      return res.status(400).json({ error: 'password is required' })
    }

    const adminPassword = process.env.ADMIN_PASSWORD

    if (!adminPassword) {
      console.error('ADMIN_PASSWORD env var is not set')
      return res.status(500).json({ error: 'Server configuration error' })
    }

    const success = password === adminPassword

    return res.status(200).json({ success })
  } catch (error: any) {
    console.error('Auth API error:', error)
    return res.status(500).json({ error: error.message || 'Internal server error' })
  }
}
