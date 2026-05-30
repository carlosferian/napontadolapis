# Handoff — A Ponta do Lápis

**Última atualização:** 2026-05-29  
**Branch de desenvolvimento:** `claude/friendly-hypatia-HwfUk`  
**Stack:** Next.js 16.2.6 · React 19 · TypeScript · Tailwind CSS v4 · Netlify (deploy contínuo ativo)  
**Domínio registrado:** `apontadolapis.com.br`

---

## Estado atual

O projeto está completo e compilando sem erros. Foram geradas **42 páginas estáticas** com sucesso no Next.js (prontas para deploy e indexação pelo Google).

Toda a arquitetura do site foi atualizada com sucesso para rodar de forma **100% independente, autônoma e com custo zero vitalício**, eliminando qualquer dependência de chaves de API externas de terceiros instáveis de aviação (Amadeus/Kiwi.com), o que garante imunidade contra o encerramento do portal Amadeus em julho de 2026.

---

## O que foi feito — Sessão Atual (2026-05-29)

### 1. Correção de Contraste e Rótulos no `/realidade-brasileira`
*   **Visibilidade Unificada no Modo Claro:** Ajustamos o primeiro card de métricas (que exibe o estado ou polo selecionado). Removemos a classe explícita `text-stone-900 dark:text-stone-100` para permitir que o valor herde nativamente a variável de tema `--c-ink` (que muda dinamicamente de `#0F1110` no modo claro para `#F1EFE8` no modo escuro). Isso corrigiu e normalizou o contraste para o estado do Paraná (PR) e todas as outras opções de estados e polos.

### 2. Integração de Curitiba (PR) como Destino de Viagem
*   **Planejador de Viagens (`config/travel.ts`):** Adicionamos Curitiba como destino nacional sob a região `'brasil'` com todas as suas informações padrão (voo de GRU estimado entre R$ 250 e R$ 500, orçamentos diários de viagem por estilo de vida, média de 4 dias e destaques como Jardim Botânico e Ópera de Arame). 
*   **Tabela de Preços (`config/flight-prices.json`):** Adicionamos as tarifas de voo de baseline de R$ 250 a R$ 500 para a capital curitibana. A nova página dinâmica `/viagens/curitiba` foi gerada e testada com sucesso absoluto no build.

### 3. Transição para Arquitetura Independente e Offline
*   **Remoção de Cron e Scripts de Terceiros:** Diante da descontinuação confirmada do portal Amadeus Self-Service para julho de 2026 e do bloqueio de novos registros de desenvolvedores na Kiwi.com Tequila, convertemos o site para um modelo 100% autônomo.
*   **Limpeza de Código:** Removemos o workflow do GitHub Actions (`.github/workflows/update-prices.yml`) e o script NodeJS de integração com a Amadeus (`scripts/update-prices.mjs`). 
*   **Resultado:** O site consome com exclusividade o banco de dados estável local `flight-prices.json`. O site é agora imune a falhas de APIs externas, tem custo de requisições de servidores igual a zero e o deploy é ultra-rápido. A atualização média das passagens pode ser feita de forma manual e estável em 3 minutos a cada 6 meses, alterando diretamente o JSON local.

### 4. Suporte a Polos Econômicos Regionais no Realidade BR
*   **Expansão Geográfica (`config/realidade.ts`):** Incluímos polos econômicos de grande relevância nacional no `REALIDADE_STATES` (como Campinas, Londrina, Maringá, Joinville, Uberlândia, Juiz de Fora, Santos, Caxias do Sul, etc.). As cestas básicas dos polos foram estimadas de forma proporcional com base nos índices de alimentação de nosso banco de custos de cidades.
*   **Layout Premium `<optgroup>`:** O dropdown de seleção de localidade no simulador de realidade brasileira foi estruturado de forma visualmente rica e organizada por grupos (Nacional, Estados e Polos Regionais).
*   **Formatação Dinâmica de Cards:** Quando um polo é selecionado, os cards de métricas e os cards de compartilhamento (Share Cards) adaptam-se de forma inteligente (exibindo `No polo: Londrina` e `No polo de Londrina` em vez de siglas genéricas, e mostrando `Cesta em Londrina: R$ 716`).

