'use client'

import React, { useState } from 'react'
import { formatBRLDecimal } from '@/lib/formatters'

export function SplitBillCalculator() {
  const [total, setTotal] = useState('')
  const [tip, setTip] = useState(0)
  const [names, setNames] = useState<string[]>(['', ''])
  const [newName, setNewName] = useState('')
  const [copied, setCopied] = useState(false)

  const totalNum = parseFloat(total.replace(',', '.')) || 0
  const totalWithTip = totalNum * (1 + tip / 100)
  const perPerson = names.length > 0 ? totalWithTip / names.length : 0

  function addPerson() {
    const name = newName.trim() || `Pessoa ${names.length + 1}`
    setNames((prev) => [...prev, name])
    setNewName('')
  }

  function removePerson(index: number) {
    if (names.length <= 2) return
    setNames((prev) => prev.filter((_, i) => i !== index))
  }

  function updateName(index: number, value: string) {
    setNames((prev) => prev.map((n, i) => (i === index ? value : n)))
  }

  function copyMarkdown() {
    const displayNames = names.map((n, i) => n.trim() || `Pessoa ${i + 1}`)
    const lines = [
      '**Divisão de conta — Na Ponta do Lápis**',
      '',
      `Total: ${formatBRLDecimal(totalNum)}`,
      ...(tip > 0 ? [`Gorjeta (${tip}%): ${formatBRLDecimal(totalWithTip - totalNum)}`, `Total com gorjeta: ${formatBRLDecimal(totalWithTip)}`] : []),
      `Por pessoa: ${formatBRLDecimal(perPerson)}`,
      '',
      '| Quem | Valor |',
      '|------|-------|',
      ...displayNames.map((name) => `| ${name} | ${formatBRLDecimal(perPerson)} |`),
      '',
      '_napontadolapis.com.br_',
    ]
    navigator.clipboard.writeText(lines.join('\n')).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  const tipOptions = [0, 5, 10, 15]

  return (
    <div className="space-y-4">
      <div className="bg-brand-surface rounded-2xl border border-brand-border p-6 space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-brand-ink font-serif">Dividir a Conta</h1>
          <p className="text-sm italic text-brand-muted mt-1">Sem discussão. Só a matemática.</p>
        </div>

        {/* Total */}
        <div className="space-y-2">
          <label htmlFor="bill-total" className="text-sm font-medium text-brand-muted">
            Valor total da conta
          </label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-muted font-medium">R$</span>
            <input
              id="bill-total"
              type="number"
              inputMode="decimal"
              min={0}
              placeholder="0,00"
              value={total}
              onChange={(e) => setTotal(e.target.value)}
              className="w-full border border-brand-border rounded-xl pl-10 pr-4 py-3 text-brand-ink bg-white focus:outline-none focus:ring-2 focus:ring-brand-teal text-lg font-semibold tabular-nums"
            />
          </div>
        </div>

        {/* Tip */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-brand-muted">Gorjeta</label>
          <div className="grid grid-cols-4 gap-2">
            {tipOptions.map((t) => (
              <button
                key={t}
                onClick={() => setTip(t)}
                className="py-2 rounded-xl text-sm font-semibold border transition-colors"
                style={
                  tip === t
                    ? { background: 'linear-gradient(135deg, #1A5E40, #00C4BE)', color: '#fff', borderColor: 'transparent' }
                    : { background: '#fff', color: '#4D6070', borderColor: '#D6E1EF' }
                }
              >
                {t === 0 ? 'Sem' : `${t}%`}
              </button>
            ))}
          </div>
        </div>

        {/* People */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-brand-muted">
            Quem vai pagar?{' '}
            <span className="font-normal">({names.length} pessoa{names.length !== 1 ? 's' : ''})</span>
          </label>

          <div className="flex flex-wrap gap-2">
            {names.map((name, i) => (
              <div
                key={i}
                className="flex items-center gap-1.5 rounded-full pl-3 pr-1 py-1 border"
                style={{ background: '#EEF2F9', borderColor: '#D6E1EF' }}
              >
                <input
                  type="text"
                  value={name}
                  onChange={(e) => updateName(i, e.target.value)}
                  placeholder={`Pessoa ${i + 1}`}
                  className="bg-transparent text-sm text-brand-ink outline-none w-20 min-w-0"
                />
                {names.length > 2 && (
                  <button
                    onClick={() => removePerson(i)}
                    className="text-brand-muted hover:text-red-400 transition-colors w-5 h-5 flex items-center justify-center rounded-full text-xs"
                  >
                    ×
                  </button>
                )}
              </div>
            ))}
          </div>

          <div className="flex gap-2">
            <input
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && addPerson()}
              placeholder="Nome de quem entra"
              className="flex-1 border border-brand-border rounded-xl px-4 py-2.5 text-sm text-brand-ink focus:outline-none focus:ring-2 focus:ring-brand-teal"
            />
            <button
              onClick={addPerson}
              className="px-4 py-2.5 rounded-xl text-sm font-semibold border border-brand-border text-brand-muted hover:text-brand-teal hover:border-brand-teal transition-colors"
            >
              + Adicionar
            </button>
          </div>
        </div>
      </div>

      {/* Result */}
      {totalNum > 0 && names.length > 0 && (
        <div role="region" aria-live="polite" aria-label="Resultado da divisão" className="space-y-4">
          <div
            className="text-center py-8 px-4 rounded-2xl border"
            style={{ background: '#EEF2F9', borderColor: '#D6E1EF' }}
          >
            <p className="text-xs font-medium text-brand-muted uppercase tracking-wider mb-2">
              cada um paga
            </p>
            <p
              className="text-5xl font-bold tabular-nums font-serif"
              style={{ letterSpacing: '-0.04em', color: '#1A5E40' }}
            >
              {formatBRLDecimal(perPerson)}
            </p>
            {tip > 0 && (
              <p className="text-xs italic text-brand-muted mt-2">
                gorjeta de {tip}% incluída · total: {formatBRLDecimal(totalWithTip)}
              </p>
            )}
          </div>

          {names.some((n) => n.trim()) && (
            <div className="bg-brand-surface rounded-2xl border border-brand-border p-5 space-y-3">
              <p className="text-sm font-medium text-brand-muted">Divisão individual</p>
              {names.map((name, i) => (
                <div key={i} className="flex justify-between items-center">
                  <span className="text-sm text-brand-ink">{name.trim() || `Pessoa ${i + 1}`}</span>
                  <span className="font-bold text-brand-ink tabular-nums">{formatBRLDecimal(perPerson)}</span>
                </div>
              ))}
            </div>
          )}

          {/* Export */}
          <button
            onClick={copyMarkdown}
            className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-stone-100 hover:bg-stone-200 text-stone-700 font-semibold rounded-xl transition-colors text-sm"
          >
            {copied ? '✓ Copiado!' : '⎘ Copiar tabela (Markdown)'}
          </button>

          <div
            className="rounded-2xl p-5 border space-y-2"
            style={{ background: 'linear-gradient(145deg, #0D1A2A, #122030)', borderColor: '#1E3040' }}
          >
            <p className="text-white/70 text-sm font-medium">Quer dividir por item?</p>
            <p className="text-white/40 text-sm leading-relaxed">
              O app Na Ponta do Lápis usa IA para extrair os itens direto da foto do cardápio
              e calcular o que cada pessoa deve exatamente. Em desenvolvimento para Android.
            </p>
            <p className="text-white/20 text-xs italic">sem data prometida — só quando estiver bom.</p>
          </div>
        </div>
      )}
    </div>
  )
}
