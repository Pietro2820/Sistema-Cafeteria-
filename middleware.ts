// middleware.ts (raiz do projeto)
import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          )
          supabaseResponse = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // IMPORTANTE: getUser(), não getSession() — valida o token de verdade
  const { data: { user } } = await supabase.auth.getUser()

  const rotasProtegidas = ['/admin', '/cozinha']
  const precisaProtecao = rotasProtegidas.some(rota =>
    request.nextUrl.pathname.startsWith(rota)
  )

  // Sem sessão tentando acessar rota protegida → chuta pro login
  if (precisaProtecao && !user) {
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    return NextResponse.redirect(url)
  }

  // Tem sessão, mas checa se o PAPEL bate com a rota
  if (user) {
    const role = user.user_metadata?.role

    if (request.nextUrl.pathname.startsWith('/admin') && role !== 'admin') {
      const url = request.nextUrl.clone()
      url.pathname = '/login'
      return NextResponse.redirect(url)
    }

    if (request.nextUrl.pathname.startsWith('/cozinha') && role !== 'operario' && role !== 'admin') {
      const url = request.nextUrl.clone()
      url.pathname = '/login'
      return NextResponse.redirect(url)
    }
  }

  return supabaseResponse
}

export const config = {
  matcher: ['/admin/:path*', '/cozinha/:path*'],
}