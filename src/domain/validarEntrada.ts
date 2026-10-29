import type { CamposEntrada, ErrosEntrada, NomeCampo } from './CamposEntrada'
import type { EntradaSimulacao } from './EntradaSimulacao'
import { Decimal } from './decimal'
import { lerNumeroBR } from './lerNumeroBR'

export type ResultadoValidacao =
  | { valida: true; entrada: EntradaSimulacao }
  | { valida: false; erros: ErrosEntrada }

const OBRIGATORIOS: NomeCampo[] = [
  'condominios',
  'boletosMes',
  'faturamentoMensal',
  'capitalSocial',
  'selic',
]
const INTEIROS: NomeCampo[] = ['condominios', 'boletosMes']
const OPCIONAIS: NomeCampo[] = ['tarifaBoletoAtual', 'tarifaManutencaoAtual']

export const MENSAGEM_OBRIGATORIO = 'Campo obrigatório'
export const MENSAGEM_NUMERO = 'Digite um número maior ou igual a zero'
export const MENSAGEM_INTEIRO = 'Digite um número inteiro'

function lerCampo(campos: CamposEntrada, nome: NomeCampo): Decimal | string {
  const texto = campos[nome]
  const valor = lerNumeroBR(texto)
  if (!valor) return MENSAGEM_NUMERO
  if (INTEIROS.includes(nome) && !valor.isInteger()) return MENSAGEM_INTEIRO
  return valor
}

/** RN09: qualquer entrada obrigatória vazia ou inválida bloqueia os resultados. */
export function validarEntrada(campos: CamposEntrada): ResultadoValidacao {
  const erros: ErrosEntrada = {}
  const valores: Partial<Record<NomeCampo, Decimal>> = {}

  for (const nome of [...OBRIGATORIOS, ...OPCIONAIS]) {
    const vazio = campos[nome].trim() === ''
    if (vazio) {
      if (OBRIGATORIOS.includes(nome)) erros[nome] = MENSAGEM_OBRIGATORIO
      continue
    }
    const lido = lerCampo(campos, nome)
    if (typeof lido === 'string') erros[nome] = lido
    else valores[nome] = lido
  }

  if (Object.keys(erros).length > 0) return { valida: false, erros }

  const v = valores as Record<NomeCampo, Decimal>
  return {
    valida: true,
    entrada: {
      nomeAdministradora: campos.nomeAdministradora.trim(),
      condominios: v.condominios,
      boletosMes: v.boletosMes,
      faturamentoMensal: v.faturamentoMensal,
      capitalSocial: v.capitalSocial,
      selic: v.selic.div(new Decimal(100)),
      tarifaBoletoAtual: valores.tarifaBoletoAtual,
      tarifaManutencaoAtual: valores.tarifaManutencaoAtual,
    },
  }
}
