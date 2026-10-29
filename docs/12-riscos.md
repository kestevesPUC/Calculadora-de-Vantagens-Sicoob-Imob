# 12 — Riscos, pendências e recomendações

## Riscos

| Risco | Impacto | Recomendação |
| --- | --- | --- |
| Senha inicial `admin` / `123456` é fraca e conhecida | Acesso indevido ao cadastro de usuários | Trocar a senha no primeiro uso. Recomendado: implementar troca de senha e obrigar na primeira entrada (não implementado) |
| Sem bloqueio por tentativas de login | Tentativa de adivinhar senha | Adicionar atraso/bloqueio progressivo |
| Banco SQLite sem criptografia, em Documentos | Quem tem acesso ao Windows lê o arquivo (as senhas estão com hash) | Proteger a conta do Windows; considerar criptografia do disco |
| Instalador sem assinatura digital | SmartScreen avisa; atualizador não verifica o editor | Obter certificado de assinatura de código |
| Atualização automática depende de releases públicas | Repositório privado exige token no cliente | Manter releases públicas ou usar outro servidor de atualização |
| Premissas P1 a P10 não validadas | Valores mostrados ao cliente podem estar errados | Validar com Negócios, Contabilidade e Compliance antes do uso |
| Logo oficial ausente | Usa espaço reservado | Receber o SVG oficial (P11, P13) |
| Turquesa com HEX e RGB divergentes no guia | Cor de tela pode diferir | Confirmar com Marketing (P12) |
| Roxo como cor de erro | Pode não ser aprovado | Aprovar com Marketing (P14) |
| Ícones: biblioteca Lucide no lugar da família oficial | Fora do guia | Receber os ícones oficiais (P15) |

## Pendências de `docs/07-pendencias.md` ainda abertas

D2 (quem atualiza `parametros.json`; hoje: nova release ou arquivo na pasta de dados), D3, D4 e D5 (hipóteses adotadas, aguardam confirmação), P1 a P10 e P12 a P15. D1 foi decidida: desktop Electron.

## Não verificado

- Aparência final em tela real e em PDF: o app foi aberto e criou o banco, mas a revisão visual do checklist de `docs/09`, seção 8, ainda não foi feita por uma pessoa.
- Instalador (`npm run dist`) e fluxo de atualização por release: configurados, mas não executados.
- Contraste medido pela tabela do guia; não foi rodado verificador automático.
