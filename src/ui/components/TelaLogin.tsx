import { useState, type FormEvent } from 'react'
import { LogIn } from 'lucide-react'
import type { Usuario } from '../../domain/Usuario'
import { Botao } from './Botao'
import { Campo } from './Campo'
import { Logo } from './Logo'

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
    <main className="mx-auto flex min-h-screen max-w-md flex-col justify-center gap-6 px-4">
      <Logo />
      <h1 className="font-titulo text-3xl font-bold">Calculadora de Vantagens</h1>
      <form onSubmit={enviar} className="flex flex-col gap-4" aria-label="Entrar">
        <Campo
          rotulo="Usuário"
          tipo="texto"
          valor={usuario}
          onChange={setUsuario}
          onBlur={() => undefined}
        />
        <div className="flex flex-col gap-1">
          <label htmlFor="senha" className="font-medium">
            Senha
          </label>
          <input
            id="senha"
            type="password"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            autoComplete="current-password"
            className="min-h-11 rounded-xl border-2 border-borda-campo bg-fundo px-3"
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
    </main>
  )
}
