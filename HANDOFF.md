# Handoff — A Ponta do Lápis

**Última atualização:** 2026-05-25  
**Branch de desenvolvimento:** `claude/friendly-hypatia-HwfUk`  
**Stack:** Next.js 16.2.6 · React 19 · TypeScript · Tailwind CSS v4 · Vercel (deploy pendente)  
**Domínio registrado:** `apontadolapis.com.br`

---

## Estado atual

O projeto está completo e buildando sem erros. São **33 páginas estáticas** geradas, prontas para deploy.

---

## O que foi feito — sessões anteriores (2026-05-23 / 2026-05-24)

### Repaginação visual completa

Nova paleta extraída do logo (gradiente verde-floresta → teal → ciano):

| Token | Antes | Depois |
|---|---|---|
| `brand-paper` (fundo) | `#faf9f6` creme | `#EEF2F9` azul-acinzentado |
| `brand-pencil` (acento) | `#f2c94c` amarelo | `#00C4BE` ciano |
| `brand-graphite` (texto) | `#333333` cinza | `#172030` azul-escuro |
| `category-growth` | `#27ae60` | `#1A5E40` verde-floresta |
| `category-dream` | `#2d9cdb` azul | `#0A8A7E` teal |

Tipografia: `Cormorant Garamond` (serif editorial) + `Manrope` (sans-serif limpo).

### Calculadoras — base

- **Gastos com Apostas** — custo real, EV corrigido, comparativo com Selic
- **Probabilidades** — InfoTip por métrica, analogia dramática, links de ajuda para dependência (JA, CVV, CAPS AD)
- **Custo do Fumo** — modo cigarro + modo vape/pod (Elf Bar, Juul, líquido avulso)
- **Comparativo de Investimentos** — CDB, Tesouro, poupança, ações
- **Calculadora de Viagem** — câmbio + IOF, exportar .txt, limpar dados, editar extras inline
- **Dividir a Conta** — por item com atribuição por pessoa, edição/remoção inline, modo igualmente, copiar em Markdown

### Preços de passagens — atualização automática semanal

- `config/flight-prices.json` — dados de preços separados do código
- `scripts/update-prices.mjs` — busca Amadeus API para 21 destinos
- `.github/workflows/update-prices.yml` — cron toda segunda 8h BRT

**Para ativar:** developers.amadeus.com → criar app → adicionar `AMADEUS_CLIENT_ID` e `AMADEUS_CLIENT_SECRET` como secrets no GitHub Actions.

---

## O que foi feito — sessão atual (2026-05-28)

### 1. Comparador de Custo de Vida entre Cidades (`/viagens/custo-de-vida`)
*   **Banco de Dados Integrado (`config/cities-cost.ts`):** Cobertura geográfica de 100% do território nacional com paridade de preços normalizada (São Paulo = 100). Mapeia as 27 capitais, 12 polos econômicos regionais de grande porte e 26 regiões de "Interior" unificadas para representar os demais municípios menores por estado.
*   **Componente Interativo (`CostOfLivingCalculator.tsx`):** Entrada de custo mensal atual, seletor com botão swap e sliders dinâmicos de peso (Moradia e Alimentação com resíduo automático de Serviços somando 100%).
*   **Diferencial por Categoria:** Barras de decaimento de preços e métricas para tomada de decisão e arbitragem geográfica (trabalho remoto para capitais vivendo no interior).

### 2. Calculadora de Amortização de Financiamento SAC vs. Price (`/investimentos/amortizacao`)
*   **Mecanismo Matemático (`lib/calculations/amortization.ts`):** Projeção de financiamento SAC e Tabela Price amortizando aportes extraordinários (mensais adicionais) com opções de redução de prazo (quitação acelerada) ou redução de parcelas.
*   **Visualização Gráfica (`AmortizationCalculator.tsx`):** Gráfico Recharts de decaimento de saldo devedor comparando o contrato original vs. contrato acelerado (amostrado anualmente para excelente performance e visualização).
*   **Métricas de Juros Economizados:** ResultHero detalhando exatamente quantos juros e anos de boleto foram dizimados pela amortização extra.

