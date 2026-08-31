import { useState, useEffect } from 'react'
import { Categoria, buscarCategorias, criarCategoria, excluirCategoria } from '@/services/categorias'

export function useCategorias() {
  const [categorias, setCategorias] = useState<Categoria[]>([])
  const [carregando, setCarregando] = useState(false)
  const [erro, setErro] = useState<string | null>(null)

  async function carregar() {
    setCarregando(true)
    setErro(null)
    try {
      const data = await buscarCategorias()
      setCategorias(data)
    } catch (error: any) {
      setErro(error.message)
    } finally {
      setCarregando(false)
    }
  }

  async function adicionar(nome: string) {
    try {
      await criarCategoria(nome)
      await carregar()
    } catch (error: any) {
      throw error
    }
  }

  async function excluir(id: number) {
    try {
      await excluirCategoria(id)
      await carregar()
    } catch (error: any) {
      throw error
    }
  }

  useEffect(() => {
    carregar()
  }, [])

  return {
    categorias,
    carregando,
    erro,
    adicionar,
    excluir,
    recarregar: carregar
  }
}