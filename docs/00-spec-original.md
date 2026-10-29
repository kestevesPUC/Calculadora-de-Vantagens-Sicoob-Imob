# Calculadora de Vantagens — Sicoob Imob.vc

> Especificação para o Claude Code. Leia o documento inteiro antes de começar.
> Comece pelo **plano** (seção 10). Não escreva código de interface antes de o motor de cálculo estar testado.

---

## 1. Contexto

Ferramenta comercial que o gerente da cooperativa usa em **eventos e visitas de captação** com **administradoras de condomínio**. O gerente digita poucos dados da administradora e a tela mostra, em R$, quanto ela ganha por ser cooperada: prêmio de abertura, sobras estimadas e remuneração da conta capital.

- Usuário principal: gerente de relacionamento (opera a tela).
- Quem vê: a administradora (a tela é virada para o cliente).
- Quem mantém os números: a área de negócios da cooperativa.

Todos os valores são **projeções**. A distribuição de sobras depende do resultado apurado e da aprovação em assembleia (AGO).

---

## 2. Stack e restrições técnicas

- **Aplicação web estática, instalável como PWA, que funciona offline** depois do primeiro acesso.
- React + TypeScript + Vite. Estilo com Tailwind CSS.
- **Aritmética em decimal** (`decimal.js`). Nunca use `number` para dinheiro ou fatores. Arredonde em 2 casas **somente na exibição**.
- Formatação pt-BR: `R$ 1.234,56`, percentuais com vírgula.
- Testes: Vitest (motor de cálculo) e Testing Library (componentes principais).
- **Sem backend na v1.** Os parâmetros ficam em `public/parametros.json`, carregado em tempo de execução e guardado em cache pelo service worker. Trocar esse arquivo no servidor atualiza os números sem novo build.
- **Uma classe/tipo/componente por arquivo.** Sem exceções.
- Motor de cálculo em funções puras, sem dependência de React, em `src/domain/`.

---

## 3. Parâmetros (`public/parametros.json`)

Nenhum destes valores pode aparecer fixo no código. Os fatores de rateio são **calculados** a partir das bases, nunca digitados já arredondados.

```json
{
  "vigencia": "2026-01-01",
  "resultadoProjetado": "15500000.00",
  "percentualDistribuicao": "0.12",
  "pesosRateio": {
    "depositoVista": "0.40",
    "investimentos": "0.25",
    "cobranca": "0.20",
    "credito": "0.15"
  },
  "basesCooperativa": {
    "depositoVista": "102559246.79",
    "investimentos": "359016883.85",
    "receitaCobranca": "4339523.32"
  },
  "fatorSaldoDepositoVista": "0.0913",
  "fatorSaldoInvestimentos": "0.0960",
  "custoBoleto": "1.70",
  "tarifaManutencaoMensal": "50.00",
  "premioPorCondominio": "50.00",
  "percentualSelicContaCapital": "1.00",
  "selicPadrao": "0.15",
  "textoAviso": "Valores estimados para fins de simulação comercial. A distribuição de sobras depende do resultado apurado e da aprovação em assembleia, conforme as regras vigentes da cooperativa. Não há garantia de rentabilidade."
}
```

Valide o JSON ao carregar (por exemplo, com `zod`). Se for inválido, mostre uma mensagem de erro e não calcule.

> `selicPadrao` de 15% é só um valor inicial. O gerente ajusta na tela.

---

## 4. Entradas (tela do gerente)

| Campo | Tipo | Obrigatório | Observação |
| --- | --- | --- | --- |
| Nome da administradora | texto | não | Aparece no resumo/PDF |
| Número de condomínios | inteiro ≥ 0 | sim | |
| Boletos por mês | inteiro ≥ 0 | sim | Unidades/boletos gerados no mês |
| Faturamento médio **mensal** (R$) | moeda ≥ 0 | sim | |
| Capital social integralizado (R$) | moeda ≥ 0 | sim | |
| Taxa Selic anual (%) | percentual ≥ 0 | sim | Pré-preenchido com `selicPadrao` |
| Tarifa atual por boleto no banco do cliente (R$) | moeda ≥ 0 | não | Ativa o bloco de comparação |
| Tarifa atual de manutenção por conta/mês (R$) | moeda ≥ 0 | não | Ativa o bloco de comparação |

- Máscara de moeda e de percentual nos campos.
- Recalcular a cada alteração (sem botão "calcular"), em menos de 200 ms.
- Campo inválido: borda de erro, mensagem curta e resultados desativados.

