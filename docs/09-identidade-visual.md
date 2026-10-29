# 09 — Identidade visual

Fonte: **Guia da Marca Sicoob, versão 3.0 (março de 2023)**, seções 4 e 5. Em situações não previstas no guia, a exceção deve ser validada com a área de Comunicação e Marketing do Centro Cooperativo Sicoob (CCS).

## 1. Paleta de cores

### Cores principais

| Cor | HEX | RGB (guia) | CMYK | Pantone |
| --- | --- | --- | --- | --- |
| Turquesa | `#00AE9D` | 0 · 160 · 145 | 90 · 0 · 50 · 0 | 3275 C |
| Verde-escuro | `#003641` | 0 · 54 · 65 | 100 · 0 · 30 · 80 | 316 C |
| Branco | `#FFFFFF` | 255 · 255 · 255 | 0 · 0 · 0 · 0 | — |

### Cores de apoio

| Cor | HEX | RGB | CMYK | Pantone |
| --- | --- | --- | --- | --- |
| Verde-claro | `#C9D200` | 201 · 210 · 0 | 30 · 0 · 100 · 0 | 382 C |
| Verde-médio | `#7DB61C` | 125 · 182 · 28 | 60 · 0 · 100 · 0 | 376 C |
| Roxo | `#49479D` | 73 · 71 · 157 | 85 · 85 · 0 · 0 | 2103 C |

> **Divergência no guia:** o HEX da turquesa (`#00AE9D` = 0 · 174 · 157) não bate com o RGB informado (0 · 160 · 145 = `#00A091`). O app usa o **HEX `#00AE9D`**, que é o valor de tela. Pendência P12 em [07-pendencias.md](07-pendencias.md).

### Cores proibidas

O guia proíbe cores associadas aos concorrentes: **vermelho, laranja, azul e amarelo**, em materiais internos e externos. Também não podem ser usadas cores fora da paleta.

Consequência para o app: o estado de **erro de validação não pode ser vermelho**. Ver a seção 3.

## 2. Contraste (WCAG AA)

O requisito RNF07 exige contraste mínimo AA: **4,5:1** para texto normal e **3:1** para texto grande (≥ 24 px, ou ≥ 18,66 px em negrito) e elementos gráficos.

| Texto / elemento | Fundo | Contraste | Texto normal | Texto grande / gráfico |
| --- | --- | --- | --- | --- |
| Verde-escuro | Branco | 13,09 | ✅ | ✅ |
| Roxo | Branco | 7,86 | ✅ | ✅ |
| Turquesa | Branco | 2,78 | ❌ | ❌ |
| Verde-médio | Branco | 2,45 | ❌ | ❌ |
| Verde-claro | Branco | 1,65 | ❌ | ❌ |
| Branco | Verde-escuro | 13,09 | ✅ | ✅ |
| Verde-claro | Verde-escuro | 7,92 | ✅ | ✅ |
| Verde-médio | Verde-escuro | 5,35 | ✅ | ✅ |
| Turquesa | Verde-escuro | 4,70 | ✅ | ✅ |
| Verde-escuro | Turquesa | 4,70 | ✅ | ✅ |
| Roxo | Verde-escuro | 1,67 | ❌ | ❌ |

### Regras derivadas

1. **Texto sobre fundo branco:** apenas verde-escuro (padrão) ou roxo (destaque pontual).
2. **Turquesa, verde-médio e verde-claro nunca são cor de texto sobre branco.** Sobre branco, servem só para superfícies, faixas, ícones decorativos e bordas que não carregam informação.
3. **Sobre verde-escuro:** texto branco, verde-claro, verde-médio ou turquesa.
4. **Botão primário:** fundo turquesa com texto verde-escuro (4,70), ou fundo verde-escuro com texto branco (13,09). **Não usar texto branco sobre turquesa** (2,78).
5. Bordas de campos devem ter pelo menos 3:1 com o fundo. Sobre branco, usar verde-escuro ou roxo, nunca turquesa.

## 3. Tokens de cor do app

Arquivo único: `src/ui/theme/tokens.css`. Os componentes usam só os tokens semânticos, nunca o HEX direto.

```css
:root {
  /* Paleta da marca (Guia da Marca v3.0) */
  --sicoob-turquesa: #00AE9D;
  --sicoob-verde-escuro: #003641;
  --sicoob-branco: #FFFFFF;
  --sicoob-verde-claro: #C9D200;
  --sicoob-verde-medio: #7DB61C;
  --sicoob-roxo: #49479D;

  /* Tokens semânticos */
  --cor-fundo: var(--sicoob-branco);
  --cor-texto: var(--sicoob-verde-escuro);
  --cor-texto-invertido: var(--sicoob-branco);
  --cor-superficie-destaque: var(--sicoob-verde-escuro);   /* destaque principal do painel */
  --cor-texto-sobre-destaque: var(--sicoob-branco);
  --cor-valor-sobre-destaque: var(--sicoob-verde-claro);   /* número grande do total anual */
  --cor-acento: var(--sicoob-turquesa);                    /* faixas, ícones, bordas decorativas */
  --cor-botao-primario: var(--sicoob-turquesa);
  --cor-texto-botao-primario: var(--sicoob-verde-escuro);
  --cor-borda-campo: var(--sicoob-verde-escuro);
  --cor-foco: var(--sicoob-roxo);
  --cor-erro: var(--sicoob-roxo);                          /* vermelho é proibido pelo guia */
  --cor-positivo: var(--sicoob-verde-medio);               /* só como ícone/fundo, nunca texto sobre branco */
}
```

