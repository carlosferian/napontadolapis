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
            No mercado de programas de fidelidade, a métrica financeira definitiva é o <strong>CPP (Cost Per Point ou Custo por Mil Milhas)</strong>. Ele representa quanto custa cada lote de 1.000 pontos ou milhas. Essa unidade é o padrão comercial de liquidez de programas como Smiles (GOL), Latam Pass (LATAM) e TudoAzul (Azul). Saber o seu custo de milhas pessoal (ou a média do valor de mercado delas) permite comparar qualquer transação de milhas em bases justas de conversão com o Real.
          </p>
        </div>

        <div>
          <h2 className="text-base font-semibold text-stone-700 dark:text-stone-300">Milhas vs. Dinheiro: Quando emitir vale a pena?</h2>
          <p className="text-stone-500 dark:text-stone-400 text-sm leading-relaxed mt-2">
            Uma emissão com milhas só é financeiramente vantajosa se a <strong>sua passagem valorizar as suas milhas acima do custo de aquisição</strong>. 
            Para calcular isso, subtraia a taxa de embarque cobrada na emissão em milhas do preço total em dinheiro. Divida esse resultado pelo lote de milhas exigidas dividido por 1.000. Isso dará o CPP da passagem. Se o CPP da passagem (a taxa que o banco ou cia aérea está "comprando" suas milhas) for <strong>maior</strong> do que o seu custo real ou o valor de mercado delas, a emissão compensa. Caso contrário, compensa mais pagar em dinheiro e preservar as milhas para emissões melhores.
          </p>
        </div>

        <div>
          <h2 className="text-base font-semibold text-stone-700 dark:text-stone-300">Como o site estima os valores de referência dos programas?</h2>
          <p className="text-stone-500 dark:text-stone-400 text-sm leading-relaxed mt-2">
            Nossos valores de referência para cada programa são baseados nas cotações médias de liquidez comercial do mercado secundário de milhas aéreas e no custo real de resgates de passagens no Brasil hoje:
          </p>
          <ul className="text-stone-500 dark:text-stone-400 text-sm list-disc pl-5 space-y-1 mt-1">
            <li><strong>TudoAzul: R$ 14,00 por mil</strong> — Programa com a menor liquidez direta de mercado, mas com boa malha doméstica nacional.</li>
            <li><strong>Smiles: R$ 16,50 por mil</strong> — O milhar médio histórico de maior estabilidade do mercado para voos da GOL e parceiras.</li>
            <li><strong>LATAM Pass: R$ 17,50 por mil</strong> — Valorizado pelas emissões internacionais e resgates mais seletivos da LATAM.</li>
            <li><strong>Livelo & Esfera: R$ 35,00 por mil</strong> — Por serem pontos de bancos e altamente flexíveis, seu valor é maior pois costumam ser transferidos para as companhias aéreas com <strong>promoções de bônus de 100%</strong>. Com isso, 10.000 pontos Livelo de R$ 35,00 viram 20.000 milhas Smiles, mantendo a equivalência matemática de R$ 17,50 por milha final na cia aérea.</li>
          </ul>
        </div>

        <div>
          <h2 className="text-base font-semibold text-stone-700 dark:text-stone-300">Guia Prático: Como descobrir o seu CPP de milhas pessoal?</h2>
          <p className="text-stone-500 dark:text-stone-400 text-sm leading-relaxed mt-2">
            Se você não deseja utilizar a média automática recomendada de mercado pelo site, você pode calcular o seu CPP pessoal de acordo com a origem das suas milhas para preencher a calculadora de forma cirúrgica:
          </p>
          <div className="space-y-3.5 mt-2 bg-stone-500/5 p-4 rounded-xl border" style={{ borderColor: 'var(--c-line)' }}>
            <div className="text-xs">
              <p className="font-bold text-stone-700 dark:text-stone-200">Cenário A: Pontos Orgânicos (De Graça no Cartão)</p>
              <p className="text-stone-500 dark:text-stone-400 mt-1">
                Se você acumulou seus pontos unicamente gastando no cartão de crédito do seu banco no dia a dia, <strong>o seu custo real de aquisição é R$ 0,00</strong>. No entanto, para fins de simulação inteligente, recomendamos usar a média de mercado do site (ex: R$ 16,50), pois esses pontos poderiam ser usados em outras passagens lucrativas e possuem "custo de oportunidade".
              </p>
            </div>
            
            <div className="text-xs border-t pt-2.5" style={{ borderColor: 'var(--c-line)' }}>
              <p className="font-bold text-stone-700 dark:text-stone-200">Cenário B: Clubes de Pontos Assinados</p>
              <p className="text-stone-500 dark:text-stone-400 mt-1">
                Se você assina clubes (ex: Clube Smiles ou Livelo), divida o valor da assinatura mensal pela quantidade de pontos recebidos na mensalidade. Exemplo: pagar R$ 42,00 por mês por 1.000 pontos no Clube Livelo significa que seu <strong>CPP de origem é R$ 42,00 por mil</strong>.
              </p>
            </div>

            <div className="text-xs border-t pt-2.5" style={{ borderColor: 'var(--c-line)' }}>
              <p className="font-bold text-stone-700 dark:text-stone-200">Cenário C: Transferência Bonificada (O Multiplicador)</p>
              <p className="text-stone-500 dark:text-stone-400 mt-1">
                Quando você transfere pontos de bancos com bônus, o seu CPP de destino cai proporcionalmente. Exemplo: você tem 10.000 pontos Livelo que custaram R$ 42,00 por mil (Total de R$ 420,00) e os transfere para a Smiles em uma promoção de **100% de bônus**. Você receberá 20.000 milhas Smiles. 
                Cálculo final: R$ 420,00 / 20 = <strong>seu CPP Smiles pessoal é R$ 21,00 por mil</strong>. Esse é o número exato que você deve informar na calculadora.
              </p>
            </div>
          </div>
        </div>

        <div>
          <h2 className="text-base font-semibold text-stone-700 dark:text-stone-300">Como funciona o "Desconto Fantasma" na compra de pontos?</h2>
          <p className="text-stone-500 dark:text-stone-400 text-sm leading-relaxed mt-2">
            Promoções de <em>"Compre pontos com 70% ou 80% de desconto"</em> são comumente veiculadas na mídia. No entanto, os programas fixam o preço base de tabela do milhar em R$ 70,00, um valor artificialmente alto que ninguém paga na prática. Mesmo com 70% de desconto, as milhas saem a R$ 21,00 por milhar. Dependendo do programa, esse valor ainda pode ser superior à média real de resgate comercial (como na Smiles, que comercialmente vale em torno de R$ 16,50). <strong>A análise séria ignora a promessa de porcentagem e foca no valor real do milhar pago.</strong>
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
