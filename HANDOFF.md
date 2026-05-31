# Handoff — A Ponta do Lápis

**Última atualização:** 2026-05-31  
**Branch de desenvolvimento:** `claude/friendly-hypatia-HwfUk`  
**Stack:** Next.js 16.2.6 · React 19 · TypeScript · Tailwind CSS v4 · Netlify (deploy contínuo ativo)  
**Domínio registrado:** `apontadolapis.com.br`

---

## Estado atual

O projeto está completo, compilando com **sucesso absoluto** (47 páginas estáticas geradas sem avisos ou erros) e 100% monetizado (Google AdSense + Programa de Afiliados Wise).

Toda a infraestrutura roda de forma **100% independente, autônoma e com custo zero vitalício**.

---

## O que foi feito — Sessão Atual (2026-05-30 / 2026-05-31)

### 1. Redesign Completo da Seção de Apostas — Jornada Imersiva em 3 Fases

**`/apostas`** — Jornada linear completa em overlay fullscreen:

**Fase 1 — O Cassino (`BetsCasino.tsx`):**
- Saldo inicial **R$0** — jogador deve depositar um bem real para entrar
- Sistema de decadência progressiva de 5 estágios (visual deteriora conforme saldo cai)
- 6 bens reais single-use: 🎬 Cinema / 👟 Tênis / 📱 Celular / 💰 Poupança filhos / 📚 Livros / 🍕 Jantar família
- 15 rodadas pré-roteirizadas com arco dramático (hook dopaminérgico → colapso)
- **Sessões sortudas (12%)**: ocasionalmente o jogador GANHA, mas a tela educativa explica que ele está nos 12% — e que 9 em cada 10 ganhadores voltam e perdem
- Sons sintetizados via Web Audio API (zero arquivos de áudio)
- GameLauncher: overlay fullscreen com botão "← Voltar" sempre acessível

**Fase 2 — A Ruptura (`BetsRupture.tsx`):** Tremor → flash vermelho → split screen com raio

**Fase 3 — A Narrativa (`BetsNarrative.tsx`):** 5 capítulos (Psicologia, Matemática, Custo Real, Brasil Sangra, Saída)

---

### 2. Calculadora Uber vs. Carro Próprio (`/trabalho/uber-vs-carro`)

Motor de cálculo completo com **11 fatores de custo**:
- Depreciação, IPVA, seguro, combustível, manutenção, pedágio, estacionamento, lavagem, licenciamento, financiamento e **custo de oportunidade (Selic)**
- Modo "Estou avaliando COMPRAR" vs "Já TENHO" (depreciação extra do 1º ano)
- Commute em 4 modos (só TP / só Uber / misto ×2)
- Gráfico break-even (km/mês onde os custos se igualam) com modelo piecewise correto
- Projeção 5 anos com IPCA + Selic
- Correção do custo de oportunidade para carros financiados

---

### 3. Calculadora Financiamento vs. Consórcio (`/investimentos/financiamento-ou-consorcio`)

**Aba "⚡ Quem Vence?" (nova — primária):**
- Duelo visual: Financiamento SAC × Consórcio
- Inputs duais sincronizados (slider + campo de texto manual)
- Scorecard 3 critérios: Custo Total / Ter o Bem / Parcelas
- Placar final com veredito: "3×0 — SAC VENCE" ou similar
- ShareCard viral para redes sociais
- Regra de ouro embutida

**Aba "📊 Análise Completa" (existente — secundária):**
- Tabela 4 modalidades × 8 critérios (SAC, Price, Empréstimo, Consórcio)
- Gráficos de custo total e evolução das parcelas
- Painel de antecipação (economy calculada)
- Análise detalhada do consórcio

---

### 4. Viver de Renda — Calculadora Dupla (`/investimentos/viver-de-renda`)

**Aba "⚡ Cálculo Rápido" (nova — primária):**
- Modo A: "Tenho capital" → mostra retirada perpétua em destaque + explorador de duração
- Modo B: "Quero renda mensal" → mostra capital necessário + explorador com capital menor
- Premissas fixas: Selic atual − 5% IPCA (transparentes mas não editáveis)
- Card de taxa viva com `npm run update-rates` e link GitHub Actions

**Aba "📊 Planejador Completo" (existente — aprimorada):**
- Solver 4 variáveis (C, R, I, T)
- **IR Progressivo (Lei 15.270/2025)**: isenção total ≤ R$5k, redutor parcial até R$7.350
  - Dois modos: "quero X líquido" (back-solves o bruto) / "informo o bruto"
  - Card pedagógico com faixas detalhadas e o redutor linha a linha
