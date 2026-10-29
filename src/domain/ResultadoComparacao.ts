import type Decimal from 'decimal.js'

export interface ResultadoComparacao {
  economiaBoletos: Decimal
  economiaManutencao: Decimal
  ganhoTotalAnualVsBancoAtual: Decimal
}
