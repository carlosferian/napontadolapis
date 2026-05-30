# Handoff — A Ponta do Lápis

**Última atualização:** 2026-05-30  
**Branch de desenvolvimento:** `claude/friendly-hypatia-HwfUk`  
**Stack:** Next.js 16.2.6 · React 19 · TypeScript · Tailwind CSS v4 · Netlify (deploy contínuo ativo)  
**Domínio registrado:** `apontadolapis.com.br`

---

## Estado atual

O projeto está completo, compilando com **sucesso absoluto** (45 páginas estáticas geradas sem avisos ou erros) e **100% monetizado e integrado** com as campanhas oficiais do proprietário (Google AdSense e Programa de Afiliados da Wise).

Toda a infraestrutura do site roda de forma **100% independente, autônoma e com custo zero vitalício**, eliminando qualquer dependência de chaves de API externas instáveis.

---

## O que foi feito — Sessão Atual (2026-05-30)

### 1. Redesign Completo da Seção de Apostas — Jornada Imersiva em 3 Fases

A calculadora de apostas foi completamente reimaginada como uma **jornada educativa linear** com três fases sequenciais e sem abas. O spec completo vive em `docs/superpowers/specs/2026-05-30-apostas-redesign-design.md`.

#### Fase 1 — O Cassino (`components/calculators/BetsCasino.tsx`)

Lobby de cassino hiper-realista com sistema de **decadência progressiva de 5 estágios** que deteriora a interface conforme o saldo cai:

| Estágio | Decay | Visual |
|---------|-------|--------|
| 0 — Pristine | 0–20% | Fundo `#14102a`, neon dourado, slots com glow colorido |
| 1 — Primeiros Sinais | 20–40% | Âmbar, 💸 voando, uma slot pisca |
| 2 — Alerta | 40–60% | Vermelho, 🕷️ no canto, emoji 😵 em slot |
| 3 — Crítico | 60–80% | Rachadura SVG, 🚨💔, quase grayscale |
| 4 — Colapso | 80–100% | 💀 domina tudo, chuva de 💸, tela praticamente morta |

**Sistema de créditos reais (single-use):** o jogador pode depositar bens reais no cassino — cada um apenas UMA vez:
- 🎬 Ingressos de cinema — R$ 70
- 👟 Tênis novo — R$ 280
- 📱 Entrada do celular — R$ 500
- 💰 Poupança dos filhos — R$ 200
- 📚 Livros novos — R$ 90
- 🍕 Jantar da família — R$ 150

Quando um bem é usado, vira ✓ acinzentado e fica indisponível. Contador "X restantes" visível.

**Regras do jogo (finito):**
- 15 rodadas pré-roteirizadas com arco dramático de dopamina (vitórias nos giros 1, 2 e 5 para viciar, drenagem inevitável depois)
- Aposta padrão: R$ 40 (slider 5-50 + chips rápidos R$5/10/20/50 + All-in)
- Após as 15 rodadas: **perda garantida** (sem RNG) — cada clique drena o saldo deterministicamente
- Máximo possível: R$ 200 inicial + R$ 1.290 em bens = R$ 1.490, que com R$ 40/rodada esgota em ~47 cliques
- Botão 🔊/🔇 de mute no header

**Sons (Web Audio API — zero arquivos, 100% sintetizados):**
- `playSpin()` — blips aleatórios durante o giro
- `playWin()` — dois tons ascendentes
- `playBigWin()` — fanfarra de 4 notas (apenas para mult 4×)
- `playLose()` — sawtooth descendente
- `playRupture()` — bass thud + burst de ruído branco na falência

#### Fase 2 — A Ruptura (`components/calculators/BetsRupture.tsx`)

Sequência de animação com 4 steps ao atingir saldo zero:
1. Cassino morto (slots → 💀, rachaduras SVG, saldo piscando)
2. Tremor (`casino-shake 80ms × 3`)
3. Flash vermelho (`rupture-flash 250ms`)
4. **Split screen com raio:** lado esquerdo = cassino cinza morto, raio vermelho central, lado direito = fundo branco + *"A ilusão acabou. R$ 200 perdidos em X cliques."* + CTA "Ver a verdade completa →" + "↺ Jogar novamente"

#### Fase 3 — A Narrativa (`components/calculators/BetsNarrative.tsx`)

5 capítulos educativos com sidebar de navegação e barra de progresso:

