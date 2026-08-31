import { useState, useEffect } from 'react'
import { ResumoDiario, ProdutoVendido, buscarResumoDoDia, buscarTopProdutos } from '@/services/analytics'

export function useAnalytics() {
  const [resumo, setResumo] = useState<ResumoDiario | null>(null)
  const [topProdutos, setTopProdutos] = useState<ProdutoVendido[]>([])
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState<string | null>(null)

  async function carregarDados() {
    setCarregando(true)
    setErro(null)
    try {
      // Dispara as duas buscas ao mesmo tempo para ser mais rápido (Promise.all)
      const [dadosResumo, dadosTop] = await Promise.all([
        buscarResumoDoDia(),
        buscarTopProdutos(5)
      ])

      setResumo(dadosResumo)
      setTopProdutos(dadosTop)
    } catch (error: any) {
      setErro(error.message)
    } finally {
      setCarregando(false)
    }
  }

  useEffect(() => {
    carregarDados()
  }, [])

  return {
    resumo,
    topProdutos,
    carregando,
    erro,
    recarregar: carregarDados
  }
}