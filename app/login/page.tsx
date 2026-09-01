// app/login/page.tsx
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [erro, setErro] = useState<string | null>(null)
  const [carregando, setCarregando] = useState(false)

  const router = useRouter()
  const supabase = createClient()

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setErro(null)
    setCarregando(true)

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password: senha,
    })

    if (error) {
      setErro('Email ou senha incorretos.')
      setCarregando(false)
      return
    }

    // Redireciona conforme o papel do usuário
    const role = data.user?.user_metadata?.role

    if (role === 'admin') {
      router.push('/admin')
    } else if (role === 'operario') {
      router.push('/cozinha')
    } else {
      router.push('/')
    }

    router.refresh() // força o middleware a reler a sessão nova
  }

  return (
    <main className="login-container">
      <form onSubmit={handleLogin} className="login-card">
        <h1>Entrar</h1>

        {erro && <p className="login-erro" role="alert">{erro}</p>}

        <label htmlFor="email">Email</label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <label htmlFor="senha">Senha</label>
        <input
          id="senha"
          type="password"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
          required
        />

        <button type="submit" disabled={carregando}>
          {carregando ? 'Entrando...' : 'Entrar'}
        </button>
      </form>
    </main>
  )
}