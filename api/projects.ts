import { createClient } from '@supabase/supabase-js'
import type { VercelRequest, VercelResponse } from '@vercel/node'

const supabase = createClient(
  process.env.VITE_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

function setCors(res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  setCors(res)

  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }

  try {
    switch (req.method) {
      case 'GET': {
        const { data, error } = await supabase
          .from('projects')
          .select('*')
          .order('created_at', { ascending: false })

        if (error) throw error
        return res.status(200).json(data)
      }

      case 'POST': {
        const { title, description, ...rest } = req.body

        if (!title) {
          return res.status(400).json({ error: 'title is required' })
        }

        const { data, error } = await supabase
          .from('projects')
          .insert({ title, description, ...rest })
          .select()
          .single()

        if (error) throw error
        return res.status(201).json(data)
      }

      case 'PUT': {
        const { id, ...updates } = req.body

        if (!id) {
          return res.status(400).json({ error: 'id is required' })
        }

        const { data, error } = await supabase
          .from('projects')
          .update(updates)
          .eq('id', id)
          .select()
          .single()

        if (error) throw error
        return res.status(200).json(data)
      }

      case 'DELETE': {
        const id = req.query.id as string

        if (!id) {
          return res.status(400).json({ error: 'id query parameter is required' })
        }

        const { error } = await supabase
          .from('projects')
          .delete()
          .eq('id', id)

        if (error) throw error
        return res.status(200).json({ success: true })
      }

      default:
        return res.status(405).json({ error: 'Method not allowed' })
    }
  } catch (error: any) {
    console.error('Projects API error:', error)
    return res.status(500).json({ error: error.message || 'Internal server error' })
  }
}
