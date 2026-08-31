import { supabase } from '@/lib/supabase'

// Tipo de dados do Produto (Kelly usar no frontend)
export type Produto = {
  id: string
  nome: string
  descricao: string | null
  preco: number
  categoria_id: number | null
  disponivel: boolean
  criado_em?: string
  atualizado_em?: string
}

// CREATE - Adicionar novo produto
export async function criarProduto(produto: Omit<Produto, 'id' | 'criado_em' | 'atualizado_em'>) {
  const { data, error } = await supabase
    .from('produtos')
    .insert([produto])
    .select()
    .single()

  if (error) throw error
  return data
}

// READ - Buscar todos os produtos
export async function buscarProdutos() {
  const { data, error } = await supabase
    .from('produtos')
    .select('*')
    .order('criado_em', { ascending: false })

  if (error) throw error
  return data
}

// READ - Buscar produto por ID
export async function buscarProdutoPorId(id: string) {
  const { data, error } = await supabase
    .from('produtos')
    .select('*')
    .eq('id', id)
    .single()

  if (error) throw error
  return data
}

// UPDATE - Atualizar produto
export async function atualizarProduto(id: string, produto: Partial<Produto>) {
  const { data, error } = await supabase
    .from('produtos')
    .update(produto)
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return data
}

// DELETE - Excluir produto
export async function excluirProduto(id: string) {
  const { error } = await supabase
    .from('produtos')
    .delete()
    .eq('id', id)

  if (error) throw error
}