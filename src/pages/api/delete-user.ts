// /pages/api/delete-user.ts
import type { NextApiRequest, NextApiResponse } from 'next'
import { createClient } from '@supabase/supabase-js'

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! // Service Role Key – only for secure backend usage
)

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { user_id } = req.body

  if (!user_id) {
    return res.status(400).json({ error: 'Missing user_id in body' })
  }

  const { error } = await supabaseAdmin.auth.admin.deleteUser(user_id)

  if (error) {
    console.error('❌ Supabase deletion error:', error)
    return res.status(500).json({ error: error.message })
  }

  return res.status(200).json({ message: 'User deleted from Auth' })
}
