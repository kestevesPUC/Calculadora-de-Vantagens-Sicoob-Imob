import { aplicarMascara, mascararDecimal, mascararInteiro } from '../mascaras'

describe('máscaras de digitação', () => {
  it('inteiro: só dígitos com ponto de milhar', () => {
    expect(mascararInteiro('2000')).toBe('2.000')
    expect(mascararInteiro('1234567')).toBe('1.234.567')
    expect(mascararInteiro('-3')).toBe('3')
    expect(mascararInteiro('4a0')).toBe('40')
    expect(mascararInteiro('')).toBe('')
    expect(mascararInteiro('007')).toBe('7')
  })

  it('decimal: milhar, vírgula e no máximo 2 casas', () => {
    expect(mascararDecimal('500000,00')).toBe('500.000,00')
    expect(mascararDecimal('500.000,00')).toBe('500.000,00')
    expect(mascararDecimal('1234,5')).toBe('1.234,5')
    expect(mascararDecimal('2,')).toBe('2,')
    expect(mascararDecimal(',5')).toBe('0,5')
    expect(mascararDecimal('12,345')).toBe('12,34')
    expect(mascararDecimal('1,2,3')).toBe('1,23')
    expect(mascararDecimal('-3')).toBe('3')
    expect(mascararDecimal('R$ 80')).toBe('80')
    expect(mascararDecimal('')).toBe('')
  })

  it('sem máscara devolve o texto como veio', () => {
    expect(aplicarMascara(undefined, 'Adm & Co')).toBe('Adm & Co')
  })
})
