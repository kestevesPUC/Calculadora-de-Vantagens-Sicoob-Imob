# 03 — Parâmetros

Os parâmetros ficam em `public/parametros.json`. Eles são carregados em tempo de execução e guardados em cache pelo service worker. Trocar esse arquivo no servidor atualiza os números sem novo build.

Regras:

- Nenhum destes valores pode aparecer fixo no código.
- Valores numéricos são **strings** para preservar a precisão decimal.
- Os fatores de rateio são **calculados** a partir das bases, nunca digitados já arredondados.
- O arquivo é validado ao carregar. Se for inválido, o app mostra erro e não calcula.

## Arquivo inicial

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

## Dicionário

| Parâmetro | Significado | Unidade |
| --- | --- | --- |
| `vigencia` | Data a partir da qual os números valem (exibida no rodapé) | data ISO |
| `resultadoProjetado` | Resultado projetado da cooperativa no exercício | R$ |
| `percentualDistribuicao` | Parte do resultado distribuída como sobras | fração (0,12 = 12%) |
| `pesosRateio.*` | Divisão do montante distribuível por produto (soma = 1) | fração |
| `basesCooperativa.depositoVista` | Saldo total de depósitos à vista da cooperativa | R$ |
| `basesCooperativa.investimentos` | Saldo total de investimentos da cooperativa | R$ |
| `basesCooperativa.receitaCobranca` | Receita anual de tarifas de cobrança | R$/ano |
| `fatorSaldoDepositoVista` | Saldo médio em conta estimado sobre o faturamento mensal | fração |
| `fatorSaldoInvestimentos` | Valor investido estimado sobre o faturamento mensal | fração |
| `custoBoleto` | Tarifa do boleto na cooperativa | R$/boleto |
| `tarifaManutencaoMensal` | Tarifa de manutenção por conta de condomínio | R$/mês |
| `premioPorCondominio` | Prêmio pago por condomínio que abre conta | R$ (único) |
| `percentualSelicContaCapital` | Parte da Selic paga sobre o capital | fração (1,00 = 100%) |
| `selicPadrao` | Selic sugerida na tela (o gerente pode alterar) | fração anual |
| `textoAviso` | Aviso legal exibido sempre no painel e no PDF | texto |

## Validações do esquema

- Todos os campos são obrigatórios.
- Valores numéricos são strings decimais ≥ 0.
- `vigencia` é uma data válida.
- Recomendado: a soma de `pesosRateio` deve ser 1. Se não for, mostrar erro.
