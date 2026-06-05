'use client'

import React, { useState, useMemo } from 'react'
import { CalculatorCard } from '@/components/ui/CalculatorCard'
import { ResultHero } from '@/components/ui/ResultHero'
import { MetricGrid } from '@/components/ui/MetricGrid'
import { SectionDivider } from '@/components/ui/SectionDivider'
import { ShareCardBase } from '@/components/share/ShareCard'
import { ScaledPreview } from '@/components/ui/ScaledPreview'
import { ShareButtons } from '@/components/ui/ShareButtons'
import { formatBRL } from '@/lib/formatters'
import { REALIDADE_STATES, PROFESSIONS, MINIMUM_WAGE, StateData } from '@/config/realidade'
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceDot,
} from 'recharts'
import { HelpCircle, ChevronRight, AlertCircle, Sparkles, CheckCircle2 } from 'lucide-react'

// Algoritmo de Interpolação Linear de Percentil
function calculatePercentile(salary: number, values: number[]): number {
  const percentiles = [10, 20, 30, 40, 50, 60, 70, 80, 90, 95, 99, 99.9]
  
  if (salary <= 0) return 0
  
  // Se for menor que a menor faixa (P10)
  if (salary < values[0]) {
    const p = (salary / values[0]) * percentiles[0]
    return Math.max(0.1, p)
  }
  
  // Se for maior que a maior faixa (P99.9)
  if (salary >= values[values.length - 1]) {
    const highestVal = values[values.length - 1]
    const diff = salary - highestVal
    // Suavização logarítmica/exponencial para salários gigantescos, tendendo a 99.99%
    const bonus = 0.09 * (1 - Math.exp(-diff / 150000))
    return 99.9 + bonus
  }
  
  // Encontrar o intervalo correspondente e interpolar
  for (let i = 0; i < values.length - 1; i++) {
    if (salary >= values[i] && salary <= values[i + 1]) {
      const vStart = values[i]
      const vEnd = values[i + 1]
      const pStart = percentiles[i]
      const pEnd = percentiles[i + 1]
      
      const ratio = (salary - vStart) / (vEnd - vStart)
      return pStart + ratio * (pEnd - pStart)
    }
  }
  
  return 50
}

