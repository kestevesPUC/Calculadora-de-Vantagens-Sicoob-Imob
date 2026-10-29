import type { CamposEntrada } from '../CamposEntrada'
import { lerNumeroBR } from '../lerNumeroBR'
import {
  MENSAGEM_INTEIRO,
  MENSAGEM_NUMERO,
  MENSAGEM_OBRIGATORIO,
  validarEntrada,
} from '../validarEntrada'

const base: CamposEntrada = {
  nomeAdministradora: '  Adm Teste ',
  condominios: '40',
  boletosMes: '2.000',
  faturamentoMensal: '500.000,00',
  capitalSocial: '20.000',
  selic: '15',
  tarifaBoletoAtual: '',
  tarifaManutencaoAtual: '',
}

describe('lerNumeroBR', () => {
  it.each([
    ['1.234,56', '1234.56'],
    ['1234,5', '1234.5'],
    ['15', '15'],
    ['0', '0'],
  ])('lê %s', (texto, esperado) => {
    expect(lerNumeroBR(texto)?.toString()).toBe(esperado)
  })

  it.each(['abc', '-5', '1.5', '', '1,2,3', '12a'])('rejeita "%s"', (texto) => {
    expect(lerNumeroBR(texto)).toBeNull()
  })
})

describe('validarEntrada', () => {
  it('entrada válida converte e divide a Selic por 100', () => {
    const r = validarEntrada(base)
    if (!r.valida) throw new Error('deveria ser válida')
    expect(r.entrada.nomeAdministradora).toBe('Adm Teste')
    expect(r.entrada.boletosMes.toString()).toBe('2000')
    expect(r.entrada.faturamentoMensal.toString()).toBe('500000')
    expect(r.entrada.selic.toString()).toBe('0.15')
    expect(r.entrada.tarifaBoletoAtual).toBeUndefined()
  })

  it('caso B: tudo zero é válido', () => {
    const zero = { ...base, condominios: '0', boletosMes: '0', faturamentoMensal: '0', capitalSocial: '0', selic: '0' }
    expect(validarEntrada(zero).valida).toBe(true)
  })

  it('caso E: negativo e texto bloqueiam com mensagem', () => {
    const r = validarEntrada({ ...base, condominios: '-1', capitalSocial: 'abc' })
    if (r.valida) throw new Error('deveria ser inválida')
    expect(r.erros.condominios).toBe(MENSAGEM_NUMERO)
    expect(r.erros.capitalSocial).toBe(MENSAGEM_NUMERO)
  })

  it('exige inteiro em condomínios e boletos', () => {
    const r = validarEntrada({ ...base, boletosMes: '10,5' })
    if (r.valida) throw new Error('deveria ser inválida')
    expect(r.erros.boletosMes).toBe(MENSAGEM_INTEIRO)
  })

  it('obrigatório vazio é inválido', () => {
    const r = validarEntrada({ ...base, faturamentoMensal: '' })
    if (r.valida) throw new Error('deveria ser inválida')
    expect(r.erros.faturamentoMensal).toBe(MENSAGEM_OBRIGATORIO)
  })

  it('opcionais preenchidos entram; inválidos bloqueiam', () => {
    const ok = validarEntrada({ ...base, tarifaBoletoAtual: '2,50', tarifaManutencaoAtual: '80' })
    if (!ok.valida) throw new Error('deveria ser válida')
    expect(ok.entrada.tarifaBoletoAtual?.toString()).toBe('2.5')
    const ruim = validarEntrada({ ...base, tarifaBoletoAtual: 'x' })
    expect(ruim.valida).toBe(false)
  })
})