### 5. Migração de Infraestrutura comercial para o Netlify
*   **Plano Starter Comercial do Netlify:** Conectamos o repositório no Netlify, ativando a esteira de Continuous Deployment automática baseada em pushes na branch `claude/friendly-hypatia-HwfUk`. Como o plano do Netlify Starter permite uso comercial gratuito de forma 100% legalizada, o site está livre de infração de termos de serviço de uso não comercial ao ativar anúncios ou parceiros.
*   **Delegação DNS do Netlify:** Iniciamos a migração de DNS do site adicionando os servidores de nome (`dns1.p04.nsone.net`, etc.) como provedores padrão no painel de controle do registrador do domínio (`apontadolapis.com.br`).

### 6. Estruturação de Anúncios Discretos e Premium (Google AdSense)
*   **Tag de Anúncio Global (`app/layout.tsx`):** Integramos a tag global do AdSense usando o componente `<Script>` do Next.js e vinculando de forma dinâmica ao client ID do ambiente (`process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID`).
*   **Componente Modular `AdBanner` (`components/AdBanner.tsx`):** Criamos um componente de anúncio display horizontal responsivo e discreto que respeita a identidade de luxo do site. 
    *   *Modo Dev:* Exibe uma caixa pontilhada de placeholder discreta identificada como "Espaço Publicitário" para visualização espacial do layout.
    *   *Modo Prod:* Se o ID do AdSense não estiver ativo nas variáveis de ambiente do Netlify, o componente retorna `null` e não exibe nenhuma caixa de erro ou espaço vazio para o usuário final.
*   **Integração Inicial:** Inserimos o componente `AdBanner` discretamente ao final das calculadoras de **Realidade Brasileira** (`/trabalho/realidade-brasileira`) e **Custo de Vida** (`/viagens/custo-de-vida`), logo acima do rodapé de fontes.

---

## Próximos passos (Amanhã e próximas sessões)

### 1. Validação do Netlify DNS e SSL (PENDENTE - INFRAESTRUTURA)
*   **Ação:** Acompanhar e certificar que a propagação dos novos Nameservers do Netlify (`dns1.p04.nsone.net`, etc.) cadastrados no Registro.br foi finalizada globalmente.
*   **Validação:** Testar o acesso do site no domínio próprio `apontadolapis.com.br` e certificar que o certificado de segurança SSL gratuito (HTTPS) foi emitido e ativado no painel do Netlify.

