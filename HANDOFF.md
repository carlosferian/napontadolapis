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

## O que foi feito — sessão atual (2026-05-25)

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
│   ├── apostas/page.tsx
│   ├── apostas/probabilidades/page.tsx
│   ├── investimentos/page.tsx
│   ├── fumo/page.tsx
│   ├── dividir/page.tsx
│   ├── viagens/
│   │   ├── page.tsx
│   │   ├── planejar/page.tsx
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
│   │   └── SplitBillCalculator.tsx
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
│       └── SectionDivider.tsx
├── config/
│   ├── rates.ts
│   ├── travel.ts
│   └── flight-prices.json               ← atualizado via GitHub Actions
├── scripts/
│   └── update-prices.mjs
├── .github/
│   └── workflows/
│       └── update-prices.yml            ← cron toda segunda 8h BRT
├── public/
│   └── logo.png
└── lib/
    ├── calculations/
    │   ├── compound.ts
    │   ├── probability.ts
    │   ├── travel.ts
    │   └── savings.ts
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
