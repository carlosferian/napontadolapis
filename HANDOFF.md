# Handoff — Na Ponta do Lápis

**Data:** maio de 2026  
**Branch de desenvolvimento:** `claude/friendly-hypatia-HwfUk`  
**Stack:** Next.js 14+ · TypeScript · Tailwind CSS · Vercel (deploy pendente)

---

## Estado atual

O projeto está completo e buildando sem erros. São **33 páginas estáticas** geradas, prontas para deploy.

### O que está implementado

**Calculadoras MVP (Fase 1) — todas funcionando:**
- `/apostas` — gastos com apostas, projeção 5 anos, comparativo Selic
- `/apostas/probabilidades` — margem da casa, curva normal, chance de lucro por N apostas
- `/investimentos` — comparativo poupança / CDB / Selic / Tesouro IPCA+ vs apostas (Recharts)
- `/fumo` — custo diário/mensal/10a/30a, comparativo Selic
- `/viagens` — hub com 21 destinos por região
- `/viagens/planejar` — calculadora universal com qualquer destino
- `/viagens/[destino]` — 21 páginas estáticas individuais com SEO por destino

**Infraestrutura:**
- `config/rates.ts` — taxas Selic/CDI/Tesouro centralizadas (atualizar manualmente)
- `config/travel.ts` — 21 destinos com custos, voos, vistos e `TRAVEL_CONFIG`
- `lib/calculations/compound.ts` — juros compostos com aportes mensais
- `lib/calculations/probability.ts` — margem da casa, valor esperado, normal CDF
- `lib/calculations/travel.ts` — cálculo IOF vs fintech, custo da viagem
- `lib/calculations/savings.ts` — PMT de anuidade (quanto poupar por mês)
- `lib/formatters.ts` — formatBRL, formatPct
- `lib/contextualComments.ts` — comentários dinâmicos por faixa de valor
- `lib/shareCard.ts` — download PNG e cópia para clipboard via html2canvas

**Componentes UI:**
- `SliderField`, `ResultHero`, `MetricCard`, `MetricGrid`, `ComparisonList`
- `ShareButtons`, `CalculatorCard`, `SectionDivider`, `SavingsChart`

**Share Cards** (download PNG + cópia):
- `BetsShareCard`, `InvestmentShareCard`, `SmokeShareCard`, `TravelShareCard`
- Fundo dark temático por seção (preto, verde, marrom, azul petróleo)

**SEO:**
- Metadata (title, description, Open Graph, canonical) em todas as páginas
- `app/sitemap.ts` com todas as URLs (28 entradas)
- `app/robots.ts`

---

## Próximo passo imediato: Deploy

O projeto está pronto para ir ao ar. Ordem de ações:

1. **Vercel** — entrar em vercel.com, importar `carlosferian/napontadolapis`, zero config necessária
2. **Domínio** — registrar `napontadolapis.com.br` no registro.br (~R$40/ano), apontar DNS para o Vercel
3. **Google Search Console** — verificar domínio, submeter sitemap após o deploy
4. **Google Analytics 4** — criar propriedade, inserir script no `app/layout.tsx`
5. **AdSense** — aplicar para conta (pode demorar 2–4 semanas para aprovação)

---

## O que falta (Fase 2)

### Calculadoras de alta prioridade (por volume de busca)

| Calculadora | URL | Volume est. | Status |
|---|---|---|---|
| Rescisão trabalhista | `/trabalho/rescisao` | 200k/mês | ❌ não iniciada |
| Seguro desemprego | `/trabalho/seguro-desemprego` | 150k/mês | ❌ não iniciada |
| Pensão alimentícia | `/familia/pensao` | 100k/mês | ❌ não iniciada |
| Prescrição de dívida | `/dividas/prescricao` | 80k/mês | ❌ não iniciada |
| CLT vs PJ | `/trabalho/clt-vs-pj` | 60k/mês | ❌ não iniciada |
| Horas extras | `/trabalho/horas-extras` | 50k/mês | ❌ não iniciada |

A especificação completa dessas calculadoras está na proposta original (seção 4 de `napontadolapis-proposta.md` — não commitado, está na conversa do usuário).

### Melhorias na seção de viagens

- **Hub `/viagens`** — adicionar filtro por orçamento e região
- **"Onde posso ir com R$ X?"** — busca reversa por orçamento mensal
- **Comparador** — dois destinos lado a lado
- **Afiliados contextuais** — blocos pós-resultado (Wise, corretoras, seguro viagem)
- **Conteúdo editorial** — texto específico por destino nas páginas `/viagens/[destino]`

### Monetização (pendente)

- Links de afiliados: Wise, Rico/XP/NuInvest, Assistcard
- Newsletter: Brevo (grátis até 9k emails/mês), nome sugerido "A Conta Chegou"
- Modal de captura de email: após 2 min ou após download do share card

---

## Taxas para manter atualizadas

Arquivo `config/rates.ts`:
```typescript
selic: 0.1375,     // Atualizar em: bcb.gov.br
cdi: 0.1375,       // = Selic
poupanca: 0.065,   // 70% da Selic quando Selic > 8,5%
tesouroDireto: 0.155,
lastUpdated: '2026-05'
```

Arquivo `config/travel.ts` → `TRAVEL_CONFIG`:
```typescript
defaultUSDtoBRL: 5.75,   // Câmbio padrão (usuário pode editar na calculadora)
iofCreditCard: 0.0438,   // IOF — pode mudar por decreto
```

---

## Estrutura de pastas atual

```
napontadolapis/
├── app/
│   ├── layout.tsx
│   ├── page.tsx                          ← Home com 5 cards
│   ├── apostas/page.tsx
│   ├── apostas/probabilidades/page.tsx
│   ├── investimentos/page.tsx
│   ├── fumo/page.tsx
│   ├── viagens/
│   │   ├── page.tsx                      ← Hub por região
│   │   ├── planejar/page.tsx             ← Calculadora universal
│   │   └── [destino]/page.tsx            ← 21 páginas dinâmicas (SSG)
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
│   │   ├── ShareCard.tsx                 ← Base reutilizável
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
│   └── travel.ts
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

## Decisões tomadas nesta sessão

- **Vercel** escolhido como hospedagem (free tier generoso, nativo para Next.js)
- **Domínio customizado** no Vercel é gratuito — só paga o registro no registro.br
- **html2canvas** para share cards (carregado dinamicamente, não afeta bundle inicial)
- **Recharts** para gráfico de evolução da poupança
- Todas as calculadoras são **100% client-side** — sem APIs externas, sem custo de servidor
- Share cards com fundo dark temático por seção
- `params` em rotas dinâmicas como `Promise<>` (padrão Next.js 15+)

---

*Próxima sessão: priorizar deploy no Vercel e iniciar calculadoras da Fase 2 (rescisão trabalhista tem 200k buscas/mês).*
