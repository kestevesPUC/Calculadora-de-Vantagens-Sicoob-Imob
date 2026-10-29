import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import type { Usuario } from '../../../domain/Usuario'
import { App } from '../App'

const parametros = readFileSync(join(__dirname, '../../../../public/parametros.json'), 'utf8')
const admin: Usuario = {
  id: '1',
  usuario: 'admin',
  nome: 'Administrador',
  papel: 'admin',
  criadoEm: '',
}
const gerente: Usuario = { id: '2', usuario: 'ana', nome: 'Ana', papel: 'gerente', criadoEm: '' }

function ponte(logado: Usuario | null, extra: Partial<NonNullable<typeof window.sicoob>> = {}) {
  window.sicoob = {
    lerParametros: async () => parametros,
    exportarPdf: vi.fn(async () => true),
    entrar: vi.fn(async (u: string, s: string) => (u === 'admin' && s === '123456' ? admin : null)),
    sair: vi.fn(async () => undefined),
    usuarioAtual: async () => logado,
    listarUsuarios: async () => [admin],
    criarUsuario: vi.fn(async (d) => ({ ...gerente, usuario: d.usuario })),
    ...extra,
  }
}

async function preencherCasoA(user: ReturnType<typeof userEvent.setup>) {
  await user.type(await screen.findByLabelText(/Nome da administradora/), 'Adm & <b>Teste</b>')
  await user.type(screen.getByLabelText(/Número de condomínios/), '40')
  await user.type(screen.getByLabelText(/Boletos por mês/), '2000')
  await user.type(screen.getByLabelText(/Faturamento médio mensal/), '500.000,00')
  await user.type(screen.getByLabelText(/Capital social/), '20.000,00')
}

afterEach(() => {
  delete window.sicoob
})

describe('login', () => {
  it('mostra a tela de login, recusa senha errada e aceita admin/123456', async () => {
    ponte(null)
    const user = userEvent.setup()
    render(<App />)
    await screen.findByRole('heading', { name: /Calculadora de Vantagens/ })

    await user.type(screen.getByLabelText('Usuário'), 'admin')
    await user.type(screen.getByLabelText('Senha'), 'errada')
    await user.click(screen.getByRole('button', { name: 'Entrar' }))
    expect(await screen.findByText('Usuário ou senha incorretos')).toBeInTheDocument()

    await user.clear(screen.getByLabelText('Senha'))
    await user.type(screen.getByLabelText('Senha'), '123456')
    await user.click(screen.getByRole('button', { name: 'Entrar' }))
    expect(await screen.findByText('Dados da administradora')).toBeInTheDocument()
  })
})

describe('simulação', () => {
  it('recalcula automaticamente (caso A) e mantém o aviso visível', async () => {
    ponte(admin)
    const user = userEvent.setup()
    render(<App />)
    await screen.findByText('Dados da administradora')
    expect(screen.getByText('Corrija os campos para ver o resultado')).toBeInTheDocument()
    expect(screen.getByRole('contentinfo', { name: 'Aviso legal' })).toBeInTheDocument()

    await preencherCasoA(user)
    await waitFor(() => expect(screen.getByTestId('total-anual')).toHaveTextContent('R$ 6.890,86'))
    expect(screen.getByText(/Total no primeiro ano: R\$ 8\.890,86/)).toBeInTheDocument()
    expect(screen.queryByLabelText('Comparação com o banco atual')).not.toBeInTheDocument()
    expect(screen.getByRole('contentinfo', { name: 'Aviso legal' })).toHaveTextContent(
      /01\/01\/2026/,
    )
  })

  it('caso I: não mostra erro enquanto digita, mostra ao sair do campo', async () => {
    ponte(admin)
    const user = userEvent.setup()
    render(<App />)
    const campo = await screen.findByLabelText(/Número de condomínios/)
    await user.click(campo)
    expect(screen.queryByText('Campo obrigatório')).not.toBeInTheDocument()
    await user.tab()
    expect(await screen.findByText('Campo obrigatório')).toBeInTheDocument()
  })

  it('caso E: a máscara descarta o sinal de menos e letras', async () => {
    ponte(admin)
    const user = userEvent.setup()
    render(<App />)
    await preencherCasoA(user)
    const campo = screen.getByLabelText(/Número de condomínios/)
    await user.clear(campo)
    await user.type(campo, '-3a')
    expect(campo).toHaveValue('3')
  })

  it('máscara de dinheiro: milhar e vírgula enquanto digita', async () => {
    ponte(admin)
    const user = userEvent.setup()
    render(<App />)
    const campo = await screen.findByLabelText(/Faturamento médio mensal/)
    await user.type(campo, '1234567,8')
    expect(campo).toHaveValue('1.234.567,8')
  })

  it('caso C: comparação aparece só com campos opcionais', async () => {
    ponte(admin)
    const user = userEvent.setup()
    render(<App />)
    await preencherCasoA(user)
    await user.click(screen.getByText('Comparar com o banco atual'))
    await user.type(screen.getByLabelText(/Tarifa atual por boleto/), '2,50')
    await user.type(screen.getByLabelText(/Tarifa atual de manutenção/), '80')
    const bloco = await screen.findByLabelText('Comparação com o banco atual', {
      selector: 'section',
    })
    expect(within(bloco).getByText('R$ 40.490,86')).toBeInTheDocument()
  })

  it('Limpar restaura os valores iniciais e modo apresentação esconde as entradas', async () => {
    ponte(admin)
    const user = userEvent.setup()
    render(<App />)
    await preencherCasoA(user)
    await user.click(screen.getByRole('button', { name: 'Limpar' }))
    expect(screen.getByLabelText(/Número de condomínios/)).toHaveValue('')
    expect(screen.getByLabelText(/Taxa Selic/)).toHaveValue('15,00')

    await user.click(screen.getByRole('button', { name: /Modo apresentação/ }))
    expect(screen.queryByLabelText(/Número de condomínios/)).not.toBeInTheDocument()
  })

  it('exporta o PDF pela ponte do Electron e escapa o nome', async () => {
    const exportarPdf = vi.fn(async () => true)
    ponte(admin, { exportarPdf })
    const user = userEvent.setup()
    render(<App />)
    await preencherCasoA(user)
    expect(screen.getByTestId('relatorio')).toHaveTextContent('Adm & <b>Teste</b>')
    expect(screen.getByTestId('relatorio').querySelector('b')).toBeNull()
    await user.click(screen.getByRole('button', { name: /Exportar PDF/ }))
    expect(exportarPdf).toHaveBeenCalled()
  })
})

