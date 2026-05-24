# Handoff — Na Ponta do Lápis

**Última atualização:** 2026-05-24  
**Branch de desenvolvimento:** `claude/friendly-hypatia-HwfUk`  
**Stack:** Next.js 16.2.6 · React 19 · TypeScript · Tailwind CSS v4 · Vercel (deploy pendente)

---

## Estado atual

O projeto está completo e buildando sem erros. São **33 páginas estáticas** geradas, prontas para deploy.

---

## O que foi feito nesta sessão (2026-05-23 / 2026-05-24)

### 1. Repaginação visual completa

Nova paleta extraída do logo (gradiente verde-floresta → teal → ciano):

| Token | Antes | Depois |
|---|---|---|
| `brand-paper` (fundo) | `#faf9f6` creme | `#EEF2F9` azul-acinzentado |
| `brand-pencil` (acento) | `#f2c94c` amarelo | `#00C4BE` ciano |
| `brand-graphite` (texto) | `#333333` cinza | `#172030` azul-escuro |
| `category-growth` | `#27ae60` | `#1A5E40` verde-floresta |
| `category-dream` | `#2d9cdb` azul | `#0A8A7E` teal |

Tipografia trocada:
- `Playfair Display` → **Cormorant Garamond** (mais editorial, menos genérica)
- `DM Sans` → **Manrope** (mais limpa, não é Inter)
- `Caveat` (manuscrito) → **removida**; itálico do Cormorant substitui

Outros:
- Grid de fundo do body removido
- Logo.png copiado para `/public/` e exibido via `<Image>` no Nav e footer
- Todos os emojis das calculadoras substituídos por ícones **Lucide React**

### 2. Calculadora de investimentos — foco em ganho/perda

- Hero card mostra `+ganho` vs `−perda das apostas` side-by-side
- Cada linha: rendimento/prejuízo é o número grande; total acumulado virou dado secundário em cinza
- "Devolveu apenas R$ X" para apostas — destaca o que foi queimado

### 3. Calculadora de probabilidades — humanizada + bug corrigido

**Bug corrigido:** `probability.ts` usava `p = 1/odd` como probabilidade verdadeira, cancelando toda margem e retornando sempre 0% de perda e 50% de chance de lucro. Fix: usa `TRUE_PROB = 0.5` (evento 50/50) consistentemente.

Resultado com odd 1.9, R$ 50:
- Antes: perda R$ 0, chance de lucro 50% em qualquer N
- Depois: perda R$ 3/aposta, chance de lucro cai de 43% (10 apostas) → **4,8%** (1.000 apostas)

**UX humanizada:**
- Seleção de odd oculta por padrão — disparada por hover/click em texto descritivo com chevron
- Painel revela: explicação em português simples, impacto concreto, guia de direção (favorito ↔ zebra)
- 3 referências reais linkadas no rodapé: Wikipedia Valor Esperado, Wikipedia Teorema Central do Limite, BCB Apostas Esportivas

### 4. Preços de passagens — atualização automática semanal

- `config/flight-prices.json` — dados de preços separados do código TypeScript
- `config/travel.ts` — faz merge: preços do JSON sobrepõem os hardcoded (fallback automático)
- `scripts/update-prices.mjs` — busca preços via Amadeus API para 21 destinos (60/90/120 dias à frente, usa mínimo e mediana)
- `.github/workflows/update-prices.yml` — cron toda segunda-feira às 8h BRT → commita se houver mudança → Vercel redeploya

**Para ativar:** criar conta gratuita em developers.amadeus.com → adicionar `AMADEUS_CLIENT_ID` e `AMADEUS_CLIENT_SECRET` como secrets no GitHub (Settings → Secrets → Actions).

---

## Próxima calculadora em brainstorming: Seguro-Desemprego

**URL planejada:** `/trabalho/seguro-desemprego`  
**Status:** brainstorming iniciado, pausado para retomar

### Decisões já tomadas

| Pergunta | Resposta |
|---|---|
| Quem usa? | Quem foi demitido (para calcular) e quem quer conferir o valor recebido |
| Tipos de trabalhador | **Todos:** CLT geral, doméstico, pescador artesanal, formal com bolsa qualificação |
| Checa elegibilidade? | **Não decidido** — próxima pergunta a responder ao retomar |

### Próxima pergunta a responder ao retomar

> A calculadora deve checar se a pessoa tem direito antes de calcular, ou assume que ela já é elegível?
> - **Só calcula** — assume demissão sem justa causa, foca no valor e parcelas
> - **Checa elegibilidade primeiro** — pergunta tipo de demissão, se já recebeu antes, etc.
> - **As duas etapas** — mini-checklist de elegibilidade (3–4 perguntas) e depois o cálculo

### Lógica de cálculo (referência para implementação)

