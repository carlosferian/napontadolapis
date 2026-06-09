<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# A Ponta do Lápis — Guia do Projeto

Site de calculadoras financeiras em português (pt-BR), 100% estático e
client-side. Sem backend, sem coleta de dados pessoais. Monetizado via
Google AdSense e afiliados (ex: Wise).

## Stack

- Next.js 16.2.6 (App Router, Turbopack) · React 19 · TypeScript · Tailwind CSS v4
- Deploy contínuo no Netlify a partir do GitHub
- `npm run build` deve sempre terminar com **zero erros e zero warnings** —
  rode antes de considerar qualquer tarefa concluída

## Estrutura

```
app/<rota>/page.tsx          — página da calculadora (metadata + layout + <Calculator />)
app/sitemap.ts               — sitemap manual; toda nova rota precisa ser adicionada aqui
app/page.tsx                 — homepage com cards para cada calculadora

components/calculators/      — um componente 'use client' por calculadora
components/ui/                — componentes reutilizáveis (SliderField, CalculatorCard, etc.)
components/share/ShareCard.tsx — base dos cards de compartilhamento (PNG)

config/                       — constantes e tabelas (taxas, IRPF, milhas, financiamento)
config/rates.ts               — Selic/CDI/poupança, atualizado automaticamente via BCB
config/tax.ts                 — tabela IRPF 2026 + Lei dos 5 Mil (calculateIR, grossFromNet)

lib/calculations/             — motores de cálculo puros (sem UI), reutilizáveis entre calculadoras
lib/formatters.ts             — formatBRL e afins

scripts/update-market.mjs     — atualiza config/rates.ts via BCB (rodado por GitHub Actions diário)
```

## Padrão: inputs numéricos com slider (draft state)

Bug recorrente já corrigido várias vezes: `onChange` que faz
`Math.max(min, parseInt(...) || min)` a cada keystroke trava a digitação
quando `min` é alto (ex: digitar "500000" fica preso em "50000" ao chegar
no primeiro dígito incompleto).

**Sempre usar o padrão de estado de rascunho (draft):**

```tsx
const [valueDraft, setValueDraft] = useState<string | null>(null)

<input
  type="number"
  inputMode="numeric"
  value={valueDraft ?? value}
  onChange={e => setValueDraft(e.target.value)}
  onFocus={() => setValueDraft(String(value))}
  onBlur={() => {
    const p = parseInt(valueDraft ?? '')
    setValue(Math.max(min, isNaN(p) ? min : p))
    setValueDraft(null)
  }}
  onKeyDown={e => e.key === 'Enter' && (e.target as HTMLInputElement).blur()}
/>
```

- Nunca clampar no `max` no `onChange`/`onBlur` do input de texto — o
  usuário deve poder digitar qualquer valor acima do slider.
- O `<input type="range">` (slider) deve usar `value={Math.min(value, max)}`
  para não travar visualmente.
- Quando `value > max` do slider, mostrar badge "↑ digitado acima" + texto
  explicativo, e exibir labels de mín/máx abaixo do slider.
- Prefira usar `components/ui/SliderField.tsx` (já implementa tudo isso)
  em vez de reimplementar inputs custom.

## Como adicionar uma nova calculadora

1. Motor de cálculo puro em `lib/calculations/<nome>.ts` (se ainda não existir)
2. Componente `components/calculators/<Nome>Calculator.tsx` (`'use client'`),
   reutilizando `CalculatorCard`, `SliderField`, `SectionDivider`, `ShareCardBase`,
   `ScaledPreview`, `ShareButtons`
3. Página `app/<rota>/page.tsx` com `metadata` (title, description, openGraph,
   canonical), header no padrão `calm-header`, a calculadora, um bloco
   `prose` explicativo e `SourcesFooter` com fontes oficiais
4. Adicionar a rota em `app/sitemap.ts`
5. Adicionar um card para a nova calculadora em `app/page.tsx`
6. Rodar `npm run build` e verificar 0 erros/warnings

## HANDOFF.md

Documenta o histórico de sessões, decisões de arquitetura e backlog de
melhorias priorizado (🔴/🟡/🟢). Atualizar ao final de cada sessão de
trabalho relevante.
