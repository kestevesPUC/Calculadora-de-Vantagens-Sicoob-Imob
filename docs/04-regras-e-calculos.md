# 04 — Regras de negócio e cálculos

Todas as contas usam `decimal.js`. O arredondamento em 2 casas acontece **somente na exibição**.

## 1. Montantes e fatores de rateio

```
montanteDistribuivel = resultadoProjetado × percentualDistribuicao

montante[p] = montanteDistribuivel × pesosRateio[p]

fatorDAV      = montante.depositoVista / basesCooperativa.depositoVista
fatorINV      = montante.investimentos / basesCooperativa.investimentos
fatorCobranca = montante.cobranca      / basesCooperativa.receitaCobranca
```

Com os parâmetros iniciais:

| Item | Valor |
| --- | --- |
| Montante distribuível | R$ 1.860.000,00 |
| Montante DAV (40%) | R$ 744.000,00 |
| Montante investimentos (25%) | R$ 465.000,00 |
| Montante cobrança (20%) | R$ 372.000,00 |
| Montante crédito (15%) | R$ 279.000,00 (fora da v1) |
| fatorDAV | ≈ 0,7254% |
| fatorINV | ≈ 0,1295% |
| fatorCobranca | ≈ 8,5724% |

## 2. Resultados

| Resultado | Fórmula | Período |
| --- | --- | --- |
| Saldo médio DAV | `faturamentoMensal × fatorSaldoDepositoVista` | estimativa |
| Valor investido | `faturamentoMensal × fatorSaldoInvestimentos` | estimativa |
| Prêmio de abertura | `condominios × premioPorCondominio` | **único** |
| Custo mensal de boletagem | `boletosMes × custoBoleto` | por mês |
| Custo anual de boletagem | `custoMensalBoletagem × 12` | por ano |
| Retorno da cobrança | `custoAnualBoletagem × fatorCobranca` | por ano |
| Retorno DAV | `saldoMedioDAV × fatorDAV` | por ano |
| Retorno investimentos | `valorInvestido × fatorINV` | por ano |
| Remuneração do capital | `capitalSocial × selic × percentualSelicContaCapital` | por ano |
| **Total anual recorrente** | `retornoCobranca + retornoDAV + retornoInvestimentos + remuneracaoCapital` | por ano |
| **Total no primeiro ano** | `totalAnualRecorrente + premioAbertura` | primeiro ano |
| Custo efetivo do boleto | `custoBoleto × (1 − fatorCobranca)` | por boleto |
| Custo anual de manutenção | `condominios × tarifaManutencaoMensal × 12` | por ano (informativo) |

## 3. Comparação com o banco atual

Calculada só quando a tarifa atual correspondente for informada.

```
economiaBoletos    = (tarifaBoletoAtual − custoBoleto) × boletosMes × 12
economiaManutencao = (tarifaManutencaoAtual − tarifaManutencaoMensal) × condominios × 12
ganhoTotalAnualVsBancoAtual = totalAnualRecorrente + economiaBoletos + economiaManutencao
```

Se só um dos campos opcionais for preenchido, a economia do outro conta como zero (a confirmar, ver [07-pendencias.md](07-pendencias.md)).

## 4. Regras de negócio

| ID | Regra |
| --- | --- |
| RN01 | O prêmio de abertura **nunca** entra no total anual. Aparece separado e só é somado em "Total no primeiro ano" |
| RN02 | O retorno de investimentos é **adicional** ao rendimento da própria aplicação, e a tela precisa dizer isso |
| RN03 | Todo resultado exibido indica o período: "único", "por mês" ou "por ano" |
| RN04 | Economia negativa (banco atual mais barato) é exibida como está, sem esconder |
| RN05 | **Não** calcular "benefício líquido = benefícios − custo de boletagem". A administradora já paga boletos no banco atual, e essa conta mostraria um prejuízo que não existe |
| RN06 | O peso de crédito (15%) não entra na v1 |
| RN07 | Os fatores de rateio são sempre recalculados a partir das bases |
| RN08 | A Selic é editável pelo gerente; o valor inicial vem de `selicPadrao` |
| RN09 | Entrada inválida (negativa ou não numérica) bloqueia todos os resultados |
| RN10 | Todos os valores são projeções e o aviso fica sempre visível |
