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
      className={`flex flex-col gap-1 rounded-2xl border-l-8 border-acento p-4 ${
        destaque ? 'bg-destaque text-sobre-destaque' : 'bg-suave text-texto'
      }`}
    >
      <div className="flex items-center gap-2 text-sm font-medium">
        {icone}
        {titulo}
      </div>
      <p className={`text-[28px] font-bold leading-tight ${destaque ? 'text-valor-destaque' : ''}`}>
        {valor}
      </p>
      <p className="text-sm">{detalhe}</p>
    </div>
  )
}
