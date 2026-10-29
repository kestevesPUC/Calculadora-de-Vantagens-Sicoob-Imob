// @vitest-environment node
import { createRequire } from 'node:module'

const require_ = createRequire(import.meta.url)
const { abrirBanco, autenticar, criarUsuario, listarUsuarios } = require_('../usuarios.cjs')

describe('usuários (SQLite)', () => {
  it('cria o admin inicial e autentica', () => {
    const db = abrirBanco(':memory:')
    expect(listarUsuarios(db)).toHaveLength(1)
    expect(autenticar(db, 'admin', '123456')).toMatchObject({ usuario: 'admin', papel: 'admin' })
    expect(autenticar(db, 'ADMIN', '123456')).not.toBeNull()
    expect(autenticar(db, 'admin', 'errada')).toBeNull()
    expect(autenticar(db, 'fantasma', '123456')).toBeNull()
  })

  it('não guarda a senha em texto', () => {
    const db = abrirBanco(':memory:')
    const { senha_hash: hash } = db.prepare('SELECT senha_hash FROM usuarios').get()
    expect(hash).toMatch(/^scrypt\$/)
    expect(hash).not.toContain('123456')
  })

  it('cria novos usuários e impede duplicados e dados inválidos', () => {
    const db = abrirBanco(':memory:')
    const novo = criarUsuario(db, { usuario: 'maria', nome: 'Maria', senha: 'segredo1', papel: 'gerente' })
    expect(novo.papel).toBe('gerente')
    expect(autenticar(db, 'maria', 'segredo1')).not.toBeNull()
    expect(() => criarUsuario(db, { usuario: 'Maria', nome: 'X', senha: 'segredo1', papel: 'gerente' })).toThrow(/já existe/)
    expect(() => criarUsuario(db, { usuario: 'a', nome: 'X', senha: 'segredo1', papel: 'gerente' })).toThrow(/Usuário/)
    expect(() => criarUsuario(db, { usuario: 'joao', nome: '', senha: 'segredo1', papel: 'gerente' })).toThrow(/nome/)
    expect(() => criarUsuario(db, { usuario: 'joao', nome: 'J', senha: '123', papel: 'gerente' })).toThrow(/senha/)
    expect(() => criarUsuario(db, { usuario: 'joao', nome: 'J', senha: '123456', papel: 'root' })).toThrow(/Perfil/)
  })
})