- **Inflação correta**: usa taxa real (Selic − IPCA) — o que a calculadora antiga ignorava
- **Tetos de retirada**: máximo perpétuo real (C × i_real) + máximo vitalício (PMT para N anos)
- **Gráfico 3 linhas**: saldo real + saldo nominal + saque nominal crescente
- **Idade da aposentadoria** (não idade atual): anos de renda = aposentadoria → expectativa de vida
- Gráfico comparativo BarChart: sua retirada vs. tetos máximos

---

### 5. Juros Compostos — Inflação adicionada

- Slider de inflação (0–15%, default 5%)
- Linha âmbar tracejada "Valor Real" no gráfico
- Card de alerta: "inflação corrói X% do valor nominal"
- `lib/calculations/compound.ts`: `compoundMonthlyReal()` + `deflateToToday()`

---

### 6. Custo do Fumo — Valores reais

- `realInvested10y` / `realInvested30y` deflacionados pelo IPCA
- Card explicativo sobre diferença nominal vs. real nos projetos de 30 anos

---

### 7. Calculadora de Savings — Meta corrigida por inflação

- `inflationAdjustedTarget`: meta em termos nominais futuros
- `monthlyWithSelicAdjusted`: aporte para atingir meta real

---

### 8. Tabela IRPF 2026 (`config/tax.ts`)

- `calculateIR(gross)`: tabela progressiva 2026 + redutor Lei 15.270/2025
- `grossFromNet(net)`: back-solver para 3 zonas (isento / transição / progressiva)
- Matematicamente verificado: R$5.000 → IR R$0 ✓ | R$7.350 → sem redutor ✓

---

### 9. Padronização de Números pt-BR nos Formulários

- `formatBRLInput(v)`: "1.234,00" (sem R$, com 2 decimais) para uso em inputs
- `parseBRLInput(str)`: lê "1.234,56" → 1234.56 (remove pontos de milhar, converte vírgula)
- Atualizado em 8 calculadoras: Income, SimpleIncome, Financing, UberCar, BetsNarrative, Miles, Rotativo, Parcelado

---

### 10. Menu + Nav + Sitemap

- **Viagens**: virou dropdown com Milhas, Planejar, Custo de Vida
- **Trabalho**: adicionado Uber vs. Carro + Financiamento vs. Consórcio
- **Mobile**: hambúrguer menu para viewport < 768px
- `overflow-x: hidden` no body como proteção geral

---

### 11. Política de Privacidade (`/privacidade`)

- Cobre site + app Android/iOS "Dividir Conta — A Ponta do Lápis"
- URL para Google Play / App Store: `apontadolapis.com.br/privacidade`

---

### 12. Automação de Taxas

- `npm run update-rates` → `node scripts/update-market.mjs`
- GitHub Actions roda diariamente às 9h UTC
- Busca Selic (SGS 432), USD (SGS 1), IPCA (SGS 13522) via API BCB
- Atualiza `config/rates.ts` e `config/market.ts` automaticamente

---

## Estrutura de arquivos relevantes

```
config/
  rates.ts               — Selic/CDI/poupança (auto-gerado via BCB)
  tax.ts                 — IRPF 2026 + Lei dos 5 Mil
  uber-car.ts            — Defaults veículos por segmento
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

scripts/
  update-market.mjs      — Busca taxas do BCB e atualiza config/
```

---

## Próximas funcionalidades planejadas

### Calculadora Financiamento vs. Consórcio — aprimoramento futuro
- Já especificada e parcialmente implementada
- Adicionar: Saldo devedor ao longo do tempo, comparação com "investir e comprar à vista"

### Calculadora Custo de Oportunidade do Carro
- Derivada do módulo Uber vs. Carro
- Mostrar: "seu carro vale R$X hoje. Investido na Selic em 10 anos seria R$Y"

---

## Governança de Parcerias e Monetização

1. **Performance**: Apenas `<a>` simples para afiliados — proibido scripts externos
2. **SEO**: Links patrocinados com `rel="noopener noreferrer sponsored"`
3. **Privacidade**: Cálculos 100% client-side, sem captação de dados
4. **Afiliados contextuais**: Apenas no final do funil de resultados

---

## Próximos passos gerais

1. **Promover Widgets**: Contato com portais imobiliários (ITBI, Amortização) e blogs de milhas para backlinks
2. **Divulgação Reddit**: `r/investimentos` com foco em "Privacidade Radical"
3. **Google AdSense**: Aguardar aprovação do site