- **Cap. 1 — Psicologia:** Gráfico de barras de dopamina dos 15 giros + explicação do Reforço Intermitente de Skinner
- **Cap. 2 — Matemática:** Calculadora de odds interativa + barras de probabilidade de lucro para 10/100/500/1.000 apostas + simulador de 100 rodadas com gráfico sparkline
- **Cap. 3 — Custo Real:** Calculadora de perda mensal vs. Selic + MetricGrid + ComparisonList + ShareCard
- **Cap. 4 — Brasil Sangra:** Grid de 4 stats oficiais (BCB, SBVC, USP) + cards com fontes
- **Cap. 5 — Saída:** Links JA Brasil, CVV 188, CAPS AD/SUS, Autoexclusão de CPF + botão "↺ Jogar novamente" proeminente

**Botão de restart:** aparece em 3 pontos da jornada (split screen da ruptura, header da narrativa, capítulo 5) — reseta para a Fase 1 instantaneamente sem reload.

#### Limpezas relacionadas
- Rota `/apostas/probabilidades` removida (conteúdo absorvido pelo Cap. 2 da narrativa)
- 9 `@keyframes` CSS adicionados ao `globals.css`
- `OddsCalculator.tsx` mantido em disco (sem rota própria)
- Arquivo `lib/casino-sounds.ts` criado (~80 linhas)

---

### 2. Correção do Menu de Navegação (`components/Nav.tsx`)

- **"Viagens"** convertido de link simples para **dropdown** com 4 itens:
  - Hub de Viagens (`/viagens`)
  - **Milhas ou Dinheiro?** (`/viagens/milhas-ou-dinheiro`) ← movido para o lugar correto
  - Planejar Viagem (`/viagens/planejar`)
  - Custo de Vida entre Cidades (`/viagens/custo-de-vida`)
- "Milhas ou Dinheiro?" removida do dropdown Trabalho onde estava incorretamente
- Link morto `/apostas/probabilidades` removido de Hábitos

---

### 3. Restauração da Calculadora de Milhas (`app/viagens/milhas-ou-dinheiro/page.tsx`)

O componente `MilesCalculator` estava importado na página mas **nunca renderizado** (bug silencioso). Reinserido `<MilesCalculator />` imediatamente após o header, antes da prosa explicativa. A calculadora completa (abas "Milhas vs. Dinheiro" e "Comprar Milhas na Promoção") voltou a aparecer.

---

## Estrutura de arquivos atualizada

```
napontadolapis/
├── app/
│   ├── apostas/
│   │   └── page.tsx               ← Metadata + header atualizados
│   ├── viagens/
│   │   └── milhas-ou-dinheiro/
│   │       └── page.tsx           ← MilesCalculator reinserido
│   └── globals.css                ← 9 @keyframes de cassino adicionados
├── components/
│   ├── Nav.tsx                    ← Viagens dropdown + limpeza de links mortos
│   └── calculators/
│       ├── BetsCalculator.tsx     ← Orquestrador de fase (~40 linhas)
│       ├── BetsCasino.tsx         ← Fase 1: cassino + decay + créditos + sons
│       ├── BetsRupture.tsx        ← Fase 2: split screen animado
│       └── BetsNarrative.tsx      ← Fase 3: 5 capítulos educativos
├── lib/
│   └── casino-sounds.ts           ← Sons sintetizados Web Audio API (novo)
└── docs/superpowers/
    ├── specs/
    │   └── 2026-05-30-apostas-redesign-design.md
    └── plans/
        └── 2026-05-30-apostas-redesign.md
```

---

## Governança de Parcerias e Monetização (Awin / Redes de Afiliados)

Para futuras parcerias de conversão na Calculadora de Milhas ou outras áreas (como *Livelo, Smiles, Decolar* etc.), a seguinte governança técnica **deve ser seguida sem exceção** para manter o portal rápido, seguro, independente e com SEO impecável:

1. **Performance Absoluta (Sem Banners ou Scripts Externos) ⚡**:
   * **Proibido**: Instalar pixels de rastreamento de afiliados, scripts globais de redes de CPA, iframes promocionais ou banners dinâmicos em Javascript fornecidos pelas redes. Esses scripts degradam severamente a velocidade de carregamento e atrasam a interatividade da página, destruindo as pontuações de Core Web Vitals e o SEO do Next.js.
   * **Recomendado**: Utilizar estritamente **links de redirecionamento em HTML puro (`<a>`)**. O botão de chamada para o parceiro deve ser apenas um hiperlink padrão direcionando para a URL de afiliado gerada no portal da rede (ex: Awin/Lomadee). Isso consome **zero kilobytes** de processamento local, preservando o carregamento instantâneo.
