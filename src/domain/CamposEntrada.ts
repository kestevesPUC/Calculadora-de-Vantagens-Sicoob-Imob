/** Texto bruto digitado pelo gerente, antes da validação. */
export interface CamposEntrada {
  nomeAdministradora: string
  condominios: string
  boletosMes: string
  faturamentoMensal: string
  capitalSocial: string
  /** Percentual anual como digitado (15 = 15%). */
  selic: string
  tarifaBoletoAtual: string
  tarifaManutencaoAtual: string
}

export type NomeCampo = Exclude<keyof CamposEntrada, 'nomeAdministradora'>

export type ErrosEntrada = Partial<Record<NomeCampo, string>>
