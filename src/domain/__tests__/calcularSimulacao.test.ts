import { calcularFatores } from '../calcularFatores'
import { calcularSimulacao } from '../calcularSimulacao'
import { Decimal } from '../decimal'
import { entradaCasoA, parametrosIniciais } from '../fixtures'
import type { EntradaSimulacao } from '../EntradaSimulacao'

const fatores = calcularFatores(parametrosIniciais)
const tol = new Decimal('0.01')
const perto = (valor: Decimal, esperado: string) =>
  expect(valor.minus(esperado).abs().lte(tol)).toBe(true)

describe('calcularSimulacao', () => {
  it('caso A: referência da gerente', () => {
    const r = calcularSimulacao(parametrosIniciais, fatores, entradaCasoA)
    perto(r.premioAbertura, '2000.00')
    perto(r.custoMensalBoletagem, '3400.00')
    perto(r.custoAnualBoletagem, '40800.00')
    perto(r.retornoCobranca, '3497.53')
    perto(r.saldoMedioDAV, '45650.00')
    perto(r.retornoDAV, '331.16')
    perto(r.valorInvestido, '48000.00')
    perto(r.retornoInvestimentos, '62.17')
    perto(r.remuneracaoCapital, '3000.00')
    perto(r.totalAnualRecorrente, '6890.86')
    perto(r.totalPrimeiroAno, '8890.86')
    perto(r.custoAnualManutencao, '24000.00')
    expect(r.custoEfetivoBoleto.toFixed(4)).toBe('1.5543')
  })

  it('RN01: prêmio fora do total anual', () => {
    const r = calcularSimulacao(parametrosIniciais, fatores, entradaCasoA)
    expect(r.totalPrimeiroAno.minus(r.totalAnualRecorrente).eq(r.premioAbertura)).toBe(true)
  })

  it('caso B: tudo zero', () => {
    const zero = new Decimal(0)
    const entrada: EntradaSimulacao = {
      nomeAdministradora: '',
      condominios: zero,
      boletosMes: zero,
      faturamentoMensal: zero,
      capitalSocial: zero,
      selic: zero,
    }
    const r = calcularSimulacao(parametrosIniciais, fatores, entrada)
    expect(r.totalAnualRecorrente.isZero()).toBe(true)
    expect(r.totalPrimeiroAno.isZero()).toBe(true)
    expect(r.premioAbertura.isZero()).toBe(true)
  })

  it('caso J: valores muito grandes sem perda de precisão', () => {
    const r = calcularSimulacao(parametrosIniciais, fatores, {
      ...entradaCasoA,
      faturamentoMensal: new Decimal('1000000000'),
    })
    expect(r.saldoMedioDAV.toFixed(2)).toBe('91300000.00')
    expect(r.valorInvestido.toFixed(2)).toBe('96000000.00')
  })
})
