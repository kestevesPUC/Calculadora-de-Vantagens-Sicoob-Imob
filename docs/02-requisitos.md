# 02 — Requisitos

## Requisitos funcionais

| ID | Requisito | Fase |
| --- | --- | --- |
| RF01 | Carregar os parâmetros de `parametros.json` em tempo de execução e validar o esquema | v1 |
| RF02 | Bloquear o cálculo e mostrar erro se os parâmetros forem inválidos | v1 |
| RF03 | Receber as entradas da administradora (tabela abaixo) | v1 |
| RF04 | Recalcular automaticamente a cada alteração, sem botão "calcular" | v1 |
| RF05 | Validar campos com borda de erro, mensagem curta e resultados desativados | v1 |
| RF06 | Mostrar o painel de vantagens na ordem definida em [05-interface.md](05-interface.md) | v1 |
| RF07 | Mostrar a comparação com o banco atual só quando os campos opcionais forem preenchidos | v1 |
| RF08 | Modo apresentação: esconder as entradas e ampliar o painel | v1 |
| RF09 | Exportar PDF com nome da administradora, data, entradas, resultados e aviso | v1 |
| RF10 | Botão "Limpar" que restaura os valores iniciais | v1 |
| RF11 | Mostrar a data de vigência dos parâmetros no rodapé | v1 |
| RF12 | Mostrar sempre o texto de aviso no rodapé do painel | v1 |
| RF13 | Área administrativa autenticada para editar parâmetros, com histórico | v2 |
| RF14 | Registro das simulações feitas | v2 |
| RF15 | Retorno de operações de crédito | v2 |

### Entradas

| Campo | Tipo | Obrigatório | Observação |
| --- | --- | --- | --- |
| Nome da administradora | texto | não | Aparece no resumo e no PDF |
| Número de condomínios | inteiro ≥ 0 | sim | |
| Boletos por mês | inteiro ≥ 0 | sim | Boletos gerados no mês |
| Faturamento médio **mensal** (R$) | moeda ≥ 0 | sim | |
| Capital social integralizado (R$) | moeda ≥ 0 | sim | |
| Taxa Selic anual (%) | percentual ≥ 0 | sim | Pré-preenchida com `selicPadrao` |
| Tarifa atual por boleto (R$) | moeda ≥ 0 | não | Ativa a comparação |
| Tarifa atual de manutenção por conta/mês (R$) | moeda ≥ 0 | não | Ativa a comparação |

## Requisitos não funcionais

| ID | Requisito |
| --- | --- |
| RNF01 | Funcionar **offline** depois do primeiro acesso |
| RNF02 | Recalcular em menos de **200 ms** |
| RNF03 | Aritmética em **decimal** (`decimal.js`), nunca `number`, para dinheiro e fatores |
| RNF04 | Arredondar em 2 casas **somente na exibição** |
| RNF05 | Formatação pt-BR: `R$ 1.234,56`, percentuais com vírgula |
| RNF06 | Layout responsivo: duas colunas no tablet/notebook, uma no celular (a partir de 360 px) |
| RNF07 | Contraste mínimo WCAG AA e alvos de toque de pelo menos 44 px |
| RNF08 | Nenhum parâmetro de negócio fixo no código |
| RNF09 | Motor de cálculo em funções puras, sem dependência de React |
| RNF10 | Uma classe, tipo ou componente por arquivo |
| RNF11 | Sem backend na v1 e sem armazenar dados de clientes |
| RNF12 | Usar apenas logos oficiais fornecidos; nunca desenhar nem imitar o logo |

## Stack

- React + TypeScript + Vite
- Tailwind CSS (cores como tokens CSS em um único arquivo de tema)
- `decimal.js` para cálculos e `zod` para validar os parâmetros
- Vitest (motor) e Testing Library (componentes)
- PWA com service worker (ver a decisão D1 em [07-pendencias.md](07-pendencias.md))
