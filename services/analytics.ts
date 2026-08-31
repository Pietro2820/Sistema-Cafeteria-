import { supabase } from '@/lib/supabase'

export type ResumoDiario = {
  faturamento: number
  totalPedidos: number
  ticketMedio: number
}

export type ProdutoVendido = {
  produto_id: string
  nome: string
  totalVendido: number
  faturamentoGerado: number
}

// 1. RELATÓRIO DO DIA
export async function buscarResumoDoDia() {
  const hoje = new Date().toISOString().split('T')[0]
  
  const { data, error } = await supabase
    .from('pedidos')
    .select('valor_total, status')
    .gte('criado_em', `${hoje}T00:00:00`) 
    .lt('criado_em', `${hoje}T23:59:59`)  
    .neq('status', 'cancelado')           

  if (error) throw error

  if (!data || data.length === 0) {
    return { faturamento: 0, totalPedidos: 0, ticketMedio: 0 }
  }

  const faturamento = data.reduce((acc, pedido) => acc + pedido.valor_total, 0)
  const totalPedidos = data.length
  const ticketMedio = faturamento / totalPedidos

  return { faturamento, totalPedidos, ticketMedio }
}

// 2. TOP PRODUTOS MAIS VENDIDOS
export async function buscarTopProdutos(limite = 5) {
  // AQUI ESTÁ O SEGREDO: Adicionamos 'pedidos (status)' no select!
  const { data, error } = await supabase
    .from('itens_pedido')
    .select(`
      produto_id,
      quantidade,
      preco_unitario,
      produtos (nome),
      pedidos (status) 
    `)
    .neq('pedidos.status', 'cancelado') 

  if (error) throw error

  const mapaProdutos: Record<string, ProdutoVendido> = {}

  data?.forEach((item: any) => {
    const id = item.produto_id
    const nome = item.produtos?.nome || 'Produto Removido'

    if (!mapaProdutos[id]) {
      mapaProdutos[id] = {
        produto_id: id,
        nome,
        totalVendido: 0,
        faturamentoGerado: 0
      }
    }

    mapaProdutos[id].totalVendido += item.quantidade
    mapaProdutos[id].faturamentoGerado += (item.quantidade * item.preco_unitario)
  })

  const ranking = Object.values(mapaProdutos)
    .sort((a, b) => b.totalVendido - a.totalVendido)
    .slice(0, limite)

  return ranking
}