describe('dashboard e usuários', () => {
  it('dashboard mostra indicadores e gráficos depois de simular', async () => {
    ponte(admin)
    const user = userEvent.setup()
    render(<App />)
    await preencherCasoA(user)
    await user.click(screen.getByRole('button', { name: /Dashboard/ }))
    expect(await screen.findByLabelText('Indicadores')).toBeInTheDocument()
    expect(screen.getByLabelText('De onde vem o total anual')).toBeInTheDocument()
    expect(screen.getByLabelText('Valores por fonte (por ano)')).toBeInTheDocument()
  })

  it('dashboard sem dados pede o preenchimento', async () => {
    ponte(admin)
    const user = userEvent.setup()
    render(<App />)
    await user.click(await screen.findByRole('button', { name: /Dashboard/ }))
    expect(screen.getByText(/Preencha os dados/)).toBeInTheDocument()
  })

  it('admin cria usuário; gerente não vê a aba', async () => {
    const criarUsuario = vi.fn(async (d) => ({ ...gerente, usuario: d.usuario }))
    ponte(admin, { criarUsuario })
    const user = userEvent.setup()
    const { unmount } = render(<App />)
    await user.click(await screen.findByRole('button', { name: /Usuários/ }))
    await user.type(screen.getByLabelText('Usuário'), 'maria')
    await user.type(screen.getByLabelText('Nome'), 'Maria')
    await user.type(screen.getByLabelText(/Senha/), 'segredo1')
    await user.click(screen.getByRole('button', { name: 'Criar usuário' }))
    expect(await screen.findByText('Usuário maria criado.')).toBeInTheDocument()
    expect(criarUsuario).toHaveBeenCalledWith({
      usuario: 'maria',
      nome: 'Maria',
      senha: 'segredo1',
      papel: 'gerente',
    })
    unmount()

    ponte(gerente)
    render(<App />)
    await screen.findByText('Dados da administradora')
    expect(screen.queryByRole('button', { name: /Usuários/ })).not.toBeInTheDocument()
  })

  it('mostra erro do servidor ao criar usuário duplicado e permite sair', async () => {
    const sair = vi.fn(async () => undefined)
    ponte(admin, {
      sair,
      criarUsuario: async () => {
        throw new Error(
          "Error invoking remote method 'usuarios:criar': Error: Esse usuário já existe",
        )
      },
    })
    const user = userEvent.setup()
    render(<App />)
    await user.click(await screen.findByRole('button', { name: /Usuários/ }))
    await user.type(screen.getByLabelText('Usuário'), 'admin')
    await user.type(screen.getByLabelText('Nome'), 'X')
    await user.type(screen.getByLabelText(/Senha/), 'segredo1')
    await user.click(screen.getByRole('button', { name: 'Criar usuário' }))
    expect(await screen.findByRole('alert')).toHaveTextContent('Esse usuário já existe')
    await user.click(screen.getByRole('button', { name: 'Sair' }))
    expect(sair).toHaveBeenCalled()
    expect(await screen.findByRole('button', { name: 'Entrar' })).toBeInTheDocument()
  })
})

describe('parâmetros', () => {
  it('caso G: parâmetros inválidos bloqueiam o cálculo com mensagem', async () => {
    ponte(admin, { lerParametros: async () => ({ vigencia: 'x' }) })
    render(<App />)
    expect(await screen.findByRole('alert')).toHaveTextContent(/Parâmetros inválidos/)
    expect(screen.queryByText('Dados da administradora')).not.toBeInTheDocument()
  })
})
