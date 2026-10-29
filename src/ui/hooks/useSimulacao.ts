import { useMemo, useState } from 'react'
import type { CamposEntrada, NomeCampo } from '../../domain/CamposEntrada'
import type { Parametros } from '../../domain/Parametros'
import { calcularComparacao } from '../../domain/calcularComparacao'
import { calcularFatores } from '../../domain/calcularFatores'
import { calcularSimulacao } from '../../domain/calcularSimulacao'
import { validarEntrada } from '../../domain/validarEntrada'
import { formatarNumero } from '../../format/formatarMoeda'

function camposIniciais(p: Parametros): CamposEntrada {
  return {
    nomeAdministradora: '',
    condominios: '',
    boletosMes: '',
    faturamentoMensal: '',
    capitalSocial: '',
    // RN08: Selic editável, valor inicial vindo de selicPadrao.
    selic: formatarNumero(p.selicPadrao.times(100), 2),
    tarifaBoletoAtual: '',
    tarifaManutencaoAtual: '',
  }
}

export function useSimulacao(parametros: Parametros) {
  const [campos, setCampos] = useState(() => camposIniciais(parametros))
  const [tocados, setTocados] = useState<Partial<Record<NomeCampo, boolean>>>({})

  // RNF: fatores calculados uma vez por carga de parâmetros.
  const fatores = useMemo(() => calcularFatores(parametros), [parametros])
  const validacao = useMemo(() => validarEntrada(campos), [campos])

  const calculo = useMemo(() => {
    if (!validacao.valida) return null
    const resultado = calcularSimulacao(parametros, fatores, validacao.entrada)
    const comparacao = calcularComparacao(parametros, resultado, validacao.entrada)
    return { entrada: validacao.entrada, resultado, comparacao }
  }, [validacao, parametros, fatores])

  // Caso I: erro só aparece depois que o usuário sai do campo.
  const erros = validacao.valida
    ? {}
    : Object.fromEntries(
        Object.entries(validacao.erros).filter(([nome]) => tocados[nome as NomeCampo]),
      )

  return {
    campos,
    erros: erros as Partial<Record<NomeCampo, string>>,
    fatores,
    calculo,
    alterar: (nome: keyof CamposEntrada, valor: string) =>
      setCampos((c) => ({ ...c, [nome]: valor })),
    tocar: (nome: NomeCampo) => setTocados((t) => ({ ...t, [nome]: true })),
    limpar: () => {
      setCampos(camposIniciais(parametros))
      setTocados({})
    },
  }
}

export type Simulacao = ReturnType<typeof useSimulacao>
