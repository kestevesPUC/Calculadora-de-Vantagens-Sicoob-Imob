import { Decimal } from '../../domain/decimal'
import { formatarMoeda, formatarNumero } from '../formatarMoeda'
import { formatarPercentual } from '../formatarPercentual'

describe('formatação pt-BR', () => {
  it('moeda com milhar e vírgula', () => {
    expect(formatarMoeda(new Decimal('1234.5'))).toBe('R$ 1.234,50')
    expect(formatarMoeda(new Decimal('0'))).toBe('R$ 0,00')
    expect(formatarMoeda(new Decimal('1000000000'))).toBe('R$ 1.000.000.000,00')
  })

  it('arredonda só na exibição (meio para cima)', () => {
    expect(formatarMoeda(new Decimal('3497.525'))).toBe('R$ 3.497,53')
  })

  it('negativo com sinal e sem sinal para zero arredondado', () => {
    expect(formatarMoeda(new Decimal('-1234.5'))).toBe('−R$ 1.234,50')
    expect(formatarMoeda(new Decimal('-0.001'))).toBe('R$ 0,00')
  })

  it('percentual com vírgula', () => {
    expect(formatarPercentual(new Decimal('0.15'))).toBe('15,00%')
    expect(formatarPercentual(new Decimal('0.0072541'), 4)).toBe('0,7254%')
  })

  it('número sem casas', () => {
    expect(formatarNumero(new Decimal('12345'), 0)).toBe('12.345')
  })
})
