'use strict'
const { app, BrowserWindow, ipcMain, dialog } = require('electron')
const fs = require('node:fs')
const path = require('node:path')
const { abrirBanco, autenticar, criarUsuario, listarUsuarios } = require('./usuarios.cjs')

const DEV = process.env.ELECTRON_DEV === '1'
let janela = null
let banco = null
let sessao = null // usuário autenticado; mantido só no processo principal

function lerParametros() {
  // Cópia em userData (se existir) tem precedência: permite atualizar sem novo build.
  const candidatos = [
    path.join(pastaDados(), 'parametros.json'),
    path.join(__dirname, '..', DEV ? 'public' : 'dist', 'parametros.json'),
  ]
  const arquivo = candidatos.find((c) => fs.existsSync(c))
  if (!arquivo) throw new Error('parametros.json não encontrado')
  return fs.readFileSync(arquivo, 'utf8')
}

function exigirAdmin() {
  if (!sessao || sessao.papel !== 'admin') throw new Error('Apenas administradores podem fazer isso')
}

function registrarIpc() {
  ipcMain.handle('parametros:ler', () => lerParametros())

  ipcMain.handle('auth:entrar', (_e, usuario, senha) => {
    sessao = autenticar(banco, usuario, senha)
    return sessao
  })
  ipcMain.handle('auth:sair', () => {
    sessao = null
  })
  ipcMain.handle('auth:atual', () => sessao)

  ipcMain.handle('usuarios:listar', () => {
    exigirAdmin()
    return listarUsuarios(banco)
  })
  ipcMain.handle('usuarios:criar', (_e, dados) => {
    exigirAdmin()
    return criarUsuario(banco, dados)
  })

  ipcMain.handle('pdf:exportar', async (_e, nomeSugerido) => {
    if (!sessao) throw new Error('Faça login para exportar')
    const { canceled, filePath } = await dialog.showSaveDialog(janela, {
      defaultPath: `${String(nomeSugerido).replace(/[\\/:*?"<>|]/g, '_')}.pdf`,
      filters: [{ name: 'PDF', extensions: ['pdf'] }],
    })
    if (canceled || !filePath) return false
    const dados = await janela.webContents.printToPDF({
      printBackground: true,
      pageSize: 'A4',
      preferCSSPageSize: true,
    })
    fs.writeFileSync(filePath, dados)
    return true
  })
}

function criarJanela() {
  janela = new BrowserWindow({
    width: 1280,
    height: 860,
    minWidth: 360,
    icon: path.join(__dirname, 'icone.png'),
    title: 'Calculadora de Vantagens — Sicoob Imob.vc',
    webPreferences: {
      preload: path.join(__dirname, 'preload.cjs'),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true,
    },
  })
  janela.setMenuBarVisibility(false)
  if (DEV) janela.loadURL('http://localhost:5173')
  else janela.loadFile(path.join(__dirname, '..', 'dist', 'index.html'))
}

// Dados ficam em Documentos, fora da pasta de instalação e do userData: sobrevivem a
// desinstalar/reinstalar e são fáceis de copiar para backup.
function pastaDados() {
  const pasta =
    process.env.SICOOB_DADOS || path.join(app.getPath('documents'), 'Calculadora Sicoob Imob.vc')
  fs.mkdirSync(pasta, { recursive: true })
  return pasta
}

app.whenReady().then(() => {
  banco = abrirBanco(path.join(pastaDados(), 'sicoob.db'))
  registrarIpc()
  criarJanela()
  buscarAtualizacao()
})

// Atualização automática via GitHub Releases (só no app instalado).
function buscarAtualizacao() {
  if (!app.isPackaged) return
  const { autoUpdater } = require('electron-updater')
  autoUpdater.autoInstallOnAppQuit = true
  autoUpdater.on('error', (e) => console.error('Falha ao buscar atualização:', e.message))
  autoUpdater.on('update-downloaded', async () => {
    const { response } = await dialog.showMessageBox(janela, {
      type: 'info',
      buttons: ['Reiniciar agora', 'Depois'],
      defaultId: 0,
      message: 'Uma nova versão foi baixada.',
      detail: 'Reinicie para instalar. Seus dados são mantidos.',
    })
    if (response === 0) autoUpdater.quitAndInstall()
  })
  const verificar = () => autoUpdater.checkForUpdates().catch((e) => console.error(e.message))
  // Como no CCP: ~15 s depois de abrir e a cada 6 h. Escolhendo "Depois", instala ao fechar.
  setTimeout(verificar, 15_000)
  setInterval(verificar, 6 * 60 * 60 * 1000)
}

app.on('window-all-closed', () => {
  if (banco) banco.close()
  app.quit()
})
