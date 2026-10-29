import { Decimal } from './decimal'
import type { Parametros } from './Parametros'
import type { EntradaSimulacao } from './EntradaSimulacao'

const d = (v: string) => new Decimal(v)

export const parametrosIniciais: Parametros = {
  vigencia: '2026-01-01',
  resultadoProjetado: d('15500000.00'),
  percentualDistribuicao: d('0.12'),
  pesosRateio: {
    depositoVista: d('0.40'),
    investimentos: d('0.25'),
    cobranca: d('0.20'),
    credito: d('0.15'),
  },
  basesCooperativa: {
    depositoVista: d('102559246.79'),
    investimentos: d('359016883.85'),
    receitaCobranca: d('4339523.32'),
  },
  fatorSaldoDepositoVista: d('0.0913'),
  fatorSaldoInvestimentos: d('0.0960'),
  custoBoleto: d('1.70'),
  tarifaManutencaoMensal: d('50.00'),
  premioPorCondominio: d('50.00'),
  percentualSelicContaCapital: d('1.00'),
  selicPadrao: d('0.15'),
  textoAviso: 'Aviso de teste.',
}

export const entradaCasoA: EntradaSimulacao = {
  nomeAdministradora: 'Administradora A',
  condominios: d('40'),
  boletosMes: d('2000'),
  faturamentoMensal: d('500000'),
  capitalSocial: d('20000'),
  selic: d('0.15'),
}
