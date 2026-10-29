# 08 — Arquitetura e plano de implementação

## Estrutura de pastas

```
src/
  domain/                      // funções puras, sem React
    Parametros.ts
    EntradaSimulacao.ts
    ResultadoSimulacao.ts
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

## Camadas

```
parametros.json ──► config (validação zod) ──► domain (cálculo decimal) ──► format ──► ui
                                                   ▲
                                 entradas da tela ─┘
```

- **domain:** só recebe `Parametros` e `EntradaSimulacao` e devolve `ResultadoSimulacao`. Tudo em `Decimal`.
- **config:** carrega e valida os parâmetros. Na v2, a área administrativa substitui esta camada sem mexer no domínio.
- **format:** converte `Decimal` em texto pt-BR com 2 casas.
- **ui:** componentes React, sem regra de negócio.

## Plano

1. Criar o projeto (Vite + React + TS + Tailwind) e o `parametros.json`.
2. Implementar `src/domain/` com testes primeiro (casos A a E) e mostrar os testes passando.
3. Implementar a carga e a validação dos parâmetros.
4. Implementar a interface.
5. Configurar o PWA offline (ou o empacotamento desktop, conforme a decisão D1).
6. Implementar a exportação em PDF.
7. Ao fim de cada etapa: `npm run test`, `npm run lint` e `npm run build`.

Em caso de ambiguidade, **perguntar** em vez de inventar regra de negócio.
