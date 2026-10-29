# 06 — Casos de teste

Valores esperados arredondados em 2 casas. Tolerância: R$ 0,01. Os valores do Caso A e do Caso C foram conferidos manualmente com as fórmulas de [04-regras-e-calculos.md](04-regras-e-calculos.md).

## Caso A — referência da gerente

Entradas: 40 condomínios, 2.000 boletos/mês, faturamento mensal R$ 500.000,00, capital R$ 20.000,00, Selic 15%.

| Saída | Conta | Esperado |
| --- | --- | --- |
| Prêmio de abertura | 40 × 50 | 2.000,00 |
| Custo mensal de boletagem | 2.000 × 1,70 | 3.400,00 |
| Custo anual de boletagem | 3.400 × 12 | 40.800,00 |
| Retorno da cobrança | 40.800 × 8,5724% | 3.497,53 |
| Saldo médio DAV | 500.000 × 9,13% | 45.650,00 |
| Retorno DAV | 45.650 × 0,7254% | 331,16 |
| Valor investido | 500.000 × 9,60% | 48.000,00 |
| Retorno investimentos | 48.000 × 0,1295% | 62,17 |
| Remuneração do capital | 20.000 × 15% × 100% | 3.000,00 |
| Total anual recorrente | soma | 6.890,86 |
| Total no primeiro ano | 6.890,86 + 2.000 | 8.890,86 |

## Caso B — tudo zero

Todas as entradas numéricas iguais a 0. Todas as saídas são 0,00 e não há erro.

## Caso C — comparação

Caso A com tarifa de boleto atual R$ 2,50 e manutenção atual R$ 80,00.

| Saída | Conta | Esperado |
| --- | --- | --- |
| economiaBoletos | (2,50 − 1,70) × 2.000 × 12 | 19.200,00 |
| economiaManutencao | (80 − 50) × 40 × 12 | 14.400,00 |
| ganhoTotalAnualVsBancoAtual | 6.890,86 + 19.200 + 14.400 | 40.490,86 |

## Caso D — parâmetros

Mudar `percentualDistribuicao` para 0,10 recalcula todos os fatores, sem alterar código.

## Caso E — validação

Valor negativo ou texto em campo numérico bloqueia o cálculo e mostra mensagem.

## Casos adicionais sugeridos

| Caso | Cenário | Esperado |
| --- | --- | --- |
| F | Tarifa atual menor que a da cooperativa | Economia negativa exibida sem esconder |
| G | `parametros.json` inválido ou ausente | Mensagem de erro e nenhum cálculo |
| H | Só um campo de comparação preenchido | Comparação parcial (regra a confirmar) |
| I | Campo vazio durante a digitação | Sem erro antes de o usuário sair do campo |
| J | Valores muito grandes (ex.: R$ 1 bilhão) | Sem perda de precisão |
