import { useState } from 'react'
import { ClienteResumo, buscarClientePorCpf, salvarCliente } from '@/services/clientes'

// Esse hook não carrega uma lista ao montar (diferente de useProdutos, etc.)
// porque não existe uma "lista de clientes" pra mostrar no autoatendimento —
// só consultas pontuais por CPF, uma de cada vez.
export function useClientes() {
  const [carregando, setCarregando] = useState(false)
  const [erro, setErro] = useState<string | null>(null)

  async function buscarPorCpf(cpf: string): Promise<ClienteResumo | null> {
    setCarregando(true)
    setErro(null)
    try {
      return await buscarClientePorCpf(cpf)
    } catch (error: any) {
      setErro(error.message)
      throw error
    } finally {
      setCarregando(false)
    }
  }

  async function salvar(dados: { cpf: string; nome: string; numero_de_telefone?: string }) {
    setCarregando(true)
    setErro(null)
    try {
      return await salvarCliente(dados)
    } catch (error: any) {
      setErro(error.message)
      throw error
    } finally {
      setCarregando(false)
    }
  }

  return { buscarPorCpf, salvar, carregando, erro }
}