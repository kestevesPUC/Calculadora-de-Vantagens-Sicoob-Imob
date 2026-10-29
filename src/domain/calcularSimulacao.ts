import type { EntradaSimulacao } from './EntradaSimulacao'
import type { FatoresRateio } from './FatoresRateio'
import type { Parametros } from './Parametros'
import type { ResultadoSimulacao } from './ResultadoSimulacao'

const MESES_NO_ANO = 12

export function calcularSimulacao(
  p: Parametros,
  f: FatoresRateio,
  e: EntradaSimulacao,
): ResultadoSimulacao {
  const saldoMedioDAV = e.faturamentoMensal.times(p.fatorSaldoDepositoVista)
  const valorInvestido = e.faturamentoMensal.times(p.fatorSaldoInvestimentos)
  const premioAbertura = e.condominios.times(p.premioPorCondominio)

  const custoMensalBoletagem = e.boletosMes.times(p.custoBoleto)
  const custoAnualBoletagem = custoMensalBoletagem.times(MESES_NO_ANO)
  const retornoCobranca = custoAnualBoletagem.times(f.fatorCobranca)

  const retornoDAV = saldoMedioDAV.times(f.fatorDAV)
  const retornoInvestimentos = valorInvestido.times(f.fatorINV)
  const remuneracaoCapital = e.capitalSocial.times(e.selic).times(p.percentualSelicContaCapital)

  const totalAnualRecorrente = retornoCobranca
    .plus(retornoDAV)
    .plus(retornoInvestimentos)
    .plus(remuneracaoCapital)

  return {
    saldoMedioDAV,
    valorInvestido,
    premioAbertura,
    custoMensalBoletagem,
    custoAnualBoletagem,
    retornoCobranca,
    retornoDAV,
    retornoInvestimentos,
    remuneracaoCapital,
    totalAnualRecorrente,
    totalPrimeiroAno: totalAnualRecorrente.plus(premioAbertura),
    custoEfetivoBoleto: p.custoBoleto.times(f.fatorCobranca.neg().plus(1)),
    custoAnualManutencao: e.condominios.times(p.tarifaManutencaoMensal).times(MESES_NO_ANO),
  }
}
