import type { ButtonHTMLAttributes, ReactNode } from 'react'

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  variante?: 'primario' | 'secundario'
  icone?: ReactNode
}

export function Botao({ variante = 'secundario', icone, children, className = '', ...resto }: Props) {
  const estilo =
    variante === 'primario'
      ? 'bg-botao text-texto-botao border-transparent'
      : 'bg-fundo text-texto border-borda-campo'
  return (
    <button
      type="button"
      className={`inline-flex min-h-11 min-w-11 items-center justify-center gap-2 rounded-xl border-2 px-4 font-semibold disabled:opacity-50 ${estilo} ${className}`}
      {...resto}
    >
      {icone}
      {children}
    </button>
  )
}
