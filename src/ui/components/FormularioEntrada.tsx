import { Eraser } from 'lucide-react'
import type { Simulacao } from '../hooks/useSimulacao'
import { BlocoRecolhivel } from './BlocoRecolhivel'
import { Botao } from './Botao'
import { Campo } from './Campo'

export function FormularioEntrada({ s }: { s: Simulacao }) {
  const campo = (nome: Parameters<Simulacao['tocar']>[0]) => ({
    valor: s.campos[nome],
    onChange: (v: string) => s.alterar(nome, v),
    onBlur: () => s.tocar(nome),
    erro: s.erros[nome],
  })

  return (
    <form
      className="cartao flex flex-col gap-4 p-5 lg:sticky lg:top-24 lg:self-start"
      aria-label="Dados da administradora"
      onSubmit={(e) => e.preventDefault()}
    >
      <h2 className="text-lg font-bold tracking-tight">Dados da administradora</h2>
      <Campo
        rotulo="Nome da administradora"
        tipo="texto"
        valor={s.campos.nomeAdministradora}
        onChange={(v) => s.alterar('nomeAdministradora', v)}
        onBlur={() => undefined}
      />
      <Campo
        rotulo="Número de condomínios"
        obrigatorio
        mascara="inteiro"
        {...campo('condominios')}
      />
      <Campo
        rotulo="Boletos por mês"
        obrigatorio
        mascara="inteiro"
        dica="Boletos gerados no mês"
        {...campo('boletosMes')}
      />
      <Campo
        rotulo="Faturamento médio mensal"
        obrigatorio
        mascara="decimal"
        prefixo="R$"
        {...campo('faturamentoMensal')}
      />
      <Campo
        rotulo="Capital social integralizado"
        obrigatorio
        mascara="decimal"
        prefixo="R$"
        {...campo('capitalSocial')}
      />
      <Campo
        rotulo="Taxa Selic anual"
        obrigatorio
        mascara="decimal"
        sufixo="%"
        {...campo('selic')}
      />
      <BlocoRecolhivel titulo="Comparar com o banco atual">
        <Campo
          rotulo="Tarifa atual por boleto"
          prefixo="R$"
          mascara="decimal"
          {...campo('tarifaBoletoAtual')}
        />
        <Campo
          rotulo="Tarifa atual de manutenção por conta/mês"
          prefixo="R$"
          mascara="decimal"
          {...campo('tarifaManutencaoAtual')}
        />
      </BlocoRecolhivel>
      <Botao icone={<Eraser size={18} aria-hidden="true" />} onClick={s.limpar}>
        Limpar
      </Botao>
    </form>
  )
}
