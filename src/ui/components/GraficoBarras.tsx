import type Decimal from 'decimal.js'
import { formatarMoeda } from '../../format/formatarMoeda'

export interface ItemGrafico {
  rotulo: string
  valor: Decimal
  /** Token de cor decorativo; a informação sempre também aparece em texto. */
  cor: string
}

/** Barras horizontais; aceita valores negativos (economia do banco atual mais barato). */
export function GraficoBarras({ titulo, itens }: { titulo: string; itens: ItemGrafico[] }) {
  const maximo = itens.reduce(
    (m, i) => (i.valor.abs().gt(m) ? i.valor.abs() : m),
    itens[0]!.valor.abs(),
  )

  return (
    <figure aria-label={titulo} className="flex flex-col gap-3">
      <figcaption className="text-lg font-bold tracking-tight">{titulo}</figcaption>
      <ul className="flex flex-col gap-3">
        {itens.map((i) => {
          const largura = maximo.isZero()
            ? 0
            : i.valor.abs().div(maximo).times(100).toDecimalPlaces(2).toNumber()
          return (
            <li key={i.rotulo} className="flex flex-col gap-1">
              <div className="flex items-baseline justify-between gap-4">
                <span>{i.rotulo}</span>
                <span className="font-semibold">{formatarMoeda(i.valor)}</span>
              </div>
              <div className="h-4 rounded-full bg-suave" aria-hidden="true">
                <div
                  className="h-4 rounded-full border border-borda-campo"
                  style={{ width: `${largura}%`, background: i.cor }}
                />
              </div>
            </li>
          )
        })}
      </ul>
    </figure>
  )
}
