/** Máscaras de digitação pt-BR. Só formatam o texto do campo; o cálculo continua em Decimal (lerNumeroBR). */

function agruparMilhares(digitos: string): string {
  return digitos.replace(/\B(?=(\d{3})+(?!\d))/g, '.')
}

/** Só dígitos, com ponto de milhar: "1200" → "1.200". */
export function mascararInteiro(texto: string): string {
  const digitos = texto.replace(/\D/g, '').replace(/^0+(?=\d)/, '')
  return agruparMilhares(digitos)
}

/**
 * Dinheiro e percentuais: milhar com ponto, vírgula decimal, até 2 casas.
 * "1234,5" → "1.234,5"; "500000,00" → "500.000,00"; letras e sinais são descartados.
 */
export function mascararDecimal(texto: string): string {
  const [inteiroBruto = '', ...resto] = texto.replace(/[^\d,]/g, '').split(',')
  const temVirgula = resto.length > 0
  const inteiro = inteiroBruto.replace(/^0+(?=\d)/, '')
  const decimais = resto.join('').slice(0, 2)
  const parteInteira = agruparMilhares(inteiro) || (temVirgula ? '0' : '')
  return temVirgula ? `${parteInteira},${decimais}` : parteInteira
}

export type Mascara = 'inteiro' | 'decimal'

export function aplicarMascara(mascara: Mascara | undefined, texto: string): string {
  if (mascara === 'inteiro') return mascararInteiro(texto)
  if (mascara === 'decimal') return mascararDecimal(texto)
  return texto
}
