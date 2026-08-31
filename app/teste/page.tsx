"use client"

import { useProdutos } from '@/hooks/useProdutos'
import { useCategorias } from '@/hooks/useCategorias'
import { usePedidos } from '@/hooks/usePedidos'
import { useState } from 'react'

export default function TestPage() {
  const [abaAtiva, setAbaAtiva] = useState<'produtos' | 'categorias' | 'pedidos'>('produtos')

  return (
    <main style={{ padding: '40px', fontFamily: 'Arial', maxWidth: '1200px', margin: '0 auto' }}>
      <h1>🧪 Página de Teste - Hooks</h1>

      <div style={{ display: 'flex', gap: '10px', marginBottom: '30px' }}>
        <button onClick={() => setAbaAtiva('produtos')} style={btnStyle(abaAtiva === 'produtos')}>
          Testar Produtos
        </button>
        <button onClick={() => setAbaAtiva('categorias')} style={btnStyle(abaAtiva === 'categorias')}>
          Testar Categorias
        </button>
        <button onClick={() => setAbaAtiva('pedidos')} style={btnStyle(abaAtiva === 'pedidos')}>
          Testar Pedidos
        </button>
      </div>

      {abaAtiva === 'produtos' && <TesteProdutos />}
      {abaAtiva === 'categorias' && <TesteCategorias />}
      {abaAtiva === 'pedidos' && <TestePedidos />}
    </main>
  )
}

function btnStyle(ativo: boolean) {
  return {
    padding: '10px 20px',
    backgroundColor: ativo ? '#6F4E37' : '#f0f0f0',
    color: ativo ? 'white' : '#333',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
  }
}

