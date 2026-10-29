import type Decimal from 'decimal.js'
import { formatarNumero } from './formatarMoeda'

/** Recebe uma fração (0,15) e devolve `15,00%`. */
export function formatarPercentual(fracao: Decimal, casas = 2): string {
  return `${formatarNumero(fracao.times(100), casas)}%`
}
