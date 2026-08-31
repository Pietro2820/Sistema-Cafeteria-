import { useState, useEffect } from 'react'
import { Pedido, buscarPedidos, criarPedido, atualizarStatusPedido, excluirPedido } from '@/services/pedidos'

export function usePedidos() {
  const [pedidos, setPedidos] = useState<Pedido[]>([])
  const [carregando, setCarregando] = useState(false)
  const [erro, setErro] = useState<string | null>(null)

  async function carregar() {
    setCarregando(true)
    setErro(null)
    try {
      const data = await buscarPedidos()
      setPedidos(data)
    } catch (error: any) {
      setErro(error.message)
    } finally {
      setCarregando(false)
    }
  }

  async function criar(pedido: {
    cliente_nome?: string
    observacao?: string
    itens: {
      produto_id: string
      quantidade: number
      preco_unitario: number
      observacao_item?: string
    }[]
  }) {
    try {
      await criarPedido(pedido)
      await carregar()
    } catch (error: any) {
      throw error
    }
  }

  async function atualizarStatus(id: string, status: string) {
    try {
      await atualizarStatusPedido(id, status)
      await carregar()
    } catch (error: any) {
      throw error
    }
  }

  async function excluir(id: string) {
    try {
      await excluirPedido(id)
      await carregar()
    } catch (error: any) {
      throw error
    }
  }

  useEffect(() => {
    carregar()
  }, [])

  return {
    pedidos,
    carregando,
    erro,
    criar,
    atualizarStatus,
    excluir,
    recarregar: carregar
  }
}