---

## 5. Fórmulas (motor de cálculo)

### 5.1 Montantes e fatores

```
montanteDistribuivel = resultadoProjetado × percentualDistribuicao        // 1.860.000,00

montante[p] = montanteDistribuivel × pesosRateio[p]
    // DAV 744.000 | INV 465.000 | Cobrança 372.000 | Crédito 279.000

fatorDAV      = montante.depositoVista  / basesCooperativa.depositoVista    // ≈ 0,7254%
fatorINV      = montante.investimentos  / basesCooperativa.investimentos    // ≈ 0,1295%
fatorCobranca = montante.cobranca       / basesCooperativa.receitaCobranca  // ≈ 8,5724%
```

Crédito (peso de 15%) **não** entra na v1: não há entrada para ele.

### 5.2 Resultados

```
saldoMedioDAV          = faturamentoMensal × fatorSaldoDepositoVista
valorInvestido         = faturamentoMensal × fatorSaldoInvestimentos

premioAbertura         = condominios × premioPorCondominio              // pagamento ÚNICO

custoMensalBoletagem   = boletosMes × custoBoleto
custoAnualBoletagem    = custoMensalBoletagem × 12
retornoCobranca        = custoAnualBoletagem × fatorCobranca            // anual

retornoDAV             = saldoMedioDAV  × fatorDAV                       // anual
retornoInvestimentos   = valorInvestido × fatorINV                       // anual
remuneracaoCapital     = capitalSocial × selic × percentualSelicContaCapital   // anual

totalAnualRecorrente   = retornoCobranca + retornoDAV + retornoInvestimentos + remuneracaoCapital
totalPrimeiroAno       = totalAnualRecorrente + premioAbertura

custoEfetivoBoleto     = custoBoleto × (1 − fatorCobranca)
custoAnualManutencao   = condominios × tarifaManutencaoMensal × 12      // informativo
```

### 5.3 Comparação com o banco atual (só quando os campos opcionais forem preenchidos)

```
economiaBoletos     = (tarifaBoletoAtual − custoBoleto) × boletosMes × 12
economiaManutencao  = (tarifaManutencaoAtual − tarifaManutencaoMensal) × condominios × 12
ganhoTotalAnualVsBancoAtual = totalAnualRecorrente + economiaBoletos + economiaManutencao
```

> **Não** implemente "benefício líquido = benefícios − custo anual de boletagem". A administradora já paga boletos no banco atual, então essa conta mostraria um prejuízo que não existe. A única comparação de custo é a da seção 5.3.

### 5.4 Regras

- O prêmio de abertura **nunca** entra no total anual. Ele aparece separado e só é somado em `totalPrimeiroAno`, com o rótulo "no primeiro ano".
- O retorno de investimentos é **adicional** ao rendimento da própria aplicação. A tela precisa dizer isso.
- Todo resultado exibido indica o período: "único", "por mês" ou "por ano".
- Uma economia negativa na comparação (banco atual mais barato) é exibida como está, sem esconder.

---

## 6. Interface

Layout em duas colunas no tablet/notebook e uma coluna no celular (a partir de 360 px de largura).

**Coluna 1 — Dados da administradora:** os campos da seção 4. Os campos opcionais de comparação ficam em uma seção recolhível, "Comparar com o banco atual".

**Coluna 2 — Painel de vantagens**, nesta ordem:

1. **Destaque principal:** total anual recorrente em fonte grande. Abaixo, menor: "+ R$ X de prêmio na abertura" e "Total no primeiro ano: R$ Y".
2. **Prêmio de abertura** (único).
3. **Sobras estimadas por ano:** cobrança, depósito à vista e investimentos, cada um com valor e uma linha explicando a base.
4. **Remuneração da conta capital** (por ano), com a Selic usada.
5. **Custo da cobrança:** custo mensal, custo anual e custo efetivo do boleto depois do retorno.
6. **Comparação com o banco atual** (só quando preenchida).
7. Bloco recolhível **"Seu perfil na cooperativa"**: saldo médio DAV e valor investido estimados.
8. **Aviso** (`textoAviso`), sempre visível no rodapé do painel.

**Identidade visual**
- Use apenas logos fornecidos em `public/brand/` (`logo-sicoob-imobvc.svg`). Se o arquivo não existir, mostre um espaço reservado com o texto "Sicoob Imob.vc" e avise no README. **Não desenhe nem imite o logo.**
- Cores como tokens CSS em um único arquivo de tema. Valores iniciais (confirmar com o manual de marca do Sicoob): turquesa `#00AE9D`, verde-escuro `#003641`, verde-claro `#C9D200`, verde-médio `#7DB61C`, fundo `#FFFFFF`.
- Contraste mínimo WCAG AA. Alvos de toque de pelo menos 44 px.
- Modo apresentação: botão que esconde a coluna de entradas e amplia o painel para virar a tela para o cliente.

