import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { carregarParametros, leitorPadrao, ParametrosInvalidosError } from '../carregarParametros'

const json = (): Record<string, unknown> =>
  JSON.parse(readFileSync(join(__dirname, '../../../public/parametros.json'), 'utf8'))

const falha = async (bruto: unknown) => {
  const erro = await carregarParametros(async () => bruto).catch((e) => e)
  expect(erro).toBeInstanceOf(ParametrosInvalidosError)
  return (erro as ParametrosInvalidosError).detalhes.join(' | ')
}

describe('carregarParametros', () => {
  it('carrega o arquivo oficial como Decimal', async () => {
    const p = await carregarParametros(async () => json())
    expect(p.percentualDistribuicao.toString()).toBe('0.12')
    expect(p.vigencia).toBe('2026-01-01')
  })

  it('aceita JSON como texto', async () => {
    const p = await carregarParametros(async () => JSON.stringify(json()))
    expect(p.custoBoleto.toString()).toBe('1.7')
  })

  it('caso G: JSON ausente, texto inválido ou esquema quebrado', async () => {
    expect(await falha('{ quebrado')).toMatch(/JSON válido/)
    expect(await falha({})).toMatch(/vigencia/)
    const erro = await carregarParametros(async () => {
      throw new Error('sem arquivo')
    }).catch((e) => e)
    expect(erro.detalhes[0]).toBe('sem arquivo')
    const naoErro = await carregarParametros(async () => {
      throw 'x'
    }).catch((e) => e)
    expect(naoErro.detalhes[0]).toMatch(/falha ao ler/)
  })

  it('rejeita soma de pesos diferente de 1', async () => {
    const p = json()
    p.pesosRateio = { depositoVista: '0.5', investimentos: '0.25', cobranca: '0.2', credito: '0.15' }
    expect(await falha(p)).toMatch(/soma dos pesos/)
  })

  it('rejeita número negativo, base zero e data inválida', async () => {
    expect(await falha({ ...json(), custoBoleto: '-1' })).toMatch(/custoBoleto/)
    const base = json()
    base.basesCooperativa = { depositoVista: '0', investimentos: '1', receitaCobranca: '1' }
    expect(await falha(base)).toMatch(/maior que zero/)
    expect(await falha({ ...json(), vigencia: '2026-13-45' })).toMatch(/vigencia/)
  })
})

describe('leitorPadrao', () => {
  afterEach(() => {
    delete window.sicoob
    vi.unstubAllGlobals()
  })

  it('usa a ponte do Electron quando existe', async () => {
    window.sicoob = {
      ...({} as NonNullable<typeof window.sicoob>),
      lerParametros: async () => ({ ok: 1 }),
    }
    expect(await leitorPadrao()).toEqual({ ok: 1 })
  })

  it('cai para fetch no navegador', async () => {
    vi.stubGlobal('fetch', async () => ({ ok: true, json: async () => ({ via: 'fetch' }) }))
    expect(await leitorPadrao()).toEqual({ via: 'fetch' })
  })

  it('falha quando o fetch não encontra o arquivo', async () => {
    vi.stubGlobal('fetch', async () => ({ ok: false, status: 404 }))
    await expect(leitorPadrao()).rejects.toThrow(/404/)
  })
})
