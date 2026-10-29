import { Decimal } from './decimal'

const FORMATO_BR = /^(\d{1,3}(\.\d{3})+|\d+)(,\d+)?$/

/**
 * Lê um número no formato pt-BR ("1.234,56", "1234,5", "15").
 * Devolve null para texto, negativos ou formatos ambíguos como "1.5".
 */
export function lerNumeroBR(texto: string): Decimal | null {
  const limpo = texto.trim()
  if (!FORMATO_BR.test(limpo)) return null
  return new Decimal(limpo.replace(/\./g, '').replace(',', '.'))
}
