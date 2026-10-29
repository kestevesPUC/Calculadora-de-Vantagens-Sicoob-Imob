import type Decimal from 'decimal.js'

export interface Parametros {
  vigencia: string
  resultadoProjetado: Decimal
  percentualDistribuicao: Decimal
  pesosRateio: {
    depositoVista: Decimal
    investimentos: Decimal
    cobranca: Decimal
    credito: Decimal
  }
  basesCooperativa: {
    depositoVista: Decimal
    investimentos: Decimal
    receitaCobranca: Decimal
  }
  fatorSaldoDepositoVista: Decimal
  fatorSaldoInvestimentos: Decimal
  custoBoleto: Decimal
  tarifaManutencaoMensal: Decimal
  premioPorCondominio: Decimal
  percentualSelicContaCapital: Decimal
  selicPadrao: Decimal
  textoAviso: string
}
