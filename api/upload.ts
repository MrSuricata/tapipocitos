import { createClient } from '@supabase/supabase-js'
import type { VercelRequest, VercelResponse } from '@vercel/node'

const supabase = createClient(
  process.env.VITE_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const BUCKET = 'tapipocitos-images'

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
    const { base64, filename } = req.body

    if (!base64 || !filename) {
      return res.status(400).json({ error: 'base64 and filename are required' })
    }

    // Extract content type from base64 data URI if present
    let contentType = 'image/png'
    let cleanBase64 = base64

    if (base64.startsWith('data:')) {
      const match = base64.match(/^data:([^;]+);base64,(.+)$/)
      if (match) {
        contentType = match[1]
        cleanBase64 = match[2]
      }
    }

    const buffer = Buffer.from(cleanBase64, 'base64')

    const filePath = `${Date.now()}-${filename}`

    const { error: uploadError } = await supabase.storage
      .from(BUCKET)
      .upload(filePath, buffer, {
        contentType,
        upsert: false,
      })

    if (uploadError) throw uploadError

    const { data: urlData } = supabase.storage
      .from(BUCKET)
      .getPublicUrl(filePath)

    return res.status(200).json({ url: urlData.publicUrl })
  } catch (error: any) {
    console.error('Upload API error:', error)
    return res.status(500).json({ error: error.message || 'Internal server error' })
  }
}