---

## 7. Funcionalidades por fase

**v1 (fazer agora)**
- Entradas, cálculo em tempo real e painel completo (seções 4 a 6).
- Parâmetros em `public/parametros.json`, com data de vigência exibida no rodapé.
- PWA offline.
- Botão "Exportar PDF" da simulação (nome da administradora, data, entradas, resultados e aviso), gerado no navegador.
- Botão "Limpar".

**v2 (não fazer agora; deixe a arquitetura pronta)**
- Área administrativa autenticada para editar parâmetros, com histórico.
- Registro das simulações feitas (gerente, data, administradora).
- Retorno de operações de crédito.

---

## 8. Estrutura sugerida

```
src/
  domain/
    Parametros.ts              // tipo dos parâmetros
    EntradaSimulacao.ts        // tipo das entradas
    ResultadoSimulacao.ts      // tipo dos resultados
    calcularFatores.ts
    calcularSimulacao.ts
    calcularComparacao.ts
    __tests__/
  config/
    carregarParametros.ts      // fetch + validação zod
    parametrosSchema.ts
  ui/
    components/                // um componente por arquivo
    theme/tokens.css
  format/
    formatarMoeda.ts
    formatarPercentual.ts
public/
  parametros.json
  brand/
```

---

## 9. Casos de teste obrigatórios

Valores esperados arredondados em 2 casas. Tolerância: R$ 0,01.

**Caso A — referência da gerente**
Entradas: 40 condomínios, 2.000 boletos/mês, faturamento mensal R$ 500.000,00, capital R$ 20.000,00, Selic 15%.

| Saída | Esperado |
| --- | --- |
| Prêmio de abertura | 2.000,00 |
| Custo mensal de boletagem | 3.400,00 |
| Custo anual de boletagem | 40.800,00 |
| Retorno da cobrança | 3.497,53 |
| Saldo médio DAV | 45.650,00 |
| Retorno DAV | 331,16 |
| Valor investido | 48.000,00 |
| Retorno investimentos | 62,17 |
| Remuneração do capital | 3.000,00 |
| Total anual recorrente | 6.890,86 |
| Total no primeiro ano | 8.890,86 |

**Caso B — tudo zero:** todas as saídas são 0,00 e não há erro.

**Caso C — comparação:** Caso A com tarifa de boleto atual R$ 2,50 e manutenção atual R$ 80,00.
`economiaBoletos` = 19.200,00 · `economiaManutencao` = 14.400,00 · `ganhoTotalAnualVsBancoAtual` = 40.490,86.

**Caso D — parâmetros:** mudar `percentualDistribuicao` para 0,10 recalcula todos os fatores, sem alterar código.

**Caso E — validação:** valor negativo ou texto em campo numérico bloqueia o cálculo com mensagem.

---

## 10. Como trabalhar

1. Leia esta especificação e proponha um plano curto antes de escrever código.
2. Crie o projeto e o `parametros.json`.
3. Implemente `src/domain/` com testes primeiro (casos A a E). Rode e mostre os testes passando.
4. Implemente a interface, depois o PWA offline, depois a exportação em PDF.
5. Ao terminar cada etapa, rode `npm run test`, `npm run lint` e `npm run build`.
6. Escreva um README com: como rodar, como atualizar `parametros.json`, onde colocar o logo e a lista de premissas a validar (seção 11).
7. Se encontrar ambiguidade, **pergunte** em vez de inventar regra de negócio.

---

## 11. Premissas ainda não validadas com a cooperativa

Implemente como parâmetro, mas liste no README para validação:

- `receitaCobranca` (R$ 4.339.523,32) é a receita anual de tarifas de cobrança e é a base certa para o rateio.
- O faturamento informado é mensal, e 9,13% / 9,60% valem sobre ele.
- A tarifa de manutenção de R$ 50,00 é mensal, por conta de condomínio.
- O prêmio de R$ 50,00 vale para cada condomínio que abrir conta; condições da campanha a confirmar.
- Remuneração do capital a 100% da Selic, sem limitações adicionais.
- Texto do aviso aprovado pelo compliance.
- Cores e logo conforme o manual de marca.
