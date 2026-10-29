import { useState, type FormEvent } from 'react'
import { LogIn } from 'lucide-react'
import type { Usuario } from '../../domain/Usuario'
import { Botao } from './Botao'
import { Campo } from './Campo'
import { CreditoAutor } from './CreditoAutor'
import { Logo } from './Logo'
import { VersaoApp } from './VersaoApp'

interface Props {
  onEntrar: (usuario: Usuario) => void
}

export function TelaLogin({ onEntrar }: Props) {
  const [usuario, setUsuario] = useState('')
  const [senha, setSenha] = useState('')
  const [erro, setErro] = useState<string>()
  const [carregando, setCarregando] = useState(false)

  async function enviar(e: FormEvent) {
    e.preventDefault()
    setErro(undefined)
    if (!window.sicoob) {
      setErro('Login disponível apenas no aplicativo desktop')
      return
    }
    setCarregando(true)
    try {
      const encontrado = await window.sicoob.entrar(usuario, senha)
      if (encontrado) onEntrar(encontrado)
      else setErro('Usuário ou senha incorretos')
    } catch {
      setErro('Não foi possível entrar. Tente novamente.')
    } finally {
      setCarregando(false)
    }
  }

  return (
    <main className="auth">
      <section className="hero">
        <Logo />
        <h1>Calculadora de Vantagens</h1>
        <p>
          Mostre em reais quanto a administradora ganha sendo cooperada: prêmio, sobras e economia.
        </p>
      </section>
      <section className="painel">
        <div className="w-full max-w-sm">
          <div className="mb-5">
            <h2 className="text-2xl font-bold">Bem-vindo de volta</h2>
            <p className="mt-1 opacity-70">Acesse a calculadora com seu usuário.</p>
          </div>
          <form onSubmit={enviar} className="flex flex-col gap-4" aria-label="Entrar">
            <Campo
              rotulo="Usuário"
              tipo="texto"
              valor={usuario}
              onChange={setUsuario}
              onBlur={() => undefined}
            />
            <div className="flex flex-col gap-1">
              <label htmlFor="senha" className="text-sm font-semibold">
                Senha
              </label>
              <input
                id="senha"
                type="password"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                autoComplete="current-password"
                className="campo-caixa min-h-11 rounded-xl border-2 border-linha bg-fundo px-3 hover:border-borda-campo focus-visible:outline-none"
              />
            </div>
            {erro ? (
              <p role="alert" className="font-medium text-erro">
                {erro}
              </p>
            ) : null}
            <Botao
              type="submit"
              variante="primario"
              disabled={carregando || !usuario || !senha}
              icone={<LogIn size={18} aria-hidden="true" />}
            >
              Entrar
            </Botao>
          </form>
          <VersaoApp className="mt-6 opacity-70" />
          <CreditoAutor className="opacity-70" />
        </div>
      </section>
    </main>
  )
}
