# 07 — Decisões e premissas pendentes

Tudo abaixo está implementado (ou será) como parâmetro, mas precisa de validação antes de usar com clientes.

## Decisões de projeto

| ID | Decisão | Opções | Status |
| --- | --- | --- | --- |
| D1 | Plataforma | PWA web (como na especificação) ou app desktop (Electron/Tauri) | **Aberta** |
| D2 | Quem atualiza `parametros.json` e onde fica hospedado | Servidor da cooperativa, importação pela tela ou novo instalador | **Aberta** |
| D3 | Sobras de crédito (15%) fora da v1 | Omitir em silêncio ou mostrar nota "crédito não considerado" | **Aberta** |
| D4 | Comparação com só um campo preenchido | Calcular parcial ou exigir os dois | **Aberta** |
| D5 | Primeiro uso sem internet (parâmetros nunca baixados) | Embutir parâmetros no build como reserva ou mostrar erro | **Aberta** |

**Critério para D1:** a cooperativa tem onde hospedar um site? A gerente usa notebook Windows ou tablet nos eventos?

## Premissas de negócio a validar com a cooperativa

| ID | Premissa | Validar com |
| --- | --- | --- |
| P1 | `receitaCobranca` (R$ 4.339.523,32) é a receita **anual** de tarifas de cobrança e é a base certa para o rateio | Negócios |
| P2 | O faturamento informado é **mensal**, e 9,13% / 9,60% valem sobre ele. Qual é a origem desses fatores? | Negócios |
| P3 | "Faturamento" é da administradora ou o volume arrecadado dos condomínios? | Negócios |
| P4 | A tarifa de manutenção de R$ 50,00 é mensal, por conta de condomínio | Negócios |
| P5 | Prêmio de R$ 50,00 por condomínio que abrir conta: teto, prazo da campanha, movimentação mínima? | Negócios |
| P6 | Remuneração do capital a 100% da Selic, sem limitações. A lei permite até 100% (LC 130/2009), mas o pagamento costuma depender de sobras e de aprovação. Qual taxa foi praticada no último exercício? | Negócios / Contabilidade |
| P7 | Sobras são pagas depois da AGO do ano seguinte. O rótulo "Total no primeiro ano" pode dar a ideia de recebimento em 12 meses; avaliar "1º ciclo" | Compliance |
| P8 | Apresentação do "custo efetivo do boleto" ao cliente | Compliance |
| P9 | Texto do aviso aprovado | Compliance |
| P10 | PDF leva nome do gerente ou da agência? Precisa de numeração? | Negócios |
| P11 | ~~Cores conforme o manual de marca~~ Resolvido com o Guia da Marca v3.0 ([09-identidade-visual.md](09-identidade-visual.md)). Falta receber o arquivo oficial do logo Sicoob Imob.vc | Marketing |
| P12 | O guia traz HEX `#00AE9D` e RGB 0·160·145 (`#00A091`) para a turquesa. Qual é o valor oficial de tela? | Marketing |
| P13 | Redução mínima e área de arejamento da marca de produto **Sicoob Imob.vc** (o guia diz que marcas de produto têm regras próprias) | Marketing |
| P14 | Erro em roxo no lugar de vermelho (cores de concorrentes são proibidas). Aprovar | Marketing |
| P15 | Fornecimento da família oficial de ícones do Sicoob | Marketing |