### 3. Overhaul Artístico de Luxo dos Cartões de Compartilhamento (Share Cards)
*   **Identidade Premium Luminous Dark-Slate (`ShareCard.tsx` e `TravelShareCard.tsx`):** Conversão total do layout simplório claro para um modelo Black Premium de altíssimo luxo editorial:
    *   Fundo slate-navy escuro (`#1E2538`) e auras de iluminação neonatal radial glow baseadas na cor do tema (opacidades 12% e 8%).
    *   Fronteiras finas e discretas, cabeçalhos/rodapés em slate escuro (`#141A29`), indicador neon dot ativo e tipografia Inter ultra-bold de 64px para o valor principal.
    *   **Frosted-Glass Panels (Glassmorphism):** Blocos de métricas convertidos para panels de vidro translúcido (`rgba(255, 255, 255, 0.02)` com bordas sutis e reflexos internos).
*   **Propagação Global:** Atualiza automaticamente 10 calculadoras que usam `ShareCardBase`/`TravelShareCard`.
*   **Odds de Apostas (`OddsCalculator.tsx`):** Redesenho correspondente na calculadora de probabilidades esportivas, que possuía o cartão `OddsShareCard` customizado inline, aplicando auras na cor de risco coral-vermelho (`#ef4444`).

### 4. Padronização Global do Rodapé de Referências (`SourcesFooter`)
*   **Dividir a Conta (`/dividir`):** Adicionada menção de fontes à Lei da Gorjeta nº 13.419/2017 e Código de Defesa do Consumidor (Art. 39) sobre taxas facultativas.
*   **Probabilidades de Apostas (`/apostas/probabilidades`):** Substituição do rodapé manual pelo componente de fontes unificado, citando Valor Esperado, Teorema Central do Limite e o relatório sobre bets do Banco Central do Brasil.
*   **Branding Check:** Correção de typos legados trocando "Na Ponta" por "A Ponta do Lápis" nos metadados da página de probabilidades.

---

## O que foi feito — sessão anterior (2026-05-25)

### Rebrand: Na Ponta do Lápis → A Ponta do Lápis

Motivo: MEC lançou em novembro/2025 o programa federal "Na Ponta do Lápis" (educação financeira), colidindo com nome e nicho do site. Rebrand para evitar conflito de marca e SEO.

- Todas as ocorrências de "Na/na Ponta do Lápis" substituídas por "A/a Ponta do Lápis"
- Domínio `napontadolapis.com.br` estava tomado → registrado `apontadolapis.com.br`
- `metadataBase` atualizado em `app/layout.tsx`, `sitemap.ts`, `robots.ts`
- Watermarks dos share cards atualizadas (`apontadolapis.com.br`)
- SEO reorientado para keywords funcionais: "calculadora de apostas", "custo cigarro", "calculadora viagem câmbio IOF" etc.

### Nav melhorias

- "Dividir" → **"Dividir conta"** (label mais descritivo)
- Link dividir conta visível a partir de `sm` (antes só `md`)
- Ícones de lixeira (Trash2) e lápis (Pencil) do Lucide React no SplitBillCalculator

### SplitBillCalculator — separação visual

- Cards de resultado por pessoa agora têm header escuro (`#172030 → #1A2E3E`) com nome em branco e total em teal (`#00C4BE`), claramente diferentes da seção de itens (fundo claro)
- `SectionDivider` "O que cada um deve" separa as duas seções
- "Total geral" também usa header escuro para consistência

### SplitBillCalculator — onboarding e tooltips

- **Guia de 3 passos** contextual logo após o seletor de modo — atualiza quando o usuário troca entre "Por item" e "Igualmente"
- **Componente `Tip`** (botão `?` com bubble dark no hover/click):
  - "Quem está na conta?" → explica renomear e mínimo de 2 pessoas
  - "Gorjeta" → explica divisão proporcional ao consumo
  - "Valor total da conta" (modo igualmente) → instrução sobre incluir taxas
- **`title` nativo** nos PersonChips (estado toggle legível no hover) e label "Quem divide este item?"
- Subtítulo inline na seção "Adicionar item" orienta o fluxo em 2 etapas

---

## Próximos passos (por prioridade)

### 1. Deploy no Vercel — BLOQUEANTE para tudo abaixo

Ver checklist completo mais abaixo.

### 2. Wise — afiliado (configurar após deploy)

O usuário aderiu ao programa de afiliados da Wise via Partnerize (`join.partnerize.com/wise/en`).

