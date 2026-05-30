'use client'

import React from 'react'
import { formatBRL, formatPct } from '@/lib/formatters'

interface BetsLuckyProps {
  finalBalance: number
  totalInvested: number
  onReveal: () => void
  onRestart: () => void
}

export function BetsLucky({ finalBalance, totalInvested, onReveal, onRestart }: BetsLuckyProps) {
  const profit    = finalBalance - totalInvested
  const profitPct = totalInvested > 0 ? (profit / totalInvested) * 100 : 0

  return (
    <div className="rounded-2xl sm:rounded-[32px] overflow-hidden border" style={{ borderColor: 'var(--c-line)' }}>

      {/* Header — verde, celebra o ganho */}
      <div className="p-5 sm:p-8 space-y-1" style={{ background: '#f0fdf4', borderBottom: '1px solid #bbf7d0' }}>
        <div className="text-[9px] font-extrabold uppercase tracking-[3px] text-emerald-600">Sessão finalizada</div>
        <h2 className="text-2xl sm:text-3xl font-black text-emerald-700 leading-tight" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
          Você ganhou<br/>nesta sessão.
        </h2>
        <div className="text-lg font-bold text-emerald-600">
          +{formatBRL(profit)} de lucro ({formatPct(profitPct)})
        </div>
        <div className="text-xs text-emerald-600/70">
          Investiu {formatBRL(totalInvested)} → Saiu com {formatBRL(finalBalance)}
        </div>
      </div>

      <div className="p-5 sm:p-8 space-y-5" style={{ background: '#f8f7f5' }}>

        {/* Barra de percentil visual */}
        <div className="space-y-2.5">
          <h3 className="text-base font-black text-stone-800">
            Você está entre os poucos que ganham.
          </h3>
          {/* Barra proporcional */}
          <div className="h-10 rounded-xl overflow-hidden flex" style={{ border: '1px solid #e5e7eb' }}>
            <div
              className="h-full flex items-center justify-center"
              style={{ width: '88%', background: '#fca5a5' }}
            >
              <span className="text-[10px] font-extrabold text-red-800">88% perdem</span>
            </div>
            <div
              className="h-full flex items-center justify-center relative"
              style={{ width: '12%', background: '#4ade80' }}
            >
              <span className="text-[9px] font-extrabold text-emerald-900 leading-tight text-center px-0.5">12%<br/>↑</span>
              {/* Badge "você" */}
              <div
                className="absolute -top-1 right-1 text-[8px] font-black bg-emerald-600 text-white rounded px-1 py-0.5 whitespace-nowrap"
                style={{ animation: 'fade-up 0.4s 0.3s both' }}
              >
                você
              </div>
            </div>
          </div>
          <p className="text-xs text-stone-500 leading-relaxed">
            Em qualquer sessão de apostas, apenas <strong className="text-stone-700">12% dos jogadores</strong> terminam no azul.
            Você foi um deles hoje.
          </p>
        </div>

        {/* O twist educativo — a pergunta real */}
        <div className="rounded-2xl border p-5 space-y-3" style={{ background: 'white', borderColor: '#e5e7eb' }}>
          <div className="text-sm font-black text-stone-700 uppercase tracking-wider">
            Mas a pergunta que decide tudo é:
          </div>
          <div className="text-2xl font-black text-stone-900 leading-tight" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
            "Quando você vai parar?"
          </div>
          <p className="text-sm text-stone-500 leading-relaxed">
            A pesquisa é consistente: a maioria dos apostadores que ganham numa sessão{' '}
            <strong className="text-stone-700">voltam a jogar</strong> — afinal, ganharam.
            Por que parar?
          </p>
          <p className="text-sm text-stone-500 leading-relaxed">
            Mas a casa conhece esse comportamento. A cada nova sessão, a vantagem matemática se acumula.{' '}
            <strong className="text-stone-700">9 em cada 10 apostadores que começam ganhando terminam no vermelho</strong>{' '}
            depois de múltiplas sessões.
          </p>
          <div
            className="rounded-xl p-3 text-xs leading-relaxed font-semibold"
            style={{ background: '#fef3c7', color: '#92400e', border: '1px solid #fde68a' }}
          >
            💡 Você foi sortudo hoje. A casa sabe disso. E está esperando a próxima sessão.
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-2.5">
          {[
            { val: '85–92%', label: 'perdem a longo prazo', bg: '#fef2f2', bc: '#fecaca', vc: '#dc2626', lc: '#ef4444' },
            { val: '9 em 10', label: 'ganhadores voltam e perdem', bg: '#fff7ed', bc: '#fed7aa', vc: '#d97706', lc: '#f59e0b' },
          ].map(s => (
            <div key={s.val} className="rounded-xl p-3 text-center border" style={{ background: s.bg, borderColor: s.bc }}>
              <div className="text-xl font-black" style={{ color: s.vc }}>{s.val}</div>
              <div className="text-[9px] font-bold mt-0.5" style={{ color: s.lc }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* CTAs */}
        <div className="space-y-2 pt-1">
          <button
            onClick={onReveal}
            className="w-full py-3 rounded-2xl font-black text-sm uppercase tracking-wider cursor-pointer transition-all active:scale-95 hover:opacity-90"
            style={{ background: '#111827', color: 'white' }}
          >
            Ver a matemática completa →
          </button>
          <button
            onClick={onRestart}
            className="w-full py-2.5 rounded-2xl font-bold text-sm cursor-pointer transition-all hover:opacity-80"
            style={{ background: 'transparent', color: '#9ca3af', border: '1px solid #e5e7eb' }}
          >
            ↺ Jogar novamente
          </button>
        </div>

      </div>
    </div>
  )
}
