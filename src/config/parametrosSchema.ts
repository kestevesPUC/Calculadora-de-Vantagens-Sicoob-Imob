import { z } from 'zod'
import { Decimal } from '../domain/decimal'

const decimalTexto = z
  .string()
  .regex(/^\d+(\.\d+)?$/, 'deve ser um número decimal com ponto, maior ou igual a zero')
  .transform((v) => new Decimal(v))

const decimalPositivo = decimalTexto.refine((v) => v.gt(0), 'deve ser maior que zero')

const dataValida = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, 'deve ser uma data ISO (AAAA-MM-DD)')
  .refine((v) => !Number.isNaN(Date.parse(`${v}T00:00:00Z`)), 'data inválida')

export const parametrosSchema = z
  .object({
    vigencia: dataValida,
    resultadoProjetado: decimalTexto,
    percentualDistribuicao: decimalTexto,
    pesosRateio: z.object({
      depositoVista: decimalTexto,
      investimentos: decimalTexto,
      cobranca: decimalTexto,
      credito: decimalTexto,
    }),
    // Bases são divisores dos fatores de rateio: precisam ser > 0.
    basesCooperativa: z.object({
      depositoVista: decimalPositivo,
      investimentos: decimalPositivo,
      receitaCobranca: decimalPositivo,
    }),
    fatorSaldoDepositoVista: decimalTexto,
    fatorSaldoInvestimentos: decimalTexto,
    custoBoleto: decimalTexto,
    tarifaManutencaoMensal: decimalTexto,
    premioPorCondominio: decimalTexto,
    percentualSelicContaCapital: decimalTexto,
    selicPadrao: decimalTexto,
    textoAviso: z.string().min(1, 'não pode ser vazio'),
  })
  .superRefine((p, ctx) => {
    const soma = Object.values(p.pesosRateio).reduce((acc, v) => acc.plus(v), new Decimal(0))
    if (!soma.eq(1)) {
      ctx.addIssue({
        code: 'custom',
        path: ['pesosRateio'],
        message: `a soma dos pesos de rateio deve ser 1 (atual: ${soma.toString()})`,
      })
    }
  })
