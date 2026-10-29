import { calcularComparacao } from '../calcularComparacao'
import { calcularFatores } from '../calcularFatores'
import { calcularSimulacao } from '../calcularSimulacao'
import { Decimal } from '../decimal'
import { entradaCasoA, parametrosIniciais } from '../fixtures'

describe('RNF02: recálculo abaixo de 200 ms', () => {
  it('fatores + simulação + comparação', () => {
    const entrada = {
      ...entradaCasoA,
      tarifaBoletoAtual: new Decimal('2.5'),
      tarifaManutencaoAtual: new Decimal('80'),
    }
    const inicio = performance.now()
    const fatores = calcularFatores(parametrosIniciais)
    const resultado = calcularSimulacao(parametrosIniciais, fatores, entrada)
    calcularComparacao(parametrosIniciais, resultado, entrada)
    expect(performance.now() - inicio).toBeLessThan(200)
  })
})
