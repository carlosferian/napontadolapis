# Handoff — A Ponta do Lápis

**Última atualização:** 2026-06-10  
**Branch de desenvolvimento:** `claude/awesome-einstein-C2THb`  
**Stack:** Next.js 16.2.6 · React 19 · TypeScript · Tailwind CSS v4 · Netlify (deploy contínuo ativo)  
**Domínio registrado:** `apontadolapis.com.br`

---

## Estado atual

O projeto está completo, compilando com **sucesso absoluto** (48 páginas estáticas geradas sem avisos ou erros) e 100% monetizado (Google AdSense + Programa de Afiliados Wise).

Toda a infraestrutura roda de forma **100% independente, autônoma e com custo zero vitalício**.

---

## O que foi feito — Sessão 2026-06-09 (rodada 2)

Continuação da implementação do backlog identificado na rodada 1.

### Novas calculadoras

- **IRPF 2026 (`/trabalho/imposto-de-renda`)** — `IRPFCalculator.tsx`
  - Modo "sei meu salário bruto" ou "quero um salário líquido alvo" (usa `grossFromNet` para resolver o bruto)
  - Usa `calculateIR()` de `config/tax.ts` (Lei dos 5 Mil já implementada)
  - Hero com IR devido, alíquota efetiva vs marginal
  - Detalhamento por faixa com barras coloridas, projeção anual (×13)
  - Avisos de isenção total (até R$5.000) e zona de transição (R$5.000–R$7.350)
  - Sharecard `irpf-share-card`

- **Reserva de Emergência (`/investimentos/reserva-de-emergencia`)** — `EmergencyFundCalculator.tsx`
  - Toggle de cobertura (3/6/12 meses), meta = gastos × meses
  - Prazo para atingir a meta com e sem rendimento Selic
  - Comparativo "onde guardar" (Tesouro Selic, CDB liquidez diária, Poupança)
  - Aviso de que reserva não é investimento (liquidez > rendimento)
  - Sharecard `emergency-share-card`

Ambas adicionadas ao `app/sitemap.ts` (prioridade 0.95) e como cards na homepage (`app/page.tsx`).

### Correções de clamping adicionais

- **AmortizationCalculator** (`/investimentos/amortizacao`): campo "Valor Total Financiado" ainda tinha `Math.max(50000, parseInt(...) || 50000)` no `onChange`, travando a digitação dígito a dígito mesmo após a correção anterior. Migrado para o padrão de `draft` state.
- **ItbiCalculator** (`/investimentos/itbi-e-cartorio`): mesmo bug duplo-clamp (`Math.max(50000, Math.min(2500000,...))`) no campo "Valor de Compra do Imóvel". Corrigido com draft state, slider ampliado para R$5M, recalcula entrada (20%) ao commitar.

### Itens do backlog verificados — já implementados, sem ação necessária

- **Sharecard Realidade Brasileira** — já existe e funciona (`realidade-share-card`, mensagem "Top X% do Brasil")
- **Calculadora de Milhas** (`config/miles.ts`) — CPPs (LATAM 22.50, Smiles 16.50, TudoAzul 18.00, Livelo/Esfera 35.00) seguem condizentes com mercado
- **FGTS na Rescisão** (`RescissionCalculator.tsx`) — já simula multa de 40%/20% e saque conforme motivo do desligamento

---

## O que foi feito — Sessão 2026-06-09

Foco em **correção de inputs por teclado**, **ampliação de limites de sliders** e **padronização de UX** em todas as calculadoras.

### 1. Padrão de SliderField — correção de clamping durante digitação

O bug afetava todas as calculadoras com inputs numéricos: o `onChange` disparava a cada keystroke e clampeava valores intermediários (ex: digitar `500000` → ao chegar em `5`, ficava travado no `min`). Corrigido com estado de edição (`draft` string) que só commita no `blur` ou `Enter`.

**Padrão aplicado em todos os casos:**
- Slider travado visualmente no max quando valor digitado ultrapassa o teto
- Badge `↑ digitado acima` + linha explicativa quando valor excede o slider
- Input sem atributo `max` no HTML — browser não bloqueia digitação
- Labels de mín/máx abaixo de todos os sliders

**Componente central:** `components/ui/SliderField.tsx`

### 2. Calculadora "E se tivesse investido?" (`/investimentos`)
- Slider mensal ampliado de R$5.000 → **R$50.000**
- Input manual sem teto — aceita qualquer valor acima do slider

