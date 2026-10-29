import type { ReactNode } from 'react'
import { ChevronDown } from 'lucide-react'

interface Props {
  titulo: string
  children: ReactNode
  abertoInicial?: boolean
}

export function BlocoRecolhivel({ titulo, children, abertoInicial = false }: Props) {
  return (
    <details open={abertoInicial} className="group rounded-2xl border-2 border-linha p-4">
      <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between text-xl font-semibold">
        {titulo}
        <ChevronDown aria-hidden="true" className="transition-transform group-open:rotate-180" />
      </summary>
      <div className="mt-3 flex flex-col gap-4">{children}</div>
    </details>
  )
}
