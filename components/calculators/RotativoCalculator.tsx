'use client'

import React, { useState, useMemo } from 'react'
import { CalculatorCard } from '@/components/ui/CalculatorCard'
import { ResultHero } from '@/components/ui/ResultHero'
import { MetricGrid } from '@/components/ui/MetricGrid'
import { ShareCardBase } from '@/components/share/ShareCard'
import { ScaledPreview } from '@/components/ui/ScaledPreview'
import { ShareButtons } from '@/components/ui/ShareButtons'
import { formatBRL, formatBRLInput, parseBRLInput } from '@/lib/formatters'
import { calculateRotativo, ROTATIVO_DEFAULTS } from '@/config/rotativo'
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts'
import { Sparkles, HelpCircle, AlertTriangle, ShieldAlert, BadgePercent, GraduationCap, Coins } from 'lucide-react'

// Funções auxiliares para formatação de BRL em inputs de texto
const getBRLDisplayValue = (num: number) => formatBRLInput(Math.round(num))

export function RotativoCalculator() {
  const [debtValue, setDebtValue] = useState<number>(5000)
  const [cardRate, setCardRate] = useState<number>(ROTATIVO_DEFAULTS.CARD_RATE_DEFAULT)
  const [monthlyPayment, setMonthlyPayment] = useState<number>(400)
  const [loanRate, setLoanRate] = useState<number>(ROTATIVO_DEFAULTS.LOAN_RATE_DEFAULT)

  const results = useMemo(() => {
    return calculateRotativo({
      debtValue,
      cardRate,
      monthlyPayment,
      loanRate
    })
  }, [debtValue, cardRate, monthlyPayment, loanRate])

  const handleBRLInputChange = (field: 'debt' | 'payment', rawValue: string) => {
    const numericValue = Math.round(parseBRLInput(rawValue))
    if (field === 'debt') {
      setDebtValue(numericValue)
    } else {
      setMonthlyPayment(numericValue)
    }
  }

  // Prepara dados do gráfico de timeline
  const chartData = useMemo(() => {
    return results.cardTimeline.map(pt => ({
      name: `Mês ${pt.month}`,
      'Dívida no Cartão': pt.cardBalance,
      'Dívida de Troca (Saudável)': pt.loanBalance
    }))
  }, [results])

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:items-start">
      {/* ── COLUNA ESQUERDA: INPUTS ────────────────────────────── */}
      <div className="lg:col-span-5 space-y-4">
        <CalculatorCard 
          title="Fuga do Rotativo" 
          subtitle="Troque uma dívida impagável por uma linha sustentável. Simule a economia de juros na prática."
        >
          
          {/* 1. Valor da Dívida Atual */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label htmlFor="debt-input" className="text-sm font-semibold flex items-center gap-1" style={{ color: 'var(--c-muted)' }}>
                Dívida Atual do Cartão
              </label>
              <div className="relative w-40">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-medium" style={{ color: 'var(--c-muted)' }}>R$</span>
                <input
                  id="debt-input"
                  type="text"
                  inputMode="numeric"
                  value={getBRLDisplayValue(debtValue)}
                  placeholder="0"
                  onChange={(e) => handleBRLInputChange('debt', e.target.value)}
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
              min={500}
              max={50000}
              step={500}
              value={debtValue > 50000 ? 50000 : debtValue}
              onChange={(e) => setDebtValue(Number(e.target.value))}
              aria-label="Valor da Dívida Slider"
              className="w-full h-2 rounded-lg appearance-none cursor-pointer accent-emerald-500"
              style={{ backgroundColor: 'var(--c-line)' }}
            />
            <div className="flex justify-between text-[10px] font-semibold" style={{ color: 'var(--c-muted)' }}>
              <span>R$ 500</span>
              <span>R$ 50 mil+</span>
            </div>
          </div>

          {/* 2. Pagamento Mensal Disponível */}
          <div className="space-y-2 pt-2 border-t" style={{ borderColor: 'var(--c-line)' }}>
            <div className="flex justify-between items-center">
              <label htmlFor="payment-input" className="text-sm font-semibold" style={{ color: 'var(--c-muted)' }}>
                Parcela Mensal que Consegue Pagar
              </label>
              <div className="relative w-40">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-medium" style={{ color: 'var(--c-muted)' }}>R$</span>
                <input
                  id="payment-input"
                  type="text"
                  inputMode="numeric"
                  value={getBRLDisplayValue(monthlyPayment)}
                  placeholder="0"
                  onChange={(e) => handleBRLInputChange('payment', e.target.value)}
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
              min={100}
              max={5000}
              step={50}
              value={monthlyPayment > 5000 ? 5000 : monthlyPayment}
              onChange={(e) => setMonthlyPayment(Number(e.target.value))}
              aria-label="Pagamento Slider"
              className="w-full h-2 rounded-lg appearance-none cursor-pointer accent-emerald-500"
              style={{ backgroundColor: 'var(--c-line)' }}
            />
            <div className="flex justify-between text-[10px] font-semibold" style={{ color: 'var(--c-muted)' }}>
              <span>R$ 100</span>
              <span>R$ 5.000+</span>
            </div>
          </div>

          {/* 3. Taxa do Rotativo do Cartão */}
          <div className="space-y-2 pt-2 border-t" style={{ borderColor: 'var(--c-line)' }}>
            <div className="flex justify-between items-center">
              <label htmlFor="card-rate-input" className="text-sm font-semibold flex items-center gap-1.5" style={{ color: 'var(--c-muted)' }}>
                Juros do Cartão (Rotativo)
                <span className="text-[9px] bg-red-500/10 text-red-500 font-bold px-1.5 py-0.5 rounded-md">Média Nacional</span>
              </label>
              <div className="relative w-32">
                <input
                  id="card-rate-input"
                  type="number"
                  step="0.1"
                  value={cardRate === 0 ? '' : cardRate}
                  onChange={(e) => setCardRate(Math.max(0, Number(e.target.value) || 0))}
                  className="w-full text-right border rounded-xl pr-7 pl-3 py-2 text-base font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500 tabular-nums"
                  style={{
                    backgroundColor: 'var(--c-bg)',
                    color: 'var(--c-ink)',
                    borderColor: 'var(--c-line)'
                  }}
                />
                <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs font-semibold" style={{ color: 'var(--c-muted)' }}>%</span>
              </div>
            </div>
            <input
              type="range"
              min={5}
              max={25}
              step={0.1}
              value={cardRate > 25 ? 25 : cardRate}
              onChange={(e) => setCardRate(Number(e.target.value))}
              aria-label="Taxa do Cartão Slider"
              className="w-full h-2 rounded-lg appearance-none cursor-pointer accent-emerald-500"
              style={{ backgroundColor: 'var(--c-line)' }}
            />
            <div className="flex justify-between text-[10px] font-semibold" style={{ color: 'var(--c-muted)' }}>
              <span>5% a.m.</span>
              <span>25% a.m. (Rotativo abusivo)</span>
            </div>
          </div>

          {/* 4. Taxa do Empréstimo Saudável */}
          <div className="space-y-2 pt-2 border-t" style={{ borderColor: 'var(--c-line)' }}>
            <div className="flex justify-between items-center">
              <label htmlFor="loan-rate-input" className="text-sm font-semibold flex items-center gap-1.5" style={{ color: 'var(--c-muted)' }}>
                Juros do Novo Empréstimo
                <span className="text-[9px] bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold px-1.5 py-0.5 rounded-md">Consignado/Garantia</span>
              </label>
              <div className="relative w-32">
                <input
                  id="loan-rate-input"
                  type="number"
                  step="0.1"
                  value={loanRate === 0 ? '' : loanRate}
                  onChange={(e) => setLoanRate(Math.max(0, Number(e.target.value) || 0))}
                  className="w-full text-right border rounded-xl pr-7 pl-3 py-2 text-base font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500 tabular-nums"
                  style={{
                    backgroundColor: 'var(--c-bg)',
                    color: 'var(--c-ink)',
                    borderColor: 'var(--c-line)'
                  }}
                />
                <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs font-semibold" style={{ color: 'var(--c-muted)' }}>%</span>
              </div>
            </div>
            <input
              type="range"
              min={1}
              max={10}
              step={0.1}
              value={loanRate > 10 ? 10 : loanRate}
              onChange={(e) => setLoanRate(Number(e.target.value))}
              aria-label="Taxa do Empréstimo Slider"
              className="w-full h-2 rounded-lg appearance-none cursor-pointer accent-emerald-500"
              style={{ backgroundColor: 'var(--c-line)' }}
            />
            <div className="flex justify-between text-[10px] font-semibold" style={{ color: 'var(--c-muted)' }}>
              <span>1% a.m. (Excelente)</span>
              <span>10% a.m.</span>
            </div>
          </div>
        </CalculatorCard>
      </div>

      {/* ── COLUNA DIREITA: RESULTADOS E GRAFICOS ────────────────── */}
      <div role="region" aria-live="polite" aria-label="Resultados da Fuga" className="lg:col-span-7 space-y-4">
        
        {/* Result Hero */}
        <ResultHero
          label="Economia com a Fuga do Rotativo"
          value={formatBRL(results.savingsMoney)}
          comment={
            results.isCardInfinite
              ? `Atenção: A dívida no cartão entra em espiral infinita e nunca seria paga sob esta parcela. A troca te salva de um colapso financeiro.`
              : `A troca da dívida te poupará juros equivalentes a ${results.savingsMonths} meses de sacrifício orçamentário.`
          }
          colorClass="text-emerald-600 dark:text-emerald-400 font-extrabold"
        />

        {/* Alerta de Perigo de Cartão de Crédito */}
        {results.isCardInfinite && (
          <div className="rounded-2xl border p-4 flex gap-3 bg-red-500/5 border-red-500/10 text-xs text-red-950 dark:text-red-200 leading-relaxed text-left">
            <ShieldAlert className="shrink-0 text-red-500 animate-pulse" size={24} />
            <div>
              <p className="font-extrabold text-red-950 dark:text-red-100 text-sm mb-1">Dívida Infinita no Cartão! 🛑</p>
              <p>
                Os juros do cartão de crédito (<strong>{formatBRL(debtValue * (cardRate / 100))}</strong> no primeiro mês) superam o seu pagamento de <strong>{formatBRL(monthlyPayment)}</strong>. Isso significa que mesmo pagando todo mês, sua dívida <strong>crescerá para sempre</strong>. Fazer a troca da dívida por um empréstimo saudável a {loanRate}% a.m. é a única saída matemática possível para o seu orçamento.
              </p>
            </div>
          </div>
        )}

        {/* Metrics Grid */}
        <MetricGrid
          metrics={[
            {
              label: 'Tempo no Empréstimo',
              value: `${results.loanMonthsToQuit} meses`,
              sublabel: `Taxa de ${loanRate.toFixed(1).replace('.', ',')}% a.m.`,
              colorClass: 'text-emerald-600 dark:text-emerald-400',
            },
            {
              label: 'Tempo no Cartão',
              value: results.isCardInfinite ? 'Infinito ♾️' : `${results.cardMonthsToQuit} meses`,
              sublabel: `Taxa de ${cardRate.toFixed(1).replace('.', ',')}% a.m.`,
              colorClass: 'text-red-500',
            },
            {
              label: 'Pago no Empréstimo',
              value: formatBRL(results.loanTotalPaid),
              sublabel: 'Total de parcelas quitadas',
              colorClass: 'text-stone-900 dark:text-stone-100',
            },
          ]}
        />

        {/* Comparative Line Chart */}
        <div 
          className="rounded-2xl border p-5 space-y-4"
          style={{
            backgroundColor: 'var(--c-card-calm)',
            borderColor: 'var(--c-line)'
          }}
        >
          <div className="flex justify-between items-center text-left">
            <div>
              <p className="text-base font-bold" style={{ color: 'var(--c-ink)' }}>Evolução Comparativa das Dívidas</p>
              <p className="text-xs" style={{ color: 'var(--c-muted)' }}>Veja como o saldo devedor se comporta no tempo nos dois cenários</p>
            </div>
            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-lg border bg-emerald-500/5 text-emerald-600 dark:text-emerald-400 border-emerald-500/10 flex items-center gap-0.5">
              <Sparkles size={11} /> Projeção
            </span>
          </div>

          <ResponsiveContainer width="100%" height={240}>
            <AreaChart data={chartData} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
              <defs>
                <linearGradient id="colorCard" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ef4444" stopOpacity={0.15}/>
                  <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorLoan" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.25}/>
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--c-line)" opacity={0.6} />
              <XAxis
                dataKey="name"
                tick={{ fontSize: 9, fill: '#78716c' }}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 9, fill: '#78716c' }}
                tickFormatter={(v) => `R$ ${(v / 1000).toFixed(0)}k`}
                width={36}
                tickLine={false}
                axisLine={false}
              />
              <Tooltip
                formatter={(v) => [formatBRL(Number(v)), 'Saldo Devedor']}
                contentStyle={{
                  backgroundColor: 'var(--c-card-calm)',
                  color: 'var(--c-ink)',
                  borderColor: 'var(--c-line)',
                  borderRadius: 12,
                  fontSize: 12
                }}
              />
              <Legend verticalAlign="top" height={36} wrapperStyle={{ fontSize: 11 }} />
              <Area
                type="monotone"
                dataKey="Dívida no Cartão"
                stroke="#ef4444"
                fillOpacity={1}
                fill="url(#colorCard)"
                strokeWidth={2}
              />
              <Area
                type="monotone"
                dataKey="Dívida de Troca (Saudável)"
                stroke="#10b981"
                fillOpacity={1}
                fill="url(#colorLoan)"
                strokeWidth={2.5}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Guia de Fuga: Ações Práticas */}
        <div 
          className="rounded-2xl border p-5 space-y-4 text-left"
          style={{
            backgroundColor: 'var(--c-surface)',
            borderColor: 'var(--c-line)'
          }}
        >
          <div className="flex justify-between items-center" style={{ borderBottom: '1px solid var(--c-line)', paddingBottom: 12 }}>
            <span className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--c-muted)' }}>
              🛡️ Protocolo e Plano Prático de Fuga das Dívidas
            </span>
            <div className="flex items-center gap-1 text-[10px] text-emerald-600 dark:text-emerald-400 font-bold bg-emerald-500/5 px-2 py-0.5 rounded-lg border border-emerald-500/10">
              <GraduationCap size={12} /> Guia Didático
            </div>
          </div>

          <div className="space-y-3.5 text-xs leading-relaxed text-stone-600 dark:text-stone-300">
            <div className="flex items-start gap-2.5">
              <BadgePercent className="text-emerald-500 shrink-0 mt-0.5" size={16} />
              <div>
                <p className="font-bold text-stone-800 dark:text-stone-100">1. Nunca Pague Apenas o Mínimo do Cartão 💳</p>
                <p style={{ color: 'var(--c-muted)' }} className="mt-0.5">
                  Ao pagar o mínimo, você ativará a pior linha de juros disponível na economia brasileira. Se não tiver dinheiro para quitar integralmente a fatura, ligue imediatamente para a operadora e solicite o <strong>parcelamento da fatura</strong>, que por lei possui taxas muito mais suaves do que os juros corridos do rotativo.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <Coins className="text-emerald-500 shrink-0 mt-0.5" size={16} />
              <div>
                <p className="font-bold text-stone-800 dark:text-stone-100">2. Faça a Troca Saudável de Passivos 🔄</p>
                <p style={{ color: 'var(--c-muted)' }} className="mt-0.5">
                  A troca de dívida por taxas menores é uma tática financeira consagrada. Procure portais de renegociação transparentes e independentes como o <strong>Serasa Limpa Nome</strong> e consulte cooperativas de crédito públicas que oferecem taxas de juros reduzidas para amortização e quitação integral de contas caras de varejo ou cartão.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <HelpCircle className="text-emerald-500 shrink-0 mt-0.5" size={16} />
              <div>
                <p className="font-bold text-stone-800 dark:text-stone-100">3. Conheça Seus Direitos (Lei do Superendividamento) ⚖️</p>
                <p style={{ color: 'var(--c-muted)' }} className="mt-0.5">
                  A <strong>Lei Federal nº 14.181/2021</strong> protege o cidadão do assédio de cobranças e garante o direito de renegociar todas as suas dívidas em bloco junto ao Judiciário, garantindo a preservação do seu <strong>"mínimo existencial"</strong> orçamentário. O seu sustento básico doméstico nunca pode ser confiscado para pagar juros bancários.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Share Wrapper */}
        <div className="rounded-2xl p-4 border" style={{ backgroundColor: 'var(--c-surface)', borderColor: 'var(--c-line)' }}>
          <p className="text-xs mb-3 text-center font-bold uppercase tracking-wider" style={{ color: 'var(--c-muted)' }}>
            Compartilhe a Simulação de Fuga
          </p>
          <ScaledPreview>
            <ShareCardBase
              id="rotativo-share-card"
              eyebrow="Fuga do Rotativo · Planilha"
              mainValue={results.isCardInfinite ? 'INFINITO' : `${results.loanMonthsToQuit} MESES`}
              mainLabel="prazo estimado para zerar minhas dívidas"
              metrics={[
                { label: 'Valor da Dívida', value: formatBRL(results.debtValue) },
                { label: 'Economia Estimada', value: formatBRL(results.savingsMoney) },
                { label: 'Quitação no Cartão', value: results.isCardInfinite ? 'Nunca Quita' : `${results.cardMonthsToQuit} meses` },
                { label: 'Parcela Mensal', value: formatBRL(results.monthlyPayment) },
              ]}
              footer="a rota de fuga das dívidas sob a ponta do lápis."
              accentColor="#10b981"
            />
          </ScaledPreview>
          <div className="mt-3">
            <ShareButtons cardId="rotativo-share-card" filename="fuga-do-rotativo" />
          </div>
        </div>

      </div>
    </div>
  )
}