**O que foi acordado nas regras:**
- Partner type a selecionar: **Content / Publisher**
- Ação comissionável: **transferência cross-currency** feita por novo usuário cadastrado via link
- Mínimo de pagamento: £20 · Cookie: 365 dias
- **Proibido:** pop-ups, toolbars, incentivos, retargeting, comprar keywords da marca Wise

**O que falta fazer no código:**
- Criar um componente `WiseCTA` discreto (sem popup, sem banner intrusivo) para exibir nas calculadoras de viagem e dividir conta
- Sugestão de posicionamento: após os resultados da calculadora de viagem, dentro do card escuro que já existe ao final
- Link deve conter o parâmetro de afiliado fornecido pelo Partnerize após aprovação
- **Não implementar antes de ter o link de afiliado aprovado**

### 3. Seguro-Desemprego — calculadora pendente

**URL planejada:** `/trabalho/seguro-desemprego`

**Pergunta em aberto:** a calculadora deve checar elegibilidade antes de calcular, ou assumir que a pessoa já tem direito?
- Opção A: **Só calcula** — assume demissão sem justa causa, foca no valor e parcelas
- Opção B: **Checa elegibilidade** — 3–4 perguntas rápidas antes
- Opção C: **As duas etapas** — mini-checklist + cálculo

**Lógica de cálculo (CLT geral — verificar tabela MTE atual antes de implementar):**
```
Até R$ 2.041,39          → 80% da média salarial
R$ 2.041,39 – R$ 3.402,35 → 80% da 1ª faixa + 50% do excedente
Acima de R$ 3.402,35     → teto fixo (~R$ 2.230 — verificar MTE)
```

**Parcelas:**
| Nº pedido | Meses trabalhados | Parcelas |
|---|---|---|
| 1º | 6–11 meses | 4 |
| 1º | 12–23 meses | 5 |
| 1º | 24+ meses | 5 |
| 2º | 6–11 meses | 3 |
| 2º | 12–23 meses | 4 |
| 2º | 24+ meses | 5 |
| 3º+ | 6–11 meses | 3 |
| 3º+ | 12–23 meses | 4 |
| 3º+ | 24+ meses | 5 |