export function BrazilianRealidadeCalculator() {
  const [salary, setSalary] = useState<number>(3000)
  const [stateCode, setStateCode] = useState<string>('SP')

  // Encontra os dados do estado selecionado
  const selectedState = useMemo(() => {
    return REALIDADE_STATES.find(s => s.code === stateCode) || REALIDADE_STATES[0]
  }, [stateCode])

  const nationalState = useMemo(() => {
    return REALIDADE_STATES.find(s => s.code === 'BR') || REALIDADE_STATES[0]
  }, [])

  // Cálculos de Percentil
  const statePercentile = useMemo(() => {
    return calculatePercentile(salary, selectedState.percentileValues)
  }, [salary, selectedState])

  const nationalPercentile = useMemo(() => {
    return calculatePercentile(salary, nationalState.percentileValues)
  }, [salary, nationalState])

  // Comparações de Custo
  const salaryInMinimumWages = useMemo(() => {
    return salary / MINIMUM_WAGE
  }, [salary])

  const salaryInCestasBasicas = useMemo(() => {
    return salary / selectedState.cestaBasica
  }, [salary, selectedState])

  // Comparações de Profissões
  const professionComparisons = useMemo(() => {
    return PROFESSIONS.map(p => {
      const ratio = salary / p.salary
      const percentDiff = ((salary - p.salary) / p.salary) * 100
      return {
        ...p,
        ratio,
        percentDiff,
      }
    })
  }, [salary])

  // Dados para o Gráfico de Curva de Renda (Nacional)
  const chartData = useMemo(() => {
    const percentiles = [10, 20, 30, 40, 50, 60, 70, 80, 90, 95, 99, 99.9]
    return percentiles.map((p, idx) => ({
      percentile: p,
      label: `Top ${Math.round(100 - p)}%`,
      'Renda Mensal': selectedState.percentileValues[idx],
    }))
  }, [selectedState])

  // Interpolação para encontrar as coordenadas do ponto do usuário no gráfico
  const userChartPoint = useMemo(() => {
    return {
      percentile: Number(statePercentile.toFixed(1)),
      'Renda Mensal': salary,
    }
  }, [statePercentile, salary])

  // Frase de efeito (viral / reflexiva) baseada no percentil
  const realityComment = useMemo(() => {
    if (salary <= 0) return 'Digite um salário para ver seu impacto na pirâmide brasileira.'
    if (nationalPercentile < 40) {
      return `Você está entre a base mais vulnerável da economia brasileira. Sobreviver com esse valor exige um malabarismo diário.`
    }
    if (nationalPercentile < 70) {
      return `Você ganha mais do que a metade mais pobre do país, mas ainda sente a forte pressão dos custos cotidianos brasileiros.`
    }
    if (nationalPercentile < 90) {
      return `Seu salário é superior a ~80% do país. Isso mostra o abismo: uma renda de classe média média te coloca no topo da pirâmide nacional.`
    }
    if (nationalPercentile < 98) {
      return `Você faz parte dos 10% mais ricos do Brasil. Embora na sua bolha pareça classe média, você goza de um privilégio estatístico imenso.`
    }
    return `Você faz parte da elite econômica brasileira (Top ${Math.max(0.1, 100 - nationalPercentile).toFixed(1)}%). O abismo social entre você e a base é gigantesco.`
  }, [nationalPercentile, salary])

  // Determinação de Classe Social (Critério FGV/IBGE baseado em Salários Mínimos da Renda Individual)
  const socialClass = useMemo(() => {
    if (salary <= 0) return { letter: '-', name: 'Não Calculado', color: 'text-stone-400', desc: 'Insira um salário válido para calcular sua classe social.' }
    const multiples = salary / MINIMUM_WAGE
    
    if (multiples > 20) {
      return {
        letter: 'A',
        name: 'Classe A (Elite Econômica)',
        color: 'text-amber-500 border-amber-500 dark:text-amber-400 dark:border-amber-400',
        desc: 'Sua renda mensal individual é superior a 20 salários mínimos. Você faz parte do topo absoluto da pirâmide financeira brasileira.'
      }
    }
    if (multiples > 10) {
      return {
        letter: 'B',
        name: 'Classe B (Classe Média Alta)',
        color: 'text-emerald-600 border-emerald-600 dark:text-emerald-400 dark:border-emerald-400',
        desc: 'Sua renda mensal individual está entre 10 e 20 salários mínimos. Padrão de vida de alta renda no cenário socioeconômico do país.'
      }
    }
    if (multiples > 4) {
      return {
        letter: 'C',
        name: 'Classe C (Classe Média)',
        color: 'text-teal-600 border-teal-600 dark:text-teal-400 dark:border-teal-400',
        desc: 'Sua renda mensal individual está entre 4 e 10 salários mínimos. Classe média consolidada sob a métrica estatística nacional.'
      }
    }
    if (multiples > 2) {
      return {
        letter: 'D',
        name: 'Classe D (Classe Média Baixa)',
        color: 'text-stone-700 border-stone-600 dark:text-stone-300 dark:border-stone-400',
        desc: 'Sua renda mensal individual está entre 2 e 4 salários mínimos. Faixa vulnerável às variações inflacionárias do custo de vida.'
      }
    }
    return {
      letter: 'E',
      name: 'Classe E (Classe Baixa / Vulnerável)',
      color: 'text-stone-500 border-stone-400 dark:text-stone-400 dark:border-stone-500',
      desc: 'Sua renda mensal individual é de até 2 salários mínimos. Base da pirâmide financeira nacional, de extrema restrição orçamentária.'
    }
  }, [salary])

  // Formatação em string dos percentis para os cards
  const nationalDisplay = useMemo(() => {
    return nationalPercentile.toFixed(1).replace('.', ',')
  }, [nationalPercentile])

  const stateDisplay = useMemo(() => {
    return statePercentile.toFixed(1).replace('.', ',')
  }, [statePercentile])

  // Definição reativa dos patamares da pirâmide social
  const pyramidTiers = useMemo(() => {
    const activeLetter = salary > 0 ? socialClass.letter : ''
    
    return [
      {
        letter: 'A',
        name: 'Classe A',
        label: 'Elite Econômica (> 20 SM)',
        range: `Mais de R$ ${(20 * MINIMUM_WAGE).toLocaleString('pt-BR')}`,
        width: '30%',
        color: 'from-amber-400 to-amber-500 dark:from-amber-500 dark:to-amber-600',
        textColor: 'text-amber-950 dark:text-amber-50',
        borderColor: 'border-amber-400 dark:border-amber-500',
        isActive: activeLetter === 'A',
        description: 'Elite (Top ~1%)'
      },
      {
        letter: 'B',
        name: 'Classe B',
        label: 'Classe Média Alta (10 a 20 SM)',
        range: `R$ ${(10 * MINIMUM_WAGE).toLocaleString('pt-BR')} a R$ ${(20 * MINIMUM_WAGE).toLocaleString('pt-BR')}`,
        width: '48%',
        color: 'from-emerald-400 to-emerald-500 dark:from-emerald-500 dark:to-emerald-600',
        textColor: 'text-emerald-950 dark:text-emerald-50',
        borderColor: 'border-emerald-400 dark:border-emerald-500',
        isActive: activeLetter === 'B',
        description: 'Classe Média Alta'
      },
      {
        letter: 'C',
        name: 'Classe C',
        label: 'Classe Média (4 a 10 SM)',
        range: `R$ ${(4 * MINIMUM_WAGE).toLocaleString('pt-BR')} a R$ ${(10 * MINIMUM_WAGE).toLocaleString('pt-BR')}`,
        width: '65%',
        color: 'from-teal-400 to-teal-500 dark:from-teal-500 dark:to-teal-600',
        textColor: 'text-teal-950 dark:text-teal-50',
        borderColor: 'border-teal-400 dark:border-teal-500',
        isActive: activeLetter === 'C',
        description: 'Classe Média'
      },
      {
        letter: 'D',
        name: 'Classe D',
        label: 'Classe Média Baixa (2 a 4 SM)',
        range: `R$ ${(2 * MINIMUM_WAGE).toLocaleString('pt-BR')} a R$ ${(4 * MINIMUM_WAGE).toLocaleString('pt-BR')}`,
        width: '82%',
        color: 'from-slate-400 to-slate-500 dark:from-slate-500 dark:to-slate-600',
        textColor: 'text-slate-950 dark:text-slate-50',
        borderColor: 'border-slate-400 dark:border-slate-500',
        isActive: activeLetter === 'D',
        description: 'Classe Média Baixa'
      },
      {
        letter: 'E',
        name: 'Classe E',
        label: 'Classe Baixa (Até 2 SM)',
        range: `Até R$ ${(2 * MINIMUM_WAGE).toLocaleString('pt-BR')}`,
        width: '100%',
        color: 'from-stone-400 to-stone-500 dark:from-stone-500 dark:to-stone-600',
        textColor: 'text-stone-950 dark:text-stone-50',
        borderColor: 'border-stone-400 dark:border-stone-500',
        isActive: activeLetter === 'E',
        description: 'Classe Baixa / Vulnerável'
      }
    ]
  }, [salary, socialClass.letter])

  // Estilo premium do card se for Top 1%
  const isTopTier = nationalPercentile >= 99

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:items-start">
      {/* ── COLUNA ESQUERDA: INPUTS ────────────────────────────── */}
      <div className="lg:col-span-5 space-y-4">
        <CalculatorCard 
          title="Seu Salário vs. Realidade Brasileira" 
          subtitle="Situe sua renda real diante da pirâmide da desigualdade social e econômica brasileira."
        >
          {/* Selecionar Estado */}
          <div className="space-y-2">
            <label htmlFor="state-select" className="text-sm font-semibold" style={{ color: 'var(--c-muted)' }}>
              Seu Estado de residência/trabalho
            </label>
            <select
              id="state-select"
              value={stateCode}
              onChange={(e) => setStateCode(e.target.value)}
              className="w-full border rounded-xl px-3 py-2.5 text-base font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer"
              style={{
                backgroundColor: 'var(--c-bg)',
                color: 'var(--c-ink)',
                borderColor: 'var(--c-line)'
              }}
            >
              <optgroup label="Nacional" style={{ fontWeight: 'bold' }}>
                {REALIDADE_STATES.filter(s => s.group === 'nacional').map((s) => (
                  <option key={s.code} value={s.code}>
                    {s.name}
                  </option>
                ))}
              </optgroup>

              <optgroup label="Estados (Médias Gerais)" style={{ fontWeight: 'bold' }}>
                {REALIDADE_STATES.filter(s => s.group === 'estado').map((s) => (
                  <option key={s.code} value={s.code}>
                    {s.name} ({s.code})
                  </option>
                ))}
              </optgroup>

              <optgroup label="Polos Econômicos Regionais" style={{ fontWeight: 'bold' }}>
                {REALIDADE_STATES.filter(s => s.group === 'polo').map((s) => (
                  <option key={s.code} value={s.code}>
                    {s.name}
                  </option>
                ))}
              </optgroup>
            </select>
          </div>

          {/* Valor Salarial Líquido */}
          <div className="space-y-2.5 pt-2">
            <div className="flex justify-between items-center">
              <label htmlFor="user-salary" className="text-base font-semibold" style={{ color: 'var(--c-muted)' }}>
                Seu Salário Mensal Líquido
              </label>
              <div className="relative w-40">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-medium" style={{ color: 'var(--c-muted)' }}>R$</span>
                <input
                  id="user-salary"
                  type="number"
                  inputMode="decimal"
                  step="10"
                  min={0}
                  max={500000}
                  value={salary === 0 ? '' : salary}
                  placeholder="0,00"
                  onChange={(e) => setSalary(Math.max(0, Number(e.target.value) || 0))}
                  className="w-full text-right border rounded-xl pr-3.5 pl-9 py-2 text-base font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500 tabular-nums"
                  style={{
                    backgroundColor: 'var(--c-bg)',
                    color: 'var(--c-ink)',
                    borderColor: 'var(--c-line)'
                  }}
                />
              </div>
            </div>
            <input
              type="range"
              min={0}
              max={100000}
              step={500}
              value={Math.min(salary, 100000)}
              onChange={(e) => setSalary(Number(e.target.value))}
              aria-label="Salário Slider"
              className="w-full h-2 rounded-lg appearance-none cursor-pointer accent-emerald-500"
              style={{ backgroundColor: 'var(--c-line)' }}
            />
            <div className="flex justify-between text-xs font-semibold" style={{ color: 'var(--c-muted)' }}>
              <span>R$ 0</span>
              <span className="flex items-center gap-1">
                {salary > 100000 && <span className="text-emerald-500">↑ digitado acima</span>}
                R$ 100 mil+
              </span>
            </div>
          </div>
        </CalculatorCard>

        {/* Alerta de desigualdade / Nota explicativa */}
        <div className="rounded-2xl border p-4 flex gap-3 bg-stone-500/5" style={{ borderColor: 'var(--c-line)' }}>
          <AlertCircle className="shrink-0 text-stone-500" size={18} style={{ color: 'var(--c-muted)' }} />
          <div className="space-y-1 text-xs leading-relaxed" style={{ color: 'var(--c-muted)' }}>
            <p className="font-semibold" style={{ color: 'var(--c-ink-2)' }}>Sobre a base utilizada:</p>
            <p>
              Os cálculos consideram o rendimento mensal individual e são baseados nos microdados da <strong>PNAD Contínua (IBGE)</strong> e cesta básica do <strong>DIEESE</strong>. Os valores referem-se à renda líquida aproximada de impostos e encargos.
            </p>
          </div>
        </div>
      </div>

      {/* ── COLUNA DIREITA: RESULTADOS ──────────────────────────── */}
      <div role="region" aria-live="polite" aria-label="Resultado da Realidade Brasileira" className="lg:col-span-7 space-y-4">
        
        {/* Resultado Hero */}
        <div className={isTopTier ? 'relative rounded-[40px] border-2 border-amber-500/30 overflow-hidden transition-all duration-300' : ''}>
          {isTopTier && (
            <div className="absolute top-0 right-0 bg-gradient-to-l from-amber-500/20 to-transparent p-4 flex items-center gap-1.5 text-xs font-bold text-amber-600 dark:text-amber-400">
              <Sparkles size={14} className="animate-spin" /> Elite Econômica
            </div>
          )}
          <ResultHero
            label="Seu Salário vs. Brasil"
            value={salary > 0 ? `Mais rico que ${nationalDisplay}%` : 'R$ 0,00'}
            comment={realityComment}
            colorClass={isTopTier ? 'text-amber-500 dark:text-amber-400 font-extrabold' : 'text-teal-600 dark:text-teal-400'}
            infoTooltip="A porcentagem indica o percentil exato em que seu salário se enquadra na população economicamente ativa ocupada. Um percentil de 90% significa que você ganha mais que 90% dos brasileiros."
          />
        </div>

        {/* Classe Social Indicador */}
        {salary > 0 && (
          <div 
            className="rounded-2xl border p-4 flex items-center gap-4 bg-stone-500/5 animate-fadeIn" 
            style={{ borderColor: 'var(--c-line)' }}
          >
            <div className={`w-12 h-12 shrink-0 rounded-full flex items-center justify-center text-xl font-bold border-2 ${socialClass.color} bg-white dark:bg-stone-900`} style={{ borderColor: 'currentColor' }}>
              {socialClass.letter}
            </div>
            <div className="space-y-0.5 text-left">
              <span className="text-[9px] font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400">Classe Social Estimada (Métrica IBGE/FGV)</span>
              <h4 className="text-sm font-extrabold" style={{ color: 'var(--c-ink)' }}>{socialClass.name}</h4>
              <p className="text-xs" style={{ color: 'var(--c-muted)' }}>{socialClass.desc}</p>
            </div>
          </div>
        )}

        {/* Guia de Ação Financeira Dinâmico (Estatístico) */}
        {salary > 0 && (
          <div 
            className="rounded-2xl border p-5 space-y-4 animate-fadeIn"
            style={{
              backgroundColor: 'var(--c-surface)',
              borderColor: 'var(--c-line)'
            }}
          >
            {/* Cabeçalho */}
            <div className="flex justify-between items-center" style={{ borderBottom: '1px solid var(--c-line)', paddingBottom: 12 }}>
              <span className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--c-muted)' }}>
                {salary / MINIMUM_WAGE <= 4 
                  ? '📈 Caminhos de Aceleração Financeira' 
                  : '💎 Blindagem e Multiplicação de Patrimônio'
                }
              </span>
              <div className="flex items-center gap-1 text-[10px] text-emerald-600 dark:text-emerald-400 font-bold bg-emerald-500/5 px-2 py-0.5 rounded-lg border border-emerald-500/10">
                <Sparkles size={11} /> Visão Estatística
              </div>
            </div>

            {/* Conteúdo Dinâmico */}
            {salary / MINIMUM_WAGE <= 4 ? (
              // INSIGHTS PARA CLASSES D E E
              <div className="space-y-4 text-xs leading-relaxed text-stone-600 dark:text-stone-300">
                <p className="text-left">
                  Estatisticamente, as maiores alavancas para mudar seu patamar de renda no Brasil não dependem de sorte, mas de decisões estratégicas de qualificação e fuga de armadilhas de consumo:
                </p>
                <div className="space-y-3 text-left">
                  <div className="flex items-start gap-2.5">
                    <CheckCircle2 className="text-emerald-500 shrink-0 mt-0.5" size={14} />
                    <div>
                      <p className="font-bold text-stone-800 dark:text-stone-100">O Retorno Prático do Ensino Técnico 🎓</p>
                      <p style={{ color: 'var(--c-muted)' }} className="mt-0.5 text-xs">
                        Pesquisas do IBGE e do SENAI revelam que profissionais com <strong>curso técnico</strong> têm taxa de empregabilidade acima de 80% e ganham, em média, <strong>32% mais</strong> do que profissionais com apenas o ensino médio regular. Focar em qualificações técnicas rápidas ou certificações de tecnologia é o caminho de educação com maior retorno financeiro imediato no país.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-2.5">
                    <CheckCircle2 className="text-emerald-500 shrink-0 mt-0.5" size={14} />
                    <div>
                      <p className="font-bold text-stone-800 dark:text-stone-100">Estancar o Sangramento de Juros de Consumo 💳</p>
                      <p style={{ color: 'var(--c-muted)' }} className="mt-0.5 text-xs">
                        Dados da CNC mostram que mais de 78% das famílias brasileiras estão endividadas. O <strong>rotativo do cartão de crédito (com taxas de juros que superam 400% ao ano)</strong> é a maior barreira de empobrecimento individual do país. Priorizar a liquidação de dívidas de consumo caras e evitar compras parceladas no carnê ou cartão é a decisão financeira individual de maior impacto imediato.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5">
                    <CheckCircle2 className="text-emerald-500 shrink-0 mt-0.5" size={14} />
                    <div>
                      <p className="font-bold text-stone-800 dark:text-stone-100">A Reserva de Emergência 🛡️</p>
                      <p style={{ color: 'var(--c-muted)' }} className="mt-0.5 text-xs">
                        Guardar mesmo que R$ 30 ou R$ 50 por mês em uma conta com rendimento diário constrói uma <strong>reserva de paz</strong>. Ter um colchão de proteção mínimo para imprevistos domésticos ou de saúde impede que você precise recorrer a empréstimos pessoais abusivos em emergências, rompendo o ciclo da vulnerabilidade.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              // INSIGHTS PARA CLASSES A, B E C
              <div className="space-y-4 text-xs leading-relaxed text-stone-600 dark:text-stone-300">
                <p className="text-left">
                  Para quem conquistou patamares de classe média ou alta, o principal desafio estatístico deixa de ser o aumento imediato do salário e passa a ser a blindagem patrimonial contra o risco inflacionário e cambial:
                </p>
                <div className="space-y-3 text-left">
                  <div className="flex items-start gap-2.5">
                    <CheckCircle2 className="text-emerald-500 shrink-0 mt-0.5" size={14} />
                    <div>
                      <p className="font-bold text-stone-800 dark:text-stone-100">Sair do Ralo Invisível da Poupança 📉</p>
                      <p style={{ color: 'var(--c-muted)' }} className="mt-0.5 text-xs">
                        Apesar de o Brasil ter uma das maiores taxas de juros reais do mundo, bilhões de reais ainda estão presos na caderneta de poupança, que historicamente perde para a inflação real (IPCA). Alocar seu colchão de liquidez em contas de rendimento 100% do <strong>CDI ou Tesouro Selic</strong> protege o poder de compra com o menor risco de crédito possível.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5">
                    <CheckCircle2 className="text-emerald-500 shrink-0 mt-0.5" size={14} />
                    <div>
                      <p className="font-bold text-stone-800 dark:text-stone-100">Fidelidade aos Aportes Mensais ☃️</p>
                      <p style={{ color: 'var(--c-muted)' }} className="mt-0.5 text-xs">
                        Estudos de finanças comportamentais indicam que a consistência e a disciplina de poupar de 10% a 20% da renda de forma automática superam estatisticamente qualquer tentativa de escolher <strong>ações quentes</strong> no mercado. Deixe os juros compostos trabalharem de forma passiva no tempo.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5">
                    <CheckCircle2 className="text-emerald-500 shrink-0 mt-0.5" size={14} />
                    <div>
                      <p className="font-bold text-stone-800 dark:text-stone-100">Blindagem Cambial e Internacionalização (Risco Brasil) 🌍</p>
                      <p style={{ color: 'var(--c-muted)' }} className="mt-0.5 text-xs">
                        Manter 100% dos seus investimentos em <strong>Reais</strong> expõe todo o seu patrimônio ao risco soberano e inflacionário local. Alocar de 10% a 30% da sua riqueza em moedas fortes e ativos globais (como Dólar ou Euro através de contas de câmbio inteligente, como a nossa parceira <strong>Wise</strong>) atua como um excelente seguro de volatilidade do patrimônio contra crises locais.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Sub-métricas rápidas */}
        <MetricGrid
          metrics={[
            {
              label: selectedState.group === 'polo' ? `No polo: ${selectedState.capital}` : `No estado: ${selectedState.code}`,
              value: salary > 0 ? `Supera ${stateDisplay}%` : '0,0%',
              sublabel: 'da população local',
            },
            {
              label: 'Em salários mínimos',
              value: salary > 0 ? `${salaryInMinimumWages.toFixed(1).replace('.', ',')}x` : '0,0x',
              sublabel: `Mínimo de R$ ${MINIMUM_WAGE}`,
              colorClass: 'text-teal-600 dark:text-teal-400',
            },
            {
              label: 'Poder de Cesta Básica',
              value: salary > 0 ? `${salaryInCestasBasicas.toFixed(1).replace('.', ',')}x` : '0,0x',
              sublabel: selectedState.group === 'polo' 
                ? `Cesta em ${selectedState.capital}: R$ ${selectedState.cestaBasica}`
                : `Cesta em ${selectedState.capital || 'Capitais'}: R$ ${selectedState.cestaBasica}`,
              colorClass: 'text-amber-500 dark:text-amber-400',
            },
          ]}
        />

        {/* Gráfico de Pirâmide Social */}
        <div 
          className="rounded-2xl border p-5 space-y-4"
          style={{
            backgroundColor: 'var(--c-card-calm)',
            borderColor: 'var(--c-line)'
          }}
        >
          <div className="flex justify-between items-baseline" style={{ borderBottom: '1px solid var(--c-line)', paddingBottom: 12 }}>
            <div>
              <h3 className="text-base font-bold" style={{ color: 'var(--c-ink)' }}>Pirâmide Social Brasileira</h3>
              <p className="text-xs" style={{ color: 'var(--c-muted)' }}>Distribuição socioeconômica e a sua posição</p>
            </div>
            <span className="text-[10px] uppercase font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/5 px-2 py-0.5 rounded-lg border border-emerald-500/10 flex items-center gap-1">
              <Sparkles size={11} /> Distribuição
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center pt-2">
            {/* Visual da Pirâmide (Esquerda no Desktop) */}
            <div className="md:col-span-6 flex flex-col items-center justify-center py-4 relative">
              <div className="w-full max-w-[280px] flex flex-col items-center gap-2">
                {pyramidTiers.map((tier) => {
                  return (
                    <div
                      key={tier.letter}
                      style={{ width: tier.width }}
                      className={`relative group rounded-xl p-2.5 flex flex-col items-center justify-center transition-all duration-300 cursor-pointer select-none bg-gradient-to-r ${tier.color} ${
                        tier.isActive
                          ? `scale-[1.05] ring-2 ring-white dark:ring-stone-900 shadow-xl border-2 ${tier.borderColor} z-10`
                          : 'opacity-65 hover:opacity-90 border border-transparent scale-100 hover:scale-[1.02] shadow-sm'
                      }`}
                    >
                      {/* Badge "Você está aqui" */}
                      {tier.isActive && (
                        <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-rose-500 text-white text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-full shadow-md animate-bounce flex items-center gap-0.5 whitespace-nowrap z-20 border border-white dark:border-stone-900">
                          <span className="relative flex h-1.5 w-1.5 mr-0.5">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-200 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-rose-100"></span>
                          </span>
                          Você está aqui
                        </div>
                      )}

                      {/* Letra da Classe */}
                      <span className={`text-base font-extrabold tracking-wider ${tier.textColor}`}>
                        Classe {tier.letter}
                      </span>
                      
                      {/* Descrição Compacta */}
                      <span className={`text-[9px] font-medium opacity-80 ${tier.textColor}`}>
                        {tier.description}
                      </span>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Informações de Cada Classe (Direita no Desktop) */}
            <div className="md:col-span-6 space-y-2">
              {pyramidTiers.map((tier) => {
                return (
                  <div
                    key={tier.letter}
                    className={`p-2.5 rounded-xl border transition-all duration-200 text-left flex items-center justify-between gap-3 ${
                      tier.isActive
                        ? 'bg-emerald-500/5 dark:bg-emerald-500/10 border-emerald-500/30 shadow-sm'
                        : 'bg-white/40 dark:bg-stone-900/40 border-stone-200 dark:border-stone-800'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <span className={`w-8 h-8 rounded-lg flex items-center justify-center font-extrabold text-sm border-2 ${
                        tier.isActive
                          ? 'bg-emerald-500 text-white border-transparent'
                          : 'bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 border-stone-200 dark:border-stone-700'
                      }`}>
                        {tier.letter}
                      </span>
                      <div>
                        <h4 className={`text-xs font-bold ${tier.isActive ? 'text-emerald-700 dark:text-emerald-400' : 'text-stone-800 dark:text-stone-200'}`}>
                          {tier.name}
                        </h4>
                        <p className="text-[10px] text-stone-500 dark:text-stone-400 leading-tight">
                          {tier.label}
                        </p>
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="text-[10px] font-bold text-stone-700 dark:text-stone-300 block">
                        {tier.range}
                      </span>
                      {tier.isActive && (
                        <span className="text-[8px] font-extrabold uppercase text-rose-500 dark:text-rose-400 tracking-wider">
                          Sua Faixa
                        </span>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* Curva de Concentração Recharts */}
        <div 
          className="rounded-2xl border p-5 space-y-4"
          style={{
            backgroundColor: 'var(--c-card-calm)',
            borderColor: 'var(--c-line)'
          }}
        >
          <div className="flex justify-between items-center">
            <div>
              <p className="text-base font-bold" style={{ color: 'var(--c-ink)' }}>Curva de Distribuição de Renda</p>
              <p className="text-xs" style={{ color: 'var(--c-muted)' }}>Onde você está na pirâmide de renda de {selectedState.name}</p>
            </div>
          </div>

          <ResponsiveContainer width="100%" height={240}>
            <AreaChart data={chartData} margin={{ top: 12, right: 8, left: -22, bottom: 0 }}>
              <defs>
                <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={isTopTier ? '#f59e0b' : '#0a8a7e'} stopOpacity={0.35}/>
                  <stop offset="95%" stopColor={isTopTier ? '#f59e0b' : '#0a8a7e'} stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--c-line)" opacity={0.6} />
              <XAxis
                dataKey="percentile"
                tick={{ fontSize: 10, fill: '#78716c' }}
                tickFormatter={(v) => `${v}%`}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 10, fill: '#78716c' }}
                tickFormatter={(v) => `R$ ${(v / 1000).toFixed(0)}k`}
                tickLine={false}
                axisLine={false}
              />
              <Tooltip 
                formatter={(value) => [formatBRL(Number(value)), 'Corte de Renda']}
                labelFormatter={(label) => `Percentil: ${label}% da População`}
                contentStyle={{
                  backgroundColor: 'var(--c-card-calm)',
                  color: 'var(--c-ink)',
                  borderColor: 'var(--c-line)',
                  borderRadius: 12,
                  fontSize: 12
                }}
              />
              <Area
                type="monotone"
                dataKey="Renda Mensal"
                stroke={isTopTier ? '#f59e0b' : '#0a8a7e'}
                fillOpacity={1}
                fill="url(#colorIncome)"
                strokeWidth={2}
              />
              
              {/* O ponto exato do usuário */}
              {salary > 0 && (
                <ReferenceDot
                  x={userChartPoint.percentile}
                  y={userChartPoint['Renda Mensal']}
                  r={6}
                  fill={isTopTier ? '#f59e0b' : '#00C4BE'}
                  stroke="#ffffff"
                  strokeWidth={2}
                />
              )}
            </AreaChart>
          </ResponsiveContainer>
          <p className="text-[10px] text-stone-400 text-center italic">
            O eixo horizontal representa a porcentagem da população mais pobre que você supera. O eixo vertical indica a renda correspondente.
          </p>
        </div>

        {/* Section: Comparações de Profissões */}
        <div 
          className="rounded-2xl border p-5 space-y-4"
          style={{
            backgroundColor: 'var(--c-card-calm)',
            borderColor: 'var(--c-line)'
          }}
        >
          <div className="flex justify-between items-baseline" style={{ borderBottom: '1px solid var(--c-line)', paddingBottom: 12 }}>
            <h3 className="text-base font-bold" style={{ color: 'var(--c-ink)' }}>Comparações Profissionais</h3>
            <span className="text-[10px] uppercase font-bold" style={{ color: 'var(--c-muted)' }}>Média vs Seu Salário</span>
          </div>

          <div className="divide-y text-sm" style={{ borderColor: 'var(--c-line)' }}>
            {professionComparisons.map((p) => {
              const matches = salary >= p.salary
              const ratioText = matches 
                ? `(+${p.percentDiff.toFixed(0)}%)`
                : `(${p.percentDiff.toFixed(0)}%)`

              return (
                <div key={p.name} className="flex items-center justify-between py-3 hover:bg-black/[0.01] dark:hover:bg-white/[0.01] transition-colors">
                  <div className="flex items-center gap-3">
                    <span className="text-lg">{p.emoji}</span>
                    <div>
                      <p className="font-semibold" style={{ color: 'var(--c-ink)' }}>{p.name}</p>
                      <p className="text-xs" style={{ color: 'var(--c-muted)' }}>Média: {formatBRL(p.salary)}</p>
                    </div>
                  </div>

                  <div className="text-right">
                    <p className={`font-bold tabular-nums ${matches ? 'text-emerald-600 dark:text-emerald-400' : 'text-stone-500'}`}>
                      {matches ? '+' : ''}{p.ratio.toFixed(1).replace('.', ',')}x
                    </p>
                    <p className={`text-[10px] font-bold ${matches ? 'text-emerald-500' : 'text-red-500'}`}>
                      {ratioText}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Section: Compartilhar o Wrapped da desigualdade */}
        <div className="rounded-2xl p-4 border" style={{ backgroundColor: 'var(--c-surface)', borderColor: 'var(--c-line)' }}>
          <p className="text-xs mb-3 text-center font-bold uppercase tracking-wider" style={{ color: 'var(--c-muted)' }}>
            Compartilhe a sua posição
          </p>
          <ScaledPreview>
            <ShareCardBase
              id="realidade-share-card"
              eyebrow="Realidade Brasileira · Minha Posição"
              mainValue={salary > 0 ? `TOP ${(100 - nationalPercentile).toFixed(1).replace('.', ',')}%` : 'PIRÂMIDE'}
              mainLabel={`ganho mais que ${nationalDisplay}% dos brasileiros`}
              metrics={[
                { label: 'Meu Salário Líquido', value: formatBRL(salary) },
                { label: selectedState.group === 'polo' ? `No polo de ${selectedState.capital}` : `No estado de ${selectedState.code}`, value: `Mais rico que ${stateDisplay}%` },
                { label: 'Salários Mínimos', value: `${salaryInMinimumWages.toFixed(1).replace('.', ',')} mínimos` },
                { label: 'Classe Social (IBGE)', value: `Classe ${socialClass.letter}` },
              ]}
              footer="a pirâmide da desigualdade social sob a ponta do lápis."
              accentColor={isTopTier ? '#f59e0b' : '#0a8a7e'}
            />
          </ScaledPreview>
          <div className="mt-3">
            <ShareButtons cardId="realidade-share-card" filename="realidade-brasileira" />
          </div>
        </div>

      </div>
    </div>
  )
}
