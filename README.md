# Calculadora de Vantagens — Sicoob Imob.vc

Aplicativo **desktop (Electron + Node.js)** para o gerente de relacionamento mostrar a **administradoras de condomínio**, em R$, quanto elas ganham por ser cooperadas: prêmio de abertura, sobras estimadas, remuneração da conta capital e economia em relação ao banco atual.

> Todos os valores são **projeções**. A distribuição de sobras depende do resultado apurado e da aprovação em assembleia (AGO).

**Status:** v1 implementada (motor decimal, painel, dashboard, login, usuários em SQLite, PDF, atualização automática). Ver [docs/12-riscos.md](docs/12-riscos.md) para o que ainda precisa de validação.

## Documentação

| Documento | Conteúdo |
| --- | --- |
| [docs/00-spec-original.md](docs/00-spec-original.md) a [docs/09-identidade-visual.md](docs/09-identidade-visual.md) | Especificação, requisitos, parâmetros, regras, interface, testes, pendências, arquitetura e marca |
| [docs/10-prompt-desenvolvimento.json](docs/10-prompt-desenvolvimento.json) | Prompt de desenvolvimento |
| [docs/publicacao.md](docs/publicacao.md) | Instalador, versões e atualização automática |
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

Fluxo igual ao do projeto CCP, detalhado em [docs/publicacao.md](docs/publicacao.md). Com `GH_TOKEN` definido (modelo em `.env.example`):

```bash
npm run publicar
```

Isso confere o token, roda lint e testes, sobe a versão, gera o instalador e publica a release nos GitHub Releases. Os computadores instalados baixam a atualização sozinhos. Para só gerar o instalador: `npm run dist`. O repositório precisa ser público e o instalador não é assinado (o SmartScreen pode avisar).

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
