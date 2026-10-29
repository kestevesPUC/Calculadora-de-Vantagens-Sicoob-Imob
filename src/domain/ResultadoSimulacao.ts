import type Decimal from 'decimal.js'

export interface ResultadoSimulacao {
  saldoMedioDAV: Decimal
  valorInvestido: Decimal
  premioAbertura: Decimal
  custoMensalBoletagem: Decimal
  custoAnualBoletagem: Decimal
  retornoCobranca: Decimal
  retornoDAV: Decimal
  retornoInvestimentos: Decimal
  remuneracaoCapital: Decimal
  totalAnualRecorrente: Decimal
  totalPrimeiroAno: Decimal
  custoEfetivoBoleto: Decimal
  custoAnualManutencao: Decimal
}
