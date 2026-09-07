'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'
import { createClient } from '@/lib/supabase/server'

export async function login(email: string, password: string, remember: boolean) {
  const supabase = await createClient({ rememberSession: remember })

  const { error } = await supabase.auth.signInWithPassword({ email, password })

  if (error) {
    return { error: 'E-mail ou senha incorretos.' }
  }

  const cookieStore = await cookies()
  cookieStore.set('remember-session', remember ? 'true' : 'false', {
    httpOnly: true,
    sameSite: 'lax',
    path: '/',
  })

  revalidatePath('/', 'layout')
  redirect('/admin')
}