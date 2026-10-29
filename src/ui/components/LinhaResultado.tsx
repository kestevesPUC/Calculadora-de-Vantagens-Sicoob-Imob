interface Props {
  rotulo: string
  periodo: string
  valor: string
  explicacao?: string
}

export function LinhaResultado({ rotulo, periodo, valor, explicacao }: Props) {
  return (
    <div className="flex flex-col gap-1 border-b border-linha py-3 last:border-b-0">
      <div className="flex flex-wrap items-baseline justify-between gap-x-4">
        <span className="font-medium">
          {rotulo} <span className="text-sm font-normal">({periodo})</span>
        </span>
        <span className="text-xl font-semibold">{valor}</span>
      </div>
      {explicacao ? <p className="text-sm">{explicacao}</p> : null}
    </div>
  )
}
