import { useState } from 'react'

// HIPÓTESE: P13 — área de arejamento fixa de 16 px (2X) até o Marketing informar o "X" da marca de produto.
const LARGURA_LOGO_PX = 160

/** O arquivo oficial tem o texto "Sicoob" em branco: use sempre sobre o verde-escuro. Só usa o arquivo oficial; sem ele, mostra o espaço reservado. Sem filtro, sombra ou rotação. */
export function Logo() {
  const [semArquivo, setSemArquivo] = useState(false)

  return (
    <div style={{ padding: 16 }}>
      {semArquivo ? (
        <span
          role="img"
          aria-label="Sicoob Imob.vc (espaço reservado para o logo oficial)"
          className="inline-block border-2 border-dashed border-current px-2 py-1 font-semibold"
          style={{ minWidth: LARGURA_LOGO_PX }}
        >
          Sicoob Imob.vc
        </span>
      ) : (
        <img
          src="./brand/logo-sicoob-imobvc.png"
          alt="Sicoob Imob.vc"
          width={LARGURA_LOGO_PX}
          style={{ height: 'auto', minWidth: 64 }}
          onError={() => setSemArquivo(true)}
        />
      )}
    </div>
  )
}