2. **Declaração de Transparência para o Google (SEO Técnico) 🔍**:
   * Para evitar punições algorítmicas do Google (*Thin Affiliates* ou desconfiança de transferência artificial de força de link/PageRank), todo link de afiliado ou patrocinado no código deve carregar obrigatoriamente as tags de segurança:
     ```typescript
     <a href="URL_DE_AFILIADO" target="_blank" rel="noopener noreferrer sponsored">
       Texto do Botão
     </a>
     ```
   * A tag **`rel="sponsored"`** sinaliza honestidade técnica para os robôs de busca. O Google reconhece a intenção comercial legítima e protege a autoridade de busca do seu domínio.
3. **Privacidade e Imparcialidade Radical (Cálculos 100% Locais) 🛡️**:
   * O portal se posiciona como um simulador de utilidade pública independente e sem captação de dados/e-mails.
   * **Arquitetura**: O processamento matemático e as simulações devem continuar rodando 100% client-side (no navegador do usuário), de forma anônima.
   * **Monetização**: Os ganchos de comissão devem ser oferecidos exclusivamente de forma **passiva e contextual no final do funil de resultados** (como uma sugestão prática de ação para o cliente baseado no veredito matemático do cálculo), mantendo o julgamento analítico do sistema inabalável e imparcial.

---

## Próximas funcionalidades planejadas

### Calculadora de Financiamento vs. Consórcio

**Objetivo:** Comparar matematicamente se vale mais a pena financiar um bem (imóvel, veículo) ou entrar num consórcio.

**Contexto e cautelas importantes:**
- **Consórcio é proibido em vários países** (EUA, Reino Unido, a maioria da Europa e Ásia) — é uma modalidade exclusivamente brasileira e de alguns países da América Latina. A calculadora deve deixar isso explícito com um aviso educativo.
- **O consórcio raramente vence o financiamento** em termos de custo total se considerado o custo de oportunidade do dinheiro, especialmente se o bem cai de preço no tempo (veículos). Os casos em que pode vantajar: imóvel em valorização acelerada + taxa de administração baixa + contemplação rápida + o comprador NÃO precisa do bem imediatamente.
- A calculadora deve ser honesta e pode concluir "nunca vale a pena" dependendo dos parâmetros — não deve forçar um veredito positivo para o consórcio.

**Variáveis a modelar:**

*Financiamento:*
- Valor do bem
- Entrada (%)
- Taxa de juros mensal (ou CET)
- Prazo em meses
- Sistema de amortização (SAC ou Price)
- Custo total pago (principal + juros)

*Consórcio:*
- Valor da carta de crédito
- Taxa de administração total (%)
- Prazo em meses
- Fundo de reserva (%)
- Estimativa de meses para contemplação (média ou simulação pessimista/otimista)
- Custo de oportunidade do dinheiro preso no consórcio (CDI/Selic sobre parcelas)

**Vereditos que a calculadora deve emitir:**
- Custo total comparado (R$ X vs. R$ Y)
- Custo de oportunidade do tempo sem o bem (consórcio)
- Ponto de equilíbrio (quando o consórcio vence, se vencer)
- Aviso obrigatório: "Consórcio é proibido em muitos países — verifique a legalidade na sua jurisdição"
- Aviso: "Em bens depreciáveis (veículos, eletrônicos), o consórcio raramente vantaja"

**Rota sugerida:** `/investimentos/financiamento-ou-consorcio`

---

## Próximos passos gerais

1. **Promover links de Embeds (Widgetização)**: Fazer contato com portais imobiliários/corretores (para os widgets de *Amortização* e *ITBI*) e blogs de viagem/milhas (para o widget de *Milhas ou Dinheiro*) oferecendo as ferramentas de graça para indexação de backlinks de alta autoridade.
2. **Divulgação Orgânica em Fóruns**: Realizar publicações sobre "Privacidade Radical" no `r/investimentos` (Reddit) apresentando o projeto.
3. **Monitorar a revisão do Google AdSense**: Aguardar o prazo padrão de aprovação do site.
4. **Implementar Financiamento vs. Consórcio**: Ver seção acima com spec completo da intenção.
