interface Props {
  texto: string
  vigencia: string
}

function formatarVigencia(iso: string): string {
  const [ano, mes, dia] = iso.split('-')
  return `${dia}/${mes}/${ano}`
}

/** RN10 / RF11 / RF12: sempre visível, com a vigência dos parâmetros. */
export function Aviso({ texto, vigencia }: Props) {
  return (
    <footer className="rounded-2xl bg-suave p-4 text-sm leading-relaxed" aria-label="Aviso legal">
      <p>{texto}</p>
      <p className="mt-2 font-medium">Parâmetros em vigor desde {formatarVigencia(vigencia)}.</p>
    </footer>
  )
}
