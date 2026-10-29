import { calcularComparacao } from '../calcularComparacao'
import { calcularFatores } from '../calcularFatores'
import { calcularSimulacao } from '../calcularSimulacao'
import { Decimal } from '../decimal'
import { entradaCasoA, parametrosIniciais } from '../fixtures'

const fatores = calcularFatores(parametrosIniciais)
const resultado = calcularSimulacao(parametrosIniciais, fatores, entradaCasoA)
const comparar = (boleto?: string, manut?: string) =>
  calcularComparacao(parametrosIniciais, resultado, {
    ...entradaCasoA,
    tarifaBoletoAtual: boleto ? new Decimal(boleto) : undefined,
    tarifaManutencaoAtual: manut ? new Decimal(manut) : undefined,
  })

describe('calcularComparacao', () => {
  it('caso C: comparação completa', () => {
    const c = comparar('2.50', '80.00')!
    expect(c.economiaBoletos.toFixed(2)).toBe('19200.00')
    expect(c.economiaManutencao.toFixed(2)).toBe('14400.00')
    expect(c.ganhoTotalAnualVsBancoAtual.minus('40490.86').abs().lte('0.01')).toBe(true)
  })

  it('sem campos opcionais não há comparação', () => {
    expect(comparar()).toBeNull()
  })

  it('caso H: só um campo conta o outro como zero', () => {
    const c = comparar('2.50')!
    expect(c.economiaManutencao.isZero()).toBe(true)
    expect(c.economiaBoletos.toFixed(2)).toBe('19200.00')
    const m = comparar(undefined, '80.00')!
    expect(m.economiaBoletos.isZero()).toBe(true)
  })

  it('caso F: economia negativa é preservada', () => {
    const c = comparar('1.00', '40.00')!
    expect(c.economiaBoletos.isNegative()).toBe(true)
    expect(c.economiaManutencao.isNegative()).toBe(true)
  })
})
