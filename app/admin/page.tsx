"use client"

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

// Tipos para ajudar o TypeScript (opcional mas profissional)
type Produto = {
  id: string
  nome: string
  descricao: string | null
  preco: number
  categoria_id: number | null
  disponivel: boolean
}

type Categoria = {
  id: number
  nome: string
}

export default function AdminDashboard() {
  // Controle de qual aba está ativa
  const [abaAtiva, setAbaAtiva] = useState<'produtos' | 'categorias' | 'pedidos'>('produtos')

  return (
    <main style={{ padding: '40px', fontFamily: 'Arial, sans-serif', maxWidth: '1200px', margin: '0 auto' }}>
      <h1 style={{ color: '#6F4E37', borderBottom: '2px solid #6F4E37', paddingBottom: '10px' }}>
        ☕ Painel Administrativo
      </h1>

      {/* Navegação de Abas */}
      <div style={{ display: 'flex', gap: '10px', marginTop: '20px', marginBottom: '30px' }}>
        <button
          onClick={() => setAbaAtiva('produtos')}
          style={estiloBotaoAba(abaAtiva === 'produtos')}
        >
          Produtos
        </button>
        <button
          onClick={() => setAbaAtiva('categorias')}
          style={estiloBotaoAba(abaAtiva === 'categorias')}
        >
          Categorias
        </button>
        <button
          onClick={() => setAbaAtiva('pedidos')}
          style={estiloBotaoAba(abaAtiva === 'pedidos')}
        >
          Pedidos
        </button>
      </div>

      {/* Conteúdo de cada aba */}
      {abaAtiva === 'produtos' && <GerenciarProdutos />}
      {abaAtiva === 'categorias' && <GerenciarCategorias />}
      {abaAtiva === 'pedidos' && <GerenciarPedidos />}

      <a href="/" style={{ display: 'block', marginTop: '30px', color: 'blue' }}>
        ← Voltar para o Cardápio
      </a>
    </main>
  )
}

// Estilo para botões de aba
function estiloBotaoAba(ativo: boolean) {
  return {
    padding: '10px 20px',
    backgroundColor: ativo ? '#6F4E37' : '#f0f0f0',
    color: ativo ? 'white' : '#333',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: ativo ? 'bold' : 'normal',
  }
}

