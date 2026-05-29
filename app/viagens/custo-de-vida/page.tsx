import type { Metadata } from 'next'
import { CostOfLivingCalculator } from '@/components/calculators/CostOfLivingCalculator'
import { AppCTA } from '@/components/AppCTA'
import { SourcesFooter } from '@/components/ui/SourcesFooter'

export const metadata: Metadata = {
  title: 'Comparador de Custo de Vida entre Cidades — Vale a pena mudar?',
  description: 'Compare o custo de vida de capitais, polos econômicos e regiões metropolitanas do Brasil. Calcule o orçamento equivalente de moradia, alimentação e serviços para planejar sua mudança ou trabalho remoto.',
  openGraph: {
    title: 'Comparador de Custo de Vida entre Cidades — A Ponta do Lápis',
    description: 'Compare orçamentos entre diferentes cidades do Brasil e planeje sua mudança ou arbitragem geográfica.',
    url: 'https://apontadolapis.com.br/viagens/custo-de-vida',
    locale: 'pt_BR',
    type: 'website',
  },
  alternates: { canonical: 'https://apontadolapis.com.br/viagens/custo-de-vida' },
}

export default function CostOfLivingPage() {
  return (
    <div className="space-y-8">
      
      {/* Calm page header */}
      <div className="calm-header" style={{ paddingBottom: 32, borderBottom: '1px solid var(--c-line)', marginBottom: 8 }}>
        <span className="c-pill" style={{ marginBottom: 16, display: 'inline-flex', backgroundColor: 'var(--c-emerald-soft)', color: 'var(--c-emerald)' }}>
          GEOGRAFIA · ARBITRAGEM FINANCEIRA
        </span>
        <h1 className="c-display" style={{ fontSize: 'clamp(32px, 5vw, 56px)', color: 'var(--c-ink)', marginBottom: 12 }}>
          Compare o custo de vida<br />
          <span className="c-display-500" style={{ color: 'var(--c-muted)' }}>entre cidades brasileiras.</span>
        </h1>
        <p style={{ color: 'var(--c-muted)', fontSize: 16, lineHeight: 1.65, maxWidth: 560 }}>
          Descubra o valor real da sua mudança ou planeje o orçamento para trabalho remoto.{' '}
          <strong style={{ color: 'var(--c-ink)' }}>Insira seu custo de vida atual, ajuste os pesos do seu orçamento (moradia, alimentação e serviços) e veja onde seu dinheiro rende mais.</strong>{' '}
          Modelagem precisa baseada em índices regionais de capitais, hubs econômicos e médias estaduais.
        </p>
      </div>

      <CostOfLivingCalculator />

      <div className="prose prose-sm prose-stone max-w-none space-y-6">
        <div>
          <h2 className="text-base font-semibold text-stone-700 dark:text-stone-300">Como funciona a arbitragem geográfica?</h2>
          <p className="text-stone-500 dark:text-stone-400 text-sm leading-relaxed mt-2">
            A arbitragem geográfica é a estratégia de ganhar dinheiro em uma economia forte ou cidade de salários elevados (como São Paulo ou Rio de Janeiro) e gastá-lo em uma região onde o custo de vida é substancialmente menor. Com o avanço do trabalho remoto e de posições híbridas, essa tática virou um dos maiores aceleradores de poupança no Brasil. Ao manter uma renda indexada ao mercado financeiro ou a grandes corporações da capital paulista e morar no interior ou em outras capitais com moradia barata, o profissional consegue multiplicar sua taxa de poupança mensal sem reduzir seu padrão de consumo.
          </p>
        </div>

        <div>
          <h2 className="text-base font-semibold text-stone-700 dark:text-stone-300">Metodologia dos Índices de Preço</h2>
          <p className="text-stone-500 dark:text-stone-400 text-sm leading-relaxed mt-2">
            Para estimar a paridade do poder de compra (PPC) local de forma precisa, nossa base de dados normaliza os índices de custo relativo tomando a cidade de <strong>São Paulo como base (SP = 100)</strong> em três pilares fundamentais do orçamento:
          </p>
          <ul className="list-disc pl-5 text-stone-500 dark:text-stone-400 text-sm leading-relaxed mt-2 space-y-1">
            <li><strong>Moradia / Aluguel:</strong> Modelado com base no índice <i>FipeZap de Locação Residencial</i>, comparando preços médios de metro quadrado anunciado e custos condominiais médios por capital e grandes polos (ex: Campinas, Santos, Niterói).</li>
            <li><strong>Alimentação:</strong> Ponderado a partir do custo mensal da cesta básica levantado pelo <i>DIEESE (Departamento Intersindical de Estatística e Estudos Socioeconômicos)</i> e ajustado com a variação regional de subitens do IPCA de alimentação fora do lar.</li>
            <li><strong>Serviços, Lazer e Transporte:</strong> Combina o custo do transporte público municipal, preços de combustíveis (ANP), mensalidades médias de lazer e variações de serviços de beleza e condicionamento físico.</li>
          </ul>
          <p className="text-stone-500 dark:text-stone-400 text-sm leading-relaxed mt-2">
            Como o Brasil conta com 5.570 municípios e não há bases públicas contínuas de preço para todos eles, as cidades menores e sem cotação individualizada são representadas pelas médias estaduais das regiões de interior (ex: <i>Interior do Ceará</i> ou <i>Interior do Paraná</i>), o que garante 100% de cobertura estatística nacional.
          </p>
        </div>
      </div>

      <SourcesFooter sources={[
        { label: 'DIEESE — Pesquisa Nacional da Cesta Básica de Alimentos', url: 'https://www.dieese.org.br/' },
        { label: 'FipeZap — Índice de Preços de Venda e Locação de Imóveis', url: 'https://www.fipezap.com.br/' },
        { label: 'IBGE — IPCA e Pesquisa de Orçamentos Familiares (POF)', url: 'https://www.ibge.gov.br/' },
        { label: 'ANP — Painel de Levantamento de Preços de Combustíveis', url: 'https://www.gov.br/anp/' }
      ]} />
      
      <AppCTA context="seu custo de vida e arbitragem geográfica" />
    </div>
  )
}
