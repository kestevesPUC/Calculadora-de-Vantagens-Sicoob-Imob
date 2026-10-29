# 01 — Visão geral

## Objetivo

A **Calculadora de Vantagens — Sicoob Imob.vc** é uma ferramenta comercial. O gerente de relacionamento usa em **eventos e visitas de captação** com **administradoras de condomínio**.

O gerente digita poucos dados da administradora. A tela mostra, em R$, quanto ela ganha por ser cooperada:

- prêmio de abertura (pagamento único);
- sobras estimadas (cobrança, depósito à vista e investimentos);
- remuneração da conta capital;
- economia em relação ao banco atual (opcional).

Todos os valores são **projeções**. A distribuição de sobras depende do resultado apurado e da aprovação em assembleia (AGO).

## Atores

| Ator | Papel |
| --- | --- |
| Gerente de relacionamento | Opera a tela, digita os dados e exporta o PDF |
| Administradora de condomínio | Vê o resultado (tela virada para o cliente) |
| Área de negócios da cooperativa | Mantém os parâmetros (`parametros.json`) |
| Compliance | Aprova o texto do aviso e a forma de apresentação |

## Fluxo de uso

```
1. Gerente abre o app (online ou offline)
2. App carrega parametros.json ──► inválido? ─► mostra erro, não calcula
3. Gerente preenche os dados da administradora
4. A cada alteração ─► valida campos ─► inválido? ─► marca erro, desativa resultados
                                   └─► válido ─► recalcula (< 200 ms)
5. (Opcional) Gerente abre "Comparar com o banco atual" e informa as tarifas atuais
6. (Opcional) Gerente ativa o "Modo apresentação" e vira a tela para o cliente
7. Gerente exporta o PDF ou clica em "Limpar" para uma nova simulação
```

## Pontos de decisão no fluxo

| Ponto | Decisão | Comportamento |
| --- | --- | --- |
| Carregar parâmetros | JSON válido? | Não: mensagem de erro e nenhum cálculo |
| Validar entradas | Todos os obrigatórios válidos? | Não: borda de erro e resultados desativados |
| Comparação | Algum campo opcional preenchido? | Sim: mostra o bloco de comparação |
| Economia | Valor negativo? | Mostra como está, sem esconder |
| Apresentação | Modo apresentação ativo? | Esconde as entradas e amplia o painel |

## Escopo por fase

**v1 (agora):** entradas, cálculo em tempo real, painel completo, parâmetros externos, funcionamento offline, exportação em PDF e botão "Limpar".

**v2 (arquitetura preparada, sem implementação):** área administrativa autenticada para editar parâmetros com histórico, registro das simulações (gerente, data, administradora) e retorno de operações de crédito.