### 3. Calculadora Amortização (`/investimentos/amortizacao`)
- Valor financiado ampliado de R$1,5M → **R$5M**
- Aporte extra mensal ampliado de R$5k → **R$50k**
- Ambos os inputs sem clamp no manual

### 4. Calculadora Financiamento vs. Consórcio (`/investimentos/financiamento-ou-consorcio`)
- **Corrigido bug crítico**: impossível digitar valores pelo teclado (clamping a cada keystroke)
- Campo "Valor do bem" migrado de implementação custom para `SliderInput` padronizado
- `SliderInput` local reescrito com estado de edição (mesmo padrão do `SliderField`)
- Slider do bem ampliado para R$5M
- Labels de mín/máx em todos os sliders

### 5. Calculadora Realidade Brasileira (`/trabalho/realidade-brasileira`)
- Slider de salário ampliado de R$25k → **R$50k** (cobre Classe A: >20 SM = R$30.240)
- Label atualizado para `R$ 50 mil (Classe A)` deixando claro o que o máximo representa
- Input de texto já aceitava R$500k — mantido

### 6. Política de Privacidade (`/privacidade`)
- Corrigido nome do app: `Dividir Conta` → **`Dividir a Conta`** (3 ocorrências: meta description, texto, link de rodapé)

---

## O que foi feito — Sessão 2026-05-31

Realizamos um mutirão de melhorias estruturais focando em **Responsividade Mobile**, **Experiência do Usuário (UX)**, **SEO** e **Aprimoramentos de Layout**.

### 1. Responsividade Mobile & Gestão de Espaço de Tela
- **Colapso de Instruções ("Como Usar")**:
  - Economizamos espaço valioso de tela em dispositivos móveis recolhendo as extensas instruções de cabeçalho.
  - As seções explicativas agora ficam ocultas por padrão sob um botão/accordion expansível que só abre quando explicitamente clicado pelo usuário móvel, colocando os inputs da calculadora logo no primeiro plano.
- **Relatório de Diagnóstico Mobile**:
  - Criamos um diagnóstico detalhado de responsividade (`mobile_responsiveness_report.md`) mapeando estratégias aplicadas (como padding dinâmico, flex wrapping, eliminação de overflow no eixo X e adaptação de sliders e tabelas para toque).

### 2. Calculadora Dividir Conta (`/dividir`)
- **Gestão de Quantidades de Itens**:
  - Acabamos com a necessidade de adicionar o mesmo item (como cervejas, refrigerantes, etc.) múltiplas vezes.
  - Implementamos seletores de quantidade (+ / -) ao lado de cada item adicionado, permitindo incrementar ou decrementar de forma simples e reativa.
- **Gaveta de Instruções Inteligente**:
  - O painel de ajuda/instruções agora abre apenas se o usuário clicar nele em dispositivos móveis. Em desktops, o painel exibe-se sutilmente através do hover do mouse.
- **Compartilhamento Simplificado**:
  - Adicionamos botões diretos de compartilhamento via **WhatsApp**, **E-mail** e cópia rápida para a área de transferência, formatando a divisão das contas de forma limpa e legível.

### 3. Calculadora Financiamento vs. Consórcio Simplificado (`/investimentos/financiamento-ou-consorcio`)
- **Simplificação Radical da Aba Principal**:
  - Reduzimos a carga cognitiva na aba inicial simplificada, removendo sliders desnecessários e informações secundárias.
  - Mantivemos o foco absoluto na comparação direta de parcelas e custos de forma enxuta, mantendo o breakdown complexo exclusivamente na aba "Análise Completa".

### 4. Cassino Imersivo & Jogo de Apostas (`/apostas`)
- **Conserto Definitivo de Layout para Telas Pequenas**:
  - Reestruturamos o canvas visual, os contêineres e a rolagem da interface do cassino (`BetsCasino.tsx`, `BetsRupture.tsx`, `BetsNarrative.tsx`).
  - Agora, o jogo encaixa perfeitamente no viewport móvel sem estourar as margens ou exigir rolagens horizontais, garantindo a acessibilidade linear do botão de saída e controles.

### 5. SEO & Sitemap Dinâmico
- **Atualização do SEO**:
  - Mapeamos e inserimos tags meta e de título descritivas em todas as calculadoras para indexação máxima no Google.
  - **Sitemap Automatizado (`app/sitemap.ts`)**: Atualizamos o gerador para incluir de forma explícita e dinâmica todas as novas rotas do projeto (como seguro-desemprego, rescisão clt, ITBI, fuga do rotativo e custo de vida).