**Faixas de cálculo (CLT geral — atualizar anualmente com salário mínimo):**
```
Até R$ 2.041,39     → 80% da média salarial
R$ 2.041,39 – R$ 3.402,35 → 80% da 1ª faixa + 50% do excedente
Acima de R$ 3.402,35 → valor fixo teto (~R$ 2.230 — verificar tabela MTE atual)
```

**Número de parcelas:**
| Pedido | Meses trabalhados (últimos 36 meses) | Parcelas |
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

**Empregado doméstico:** parcelas e faixas ligeiramente diferentes — verificar Portaria MTE vigente.  
**Pescador artesanal:** período de defeso (fixo, não baseado em salário).  
**Trabalhador formal com bolsa qualificação:** regras especiais de suspensão do contrato.

**Fonte oficial:** [empregabrasil.mte.gov.br](https://empregabrasil.mte.gov.br) — verificar tabela atualizada antes de implementar.

---

## Próximos passos (por prioridade)

1. **Retomar brainstorming** do seguro-desemprego → responder a pergunta de elegibilidade → spec → plano → implementar
2. **Deploy no Vercel** (ver checklist abaixo)
3. **Rescisão trabalhista** `/trabalho/rescisao` — 200k buscas/mês, maior prioridade depois do SD
4. **Pensão alimentícia** — pausada (valor definido por juiz, precisamos definir framing antes)

---

## Deploy — checklist completo

### 1. Conta e repositório
- [ ] Criar conta em vercel.com (pode usar login do GitHub)
- [ ] Garantir que o repo `carlosferian/napontadolapis` está no GitHub com a branch principal atualizada

### 2. Importar no Vercel
- [ ] Clicar em **"Add New Project"** → selecionar repo `napontadolapis`
- [ ] Framework: **Next.js** (detectado automaticamente — não alterar nada)
- [ ] Clicar em **Deploy** — primeiro deploy leva ~2 min
- [ ] Testar URL gerada (`napontadolapis.vercel.app`) no celular

### 3. Domínio customizado
- [ ] Registrar `napontadolapis.com.br` no registro.br (~R$ 40/ano)
- [ ] Vercel: Settings → Domains → adicionar o domínio
- [ ] Configurar no registro.br: registro **A** (IP do Vercel) + **CNAME** (www)
- [ ] Aguardar propagação DNS (geralmente < 1h) e verificar HTTPS ativo

### 4. Ativar preços automáticos de passagens
- [ ] Criar conta em [developers.amadeus.com](https://developers.amadeus.com)
- [ ] Criar app em "My Self-Service Workspace" → copiar Client ID e Client Secret
- [ ] GitHub: Settings → Secrets → Actions → adicionar `AMADEUS_CLIENT_ID` e `AMADEUS_CLIENT_SECRET`
- [ ] Testar manualmente: Actions → "Atualizar preços de passagens" → Run workflow

### 5. Google Search Console
- [ ] search.google.com/search-console → adicionar propriedade `napontadolapis.com.br`
- [ ] Verificar domínio via DNS
- [ ] Submeter sitemap: `https://napontadolapis.com.br/sitemap.xml`

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
- [ ] adsense.google.com → criar conta → adicionar site → inserir snippet de verificação no `<head>`
- [ ] Aguardar aprovação → configurar ad units

> **Ordem real:** Vercel → Domínio → Search Console → GA4 → Amadeus → AdSense

---

## Taxas para manter atualizadas

`config/rates.ts`:
```typescript
selic: 0.1375,       // bcb.gov.br
cdi: 0.1375,         // = Selic
poupanca: 0.065,     // 70% da Selic quando Selic > 8,5%
tesouroDireto: 0.155,
lastUpdated: '2026-05'
```

`config/travel.ts` → `TRAVEL_CONFIG`:
```typescript
defaultUSDtoBRL: 5.75,  // câmbio padrão (usuário pode editar)
iofCreditCard: 0.0438,  // IOF — pode mudar por decreto
```

`config/flight-prices.json` → atualizado automaticamente toda segunda via GitHub Actions.  
Faixas do seguro-desemprego → atualizar manualmente em `lib/calculations/unemployment.ts` (a criar) a cada reajuste do salário mínimo.

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
│   │   └── TravelCalculator.tsx
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
│       └── SectionDivider.tsx
├── config/
│   ├── rates.ts
│   ├── travel.ts
│   └── flight-prices.json               ← atualizado via GitHub Actions
├── scripts/
│   └── update-prices.mjs                ← busca Amadeus API
├── .github/
│   └── workflows/
│       └── update-prices.yml            ← cron toda segunda 8h BRT
├── public/
│   └── logo.png
└── lib/
    ├── calculations/
    │   ├── compound.ts
    │   ├── probability.ts               ← bug EV corrigido nesta sessão
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
- Preços de passagens em JSON separado para permitir atualização automática sem tocar no TypeScript
