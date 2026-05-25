'use client'

import React, { useState, useMemo } from 'react'
import { formatBRLDecimal } from '@/lib/formatters'

interface Person {
  id: number
  name: string
}

interface BillItem {
  id: number
  description: string
  price: number
  payers: number[] // person IDs; empty = all people
}

function displayName(person: Person, index: number) {
  return person.name.trim() || `Pessoa ${index + 1}`
}

const INITIAL_IDS = [1, 2]

export function SplitBillCalculator() {
  const [mode, setMode] = useState<'itemized' | 'equal'>('itemized')
  const [people, setPeople] = useState<Person[]>([
    { id: INITIAL_IDS[0], name: '' },
    { id: INITIAL_IDS[1], name: '' },
  ])
  const [items, setItems] = useState<BillItem[]>([])
  const [tip, setTip] = useState(0)
  const [newName, setNewName] = useState('')
  const [newDesc, setNewDesc] = useState('')
  const [newPrice, setNewPrice] = useState('')
  const [newPayers, setNewPayers] = useState<number[]>(INITIAL_IDS)
  const [equalTotal, setEqualTotal] = useState('')
  const [copied, setCopied] = useState(false)

  // ── Derived ─────────────────────────────────────────────────────

  const allIds = people.map((p) => p.id)

  function resolvePayers(item: BillItem): number[] {
    return item.payers.length === 0
      ? allIds
      : item.payers.filter((id) => allIds.includes(id))
  }

  // All per-person calculations in one pass
  const calc = useMemo(() => {
    const ids = people.map((p) => p.id)
    const subs: Record<number, number> = {}
    for (const p of people) subs[p.id] = 0

    for (const item of items) {
      const payers = item.payers.length === 0 ? ids : item.payers.filter((id) => ids.includes(id))
      if (payers.length === 0) continue
      const share = item.price / payers.length
      for (const pid of payers) {
        if (subs[pid] !== undefined) subs[pid] += share
      }
    }

    const subtotal = Object.values(subs).reduce((a, b) => a + b, 0)
    const tipAmt = subtotal * (tip / 100)

    const breakdown = people.map((person, i) => {
      const sub = subs[person.id] ?? 0
      const personTip = subtotal > 0 ? (sub / subtotal) * tipAmt : 0
      return { person, index: i, sub, tip: personTip, total: sub + personTip }
    })

    return { subtotal, tipAmt, breakdown }
  }, [people, items, tip])

  // Equal mode
  const equalNum = parseFloat(equalTotal.replace(',', '.')) || 0
  const equalWithTip = equalNum * (1 + tip / 100)
  const perPersonEqual = people.length > 0 ? equalWithTip / people.length : 0

  const hasResults = mode === 'itemized' ? items.length > 0 : equalNum > 0

  // ── Actions ─────────────────────────────────────────────────────

  function addPerson() {
    const id = Date.now()
    setPeople((prev) => [...prev, { id, name: newName.trim() }])
    setNewPayers((prev) => [...prev, id])
    setNewName('')
  }

  function removePerson(id: number) {
    if (people.length <= 2) return
    setPeople((prev) => prev.filter((p) => p.id !== id))
    setItems((prev) =>
      prev.map((item) => ({ ...item, payers: item.payers.filter((pid) => pid !== id) }))
    )
    setNewPayers((prev) => prev.filter((pid) => pid !== id))
  }

  function updateName(id: number, name: string) {
    setPeople((prev) => prev.map((p) => (p.id === id ? { ...p, name } : p)))
  }

  function addItem() {
    const desc = newDesc.trim()
    const price = parseFloat(newPrice.replace(',', '.'))
    if (!desc || isNaN(price) || price <= 0 || newPayers.length === 0) return
    const payers = newPayers.length === people.length ? [] : newPayers
    setItems((prev) => [...prev, { id: Date.now(), description: desc, price, payers }])
    setNewDesc('')
    setNewPrice('')
    setNewPayers(people.map((p) => p.id))
  }

  function removeItem(id: number) {
    setItems((prev) => prev.filter((item) => item.id !== id))
  }

  function toggleItemPayer(itemId: number, personId: number) {
    setItems((prev) =>
      prev.map((item) => {
        if (item.id !== itemId) return item
        const ids = people.map((p) => p.id)
        const current = item.payers.length === 0 ? ids : item.payers.filter((id) => ids.includes(id))
        const next = current.includes(personId)
          ? current.filter((id) => id !== personId)
          : [...current, personId]
        return { ...item, payers: next.length === ids.length ? [] : next }
      })
    )
  }

  function toggleNewPayer(personId: number) {
    setNewPayers((prev) =>
      prev.includes(personId) ? prev.filter((id) => id !== personId) : [...prev, personId]
    )
  }

  function copyMarkdown() {
    const lines: string[] = ['**Divisão de conta — Na Ponta do Lápis**', '']
    if (mode === 'itemized') {
      lines.push('**Itens:**', '')
      for (const item of items) {
        const payers = resolvePayers(item)
        const names = payers.map((id) => {
          const idx = people.findIndex((p) => p.id === id)
          const p = people[idx]
          return p ? displayName(p, idx) : '?'
        })
        lines.push(`- ${item.description}: ${formatBRLDecimal(item.price)} (${names.join(', ')})`)
      }
      lines.push('', '**Por pessoa:**', '', '| Quem | Itens | Gorjeta | Total |', '|------|-------|---------|-------|')
      for (const { person, index, sub, tip: t, total } of calc.breakdown) {
        lines.push(`| ${displayName(person, index)} | ${formatBRLDecimal(sub)} | ${formatBRLDecimal(t)} | ${formatBRLDecimal(total)} |`)
      }
    } else {
      lines.push(`Total: ${formatBRLDecimal(equalNum)}`)
      if (tip > 0) {
        lines.push(`Gorjeta (${tip}%): ${formatBRLDecimal(equalWithTip - equalNum)}`, `Total com gorjeta: ${formatBRLDecimal(equalWithTip)}`)
      }
      lines.push(`Por pessoa: ${formatBRLDecimal(perPersonEqual)}`, '', '| Quem | Valor |', '|------|-------|')
      for (const [i, p] of people.entries()) {
        lines.push(`| ${displayName(p, i)} | ${formatBRLDecimal(perPersonEqual)} |`)
      }
    }
    lines.push('', '_napontadolapis.com.br_')
    navigator.clipboard.writeText(lines.join('\n')).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  // ── UI helpers ───────────────────────────────────────────────────

  function PersonChip({ personId, selected, onToggle }: { personId: number; selected: boolean; onToggle: () => void }) {
    const idx = people.findIndex((p) => p.id === personId)
    const person = people[idx]
    if (!person) return null
    const name = displayName(person, idx)
    return (
      <button
        type="button"
        onClick={onToggle}
        className="px-2.5 py-1 rounded-full text-xs font-semibold border transition-all"
        style={
          selected
            ? { background: 'linear-gradient(135deg, #1A5E40, #00C4BE)', color: '#fff', borderColor: 'transparent' }
            : { background: '#F9FAFB', color: '#9CA3AF', borderColor: '#E5E7EB' }
        }
      >
        {name}
      </button>
    )
  }

  return (
    <div className="space-y-4">
      {/* Config card */}
      <div className="bg-brand-surface rounded-2xl border border-brand-border p-6 space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-brand-ink font-serif">Dividir a Conta</h1>
          <p className="text-sm italic text-brand-muted mt-1">Sem discussão. Só a matemática.</p>
        </div>

        {/* Mode toggle */}
        <div className="grid grid-cols-2 gap-2">
          {[
            { key: 'itemized', label: 'Por item', sub: 'cada um paga o que pediu' },
            { key: 'equal', label: 'Igualmente', sub: 'divide o total entre todos' },
          ].map((opt) => (
            <button
              key={opt.key}
              onClick={() => setMode(opt.key as typeof mode)}
              className="py-3 px-3 rounded-xl border text-left transition-all"
              style={
                mode === opt.key
                  ? { background: 'linear-gradient(135deg, #1A5E40, #00C4BE)', borderColor: 'transparent' }
                  : { background: '#fff', borderColor: '#D6E1EF' }
              }
            >
              <p className={`text-sm font-semibold ${mode === opt.key ? 'text-white' : 'text-brand-ink'}`}>{opt.label}</p>
              <p className={`text-xs mt-0.5 ${mode === opt.key ? 'text-white/70' : 'text-brand-muted'}`}>{opt.sub}</p>
            </button>
          ))}
        </div>

        {/* People */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-brand-muted">
            Quem está na conta?{' '}
            <span className="font-normal">({people.length} pessoa{people.length !== 1 ? 's' : ''})</span>
          </label>
          <div className="flex flex-wrap gap-2">
            {people.map((person, i) => (
              <div
                key={person.id}
                className="flex items-center gap-1.5 rounded-full pl-3 pr-1 py-1 border"
                style={{ background: '#EEF2F9', borderColor: '#D6E1EF' }}
              >
                <input
                  type="text"
                  value={person.name}
                  onChange={(e) => updateName(person.id, e.target.value)}
                  placeholder={`Pessoa ${i + 1}`}
                  className="bg-transparent text-sm text-brand-ink outline-none w-20 min-w-0"
                />
                {people.length > 2 && (
                  <button
                    onClick={() => removePerson(person.id)}
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

        {/* Equal mode: total input */}
        {mode === 'equal' && (
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
                value={equalTotal}
                onChange={(e) => setEqualTotal(e.target.value)}
                className="w-full border border-brand-border rounded-xl pl-10 pr-4 py-3 text-brand-ink bg-white focus:outline-none focus:ring-2 focus:ring-brand-teal text-lg font-semibold tabular-nums"
              />
            </div>
          </div>
        )}

        {/* Tip */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-brand-muted">Gorjeta</label>
          <div className="grid grid-cols-4 gap-2">
            {[0, 5, 10, 15].map((t) => (
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
      </div>

      {/* Itemized: item list + add form */}
      {mode === 'itemized' && (
        <div className="bg-brand-surface rounded-2xl border border-brand-border overflow-hidden">
          {/* Item list */}
          {items.length > 0 && (
            <div className="divide-y divide-brand-border">
              {items.map((item) => {
                const payers = resolvePayers(item)
                return (
                  <div key={item.id} className="p-4 space-y-2.5">
                    {/* Row: description + price + remove */}
                    <div className="flex items-center gap-2">
                      <span className="flex-1 text-sm font-medium text-brand-ink min-w-0 truncate">
                        {item.description}
                      </span>
                      <span className="text-sm font-bold text-brand-ink tabular-nums shrink-0">
                        {formatBRLDecimal(item.price)}
                      </span>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="text-brand-muted hover:text-red-400 transition-colors ml-1 text-lg leading-none shrink-0"
                        aria-label="Remover item"
                      >
                        ×
                      </button>
                    </div>
                    {/* Person chips */}
                    <div className="flex flex-wrap gap-1.5">
                      {people.map((person) => (
                        <PersonChip
                          key={person.id}
                          personId={person.id}
                          selected={payers.includes(person.id)}
                          onToggle={() => toggleItemPayer(item.id, person.id)}
                        />
                      ))}
                    </div>
                    {payers.length > 1 && (
                      <p className="text-[10px] text-brand-muted">
                        {formatBRLDecimal(item.price / payers.length)} por pessoa
                      </p>
                    )}
                  </div>
                )
              })}
            </div>
          )}

          {/* Subtotal row */}
          {items.length > 0 && (
            <div className="flex items-center justify-between px-4 py-3 bg-stone-50/80 border-t border-brand-border">
              <span className="text-xs font-semibold text-brand-muted uppercase tracking-wide">Subtotal</span>
              <span className="text-sm font-bold text-brand-ink tabular-nums">{formatBRLDecimal(calc.subtotal)}</span>
            </div>
          )}

          {/* Add item form */}
          <div className="p-4 space-y-3 border-t border-dashed border-brand-border bg-brand-paper/30">
            <p className="text-xs font-semibold text-brand-muted uppercase tracking-wide">Adicionar item</p>
            <div className="flex gap-2">
              <input
                type="text"
                value={newDesc}
                onChange={(e) => setNewDesc(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && addItem()}
                placeholder="Ex: Pizza Margherita"
                className="flex-1 min-w-0 border border-brand-border rounded-lg px-3 py-2.5 text-sm text-brand-ink bg-white focus:outline-none focus:ring-2 focus:ring-brand-teal"
              />
              <div className="relative shrink-0 w-28">
                <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-brand-muted text-xs">R$</span>
                <input
                  type="number"
                  inputMode="decimal"
                  min={0}
                  value={newPrice}
                  onChange={(e) => setNewPrice(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && addItem()}
                  placeholder="0,00"
                  className="w-full border border-brand-border rounded-lg pl-7 pr-2 py-2.5 text-sm text-brand-ink bg-white focus:outline-none focus:ring-2 focus:ring-brand-teal tabular-nums"
                />
              </div>
            </div>

            {/* Who ordered this item */}
            <div className="space-y-1.5">
              <p className="text-[10px] font-semibold text-brand-muted uppercase tracking-wide">Quem pediu?</p>
              <div className="flex flex-wrap gap-1.5">
                {people.map((person) => (
                  <PersonChip
                    key={person.id}
                    personId={person.id}
                    selected={newPayers.includes(person.id)}
                    onToggle={() => toggleNewPayer(person.id)}
                  />
                ))}
              </div>
            </div>

            <button
              onClick={addItem}
              disabled={!newDesc.trim() || !newPrice || parseFloat(newPrice) <= 0 || newPayers.length === 0}
              className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-semibold transition-colors"
            >
              + Adicionar item
            </button>
          </div>
        </div>
      )}

      {/* Results */}
      {hasResults && (
        <div role="region" aria-live="polite" className="space-y-4">
          {mode === 'equal' ? (
            <>
              <div
                className="text-center py-8 px-4 rounded-2xl border"
                style={{ background: '#EEF2F9', borderColor: '#D6E1EF' }}
              >
                <p className="text-xs font-medium text-brand-muted uppercase tracking-wider mb-2">cada um paga</p>
                <p
                  className="text-5xl font-bold tabular-nums font-serif"
                  style={{ letterSpacing: '-0.04em', color: '#1A5E40' }}
                >
                  {formatBRLDecimal(perPersonEqual)}
                </p>
                {tip > 0 && (
                  <p className="text-xs italic text-brand-muted mt-2">
                    gorjeta de {tip}% incluída · total: {formatBRLDecimal(equalWithTip)}
                  </p>
                )}
              </div>

              <div className="bg-brand-surface rounded-2xl border border-brand-border p-5 space-y-3">
                <p className="text-sm font-medium text-brand-muted">Divisão individual</p>
                {people.map((person, i) => (
                  <div key={person.id} className="flex justify-between items-center">
                    <span className="text-sm text-brand-ink">{displayName(person, i)}</span>
                    <span className="font-bold text-brand-ink tabular-nums">{formatBRLDecimal(perPersonEqual)}</span>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="space-y-3">
              {calc.breakdown.map(({ person, index, sub, tip: t, total }) => (
                <div
                  key={person.id}
                  className="bg-brand-surface rounded-2xl border border-brand-border overflow-hidden"
                >
                  {/* Person header */}
                  <div className="flex items-center justify-between px-4 py-3 border-b border-brand-border">
                    <span className="text-sm font-semibold text-brand-ink">{displayName(person, index)}</span>
                    <span className="text-xl font-bold tabular-nums" style={{ color: '#1A5E40' }}>
                      {formatBRLDecimal(total)}
                    </span>
                  </div>

                  {/* Item breakdown */}
                  <div className="px-4 py-3 space-y-1.5 bg-white">
                    {items.map((item) => {
                      const payers = resolvePayers(item)
                      if (!payers.includes(person.id)) return null
                      const share = item.price / payers.length
                      return (
                        <div key={item.id} className="flex justify-between items-baseline gap-2 text-sm">
                          <span className="text-brand-muted min-w-0 truncate">
                            {item.description}
                            {payers.length > 1 && (
                              <span className="text-[10px] text-brand-muted/60 ml-1">÷{payers.length}</span>
                            )}
                          </span>
                          <span className="tabular-nums text-brand-muted shrink-0">{formatBRLDecimal(share)}</span>
                        </div>
                      )
                    })}
                    {tip > 0 && t > 0 && (
                      <div className="flex justify-between items-baseline gap-2 text-sm border-t border-brand-border pt-1.5 mt-1">
                        <span className="text-brand-muted">Gorjeta ({tip}%)</span>
                        <span className="tabular-nums text-brand-muted shrink-0">{formatBRLDecimal(t)}</span>
                      </div>
                    )}
                    {sub === 0 && (
                      <p className="text-xs text-brand-muted/60 italic">nenhum item atribuído</p>
                    )}
                  </div>
                </div>
              ))}

              {/* Grand total */}
              <div className="flex items-center justify-between px-4 py-3 rounded-xl bg-stone-50 border border-brand-border">
                <span className="text-sm font-semibold text-brand-muted">Total geral</span>
                <span className="text-sm font-bold text-brand-ink tabular-nums">
                  {formatBRLDecimal(calc.subtotal + calc.tipAmt)}
                </span>
              </div>
            </div>
          )}

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
            <p className="text-white/70 text-sm font-medium">Quer dividir por foto do cardápio?</p>
            <p className="text-white/40 text-sm leading-relaxed">
              O app Na Ponta do Lápis usa IA para extrair os itens direto da foto do cardápio e calcular o que cada pessoa deve exatamente.
            </p>
            <p className="text-white/20 text-xs italic">sem data prometida — só quando estiver bom.</p>
          </div>
        </div>
      )}
    </div>
  )
}
