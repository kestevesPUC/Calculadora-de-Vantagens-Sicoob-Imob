import type Decimal from 'decimal.js'

export interface EntradaSimulacao {
  nomeAdministradora: string
  condominios: Decimal
  boletosMes: Decimal
  faturamentoMensal: Decimal
  capitalSocial: Decimal
  /** Fração anual (0,15 = 15%). */
  selic: Decimal
  tarifaBoletoAtual?: Decimal
  tarifaManutencaoAtual?: Decimal
}
