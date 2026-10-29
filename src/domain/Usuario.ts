export type PapelUsuario = 'admin' | 'gerente'

export interface Usuario {
  id: string
  usuario: string
  nome: string
  papel: PapelUsuario
  criadoEm: string
}

export interface NovoUsuario {
  usuario: string
  nome: string
  senha: string
  papel: PapelUsuario
}
