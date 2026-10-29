import { Gift, PiggyBank, Receipt, TrendingUp, Percent } from 'lucide-react'
import type { FatoresRateio } from '../../domain/FatoresRateio'
import type { Parametros } from '../../domain/Parametros'
import { formatarMoeda } from '../../format/formatarMoeda'
import { formatarPercentual } from '../../format/formatarPercentual'
import type { Simulacao } from '../hooks/useSimulacao'
import { Aviso } from './Aviso'
import { CartaoIndicador } from './CartaoIndicador'
import { GraficoBarras } from './GraficoBarras'
import { GraficoRosca } from './GraficoRosca'

interface Props {
  parametros: Parametros
  fatores: FatoresRateio
  calculo: Simulacao['calculo']
}

const COR = {
  cobranca: 'var(--sicoob-verde-escuro)',
  dav: 'var(--sicoob-turquesa)',
  investimentos: 'var(--sicoob-verde-medio)',
  capital: 'var(--sicoob-roxo)',
}

export function Dashboard({ parametros: p, fatores, calculo }: Props) {
  if (!calculo) {
    return (
      <div className="flex flex-col gap-4">
        <div role="status" className="rounded-2xl border-2 border-dashed border-linha p-8 text-center opacity-70">
          Preencha os dados da administradora na aba Simulação para ver os indicadores e gráficos.
        </div>
        <Aviso texto={p.textoAviso} vigencia={p.vigencia} />
      </div>
    )
  }

  const { resultado: r, comparacao: c } = calculo
  const composicao = [
    { rotulo: 'Cobrança', valor: r.retornoCobranca, cor: COR.cobranca },
    { rotulo: 'Depósito à vista', valor: r.retornoDAV, cor: COR.dav },
    { rotulo: 'Investimentos', valor: r.retornoInvestimentos, cor: COR.investimentos },
    { rotulo: 'Conta capital', valor: r.remuneracaoCapital, cor: COR.capital },
  ]

  return (
    <div className="flex flex-col gap-6">
      <section aria-label="Indicadores" className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <CartaoIndicador
          destaque
          icone={<TrendingUp size={18} aria-hidden="true" />}
          titulo="Total anual recorrente"
          valor={formatarMoeda(r.totalAnualRecorrente)}
          detalhe="por ano"
        />
        <CartaoIndicador
          icone={<Gift size={18} aria-hidden="true" />}
          titulo="Total no primeiro ano"
          valor={formatarMoeda(r.totalPrimeiroAno)}
          detalhe={`inclui ${formatarMoeda(r.premioAbertura)} de prêmio único`}
        />
        <CartaoIndicador
          icone={<Receipt size={18} aria-hidden="true" />}
          titulo="Custo efetivo do boleto"
          valor={formatarMoeda(r.custoEfetivoBoleto)}
          detalhe={`por boleto, depois do retorno de ${formatarPercentual(fatores.fatorCobranca, 2)}`}
        />
        <CartaoIndicador
          icone={<PiggyBank size={18} aria-hidden="true" />}
          titulo="Remuneração da conta capital"
          valor={formatarMoeda(r.remuneracaoCapital)}
          detalhe="por ano"
        />
        <CartaoIndicador
          icone={<Percent size={18} aria-hidden="true" />}
          titulo="Devolução da cobrança"
          valor={formatarPercentual(fatores.fatorCobranca, 2)}
          detalhe="do custo de boletagem volta como sobras"
        />
        {c ? (
          <CartaoIndicador
            icone={<TrendingUp size={18} aria-hidden="true" />}
            titulo="Ganho total vs. banco atual"
            valor={formatarMoeda(c.ganhoTotalAnualVsBancoAtual)}
            detalhe="por ano"
          />
        ) : null}
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border-2 border-linha p-4">
          <GraficoRosca titulo="De onde vem o total anual" itens={composicao} />
        </div>
        <div className="rounded-2xl border-2 border-linha p-4">
          <GraficoBarras titulo="Valores por fonte (por ano)" itens={composicao} />
        </div>
        {c ? (
          <div className="rounded-2xl border-2 border-linha p-4 lg:col-span-2">
            <GraficoBarras
              titulo="Comparação com o banco atual (por ano)"
              itens={[
                { rotulo: 'Total anual recorrente', valor: r.totalAnualRecorrente, cor: COR.cobranca },
                { rotulo: 'Economia em boletos', valor: c.economiaBoletos, cor: COR.dav },
                { rotulo: 'Economia em manutenção', valor: c.economiaManutencao, cor: COR.investimentos },
                { rotulo: 'Ganho total', valor: c.ganhoTotalAnualVsBancoAtual, cor: COR.capital },
              ]}
            />
          </div>
        ) : null}
      </section>

      <Aviso texto={p.textoAviso} vigencia={p.vigencia} />
    </div>
  )
}
