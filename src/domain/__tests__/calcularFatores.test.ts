import { calcularFatores } from '../calcularFatores'
import { Decimal } from '../decimal'
import { parametrosIniciais } from '../fixtures'

describe('calcularFatores', () => {
  it('calcula montante e fatores a partir das bases', () => {
    const f = calcularFatores(parametrosIniciais)
    expect(f.montanteDistribuivel.toFixed(2)).toBe('1860000.00')
    expect(f.fatorDAV.times(100).toFixed(4)).toBe('0.7254')
    expect(f.fatorINV.times(100).toFixed(4)).toBe('0.1295')
    expect(f.fatorCobranca.times(100).toFixed(4)).toBe('8.5724')
  })

  it('caso D: percentualDistribuicao 0,10 recalcula os fatores', () => {
    const f = calcularFatores({ ...parametrosIniciais, percentualDistribuicao: new Decimal('0.10') })
    expect(f.montanteDistribuivel.toFixed(2)).toBe('1550000.00')
    expect(f.fatorCobranca.times(100).toFixed(4)).toBe('7.1436')
  })
})
