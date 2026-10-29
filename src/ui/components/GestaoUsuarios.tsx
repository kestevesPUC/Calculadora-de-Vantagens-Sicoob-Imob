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
      setErro(msg.replace(/^Error invoking remote method '[^']+': Error: /, '') || 'Falha ao criar usuário')
    }
  }

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <form onSubmit={criar} className="flex flex-col gap-4" aria-label="Novo usuário">
        <h2 className="text-xl font-semibold">Novo usuário</h2>
        <Campo rotulo="Usuário" tipo="texto" valor={form.usuario} onChange={(v) => setForm({ ...form, usuario: v })} onBlur={() => undefined} />
        <Campo rotulo="Nome" tipo="texto" valor={form.nome} onChange={(v) => setForm({ ...form, nome: v })} onBlur={() => undefined} />
        <div className="flex flex-col gap-1">
          <label htmlFor="nova-senha" className="font-medium">
            Senha (mínimo 6 caracteres)
          </label>
          <input
            id="nova-senha"
            type="password"
            autoComplete="new-password"
            value={form.senha}
            onChange={(e) => setForm({ ...form, senha: e.target.value })}
            className="min-h-11 rounded-xl border-2 border-borda-campo bg-fundo px-3"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="papel" className="font-medium">
            Perfil
          </label>
          <select
            id="papel"
            value={form.papel}
            onChange={(e) => setForm({ ...form, papel: e.target.value as PapelUsuario })}
            className="min-h-11 rounded-xl border-2 border-borda-campo bg-fundo px-3"
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

      <section aria-label="Usuários cadastrados">
        <h2 className="text-xl font-semibold">Usuários cadastrados</h2>
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
