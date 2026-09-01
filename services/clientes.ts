import { createClient } from '@/lib/supabase/client'
const supabase = createClient()

// Tipo de dados do Cliente (Kelly usa no frontend)
export type Cliente = {
  id: string
  cpf: string
  nome: string
  auth_user_id: string | null
  criado_em: string
  atualizado_em: string
}

// READ - Buscar cliente pelo CPF
// Retorna null se não encontrar (CPF novo, ainda não cadastrado)
export async function buscarClientePorCpf(cpf: string) {
  const { data, error } = await supabase
    .from('clientes')
    .select('*')
    .eq('cpf', cpf)
    .maybeSingle() // não lança erro se não encontrar nenhuma linha (diferente de .single())

  if (error) throw error
  return data as Cliente | null
}

// CREATE - Cadastrar um cliente novo (primeira vez que esse CPF aparece)
export async function criarCliente(cliente: { cpf: string; nome: string }) {
  const { data, error } = await supabase
    .from('clientes')
    .insert([cliente])
    .select()
    .single()

  if (error) throw error
  return data as Cliente
}

// UPDATE - Atualizar o nome de um cliente existente
// Usado quando a pessoa edita o nome puxado automaticamente pelo CPF
export async function atualizarNomeCliente(id: string, nome: string) {
  const { data, error } = await supabase
    .from('clientes')
    .update({ nome, atualizado_em: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return data as Cliente
}

// FLUXO COMPLETO - Chamada só na CONFIRMAÇÃO FINAL do pedido, nunca antes disso.
// Se veio um `id` (CPF já existia quando buscamos no início), atualiza o nome
// (caso a pessoa tenha editado). Se não veio `id` (CPF era novo), cria o cliente
// agora, com o nome que ela confirmou.
// Assim, nenhum cliente "fantasma" (sem pedido de verdade) fica salvo no banco
// caso a pessoa desista no meio do fluxo.
export async function salvarCliente({
  id,
  cpf,
  nome,
}: {
  id?: string
  cpf: string
  nome: string
}) {
  if (id) {
    return atualizarNomeCliente(id, nome)
  }

  return criarCliente({ cpf, nome })
}