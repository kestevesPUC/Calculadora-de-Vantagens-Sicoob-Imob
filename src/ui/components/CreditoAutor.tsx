/** Crédito de autoria; o site abre no navegador padrão (endereço fixo no processo principal). */
export function CreditoAutor({ className = '' }: { className?: string }) {
  return (
    <p className={`text-sm ${className}`}>
      Desenvolvido por{' '}
      <button
        type="button"
        className="cursor-pointer font-semibold underline underline-offset-4"
        onClick={() => void window.sicoob?.abrirSiteAutor?.()}
      >
        Kaio Gomes
      </button>
    </p>
  )
}
