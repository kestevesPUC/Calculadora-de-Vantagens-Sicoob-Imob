# 11 — Decisões, hipóteses e rastreabilidade

## Decisões arquiteturais

| # | Decisão | Motivo |
| --- | --- | --- |
| A1 | **D1 resolvida: desktop com Electron (Node.js)**, a pedido do responsável pelo projeto. Substitui PWA e service worker | Pedido explícito; `domain`, `config`, `format` e `ui` seguem independentes da plataforma |
| A2 | Estrutura de `docs/08` mantida (`domain`, `config`, `format`, `ui`) mais `electron/` para o processo principal | Pedido "mesma estrutura" |
| A3 | Camadas: `parametros.json` → `config` (zod) → `domain` (Decimal) → `format` → `ui` | `docs/08` |
| A4 | Banco **SQLite** nativo do Node (`node:sqlite`, Node 24 do Electron 45): sem módulo nativo para recompilar | Menos dependências e risco de build |
| A5 | Dados em `Documentos\Calculadora Sicoob Imob.vc\`, fora da instalação | Sobrevivem à desinstalação; fáceis de copiar |
| A6 | Senhas com hash scrypt e sal; sessão mantida só no processo principal; criar/listar usuários exige perfil admin no processo principal | Segurança não depende da interface |
| A7 | `contextIsolation`, `sandbox` e CSP restritiva; a interface só acessa a ponte `window.sicoob` | Boas práticas Electron |
| A8 | PDF por `printToPDF` de uma visão de impressão (`RelatorioImpressao`) com os mesmos tokens de marca | Sem dependência extra; mesma identidade visual |
| A9 | Atualização automática por `electron-updater` + GitHub Releases, publicada pelo comando `npm run publicar` como no projeto CCP | Pedido do responsável |
| A10 | Gráficos em SVG/CSS próprios com a paleta da marca; todo valor também aparece em texto | Sem biblioteca extra; cor nunca é o único sinal |

## Decisões de UX

- Duas colunas a partir de `lg`, uma coluna no celular; alvos de 44 px e texto mínimo de 14 px.
- Erro em roxo com ícone e texto; nunca vermelho, laranja, azul ou amarelo.
- Campo vazio só mostra erro ao sair do campo (caso I); resultados ficam desativados enquanto houver pendência.
- Economia negativa aparece com sinal "−" e o rótulo "o banco atual é mais barato".
- Modo apresentação esconde as entradas; total anual em 72 px.
- Dashboard: indicadores, rosca de composição, barras por fonte e comparação (quando houver).
- Botão primário turquesa com texto verde-escuro. Verde-claro só sobre verde-escuro.

## Hipóteses (marcadas no código com `// HIPÓTESE:`)

| Id | Hipótese | Onde |
| --- | --- | --- |
| D1 | Desktop Electron (decisão do responsável) | `electron/` |
| D3 | Mostrar a nota "Sobras de crédito não consideradas" | `PainelVantagens.tsx` |
| D4 | Com só um campo de comparação, o outro conta como zero | `calcularComparacao.ts` |
| D5 | Parâmetros vão embutidos na instalação; sem internet não há perda | `electron/main.cjs` |
| P13 | Área de arejamento do logo fixa em 16 px | `Logo.tsx` |
| — | Acesso inicial `admin` / `123456`, a pedido do responsável | `electron/usuarios.cjs` |
| — | Campos numéricos aceitam pt-BR (`1.234,56`); formatos ambíguos como `1.5` são rejeitados | `lerNumeroBR.ts` |
| — | Campos começam vazios (Selic vem de `selicPadrao`); "Limpar" volta a isso | `useSimulacao.ts` |

Itens da v2 (área administrativa de parâmetros com histórico, registro de simulações, crédito) **não** foram implementados. O cadastro de usuários foi pedido expressamente e não grava dados de clientes.

## Matriz de rastreabilidade

| Requisito | Módulo | Teste |
| --- | --- | --- |
| RF01, RF02 | `config/carregarParametros.ts`, `parametrosSchema.ts` | `config/__tests__/carregarParametros.test.ts`; App (caso G) |
| RF03, RF05, RN09 | `domain/validarEntrada.ts`, `lerNumeroBR.ts`, `Campo.tsx` | `validarEntrada.test.ts`; App (casos E, I) |
| RF04, RNF02 | `useSimulacao.ts` | App (caso A); `desempenho.test.ts` |
| RF06 | `PainelVantagens.tsx` | App (caso A) |
| RF07, RN04 | `calcularComparacao.ts`, `PainelVantagens.tsx` | `calcularComparacao.test.ts` (C, F, H); App (caso C) |
| RF08 | `App.tsx` | App (modo apresentação) |
| RF09 | `RelatorioImpressao.tsx`, `electron/main.cjs` | App (PDF e escape do nome) |
| RF10 | `useSimulacao.ts` | App (Limpar) |
| RF11, RF12, RN10 | `Aviso.tsx` | App (aviso e vigência) |
| RNF03 | `domain/*` (Decimal) | `semNumber.test.ts` |
| RNF04, RNF05 | `format/*` | `formatar.test.ts` |
| RNF08 | `public/parametros.json` | `calcularFatores.test.ts` (caso D) |
| RN01, RN03, RN05 | `calcularSimulacao.ts`, `LinhaResultado.tsx` | `calcularSimulacao.test.ts` |
| RN02, RN06, RN07 | `PainelVantagens.tsx`, `calcularFatores.ts` | `calcularFatores.test.ts` |
| RN08 | `useSimulacao.ts` | App (Selic inicial 15,00) |
| RNF06, RNF07 | `index.css`, componentes | revisão visual (checklist em `docs/12-riscos.md`) |
| RNF09, RNF10 | `domain/`, um componente por arquivo | revisão |
| RNF11 | sem backend; SQLite só guarda usuários | revisão |
| RNF12 | `Logo.tsx` | revisão |
| RNF01 | app local, parâmetros embutidos | execução do Electron |
| RF13 a RF15 | v2, fora do escopo | — |
| Login e usuários | `electron/usuarios.cjs`, `TelaLogin.tsx`, `GestaoUsuarios.tsx` | `electron/__tests__/usuarios.test.ts`; App |
