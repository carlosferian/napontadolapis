# Redesign Completo — Seção de Apostas

**Data:** 2026-05-30  
**Autor:** Claude (brainstorming com Carlos)  
**Status:** Aprovado para implementação

---

## Contexto

A seção de apostas hoje tem dois componentes separados:
- `/apostas` — `BetsCalculator.tsx`: simulador gamificado (15 rodadas) + calculadora de perda mensal
- `/apostas/probabilidades` — `OddsCalculator.tsx`: calculadora de odds, barras de probabilidade, simulação de 100 rodadas

O objetivo é unificar tudo numa única experiência imersiva e educativa de alto impacto emocional, extraindo o máximo dos recursos disponíveis para páginas estáticas (React state, CSS animations, SVG animado, Recharts).

---

## Objetivo

Criar uma jornada linear de 3 fases em `/apostas` que:
1. **Imersão emocional** — o usuário *joga* um cassino de alta fidelidade visual
2. **Ruptura dramática** — a tela se parte quando o saldo zera, revelando a verdade
3. **Narrativa educativa** — 5 capítulos de dados, matemática e recursos de saída

O resultado final tem que ser educativo, compartilhável e inesquecível — especialmente para o público jovem com dificuldade de leitura matemática.

---

## Arquitetura

### Estrutura de arquivos

```
app/apostas/page.tsx                          ← atualizar header e metadata
app/apostas/probabilidades/page.tsx           ← DELETAR (rota removida do sitemap)
components/calculators/BetsCalculator.tsx     ← reescrita completa
components/calculators/OddsCalculator.tsx     ← sem alteração (não deletado; apenas sem rota própria)
lib/calculations/probability.ts              ← sem alteração (funções reutilizadas na Fase 3)
config/rates.ts                              ← sem alteração
app/sitemap.ts                               ← remover entrada de /apostas/probabilidades
```

### Estado do componente `BetsCalculator`

```typescript
type Phase = 'casino' | 'rupture' | 'narrative'

// Fase 1 — Cassino
balance: number          // inicia em 200, mínimo 0
betAmount: number        // 2–50
selectedModality: string // 'slots' | 'crash' | 'sports' | 'roulette'
roundCount: number       // 0–15
log: RoundLogEntry[]
isRolling: boolean
rollingEmoji: string
// decay NÃO é estado — é valor derivado:
// const decay = useMemo(() => Math.round((200 - balance) / 2), [balance])

// Fase 2 — Ruptura
phase: Phase             // 'casino' | 'rupture' | 'narrative' — transição global de fase
ruptureStep: 0|1|2|3|4  // sub-estado interno da animação de ruptura (0=inativo)
rupturePlayed: boolean   // garante que a sequência de setTimeouts roda só uma vez

// Fase 3 — Narrativa
activeChapter: number    // 0–4
monthly: number          // calculadora de perda
months: number
odd: number              // calculadora de odds
betAmountOdds: number
```

---

## Fase 1 — O Cassino

### Visual geral

Fundo escuro `#14102a` com gradientes neon. Aparência de app real de bets — não estilizado, mas hiper-realista para maximizar o choque da revelação posterior.

### Sistema de Decadência Progressiva (5 estágios)

O `decay` é computado como `Math.round((200 - balance) / 2)` — mapeia saldo de 200→0 para decay de 0→100. Cada estágio muda variáveis CSS aplicadas inline no container do cassino:

| Estágio | Decay % | Cor dominante | O que muda |
|---------|---------|---------------|------------|
| 0 — Pristine | 0–20% | Dourado `#fcd34d` | Neon vibrante, slots coloridas com glow, saldo brilhando, contador "ao vivo" pulsante |
| 1 — Primeiros sinais | 20–40% | Âmbar `#fb923c` | Uma slot pisca, `💸` começa a voar no canto, dourado vira âmbar, contador mais lento |
| 2 — Alerta | 40–60% | Vermelho claro `#f87171` | Teia de aranha `🕷️` no canto, emoji `😵` substitui uma slot, mais `💸` voando, borda treme |
| 3 — Crítico | 60–80% | Vermelho `#ef4444` | Rachadura SVG no canto superior, `🚨💔` aparecem, tela quase grayscale, saldo piscando |
| 4 — Colapso | 80–100% | Carmim `#dc2626` | `💀` domina, rachadura cobre metade da tela, chuva de `💸`, slots apagadas, SALDO ZERO |

