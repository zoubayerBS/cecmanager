import { supabase } from '../lib/supabase'
import { RapportCECSchema, type RapportCEC } from './types'
import { logger } from '../lib/logger'

export async function loadRapports(): Promise<RapportCEC[]> {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return []

  const { data, error } = await supabase
    .from('rapports')
    .select('data')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  if (error) {
    logger.error('Failed to load rapports', error)
    return []
  }

  return (data || [])
    .map((row) => {
      const result = RapportCECSchema.safeParse(row.data)
      return result.success ? result.data : null
    })
    .filter((r): r is RapportCEC => r !== null)
}

export async function saveRapport(rapport: RapportCEC): Promise<boolean> {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return false

  const { error } = await supabase
    .from('rapports')
    .upsert(
      { id: rapport.id, user_id: user.id, data: rapport },
      { onConflict: 'id' }
    )

  if (error) {
    logger.error('Failed to save rapport', error)
    return false
  }
  return true
}

export async function deleteRapport(id: string): Promise<boolean> {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return false

  const { error } = await supabase
    .from('rapports')
    .delete()
    .eq('id', id)
    .eq('user_id', user.id)

  if (error) {
    logger.error('Failed to delete rapport', error)
    return false
  }
  return true
}

export async function getRapport(id: string): Promise<RapportCEC | null> {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const { data, error } = await supabase
    .from('rapports')
    .select('data')
    .eq('id', id)
    .eq('user_id', user.id)
    .single()

  if (error || !data) return null

  const result = RapportCECSchema.safeParse(data.data)
  return result.success ? result.data : null
}