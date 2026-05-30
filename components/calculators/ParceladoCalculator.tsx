'use client'

import React, { useState, useMemo } from 'react'
import { CalculatorCard } from '@/components/ui/CalculatorCard'
import { ResultHero } from '@/components/ui/ResultHero'
import { MetricGrid } from '@/components/ui/MetricGrid'
import { ShareCardBase } from '@/components/share/ShareCard'
import { ScaledPreview } from '@/components/ui/ScaledPreview'
import { ShareButtons } from '@/components/ui/ShareButtons'
import { formatBRL } from '@/lib/formatters'
import { calculateParcelado } from '@/config/parcelado'
import { HelpCircle, Sparkles, CheckCircle2, AlertTriangle, XCircle } from 'lucide-react'

// Funções auxiliares para formatação de BRL em inputs de texto
const getBRLDisplayValue = (num: number) => {
  if (num === 0) return ''
  return Math.round(num).toLocaleString('pt-BR')
}

const parseBRLInputValue = (value: string): number => {
  const cleanValue = value.replace(/\D/g, '')
  if (cleanValue === '') return 0
  return parseInt(cleanValue, 10)
}

export function ParceladoCalculator() {
  const [priceParcelado, setPriceParcelado] = useState<number>(1000)
  const [priceVista, setPriceVista] = useState<number>(900)
  const [installments, setInstallments] = useState<number>(10)

  const results = useMemo(() => {
    return calculateParcelado({
      priceVista,
      priceParcelado,
      installments
    })
  }, [priceVista, priceParcelado, installments])

  const handleBRLInputChange = (field: 'vista' | 'parcelado', rawValue: string) => {
    const numericValue = parseBRLInputValue(rawValue)
    if (field === 'vista') {
      setPriceVista(numericValue)
    } else {
      setPriceParcelado(numericValue)
    }
  }

  // Estilos de cores dinâmicos baseados no veredito
  const themeColors = useMemo(() => {
    if (priceVista >= priceParcelado) {
      return {
        text: 'text-stone-500',
        bg: 'bg-stone-500/5',
        border: 'border-stone-500/20',
        icon: <HelpCircle className="text-stone-500 shrink-0" size={20} />
      }
    }
    if (results.verdict === 'parcelar') {
      return {
        text: 'text-emerald-600 dark:text-emerald-400',
        bg: 'bg-emerald-500/5',
        border: 'border-emerald-500/20 border',
        icon: <CheckCircle2 className="text-emerald-600 dark:text-emerald-400 shrink-0" size={20} />
      }
    } else if (results.verdict === 'alerta') {
      return {
        text: 'text-amber-600 dark:text-amber-400',
        bg: 'bg-amber-500/5',
        border: 'border-amber-500/20 border',
        icon: <AlertTriangle className="text-amber-600 dark:text-amber-400 shrink-0" size={20} />
      }
    } else {
      return {
        text: 'text-red-600 dark:text-red-400',
        bg: 'bg-red-500/5',
        border: 'border-red-500/20 border',
        icon: <XCircle className="text-red-600 dark:text-red-400 shrink-0" size={20} />
      }
    }
  }, [results, priceVista, priceParcelado])

  const displayRate = results.implicitRateMonthly.toFixed(2).replace('.', ',')
  const displayAnnualRate = results.implicitRateAnnual.toFixed(1).replace('.', ',')

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:items-start">
      {/* ── COLUNA ESQUERDA: INPUTS ────────────────────────────── */}
      <div className="lg:col-span-5 space-y-4">
        <CalculatorCard 
          title="Simulador de Juros Embutidos" 
          subtitle="Preço parcelado vs preço à vista. Descubra a taxa de juros implícita real da sua compra."
        >
          {/* 1. Preço Total Parcelado */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label htmlFor="parcelado-input" className="text-sm font-semibold" style={{ color: 'var(--c-muted)' }}>
                Preço Total Parcelado
              </label>
              <div className="relative w-40">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-medium" style={{ color: 'var(--c-muted)' }}>R$</span>
                <input
                  id="parcelado-input"
                  type="text"
                  inputMode="numeric"
                  value={getBRLDisplayValue(priceParcelado)}
                  placeholder="0"
                  onChange={(e) => handleBRLInputChange('parcelado', e.target.value)}
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
              max={15000}
              step={100}
              value={priceParcelado > 15000 ? 15000 : priceParcelado}
              onChange={(e) => setPriceParcelado(Number(e.target.value))}
              aria-label="Preço Parcelado Slider"
              className="w-full h-2 rounded-lg appearance-none cursor-pointer accent-emerald-500"
              style={{ backgroundColor: 'var(--c-line)' }}
            />
          </div>

          {/* 2. Preço À Vista (Pix / Boleto) */}
          <div className="space-y-2 pt-2 border-t" style={{ borderColor: 'var(--c-line)' }}>
            <div className="flex justify-between items-center">
              <label htmlFor="vista-input" className="text-sm font-semibold" style={{ color: 'var(--c-muted)' }}>
                Preço À Vista com Desconto
              </label>
              <div className="relative w-40">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-medium" style={{ color: 'var(--c-muted)' }}>R$</span>
                <input
                  id="vista-input"
                  type="text"
                  inputMode="numeric"
                  value={getBRLDisplayValue(priceVista)}
                  placeholder="0"
                  onChange={(e) => handleBRLInputChange('vista', e.target.value)}
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
              min={50}
              max={15000}
              step={50}
              value={priceVista > 15000 ? 15000 : priceVista}
              onChange={(e) => setPriceVista(Number(e.target.value))}
              aria-label="Preço à Vista Slider"
              className="w-full h-2 rounded-lg appearance-none cursor-pointer accent-emerald-500"
              style={{ backgroundColor: 'var(--c-line)' }}
            />
          </div>

          {/* 3. Número de Parcelas */}
          <div className="space-y-2 pt-2 border-t" style={{ borderColor: 'var(--c-line)' }}>
            <div className="flex justify-between items-center">
              <label htmlFor="installments-select" className="text-sm font-semibold" style={{ color: 'var(--c-muted)' }}>
                Número de Parcelas
              </label>
              <select
                id="installments-select"
                value={installments}
                onChange={(e) => setInstallments(Number(e.target.value))}
                className="border rounded-xl px-3 py-2 text-base font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer"
                style={{
                  backgroundColor: 'var(--c-bg)',
                  color: 'var(--c-ink)',
                  borderColor: 'var(--c-line)'
                }}
              >
                {[2, 3, 4, 5, 6, 8, 10, 12, 18, 24, 36].map((n) => (
                  <option key={n} value={n}>
                    {n}x de {formatBRL(priceParcelado / n)}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </CalculatorCard>
      </div>

      {/* ── COLUNA DIREITA: RESULTADOS ──────────────────────────── */}
      <div role="region" aria-live="polite" aria-label="Resultado do Parcelamento" className="lg:col-span-7 space-y-4">
        {priceVista >= priceParcelado ? (
          <div className="rounded-2xl border p-6 text-center space-y-2" style={{ backgroundColor: 'var(--c-card-calm)', borderColor: 'var(--c-line)' }}>
            <AlertTriangle className="mx-auto text-amber-500 animate-pulse" size={32} />
            <h3 className="text-lg font-bold" style={{ color: 'var(--c-ink)' }}>Incongruência nos Preços</h3>
            <p className="text-sm" style={{ color: 'var(--c-muted)' }}>
              O preço à vista com desconto deve ser <strong>menor</strong> do que o preço parcelado para podermos extrair a taxa de juros implícita do parcelamento.
            </p>
          </div>
        ) : (
          <>
            {/* Result Hero */}
            <ResultHero
              label="Taxa de Juros Implícita Oculta"
              value={`${displayRate}% ao mês`}
              comment={`Equivale a uma taxa de ${displayAnnualRate}% ao ano cobrada nas sombras.`}
              colorClass={
                results.verdict === 'parcelar' 
                  ? 'text-emerald-600 dark:text-emerald-400' 
                  : results.verdict === 'alerta' 
                    ? 'text-amber-500 dark:text-amber-400 font-extrabold' 
                    : 'text-red-500 dark:text-red-400 font-extrabold'
              }
              infoTooltip="Mesmo anunciado como 'sem juros', se o estabelecimento oferece desconto à vista, significa que a taxa de desconto foi embutida como juro embutido no financiamento parcelado."
            />

            {/* Verdict Box */}
            <div className={`rounded-2xl border p-4 flex gap-4 transition-all duration-300 ${themeColors.bg} ${themeColors.border}`}>
              {themeColors.icon}
              <div className="space-y-1 text-left text-xs leading-relaxed">
                <h4 className={`text-sm font-extrabold ${themeColors.text}`}>{results.verdictTitle}</h4>
                <p style={{ color: 'var(--c-muted)' }}>{results.verdictDesc}</p>
              </div>
            </div>

            {/* Metrics Grid */}
            <MetricGrid
              metrics={[
                {
                  label: 'Economia À Vista',
                  value: formatBRL(results.discountValue),
                  sublabel: `Desconto de ${results.discountPct.toFixed(1).replace('.', ',')}%`,
                  colorClass: 'text-emerald-600 dark:text-emerald-400',
                },
                {
                  label: 'Equivalente CDI',
                  value: `${Math.round(results.equivalentCDI)}%`,
                  sublabel: 'do rendimento do CDI',
                  colorClass: results.verdict === 'vista' ? 'text-red-500' : 'text-stone-700 dark:text-stone-300',
                },
                {
                  label: 'Valor da Parcela',
                  value: formatBRL(results.pmtValue),
                  sublabel: `em ${results.installments}x fixas`,
                  colorClass: 'text-stone-900 dark:text-stone-100',
                },
              ]}
            />

            {/* Comparativo de Oportunidade */}
            <div 
              className="rounded-2xl border p-5 space-y-4"
              style={{
                backgroundColor: 'var(--c-card-calm)',
                borderColor: 'var(--c-line)'
              }}
            >
              <div className="flex justify-between items-baseline" style={{ borderBottom: '1px solid var(--c-line)', paddingBottom: 12 }}>
                <h3 className="text-base font-bold" style={{ color: 'var(--c-ink)' }}>Análise de Custo de Oportunidade</h3>
                <span className="text-[10px] uppercase font-bold" style={{ color: 'var(--c-muted)' }}>Métricas Comparativas</span>
              </div>

              <div className="space-y-4 text-xs leading-relaxed text-left" style={{ color: 'var(--c-muted)' }}>
                <p>
                  A taxa de <strong>{displayRate}% ao mês</strong> aplicada a este parcelamento representa um custo invisível muito superior ao retorno da maioria dos investimentos conservadores no Brasil:
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
                  <div className="p-3 rounded-xl border bg-white/40 dark:bg-stone-900/40" style={{ borderColor: 'var(--c-line)' }}>
                    <p className="font-bold text-stone-800 dark:text-stone-200">Comparado à Poupança 🏦</p>
                    <p className="mt-1 text-[11px]">
                      A poupança rende cerca de <strong>0,5% ao mês + TR</strong>. Os juros que você aceita pagar ao parcelar são <strong>{Math.round(results.implicitRateMonthly / 0.5)} vezes maiores</strong> do que o rendimento da caderneta.
                    </p>
                  </div>
                  
                  <div className="p-3 rounded-xl border bg-white/40 dark:bg-stone-900/40" style={{ borderColor: 'var(--c-line)' }}>
                    <p className="font-bold text-stone-800 dark:text-stone-200">Comparado ao Tesouro Direto 📈</p>
                    <p className="mt-1 text-[11px]">
                      O CDI rende em média <strong>0,8% ao mês</strong> líquido. Parcelar este produto equivale a tomar um empréstimo cobrando <strong>{Math.round(results.equivalentCDI)}% do CDI</strong>. Evitar este juro é o melhor "investimento" possível.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Share Wrapper */}
            <div className="rounded-2xl p-4 border" style={{ backgroundColor: 'var(--c-surface)', borderColor: 'var(--c-line)' }}>
              <p className="text-xs mb-3 text-center font-bold uppercase tracking-wider" style={{ color: 'var(--c-muted)' }}>
                Compartilhe a Simulação
              </p>
              <ScaledPreview>
                <ShareCardBase
                  id="parcelado-share-card"
                  eyebrow="Juros Ocultos do Parcelamento"
                  mainValue={`${displayRate}% a.m.`}
                  mainLabel={`taxa real do 'sem juros' em ${results.installments}x`}
                  metrics={[
                    { label: 'Valor À Vista', value: formatBRL(results.priceVista) },
                    { label: 'Valor Parcelado', value: formatBRL(results.priceParcelado) },
                    { label: 'Economia À Vista', value: formatBRL(results.discountValue) },
                    { label: 'Juro Anualizado', value: `${displayAnnualRate}% a.a.` },
                  ]}
                  footer="a mentira do sem juros sob a ponta do lápis."
                  accentColor={results.verdict === 'parcelar' ? '#10b981' : results.verdict === 'alerta' ? '#f59e0b' : '#ef4444'}
                />
              </ScaledPreview>
              <div className="mt-3">
                <ShareButtons cardId="parcelado-share-card" filename="juros-ocultos-parcelado" />
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
