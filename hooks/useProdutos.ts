import { useState, useEffect } from 'react'
import { Produto, buscarProdutos, criarProduto, atualizarProduto, excluirProduto, uploadImagemProduto } from '@/services/produtos'

export function useProdutos() {
  const [produtos, setProdutos] = useState<Produto[]>([])
  const [carregando, setCarregando] = useState(false)
  const [erro, setErro] = useState<string | null>(null)

  // Carregar produtos
  async function carregar() {
    setCarregando(true)
    setErro(null)
    try {
      const data = await buscarProdutos()
      setProdutos(data)
    } catch (error: any) {
      setErro(error.message)
    } finally {
      setCarregando(false)
    }
  }

  // Adicionar produto
  async function adicionar(produto: Omit<Produto, 'id' | 'criado_em' | 'atualizado_em'>) {
    try {
      await criarProduto(produto)
      await carregar() // Recarrega a lista
    } catch (error: any) {
      throw error
    }
  }

  // Atualizar produto
  async function atualizar(id: string, produto: Partial<Produto>) {
    try {
      await atualizarProduto(id, produto)
      await carregar()
    } catch (error: any) {
      throw error
    }
  }

  // Excluir produto
  async function excluir(id: string) {
    try {
      await excluirProduto(id)
      await carregar()
    } catch (error: any) {
      throw error
    }
  }

  // Enviar foto (NOVO) - devolve a URL pública pra UI usar como quiser
  // (ex: incluir no objeto antes de chamar adicionar/atualizar)
  async function enviarImagem(file: File) {
    try {
      return await uploadImagemProduto(file)
    } catch (error: any) {
      throw error
    }
  }

  // Carregar ao montar o componente
  useEffect(() => {
    carregar()
  }, [])

  return {
    produtos,
    carregando,
    erro,
    adicionar,
    atualizar,
    excluir,
    enviarImagem,
    recarregar: carregar
  }
}