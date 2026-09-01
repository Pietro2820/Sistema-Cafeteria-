import { createClient } from '@/lib/supabase/client'
const supabase = createClient()

// Tipo de dados do Produto (Kelly usa no frontend)
export type Produto = {
  id: string
  nome: string
  descricao: string | null
  preco: number
  categoria_id: number | null
  disponivel: boolean
  estoque: number
  avaliacao: number
  imagem_url: string | null    // NOVO — URL pública da foto no Storage
  criado_em?: string
  atualizado_em?: string
}

// UPLOAD - Enviar uma foto pro bucket "produtos" e devolver a URL pública
//
// Gera um nome de arquivo único (UUID) em vez de usar o nome original,
// por dois motivos:
//  1. Evita dois produtos diferentes sobrescreverem a foto um do outro
//     (ex: dois arquivos chamados "foto.jpg")
//  2. Ao CRIAR um produto novo, ele ainda não tem `id` no banco no
//     momento em que a foto é escolhida — então não dá pra usar o
//     id do produto como nome do arquivo ainda.
export async function uploadImagemProduto(file: File) {
  const extensao = file.name.split('.').pop()
  const nomeArquivo = `${crypto.randomUUID()}.${extensao}`

  const { error: uploadError } = await supabase.storage
    .from('produtos')
    .upload(nomeArquivo, file)

  if (uploadError) throw uploadError

  // getPublicUrl não faz chamada de rede — só monta a URL a partir
  // do nome do arquivo, porque o bucket já é público (RLS de storage)
  const { data } = supabase.storage
    .from('produtos')
    .getPublicUrl(nomeArquivo)

  return data.publicUrl
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