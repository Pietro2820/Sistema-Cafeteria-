import { supabase } from '@/lib/supabase'

export type Pedido = {
  id: string
  cliente_nome: string | null
  status: string
  valor_total: number
  observacao: string | null
  criado_em: string
  atualizado_em: string
  itens_pedido?: ItemPedido[]
}

export type ItemPedido = {
  id: string
  pedido_id: string
  produto_id: string
  quantidade: number
  preco_unitario: number
  observacao_item: string | null
  produtos?: {
    nome: string
  }
}

// CREATE - Criar novo pedido
export async function criarPedido(pedido: {
  cliente_nome?: string
  observacao?: string
  itens: {
    produto_id: string
    quantidade: number
    preco_unitario: number
    observacao_item?: string
  }[]
}) {
  // 1. Calcular valor total
  const valor_total = pedido.itens.reduce((total, item) => {
    return total + (item.preco_unitario * item.quantidade)
  }, 0)

  // 2. Criar o pedido
  const { data: pedidoData, error: pedidoError } = await supabase
    .from('pedidos')
    .insert([{
      cliente_nome: pedido.cliente_nome || null,
      observacao: pedido.observacao || null,
      valor_total
    }])
    .select()
    .single()

  if (pedidoError) throw pedidoError

  // 3. Adicionar os itens
  const itensComPedidoId = pedido.itens.map(item => ({
    ...item,
    pedido_id: pedidoData.id
  }))

  const { error: itensError } = await supabase
    .from('itens_pedido')
    .insert(itensComPedidoId)

  if (itensError) throw itensError

  return pedidoData
}

// READ - Buscar todos os pedidos com itens
export async function buscarPedidos() {
  const { data, error } = await supabase
    .from('pedidos')
    .select(`
      *,
      itens_pedido (
        *,
        produtos (nome)
      )
    `)
    .order('criado_em', { ascending: false })

  if (error) throw error
  return data
}

// UPDATE - Atualizar status do pedido
export async function atualizarStatusPedido(id: string, status: string) {
  const { data, error } = await supabase
    .from('pedidos')
    .update({ status })
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return data
}

// DELETE - Excluir pedido (itens são excluídos automaticamente por cascade)
export async function excluirPedido(id: string) {
  const { error } = await supabase
    .from('pedidos')
    .delete()
    .eq('id', id)

  if (error) throw error
}