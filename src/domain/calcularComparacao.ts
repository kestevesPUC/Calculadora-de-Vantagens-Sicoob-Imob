import { Decimal } from './decimal'
import type { EntradaSimulacao } from './EntradaSimulacao'
import type { Parametros } from './Parametros'
import type { ResultadoComparacao } from './ResultadoComparacao'
import type { ResultadoSimulacao } from './ResultadoSimulacao'

const MESES_NO_ANO = 12

// HIPÓTESE: D4 — com só um campo preenchido, a economia do outro conta como zero (comparação parcial).
export function calcularComparacao(
  p: Parametros,
  r: ResultadoSimulacao,
  e: EntradaSimulacao,
): ResultadoComparacao | null {
  if (!e.tarifaBoletoAtual && !e.tarifaManutencaoAtual) return null

  const economiaBoletos = e.tarifaBoletoAtual
    ? e.tarifaBoletoAtual.minus(p.custoBoleto).times(e.boletosMes).times(MESES_NO_ANO)
    : new Decimal(0)
  const economiaManutencao = e.tarifaManutencaoAtual
    ? e.tarifaManutencaoAtual
        .minus(p.tarifaManutencaoMensal)
        .times(e.condominios)
        .times(MESES_NO_ANO)
    : new Decimal(0)

  return {
    economiaBoletos,
    economiaManutencao,
    ganhoTotalAnualVsBancoAtual: r.totalAnualRecorrente
      .plus(economiaBoletos)
      .plus(economiaManutencao),
  }
}