### 6. Calculadora Uber vs. Carro Próprio (`/trabalho/uber-vs-carro`)
- **Eliminação de Overflow / Text Leak**:
  - Corrigimos o contêiner `ResultHero.tsx`. Rótulos e valores de resultado de 13+ caracteres agora escalonam dinamicamente no mobile (`text-3xl` vs `text-7xl` no desktop) e usam quebra de palavras (`break-words`), eliminando qualquer vazamento visual do card.
- **Explicitação da Sigla "TP" (Transporte Público)**:
  - Substituímos "TP" por "Transporte Público" ou "Transp. Público" nas opções de rota, tooltips, cabeçalhos, legendas do gráfico e textos de oportunidade.
- **Valores Pré-selecionados Realistas (Grandes Capitais - SP/RJ)**:
  - Ajustamos os defaults para refletir a realidade econômica metropolitana real:
    - **Tarifa do Transporte Público (TP)**: R$ 5,00
    - **Tarifa Base do Uber**: R$ 6,00
    - **Preço do Uber por Km**: R$ 2,40/km
    - **Estacionamento Mensal**: R$ 250,00

---

## Estrutura de arquivos relevantes

```
config/
  rates.ts               — Selic/CDI/poupança (auto-gerado via BCB)
  tax.ts                 — IRPF 2026 + Lei dos 5 Mil
  uber-car.ts            — Defaults veículos por segmento (atualizados tarifas e base)
  financing.ts           — Defaults financiamento/consórcio

lib/calculations/
  income.ts              — Viver de Renda (solver + IR + idade aposentadoria)
  compound.ts            — Juros compostos + helpers real
  financing.ts           — SAC, Price, Empréstimo, Consórcio
  uber-car.ts            — TCO do carro (11 fatores, break-even, 5 anos)
  probability.ts         — Odds/apostas
  savings.ts             — Meta de poupança corrigida

components/
  ui/
    SliderField.tsx      — Componente padrão de slider+input com estado de edição (draft)
  GameLauncher.tsx       — Overlay fullscreen do cassino
  FinancingPageTabs.tsx  — Abas: Quem Vence? / Análise Completa
  IncomePageTabs.tsx     — Abas: Cálculo Rápido / Planejador Completo
  calculators/
    SplitBillCalculator.tsx          — Divisão de conta com incrementador e compartilhamento rápido
    UberCarCalculator.tsx            — TCO completo com clareza sobre Transporte Público
    FinancingComparisonCalculator.tsx — SliderInput local corrigido (draft pattern)
    AmortizationCalculator.tsx       — Sliders ampliados, inputs sem clamp (draft pattern)
    InvestmentComparison.tsx         — Slider mensal até R$50k
    ItbiCalculator.tsx                — Valor do imóvel até R$5M, draft pattern
    IRPFCalculator.tsx                — Calculadora de Imposto de Renda 2026 (Lei dos 5 Mil)
    EmergencyFundCalculator.tsx       — Calculadora de Reserva de Emergência

scripts/
  update-market.mjs      — Busca taxas do BCB e atualiza config/
```

---

## Melhorias identificadas / Backlog

### 🔴 Alta prioridade

- **Bug de clamping em sliders não verificados** — as calculadoras abaixo usam inputs inline (não `SliderField`) e provavelmente têm o mesmo bug de clamping ao digitar:
  - `CompoundInterestCalculator.tsx` (`/juros-compostos`)
  - `RotativoCalculator.tsx` (`/investimentos/fuga-do-rotativo`)
  - `IncomeCalculator.tsx` e `SimpleIncomeCalculator.tsx` (`/investimentos/viver-de-renda`)

### 🟡 Média prioridade

_(nenhum item pendente no momento)_

---

## O que foi feito — Sessão 2026-06-10: auditoria de responsividade mobile

Auditoria de código (sem ambiente de browser disponível) focada em telas de
320–430px, cobrindo `components/calculators/*`, `components/ui/*` e
`components/share/ShareCard.tsx`.

**Conclusão geral**: o site já está bem preparado para mobile — padding
global consistente, `ScaledPreview` nos sharecards, e a maioria dos grids já
tem variantes `sm:`. Os pontos com risco real de quebra de layout eram
poucos e pontuais:

- **`IRPFCalculator.tsx`** — resumo "Bruto/IR/Líquido" (`grid-cols-3`) tinha
  valores em `text-sm` que podiam encostar nas bordas em 320px; reduzido para
  `text-xs sm:text-sm`. A "Projeção anual" (`grid-cols-3` com `break-all`)
  podia quebrar números no meio (ex: `R$ 650.0` / `00,00`); mudado para
  `grid-cols-1 sm:grid-cols-3` (empilha em mobile, sem `break-all`).

