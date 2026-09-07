import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function createClient(options?: { rememberSession?: boolean }) {
  const cookieStore = await cookies()
  const rememberSession = options?.rememberSession ?? true

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options: cookieOptions }) => {
              const finalOptions = rememberSession
                ? cookieOptions
                : { ...cookieOptions, maxAge: undefined, expires: undefined }
              cookieStore.set(name, value, finalOptions)
            })
          } catch {
            // Chamado de um Server Component — não pode setar cookie aqui.
            // Sem problema: o middleware cuida de renovar a sessão.
          }
        },
      },
    }
  )
}