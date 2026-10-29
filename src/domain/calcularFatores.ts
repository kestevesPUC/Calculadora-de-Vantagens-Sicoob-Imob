import type Decimal from 'decimal.js'
import type { FatoresRateio } from './FatoresRateio'
import type { Parametros } from './Parametros'

export function calcularFatores(p: Parametros): FatoresRateio {
  const montanteDistribuivel = p.resultadoProjetado.times(p.percentualDistribuicao)
  const montante = (peso: Decimal) => montanteDistribuivel.times(peso)

  return {
    montanteDistribuivel,
    fatorDAV: montante(p.pesosRateio.depositoVista).div(p.basesCooperativa.depositoVista),
    fatorINV: montante(p.pesosRateio.investimentos).div(p.basesCooperativa.investimentos),
    fatorCobranca: montante(p.pesosRateio.cobranca).div(p.basesCooperativa.receitaCobranca),
  }
}
