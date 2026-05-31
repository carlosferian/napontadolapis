# Handoff — A Ponta do Lápis

**Última atualização:** 2026-05-31  
**Branch de desenvolvimento:** `claude/friendly-hypatia-HwfUk`  
**Stack:** Next.js 16.2.6 · React 19 · TypeScript · Tailwind CSS v4 · Netlify (deploy contínuo ativo)  
**Domínio registrado:** `apontadolapis.com.br`

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