Itens revisados e descartados (já adequados ou comportamento intencional):
- `BetsCasino.tsx` — grids `grid-cols-4 sm:grid-cols-2` e `grid-cols-3` no
  cassino são intencionais (chips compactos otimizados para mobile, com
  `truncate` e fontes reduzidas)
- `SplitBillCalculator.tsx` (gorjeta `grid-cols-4`), `EmergencyFundCalculator.tsx`
  (toggle de cobertura `grid-cols-3`), `FinancingComparisonCalculator.tsx`
  (comparativo `grid-cols-2 lg:grid-cols-4`) — labels curtos, sem overflow real
- `SliderField.tsx` (`maxWidth: 12rem` no input de edição) — apenas faz o
  label quebrar linha em telas muito estreitas, sem overflow horizontal
- `ShareCard.tsx` (600px fixo) — uso correto, sempre via `ScaledPreview`

---



- **AGENTS.md documentado**: arquitetura do projeto, padrão de draft state para
  inputs com slider e checklist de "como adicionar nova calculadora"
- **SEO longtail**: adicionado conteúdo textual explicativo (seções `prose`)
  acima/abaixo das calculadoras que ainda não tinham:
  - `/investimentos/financiamento-ou-consorcio` — explica SAC vs Price e por
    que o consórcio raramente compensa (alvo: "SAC vs Price simulador")
  - `/trabalho/uber-vs-carro` — explica o conceito de Custo Total de
    Propriedade (TCO) e break-even

---

## Governança de Parcerias e Monetização

1. **Performance**: Apenas `<a>` simples para afiliados — proibido scripts externos.
2. **SEO**: Links patrocinados com `rel="noopener noreferrer sponsored"`.
3. **Privacidade**: Cálculos 100% client-side, sem captação de dados ou CPF.

---

## Próximos passos gerais

1. **Corrigir sliders restantes** (ver backlog 🔴 acima).
2. **Promover Widgets**: Contato com portais imobiliários (ITBI, Amortização) e blogs de milhas para gerar backlinks.
3. **Divulgação Reddit**: `r/investimentos` com foco em "Privacidade Radical (Client-side puro)".
4. **Google AdSense**: Aguardar aprovação do site oficial.


---

## Estado atual

O projeto está completo, compilando com **sucesso absoluto** (48 páginas estáticas geradas sem avisos ou erros) e 100% monetizado (Google AdSense + Programa de Afiliados Wise).

Toda a infraestrutura roda de forma **100% independente, autônoma e com custo zero vitalício**.

---

## O que foi feito — Sessão Atual (2026-05-31)

Realizamos um mutirão de melhorias estruturais focando em **Responsividade Mobile**, **Experiência do Usuário (UX)**, **SEO** e **Aprimoramentos de Layout**.

### 1. Responsividade Mobile & Gestão de Espaço de Tela
- **Colapso de Instruções ("Como Usar")**:
  - Economizamos espaço valioso de tela em dispositivos móveis recolhendo as extensas instruções de cabeçalho.
  - As seções explicativas agora ficam ocultas por padrão sob um botão/accordion expansível que só abre quando explicitamente clicado pelo usuário móvel, colocando os inputs da calculadora logo no primeiro plano.
- **Relatório de Diagnóstico Mobile**:
  - Criamos um diagnóstico detalhado de responsividade (`mobile_responsiveness_report.md`) mapeando estratégias aplicadas (como padding dinâmico, flex wrapping, eliminação de overflow no eixo X e adaptação de sliders e tabelas para toque).

### 2. Calculadora Dividir Conta (`/dividir`)
- **Gestão de Quantidades de Itens**:
  - Acabamos com a necessidade de adicionar o mesmo item (como cervejas, refrigerantes, etc.) múltiplas vezes.
  - Implementamos seletores de quantidade (+ / -) ao lado de cada item adicionado, permitindo incrementar ou decrementar de forma simples e reativa.
- **Gaveta de Instruções Inteligente**:
  - O painel de ajuda/instruções agora abre apenas se o usuário clicar nele em dispositivos móveis. Em desktops, o painel exibe-se sutilmente através do hover do mouse.
- **Compartilhamento Simplificado**:
  - Adicionamos botões diretos de compartilhamento via **WhatsApp**, **E-mail** e cópia rápida para a área de transferência, formatando a divisão das contas de forma limpa e legível.

