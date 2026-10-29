import { useEffect, useState } from 'react'

/** Mostra a versão instalada (vem do processo principal; some fora do Electron). */
export function VersaoApp({ className = '' }: { className?: string }) {
  const [versao, setVersao] = useState<string>()

  useEffect(() => {
    void window.sicoob?.versao?.().then(setVersao)
  }, [])

  if (!versao) return null
  return (
    <p className={`text-sm ${className}`} data-testid="versao-app">
      Versão {versao}
    </p>
  )
}
