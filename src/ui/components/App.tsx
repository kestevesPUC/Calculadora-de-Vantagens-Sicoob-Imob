import { useEffect, useState } from 'react'
import { FileDown, LayoutDashboard, LogOut, Presentation, Calculator, Users } from 'lucide-react'
import { carregarParametros, ParametrosInvalidosError } from '../../config/carregarParametros'
import type { Parametros } from '../../domain/Parametros'
import type { Usuario } from '../../domain/Usuario'
import { Botao } from './Botao'
import { Dashboard } from './Dashboard'
import { FormularioEntrada } from './FormularioEntrada'
import { GestaoUsuarios } from './GestaoUsuarios'
import { Logo } from './Logo'
import { PainelVantagens } from './PainelVantagens'
import { RelatorioImpressao } from './RelatorioImpressao'
import { TelaLogin } from './TelaLogin'
import { useSimulacao } from '../hooks/useSimulacao'

type Estado =
  | { tipo: 'carregando' }
  | { tipo: 'erro'; detalhes: string[] }
  | { tipo: 'ok'; parametros: Parametros }

export function App() {
  const [estado, setEstado] = useState<Estado>({ tipo: 'carregando' })
  const [usuario, setUsuario] = useState<Usuario | null>(null)

  useEffect(() => {
    carregarParametros()
      .then((parametros) => setEstado({ tipo: 'ok', parametros }))
      .catch((erro) => {
        // Sem log de dados digitados; só o motivo da falha de carga (observabilidade).
        console.error('Falha ao carregar parâmetros', erro)
        const detalhes = erro instanceof ParametrosInvalidosError ? erro.detalhes : ['Erro inesperado']
        setEstado({ tipo: 'erro', detalhes })
      })
    void window.sicoob?.usuarioAtual().then(setUsuario)
  }, [])

  if (estado.tipo === 'carregando') {
    return (
      <p role="status" className="p-8">
        Carregando parâmetros…
      </p>
    )
  }
  if (estado.tipo === 'erro') {
    return (
      <main role="alert" className="mx-auto max-w-2xl p-8">
        <h1 className="text-2xl font-bold text-erro">Parâmetros inválidos — cálculo bloqueado</h1>
        <ul className="mt-4 list-disc pl-6">
          {estado.detalhes.map((d) => (
            <li key={d}>{d}</li>
          ))}
        </ul>
      </main>
    )
  }
  if (!usuario) return <TelaLogin onEntrar={setUsuario} />

  return <Sistema parametros={estado.parametros} usuario={usuario} onSair={() => setUsuario(null)} />
}

type Aba = 'simulacao' | 'dashboard' | 'usuarios'

function Sistema({
  parametros,
  usuario,
  onSair,
}: {
  parametros: Parametros
  usuario: Usuario
  onSair: () => void
}) {
  const s = useSimulacao(parametros)
  const [aba, setAba] = useState<Aba>('simulacao')
  const [apresentacao, setApresentacao] = useState(false)

  async function sair() {
    await window.sicoob?.sair()
    onSair()
  }

  const abas: { id: Aba; rotulo: string; icone: React.ReactNode; visivel: boolean }[] = [
    { id: 'simulacao', rotulo: 'Simulação', icone: <Calculator size={18} aria-hidden="true" />, visivel: true },
    { id: 'dashboard', rotulo: 'Dashboard', icone: <LayoutDashboard size={18} aria-hidden="true" />, visivel: true },
    { id: 'usuarios', rotulo: 'Usuários', icone: <Users size={18} aria-hidden="true" />, visivel: usuario.papel === 'admin' },
  ]

  const nome = s.calculo?.entrada.nomeAdministradora || 'simulacao'

  return (
    <>
      <div className="min-h-screen print:hidden">
        <header className="flex flex-wrap items-center justify-between gap-2 border-b-4 border-acento">
          <Logo />
          <div className="flex flex-wrap items-center gap-2 px-4">
            <span>
              Olá, <strong>{usuario.nome}</strong>
            </span>
            <Botao onClick={sair} icone={<LogOut size={18} aria-hidden="true" />}>
              Sair
            </Botao>
          </div>
        </header>

        <nav aria-label="Seções" className="flex flex-wrap gap-2 px-4 pt-4">
          {abas
            .filter((a) => a.visivel)
            .map((a) => (
              <Botao
                key={a.id}
                variante={aba === a.id ? 'primario' : 'secundario'}
                aria-current={aba === a.id ? 'page' : undefined}
                icone={a.icone}
                onClick={() => setAba(a.id)}
              >
                {a.rotulo}
              </Botao>
            ))}
        </nav>

        <main className="p-4">
          {aba === 'usuarios' && usuario.papel === 'admin' ? <GestaoUsuarios /> : null}

          {aba === 'dashboard' ? (
            <Dashboard parametros={parametros} fatores={s.fatores} calculo={s.calculo} />
          ) : null}

          {aba === 'simulacao' ? (
            <>
              <div className="mb-4 flex flex-wrap gap-2">
                <Botao
                  icone={<Presentation size={18} aria-hidden="true" />}
                  aria-pressed={apresentacao}
                  onClick={() => setApresentacao((v) => !v)}
                >
                  Modo apresentação
                </Botao>
                <Botao
                  disabled={!s.calculo}
                  icone={<FileDown size={18} aria-hidden="true" />}
                  onClick={() => void window.sicoob?.exportarPdf(`${nome}-${new Date().toISOString().slice(0, 10)}`)}
                >
                  Exportar PDF
                </Botao>
              </div>
              <div className={apresentacao ? '' : 'grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)]'}>
                {apresentacao ? null : <FormularioEntrada s={s} />}
                <PainelVantagens
                  parametros={parametros}
                  fatores={s.fatores}
                  calculo={s.calculo}
                  apresentacao={apresentacao}
                />
              </div>
            </>
          ) : null}
        </main>
      </div>
      {s.calculo ? <RelatorioImpressao parametros={parametros} calculo={s.calculo} /> : null}
    </>
  )
}
