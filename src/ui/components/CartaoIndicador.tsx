import type { ReactNode } from 'react'

interface Props {
  titulo: string
  valor: string
  detalhe: string
  icone: ReactNode
  destaque?: boolean
}

export function CartaoIndicador({ titulo, valor, detalhe, icone, destaque }: Props) {
  return (
    <div
      className={`flex flex-col gap-1 rounded-2xl border-l-8 border-acento p-5 ${
        destaque
          ? 'bg-destaque text-sobre-destaque shadow-[var(--sombra-elevada)]'
          : 'cartao text-texto'
      }`}
    >
      <div className="flex items-center gap-2 text-sm font-semibold">
        <span
          className={`grid size-8 place-items-center rounded-lg ${destaque ? 'bg-acento text-texto-botao' : 'bg-suave'}`}
        >
          {icone}
        </span>
        {titulo}
      </div>
      <p className={`text-[28px] font-bold leading-tight ${destaque ? 'text-valor-destaque' : ''}`}>
        {valor}
      </p>
      <p className="text-sm">{detalhe}</p>
    </div>
  )
}