// ============================================
// SEÇÃO: GERENCIAR PRODUTOS (CRUD Completo)
// ============================================
function GerenciarProdutos() {
  const [produtos, setProdutos] = useState<Produto[]>([])
  const [categorias, setCategorias] = useState<Categoria[]>([])
  const [form, setForm] = useState({ nome: '', descricao: '', preco: '', categoria_id: '' })
  const [editandoId, setEditandoId] = useState<string | null>(null)
  const [mensagem, setMensagem] = useState('')

  // Carregar dados ao abrir
  useEffect(() => {
    carregarDados()
  }, [])

  async function carregarDados() {
    const { data: produtosData } = await supabase.from('produtos').select('*').order('criado_em', { ascending: false })
    const { data: categoriasData } = await supabase.from('categorias').select('*')
    
    if (produtosData) setProdutos(produtosData)
    if (categoriasData) setCategorias(categoriasData)
  }

  // CREATE - Adicionar novo produto
  async function adicionarProduto(e: React.FormEvent) {
    e.preventDefault()
    const { error } = await supabase.from('produtos').insert([{
      nome: form.nome,
      descricao: form.descricao || null,
      preco: parseFloat(form.preco),
      categoria_id: form.categoria_id ? parseInt(form.categoria_id) : null,
    }])

    if (error) {
      setMensagem('❌ Erro: ' + error.message)
    } else {
      setMensagem('✅ Produto adicionado!')
      setForm({ nome: '', descricao: '', preco: '', categoria_id: '' })
      carregarDados()
    }
    setTimeout(() => setMensagem(''), 3000)
  }

  // UPDATE - Editar produto
  async function salvarEdicao(id: string) {
    const produtoEditado = produtos.find(p => p.id === id)
    if (!produtoEditado) return

    const { error } = await supabase
      .from('produtos')
      .update({
        nome: produtoEditado.nome,
        descricao: produtoEditado.descricao,
        preco: produtoEditado.preco,
        categoria_id: produtoEditado.categoria_id,
      })
      .eq('id', id)

    if (error) {
      setMensagem(' Erro ao editar: ' + error.message)
    } else {
      setMensagem('✅ Produto atualizado!')
      setEditandoId(null)
      carregarDados()
    }
    setTimeout(() => setMensagem(''), 3000)
  }

  // DELETE - Excluir produto
  async function excluirProduto(id: string) {
    if (!confirm('Tem certeza que deseja excluir este produto?')) return

    const { error } = await supabase.from('produtos').delete().eq('id', id)

    if (error) {
      setMensagem('❌ Erro ao excluir: ' + error.message)
    } else {
      setMensagem('🗑️ Produto excluído!')
      carregarDados()
    }
    setTimeout(() => setMensagem(''), 3000)
  }

  return (
    <div>
      <h2 style={{ color: '#6F4E37' }}>📦 Produtos</h2>

      {mensagem && <p style={{ padding: '10px', backgroundColor: '#f0f0f0', borderRadius: '5px' }}>{mensagem}</p>}

      {/* Formulário de Adicionar */}
      <form onSubmit={adicionarProduto} style={{ display: 'grid', gridTemplateColumns: '2fr 2fr 1fr 1fr auto', gap: '10px', marginBottom: '30px', padding: '20px', backgroundColor: '#f9f9f9', borderRadius: '8px' }}>
        <input
          placeholder="Nome do produto"
          value={form.nome}
          onChange={(e) => setForm({ ...form, nome: e.target.value })}
          required
          style={{ padding: '8px' }}
        />
        <input
          placeholder="Descrição"
          value={form.descricao}
          onChange={(e) => setForm({ ...form, descricao: e.target.value })}
          style={{ padding: '8px' }}
        />
        <input
          placeholder="Preço"
          type="number"
          step="0.01"
          value={form.preco}
          onChange={(e) => setForm({ ...form, preco: e.target.value })}
          required
          style={{ padding: '8px' }}
        />
        <select
          value={form.categoria_id}
          onChange={(e) => setForm({ ...form, categoria_id: e.target.value })}
          style={{ padding: '8px' }}
        >
          <option value="">Categoria</option>
          {categorias.map(c => (
            <option key={c.id} value={c.id}>{c.nome}</option>
          ))}
        </select>
        <button type="submit" style={{ padding: '8px 16px', backgroundColor: '#4CAF50', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
          + Adicionar
        </button>
      </form>

      {/* Lista de Produtos */}
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ backgroundColor: '#6F4E37', color: 'white' }}>
            <th style={{ padding: '12px', textAlign: 'left' }}>Nome</th>
            <th style={{ padding: '12px', textAlign: 'left' }}>Descrição</th>
            <th style={{ padding: '12px', textAlign: 'right' }}>Preço</th>
            <th style={{ padding: '12px', textAlign: 'left' }}>Categoria</th>
            <th style={{ padding: '12px', textAlign: 'center' }}>Ações</th>
          </tr>
        </thead>
        <tbody>
          {produtos.map(produto => {
            const categoria = categorias.find(c => c.id === produto.categoria_id)
            const estaEditando = editandoId === produto.id

            return (
              <tr key={produto.id} style={{ borderBottom: '1px solid #ddd' }}>
                <td style={{ padding: '12px' }}>
                  {estaEditando ? (
                    <input
                      value={produto.nome}
                      onChange={(e) => setProdutos(produtos.map(p => p.id === produto.id ? { ...p, nome: e.target.value } : p))}
                      style={{ width: '100%', padding: '5px' }}
                    />
                  ) : produto.nome}
                </td>
                <td style={{ padding: '12px' }}>
                  {estaEditando ? (
                    <input
                      value={produto.descricao || ''}
                      onChange={(e) => setProdutos(produtos.map(p => p.id === produto.id ? { ...p, descricao: e.target.value } : p))}
                      style={{ width: '100%', padding: '5px' }}
                    />
                  ) : produto.descricao}
                </td>
                <td style={{ padding: '12px', textAlign: 'right' }}>
                  {estaEditando ? (
                    <input
                      type="number"
                      step="0.01"
                      value={produto.preco}
                      onChange={(e) => setProdutos(produtos.map(p => p.id === produto.id ? { ...p, preco: parseFloat(e.target.value) } : p))}
                      style={{ width: '80px', padding: '5px', textAlign: 'right' }}
                    />
                  ) : `R$ ${produto.preco.toFixed(2)}`}
                </td>
                <td style={{ padding: '12px' }}>
                  {estaEditando ? (
                    <select
                      value={produto.categoria_id || ''}
                      onChange={(e) => setProdutos(produtos.map(p => p.id === produto.id ? { ...p, categoria_id: e.target.value ? parseInt(e.target.value) : null } : p))}
                      style={{ padding: '5px' }}
                    >
                      <option value="">Nenhuma</option>
                      {categorias.map(c => (
                        <option key={c.id} value={c.id}>{c.nome}</option>
                      ))}
                    </select>
                  ) : categoria?.nome || '-'}
                </td>
                <td style={{ padding: '12px', textAlign: 'center' }}>
                  {estaEditando ? (
                    <>
                      <button onClick={() => salvarEdicao(produto.id)} style={{ padding: '5px 10px', backgroundColor: '#4CAF50', color: 'white', border: 'none', borderRadius: '3px', cursor: 'pointer', marginRight: '5px' }}>
                         Salvar
                      </button>
                      <button onClick={() => setEditandoId(null)} style={{ padding: '5px 10px', backgroundColor: '#999', color: 'white', border: 'none', borderRadius: '3px', cursor: 'pointer' }}>
                        ❌ Cancelar
                      </button>
                    </>
                  ) : (
                    <>
                      <button onClick={() => setEditandoId(produto.id)} style={{ padding: '5px 10px', backgroundColor: '#2196F3', color: 'white', border: 'none', borderRadius: '3px', cursor: 'pointer', marginRight: '5px' }}>
                        ✏️ Editar
                      </button>
                      <button onClick={() => excluirProduto(produto.id)} style={{ padding: '5px 10px', backgroundColor: '#f44336', color: 'white', border: 'none', borderRadius: '3px', cursor: 'pointer' }}>
                        🗑️ Excluir
                      </button>
                    </>
                  )}
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

// ============================================
// SEÇÃO: GERENCIAR CATEGORIAS
// ============================================
function GerenciarCategorias() {
  const [categorias, setCategorias] = useState<Categoria[]>([])
  const [novaCategoria, setNovaCategoria] = useState('')
  const [mensagem, setMensagem] = useState('')

  useEffect(() => {
    carregarCategorias()
  }, [])

  async function carregarCategorias() {
    const { data } = await supabase.from('categorias').select('*').order('id')
    if (data) setCategorias(data)
  }

  async function adicionarCategoria(e: React.FormEvent) {
    e.preventDefault()
    const { error } = await supabase.from('categorias').insert([{ nome: novaCategoria }])

    if (error) {
      setMensagem('❌ Erro: ' + error.message)
    } else {
      setMensagem('✅ Categoria adicionada!')
      setNovaCategoria('')
      carregarCategorias()
    }
    setTimeout(() => setMensagem(''), 3000)
  }

  async function excluirCategoria(id: number) {
    if (!confirm('Excluir esta categoria?')) return
    const { error } = await supabase.from('categorias').delete().eq('id', id)

    if (error) {
      setMensagem('❌ Erro: ' + error.message)
    } else {
      setMensagem('🗑️ Categoria excluída!')
      carregarCategorias()
    }
    setTimeout(() => setMensagem(''), 3000)
  }

  return (
    <div>
      <h2 style={{ color: '#6F4E37' }}>🏷️ Categorias</h2>

      {mensagem && <p style={{ padding: '10px', backgroundColor: '#f0f0f0', borderRadius: '5px' }}>{mensagem}</p>}

      <form onSubmit={adicionarCategoria} style={{ display: 'flex', gap: '10px', marginBottom: '30px', padding: '20px', backgroundColor: '#f9f9f9', borderRadius: '8px' }}>
        <input
          placeholder="Nome da nova categoria"
          value={novaCategoria}
          onChange={(e) => setNovaCategoria(e.target.value)}
          required
          style={{ flex: 1, padding: '8px' }}
        />
        <button type="submit" style={{ padding: '8px 16px', backgroundColor: '#4CAF50', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
          + Adicionar Categoria
        </button>
      </form>

      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ backgroundColor: '#6F4E37', color: 'white' }}>
            <th style={{ padding: '12px', textAlign: 'left' }}>ID</th>
            <th style={{ padding: '12px', textAlign: 'left' }}>Nome</th>
            <th style={{ padding: '12px', textAlign: 'center' }}>Ações</th>
          </tr>
        </thead>
        <tbody>
          {categorias.map(cat => (
            <tr key={cat.id} style={{ borderBottom: '1px solid #ddd' }}>
              <td style={{ padding: '12px' }}>{cat.id}</td>
              <td style={{ padding: '12px' }}>{cat.nome}</td>
              <td style={{ padding: '12px', textAlign: 'center' }}>
                <button onClick={() => excluirCategoria(cat.id)} style={{ padding: '5px 10px', backgroundColor: '#f44336', color: 'white', border: 'none', borderRadius: '3px', cursor: 'pointer' }}>
                  🗑️ Excluir
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

// ============================================
// SEÇÃO: GERENCIAR PEDIDOS (Visualização)
// ============================================
function GerenciarPedidos() {
  const [pedidos, setPedidos] = useState<any[]>([])
  const [mensagem, setMensagem] = useState('')

  useEffect(() => {
    carregarPedidos()
  }, [])

  async function carregarPedidos() {
    const { data } = await supabase
      .from('pedidos')
      .select('*, itens_pedido(quantidade, preco_unitario, observacao_item, produtos(nome))')
      .order('criado_em', { ascending: false })
    
    if (data) setPedidos(data)
  }

  async function atualizarStatus(id: string, novoStatus: string) {
    const { error } = await supabase.from('pedidos').update({ status: novoStatus }).eq('id', id)

    if (error) {
      setMensagem('❌ Erro: ' + error.message)
    } else {
      setMensagem('✅ Status atualizado!')
      carregarPedidos()
    }
    setTimeout(() => setMensagem(''), 3000)
  }

  async function excluirPedido(id: string) {
    if (!confirm('Excluir este pedido? Os itens também serão excluídos.')) return
    const { error } = await supabase.from('pedidos').delete().eq('id', id)

    if (error) {
      setMensagem('❌ Erro: ' + error.message)
    } else {
      setMensagem('🗑️ Pedido excluído!')
      carregarPedidos()
    }
    setTimeout(() => setMensagem(''), 3000)
  }

  return (
    <div>
      <h2 style={{ color: '#6F4E37' }}>📋 Pedidos</h2>

      {mensagem && <p style={{ padding: '10px', backgroundColor: '#f0f0f0', borderRadius: '5px' }}>{mensagem}</p>}

      {pedidos.length === 0 ? (
        <p>Nenhum pedido encontrado.</p>
      ) : (
        pedidos.map(pedido => (
          <div key={pedido.id} style={{ border: '1px solid #ddd', borderRadius: '8px', padding: '20px', marginBottom: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
              <div>
                <strong>Pedido #{pedido.id.slice(0, 8)}</strong>
                <p style={{ margin: '5px 0', color: '#666' }}>
                  Cliente: {pedido.cliente_nome || 'Não informado'} | 
                  Total: R$ {pedido.valor_total?.toFixed(2)} | 
                  Criado em: {new Date(pedido.criado_em).toLocaleString('pt-BR')}
                </p>
                {pedido.observacao && <p style={{ margin: '5px 0', fontStyle: 'italic' }}>Obs: {pedido.observacao}</p>}
              </div>
              <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                <select
                  value={pedido.status}
                  onChange={(e) => atualizarStatus(pedido.id, e.target.value)}
                  style={{ padding: '8px', borderRadius: '5px', border: '1px solid #ddd' }}
                >
                  <option value="pendente">⏳ Pendente</option>
                  <option value="preparando">👨‍🍳 Preparando</option>
                  <option value="pronto">✅ Pronto</option>
                  <option value="entregue">🚀 Entregue</option>
                  <option value="cancelado"> Cancelado</option>
                </select>
                <button onClick={() => excluirPedido(pedido.id)} style={{ padding: '8px 12px', backgroundColor: '#f44336', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
                  🗑️
                </button>
              </div>
            </div>

            {/* Itens do pedido */}
            {pedido.itens_pedido && pedido.itens_pedido.length > 0 && (
              <div style={{ backgroundColor: '#f9f9f9', padding: '15px', borderRadius: '5px' }}>
                <strong>Itens:</strong>
                <ul style={{ margin: '10px 0', paddingLeft: '20px' }}>
                  {pedido.itens_pedido.map((item: any, idx: number) => (
                    <li key={idx}>
                      {item.quantidade}x {item.produtos?.nome || 'Produto removido'} - R$ {item.preco_unitario?.toFixed(2)}
                      {item.observacao_item && <span style={{ color: '#666', fontStyle: 'italic' }}> ({item.observacao_item})</span>}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ))
      )}
    </div>
  )
}