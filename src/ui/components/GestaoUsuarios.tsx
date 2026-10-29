import { useCallback, useEffect, useState, type FormEvent } from 'react'
import { UserPlus } from 'lucide-react'
import type { PapelUsuario, Usuario } from '../../domain/Usuario'
import { Botao } from './Botao'
import { Campo } from './Campo'

const VAZIO = { usuario: '', nome: '', senha: '', papel: 'gerente' as PapelUsuario }

export function GestaoUsuarios() {
  const [lista, setLista] = useState<Usuario[]>([])
  const [form, setForm] = useState(VAZIO)
  const [erro, setErro] = useState<string>()
  const [aviso, setAviso] = useState<string>()

  const carregar = useCallback(async () => {
    setLista((await window.sicoob?.listarUsuarios()) ?? [])
  }, [])

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void carregar()
  }, [carregar])

  async function criar(e: FormEvent) {
    e.preventDefault()
    setErro(undefined)
    setAviso(undefined)
    try {
      const novo = await window.sicoob!.criarUsuario(form)
      setAviso(`Usuário ${novo.usuario} criado.`)
      setForm(VAZIO)
      await carregar()
    } catch (err) {
      const msg = err instanceof Error ? err.message : ''
      setErro(
        msg.replace(/^Error invoking remote method '[^']+': Error: /, '') ||
          'Falha ao criar usuário',
      )
    }
  }

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <form onSubmit={criar} className="cartao flex flex-col gap-4 p-5" aria-label="Novo usuário">
        <h2 className="text-lg font-bold tracking-tight">Novo usuário</h2>
        <Campo
          rotulo="Usuário"
          tipo="texto"
          valor={form.usuario}
          onChange={(v) => setForm({ ...form, usuario: v })}
          onBlur={() => undefined}
        />
        <Campo
          rotulo="Nome"
          tipo="texto"
          valor={form.nome}
          onChange={(v) => setForm({ ...form, nome: v })}
          onBlur={() => undefined}
        />
        <div className="flex flex-col gap-1">
          <label htmlFor="nova-senha" className="text-sm font-semibold">
            Senha (mínimo 6 caracteres)
          </label>
          <input
            id="nova-senha"
            type="password"
            autoComplete="new-password"
            value={form.senha}
            onChange={(e) => setForm({ ...form, senha: e.target.value })}
            className="campo-caixa min-h-11 rounded-xl border-2 border-linha bg-fundo px-3 hover:border-borda-campo focus-visible:outline-none"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="papel" className="text-sm font-semibold">
            Perfil
          </label>
          <select
            id="papel"
            value={form.papel}
            onChange={(e) => setForm({ ...form, papel: e.target.value as PapelUsuario })}
            className="campo-caixa min-h-11 rounded-xl border-2 border-linha bg-fundo px-3 hover:border-borda-campo focus-visible:outline-none"
          >
            <option value="gerente">Gerente</option>
            <option value="admin">Administrador</option>
          </select>
        </div>
        {erro ? (
          <p role="alert" className="font-medium text-erro">
            {erro}
          </p>
        ) : null}
        {aviso ? <p role="status">{aviso}</p> : null}
        <Botao type="submit" variante="primario" icone={<UserPlus size={18} aria-hidden="true" />}>
          Criar usuário
        </Botao>
      </form>

      <section aria-label="Usuários cadastrados" className="cartao p-5">
        <h2 className="text-lg font-bold tracking-tight">Usuários cadastrados</h2>
        <ul className="mt-3 flex flex-col">
          {lista.map((u) => (
            <li key={u.id} className="flex justify-between border-b border-linha py-3">
              <span>
                <strong>{u.usuario}</strong> — {u.nome}
              </span>
              <span className="text-sm">{u.papel === 'admin' ? 'Administrador' : 'Gerente'}</span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  )
}