Valores neutros (cinzas de borda e de fundo secundário) não estão no guia. Se forem necessários, devem ser derivados do verde-escuro com transparência, por exemplo `rgb(0 54 65 / 0.08)`, e não de cinzas genéricos.

### Estados do app

| Estado | Tratamento |
| --- | --- |
| Erro de validação | Borda **roxa** de 2 px, ícone e mensagem em roxo. A cor nunca é o único sinal: sempre há ícone e texto |
| Foco do teclado | Contorno roxo de 2 px com afastamento de 2 px |
| Economia negativa (RN04) | Valor em verde-escuro com sinal "−" e o rótulo "o banco atual é mais barato". Sem vermelho |
| Resultados desativados | Opacidade reduzida e texto "Corrija os campos para ver o resultado" |
| Destaque principal | Box verde-escuro, rótulo branco e valor em verde-claro |

## 4. Tipografia

| Uso | Fonte | Pesos |
| --- | --- | --- |
| Institucional (toda a interface) | **Asap** (Google Fonts) | Regular 400, Medium 500, SemiBold 600, Bold 700 |
| Títulos e destaques | Pacifico Regular | **Não usar no app** (ver abaixo) |
| Reserva | Tahoma Bold (títulos) e Arial (textos) | Só quando a Asap não puder ser carregada |

- A Asap deve ser **empacotada com o app** (arquivos `.woff2` em `public/fonts/`), e não carregada do Google Fonts em tempo de execução. O app precisa funcionar offline em eventos.
- Pilha de fontes: `font-family: "Asap", Arial, sans-serif;` e, para títulos, `"Asap", Tahoma, sans-serif;`.
- O guia restringe a Pacifico a títulos, com parcimônia. Numa calculadora com valores financeiros, ela prejudica a leitura e a seriedade. **Decisão: não usar.**
- Valores em R$ usam números tabulares (`font-variant-numeric: tabular-nums;`) para alinhar as colunas.

### Escala sugerida

| Elemento | Tamanho | Peso |
| --- | --- | --- |
| Total anual (destaque) | 48 px (modo apresentação: 72 px) | Bold |
| Título de bloco | 20 px | SemiBold |
| Valor de resultado | 20 px | SemiBold |
| Texto e rótulos | 16 px | Regular |
| Explicação da base, aviso | 14 px | Regular |

Nenhum texto abaixo de 14 px. O aviso legal precisa continuar legível com a tela virada para o cliente.

## 5. Logotipo

O app **não desenha o logo**. Usa só o arquivo oficial, fornecido pela área de Comunicação e Marketing, em `public/brand/logo-sicoob-imobvc.svg`. Sem o arquivo, mostra um espaço reservado com o texto "Sicoob Imob.vc".

| Regra (guia) | Aplicação no app |
| --- | --- |
| A versão em cores é a preferencial | Usar a versão colorida sobre fundo branco |
| Fundo preferencial: box branco ou verde-escuro | Cabeçalho branco com o logo colorido; sobre verde-escuro, usar a versão negativa oficial |
| Área de arejamento: **2X** em volta da marca (X = largura da letra "I") | Nenhum elemento a menos de 2X do logo. Implementar como `padding` fixo no componente do logo |
| Redução mínima digital: **64 px** (horizontal) e **48 px** (vertical) de largura | O logo nunca pode ficar menor, inclusive no celular |
| Monocromático só em verde-escuro ou preto | Não recolorir o SVG por CSS |
| Proibido: contorno, sombra, efeitos, distorcer, rotacionar, mudar cores, mudar tipografia ou proporção | O componente usa `<img>` com largura fixa e `height: auto`. Sem `filter`, `transform` nem `box-shadow` |
| Marcas de produto têm regras de redução próprias | Confirmar a redução mínima da marca **Sicoob Imob.vc** (pendência P13) |

No PDF valem as mesmas regras. O limite de redução impresso é **15 mm** (horizontal) e **12 mm** (vertical).

## 6. Grafismos e layout

- O guia define **boxes com cantos arredondados e ângulos de 60°** como elemento central. No app, os cartões do painel usam cantos arredondados (`border-radius: 16px`).
- O **destaque principal** segue o "box do logotipo/informação": fundo verde-escuro com o total anual.
- Os boxes de apoio podem usar as cores de apoio como faixa ou fundo, desde que o texto respeite a tabela de contraste.
- O corte em 60° é opcional e decorativo. Se for usado, aplicar só no box de destaque, sem prejudicar a leitura dos valores.
- Fotos e ilustrações não fazem parte da v1.

## 7. Ícones

- O Sicoob tem uma família própria de ícones, disponível com a área de Comunicação e Marketing. **Preferir esses ícones.**
- Enquanto eles não forem fornecidos, usar ícones de linha com o mesmo estilo descrito no guia (contorno externo arredondado, extremidades internas retas) de uma biblioteca aberta, por exemplo Lucide, na cor do token de texto.
- Ícones que carregam informação (erro, alerta) precisam de contraste de pelo menos 3:1.

## 8. Checklist de revisão visual

- [ ] Nenhuma cor fora da paleta (inclusive vermelho, laranja, azul e amarelo)
- [ ] Nenhum texto em turquesa, verde-médio ou verde-claro sobre branco
- [ ] Botão primário turquesa com texto verde-escuro
- [ ] Erros em roxo, com ícone e mensagem
- [ ] Asap empacotada e funcionando offline
- [ ] Logo oficial, com largura ≥ 64 px e área de arejamento de 2X
- [ ] Logo sem filtro, sombra, rotação ou recoloração
- [ ] Texto mínimo de 14 px e alvos de toque de 44 px
- [ ] Mesmas regras aplicadas ao PDF
