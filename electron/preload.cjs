'use strict'
const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('sicoob', {
  lerParametros: () => ipcRenderer.invoke('parametros:ler'),
  exportarPdf: (nomeSugerido) => ipcRenderer.invoke('pdf:exportar', nomeSugerido),
  entrar: (usuario, senha) => ipcRenderer.invoke('auth:entrar', usuario, senha),
  sair: () => ipcRenderer.invoke('auth:sair'),
  usuarioAtual: () => ipcRenderer.invoke('auth:atual'),
  listarUsuarios: () => ipcRenderer.invoke('usuarios:listar'),
  criarUsuario: (dados) => ipcRenderer.invoke('usuarios:criar', dados),
})
