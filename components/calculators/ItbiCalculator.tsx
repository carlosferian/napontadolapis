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
import { ITBI_CITIES, calculateITBIAndFees, ITBICalculationInput } from '@/config/itbi'
import { Info, HelpCircle, ShieldAlert, Sparkles, Building2, CheckCircle2 } from 'lucide-react'

export function ItbiCalculator() {
  const [propertyValue, setPropertyValue] = useState<number>(350000)
  const [paymentMethod, setPaymentMethod] = useState<'vista' | 'financiado'>('financiado')
  const [downPayment, setDownPayment] = useState<number>(70000)
  const [cityCode, setCityCode] = useState<string>('SP')
  const [customRate, setCustomRate] = useState<number>(2.0)
  const [isFirstProperty, setIsFirstProperty] = useState<boolean>(false)

  // Garante que o sinal/entrada não ultrapasse o valor do imóvel
  const validatedDownPayment = useMemo(() => {
    if (downPayment >= propertyValue) {
      return propertyValue - 10000 > 0 ? propertyValue - 10000 : 0
    }
    return downPayment
  }, [downPayment, propertyValue])

  const calculationInput = useMemo<ITBICalculationInput>(() => ({
    propertyValue,
    paymentMethod,
    downPayment: validatedDownPayment,
    cityCode,
    customStandardRate: customRate,
    isFirstProperty
  }), [propertyValue, paymentMethod, validatedDownPayment, cityCode, customRate, isFirstProperty])

  const results = useMemo(() => {
    return calculateITBIAndFees(calculationInput)
  }, [calculationInput])

  const selectedCity = useMemo(() => {
    return ITBI_CITIES.find(c => c.code === cityCode)
  }, [cityCode])

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:items-start">
      {/* ── COLUNA ESQUERDA: PARÂMETROS ────────────────────────── */}
      <div className="lg:col-span-5 space-y-4">
        
        <CalculatorCard 
          title="Dados do Imóvel" 
          subtitle="Simule o valor de venda, forma de pagamento e localize a cidade para estimar as taxas."
        >
          {/* Valor do Imóvel */}
          <div className="space-y-2">
            <div className="flex justify-between items-baseline">
              <label htmlFor="property-value" className="text-xs font-semibold" style={{ color: 'var(--c-muted)' }}>
                Valor de Compra do Imóvel
              </label>
              <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400">
                {formatBRL(propertyValue)}
              </span>
            </div>
            <input
              id="property-value"
              type="range"
              min={50000}
              max={2500000}
              step={10000}
              value={propertyValue}
              onChange={(e) => {
                const val = Number(e.target.value)
                setPropertyValue(val)
                // Ajusta proporcionalmente a entrada para 20% se o valor do imóvel mudar
                setDownPayment(Math.round(val * 0.2))
              }}
              className="w-full h-1.5 rounded-lg appearance-none cursor-pointer accent-emerald-500"
              style={{ backgroundColor: 'var(--c-line)' }}
            />
            <div className="flex justify-between text-[10px]" style={{ color: 'var(--c-muted-2)' }}>
              <span>R$ 50 mil</span>
              <span>R$ 2.5 milhões</span>
            </div>
          </div>

          {/* Cidade de Localização */}
          <div className="space-y-2 pt-3 border-t" style={{ borderColor: 'var(--c-line)' }}>
            <label htmlFor="city-select" className="text-xs font-semibold" style={{ color: 'var(--c-muted)' }}>
              Cidade (Para alíquota do ITBI)
            </label>
            <select
              id="city-select"
              value={cityCode}
              onChange={(e) => setCityCode(e.target.value)}
              className="w-full border rounded-xl px-3 py-2 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer"
              style={{
                backgroundColor: 'var(--c-bg)',
                color: 'var(--c-ink)',
                borderColor: 'var(--c-line)'
              }}
            >
              <optgroup label="Principais Capitais" style={{ fontWeight: 'bold' }}>
                {ITBI_CITIES.map((c) => (
                  <option key={c.code} value={c.code}>
                    {c.name} ({c.state}) — {c.standardRate.toFixed(1).replace('.', ',')}%
                  </option>
                ))}
              </optgroup>
              <option value="custom">Outra Cidade (Personalizar alíquota)</option>
            </select>
          </div>

          {/* Alíquota Customizada (se selecionado "Outra Cidade") */}
          {cityCode === 'custom' && (
            <div className="space-y-2 pt-3 border-t animate-fadeIn" style={{ borderColor: 'var(--c-line)' }}>
              <div className="flex justify-between items-baseline">
                <label htmlFor="custom-rate" className="text-xs font-semibold" style={{ color: 'var(--c-muted)' }}>
                  Alíquota do ITBI Personalizada
                </label>
                <span className="text-sm font-bold" style={{ color: 'var(--c-ink)' }}>
                  {customRate.toString().replace('.', ',')}%
                </span>
              </div>
              <input
                id="custom-rate"
                type="range"
                min={0.5}
                max={5}
                step={0.1}
                value={customRate}
                onChange={(e) => setCustomRate(Number(e.target.value))}
                className="w-full h-1.5 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                style={{ backgroundColor: 'var(--c-line)' }}
              />
              <div className="flex justify-between text-[10px]" style={{ color: 'var(--c-muted-2)' }}>
                <span>0,5% (Mínimo)</span>
                <span>5,0% (Máximo)</span>
              </div>
            </div>
          )}

          {/* Forma de Pagamento */}
          <div className="space-y-2 pt-3 border-t" style={{ borderColor: 'var(--c-line)' }}>
            <label className="text-xs font-semibold" style={{ color: 'var(--c-muted)' }}>
              Forma de Pagamento
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setPaymentMethod('vista')}
                className={`py-2 rounded-xl text-xs font-bold transition-all text-center cursor-pointer border ${paymentMethod === 'vista' ? 'bg-emerald-500/10 text-emerald-700 border-emerald-500/30' : 'text-stone-500 border-transparent bg-stone-500/5'}`}
              >
                💵 À Vista
              </button>
              <button
                type="button"
                onClick={() => setPaymentMethod('financiado')}
                className={`py-2 rounded-xl text-xs font-bold transition-all text-center cursor-pointer border ${paymentMethod === 'financiado' ? 'bg-emerald-500/10 text-emerald-700 border-emerald-500/30' : 'text-stone-500 border-transparent bg-stone-500/5'}`}
              >
                🏦 Financiado
              </button>
            </div>
          </div>

          {/* Parâmetros adicionais se financiado */}
          {paymentMethod === 'financiado' && (
            <div className="space-y-3 pt-3 border-t animate-fadeIn" style={{ borderColor: 'var(--c-line)' }}>
              {/* Entrada */}
              <div className="space-y-2">
                <div className="flex justify-between items-baseline">
                  <label htmlFor="down-payment" className="text-xs font-semibold" style={{ color: 'var(--c-muted)' }}>
                    Valor de Entrada (Sinal)
                  </label>
                  <span className="text-xs font-bold" style={{ color: 'var(--c-ink)' }}>
                    {formatBRL(validatedDownPayment)} <span className="text-[10px] font-medium" style={{ color: 'var(--c-muted)' }}>({((validatedDownPayment / propertyValue) * 100).toFixed(0)}%)</span>
                  </span>
                </div>
                <input
                  id="down-payment"
                  type="range"
                  min={Math.round(propertyValue * 0.1)}
                  max={Math.round(propertyValue * 0.9)}
                  step={5000}
                  value={validatedDownPayment}
                  onChange={(e) => setDownPayment(Number(e.target.value))}
                  className="w-full h-1.5 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                  style={{ backgroundColor: 'var(--c-line)' }}
                />
                <div className="flex justify-between text-[10px]" style={{ color: 'var(--c-muted-2)' }}>
                  <span>Min: 10% ({formatBRL(propertyValue * 0.1)})</span>
                  <span>Max: 90% ({formatBRL(propertyValue * 0.9)})</span>
                </div>
              </div>

              {/* Checkbox Primeiro Imóvel */}
              <div className="flex items-start gap-2.5 p-2 bg-stone-500/5 rounded-xl border border-dashed" style={{ borderColor: 'var(--c-line)' }}>
                <input
                  id="first-property-check"
                  type="checkbox"
                  checked={isFirstProperty}
                  onChange={(e) => setIsFirstProperty(e.target.checked)}
                  className="mt-1 cursor-pointer w-4 h-4 accent-emerald-500 rounded"
                />
                <div className="text-[11px] leading-relaxed">
                  <label htmlFor="first-property-check" className="font-bold cursor-pointer" style={{ color: 'var(--c-ink-2)' }}>
                    É o meu primeiro imóvel residencial
                  </label>
                  <p style={{ color: 'var(--c-muted)' }}>
                    Garante **50% de desconto** nas custas de cartório (Registro) pelo Art. 290 da Lei 6.015/73 (apenas para financiamento SFH).
                  </p>
                </div>
              </div>
            </div>
          )}
        </CalculatorCard>

        {/* Bloco de nota explicativa */}
        <div className="rounded-2xl border p-4 flex gap-3 bg-stone-500/5 animate-fadeIn" style={{ borderColor: 'var(--c-line)' }}>
          <Info className="shrink-0 text-stone-500" size={18} style={{ color: 'var(--c-muted)' }} />
          <div className="space-y-1 text-xs leading-relaxed" style={{ color: 'var(--c-muted)' }}>
            <p className="font-semibold" style={{ color: 'var(--c-ink-2)' }}>Nota técnica sobre cartórios:</p>
            <p>
              Emolumentos de Escritura e Registro variam conforme tabelas progressivas estaduais. Os valores exibidos são **estimativas médias nacionais consolidadas**, servindo como excelente referência orçamentária.
            </p>
          </div>
        </div>
      </div>

      {/* ── COLUNA DIREITA: RESULTADOS E COMPARAÇÕES ────────────── */}
      <div role="region" aria-live="polite" aria-label="Resultado dos Custos do Imóvel" className="lg:col-span-7 space-y-4">
        
        {/* Result Hero (Custo total estimado) */}
        <ResultHero
          label="Total de Custos Extras de Transferência"
          value={formatBRL(results.grandTotal)}
          comment={`Essas taxas equivalem a aproximadamente ${results.totalPercentOfProperty.toFixed(1).replace('.', ',')}% do valor de venda do imóvel. Recomenda-se ter esse valor líquido reservado em conta para a assinatura do contrato.`}
          colorClass="text-emerald-600 dark:text-emerald-400 font-extrabold"
          infoTooltip="A soma total engloba o imposto municipal (ITBI), taxas do Cartório de Registro de Imóveis, escritura pública em Cartório de Notas (se aplicável à compra à vista) e taxa administrativa do banco para confecção do contrato."
        />

        {/* Grid de Sub-métricas rápidas */}
        <MetricGrid
          metrics={[
            {
              label: `ITBI (${results.itbiRateStandard.toFixed(1).replace('.', ',')}% padrão)`,
              value: formatBRL(results.itbiTotal),
              sublabel: paymentMethod === 'financiado' && results.financedAmount > 0
                ? `${results.itbiRateSfh.toString().replace('.', ',')}% sob financiado: ${formatBRL(results.itbiTaxOnFinanced)}`
                : 'calculado sobre valor integral',
              colorClass: 'text-stone-950 dark:text-white font-bold',
            },
            {
              label: 'Custos de Cartório',
              value: formatBRL(results.cartorioTotal),
              sublabel: results.firstPropertyDiscountSaved > 0 
                ? `com 50% de desconto ativo (economizou ${formatBRL(results.firstPropertyDiscountSaved)})`
                : results.escrituraCost === 0
                  ? 'isento de escritura (registro de imóvel apenas)'
                  : 'escritura + registro inclusos',
              colorClass: 'text-stone-950 dark:text-white font-bold',
            },
            {
              label: paymentMethod === 'financiado' ? 'Custos com Financiamento' : 'Custos com Escritura',
              value: paymentMethod === 'financiado' ? formatBRL(results.bankFee) : formatBRL(results.escrituraCost),
              sublabel: paymentMethod === 'financiado'
                ? 'taxa de avaliação física + contrato do banco'
                : 'lavratura da escritura pública no cartório',
              colorClass: 'text-stone-500',
            },
          ]}
        />

        {/* Detalhamento Dinâmico de Custos */}
        <div 
          className="rounded-2xl border p-5 space-y-4"
          style={{
            backgroundColor: 'var(--c-card-calm)',
            borderColor: 'var(--c-line)'
          }}
        >
          <div className="flex justify-between items-baseline" style={{ borderBottom: '1px solid var(--c-line)', paddingBottom: 10 }}>
            <h3 className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--c-muted)' }}>
              Extrato Detalhado de Transferência
            </h3>
            <span className="text-[10px] italic" style={{ color: 'var(--c-muted-2)' }}>Transação {paymentMethod === 'vista' ? 'À Vista' : 'Financiada'}</span>
          </div>

          <div className="divide-y text-xs" style={{ borderColor: 'var(--c-line)' }}>
            {/* Linha 1: ITBI Entrada */}
            <div className="flex justify-between py-2.5">
              <div>
                <p className="font-semibold" style={{ color: 'var(--c-ink-2)' }}>ITBI — Recursos Próprios (Entrada / Sinal)</p>
                <p className="text-[10px]" style={{ color: 'var(--c-muted)' }}>Alíquota padrão de {results.itbiRateStandard.toString().replace('.', ',')}% sobre {formatBRL(results.ownFundsAmount)}</p>
              </div>
              <p className="font-bold tabular-nums" style={{ color: 'var(--c-ink)' }}>{formatBRL(results.itbiTaxOnOwnFunds)}</p>
            </div>

            {/* Linha 2: ITBI Financiado (se houver) */}
            {paymentMethod === 'financiado' && results.financedAmount > 0 && (
              <div className="flex justify-between py-2.5">
                <div>
                  <p className="font-semibold" style={{ color: 'var(--c-ink-2)' }}>ITBI — Recursos Financiados (SFH)</p>
                  <p className="text-[10px]" style={{ color: 'var(--c-muted)' }}>Alíquota reduzida incentivada de {results.itbiRateSfh.toString().replace('.', ',')}% sobre {formatBRL(results.financedAmount)}</p>
                </div>
                <p className="font-bold text-emerald-600 dark:text-emerald-400 tabular-nums">{formatBRL(results.itbiTaxOnFinanced)}</p>
              </div>
            )}

            {/* Linha 3: Escritura */}
            <div className="flex justify-between py-2.5">
              <div>
                <p className="font-semibold" style={{ color: 'var(--c-ink-2)' }}>Escritura Pública (Tabelionato de Notas)</p>
                <p className="text-[10px]" style={{ color: 'var(--c-muted)' }}>
                  {paymentMethod === 'financiado' 
                    ? 'Isento! O contrato bancário tem força legal de Escritura Pública.'
                    : 'Taxa para lavrar a escritura pública de compra à vista.'
                  }
                </p>
              </div>
              <p className={`font-bold tabular-nums ${paymentMethod === 'financiado' ? 'text-emerald-600 dark:text-emerald-400' : 'text-stone-900'}`}>
                {paymentMethod === 'financiado' ? 'Isento (R$ 0)' : formatBRL(results.escrituraCost)}
              </p>
            </div>

            {/* Linha 4: Registro */}
            <div className="flex justify-between py-2.5">
              <div>
                <p className="font-semibold" style={{ color: 'var(--c-ink-2)' }}>Registro do Imóvel (Cartório de Registro)</p>
                <p className="text-[10px]" style={{ color: 'var(--c-muted)' }}>
                  {results.firstPropertyDiscountSaved > 0 
                    ? '50% de desconto federal ativo (Lei 6.015/73).'
                    : 'Taxa para averbar e transferir a propriedade no registro de imóveis.'
                  }
                </p>
              </div>
              <p className="font-bold tabular-nums" style={{ color: 'var(--c-ink)' }}>{formatBRL(results.registroCost)}</p>
            </div>

            {/* Linha 5: Avaliação do Banco */}
            {paymentMethod === 'financiado' && (
              <div className="flex justify-between py-2.5">
                <div>
                  <p className="font-semibold" style={{ color: 'var(--c-ink-2)' }}>Tarifas de Contrato & Avaliação do Banco</p>
                  <p className="text-[10px]" style={{ color: 'var(--c-muted)' }}>Custos com vistoria física do imóvel + emissão da apólice habitacional do banco.</p>
                </div>
                <p className="font-bold tabular-nums" style={{ color: 'var(--c-ink)' }}>{formatBRL(results.bankFee)}</p>
              </div>
            )}
          </div>
        </div>

        {/* Super Sacada / Inteligência da Lei (Insight de Economia) */}
        <div className="rounded-2xl border p-5 space-y-4" style={{ backgroundColor: 'var(--c-surface)', borderColor: 'var(--c-line)' }}>
          <div className="flex justify-between items-center" style={{ borderBottom: '1px solid var(--c-line)', paddingBottom: 12 }}>
            <span className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--c-muted)' }}>
              Principais Economias de Transferência
            </span>
            <div className="flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400 font-bold bg-emerald-500/5 px-2 py-0.5 rounded-lg border border-emerald-500/10">
              <Sparkles size={12} /> Inteligência Legal!
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Força de Escritura */}
            <div className="p-3 rounded-xl border space-y-2 bg-stone-500/5" style={{ borderColor: 'var(--c-line)' }}>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="text-emerald-500 shrink-0" size={16} />
                <span className="text-xs font-bold" style={{ color: 'var(--c-ink)' }}>Força de Escritura do Contrato</span>
              </div>
              <p className="text-[10px] leading-relaxed" style={{ color: 'var(--c-muted)' }}>
                Por força do Art. 61 da Lei nº 4.380/64, o **contrato de financiamento do banco substitui legalmente a escritura pública**. Como o comprador financiou, ele **economiza automaticamente cerca de R$ 3.000 a R$ 6.000** em custos de Tabelionato de Notas de compra à vista!
              </p>
            </div>

            {/* Primeiro Imóvel */}
            <div className="p-3 rounded-xl border space-y-2 bg-stone-500/5" style={{ borderColor: 'var(--c-line)' }}>
              <div className="flex items-center gap-2">
                <Building2 className="text-emerald-500 shrink-0" size={16} />
                <span className="text-xs font-bold" style={{ color: 'var(--c-ink)' }}>Art. 290 - Desconto de 50%</span>
              </div>
              <p className="text-[10px] leading-relaxed" style={{ color: 'var(--c-muted)' }}>
                Se esta for a aquisição do seu **primeiro imóvel residencial financiado pelo SFH**, o cartório de registro é obrigado por lei federal a dar **50% de desconto** nas custas de registro. Não se esqueça de solicitar este desconto na entrega da pasta de documentos!
              </p>
            </div>
          </div>
        </div>

        {/* Section: Compartilhar o Card de Custos */}
        <div className="rounded-2xl p-4 border" style={{ backgroundColor: 'var(--c-surface)', borderColor: 'var(--c-line)' }}>
          <p className="text-xs mb-3 text-center font-bold uppercase tracking-wider" style={{ color: 'var(--c-muted)' }}>
            Compartilhe os Custos de Transferência
          </p>
          <ScaledPreview>
            <ShareCardBase
              id="itbi-share-card"
              eyebrow={`Custos de Transferência Imobiliária (${cityCode === 'custom' ? 'Outra Cidade' : selectedCity?.name})`}
              mainValue={formatBRL(results.grandTotal)}
              mainLabel={`custos extras aproximados de impostos e taxas`}
              metrics={[
                { label: 'Valor do Imóvel', value: formatBRL(propertyValue) },
                { label: 'Imposto ITBI', value: formatBRL(results.itbiTotal) },
                { label: 'Taxas de Cartório', value: formatBRL(results.cartorioTotal) },
                { label: paymentMethod === 'financiado' ? 'Economia por Financiamento' : 'Escritura de Notas', value: paymentMethod === 'financiado' ? 'Escritura Grátis!' : formatBRL(results.escrituraCost) },
              ]}
              footer="calcule todos os custos imobiliários sob a ponta do lápis."
              accentColor="#10b981"
            />
          </ScaledPreview>
          <div className="mt-3">
            <ShareButtons cardId="itbi-share-card" filename="custos-aquisicao-imovel" />
          </div>
        </div>

      </div>
    </div>
  )
}
