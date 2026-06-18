import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { destinations, regionLabels, TRAVEL_CONFIG } from '@/config/travel'
import { destinationGuides } from '@/config/destination-guides'
import { TravelCalculator } from '@/components/calculators/TravelCalculator'
import { FAQ } from '@/components/ui/FAQ'
import { SourcesFooter } from '@/components/ui/SourcesFooter'
import { formatBRL } from '@/lib/formatters'

interface PageProps {
  params: Promise<{ destino: string }>
}

export async function generateStaticParams() {
  return destinations.map((d) => ({ destino: d.id }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { destino } = await params
  const dest = destinations.find((d) => d.id === destino)
  if (!dest) return {}

  const year = new Date().getFullYear()
  return {
    title: `Quanto custa viajar para ${dest.name}? Guia e calculadora ${year}`,
    description: `Quanto custa uma viagem para ${dest.name} (${dest.country})? Veja o custo real em reais com câmbio e IOF, melhor época para ir, onde se hospedar, vistos e dicas de economia. Calculadora gratuita, sem cadastro.`,
    openGraph: {
      title: `Viagem para ${dest.name}: quanto custa de verdade?`,
      description: `${dest.flag} ${dest.name} · ${dest.highlight}`,
      url: `https://apontadolapis.com.br/viagens/${dest.id}`,
      locale: 'pt_BR',
      type: 'article',
    },
    alternates: { canonical: `https://apontadolapis.com.br/viagens/${dest.id}` },
  }
}

export default async function DestinationPage({ params }: PageProps) {
  const { destino } = await params
  const dest = destinations.find((d) => d.id === destino)
  if (!dest) notFound()

  const guide = destinationGuides[dest.id]
  const usd = TRAVEL_CONFIG.defaultUSDtoBRL
  const year = new Date().getFullYear()
  const updatedLabel = new Date().toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })

  return (
    <div className="space-y-8">

      {/* Header com H1 (faltava nesta rota) */}
      <div className="calm-header" style={{ paddingBottom: 32, borderBottom: '1px solid var(--c-line)' }}>
        <span className="c-pill c-pill-blue" style={{ marginBottom: 16, display: 'inline-flex' }}>
          VIAGENS · {regionLabels[dest.region]?.toUpperCase() ?? 'DESTINO'}
        </span>
        <h1 className="c-display" style={{ fontSize: 'clamp(28px, 5vw, 50px)', color: 'var(--c-ink)', marginBottom: 12 }}>
          Quanto custa viajar para<br />
          <span className="c-display-500" style={{ color: 'var(--c-muted)' }}>{dest.flag} {dest.name}?</span>
        </h1>
        {guide && (
          <p style={{ color: 'var(--c-muted)', fontSize: 16, lineHeight: 1.65, maxWidth: 600 }}>
            {guide.intro}
          </p>
        )}
      </div>

      <TravelCalculator initialDestination={dest} />

      {guide ? (
        <article className="space-y-8">

          {/* Custos em números */}
          <section className="space-y-3">
            <h2 className="text-base font-semibold text-stone-700 dark:text-stone-300">
              Quanto custa uma viagem a {dest.name}, em números
            </h2>
            <p className="text-stone-500 dark:text-stone-400 text-sm leading-relaxed">
              Os valores abaixo são estimativas de referência (câmbio de {formatBRL(usd)}/US$) e servem de
              ponto de partida — use a calculadora acima para ajustar ao seu estilo, número de viajantes e
              tempo de viagem. Atualizado em {updatedLabel}.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <CostCard
                label="Voo de ida e volta (de São Paulo)"
                value={`a partir de ${formatBRL(dest.flightFromGRU.min)}`}
                note={`típico em torno de ${formatBRL(dest.flightFromGRU.typical)}`}
              />
              <CostCard
                label="Custo por dia, por pessoa"
                value={`${formatBRL(dest.dailyCostUSD.budget * usd)} – ${formatBRL(dest.dailyCostUSD.premium * usd)}`}
                note={`hospedagem, comida, transporte e passeios (econômico a confortável)`}
              />
            </div>
            <p className="text-xs text-stone-400">
              Estadia típica recomendada: {dest.typicalDays.recommended} dias
              (de {dest.typicalDays.min} a {dest.typicalDays.extended}).
              {dest.visa.required && dest.visa.costUSD
                ? ` Some o visto: cerca de US$ ${dest.visa.costUSD} por pessoa.`
                : ''}
            </p>
          </section>

          {/* Melhor época */}
          <section className="space-y-3">
            <h2 className="text-base font-semibold text-stone-700 dark:text-stone-300">
              Melhor época para visitar {dest.name}
            </h2>
            <p className="text-stone-500 dark:text-stone-400 text-sm leading-relaxed">{guide.bestTime.summary}</p>
            <ul className="text-sm leading-relaxed space-y-1.5 text-stone-500 dark:text-stone-400">
              <li><strong className="text-stone-600 dark:text-stone-300">Alta temporada:</strong> {guide.bestTime.high}</li>
              <li><strong className="text-stone-600 dark:text-stone-300">Baixa temporada:</strong> {guide.bestTime.low}</li>
              {guide.bestTime.avoid && (
                <li><strong className="text-stone-600 dark:text-stone-300">Evite:</strong> {guide.bestTime.avoid}</li>
              )}
            </ul>
          </section>

          {/* Voo e custos qualitativos */}
          <section className="space-y-3">
            <h2 className="text-base font-semibold text-stone-700 dark:text-stone-300">
              Voo, deslocamento e o que esperar de gastos
            </h2>
            <p className="text-stone-500 dark:text-stone-400 text-sm leading-relaxed">{guide.costContext}</p>
            <p className="text-stone-500 dark:text-stone-400 text-sm leading-relaxed">
              <strong className="text-stone-600 dark:text-stone-300">Voo:</strong> {guide.flight.duration} {guide.flight.tip}
            </p>
          </section>

          {/* Onde se hospedar */}
          <section className="space-y-3">
            <h2 className="text-base font-semibold text-stone-700 dark:text-stone-300">
              Onde se hospedar em {dest.name}
            </h2>
            <div className="space-y-2">
              {guide.neighborhoods.map((n) => (
                <div key={n.name} className="rounded-xl border border-stone-100 bg-stone-50 px-4 py-3">
                  <p className="text-sm font-bold text-stone-700 dark:text-stone-200">{n.name}</p>
                  <p className="text-sm mt-0.5 leading-relaxed text-stone-500 dark:text-stone-400">{n.desc}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Dinheiro, câmbio e visto */}
          <section className="space-y-3">
            <h2 className="text-base font-semibold text-stone-700 dark:text-stone-300">
              Dinheiro, câmbio e documentação
            </h2>
            <p className="text-stone-500 dark:text-stone-400 text-sm leading-relaxed">
              <strong className="text-stone-600 dark:text-stone-300">Moeda:</strong> {guide.money.currency} {guide.money.tip}
            </p>
            {dest.visa.required ? (
              <div className="bg-amber-50 border border-amber-100 rounded-xl p-4">
                <p className="text-amber-700 text-sm font-medium">Visto / autorização para {dest.country}</p>
                <p className="text-amber-600 text-sm mt-1 leading-relaxed">
                  {dest.visa.notes ? `${dest.visa.notes}. ` : ''}
                  {dest.visa.costUSD ? `Custo aproximado: US$ ${dest.visa.costUSD} por pessoa. ` : ''}
                  Confirme as regras atuais no Portal Consular do Itamaraty antes de viajar.
                </p>
              </div>
            ) : (
              <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-4">
                <p className="text-emerald-700 text-sm font-medium">Sem visto para brasileiros</p>
                <p className="text-emerald-600 text-sm mt-1 leading-relaxed">
                  {dest.visa.notes
                    ? `${dest.visa.notes}. `
                    : `Brasileiros entram em ${dest.country} sem visto para turismo de curta duração. `}
                  Leve o documento de viagem dentro da validade e confira as regras atuais no Portal Consular antes de embarcar.
                </p>
              </div>
            )}
          </section>

          {/* Como economizar */}
          <section className="space-y-3">
            <h2 className="text-base font-semibold text-stone-700 dark:text-stone-300">
              Como economizar em {dest.name}
            </h2>
            <p className="text-stone-500 dark:text-stone-400 text-sm leading-relaxed">{guide.savingTip}</p>
            <div className="bg-stone-50 border border-stone-100 rounded-xl p-4">
              <p className="text-sm font-bold text-stone-700 dark:text-stone-200">Fique atento</p>
              <p className="text-sm mt-0.5 leading-relaxed text-stone-500 dark:text-stone-400">{guide.watchOut}</p>
            </div>
          </section>

          <FAQ
            title={`Perguntas frequentes sobre viajar para ${dest.name}`}
            items={guide.faq}
          />

          {/* Links internos para outras ferramentas */}
          <section className="space-y-3">
            <h2 className="text-base font-semibold text-stone-700 dark:text-stone-300">
              Planeje a viagem com calma
            </h2>
            <p className="text-stone-500 dark:text-stone-400 text-sm leading-relaxed">
              Depois de estimar o custo, organize como pagar por ele. Use a{' '}
              <Link href="/viagens/planejar" className="underline underline-offset-2 text-emerald-700 hover:text-emerald-800">
                calculadora de meta de viagem
              </Link>{' '}
              para descobrir quanto poupar por mês até a data da viagem, ou compare destinos na{' '}
              <Link href="/viagens" className="underline underline-offset-2 text-emerald-700 hover:text-emerald-800">
                calculadora de viagem internacional
              </Link>. Se for usar milhas, veja se vale a pena na{' '}
              <Link href="/viagens/milhas-ou-dinheiro" className="underline underline-offset-2 text-emerald-700 hover:text-emerald-800">
                calculadora de milhas ou dinheiro
              </Link>.
            </p>
          </section>

          <SourcesFooter sources={[
            { label: 'Ministério das Relações Exteriores — Portal Consular (vistos e exigências de entrada por país)', url: 'https://www.gov.br/mre/pt-br/assuntos/portal-consular' },
            { label: 'Banco Central do Brasil — IOF e câmbio em compras internacionais', url: 'https://www.bcb.gov.br' },
            { label: `Estimativas de voo e custo diário — base interna A Ponta do Lápis (atualizado em ${updatedLabel})` },
          ]} />
        </article>
      ) : (
        /* Fallback mínimo caso um destino não tenha guia editorial */
        <div className="space-y-3">
          <h2 className="text-base font-semibold text-stone-700">
            Quanto custa viajar para {dest.name}?
          </h2>
          <p className="text-stone-500 text-sm leading-relaxed">
            Os valores estimados incluem hospedagem, alimentação, transporte local e atividades.
            O custo do voo é calculado em reais (ida e volta de Guarulhos), com câmbio e IOF embutidos.
            Estimativas de {year} — câmbio e valores variam.
          </p>
        </div>
      )}
    </div>
  )
}

function CostCard({ label, value, note }: { label: string; value: string; note: string }) {
  return (
    <div className="rounded-xl border border-stone-100 bg-stone-50 px-4 py-3">
      <p className="text-[11px] font-semibold uppercase tracking-wider text-stone-400">{label}</p>
      <p className="text-lg font-black text-stone-700 dark:text-stone-200 mt-1">{value}</p>
      <p className="text-xs text-stone-400 mt-0.5">{note}</p>
    </div>
  )
}
