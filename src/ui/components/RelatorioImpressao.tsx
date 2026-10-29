import type { Parametros } from '../../domain/Parametros'
import { formatarMoeda } from '../../format/formatarMoeda'
import { formatarPercentual } from '../../format/formatarPercentual'
import type { Simulacao } from '../hooks/useSimulacao'
import { Aviso } from './Aviso'
import { Logo } from './Logo'

/** Só aparece na impressão/PDF (mesmas regras de marca da tela). React escapa o nome da administradora. */
export function RelatorioImpressao({
  parametros: p,
  calculo,
}: {
  parametros: Parametros
  calculo: NonNullable<Simulacao['calculo']>
}) {
  const { entrada: e, resultado: r, comparacao: c } = calculo
  const linhas: [string, string][] = [
    ['Prêmio de abertura (único)', formatarMoeda(r.premioAbertura)],
    ['Sobras da cobrança (por ano)', formatarMoeda(r.retornoCobranca)],
    ['Sobras do depósito à vista (por ano)', formatarMoeda(r.retornoDAV)],
    ['Sobras dos investimentos (por ano)', formatarMoeda(r.retornoInvestimentos)],
    [
      `Conta capital, Selic ${formatarPercentual(e.selic)} (por ano)`,
      formatarMoeda(r.remuneracaoCapital),
    ],
    ['Total anual recorrente (por ano)', formatarMoeda(r.totalAnualRecorrente)],
    ['Total no primeiro ano', formatarMoeda(r.totalPrimeiroAno)],
    ['Custo mensal de boletagem (por mês)', formatarMoeda(r.custoMensalBoletagem)],
    ['Custo efetivo do boleto (por boleto)', formatarMoeda(r.custoEfetivoBoleto)],
  ]
  if (c) {
    linhas.push(
      ['Economia em boletos (por ano)', formatarMoeda(c.economiaBoletos)],
      ['Economia em manutenção (por ano)', formatarMoeda(c.economiaManutencao)],
      ['Ganho total vs. banco atual (por ano)', formatarMoeda(c.ganhoTotalAnualVsBancoAtual)],
    )
  }

  return (
    <article className="hidden print:block" aria-hidden="true" data-testid="relatorio">
      <div className="mb-4 w-fit rounded-xl bg-destaque text-sobre-destaque [print-color-adjust:exact]">
        <Logo />
      </div>
      <h1 className="text-2xl font-bold">Simulação de vantagens</h1>
      <p>
        {e.nomeAdministradora || 'Administradora'} — {new Date().toLocaleDateString('pt-BR')}
      </p>
      <p className="mt-2 text-sm">
        {e.condominios.toString()} condomínios · {e.boletosMes.toString()} boletos/mês · faturamento
        mensal {formatarMoeda(e.faturamentoMensal)} · capital {formatarMoeda(e.capitalSocial)}
      </p>
      <table className="my-4 w-full">
        <tbody>
          {linhas.map(([rotulo, valor]) => (
            <tr key={rotulo} className="border-b border-linha">
              <td className="py-2">{rotulo}</td>
              <td className="py-2 text-right font-semibold">{valor}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <Aviso texto={p.textoAviso} vigencia={p.vigencia} />
    </article>
  )
}