**Implementação técnica do decay:**
- CSS custom properties `--casino-bg`, `--casino-glow`, `--casino-border` atualizadas via `style` inline no React com base no `decay`
- Símbolos de decadência são componentes que renderizam condicionalmente a partir de thresholds: `decay >= 25`, `decay >= 42`, etc.
- A rachadura SVG tem `opacity` interpolada: `Math.max(0, (decay - 55) / 45)`
- A intensidade do flickering CSS (`animation-duration`) diminui com o decay: `${Math.max(0.3, 2 - decay * 0.018)}s`

### Conteúdo da simulação

Mantém os 15 `PREDEFINED_ROUNDS` existentes (vitórias programadas nos giros 1, 2 e 5 para simular dopamina, seguidas de drenagem inevitável). O Piloto Automático de 1.000 rodadas é **removido** — a nova experiência é inteiramente manual para forçar o engajamento rodada a rodada.

### Seletor de modalidades

4 botões: Tigrinho (RTP 85%), Foguetinho (RTP 90%), Múltiplas (RTP 75%), Roleta (RTP 97.3%). A modalidade selecionada afeta apenas o emoji animado no spin e a mensagem — os `PREDEFINED_ROUNDS` são os mesmos para manter o arco dramático.

---

## Fase 2 — A Ruptura

Disparada quando `balance === 0` (após o giro 15 ou all-in que zera o saldo).

### Sequência de animação (total ~1.2s)

1. **t=0ms** — Cassino morto: slots viram `💀`, saldo some, rachaduras aparecem em todo o painel
2. **t=300ms** — Tremor: `animation: shake 80ms 3` no container inteiro
3. **t=550ms** — Flash: background vai a `#dc2626` por 200ms
4. **t=750ms** — Split screen com raio:
   - Container divide-se em duas metades com CSS `clip-path` animado
   - Lado esquerdo (40%): cassino morto com `filter: grayscale(0.7)`, símbolos de ruína, rachadura SVG iluminada
   - Raio central: div com `background: linear-gradient(to bottom, white, #ef4444, #991b1b)`, `width: 3px`, `box-shadow` neon vermelho
   - Lado direito (60%): `background: #f8f7f5`, fade-in de texto de impacto
5. **t=1200ms** — Texto aparece no lado direito:
   - Título: `"A ilusão acabou."`
   - Subtítulo: `"R$ 200 perdidos em {roundCount} cliques. É assim que funciona toda vez."`
   - CTA: botão `"Ver a verdade completa →"` que dispara scroll suave para a Fase 3

### Implementação técnica

```typescript
// Estados da ruptura
const [ruptureStep, setRuptureStep] = useState<0|1|2|3|4>(0)

useEffect(() => {
  if (balance > 0 || rupturePlayed) return
  setRupturePlayed(true)
  setTimeout(() => setRuptureStep(1), 0)    // morto
  setTimeout(() => setRuptureStep(2), 300)  // tremor
  setTimeout(() => setRuptureStep(3), 550)  // flash
  setTimeout(() => setRuptureStep(4), 750)  // split
}, [balance])
```

O split usa `clipPath` ou simplesmente `grid-template-columns: 40% 3px 1fr` com transição CSS de 400ms.

---

## Fase 3 — A Narrativa

Seção editorial abaixo do split screen. Fundo claro `#f8f7f5`, tipografia limpa — contraste máximo com o cassino escuro.

### Estrutura de navegação

Sidebar vertical fixa com 5 nós clicáveis + barra de progresso no topo. Cada capítulo é um bloco de conteúdo com botões "Próximo/Anterior". Em mobile, a sidebar colapsa para uma barra de progresso horizontal.

### Capítulo 1 — Psicologia (🧠)

