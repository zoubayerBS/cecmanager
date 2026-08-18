import { createClient, type Session } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseKey)

export async function login(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password })
  if (error) throw error
  return data
}

export async function register(email: string, password: string, name: string) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { name } },
  })
  if (error) throw error
  return data
}

export async function logout() {
  await supabase.auth.signOut()
}

export async function isLoggedIn(): Promise<boolean> {
  try {
    const timeout = new Promise<boolean>((r) => setTimeout(() => r(false), 3000))
    const check = (async () => {
      const { data } = await supabase.auth.getSession()
      return !!data.session
    })()
    return await Promise.race([check, timeout])
  } catch {
    return false
  }
}

export async function getCurrentUser() {
  try {
    const { data } = await supabase.auth.getUser()
    return data.user
  } catch {
    return null
  }
}

export function onAuthChange(callback: (session: Session | null) => void) {
  return supabase.auth.onAuthStateChange((_event, session) => {
    callback(session)
  })
}