"use client"

import { useState, useEffect } from 'react'
import { useProdutos } from '@/hooks/useProdutos'
import { useCategorias } from '@/hooks/useCategorias'
import { usePedidos } from '@/hooks/usePedidos'
import { useAnalytics } from '@/hooks/useAnalytics' // 👈 NOVO: Import do Analytics

export default function TestPage() {
  // 👈 ADICIONADO: 'analytics' nas opções de aba
  const [abaAtiva, setAbaAtiva] = useState<'produtos' | 'categorias' | 'pedidos' | 'analytics'>('analytics')
  
  // 👈 NOVO: Chamando o hook de Analytics
  const { resumo, topProdutos, carregando: carregandoAnalytics, erro: erroAnalytics } = useAnalytics()

  // 👈 NOVO: Console.log para você ver os dados no F12 do navegador
  useEffect(() => {
    if (!carregandoAnalytics && !erroAnalytics && resumo) {
      console.log("📊 RESUMO DO DIA:", resumo)
      console.log("🏆 TOP PRODUTOS:", topProdutos)
    }
  }, [resumo, topProdutos, carregandoAnalytics, erroAnalytics])

  return (
    <main style={{ padding: '40px', fontFamily: 'Arial', maxWidth: '1200px', margin: '0 auto' }}>
      <h1>🧪 Página de Teste - Hooks</h1>

      <div style={{ display: 'flex', gap: '10px', marginBottom: '30px', flexWrap: 'wrap' }}>
        <button onClick={() => setAbaAtiva('produtos')} style={btnStyle(abaAtiva === 'produtos')}>
          Testar Produtos
        </button>
        <button onClick={() => setAbaAtiva('categorias')} style={btnStyle(abaAtiva === 'categorias')}>
          Testar Categorias
        </button>
        <button onClick={() => setAbaAtiva('pedidos')} style={btnStyle(abaAtiva === 'pedidos')}>
          Testar Pedidos
        </button>
        {/* 👈 NOVO: Botão da aba Analytics */}
        <button onClick={() => setAbaAtiva('analytics')} style={btnStyle(abaAtiva === 'analytics')}>
          📊 Testar Analytics
        </button>
      </div>

      {abaAtiva === 'produtos' && <TesteProdutos />}
      {abaAtiva === 'categorias' && <TesteCategorias />}
      {abaAtiva === 'pedidos' && <TestePedidos />}
      {abaAtiva === 'analytics' && <TesteAnalytics resumo={resumo} topProdutos={topProdutos} carregando={carregandoAnalytics} erro={erroAnalytics} />}
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
// NOVO: COMPONENTE DE TESTE DE ANALYTICS
// ============================================
function TesteAnalytics({ resumo, topProdutos, carregando, erro }: any) {
  if (carregando) return <p>Carregando dados do dashboard...</p>
  if (erro) return <p style={{ color: 'red' }}>Erro ao carregar analytics: {erro}</p>

  return (
    <div>
      <h2>📊 Dashboard do Dia</h2>
      
      {/* Cards de Resumo */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '40px' }}>
        <div style={{ padding: '20px', backgroundColor: '#e8f5e9', borderRadius: '8px', border: '1px solid #4CAF50' }}>
          <h3 style={{ margin: 0, color: '#2e7d32' }}>Faturamento</h3>
          <p style={{ fontSize: '24px', fontWeight: 'bold', margin: '10px 0 0 0' }}>
            R$ {resumo?.faturamento.toFixed(2)}
          </p>
        </div>
        
        <div style={{ padding: '20px', backgroundColor: '#e3f2fd', borderRadius: '8px', border: '1px solid #2196F3' }}>
          <h3 style={{ margin: 0, color: '#1565c0' }}>Total de Pedidos</h3>
          <p style={{ fontSize: '24px', fontWeight: 'bold', margin: '10px 0 0 0' }}>
            {resumo?.totalPedidos}
          </p>
        </div>

        <div style={{ padding: '20px', backgroundColor: '#fff3e0', borderRadius: '8px', border: '1px solid #ff9800' }}>
          <h3 style={{ margin: 0, color: '#e65100' }}>Ticket Médio</h3>
          <p style={{ fontSize: '24px', fontWeight: 'bold', margin: '10px 0 0 0' }}>
            R$ {resumo?.ticketMedio.toFixed(2)}
          </p>
        </div>
      </div>

      {/* Tabela de Top Produtos */}
      <h3>🏆 Top 5 Produtos Mais Vendidos</h3>
      {topProdutos.length === 0 ? (
        <p>Nenhuma venda registrada hoje.</p>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '10px' }}>
          <thead>
            <tr style={{ backgroundColor: '#6F4E37', color: 'white' }}>
              <th style={{ padding: '12px', textAlign: 'left' }}>Produto</th>
              <th style={{ padding: '12px', textAlign: 'center' }}>Qtd. Vendida</th>
              <th style={{ padding: '12px', textAlign: 'right' }}>Faturamento Gerado</th>
            </tr>
          </thead>
          <tbody>
            {topProdutos.map((item: any, index: number) => (
              <tr key={item.produto_id} style={{ borderBottom: '1px solid #ddd' }}>
                <td style={{ padding: '12px' }}>
                  <span style={{ fontWeight: 'bold', marginRight: '10px' }}>#{index + 1}</span>
                  {item.nome}
                </td>
                <td style={{ padding: '12px', textAlign: 'center' }}>{item.totalVendido}x</td>
                <td style={{ padding: '12px', textAlign: 'right', color: '#4CAF50', fontWeight: 'bold' }}>
                  R$ {item.faturamentoGerado.toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}

// ============================================
// TESTE: PRODUTOS (Com Disponibilidade)
// ============================================
function TesteProdutos() {
  const { produtos, carregando, erro, adicionar, atualizar, excluir } = useProdutos()
  const [form, setForm] = useState({ nome: '', preco: '', disponivel: true })

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
        disponivel: form.disponivel, // 👈 Envia o status de disponibilidade
      })
      setForm({ nome: '', preco: '', disponivel: true })
      alert('✅ Produto adicionado!')
    } catch (error: any) {
      alert('❌ Erro: ' + error.message)
    }
  }

  // 👈 NOVA FUNÇÃO: Alternar disponibilidade com 1 clique
  async function toggleDisponivel(id: string, statusAtual: boolean) {
    try {
      await atualizar(id, { disponivel: !statusAtual })
    } catch (error: any) {
      alert('❌ Erro: ' + error.message)
    }
  }

  return (
    <div>
      <h2>Produtos ({produtos.length})</h2>

      <form onSubmit={handleAdicionar} style={{ marginBottom: '20px', padding: '15px', backgroundColor: '#f9f9f9', borderRadius: '5px' }}>
        <h3>Adicionar Produto</h3>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '10px' }}>
          <input
            placeholder="Nome"
            value={form.nome}
            onChange={(e) => setForm({ ...form, nome: e.target.value })}
            required
            style={{ flex: 2, padding: '8px' }}
          />
          <input
            placeholder="Preço"
            type="number"
            step="0.01"
            value={form.preco}
            onChange={(e) => setForm({ ...form, preco: e.target.value })}
            required
            style={{ flex: 1, padding: '8px' }}
          />
          <label style={{ display: 'flex', alignItems: 'center', gap: '5px', cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={form.disponivel}
              onChange={(e) => setForm({ ...form, disponivel: e.target.checked })}
              style={{ width: '18px', height: '18px' }}
            />
            Disponível
          </label>
          <button type="submit" style={{ padding: '8px 16px', backgroundColor: '#4CAF50', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
            Adicionar
          </button>
        </div>
      </form>

      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ backgroundColor: '#6F4E37', color: 'white' }}>
            <th style={{ padding: '12px', textAlign: 'left' }}>Nome</th>
            <th style={{ padding: '12px', textAlign: 'right' }}>Preço</th>
            <th style={{ padding: '12px', textAlign: 'center' }}>Status</th>
            <th style={{ padding: '12px', textAlign: 'center' }}>Ações</th>
          </tr>
        </thead>
        <tbody>
          {produtos.map(produto => (
            <tr key={produto.id} style={{ borderBottom: '1px solid #ddd', opacity: produto.disponivel ? 1 : 0.5 }}>
              <td style={{ padding: '12px' }}>{produto.nome}</td>
              <td style={{ padding: '12px', textAlign: 'right' }}>R$ {produto.preco.toFixed(2)}</td>
              <td style={{ padding: '12px', textAlign: 'center' }}>
                <span style={{ 
                  padding: '4px 8px', 
                  borderRadius: '12px', 
                  fontSize: '12px', 
                  fontWeight: 'bold',
                  backgroundColor: produto.disponivel ? '#e8f5e9' : '#ffebee',
                  color: produto.disponivel ? '#2e7d32' : '#c62828'
                }}>
                  {produto.disponivel ? '✅ Disponível' : '❌ Esgotado'}
                </span>
              </td>
              <td style={{ padding: '12px', textAlign: 'center' }}>
                <button 
                  onClick={() => toggleDisponivel(produto.id, produto.disponivel)} 
                  style={{ padding: '5px 10px', backgroundColor: '#FF9800', color: 'white', border: 'none', borderRadius: '3px', cursor: 'pointer', marginRight: '5px', fontSize: '12px' }}
                >
                  {produto.disponivel ? 'Marcar Esgotado' : 'Marcar Disponível'}
                </button>
                <button onClick={() => excluir(produto.id)} style={{ padding: '5px 10px', backgroundColor: '#f44336', color: 'white', border: 'none', borderRadius: '3px', cursor: 'pointer', fontSize: '12px' }}>
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
// TESTE: CATEGORIAS (Mantido igual)
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
        alert('🗑️ Categoria excluída!')
      } catch (error: any) {
        alert('❌ Erro: ' + error.message)
      }
    }
  }

  return (
    <div>
      <h2>Categorias ({categorias.length})</h2>
      <form onSubmit={handleAdicionar} style={{ marginBottom: '20px', padding: '15px', backgroundColor: '#f9f9f9', borderRadius: '5px' }}>
        <h3>Adicionar Categoria</h3>
        <input placeholder="Nome da categoria" value={nome} onChange={(e) => setNome(e.target.value)} required style={{ padding: '8px', marginRight: '10px' }} />
        <button type="submit" style={{ padding: '8px 16px', backgroundColor: '#4CAF50', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>Adicionar</button>
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
                <button onClick={() => handleExcluir(cat.id)} style={{ padding: '5px 10px', backgroundColor: '#f44336', color: 'white', border: 'none', borderRadius: '3px', cursor: 'pointer' }}>Excluir</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

// ============================================
// TESTE: PEDIDOS (Mantido igual)
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
                <select value={pedido.status} onChange={(e) => handleStatus(pedido.id, e.target.value)} style={{ padding: '8px', borderRadius: '5px', border: '1px solid #ddd' }}>
                  <option value="pendente">⏳ Pendente</option>
                  <option value="preparando">👨‍🍳 Preparando</option>
                  <option value="pronto">✅ Pronto</option>
                  <option value="entregue">🚀 Entregue</option>
                  <option value="cancelado">❌ Cancelado</option>
                </select>
                <button onClick={() => handleExcluir(pedido.id)} style={{ padding: '8px 12px', backgroundColor: '#f44336', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>🗑️</button>
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