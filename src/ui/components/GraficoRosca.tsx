import { formatarMoeda } from '../../format/formatarMoeda'
import { formatarPercentual } from '../../format/formatarPercentual'
import type { ItemGrafico } from './GraficoBarras'

const RAIO = 60
const CIRCUNFERENCIA = 2 * Math.PI * RAIO

export function GraficoRosca({ titulo, itens }: { titulo: string; itens: ItemGrafico[] }) {
  const total = itens.reduce((acc, i) => acc.plus(i.valor), itens[0]!.valor.times(0))
  const base = itens.map((i) => {
    const fracao = total.isZero() ? itens[0]!.valor.times(0) : i.valor.div(total)
    return { ...i, fracao, tamanho: fracao.toNumber() * CIRCUNFERENCIA }
  })
  const fatias = base.map((f, idx) => ({
    ...f,
    inicio: base.slice(0, idx).reduce((soma, anterior) => soma + anterior.tamanho, 0),
  }))

  return (
    <figure aria-label={titulo} className="flex flex-col gap-3">
      <figcaption className="text-xl font-semibold">{titulo}</figcaption>
      <div className="flex flex-wrap items-center gap-6">
        <svg viewBox="0 0 160 160" width="160" height="160" role="img" aria-label={`Gráfico de rosca: ${titulo}`}>
          <circle cx="80" cy="80" r={RAIO} fill="none" stroke="var(--color-suave)" strokeWidth="24" />
          {fatias.map((f) => (
            <circle
              key={f.rotulo}
              cx="80"
              cy="80"
              r={RAIO}
              fill="none"
              stroke={f.cor}
              strokeWidth="24"
              strokeDasharray={`${f.tamanho} ${CIRCUNFERENCIA - f.tamanho}`}
              strokeDashoffset={-f.inicio}
              transform="rotate(-90 80 80)"
            />
          ))}
        </svg>
        <ul className="flex flex-col gap-2">
          {fatias.map((f) => (
            <li key={f.rotulo} className="flex items-center gap-2">
              <span
                aria-hidden="true"
                className="inline-block h-4 w-4 rounded border border-borda-campo"
                style={{ background: f.cor }}
              />
              <span>
                {f.rotulo}: <strong>{formatarPercentual(f.fracao, 1)}</strong> ({formatarMoeda(f.valor)})
              </span>
            </li>
          ))}
        </ul>
      </div>
    </figure>
  )
}
