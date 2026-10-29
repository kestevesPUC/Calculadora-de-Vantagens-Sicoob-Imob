import type Decimal from 'decimal.js'

/** Agrupa milhares com ponto e usa vírgula decimal, sem passar por `number`. */
export function formatarNumero(valor: Decimal, casas = 2): string {
  const [inteiro = '0', fracao] = valor.abs().toFixed(casas).split('.')
  const agrupado = inteiro.replace(/\B(?=(\d{3})+(?!\d))/g, '.')
  return fracao ? `${agrupado},${fracao}` : agrupado
}

/** `R$ 1.234,56`. Negativos usam o sinal "−" antes do símbolo. */
export function formatarMoeda(valor: Decimal): string {
  const texto = `R$ ${formatarNumero(valor, 2)}`
  const arredondadoZero = valor.toDecimalPlaces(2).isZero()
  return valor.isNegative() && !arredondadoZero ? `−${texto}` : texto
}