**Eyebrow:** "CAPÍTULO 1 · PSICOLOGIA"  
**Headline:** "Seu cérebro foi manipulado por design."

Conteúdo:
- Parágrafo sobre o Reforço Intermitente de B.F. Skinner
- **Gráfico de barras de dopamina** dos 15 giros: barras coloridas (verde nos giros 1, 2, 5 = picos; vermelho nos giros 10–15 = queda). Implementado com `<div>` CSS puro com alturas proporcionais fixas — valores são estáticos, Recharts seria overhead desnecessário.
- Card explicativo sobre o Reforço Intermitente

### Capítulo 2 — Matemática (📐)

**Eyebrow:** "CAPÍTULO 2 · MATEMÁTICA"  
**Headline:** "A casa nunca joga para perder."

Conteúdo:
- Calculadora de odds **inline e interativa** (odd slider + betAmount + valor esperado calculado em tempo real)
- Barras de probabilidade de lucro para 10, 100, 500 e 1.000 apostas (reutiliza `probProfit` de `lib/calculations/probability.ts`)
- Analogia dramática contextual (`getDramaticAnalogy` já existente no `OddsCalculator`)
- Simulador de 100 rodadas (botão "Simular" + gráfico sparkline do `recharts` — reutiliza lógica existente)

### Capítulo 3 — Custo Real (💸)

**Eyebrow:** "CAPÍTULO 3 · CUSTO REAL"  
**Headline:** "Quanto você realmente perdeu?"

Conteúdo:
- Inputs bidirecional (slider + campo numérico) para `monthly` e `months` — padrão do projeto
- `ResultHero` com total perdido
- `MetricGrid` com projeção 5 anos apostando vs. investido na Selic
- `ComparisonList` com poder de compra
- `ShareCard` de apostas + `ShareButtons`

### Capítulo 4 — Brasil Sangra (🇧🇷)

**Eyebrow:** "CAPÍTULO 4 · IMPACTO NACIONAL"  
**Headline:** "O Brasil sangra R$ 130 bilhões."

Conteúdo:
- Grid de 4 stats: `85–92% perdem`, `5mi Bolsa Família`, `63% renda comprometida`, `+150% diagnósticos`
- Cards com dados do Banco Central, SBVC e USP/IPq (reutiliza conteúdo existente)

### Capítulo 5 — Saída (🚪)

**Eyebrow:** "CAPÍTULO 5 · SAÍDA"  
**Headline:** "Você pode parar agora."

Conteúdo:
- Links para JA Brasil, CAPS/SUS, autoexclusão de CPF, CVV 188
- Bloco de compartilhamento da experiência completa
- `SourcesFooter` com fontes oficiais

---

## Remoção de `/apostas/probabilidades`

O arquivo `app/apostas/probabilidades/page.tsx` é **deletado**. A rota deixa de existir. A entrada correspondente é removida de `app/sitemap.ts`. O componente `OddsCalculator.tsx` permanece em disco (não deletar — pode ser referenciado por código compilado) mas nenhuma página o importa mais.

---

## Restrições técnicas

- **Zero dependências novas**: toda a implementação usa React, Tailwind v4, Recharts (já instalado), Lucide (já instalado) e CSS nativo
- **100% client-side**: nenhum dado sai do browser
- **Sem sons**: Web Audio API foi considerada mas descartada — aumenta complexidade e pode ser bloqueada por browsers
- **Performance**: o loop de decay é computado em `useMemo` a partir do `balance` — sem `setInterval`
- **Acessibilidade**: `aria-live="polite"` no painel de saldo; animações respeitam `prefers-reduced-motion`
- **Embed**: `?embed=true` continua funcionando — o `EmbedHandler` global já cuida disso

---

## Critérios de sucesso

1. O usuário que nunca apostou entende visceralmente o perigo após a jornada completa
2. A interface do cassino é convincente o suficiente para provocar desconforto ao "quebrar"
3. A Fase 3 é compartilhável — especialmente o gráfico de dopamina e o card de custo real
4. Zero erros de TypeScript e zero warnings no build
5. A rota `/apostas/probabilidades` retorna 404 (rota removida) e não aparece no sitemap
