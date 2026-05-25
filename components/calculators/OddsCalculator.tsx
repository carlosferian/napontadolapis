'use client'

import React, { useState } from 'react'
import { CalculatorCard } from '@/components/ui/CalculatorCard'
import { SliderField } from '@/components/ui/SliderField'
import { SectionDivider } from '@/components/ui/SectionDivider'
import { ShareButtons } from '@/components/ui/ShareButtons'
import { ScaledPreview } from '@/components/ui/ScaledPreview'
import { formatBRL, formatPct } from '@/lib/formatters'
import { calcHouseEdge, expectedValuePerBet, probProfit } from '@/lib/calculations/probability'
import { ChevronDown } from 'lucide-react'

const ODD_OPTIONS = [1.5, 1.7, 1.9, 2.0, 2.5, 3.0]
const N_VALUES = [10, 50, 100, 500, 1000]

function oddToHumanContext(odd: number): string {
  if (odd <= 1.5) return 'resultado muito esperado — tipo time favorito em casa'
  if (odd <= 1.7) return 'favorito claro — comum em jogos desequilibrados'
  if (odd <= 1.9) return 'leve favorito — a odd mais apostada no Brasil'
  if (odd <= 2.0) return 'equilíbrio teórico — tipo cara ou coroa'
  if (odd <= 2.5) return 'resultado menos esperado — risco maior, retorno maior'
  return 'zebra ou partida muito equilibrada — alto risco'
}

function getProfitComment(pct: number, odd: number): string {
  if (odd >= 2.0) return 'Numa odd igual ou maior que 2.0 em eventos equilibrados, o valor esperado é neutro ou positivo — mas na prática as bets não oferecem esse preço num mercado verdadeiramente 50/50.'
  if (pct < 5) return 'Após 1.000 apostas, a chance de estar no lucro é menor que 5%. A matemática não mente — quanto mais você aposta, mais certo é o prejuízo.'
  if (pct < 20) return 'Os números são implacáveis. Cada aposta é matematicamente desfavorável — o tempo é inimigo do apostador.'
  return 'A margem da casa é menor nessa odd, mas presente. No longo prazo, a perda é certa.'
}

function getDramaticAnalogy(profit1000: number): { headline: string; body: string } {
  if (profit1000 < 1) {
    return {
      headline: 'Praticamente impossível no longo prazo.',
      body: 'Menos de 1% de chance de lucro após 1.000 apostas. Se 200 pessoas fizessem exatamente a mesma sequência nessa odd, provavelmente nenhuma terminaria no positivo. Não é azar — é design matemático. A casa não precisa trapacear. Basta existir.',
    }
  }
  if (profit1000 < 5) {
    const n = Math.max(1, Math.round(profit1000))
    return {
      headline: `${n} em 100 saem no lucro.`,
      body: `Imagine 100 pessoas numa sala, todas fazendo a mesma sequência de 1.000 apostas nessa odd. Apenas ${n} delas termina no positivo. As outras ${100 - n} saem no vermelho — e todas, durante a sequência, tiveram momentos em que estavam na frente. Todas acharam que seriam a exceção. A maioria não foi.`,
    }
  }
  if (profit1000 < 15) {
    const n = Math.max(1, Math.round(profit1000 / 10))
    return {
      headline: `${n} em 10 saem no lucro.`,
      body: `Em cada 10 pessoas que apostam 1.000 vezes nessa odd, apenas ${n} termina no positivo. As outras ${10 - n} perdem. O vencedor não era mais inteligente ou disciplinado — teve mais sorte num jogo matematicamente desfavorável. Na próxima sequência de 1.000, essa sorte não se repete necessariamente.`,
    }
  }
  if (profit1000 < 35) {
    return {
      headline: 'Menos de 1 em 3 sai no lucro.',
      body: 'A odd mais alta reduz a margem da casa. Mesmo assim, após 1.000 apostas, mais de 2 em cada 3 apostadores terminam no vermelho. A sensação de "quase lá" é parte do design das plataformas — e parte do problema.',
    }
  }
  return {
    headline: 'Margem menor, mas sempre presente.',
    body: 'Essa odd tem uma das menores margens da casa. No curto prazo, a variância permite lucros reais. No longo prazo, para cada R$100 apostados coletivamente, a casa embolsa sua parte garantida. Sempre. A diferença entre essa odd e as menores é quanto tempo leva para a matemática vencer.',
  }
}

