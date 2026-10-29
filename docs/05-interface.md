# 05 — Interface

## Layout

- **Tablet/notebook:** duas colunas (entradas | painel).
- **Celular (a partir de 360 px):** uma coluna, com as entradas acima do painel.

## Coluna 1 — Dados da administradora

Os campos de [02-requisitos.md](02-requisitos.md#entradas), com máscara de moeda e de percentual. Os campos opcionais ficam na seção recolhível **"Comparar com o banco atual"**.

## Coluna 2 — Painel de vantagens (nesta ordem)

1. **Destaque principal:** total anual recorrente em fonte grande. Abaixo, menor: "+ R$ X de prêmio na abertura" e "Total no primeiro ano: R$ Y".
2. **Prêmio de abertura** (único).
3. **Sobras estimadas por ano:** cobrança, depósito à vista e investimentos, cada um com valor e uma linha explicando a base.
4. **Remuneração da conta capital** (por ano), com a Selic usada.
5. **Custo da cobrança:** custo mensal, custo anual e custo efetivo do boleto depois do retorno.
6. **Comparação com o banco atual** (só quando preenchida).
7. Bloco recolhível **"Seu perfil na cooperativa"**: saldo médio DAV e valor investido estimados.
8. **Aviso** (`textoAviso`), sempre visível no rodapé, com a data de vigência.

## Ações

| Ação | Efeito |
| --- | --- |
| Modo apresentação | Esconde a coluna de entradas e amplia o painel |
| Exportar PDF | Gera no navegador: nome, data, entradas, resultados e aviso |
| Limpar | Volta aos valores iniciais |

## Estados

| Estado | Exibição |
| --- | --- |
| Parâmetros carregando | Indicador de carregamento |
| Parâmetros inválidos | Mensagem de erro, sem cálculo |
| Campo inválido | Borda de erro, mensagem curta e resultados desativados |
| Tudo válido | Resultados atualizados em tempo real |

## Identidade visual

Cores, tipografia, logo, estados e checklist de revisão estão em [09-identidade-visual.md](09-identidade-visual.md), conforme o Guia da Marca Sicoob v3.0.
