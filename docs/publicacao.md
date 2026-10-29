# Publicação, instalação e atualizações

Mesmo fluxo do projeto CCP (JRP Engenharia): publicação a partir do computador do desenvolvedor, com `GH_TOKEN`.

## Instalador

`npm run dist` (com o programa fechado) gera em `release/`:

| Arquivo | Uso |
| --- | --- |
| `Calculadora-Sicoob-Setup-<versão>.exe` | instalador (por usuário, sem administrador; atalhos; permite escolher a pasta) |
| `latest.yml` e `*.blockmap` | metadados de atualização |

## Onde ficam os dados

`Documentos\Calculadora Sicoob Imob.vc\` (`sicoob.db` e `parametros.json` opcional). Fica fora da pasta do programa e o instalador usa `deleteAppDataOnUninstall: false`: **desinstalar, reinstalar e atualizar mantêm os dados.** Não altere o caminho no código, ou o programa abriria um banco vazio.

## Canal de atualização (já configurado)

`release.config.json` aponta para `kestevesPUC/Calculadora-de-Vantagens-Sicoob-Imob` (GitHub Releases, `releaseType: "release"`). Sem esse arquivo o instalador é gerado, porém sem atualização automática.

Para publicar, crie um token em GitHub → *Settings → Developer settings → Personal access tokens → Fine-grained*, com acesso a este repositório e permissão **Contents: Read and write**. Na pasta do projeto crie `.env` (ignorado pelo Git; modelo em `.env.example`) com `GH_TOKEN=github_pat_...`, ou use `$env:GH_TOKEN = "github_pat_..."` no PowerShell. Nunca versione o token.

Para os computadores se atualizarem, o repositório precisa ser **público**.

## Publicar uma nova versão

```bash
git add -A && git commit -m "descreva a mudança"
npm run publicar
git push
```

`npm run publicar` (`scripts/release.cjs`) confere token e acesso ao repositório antes de alterar qualquer coisa, roda `lint` e `test`, sobe a versão (patch), compila a interface, cria a release `vX.Y.Z` e anexa `Setup.exe`, `.blockmap` e `latest.yml`. Se falhar depois de subir a versão, restaura o número anterior. Mudança maior: `npm run publicar:minor`.

A versão do `package.json` precisa ser **maior** que a instalada. Nunca reaproveite um número.

## O que acontece nos computadores

1. O app instalado verifica atualizações ~15 s depois de abrir e a cada 6 h.
2. A versão nova é baixada em segundo plano; ao terminar, aparece "Reiniciar agora" ou "Depois".
3. Escolhendo "Depois", a atualização é instalada ao fechar o programa. Os dados são preservados.

## Cuidados

- Teste cada versão instalando por cima da anterior (os usuários devem continuar lá).
- O executável não é assinado: o SmartScreen pode avisar na primeira instalação ("Mais informações → Executar assim mesmo").
- O ícone usa o padrão do Electron até existir `build/icon.png`.
