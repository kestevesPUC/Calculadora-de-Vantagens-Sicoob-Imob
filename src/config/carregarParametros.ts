import type { Parametros } from '../domain/Parametros'
import { parametrosSchema } from './parametrosSchema'

export type LeitorParametros = () => Promise<unknown>

export class ParametrosInvalidosError extends Error {
  constructor(public readonly detalhes: string[]) {
    super('Parâmetros inválidos')
  }
}

/** Leitor padrão: ponte do Electron (preload) ou fetch, para dev no navegador. */
export const leitorPadrao: LeitorParametros = async () => {
  if (window.sicoob) return window.sicoob.lerParametros()
  const resposta = await fetch('./parametros.json', { cache: 'no-store' })
  if (!resposta.ok) throw new Error(`parametros.json não encontrado (HTTP ${resposta.status})`)
  return resposta.json()
}

export async function carregarParametros(
  ler: LeitorParametros = leitorPadrao,
): Promise<Parametros> {
  let bruto: unknown
  try {
    bruto = await ler()
  } catch (erro) {
    throw new ParametrosInvalidosError([
      erro instanceof Error ? erro.message : 'falha ao ler parametros.json',
    ])
  }
  if (typeof bruto === 'string') {
    try {
      bruto = JSON.parse(bruto)
    } catch {
      throw new ParametrosInvalidosError(['parametros.json não é um JSON válido'])
    }
  }
  const r = parametrosSchema.safeParse(bruto)
  if (!r.success) {
    throw new ParametrosInvalidosError(
      r.error.issues.map((i) => `${i.path.join('.') || 'raiz'}: ${i.message}`),
    )
  }
  return r.data
}
