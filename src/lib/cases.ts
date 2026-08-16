import { supabase } from './supabase'
import type { CaseData } from '../store/useWorkflowStore'

export async function fetchCases(): Promise<CaseData[]> {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return []

  const { data, error } = await supabase
    .from('cases')
    .select('data')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  if (error) throw error
  return (data || []).map((row) => row.data as CaseData)
}

export async function saveCaseToDB(caseData: CaseData): Promise<void> {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  const { error } = await supabase
    .from('cases')
    .upsert(
      { id: caseData.id, user_id: user.id, data: caseData },
      { onConflict: 'id' }
    )

  if (error) throw error
}

export async function deleteCaseFromDB(id: string): Promise<void> {
  const { error } = await supabase
    .from('cases')
    .delete()
    .eq('id', id)

  if (error) throw error
}