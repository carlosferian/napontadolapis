import type { Metadata } from 'next'
import { MilesCalculator } from '@/components/calculators/MilesCalculator'
import { AppCTA } from '@/components/AppCTA'
import { SourcesFooter } from '@/components/ui/SourcesFooter'
import { AdBanner } from '@/components/AdBanner'

export const metadata: Metadata = {
  title: 'Calculadora de Milhas para Reais — Vale a pena Comprar ou Emitir?',
  description: 'Descubra a verdade matemática por trás das milhas aéreas. Calcule se vale a pena emitir passagem com milhas vs. dinheiro e se promoções de compra de pontos são vantajosas.',
  openGraph: {
    title: 'Conversor e Calculadora de Milhas para Reais — A Ponta do Lápis',
    description: 'Calcule o custo por mil milhas (CPP) das suas passagens ou promoções. Fuja do desconto fantasma e planeje sua viagem com inteligência.',
    url: 'https://apontadolapis.com.br/viagens/milhas-ou-dinheiro',
    locale: 'pt_BR',
    type: 'website',
  },
  alternates: { canonical: 'https://apontadolapis.com.br/viagens/milhas-ou-dinheiro' },
}

export default function MilesPage() {
  return (
    <div className="space-y-6">
      
      {/* Calm page header */}
      <div className="calm-header" style={{ paddingBottom: 32, borderBottom: '1px solid var(--c-line)', marginBottom: 8 }}>
        <span className="c-pill" style={{ marginBottom: 16, display: 'inline-flex', backgroundColor: 'var(--c-blue-soft)', color: 'var(--c-blue-calm)' }}>
          VIAGENS · INTELIGÊNCIA EM MILHAS
        </span>
        <h1 className="c-display" style={{ fontSize: 'clamp(32px, 5vw, 56px)', color: 'var(--c-ink)', marginBottom: 12 }}>
          Milhas convertidas em reais<br />
          <span className="c-display-500" style={{ color: 'var(--c-muted)' }}>de forma realista e séria.</span>
        </h1>
        <p style={{ color: 'var(--c-muted)', fontSize: 16, lineHeight: 1.65, maxWidth: 560 }}>
          Fuja de porcentagens de "descontos" inflados e planos complexos de assinatura de clubes.{' '}
          <strong style={{ color: 'var(--c-ink)' }}>Use o Custo por Mil (CPP) para calcular de forma definitiva se vale a pena comprar milhas na promoção ou emitir passagens aéreas com milhas contra a compra em dinheiro.</strong>{' '}
          A matemática pura das milhas, sob a ponta do lápis.
        </p>
      </div>

      <MilesCalculator />

      <div className="prose prose-sm prose-stone max-w-none space-y-6">
        <div>
          <h2 className="text-base font-semibold text-stone-700 dark:text-stone-300">O que é a metodologia do CPP (Custo por Mil)?</h2>
          <p className="text-stone-500 dark:text-stone-400 text-sm leading-relaxed mt-2">
            No mercado de programas de fidelidade, a métrica financeira definitiva é o **CPP (Cost Per Point ou Custo por Mil Milhas)**. Ele representa quanto custa cada lote de 1.000 pontos ou milhas. Essa unidade é o padrão comercial de liquidez de programas como Smiles (GOL), Latam Pass (LATAM) e TudoAzul (Azul). Saber o seu custo de milhas pessoal (ou a média do valor de mercado delas) permite comparar qualquer transação de milhas em bases justas de conversão com o Real.
          </p>
        </div>

        <div>
          <h2 className="text-base font-semibold text-stone-700 dark:text-stone-300">Milhas vs. Dinheiro: Quando emitir vale a pena?</h2>
          <p className="text-stone-500 dark:text-stone-400 text-sm leading-relaxed mt-2">
            Uma emissão com milhas só é financeiramente vantajosa se a **sua passagem valorizar as suas milhas acima do custo de aquisição**. 
            Para calcular isso, subtraia a taxa de embarque cobrada na emissão em milhas do preço total em dinheiro. Divida esse resultado pelo lote de milhas exigidas dividido por 1.000. Isso dará o CPP da passagem. Se o CPP da passagem (a taxa que o banco ou cia aérea está "comprando" suas milhas) for **maior** do que o seu custo real ou o valor de mercado delas, a emissão compensa. Caso contrário, compensa mais pagar em dinheiro e preservar as milhas para emissões melhores.
          </p>
        </div>

        <div>
          <h2 className="text-base font-semibold text-stone-700 dark:text-stone-300">Como funciona o "Desconto Fantasma" na compra de pontos?</h2>
          <p className="text-stone-500 dark:text-stone-400 text-sm leading-relaxed mt-2">
            Promoções de *"Compre pontos com 70% ou 80% de desconto"* são comumente veiculadas na mídia. No entanto, os programas fixam o preço base de tabela do milhar em R$ 70,00, um valor artificialmente alto que ninguém paga na prática. Mesmo com 70% de desconto, as milhas saem a R$ 21,00 por milhar. Dependendo do programa, esse valor ainda pode ser superior à média real de resgate comercial (como na Smiles, que comercialmente vale em torno de R$ 16,50). **A análise séria ignora a promessa de porcentagem e foca no valor real do milhar pago.**
          </p>
        </div>
      </div>

      {/* Bloco de anúncio discreto antes do rodapé de fontes */}
      <AdBanner slot="8765432109" format="horizontal" />

      <SourcesFooter sources={[
        { label: 'Associação Brasileira das Empresas de Fidelização (ABEMF) — Relatórios de mercado e resgate', url: 'https://www.abemf.com.br/' },
        { label: 'Anac — Relatório de Tarifas Aéreas Domésticas e de Práticas de Fidelidade', url: 'https://www.gov.br/anac/' },
        { label: 'Smiles, LATAM Pass e TudoAzul — Regulamentos de compra de pontos e regras de emissão de passagens', url: 'https://www.apontadolapis.com.br/' }
      ]} />
      
      <AppCTA context="sua simulação e conversão de milhas aéreas e passagens" />
    </div>
  )
}
