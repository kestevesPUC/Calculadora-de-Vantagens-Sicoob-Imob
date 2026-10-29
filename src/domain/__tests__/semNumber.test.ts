import { readFileSync, readdirSync } from 'node:fs'
import { join } from 'node:path'

// RNF03: dinheiro e fatores nunca usam number no domínio.
describe('domínio sem number', () => {
  const dir = join(__dirname, '..')
  const arquivos = readdirSync(dir).filter((f) => f.endsWith('.ts') && f !== 'fixtures.ts')
  it.each(arquivos)('%s não declara tipo number', (arquivo) => {
    const texto = readFileSync(join(dir, arquivo), 'utf8')
    expect(texto).not.toMatch(/:\s*number\b/)
    expect(texto).not.toMatch(/parseFloat|Number\(/)
  })
})
