import { useState, type FormEvent } from 'react'
import { CircleAlert, KeyRound } from 'lucide-react'
import type { Usuario } from '../../domain/Usuario'
import { Botao } from './Botao'
import { Logo } from './Logo'

interface Props {
  onTrocada: (usuario: Usuario) => void
}

const SENHA_MINIMA = 6

/** Exibida no primeiro acesso (e enquanto a senha inicial não for trocada). */
export function TelaTrocaSenha({ onTrocada }: Props) {
  const [atual, setAtual] = useState('')
  const [nova, setNova] = useState('')
  const [confirma, setConfirma] = useState('')
  const [erro, setErro] = useState<string>()
  const [salvando, setSalvando] = useState(false)

  async function enviar(e: FormEvent) {
    e.preventDefault()
    setErro(undefined)
    if (nova.length < SENHA_MINIMA) {
      setErro(`A nova senha deve ter pelo menos ${SENHA_MINIMA} caracteres`)
      return
    }
    if (nova !== confirma) {
      setErro('A confirmação não confere com a nova senha')
      return
    }
    if (!window.sicoob?.trocarSenha) {
      setErro('Troca de senha disponível apenas no aplicativo desktop')
      return
    }
    setSalvando(true)
    try {
      onTrocada(await window.sicoob.trocarSenha(atual, nova))
    } catch (err) {
      const msg = err instanceof Error ? err.message : ''
      setErro(
        msg.replace(/^Error invoking remote method '[^']+': Error: /, '') ||
          'Não foi possível trocar a senha',
      )
    } finally {
      setSalvando(false)
    }
  }

  const campo = (
    id: string,
    rotulo: string,
    valor: string,
    set: (v: string) => void,
    auto: string,
  ) => (
    <div className="flex flex-col gap-1">
      <label htmlFor={id} className="text-sm font-semibold">
        {rotulo}
      </label>
      <input
        id={id}
        type="password"
        value={valor}
        onChange={(e) => set(e.target.value)}
        autoComplete={auto}
        className="campo-caixa min-h-11 rounded-xl border-2 border-linha bg-fundo px-3 hover:border-borda-campo focus-visible:outline-none"
      />
    </div>
  )

  return (
    <main className="auth">
      <section className="hero">
        <Logo />
        <h1>Calculadora de Vantagens</h1>
        <p>Por segurança, defina uma senha pessoal antes de continuar.</p>
      </section>
      <section className="painel">
        <div className="w-full max-w-sm">
          <div className="mb-5">
            <h2 className="text-2xl font-bold">Defina uma nova senha</h2>
            <p className="mt-1 opacity-70">
              A senha provisória precisa ser trocada antes de continuar.
            </p>
          </div>
          <form onSubmit={enviar} className="flex flex-col gap-4" aria-label="Trocar senha">
            {campo('senha-atual', 'Senha atual', atual, setAtual, 'current-password')}
            {campo('senha-nova', 'Nova senha (mínimo 6 caracteres)', nova, setNova, 'new-password')}
            {campo('senha-confirma', 'Confirmar nova senha', confirma, setConfirma, 'new-password')}
            {erro ? (
              <p role="alert" className="flex items-center gap-1 font-medium text-erro">
                <CircleAlert size={16} aria-hidden="true" />
                {erro}
              </p>
            ) : null}
            <Botao
              type="submit"
              variante="primario"
              disabled={salvando || !atual || !nova || !confirma}
              icone={<KeyRound size={18} aria-hidden="true" />}
            >
              Salvar senha
            </Botao>
          </form>
        </div>
      </section>
    </main>
  )
}
