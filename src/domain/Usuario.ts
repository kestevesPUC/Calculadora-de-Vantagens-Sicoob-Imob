export type PapelUsuario = 'admin' | 'gerente'

export interface Usuario {
  id: string
  usuario: string
  nome: string
  papel: PapelUsuario
  criadoEm: string
  /** Verdadeiro até a pessoa trocar a senha inicial. */
  trocarSenha?: boolean
}

export interface NovoUsuario {
  usuario: string
  nome: string
  senha: string
  papel: PapelUsuario
}
