import { useId } from 'react'
import { CircleAlert } from 'lucide-react'

interface Props {
  rotulo: string
  valor: string
  onChange: (valor: string) => void
  onBlur: () => void
  erro?: string
  dica?: string
  obrigatorio?: boolean
  prefixo?: string
  sufixo?: string
  tipo?: 'texto' | 'numero'
}

export function Campo({
  rotulo,
  valor,
  onChange,
  onBlur,
  erro,
  dica,
  obrigatorio,
  prefixo,
  sufixo,
  tipo = 'numero',
}: Props) {
  const id = useId()
  const idErro = `${id}-erro`
  const idDica = `${id}-dica`

  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={id} className="text-sm font-semibold">
        {rotulo}
        {obrigatorio ? <span aria-hidden="true"> *</span> : null}
      </label>
      <div
        className={`campo-caixa flex min-h-11 items-center gap-2 rounded-xl bg-fundo px-3 ${
          erro ? 'border-2 border-erro' : 'border-2 border-linha hover:border-borda-campo'
        }`}
      >
        {prefixo ? <span aria-hidden="true">{prefixo}</span> : null}
        <input
          id={id}
          value={valor}
          onChange={(e) => onChange(e.target.value)}
          onBlur={onBlur}
          inputMode={tipo === 'numero' ? 'decimal' : 'text'}
          autoComplete="off"
          aria-invalid={erro ? true : undefined}
          aria-describedby={
            [erro ? idErro : '', dica ? idDica : ''].filter(Boolean).join(' ') || undefined
          }
          aria-required={obrigatorio}
          className="min-h-10 w-full bg-transparent outline-none focus-visible:outline-none"
        />
        {sufixo ? <span aria-hidden="true">{sufixo}</span> : null}
      </div>
      {dica ? (
        <p id={idDica} className="text-sm">
          {dica}
        </p>
      ) : null}
      {erro ? (
        <p
          id={idErro}
          role="alert"
          className="flex items-center gap-1 text-sm font-medium text-erro"
        >
          <CircleAlert size={16} aria-hidden="true" />
          {erro}
        </p>
      ) : null}
    </div>
  )
}
