interface Props {
  totalAnual: string
  premio: string
  totalPrimeiroAno: string
  apresentacao: boolean
}

export function DestaquePrincipal({ totalAnual, premio, totalPrimeiroAno, apresentacao }: Props) {
  return (
    <section
      aria-label="Destaque principal"
      className="rounded-2xl border-l-8 border-acento bg-destaque p-6 text-sobre-destaque"
    >
      <p className="text-base">Total anual recorrente (por ano)</p>
      <p
        data-testid="total-anual"
        className={`font-bold text-valor-destaque ${apresentacao ? 'text-[72px] leading-tight' : 'text-[48px] leading-tight'}`}
      >
        {totalAnual}
      </p>
      <p className="mt-2 text-base">+ {premio} de prêmio na abertura (pagamento único)</p>
      <p className="text-base font-semibold">Total no primeiro ano: {totalPrimeiroAno}</p>
    </section>
  )
}