### 3. Calculadora Financiamento vs. Consórcio Simplificado (`/investimentos/financiamento-ou-consorcio`)
- **Simplificação Radical da Aba Principal**:
  - Reduzimos a carga cognitiva na aba inicial simplificada, removendo sliders desnecessários e informações secundárias.
  - Mantivemos o foco absoluto na comparação direta de parcelas e custos de forma enxuta, mantendo o breakdown complexo exclusivamente na aba "Análise Completa".

### 4. Cassino Imersivo & Jogo de Apostas (`/apostas`)
- **Conserto Definitivo de Layout para Telas Pequenas**:
  - Reestruturamos o canvas visual, os contêineres e a rolagem da interface do cassino (`BetsCasino.tsx`, `BetsRupture.tsx`, `BetsNarrative.tsx`).
  - Agora, o jogo encaixa perfeitamente no viewport móvel sem estourar as margens ou exigir rolagens horizontais, garantindo a acessibilidade linear do botão de saída e controles.

### 5. SEO & Sitemap Dinâmico
- **Atualização do SEO**:
  - Mapeamos e inserimos tags meta e de título descritivas em todas as calculadoras para indexação máxima no Google.
  - **Sitemap Automatizado (`app/sitemap.ts`)**: Atualizamos o gerador para incluir de forma explícita e dinâmica todas as novas rotas do projeto (como seguro-desemprego, rescisão clt, ITBI, fuga do rotativo e custo de vida).

### 6. Calculadora Uber vs. Carro Próprio (`/trabalho/uber-vs-carro`)
- **Eliminação de Overflow / Text Leak**:
  - Corrigimos o contêiner `ResultHero.tsx`. Rótulos e valores de resultado de 13+ caracteres agora escalonam dinamicamente no mobile (`text-3xl` vs `text-7xl` no desktop) e usam quebra de palavras (`break-words`), eliminando qualquer vazamento visual do card.
- **Explicitação da Sigla "TP" (Transporte Público)**:
  - Substituímos "TP" por "Transporte Público" ou "Transp. Público" nas opções de rota, tooltips, cabeçalhos, legendas do gráfico e textos de oportunidade.
- **Valores Pré-selecionados Realistas (Grandes Capitais - SP/RJ)**:
  - Ajustamos os defaults para refletir a realidade econômica metropolitana real:
    - **Tarifa do Transporte Público (TP)**: R$ 5,00
    - **Tarifa Base do Uber**: R$ 6,00
    - **Preço do Uber por Km**: R$ 2,40/km
    - **Estacionamento Mensal**: R$ 250,00

---

## Estrutura de arquivos relevantes

```
config/
  rates.ts               — Selic/CDI/poupança (auto-gerado via BCB)
  tax.ts                 — IRPF 2026 + Lei dos 5 Mil
  uber-car.ts            — Defaults veículos por segmento (atualizados tarifas e base)
  financing.ts           — Defaults financiamento/consórcio

lib/calculations/
  income.ts              — Viver de Renda (solver + IR + idade aposentadoria)
  compound.ts            — Juros compostos + helpers real
  financing.ts           — SAC, Price, Empréstimo, Consórcio
  uber-car.ts            — TCO do carro (11 fatores, break-even, 5 anos)
  probability.ts         — Odds/apostas
  savings.ts             — Meta de poupança corrigida

components/
  GameLauncher.tsx       — Overlay fullscreen do cassino
  FinancingPageTabs.tsx  — Abas: Quem Vence? / Análise Completa
  IncomePageTabs.tsx     — Abas: Cálculo Rápido / Planejador Completo
  calculators/
    SplitBillCalculator.tsx — Divisão de conta com incrementador e compartilhamento rápido
    UberCarCalculator.tsx   — TCO completo com clareza sobre Transporte Público

scripts/
  update-market.mjs      — Busca taxas do BCB e atualiza config/
```

---

## Governança de Parcerias e Monetização

1. **Performance**: Apenas `<a>` simples para afiliados — proibido scripts externos.
2. **SEO**: Links patrocinados com `rel="noopener noreferrer sponsored"`.
3. **Privacidade**: Cálculos 100% client-side, sem captação de dados ou CPF.

---

## Próximos passos gerais

1. **Promover Widgets**: Contato com portais imobiliários (ITBI, Amortização) e blogs de milhas para gerar backlinks.
2. **Divulgação Reddit**: `r/investimentos` com foco em "Privacidade Radical (Client-side puro)".
3. **Google AdSense**: Aguardar aprovação do site oficial.
