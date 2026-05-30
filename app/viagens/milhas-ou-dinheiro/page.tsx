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
          <h2 className="text-base font-semibold text-stone-700 dark:text-stone-300">Você não precisa calcular nada na mão</h2>
          <p className="text-stone-500 dark:text-stone-400 text-sm leading-relaxed mt-2">
            A matemática por trás dos programas de fidelidade envolve taxas, conversões de pontos e custos de oportunidade que costumam exigir planilhas complexas ou contas exaustivas de cabeça. <strong>Nossa calculadora foi desenvolvida especificamente para assumir 100% desse esforço por você.</strong> Esqueça papel e caneta: os algoritmos integrados nas abas acima processam e cruzam todas as variáveis financeiras de forma instantânea para entregar um veredito limpo, direto e puramente matemático.
          </p>
        </div>

        <div>
          <h2 className="text-base font-semibold text-stone-700 dark:text-stone-300">Milhas vs. Dinheiro: Como nosso algoritmo calcula por você?</h2>
          <p className="text-stone-500 dark:text-stone-400 text-sm leading-relaxed mt-2">
            Quando você arrasta os controles ou seleciona o seu programa de fidelidade na aba <strong>✈️ Milhas vs. Dinheiro</strong>, nosso motor de cálculo executa a seguinte lógica em milissegundos:
          </p>
          <ul className="text-stone-500 dark:text-stone-400 text-sm list-disc pl-5 space-y-2 mt-2">
            <li><strong>Isolamento da Taxa de Embarque:</strong> O sistema subtrai a taxa de embarque em dinheiro do preço da passagem comercial. Isso garante que o cálculo meça apenas a conversão do voo em si, sem distorções.</li>
            <li><strong>Descoberta do CPP da Passagem:</strong> Ele divide a diferença líquida de preço em dinheiro pela quantidade de milhares de milhas necessárias. O resultado é o <strong>CPP da Passagem</strong>, ou seja, o valor que o programa está de fato pagando pelos seus pontos nesta emissão específica.</li>
            <li><strong>Veredito Inteligente:</strong> Por fim, ele compara o CPP da Passagem com o custo de mercado ou de aquisição dos seus pontos (definidos nas médias comerciais ou no controle customizado). Se a passagem "pagar" mais pelo milhar do que o custo para obtê-lo, o sistema aprova a emissão e calcula o seu lucro financeiro líquido. Se for menor, ele avisa na hora para você guardar os pontos e pagar em dinheiro.</li>
          </ul>
        </div>

        <div>
          <h2 className="text-base font-semibold text-stone-700 dark:text-stone-300">Promoções de Compra: Como o sistema identifica o "Desconto Fantasma"?</h2>
          <p className="text-stone-500 dark:text-stone-400 text-sm leading-relaxed mt-2">
            No mercado brasileiro, bancos e operadoras adoram anunciar promoções bombásticas com <em>"até 80% de desconto"</em> para induzir compras impulsivas. No entanto, o preço base de tabela é inflado. Na aba <strong>🪙 Comprar Milhas (Promoção)</strong>, nosso sistema remove a maquiagem publicitária: ele divide o custo real exigido pela quantidade total de pontos que cairão na sua conta. Esse CPP promocional é comparado em tempo real com o valor de resgate comercial estável de mercado do respectivo programa (como Smiles a R$ 16,50 ou LATAM a R$ 17,50). Se a compra for vantajosa, o sistema indica "Lucrativo"; se for uma armadilha inflada, ele emite um alerta vermelho imediato.
          </p>
        </div>

        <div>
          <h2 className="text-base font-semibold text-stone-700 dark:text-stone-300">Onde buscar as informações para alimentar a calculadora?</h2>
          <p className="text-stone-500 dark:text-stone-400 text-sm leading-relaxed mt-2">
            Para que nossa ferramenta faça o trabalho pesado e te dê a resposta ideal, você só precisa coletar de 3 a 4 dados rápidos nos canais oficiais de fidelidade e informá-los nos sliders da calculadora:
          </p>
          <div className="space-y-3 mt-3 bg-stone-500/5 p-4 rounded-xl border" style={{ borderColor: 'var(--c-line)' }}>
            <div className="text-xs">
              <p className="font-bold text-stone-700 dark:text-stone-200">1. Para simular uma emissão de passagem (Aba 1)</p>
              <p className="text-stone-500 dark:text-stone-400 mt-1">
                Faça uma simulação rápida de pesquisa de passagem no site da companhia aérea (ex: Smiles, Latam Pass, Azul). Anote e insira na calculadora: (a) o preço total da passagem em dinheiro, (b) as milhas exigidas para o trecho, (c) o valor de taxas de embarque do resgate e (d) selecione o programa para carregar o seu custo estimado.
              </p>
            </div>
            
            <div className="text-xs border-t pt-2.5" style={{ borderColor: 'var(--c-line)' }}>
              <p className="font-bold text-stone-700 dark:text-stone-200">2. Para simular uma oferta de compra de pontos (Aba 2)</p>
              <p className="text-stone-500 dark:text-stone-400 mt-1">
                No portal do banco ou operadora que está ofertando os pontos (ex: Livelo, Smiles), anote e insira na calculadora: (a) o valor total cobrado em dinheiro para assinar a promoção ou comprar o lote, (b) a quantidade total de pontos que você vai receber e (c) o programa de fidelidade correspondente para saber se há liquidez vantajosa de mercado.
              </p>
            </div>

            <div className="text-xs border-t pt-2.5" style={{ borderColor: 'var(--c-line)' }}>
              <p className="font-bold text-stone-700 dark:text-stone-200">3. Caso queira usar o seu custo real personalizado</p>
              <p className="text-stone-500 dark:text-stone-400 mt-1">
                Se você assina clubes ou comprou pontos em lotes conhecidos e sabe exatamente quanto pagou por cada 1.000 pontos (ex: R$ 42,00 por milhar na Livelo), escolha a opção <strong>"Outro / Valor Customizado"</strong> e ajuste o controle deslizante do CPP de origem para seu custo real. A calculadora recalculará instantaneamente todos os cenários com base na sua realidade individual.
              </p>
            </div>
          </div>
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
