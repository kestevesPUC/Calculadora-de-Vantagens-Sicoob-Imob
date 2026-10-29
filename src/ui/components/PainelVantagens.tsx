import type { Parametros } from '../../domain/Parametros'
import type { FatoresRateio } from '../../domain/FatoresRateio'
import type { Simulacao } from '../hooks/useSimulacao'
import { formatarMoeda } from '../../format/formatarMoeda'
import { formatarPercentual } from '../../format/formatarPercentual'
import { Aviso } from './Aviso'
import { BlocoRecolhivel } from './BlocoRecolhivel'
import { DestaquePrincipal } from './DestaquePrincipal'
import { LinhaResultado } from './LinhaResultado'

interface Props {
  parametros: Parametros
  fatores: FatoresRateio
  calculo: Simulacao['calculo']
  apresentacao: boolean
}

function rotuloEconomia(valor: { isNegative: () => boolean }, texto: string) {
  return valor.isNegative() ? `${texto} — o banco atual é mais barato` : texto
}

export function PainelVantagens({ parametros: p, fatores, calculo, apresentacao }: Props) {
  if (!calculo) {
    return (
      <div className="flex flex-col gap-4">
        <div
          role="status"
          aria-disabled="true"
          className="cartao border-dashed p-10 text-center text-base"
        >
          Corrija os campos para ver o resultado
        </div>
        <Aviso texto={p.textoAviso} vigencia={p.vigencia} />
      </div>
    )
  }

  const { entrada, resultado: r, comparacao: c } = calculo

  return (
    <div className="flex flex-col gap-4">
      <DestaquePrincipal
        apresentacao={apresentacao}
        totalAnual={formatarMoeda(r.totalAnualRecorrente)}
        premio={formatarMoeda(r.premioAbertura)}
        totalPrimeiroAno={formatarMoeda(r.totalPrimeiroAno)}
      />

      <section aria-label="Prêmio de abertura" className="cartao px-5">
        <LinhaResultado
          rotulo="Prêmio de abertura"
          periodo="único"
          valor={formatarMoeda(r.premioAbertura)}
          explicacao={`${entrada.condominios.toString()} condomínios × ${formatarMoeda(p.premioPorCondominio)}`}
        />
      </section>

      <section aria-label="Sobras estimadas" className="cartao p-5">
        <h3 className="text-lg font-bold tracking-tight">Sobras estimadas por ano</h3>
        <LinhaResultado
          rotulo="Cobrança"
          periodo="por ano"
          valor={formatarMoeda(r.retornoCobranca)}
          explicacao={`${formatarMoeda(r.custoAnualBoletagem)} em boletos por ano × ${formatarPercentual(fatores.fatorCobranca, 4)}`}
        />
        <LinhaResultado
          rotulo="Depósito à vista"
          periodo="por ano"
          valor={formatarMoeda(r.retornoDAV)}
          explicacao={`Saldo médio estimado de ${formatarMoeda(r.saldoMedioDAV)} × ${formatarPercentual(fatores.fatorDAV, 4)}`}
        />
        <LinhaResultado
          rotulo="Investimentos"
          periodo="por ano"
          valor={formatarMoeda(r.retornoInvestimentos)}
          explicacao={`Valor investido estimado de ${formatarMoeda(r.valorInvestido)} × ${formatarPercentual(fatores.fatorINV, 4)}. Adicional ao rendimento da própria aplicação.`}
        />
        {/* HIPÓTESE: D3 — mostrar a nota "crédito não considerado" em vez de omitir em silêncio. */}
        <p className="pt-2 text-sm">Sobras de crédito não consideradas nesta simulação.</p>
      </section>

      <section aria-label="Conta capital" className="cartao px-5">
        <LinhaResultado
          rotulo="Remuneração da conta capital"
          periodo="por ano"
          valor={formatarMoeda(r.remuneracaoCapital)}
          explicacao={`Selic de ${formatarPercentual(entrada.selic)} a ${formatarPercentual(p.percentualSelicContaCapital, 0)} sobre o capital`}
        />
      </section>

      <section aria-label="Custo da cobrança" className="cartao p-5">
        <h3 className="text-lg font-bold tracking-tight">Custo da cobrança</h3>
        <LinhaResultado
          rotulo="Custo mensal de boletagem"
          periodo="por mês"
          valor={formatarMoeda(r.custoMensalBoletagem)}
        />
        <LinhaResultado
          rotulo="Custo anual de boletagem"
          periodo="por ano"
          valor={formatarMoeda(r.custoAnualBoletagem)}
        />
        <LinhaResultado
          rotulo="Custo efetivo do boleto depois do retorno"
          periodo="por boleto"
          valor={formatarMoeda(r.custoEfetivoBoleto)}
        />
      </section>

      {c ? (
        <section aria-label="Comparação com o banco atual" className="cartao p-5">
          <h3 className="text-lg font-bold tracking-tight">Comparação com o banco atual</h3>
          <LinhaResultado
            rotulo={rotuloEconomia(c.economiaBoletos, 'Economia em boletos')}
            periodo="por ano"
            valor={formatarMoeda(c.economiaBoletos)}
          />
          <LinhaResultado
            rotulo={rotuloEconomia(c.economiaManutencao, 'Economia em manutenção')}
            periodo="por ano"
            valor={formatarMoeda(c.economiaManutencao)}
          />
          <LinhaResultado
            rotulo="Ganho total anual vs. banco atual"
            periodo="por ano"
            valor={formatarMoeda(c.ganhoTotalAnualVsBancoAtual)}
          />
        </section>
      ) : null}

      <BlocoRecolhivel titulo="Seu perfil na cooperativa">
        <LinhaResultado
          rotulo="Saldo médio em conta (estimado)"
          periodo="estimativa"
          valor={formatarMoeda(r.saldoMedioDAV)}
        />
        <LinhaResultado
          rotulo="Valor investido (estimado)"
          periodo="estimativa"
          valor={formatarMoeda(r.valorInvestido)}
        />
      </BlocoRecolhivel>

      <Aviso texto={p.textoAviso} vigencia={p.vigencia} />
    </div>
  )
}
