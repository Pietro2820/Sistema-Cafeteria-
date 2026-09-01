import { createClient } from '@/lib/supabase/client'
const supabase = createClient()

export type Pedido = {
  id: string
  numero_pedido: number
  cliente_nome: string | null
  cliente_id: string | null
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
//
// Esse pedido pode vir de DOIS CAMINHOS diferentes, dependendo se o
// cliente informou CPF ou não no início do autoatendimento:
//
//   CAMINHO A (com CPF): o cliente já foi identificado/cadastrado em
//   `clientes` ANTES de chegar aqui (ver services/clientes.ts,
//   função `salvarCliente`). Nesse caso, quem chama essa função
//   já tem o `cliente_id` (o id da tabela `clientes`) em mãos.
//
//   CAMINHO B (sem CPF): o cliente pulou a identificação e só
//   digitou o nome na tela final. Nesse caso, `cliente_id` vem
//   `undefined`, e só temos o texto solto em `cliente_nome`.
//
// A função abaixo aceita os dois formatos ao mesmo tempo — ela não
// decide qual caminho foi usado, só grava o que recebeu. Quem decide
// qual caminho seguir é a TELA (React), não o service.
export async function criarPedido(pedido: {
  cliente_nome?: string   // usado nos dois caminhos (nome de exibição)
  cliente_id?: string     // só vem preenchido no CAMINHO A (com CPF)
  observacao?: string
  itens: {
    produto_id: string
    quantidade: number
    preco_unitario: number
    observacao_item?: string
  }[]
}) {
  // 1. Calcular valor total a partir dos itens do carrinho
  const valor_total = pedido.itens.reduce((total, item) => {
    return total + (item.preco_unitario * item.quantidade)
  }, 0)

  // 2. Criar o pedido em si.
  //    Repare: NÃO enviamos `numero_pedido` aqui — ele é gerado
  //    sozinho pelo banco (trigger `trg_numero_pedido`), então nem
  //    tentamos calcular isso no JavaScript.
  const { data: pedidoData, error: pedidoError } = await supabase
    .from('pedidos')
    .insert([{
      cliente_nome: pedido.cliente_nome || null,
      // CAMINHO A: cliente_id vem preenchido -> pedido fica vinculado
      //            ao registro em `clientes` (histórico, futuro delivery).
      // CAMINHO B: cliente_id vem undefined -> vira `null` -> pedido
      //            "avulso", sem vínculo com nenhum cliente cadastrado.
      cliente_id: pedido.cliente_id || null,
      observacao: pedido.observacao || null,
      valor_total,
    }])
    .select()
    .single()

  if (pedidoError) throw pedidoError

  // 3. Adicionar os itens do pedido (sem mudança nos dois caminhos)
  const itensComPedidoId = pedido.itens.map(item => ({
    ...item,
    pedido_id: pedidoData.id,
  }))

  const { error: itensError } = await supabase
    .from('itens_pedido')
    .insert(itensComPedidoId)

  if (itensError) throw itensError

  // pedidoData já vem com `numero_pedido` preenchido pela trigger do banco
  return pedidoData as Pedido
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
  return data as Pedido[]
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
  return data as Pedido
}

// DELETE - Excluir pedido (itens são excluídos automaticamente por cascade)
export async function excluirPedido(id: string) {
  const { error } = await supabase
    .from('pedidos')
    .delete()
    .eq('id', id)

  if (error) throw error
}