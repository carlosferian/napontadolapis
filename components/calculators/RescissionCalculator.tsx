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
import { calculateRescission, RescissionParams } from '@/lib/calculations/rescission'
import { Info, HelpCircle, CheckCircle, Percent, ShieldCheck, XCircle, AlertTriangle } from 'lucide-react'

export function RescissionCalculator() {
  // Input States
  const [grossSalary, setGrossSalary] = useState<number>(3500)
  const [startDate, setStartDate] = useState<string>('2025-01-01')
  const [endDate, setEndDate] = useState<string>('2026-05-28')
  const [reason, setReason] = useState<RescissionParams['reason']>('employer-no-cause')
  const [noticeType, setNoticeType] = useState<RescissionParams['noticeType']>('paid')
  const [hasExpiredVacation, setHasExpiredVacation] = useState<boolean>(false)
  const [fgtsBalance, setFgtsBalance] = useState<number>(5000)

  // Compute rescission
  const results = useMemo(() => {
    // Basic date validations
    if (!startDate || !endDate || new Date(startDate) > new Date(endDate) || grossSalary <= 0) {
      return null
    }

    return calculateRescission({
      grossSalary,
      startDate,
      endDate,
      reason,
      noticeType,
      hasExpiredVacation,
      fgtsBalance,
    })
  }, [grossSalary, startDate, endDate, reason, noticeType, hasExpiredVacation, fgtsBalance])

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:items-start">
      {/* ── COLUNA ESQUERDA: INPUTS ────────────────────────────── */}
      <div className="lg:col-span-5 space-y-4">
        <CalculatorCard title="Dados da Rescisão" subtitle="Preencha os valores contratuais para simular os proventos e descontos da sua demissão.">
          
          {/* Salário Bruto */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label htmlFor="gross-salary" className="text-sm font-semibold" style={{ color: 'var(--c-muted)' }}>
                Salário Bruto Mensal (R$)
              </label>
              <div className="relative w-36">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-medium" style={{ color: 'var(--c-muted)' }}>R$</span>
                <input
                  id="gross-salary"
                  type="number"
                  value={grossSalary === 0 ? '' : grossSalary}
                  placeholder="0,00"
                  onChange={(e) => setGrossSalary(Math.max(0, Number(e.target.value) || 0))}
                  className="w-full text-right border rounded-xl pr-3 pl-8 py-1.5 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  style={{ backgroundColor: 'var(--c-bg)', color: 'var(--c-ink)', borderColor: 'var(--c-line)' }}
                />
              </div>
            </div>
          </div>

          {/* Datas */}
          <div className="grid grid-cols-2 gap-3 pt-2">
            <div className="space-y-1.5">
              <label htmlFor="start-date" className="text-xs font-semibold" style={{ color: 'var(--c-muted)' }}>
                Data de Admissão
              </label>
              <input
                id="start-date"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full border rounded-xl px-2.5 py-1.5 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500"
                style={{ backgroundColor: 'var(--c-bg)', color: 'var(--c-ink)', borderColor: 'var(--c-line)' }}
              />
            </div>
            <div className="space-y-1.5">
              <label htmlFor="end-date" className="text-xs font-semibold" style={{ color: 'var(--c-muted)' }}>
                Data de Afastamento
              </label>
              <input
                id="end-date"
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full border rounded-xl px-2.5 py-1.5 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500"
                style={{ backgroundColor: 'var(--c-bg)', color: 'var(--c-ink)', borderColor: 'var(--c-line)' }}
              />
            </div>
          </div>

          {/* Motivo da Demissão */}
          <div className="space-y-2 pt-2">
            <label htmlFor="rescission-reason" className="text-sm font-semibold" style={{ color: 'var(--c-muted)' }}>
              Motivo do Desligamento
            </label>
            <select
              id="rescission-reason"
              value={reason}
              onChange={(e) => {
                const r = e.target.value as RescissionParams['reason']
                setReason(r)
                // Ajustar aviso padrão para fazer sentido
                if (r === 'employer-with-cause') {
                  setNoticeType('excused')
                }
              }}
              className="w-full border rounded-xl px-3 py-2 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer"
              style={{ backgroundColor: 'var(--c-bg)', color: 'var(--c-ink)', borderColor: 'var(--c-line)' }}
            >
              <option value="employer-no-cause">Demissão sem justa causa pelo Empregador</option>
              <option value="employer-with-cause">Demissão por justa causa pelo Empregador</option>
              <option value="employee-resignation">Pedido de Demissão pelo Empregado</option>
              <option value="mutual-agreement">Rescisão por Comum Acordo (Reforma Trabalhista)</option>
            </select>
          </div>

          {/* Tipo de Aviso Prévio (Só aplicável se não for Justa Causa) */}
          {reason !== 'employer-with-cause' && (
            <div className="space-y-2 pt-2">
              <label htmlFor="notice-type" className="text-sm font-semibold" style={{ color: 'var(--c-muted)' }}>
                Aviso Prévio
              </label>
              <select
                id="notice-type"
                value={noticeType}
                onChange={(e) => setNoticeType(e.target.value as any)}
                className="w-full border rounded-xl px-3 py-2 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer"
                style={{ backgroundColor: 'var(--c-bg)', color: 'var(--c-ink)', borderColor: 'var(--c-line)' }}
              >
                <option value="paid">
                  {reason === 'employee-resignation' ? 'Indenizado / Descontado (não cumpri)' : 'Indenizado pelo Empregador (pago na rescisão)'}
                </option>
                <option value="worked">Trabalhado (cumprido em serviço)</option>
                <option value="excused">Dispensado pelo Empregador / Acordo</option>
              </select>
            </div>
          )}

          {/* Saldo de FGTS acumulado (Apenas se demissão sem causa ou acordo comum) */}
          {(reason === 'employer-no-cause' || reason === 'mutual-agreement') && (
            <div className="space-y-2 pt-2 border-t" style={{ borderColor: 'var(--c-line)' }}>
              <div className="flex justify-between items-center">
                <div className="space-y-0.5">
                  <label htmlFor="fgts-balance" className="text-sm font-bold block" style={{ color: 'var(--c-ink)' }}>
                    Saldo FGTS para fins rescisórios (R$)
                  </label>
                  <span className="text-[11px] block" style={{ color: 'var(--c-muted)' }}>
                    Consultar o saldo gerado pela empresa no app FGTS.
                  </span>
                </div>
                <div className="relative w-36">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-medium" style={{ color: 'var(--c-muted)' }}>R$</span>
                  <input
                    id="fgts-balance"
                    type="number"
                    value={fgtsBalance === 0 ? '' : fgtsBalance}
                    placeholder="0,00"
                    onChange={(e) => setFgtsBalance(Math.max(0, Number(e.target.value) || 0))}
                    className="w-full text-right border rounded-xl pr-3 pl-8 py-1.5 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    style={{ backgroundColor: 'var(--c-bg)', color: 'var(--c-ink)', borderColor: 'var(--c-line)' }}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Férias Vencidas Checkbox */}
          {reason !== 'employer-with-cause' && (
            <div className="flex items-center justify-between pt-2 border-t" style={{ borderColor: 'var(--c-line)' }}>
              <div className="space-y-0.5 pr-2">
                <span className="text-sm font-bold block" style={{ color: 'var(--c-ink)' }}>Você tem férias completas vencidas?</span>
                <span className="text-[11px] leading-tight block" style={{ color: 'var(--c-muted)' }}>
                  Assinale apenas se completou 1 ano e não tirou as férias correspondentes.
                </span>
              </div>
              <input
                type="checkbox"
                checked={hasExpiredVacation}
                onChange={(e) => setHasExpiredVacation(e.target.checked)}
                className="w-5 h-5 rounded border-stone-300 text-emerald-600 focus:ring-emerald-500 cursor-pointer animate-pulse-slow"
              />
            </div>
          )}

        </CalculatorCard>
      </div>

      {/* ── COLUNA DIREITA: RESULTADOS E QUEBRAS ANALÍTICAS ────── */}
      <div role="region" aria-live="polite" aria-label="Resultado da Rescisão" className="lg:col-span-7 space-y-4">
        
        {!results ? (
          <div className="rounded-3xl border border-red-500/20 p-6 flex gap-3 bg-red-500/5 text-red-700 dark:text-red-400">
            <XCircle className="shrink-0" size={24} />
            <div>
              <h3 className="text-base font-bold">Erro nas datas digitadas</h3>
              <p className="text-xs mt-1 leading-relaxed">
                Por favor, confira os dados. A <strong>data de afastamento</strong> deve ser posterior à <strong>data de admissão</strong> e o salário bruto deve ser superior a R$ 0.
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            
            {/* Valor Líquido ResultHero */}
            <ResultHero
              label="Valor Líquido a Receber"
              value={formatBRL(results.netValue)}
              comment={`Proventos: ${formatBRL(results.totalEarnings)} | Descontos: ${formatBRL(results.totalDeductions)}`}
              colorClass="text-emerald-600 dark:text-emerald-400"
              infoTooltip="O valor líquido refere-se à soma de todos os proventos devidos (saldo de salário, 13º proporcional, férias, aviso prévio) já descontados o INSS progressivo e o imposto de renda retido na fonte aplicados sobre as bases tributáveis. Exclui o valor depositado em conta FGTS."
            />

            {/* Grid de Sub-métricas rápidas */}
            <MetricGrid
              metrics={[
                {
                  label: 'Tempo de Contrato',
                  value: `${results.monthsWorked} meses`,
                  sublabel: `Média de ${results.daysWorkedInLastMonth} dias no último mês`,
                  colorClass: 'text-stone-900 dark:text-stone-100',
                },
                {
                  label: 'Total Descontado',
                  value: formatBRL(results.totalDeductions),
                  sublabel: 'INSS progressivo + IRRF',
                  colorClass: 'text-red-600 dark:text-red-400',
                },
                {
                  label: 'FGTS Total Sacável',
                  value: (reason === 'employer-no-cause' || reason === 'mutual-agreement') ? formatBRL(results.fgtsWithdrawable) : 'R$ 0,00',
                  sublabel: (reason === 'employer-no-cause') ? 'Multa 40% inclusa' : (reason === 'mutual-agreement') ? '80% saldo + 20% multa' : 'Saque indisponível',
                  colorClass: 'text-teal-600 dark:text-teal-400',
                },
              ]}
            />

            {/* FGTS fine insight box */}
            {(reason === 'employer-no-cause' || reason === 'mutual-agreement') && (
              <div className="rounded-2xl border p-4 flex gap-3 bg-teal-500/5 border-teal-500/10 text-xs text-teal-800 dark:text-teal-300 leading-relaxed">
                <ShieldCheck className="shrink-0 text-teal-600 dark:text-teal-400" size={18} />
                <div>
                  <p className="font-bold">Multa Rescisória do FGTS Liberada!</p>
                  <p>
                    {reason === 'employer-no-cause' ? (
                      `Pela demissão sem justa causa, você tem direito à multa de 40% do FGTS paga pela empresa (${formatBRL(results.fgtsFine)}). O total sacável do seu saldo acumulado (${formatBRL(fgtsBalance)}) mais a multa é de ${formatBRL(results.fgtsWithdrawable)}.`
                    ) : (
                      `Pela demissão em comum acordo, a multa rescisória é reduzida para 20% (${formatBRL(results.fgtsFine)}). Além disso, você tem permissão legal para sacar até 80% do seu saldo total de FGTS, gerando um saque total de ${formatBRL(results.fgtsWithdrawable)}.`
                    )}
                  </p>
                </div>
              </div>
            )}

            {/* Justa Causa Warning */}
            {reason === 'employer-with-cause' && (
              <div className="rounded-2xl border p-4 flex gap-3 bg-red-500/5 border-red-500/10 text-xs text-red-800 dark:text-red-400 leading-relaxed">
                <AlertTriangle className="shrink-0 text-red-600 dark:text-red-400" size={18} />
                <div>
                  <p className="font-bold">Demissão por Justa Causa Aplicada</p>
                  <p>
                    Na demissão por justa causa, o funcionário perde quase todos os direitos rescisórios. Você recebe apenas o <strong>Saldo de Salário</strong> trabalhado no mês e férias vencidas com 1/3 (se possuir). Você perde o direito ao 13º proporcional, férias proporcionais, aviso prévio, multa de 40%, guia de saque do FGTS e seguro-desemprego.
                  </p>
                </div>
              </div>
            )}

            {/* Quebra Detalhada Proventos e Descontos */}
            <div 
              className="rounded-2xl border p-5 space-y-4"
              style={{
                backgroundColor: 'var(--c-card-calm)',
                borderColor: 'var(--c-line)'
              }}
            >
              <h3 className="text-base font-bold" style={{ color: 'var(--c-ink)' }}>Demonstrativo Detalhado de Rescisão</h3>
              
              <div className="space-y-4">
                {/* Proventos */}
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider mb-2 text-emerald-600 dark:text-emerald-400">
                    Proventos (Valores a Receber)
                  </h4>
                  <div className="divide-y text-xs" style={{ borderColor: 'var(--c-line)' }}>
                    {results.earnings.map((e, idx) => (
                      <div key={idx} className="py-2.5 flex justify-between gap-4">
                        <div className="space-y-0.5">
                          <p className="font-bold" style={{ color: 'var(--c-ink)' }}>{e.label}</p>
                          <p className="text-[10px]" style={{ color: 'var(--c-muted)' }}>{e.description}</p>
                        </div>
                        <span className="font-bold text-emerald-600 dark:text-emerald-400 tabular-nums">
                          {formatBRL(e.value)}
                        </span>
                      </div>
                    ))}
                    <div className="py-2.5 flex justify-between font-bold" style={{ color: 'var(--c-ink)' }}>
                      <span>Total de Proventos Brutos:</span>
                      <span className="tabular-nums">{formatBRL(results.totalEarnings)}</span>
                    </div>
                  </div>
                </div>

                {/* Descontos */}
                {results.deductions.length > 0 && (
                  <div className="pt-2 border-t" style={{ borderColor: 'var(--c-line)' }}>
                    <h4 className="text-xs font-bold uppercase tracking-wider mb-2 text-red-600 dark:text-red-400">
                      Descontos (Valores Deduzidos)
                    </h4>
                    <div className="divide-y text-xs" style={{ borderColor: 'var(--c-line)' }}>
                      {results.deductions.map((d, idx) => (
                        <div key={idx} className="py-2.5 flex justify-between gap-4">
                          <div className="space-y-0.5">
                            <p className="font-bold" style={{ color: 'var(--c-ink)' }}>{d.label}</p>
                            <p className="text-[10px]" style={{ color: 'var(--c-muted)' }}>{d.description}</p>
                          </div>
                          <span className="font-bold text-red-600 dark:text-red-400 tabular-nums">
                            -{formatBRL(d.value)}
                          </span>
                        </div>
                      ))}
                      <div className="py-2.5 flex justify-between font-bold" style={{ color: 'var(--c-ink)' }}>
                        <span>Total de Descontos:</span>
                        <span className="tabular-nums text-red-600 dark:text-red-400">-{formatBRL(results.totalDeductions)}</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Share wrapped card */}
            <div className="rounded-2xl p-4 border" style={{ backgroundColor: 'var(--c-surface)', borderColor: 'var(--c-line)' }}>
              <p className="text-xs mb-3 text-center font-bold uppercase tracking-wider" style={{ color: 'var(--c-muted)' }}>
                Compartilhe sua Rescisão CLT
              </p>
              <ScaledPreview>
                <ShareCardBase
                  id="rescission-share-card"
                  eyebrow="Rescisão Trabalhista CLT · Simulador"
                  mainValue={formatBRL(results.netValue)}
                  mainLabel="valor líquido a receber na minha rescisão trabalhista"
                  metrics={[
                    { label: 'Salário de Referência', value: formatBRL(grossSalary) },
                    { label: 'Tempo Trabalhado', value: `${results.monthsWorked} meses` },
                    { label: 'FGTS Sacável', value: (reason === 'employer-no-cause' || reason === 'mutual-agreement') ? formatBRL(results.fgtsWithdrawable) : 'Saque Indisponível' },
                    { label: 'Total Proventos', value: formatBRL(results.totalEarnings) },
                  ]}
                  footer="Cálculos CLT completos sob a ponta do lápis."
                  accentColor="#10b981"
                />
              </ScaledPreview>
              <div className="mt-3">
                <ShareButtons cardId="rescission-share-card" filename="minha-rescisao-clt" />
              </div>
            </div>

          </div>
        )}
        
      </div>
    </div>
  )
}
