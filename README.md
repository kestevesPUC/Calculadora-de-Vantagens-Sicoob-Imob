# Calculadora de Vantagens — Sicoob Imob.vc

Aplicativo **desktop (Electron + Node.js)** para o gerente de relacionamento mostrar a **administradoras de condomínio**, em R$, quanto elas ganham por ser cooperadas: prêmio de abertura, sobras estimadas, remuneração da conta capital e economia em relação ao banco atual.

> Todos os valores são **projeções**. A distribuição de sobras depende do resultado apurado e da aprovação em assembleia (AGO).

**Status:** v1 implementada (motor decimal, painel, dashboard, login, usuários em SQLite, PDF, atualização automática). Ver [docs/12-riscos.md](docs/12-riscos.md) para o que ainda precisa de validação.

## Documentação

| Documento | Conteúdo |
| --- | --- |
| [docs/00-spec-original.md](docs/00-spec-original.md) a [docs/09-identidade-visual.md](docs/09-identidade-visual.md) | Especificação, requisitos, parâmetros, regras, interface, testes, pendências, arquitetura e marca |
| [docs/10-prompt-desenvolvimento.json](docs/10-prompt-desenvolvimento.json) | Prompt de desenvolvimento |
| [docs/11-decisoes.md](docs/11-decisoes.md) | Decisões, hipóteses e matriz de rastreabilidade |
| [docs/12-riscos.md](docs/12-riscos.md) | Riscos, pendências abertas e recomendações |

## Como rodar

```bash
npm install
```

Aplicativo em modo desenvolvimento (Vite + Electron):

```bash
npm run electron:dev
```

Aplicativo a partir do build:

```bash
npm start
```

Testes, lint e build:

```bash
npm run test
```

```bash
npm run lint
```

```bash
npm run build
```

## Primeiro acesso

Usuário `admin`, senha `123456`. Administradores criam novos usuários na aba **Usuários** (perfis: Administrador e Gerente). **Troque esta senha antes de usar com clientes.**

## Onde ficam os dados

Em `Documentos\Calculadora Sicoob Imob.vc\`:

- `sicoob.db`: banco SQLite com os usuários (senhas com hash scrypt).
- `parametros.json` (opcional): se existir, tem precedência sobre o arquivo embutido.

Essa pasta fica fora da instalação, então **desinstalar e reinstalar mantém os dados**. Para backup, copie a pasta. Dados digitados nas simulações não são gravados.

## Como atualizar os parâmetros

1. Edite `public/parametros.json` (números como texto, com ponto decimal, ex.: `"0.12"`) e atualize `vigencia`.
2. Publique uma nova versão (abaixo), ou copie o arquivo para a pasta de dados acima para valer só naquela máquina.

Se o arquivo for inválido, o app mostra o erro e não calcula. Dicionário em [docs/03-parametros.md](docs/03-parametros.md).

## Publicar versões e atualização automática

O app instalado busca novas versões nos **GitHub Releases** do repositório e oferece reiniciar para instalar.

1. Altere `version` em `package.json`.
2. Crie e envie a tag:

```bash
git tag v1.0.1
```

```bash
git push origin v1.0.1
```

O workflow `.github/workflows/release.yml` roda lint e testes, gera o instalador Windows e publica a release. Para publicar do seu computador, defina `GH_TOKEN` e rode `npm run release`. Instalador local sem publicar: `npm run dist`.

O instalador não é assinado digitalmente: o Windows SmartScreen pode avisar na instalação. O repositório precisa ser público para o atualizador funcionar sem token.

## Logo

Coloque o logo oficial em `public/brand/logo-sicoob-imobvc.svg`. Sem o arquivo, o app mostra um espaço reservado com o texto "Sicoob Imob.vc". Não desenhe nem imite o logo. Largura mínima de 64 px e área de arejamento de 2X, conforme [docs/09-identidade-visual.md](docs/09-identidade-visual.md).

## Premissas a validar antes do uso com clientes

- Receita anual de cobrança (R$ 4.339.523,32) como base do rateio.
- Faturamento mensal como base dos fatores 9,13% e 9,60%.
- Tarifa de manutenção de R$ 50,00 mensal por conta de condomínio.
- Condições da campanha do prêmio de R$ 50,00 por condomínio.
- Remuneração do capital a 100% da Selic.
- Texto do aviso aprovado pelo compliance.
- Arquivo oficial do logo Sicoob Imob.vc e suas regras de redução.
- Valor oficial da turquesa (o guia traz HEX e RGB diferentes).
- Uso do roxo como cor de erro, já que o vermelho é proibido pelo guia.

Lista completa em [docs/07-pendencias.md](docs/07-pendencias.md).

## Licença

[MIT](LICENSE). A fonte Asap (SIL OFL) acompanha a licença em `public/fonts/LICENSE-Asap.txt`.