// Tooltip com ⓘ — funciona no hover (desktop) e no toque (mobile)
function InfoTip({ text }: { text: string }) {
  const [open, setOpen] = useState(false)
  return (
    <span className="relative inline-block align-middle ml-1.5">
      <button
        type="button"
        className="w-4 h-4 rounded-full border border-stone-300 text-[9px] text-stone-400 flex items-center justify-center hover:border-stone-500 hover:text-stone-600 transition-colors focus:outline-none"
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
        onClick={(e) => { e.stopPropagation(); setOpen(v => !v) }}
        aria-label="Mais informações"
      >
        i
      </button>
      {open && (
        <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 w-72 p-3 bg-stone-800 text-white text-xs rounded-xl z-50 leading-relaxed shadow-xl">
          {text}
          <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-stone-800" />
        </div>
      )}
    </span>
  )
}

interface OddsShareCardProps {
  odd: number
  betAmount: number
  houseEdge: number
  ev: number
  profit1000: number
}

function OddsShareCard({ odd, betAmount, houseEdge, ev, profit1000 }: OddsShareCardProps) {
  const lossPerBet = Math.abs(Math.min(ev, 0))
  return (
    <div
      id="odds-share-card"
      style={{
        backgroundColor: '#EEF2F9',
        width: 600,
        fontFamily: 'Georgia, "Times New Roman", serif',
        borderRadius: 20,
        overflow: 'hidden',
      }}
    >
      {/* Header bar */}
      <div
        style={{
          backgroundColor: '#172030',
          padding: '14px 24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: '#00C4BE' }} />
          <span style={{ color: '#00C4BE', fontSize: 11, fontWeight: 700, letterSpacing: 3, fontFamily: 'Georgia, serif' }}>
            A PONTA DO LÁPIS
          </span>
        </div>
        <span style={{ color: '#00C4BE', opacity: 0.35, fontSize: 9, letterSpacing: 1, fontFamily: 'sans-serif' }}>
          apontadolapis.com.br
        </span>
      </div>

      {/* Main content */}
      <div style={{ padding: '28px 28px 0' }}>
        <div style={{ color: '#8B8F9A', fontSize: 10, textTransform: 'uppercase', letterSpacing: 2, marginBottom: 10, fontFamily: 'sans-serif', fontWeight: 600 }}>
          calculei a matemática das apostas — odd {odd.toFixed(1)}
        </div>

        <div style={{ color: '#ef4444', fontSize: 54, fontWeight: 700, letterSpacing: -2, lineHeight: 1, marginBottom: 8 }}>
          {ev < 0 ? `−${formatBRL(lossPerBet)}` : `±${formatBRL(0)}`}
        </div>
        <div style={{ color: '#6B7280', fontSize: 13, marginBottom: 24, fontFamily: 'sans-serif' }}>
          de perda esperada por aposta de {formatBRL(betAmount)}
        </div>

        <div style={{ height: 1, backgroundColor: '#D6E1EF', marginBottom: 20 }} />

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 24 }}>
          {[
            { label: 'ODD ANALISADA', value: odd.toFixed(1) },
            { label: 'MARGEM DA CASA', value: formatPct(houseEdge) },
            { label: 'RETORNO POR APOSTA', value: formatPct(100 - houseEdge) },
            { label: 'CHANCE DE LUCRO (1000 apostas)', value: formatPct(profit1000) },
          ].map((m, i) => (
            <div key={i} style={{ backgroundColor: '#fff', borderRadius: 12, padding: '14px 16px', borderLeft: '3px solid #ef4444' }}>
              <div style={{ color: '#9CA3AF', fontSize: 9, textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: 5, fontFamily: 'sans-serif', fontWeight: 600 }}>
                {m.label}
              </div>
              <div style={{ color: '#172030', fontSize: 18, fontWeight: 700, letterSpacing: -0.5 }}>
                {m.value}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer bar */}
      <div style={{ backgroundColor: '#172030', padding: '12px 28px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ color: '#6B7A8D', fontSize: 11, fontStyle: 'italic', fontFamily: 'Georgia, serif' }}>
          a casa sempre tem vantagem matemática.
        </span>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <div style={{ width: 4, height: 4, borderRadius: '50%', backgroundColor: '#00C4BE', opacity: 0.6 }} />
          <span style={{ color: '#00C4BE', opacity: 0.4, fontSize: 9, letterSpacing: 1, fontFamily: 'sans-serif' }}>
            CALCULADO COM DADOS REAIS
          </span>
        </div>
      </div>
    </div>
  )
}

export function OddsCalculator() {
  const [odd, setOdd] = useState(1.9)
  const [betAmount, setBetAmount] = useState(50)
  const [oddPanelOpen, setOddPanelOpen] = useState(false)

  const houseEdge = calcHouseEdge(odd)
  const ev = expectedValuePerBet(odd, betAmount)
  const profit1000 = probProfit(odd, 1000)
  const lossPerBet = Math.abs(Math.min(ev, 0))
  const analogy = getDramaticAnalogy(profit1000)

  return (
    <div className="space-y-4">
      <CalculatorCard title="Probabilidades Reais" subtitle="A casa não é burra. Veja os números.">

        <SliderField
          id="bet-amount"
          label="Valor por aposta"
          value={betAmount}
          min={10}
          max={500}
          step={10}
          onChange={setBetAmount}
        />

        {/* Odd selector */}
        <div
          className="rounded-xl border border-stone-100 overflow-hidden"
          onMouseEnter={() => setOddPanelOpen(true)}
          onMouseLeave={() => setOddPanelOpen(false)}
        >
          <button
            type="button"
            onClick={() => setOddPanelOpen((v) => !v)}
            className="w-full flex items-center justify-between gap-3 px-4 py-3 text-left hover:bg-stone-50 transition-colors group"
            aria-expanded={oddPanelOpen}
          >
            <span className="text-sm text-stone-500 leading-snug">
              Calculando para odd{' '}
              <strong className="text-stone-800 font-semibold">{odd.toFixed(1)}</strong>
              {' '}—{' '}
              <span className="text-stone-400">{oddToHumanContext(odd)}</span>
            </span>
            <ChevronDown
              size={14}
              className={`text-stone-400 flex-shrink-0 transition-transform duration-200 ${oddPanelOpen ? 'rotate-180' : ''}`}
            />
          </button>

          <div
            className={`transition-all duration-300 ease-in-out ${
              oddPanelOpen ? 'max-h-[420px] opacity-100' : 'max-h-0 opacity-0'
            } overflow-hidden`}
          >
            <div className="px-4 pb-4 pt-1 space-y-4 border-t border-stone-100 bg-stone-50/60">
              <div className="space-y-2">
                <p className="text-xs font-semibold text-stone-500 uppercase tracking-wide">O que é uma odd?</p>
                <p className="text-sm text-stone-600 leading-relaxed">
                  A odd é o multiplicador que a casa paga se você acertar.
                  Com odd <strong>{odd.toFixed(1)}</strong>, cada{' '}
                  <strong>{formatBRL(betAmount)}</strong> apostado vira{' '}
                  <strong>{formatBRL(betAmount * odd)}</strong> em caso de vitória
                  — mas a sua chance real é sempre menor do que{' '}
                  <strong>{formatPct((1 / odd) * 100)}</strong>.
                </p>
                <p className="text-sm text-stone-500 leading-relaxed">
                  A casa embute uma margem: a soma das probabilidades implícitas de todos os resultados
                  ultrapassa 100%. Essa diferença é o lucro garantido da casa.{' '}
                  <a
                    href="https://pt.wikipedia.org/wiki/Valor_esperado"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-brand-teal underline underline-offset-2 hover:text-brand-green transition-colors"
                  >
                    Entender Valor Esperado
                  </a>
                </p>
              </div>
              <div className="space-y-2">
                <p className="text-xs font-semibold text-stone-500 uppercase tracking-wide">Ajustar a odd</p>
                <div className="grid grid-cols-3 gap-2">
                  {ODD_OPTIONS.map((o) => (
                    <button
                      key={o}
                      onClick={() => setOdd(o)}
                      className={`py-2 rounded-lg text-sm font-semibold border transition-all ${
                        odd === o
                          ? 'bg-brand-green text-white border-brand-green shadow-sm'
                          : 'bg-white text-stone-600 border-stone-200 hover:border-brand-teal hover:text-brand-teal'
                      }`}
                    >
                      {o.toFixed(1)}
                    </button>
                  ))}
                </div>
                <div className="flex justify-between text-[10px] text-stone-400 pt-1 px-0.5">
                  <span>← favorito claro<br />menor retorno</span>
                  <span className="text-right">maior incerteza →<br />maior retorno</span>
                </div>
              </div>
            </div>
          </div>
        </div>

      </CalculatorCard>

      {/* Results */}
      <div role="region" aria-live="polite" aria-label="Resultado do cálculo" className="space-y-4">

        {/* Hero loss card */}
        <div className="bg-white rounded-2xl border border-stone-100 p-5">
          <p className="text-xs text-stone-400 uppercase tracking-wide mb-2">O que acontece com cada aposta</p>
          {ev < 0 ? (
            <>
              <div className="flex items-baseline gap-2 flex-wrap">
                <span className="text-3xl font-bold text-red-500 tabular-nums">−{formatBRL(lossPerBet)}</span>
                <span className="text-sm text-stone-500 flex items-center flex-wrap">
                  de perda esperada por aposta
                  <InfoTip text={`Valor Esperado (VE): a perda média por aposta, calculada matematicamente. Assumindo 50% de chance de acerto, com odd ${odd.toFixed(1)}, cada R$${betAmount} apostado resulta em VE negativo de R$${lossPerBet.toFixed(2)}. Não significa que você perde exatamente isso — significa que essa é a média após muitas apostas. A lei dos grandes números garante que o resultado real se aproxima desse valor.`} />
                </span>
              </div>
              <p className="text-xs text-stone-400 mt-2">
                A casa retém{' '}
                <strong className="text-stone-500">{formatPct(houseEdge)}</strong>
                <InfoTip text={`Margem da casa (house edge): para cada R$100 apostados coletivamente, R$${houseEdge.toFixed(1)} ficam com a plataforma — garantidos matematicamente. Calculada como 1 − (1 ÷ odd) × 100. Numa odd ${odd.toFixed(1)}: 1 − (1 ÷ ${odd.toFixed(1)}) = ${houseEdge.toFixed(2)}%. Esse percentual não varia com sorte ou habilidade.`} />
                {' '}em média.
                Você recebe de volta{' '}
                <strong className="text-stone-500">{formatPct(100 - houseEdge)}</strong>
                <InfoTip text={`RTP (Return to Player): ${(100 - houseEdge).toFixed(2)}% do total apostado retorna em premiações. Parece alto? Numa sessão com R$5.000 apostados, são R$${Math.round((houseEdge / 100) * 5000)} que ficam com a casa — independente de você ganhar ou perder individualmente.`} />
                {' '}do que aposta ao longo do tempo.
              </p>
            </>
          ) : (
            <>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold text-amber-500 tabular-nums">±{formatBRL(0)}</span>
                <span className="text-sm text-stone-500">valor esperado neutro nessa odd</span>
              </div>
              <p className="text-xs text-stone-400 mt-2">
                Odd ≥ 2.0 em evento 50/50 significa que a casa não está cobrando margem — situação
                teórica. Em mercados reais, essa odd não existe sem uma desvantagem embutida.
              </p>
            </>
          )}
        </div>

        <SectionDivider label="Chance de estar no lucro após N apostas" />

        <div className="bg-white rounded-2xl border border-stone-100 p-5 space-y-3">
          <p className="text-xs text-stone-400 mb-1">
            Quanto mais apostas, mais a matemática se impõe — a variância diminui e a perda esperada domina.
          </p>
          {N_VALUES.map((n) => {
            const pct = probProfit(odd, n)
            const tipText = n <= 50
              ? `Com apenas ${n} apostas, a sorte tem grande influência — o resultado pode ser positivo ou negativo por acaso puro. Matematicamente, é cedo para a lei dos grandes números agir. Mas a desvantagem já existe em cada rodada.`
              : `Com ${n.toLocaleString('pt-BR')} apostas, a lei dos grandes números domina. A variância diminui drasticamente e a perda esperada acumulada é quase certa. Probabilidade de ${formatPct(pct)} de terminar no positivo — restando ${formatPct(100 - pct)} de chance de estar no vermelho.`
            return (
              <div key={n} className="flex items-center justify-between gap-3">
                <span className="text-sm text-stone-500 w-36 flex-shrink-0">Após {n.toLocaleString('pt-BR')} apostas</span>
                <div className="flex-1 bg-stone-100 rounded-full h-2">
                  <div
                    className="h-2 rounded-full transition-all duration-500"
                    style={{
                      width: `${Math.max(pct, 1)}%`,
                      backgroundColor: pct < 15 ? '#ef4444' : pct < 35 ? '#f59e0b' : '#22c55e',
                    }}
                  />
                </div>
                <div className="flex items-center gap-0.5 flex-shrink-0 w-16 justify-end">
                  <span
                    className={`text-sm font-bold tabular-nums ${
                      pct < 15 ? 'text-red-500' : pct < 35 ? 'text-amber-500' : 'text-emerald-600'
                    }`}
                  >
                    {formatPct(pct)}
                  </span>
                  <InfoTip text={tipText} />
                </div>
              </div>
            )
          })}
        </div>

        {/* Dramatic analogy */}
        <div className="bg-stone-800 rounded-2xl p-5 space-y-2">
          <p className="text-[10px] text-stone-500 uppercase tracking-widest font-semibold">Na prática</p>
          <p className="text-base font-bold text-white leading-snug">{analogy.headline}</p>
          <p className="text-stone-300 text-sm leading-relaxed">{analogy.body}</p>
          <p className="text-stone-500 text-xs italic pt-1 border-t border-stone-700 mt-1">{getProfitComment(profit1000, odd)}</p>
        </div>

        <div className="bg-stone-50 border border-stone-100 rounded-xl px-4 py-3 space-y-1">
          <p className="text-xs font-semibold text-stone-500">Sobre o modelo</p>
          <p className="text-xs text-stone-400 leading-relaxed">
            Este cálculo trata cada evento como 50% de probabilidade de acerto (cara ou coroa).
            Isso é uma simplificação didática: na prática, favoritos têm chances maiores e zebras têm chances menores.
            O ponto central continua válido — odds abaixo de 2.0 em eventos equilibrados são matematicamente desfavoráveis ao apostador.
          </p>
        </div>

        {/* Help links */}
        <div className="bg-red-50 border border-red-100 rounded-2xl p-4 space-y-3">
          <div>
            <p className="text-xs font-bold text-red-700 uppercase tracking-wide">Precisa de ajuda?</p>
            <p className="text-xs text-red-600 mt-1 leading-relaxed">
              O vício em apostas (ludomania) é reconhecido como transtorno pelo CID-11. Se você ou alguém próximo sente dificuldade em parar, há apoio gratuito e sigiloso.
            </p>
          </div>
          <div className="space-y-2">
            <a
              href="https://ja.org.br"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between bg-white rounded-xl px-3 py-2.5 border border-red-100 hover:border-red-300 transition-colors group"
            >
              <div>
                <p className="text-xs font-semibold text-stone-700">Jogadores Anônimos Brasil</p>
                <p className="text-[10px] text-stone-400">ja.org.br — grupos de apoio presenciais e online, gratuitos</p>
              </div>
              <span className="text-stone-300 group-hover:text-red-400 transition-colors ml-3">→</span>
            </a>
            <a
              href="https://cvv.org.br"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between bg-white rounded-xl px-3 py-2.5 border border-red-100 hover:border-red-300 transition-colors group"
            >
              <div>
                <p className="text-xs font-semibold text-stone-700">CVV — Centro de Valorização da Vida</p>
                <p className="text-[10px] text-stone-400">cvv.org.br · Ligue 188 — 24h, gratuito, sigiloso</p>
              </div>
              <span className="text-stone-300 group-hover:text-red-400 transition-colors ml-3">→</span>
            </a>
            <div className="bg-white rounded-xl px-3 py-2.5 border border-red-100">
              <p className="text-xs font-semibold text-stone-700">CAPS AD — pelo SUS</p>
              <p className="text-[10px] text-stone-400">Ligue 136 (DISQUE SAÚDE) para encontrar o CAPS AD mais próximo. Gratuito e sigiloso.</p>
            </div>
          </div>
        </div>

        {/* Share */}
        <div className="bg-stone-50 rounded-2xl p-4">
          <p className="text-xs text-stone-400 mb-3 text-center">Compartilhe o resultado</p>
          <ScaledPreview>
            <OddsShareCard
              odd={odd}
              betAmount={betAmount}
              houseEdge={houseEdge}
              ev={ev}
              profit1000={profit1000}
            />
          </ScaledPreview>
          <div className="mt-3">
            <ShareButtons cardId="odds-share-card" filename="odds" />
          </div>
        </div>
      </div>
    </div>
  )
}
