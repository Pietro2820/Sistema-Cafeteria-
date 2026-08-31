import { supabase } from '@/lib/supabase'

export type Categoria = {
  id: number
  nome: string
}

export async function criarCategoria(nome: string) {
  const { data, error } = await supabase
    .from('categorias')
    .insert([{ nome }])
    .select()
    .single()

  if (error) throw error
  return data
}

export async function buscarCategorias() {
  const { data, error } = await supabase
    .from('categorias')
    .select('*')
    .order('id')

  if (error) throw error
  return data
}

export async function excluirCategoria(id: number) {
  const { error } = await supabase
    .from('categorias')
    .delete()
    .eq('id', id)

  if (error) throw error
}