### 2. Cadastro no Google AdSense (PENDENTE - COMERCIAL)
*   **Timing Crítico:** **Aguardar de 24h a 48h** após a propagação do DNS para realizar a inscrição no Google AdSense. Isso garante que o robô do Google encontre o site online de forma estável no novo servidor do Netlify e evita qualquer reprovação automática por inacessibilidade de site.
*   **Inscrição:** Acessar o [Google AdSense](https://adsense.google.com/), cadastrar `apontadolapis.com.br`, obter a ID de anunciante (`ca-pub-XXXXXXXXXXXXXXXX`) e submeter para análise.

### 3. Configuração de Variáveis de Ambiente no Netlify (PENDENTE - CONFIGURAÇÃO)
Assim que o DNS propagar e as IDs do Google forem geradas, cadastre as seguintes variáveis de ambiente no painel do Netlify em **Site configuration** > **Environment variables**:
*   `NEXT_PUBLIC_GA_ID` ➡️ `G-XXXXXXXXXX` (ID do Google Analytics 4 para medição de tráfego) — *Criar como Standard/Variable*.
*   `NEXT_PUBLIC_ADSENSE_CLIENT_ID` ➡️ `ca-pub-XXXXXXXXXXXXXXXX` (ID do AdSense para ativação de propagandas) — *Criar como Standard/Variable*.

### 4. Substituição das IDs de Slots de Anúncios (PENDENTE - CÓDIGO)
*   Após a aprovação formal do AdSense pelo Google (geralmente de 2 a 14 dias), acesse a sua conta, crie os blocos de anúncio horizontais responsivos de display, copie os códigos de `slot` fornecidos pelo AdSense e atualizar os códigos de `slot` fictícios do componente `AdBanner` nas duas calculadoras:
    *   `app/trabalho/realidade-brasileira/page.tsx`
    *   `app/viagens/custo-de-vida/page.tsx`

---

## Estrutura de pastas atual

```
napontadolapis/
├── .github/
│   └── workflows/
│       └── (removido update-prices.yml)
├── app/
│   ├── layout.tsx                        ← GA4 + AdSense global script tags
│   ├── page.tsx
│   ├── apostas/
│   │   ├── page.tsx
│   │   └── probabilidades/page.tsx       ← Bold JSX tags para Bacen & SBVC
│   ├── investimentos/
│   │   ├── page.tsx
│   │   ├── viver-de-renda/page.tsx
│   │   └── amortizacao/page.tsx
│   ├── fumo/page.tsx
│   ├── dividir/page.tsx
│   ├── trabalho/
│   │   ├── realidade-brasileira/page.tsx  ← AdBanner integrado no final
│   │   ├── seguro-desemprego/page.tsx
│   │   └── rescisao/page.tsx
│   ├── viagens/
│   │   ├── page.tsx
│   │   ├── planejar/page.tsx
│   │   ├── custo-de-vida/page.tsx        ← AdBanner integrado no final
│   │   └── [destino]/page.tsx            ← 22 destinos (Curitiba integrada!)
│   ├── sitemap.ts
│   └── robots.ts
├── components/
│   ├── Nav.tsx                           ← Intent delay (150ms) no hover
│   ├── AdBanner.tsx                      ← Novo! Componente modular do AdSense
│   ├── calculators/
│   │   ├── BetsCalculator.tsx
│   │   ├── OddsCalculator.tsx
│   │   ├── InvestmentComparison.tsx
│   │   ├── SmokeCalculator.tsx
│   │   ├── TravelCalculator.tsx
│   │   ├── SplitBillCalculator.tsx
│   │   ├── BrazilianRealidadeCalculator.tsx ← Suporte a Polos Regionais + optgroups
│   │   ├── UnemploymentCalculator.tsx
│   │   ├── RescissionCalculator.tsx
│   │   ├── IncomeCalculator.tsx
│   │   ├── CostOfLivingCalculator.tsx
│   │   └── AmortizationCalculator.tsx
│   ├── share/
│   │   ├── ShareCard.tsx
│   │   └── TravelShareCard.tsx
│   └── ui/
│       ├── CalculatorCard.tsx
│       ├── ResultHero.tsx
│       ├── MetricCard.tsx
│       ├── MetricGrid.tsx
│       ├── SliderField.tsx
│       ├── ComparisonList.tsx
│       ├── ShareButtons.tsx
│       ├── SavingsChart.tsx
│       ├── ScaledPreview.tsx
│       ├── SectionDivider.tsx
│       └── SourcesFooter.tsx
├── config/
│   ├── rates.ts
│   ├── travel.ts                         ← Curitiba adicionada como destino!
│   ├── flight-prices.json                ← Curitiba baseline adicionado!
│   ├── realidade.ts                      ← Cidades polos regionais + grupos cadastrados!
│   └── cities-cost.ts
├── public/
│   └── logo.png
└── lib/
    ├── calculations/
    │   ├── compound.ts
    │   ├── probability.ts
    │   ├── travel.ts
    │   ├── savings.ts
    │   ├── income.ts
    │   ├── rescission.ts
    │   ├── unemployment.ts
    │   └── amortization.ts
    ├── formatters.ts
    ├── shareCard.ts
    └── contextualComments.ts
```
