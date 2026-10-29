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
      criado_em TEXT NOT NULL DEFAULT (datetime('now'))
    )
  `)
  const { total } = db.prepare('SELECT COUNT(*) AS total FROM usuarios').get()
  if (total === 0) criarUsuario(db, ADMIN_INICIAL)
  return db
}

function publico(linha) {
  return {
    id: String(linha.id),
    usuario: linha.usuario,
    nome: linha.nome,
    papel: linha.papel,
    criadoEm: linha.criado_em,
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

module.exports = { abrirBanco, criarUsuario, autenticar, listarUsuarios, ADMIN_INICIAL }
