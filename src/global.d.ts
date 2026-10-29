import type { NovoUsuario, Usuario } from './domain/Usuario'

export {}

declare global {
  interface Window {
    /** Ponte exposta pelo preload do Electron (electron/preload.cjs). */
    sicoob?: {
      lerParametros: () => Promise<unknown>
      exportarPdf: (nomeSugerido: string) => Promise<boolean>
      entrar: (usuario: string, senha: string) => Promise<Usuario | null>
      sair: () => Promise<void>
      usuarioAtual: () => Promise<Usuario | null>
      listarUsuarios: () => Promise<Usuario[]>
      criarUsuario: (dados: NovoUsuario) => Promise<Usuario>
    }
  }
}
