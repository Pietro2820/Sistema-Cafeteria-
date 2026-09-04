import { createClient } from '@/lib/supabase/client'
const supabase = createClient()

// Tipo de dados do Cliente (Kelly usa no frontend)
export type Cliente = {
  id: string
  cpf: string
  nome: string
  auth_user_id: string | null
  numero_de_telefone: string | null
  criado_em: string
  atualizado_em: string
}

// Tipo "resumido" devolvido pela busca por CPF — só o que a função
// buscar_cliente_por_cpf() expõe (nunca a linha inteira da tabela)
export type ClienteResumo = {
  id: string
  nome: string
  numero_de_telefone: string | null
}

// READ - Buscar cliente pelo CPF
//
// Não consulta a tabela `clientes` diretamente — chama uma função do
// banco (RPC) rodando com SECURITY DEFINER. Isso é necessário porque o
// RLS de `clientes` exige `auth_user_id = auth.uid()`, o que nunca é
// verdadeiro pra um cliente anônimo do totem (auth.uid() é null pra
// ele). A função contorna isso com segurança: só devolve o que bate
// exatamente com o CPF informado, nunca a tabela inteira.
//
// Retorna `null` se não encontrar (CPF novo, ainda não cadastrado).
export async function buscarClientePorCpf(cpf: string) {
  const { data, error } = await supabase
    .rpc('buscar_cliente_por_cpf', { cpf_busca: cpf })

  if (error) throw error
  // A função retorna uma tabela (lista) — pegamos a primeira linha, se existir
  return (data && data.length > 0 ? data[0] : null) as ClienteResumo | null
}

// SALVAR - Cria OU atualiza o cliente, de forma atômica (via RPC).
//
// Chamada só na CONFIRMAÇÃO FINAL do pedido, nunca antes disso — assim
// nenhum cliente "fantasma" (sem pedido de verdade) fica salvo no banco
// caso a pessoa desista no meio do fluxo.
//
// Como usa `INSERT ... ON CONFLICT (cpf) DO UPDATE` dentro da função do
// banco, não existe mais risco de "duplicate key": não importa se o
// CPF já existia ou não, a função decide sozinha, de forma atômica
// (protegido contra dois pedidos concorrentes com o mesmo CPF).
export async function salvarCliente({
  cpf,
  nome,
  numero_de_telefone,
}: {
  cpf: string
  nome: string
  numero_de_telefone?: string
}) {
  const { data, error } = await supabase
    .rpc('salvar_cliente_autoatendimento', {
      cpf_input: cpf,
      nome_input: nome,
      telefone_input: numero_de_telefone || null,
    })

  if (error) throw error
  // A função devolve só o `id` (uuid) do cliente salvo
  return { id: data as string }
}