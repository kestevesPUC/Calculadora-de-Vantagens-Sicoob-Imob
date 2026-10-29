'use strict'
// Configuração de empacotamento (electron-builder). Veja docs/publicacao.md.
//
// Canal de atualização: release.config.json (modelo em release.config.example.json). Sem esse arquivo o
// instalador é gerado normalmente, porém sem atualização automática.
const fs = require('node:fs')
const path = require('node:path')

const releaseFile = path.join(__dirname, 'release.config.json')
const publish = fs.existsSync(releaseFile)
  ? [JSON.parse(fs.readFileSync(releaseFile, 'utf8'))]
  : undefined

module.exports = {
  appId: 'br.com.sicoob.imobvc.calculadora',
  productName: 'Calculadora Sicoob Imob.vc',
  copyright: 'Desenvolvido por Kaio Gomes',
  // Lista permitida: nada além disto entra no instalador (evita .env com token, docs e dados).
  files: ['dist/**/*', 'electron/**/*.cjs', 'package.json'],
  directories: { output: 'release' },
  ...(publish && { publish }),
  win: { target: ['nsis', 'portable'] },
  nsis: {
    // Instalação por usuário (sem administrador). Desinstalar NÃO apaga os dados
    // (ficam em Documentos\Calculadora Sicoob Imob.vc).
    oneClick: false,
    perMachine: false,
    allowToChangeInstallationDirectory: true,
    createDesktopShortcut: true,
    createStartMenuShortcut: true,
    shortcutName: 'Calculadora Sicoob Imob.vc',
    deleteAppDataOnUninstall: false,
    artifactName: 'Calculadora-Sicoob-Setup-${version}.${ext}',
    language: '1046', // português (Brasil)
  },
  portable: { artifactName: 'Calculadora-Sicoob-Portatil-${version}.${ext}' },
}