// ============================================
// TESTE: PRODUTOS
// ============================================
function TesteProdutos() {
  const { produtos, carregando, erro, adicionar, atualizar, excluir } = useProdutos()
  const [form, setForm] = useState({ nome: '', preco: '' })

  if (carregando) return <p>Carregando produtos...</p>
  if (erro) return <p style={{ color: 'red' }}>Erro: {erro}</p>

  async function handleAdicionar(e: React.FormEvent) {
    e.preventDefault()
    try {
      await adicionar({
        nome: form.nome,
        preco: parseFloat(form.preco),
        descricao: null,
        categoria_id: null,
        disponivel: true,
      })
      setForm({ nome: '', preco: '' })
      alert('✅ Produto adicionado!')
    } catch (error: any) {
      alert(' Erro: ' + error.message)
    }
  }

  async function handleEditar(id: string) {
    const novoNome = prompt('Novo nome:')
    if (novoNome) {
      try {
        await atualizar(id, { nome: novoNome })
        alert('✅ Produto atualizado!')
      } catch (error: any) {
        alert('❌ Erro: ' + error.message)
      }
    }
  }

  async function handleExcluir(id: string) {
    if (confirm('Excluir este produto?')) {
      try {
        await excluir(id)
        alert('🗑️ Produto excluído!')
      } catch (error: any) {
        alert('❌ Erro: ' + error.message)
      }
    }
  }

  return (
    <div>
      <h2>Produtos ({produtos.length})</h2>

      <form onSubmit={handleAdicionar} style={{ marginBottom: '20px', padding: '15px', backgroundColor: '#f9f9f9', borderRadius: '5px' }}>
        <h3>Adicionar Produto</h3>
        <input
          placeholder="Nome"
          value={form.nome}
          onChange={(e) => setForm({ ...form, nome: e.target.value })}
          required
          style={{ padding: '8px', marginRight: '10px' }}
        />
        <input
          placeholder="Preço"
          type="number"
          step="0.01"
          value={form.preco}
          onChange={(e) => setForm({ ...form, preco: e.target.value })}
          required
          style={{ padding: '8px', marginRight: '10px' }}
        />
        <button type="submit" style={{ padding: '8px 16px', backgroundColor: '#4CAF50', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
          Adicionar
        </button>
      </form>

      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ backgroundColor: '#6F4E37', color: 'white' }}>
            <th style={{ padding: '12px', textAlign: 'left' }}>Nome</th>
            <th style={{ padding: '12px', textAlign: 'right' }}>Preço</th>
            <th style={{ padding: '12px', textAlign: 'center' }}>Ações</th>
          </tr>
        </thead>
        <tbody>
          {produtos.map(produto => (
            <tr key={produto.id} style={{ borderBottom: '1px solid #ddd' }}>
              <td style={{ padding: '12px' }}>{produto.nome}</td>
              <td style={{ padding: '12px', textAlign: 'right' }}>R$ {produto.preco.toFixed(2)}</td>
              <td style={{ padding: '12px', textAlign: 'center' }}>
                <button onClick={() => handleEditar(produto.id)} style={{ padding: '5px 10px', backgroundColor: '#2196F3', color: 'white', border: 'none', borderRadius: '3px', cursor: 'pointer', marginRight: '5px' }}>
                  Editar
                </button>
                <button onClick={() => handleExcluir(produto.id)} style={{ padding: '5px 10px', backgroundColor: '#f44336', color: 'white', border: 'none', borderRadius: '3px', cursor: 'pointer' }}>
                  Excluir
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
// TESTE: CATEGORIAS
// ============================================
function TesteCategorias() {
  const { categorias, carregando, erro, adicionar, excluir } = useCategorias()
  const [nome, setNome] = useState('')

  if (carregando) return <p>Carregando categorias...</p>
  if (erro) return <p style={{ color: 'red' }}>Erro: {erro}</p>

  async function handleAdicionar(e: React.FormEvent) {
    e.preventDefault()
    try {
      await adicionar(nome)
      setNome('')
      alert('✅ Categoria adicionada!')
    } catch (error: any) {
      alert('❌ Erro: ' + error.message)
    }
  }

  async function handleExcluir(id: number) {
    if (confirm('Excluir esta categoria?')) {
      try {
        await excluir(id)
        alert('️ Categoria excluída!')
      } catch (error: any) {
        alert(' Erro: ' + error.message)
      }
    }
  }

  return (
    <div>
      <h2>Categorias ({categorias.length})</h2>

      <form onSubmit={handleAdicionar} style={{ marginBottom: '20px', padding: '15px', backgroundColor: '#f9f9f9', borderRadius: '5px' }}>
        <h3>Adicionar Categoria</h3>
        <input
          placeholder="Nome da categoria"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          required
          style={{ padding: '8px', marginRight: '10px' }}
        />
        <button type="submit" style={{ padding: '8px 16px', backgroundColor: '#4CAF50', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
          Adicionar
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
                <button onClick={() => handleExcluir(cat.id)} style={{ padding: '5px 10px', backgroundColor: '#f44336', color: 'white', border: 'none', borderRadius: '3px', cursor: 'pointer' }}>
                  Excluir
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
// TESTE: PEDIDOS
// ============================================
function TestePedidos() {
  const { pedidos, carregando, erro, atualizarStatus, excluir } = usePedidos()

  if (carregando) return <p>Carregando pedidos...</p>
  if (erro) return <p style={{ color: 'red' }}>Erro: {erro}</p>

  async function handleStatus(id: string, status: string) {
    try {
      await atualizarStatus(id, status)
      alert('✅ Status atualizado!')
    } catch (error: any) {
      alert('❌ Erro: ' + error.message)
    }
  }

  async function handleExcluir(id: string) {
    if (confirm('Excluir este pedido?')) {
      try {
        await excluir(id)
        alert('🗑️ Pedido excluído!')
      } catch (error: any) {
        alert('❌ Erro: ' + error.message)
      }
    }
  }

  return (
    <div>
      <h2>Pedidos ({pedidos.length})</h2>

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
                  Criado: {new Date(pedido.criado_em).toLocaleString('pt-BR')}
                </p>
              </div>
              <div style={{ display: 'flex', gap: '10px' }}>
                <select
                  value={pedido.status}
                  onChange={(e) => handleStatus(pedido.id, e.target.value)}
                  style={{ padding: '8px', borderRadius: '5px', border: '1px solid #ddd' }}
                >
                  <option value="pendente">⏳ Pendente</option>
                  <option value="preparando">👨‍🍳 Preparando</option>
                  <option value="pronto">✅ Pronto</option>
                  <option value="entregue">🚀 Entregue</option>
                  <option value="cancelado">❌ Cancelado</option>
                </select>
                <button onClick={() => handleExcluir(pedido.id)} style={{ padding: '8px 12px', backgroundColor: '#f44336', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
                  🗑️
                </button>
              </div>
            </div>

            {pedido.itens_pedido && pedido.itens_pedido.length > 0 && (
              <div style={{ backgroundColor: '#f9f9f9', padding: '15px', borderRadius: '5px' }}>
                <strong>Itens:</strong>
                <ul style={{ margin: '10px 0', paddingLeft: '20px' }}>
                  {pedido.itens_pedido.map((item: any, idx: number) => (
                    <li key={idx}>
                      {item.quantidade}x {item.produtos?.nome || 'Produto removido'} - R$ {item.preco_unitario?.toFixed(2)}
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