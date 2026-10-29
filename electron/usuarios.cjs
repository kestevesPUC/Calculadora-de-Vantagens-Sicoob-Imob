'use strict'
const { DatabaseSync } = require('node:sqlite')
const { randomBytes, scryptSync, timingSafeEqual } = require('node:crypto')

const PAPEIS = ['admin', 'gerente']
const SENHA_MINIMA = 6

// HIPÓTESE: acesso inicial admin / 123456 criado a pedido do usuário do projeto.
// Recomenda-se trocar a senha antes do uso com clientes (ver docs/12-riscos.md).
const ADMIN_INICIAL = { usuario: 'admin', nome: 'Administrador', senha: '123456', papel: 'admin' }

function gerarHash(senha) {
  const sal = randomBytes(16)
  const hash = scryptSync(senha, sal, 64)
  return `scrypt$${sal.toString('hex')}$${hash.toString('hex')}`
}

function conferirSenha(senha, armazenado) {
  const [tipo, salHex, hashHex] = String(armazenado).split('$')
  if (tipo !== 'scrypt' || !salHex || !hashHex) return false
  const esperado = Buffer.from(hashHex, 'hex')
  const calculado = scryptSync(senha, Buffer.from(salHex, 'hex'), esperado.length)
  return timingSafeEqual(esperado, calculado)
}

function abrirBanco(caminho) {
  const db = new DatabaseSync(caminho)
  db.exec(`
    CREATE TABLE IF NOT EXISTS usuarios (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      usuario TEXT NOT NULL UNIQUE COLLATE NOCASE,
      nome TEXT NOT NULL,
      senha_hash TEXT NOT NULL,
      papel TEXT NOT NULL CHECK (papel IN ('admin', 'gerente')),
      criado_em TEXT NOT NULL DEFAULT (datetime('now')),
      trocar_senha INTEGER NOT NULL DEFAULT 1
    )
  `)
  migrar(db)
  const { total } = db.prepare('SELECT COUNT(*) AS total FROM usuarios').get()
  if (total === 0) criarUsuario(db, ADMIN_INICIAL)
  return db
}

// Bancos criados antes da coluna existir: quem ainda usa a senha inicial passa a ser obrigado a trocá-la.
function migrar(db) {
  const colunas = db.prepare('PRAGMA table_info(usuarios)').all()
  if (colunas.some((c) => c.name === 'trocar_senha')) return
  db.exec('ALTER TABLE usuarios ADD COLUMN trocar_senha INTEGER NOT NULL DEFAULT 0')
  for (const u of db.prepare('SELECT id, senha_hash FROM usuarios').all()) {
    if (conferirSenha(ADMIN_INICIAL.senha, u.senha_hash)) {
      db.prepare('UPDATE usuarios SET trocar_senha = 1 WHERE id = ?').run(u.id)
    }
  }
}

function publico(linha) {
  return {
    id: String(linha.id),
    usuario: linha.usuario,
    nome: linha.nome,
    papel: linha.papel,
    criadoEm: linha.criado_em,
    trocarSenha: Boolean(linha.trocar_senha),
  }
}

function validar({ usuario, nome, senha, papel }) {
  if (!/^[a-z0-9._-]{3,32}$/i.test(String(usuario ?? ''))) {
    return 'Usuário deve ter de 3 a 32 caracteres (letras, números, ponto, hífen ou sublinhado)'
  }
  if (!String(nome ?? '').trim()) return 'Informe o nome'
  if (String(senha ?? '').length < SENHA_MINIMA) {
    return `A senha deve ter pelo menos ${SENHA_MINIMA} caracteres`
  }
  if (!PAPEIS.includes(papel)) return 'Perfil inválido'
  return null
}

function criarUsuario(db, dados) {
  const erro = validar(dados)
  if (erro) throw new Error(erro)
  try {
    const r = db
      .prepare('INSERT INTO usuarios (usuario, nome, senha_hash, papel) VALUES (?, ?, ?, ?)')
      .run(dados.usuario.trim(), dados.nome.trim(), gerarHash(dados.senha), dados.papel)
    return publico(db.prepare('SELECT * FROM usuarios WHERE id = ?').get(r.lastInsertRowid))
  } catch (e) {
    if (/UNIQUE/i.test(String(e.message))) throw new Error('Esse usuário já existe')
    throw e
  }
}

/** Troca a própria senha (exigida no primeiro acesso). A nova precisa ser diferente da atual. */
function trocarSenha(db, id, atual, nova) {
  const linha = db.prepare('SELECT * FROM usuarios WHERE id = ?').get(Number(id))
  if (!linha || !conferirSenha(String(atual ?? ''), linha.senha_hash)) throw new Error('Senha atual incorreta')
  if (String(nova ?? '').length < SENHA_MINIMA) {
    throw new Error(`A nova senha deve ter pelo menos ${SENHA_MINIMA} caracteres`)
  }
  if (nova === atual) throw new Error('A nova senha deve ser diferente da atual')
  db.prepare('UPDATE usuarios SET senha_hash = ?, trocar_senha = 0 WHERE id = ?').run(gerarHash(nova), linha.id)
  return publico(db.prepare('SELECT * FROM usuarios WHERE id = ?').get(linha.id))
}

function autenticar(db, usuario, senha) {
  const linha = db.prepare('SELECT * FROM usuarios WHERE usuario = ?').get(String(usuario ?? '').trim())
  // Mesmo custo de cálculo quando o usuário não existe, para não revelar quais existem.
  const armazenado = linha ? linha.senha_hash : gerarHash('inexistente')
  const ok = conferirSenha(String(senha ?? ''), armazenado)
  return linha && ok ? publico(linha) : null
}

function listarUsuarios(db) {
  return db.prepare('SELECT * FROM usuarios ORDER BY usuario').all().map(publico)
}

module.exports = { abrirBanco, criarUsuario, trocarSenha, autenticar, listarUsuarios, ADMIN_INICIAL }
