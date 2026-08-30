"use client" // 👈 Isso diz ao Next.js: "Este componente roda no navegador do cliente"

import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

export default function AdminCadastro() {
  // 1. Estados para guardar o que o usuário digita
  const [nome, setNome] = useState('')
  const [descricao, setDescricao] = useState('')
  const [preco, setPreco] = useState('')
  const [categoriaId, setCategoriaId] = useState('')
  const [mensagem, setMensagem] = useState('')

  const router = useRouter()

  // 2. Função que roda quando o formulário é enviado
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault() // Evita que a página recarregue

    // Converte o preço de texto para número
    const precoNumerico = parseFloat(preco)
    const categoriaNumerica = parseInt(categoriaId)

    // 3. Envia para o Supabase
    const { error } = await supabase
      .from('produtos')
      .insert([
        {
          nome: nome,
          descricao: descricao,
          preco: precoNumerico,
          categoria_id: categoriaNumerica
        }
      ])

    // 4. Verifica se deu certo
    if (error) {
      setMensagem('❌ Erro ao cadastrar: ' + error.message)
    } else {
      setMensagem('✅ Produto cadastrado com sucesso!')
      
      // Limpa os campos
      setNome('')
      setDescricao('')
      setPreco('')
      setCategoriaId('')
      
      // Atualiza a página para mostrar o novo produto (se quiser)
      router.refresh()
    }
  }

  // 5. O HTML do formulário
  return (
    <main style={{ padding: '40px', fontFamily: 'Arial, sans-serif', maxWidth: '600px', margin: '0 auto' }}>
      <h1 style={{ color: '#6F4E37' }}>☕ Cadastrar Novo Produto</h1>
      
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        
        <div>
          <label htmlFor="nome">Nome do Produto:</label>
          <input
            id="nome"
            type="text"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            required
            style={{ width: '100%', padding: '8px', marginTop: '5px' }}
          />
        </div>

        <div>
          <label htmlFor="descricao">Descrição:</label>
          <textarea
            id="descricao"
            value={descricao}
            onChange={(e) => setDescricao(e.target.value)}
            style={{ width: '100%', padding: '8px', marginTop: '5px', minHeight: '80px' }}
          />
        </div>

        <div>
          <label htmlFor="preco">Preço (R$):</label>
          <input
            id="preco"
            type="number"
            step="0.01"
            value={preco}
            onChange={(e) => setPreco(e.target.value)}
            required
            style={{ width: '100%', padding: '8px', marginTop: '5px' }}
          />
        </div>

        <div>
          <label htmlFor="categoria">Categoria:</label>
          <select
            id="categoria"
            value={categoriaId}
            onChange={(e) => setCategoriaId(e.target.value)}
            required
            style={{ width: '100%', padding: '8px', marginTop: '5px' }}
          >
            <option value="">Selecione uma categoria</option>
            <option value="1">Cafés Quentes</option>
            <option value="2">Doces</option>
          </select>
        </div>

        <button 
          type="submit" 
          style={{ 
            padding: '12px', 
            backgroundColor: '#6F4E37', 
            color: 'white', 
            border: 'none', 
            borderRadius: '5px', 
            cursor: 'pointer',
            fontSize: '16px'
          }}
        >
          Cadastrar Produto
        </button>
      </form>

      {mensagem && (
        <p style={{ marginTop: '20px', fontWeight: 'bold' }}>{mensagem}</p>
      )}

      <a href="/" style={{ display: 'block', marginTop: '30px', color: 'blue' }}>
        ← Voltar para o Cardápio
      </a>
    </main>
  )
}