Empregado doméstico e pescador artesanal têm regras próprias — verificar Portaria MTE vigente.  
Fonte: [empregabrasil.mte.gov.br](https://empregabrasil.mte.gov.br)

### 4. Rescisão trabalhista

`/trabalho/rescisao` — ~200k buscas/mês. Próxima prioridade após o seguro-desemprego.

### 5. Pensão alimentícia

Pausada — valor é definido por juiz, precisamos definir o framing antes de implementar.

### 6. Google AdSense

Solicitar aprovação assim que o site estiver no ar há algumas semanas com conteúdo indexado.

---

## Deploy — checklist completo

> **Domínio correto:** `apontadolapis.com.br` (registrado). Atualizar qualquer referência antiga a `napontadolapis.com.br`.

### 1. Conta e repositório
- [ ] Garantir que o repo `carlosferian/napontadolapis` está no GitHub com a branch principal atualizada

### 2. Importar no Vercel
- [ ] vercel.com → **"Add New Project"** → selecionar repo `napontadolapis`
- [ ] Framework: **Next.js** (detectado automaticamente)
- [ ] Clicar em **Deploy** — ~2 min
- [ ] Testar URL gerada (`napontadolapis.vercel.app`) no celular

### 3. Domínio customizado
- [ ] Vercel: Settings → Domains → adicionar `apontadolapis.com.br`
- [ ] No painel do registro.br: registro **A** (IP do Vercel) + **CNAME** (`www`)
- [ ] Aguardar propagação DNS (geralmente < 1h) e verificar HTTPS ativo

### 4. Ativar preços automáticos de passagens
- [ ] Criar conta em [developers.amadeus.com](https://developers.amadeus.com)
- [ ] Criar app → copiar Client ID e Client Secret
- [ ] GitHub: Settings → Secrets → Actions → `AMADEUS_CLIENT_ID` + `AMADEUS_CLIENT_SECRET`
- [ ] Testar: Actions → "Atualizar preços de passagens" → Run workflow

### 5. Google Search Console
- [ ] search.google.com/search-console → adicionar `apontadolapis.com.br`
- [ ] Verificar domínio via DNS
- [ ] Submeter sitemap: `https://apontadolapis.com.br/sitemap.xml`

### 6. Google Analytics 4
- [ ] analytics.google.com → criar propriedade → copiar Measurement ID (`G-XXXXXXXXXX`)
- [ ] Adicionar no `app/layout.tsx`:
```tsx
<script async src={`https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX`} />
<script dangerouslySetInnerHTML={{ __html: `
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-XXXXXXXXXX');
` }} />
```

### 7. AdSense (2–4 semanas para aprovação)
- [ ] adsense.google.com → criar conta → adicionar site `apontadolapis.com.br`
- [ ] Inserir snippet de verificação no `<head>`
- [ ] Aguardar aprovação → configurar ad units

> **Ordem real:** Vercel → Domínio → Search Console → GA4 → Amadeus → AdSense → Wise afiliado

---

## Taxas para manter atualizadas

`config/rates.ts`:
```typescript
selic: 0.1375,        // bcb.gov.br
cdi: 0.1375,          // = Selic
poupanca: 0.065,      // 70% da Selic quando Selic > 8,5%
tesouroDireto: 0.155,
lastUpdated: '2026-05'
```

`config/travel.ts` → `TRAVEL_CONFIG`:
```typescript
defaultUSDtoBRL: 5.75,  // câmbio padrão (usuário pode editar)
iofCreditCard: 0.0438,  // IOF — pode mudar por decreto
```

`config/flight-prices.json` → atualizado automaticamente toda segunda via GitHub Actions.  
Faixas do seguro-desemprego → atualizar em `lib/calculations/unemployment.ts` (a criar) a cada reajuste do salário mínimo.

---

## Estrutura de pastas atual

```
napontadolapis/
├── app/
│   ├── layout.tsx
│   ├── page.tsx
│   ├── apostas/
│   │   ├── page.tsx
│   │   └── probabilidades/page.tsx
│   ├── investimentos/
│   │   ├── page.tsx
│   │   ├── viver-de-renda/page.tsx
│   │   └── amortizacao/page.tsx          ← Novo! Amortização SAC vs Price
│   ├── fumo/page.tsx
│   ├── dividir/page.tsx
│   ├── trabalho/
│   │   ├── realidade-brasileira/page.tsx
│   │   ├── seguro-desemprego/page.tsx
│   │   └── rescisao/page.tsx
│   ├── viagens/
│   │   ├── page.tsx
│   │   ├── planejar/page.tsx
│   │   ├── custo-de-vida/page.tsx        ← Novo! Comparador de Custo de Vida
│   │   └── [destino]/page.tsx            ← 21 páginas SSG
│   ├── sitemap.ts
│   └── robots.ts
├── components/
│   ├── Nav.tsx
│   ├── calculators/
│   │   ├── BetsCalculator.tsx
│   │   ├── OddsCalculator.tsx
│   │   ├── InvestmentComparison.tsx
│   │   ├── SmokeCalculator.tsx
│   │   ├── TravelCalculator.tsx
│   │   ├── SplitBillCalculator.tsx
│   │   ├── BrazilianRealidadeCalculator.tsx
│   │   ├── UnemploymentCalculator.tsx
│   │   ├── RescissionCalculator.tsx
│   │   ├── IncomeCalculator.tsx
│   │   ├── CostOfLivingCalculator.tsx    ← Novo! Custo de vida UI
│   │   └── AmortizationCalculator.tsx    ← Novo! Amortização UI
│   ├── share/
│   │   ├── ShareCard.tsx                ← Upgradado para Black Luminous Mode!
│   │   └── TravelShareCard.tsx           ← Upgradado para Black Luminous Mode!
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
│   ├── travel.ts
│   ├── flight-prices.json
│   ├── realidade.ts
│   └── cities-cost.ts                    ← Novo! Banco de custos das cidades
├── scripts/
│   └── update-prices.mjs
├── .github/
│   └── workflows/
│       └── update-prices.yml
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
    │   └── amortization.ts               ← Novo! Engine matemática de amortização
    ├── formatters.ts
    ├── shareCard.ts
    └── contextualComments.ts
```

---

## Decisões de arquitetura

- **Vercel** — hospedagem (free tier, nativo Next.js)
- **html2canvas** — share cards (carregado dinamicamente, não afeta bundle)
- **Recharts** — gráfico de evolução da poupança
- Todas calculadoras são **100% client-side** — sem APIs externas, sem custo de servidor
- `params` em rotas dinâmicas como `Promise<>` (padrão Next.js 15+)
- Preços de passagens em JSON separado para permitir atualização automática sem tocar TypeScript
