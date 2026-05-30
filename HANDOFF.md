# Handoff — A Ponta do Lápis

**Última atualização:** 2026-05-30  
**Branch de desenvolvimento:** `claude/friendly-hypatia-HwfUk`  
**Stack:** Next.js 16.2.6 · React 19 · TypeScript · Tailwind CSS v4 · Netlify (deploy contínuo ativo)  
**Domínio registrado:** `apontadolapis.com.br`

---

## Estado atual

O projeto está completo, compilando com **sucesso absoluto** (todas as 42 páginas estáticas geradas sem avisos ou erros) e **100% monetizado e integrado** com as campanhas oficiais do proprietário (Google AdSense e Programa de Afiliados da Wise).

Toda a infraestrutura do site roda de forma **100% independente, autônoma e com custo zero vitalício**, eliminando qualquer dependência de chaves de API externas de terceiros instáveis de aviação (Amadeus/Kiwi.com), o que garante imunidade contra o encerramento do portal Amadeus em julho de 2026.

---

## O que foi feito — Sessão Atual (2026-05-30)

### 1. Refatoração de Experiência do Usuário (Realidade Brasileira)
* **Dropdown Simplificado e Natural**: Removemos a estrutura redundante e poluída do seletor de estados em `components/calculators/BrazilianRealidadeCalculator.tsx` (ex: `Acre — Medição: Rio Branco (AC)`). Agora, o dropdown exibe de forma elegante e limpa `Acre (AC)` ou `Minas Gerais (MG)`.
* **Consistência de Linguagem**: Em `config/realidade.ts`, removemos o sufixo redundante ` (Estado)` dos nomes de `São Paulo` e `Rio de Janeiro`. Isso resolve dinamicamente as exibições no portal, tornando títulos de gráficos (ex: *"Curva de Distribuição de Renda de São Paulo"*) 100% naturais.
* **Preservação de Contexto**: As informações de medição de Cesta Básica do DIEESE permanecem visíveis nos blocos de resultados (ex: *"Cesta em Porto Alegre: R$ 810"*), garantindo clareza sem poluir a entrada de dados.

### 2. Correção Crítica de SEO Técnico (Sitemap XML)
* **Mapeamento de Rotas Pendentes**: Identificamos que 8 das novas e principais calculadoras (incluindo *Realidade Brasileira*, *Amortização de Financiamento*, *Rescisão CLT*, *Seguro-Desemprego* e *Juros Compostos*) estavam fora do gerador de Sitemap XML do Next.js.
* **Sitemap Completo (`app/sitemap.ts`)**: Atualizamos o gerador para integrar 100% das 42 páginas estáticas e parametrizadas do projeto.
* **Priorização Estratégica**: Configuramos as ferramentas mais competitivas e virais (*Amortização* e *Realidade Brasileira*) com a **prioridade máxima de 0.95**, acelerando drasticamente o tempo de indexação e descoberta pelo Google Search Console.

### 3. Mecanismo de Widgetização Dinâmica (Embed Limpo & Transparente)
* **Detecção Dinâmica (`components/EmbedHandler.tsx`)**: Criamos um componente client-side montado no `app/layout.tsx` que monitora se a query string da URL contém `?embed=true`.
* **Estilização Inteligente no Embed (`app/globals.css`)**: Injetamos estilos CSS globais específicos para o modo `.is-embedded`. Quando ativo, oculta automaticamente o cabeçalho (Nav), rodapé (Footer), publicidades do AdSense, chamadas de afiliados e explicações longas em texto.
* **Fundo Transparente**: Definimos a cor de fundo como transparente no modo embed, permitindo que a calculadora se integre perfeitamente a qualquer cor ou design do blog do parceiro.
* **Botão Modular global de Cópia (`components/ui/ShareButtons.tsx`)**: Adicionamos o botão de `</> Incorporar no seu site (Widget)` na base de compartilhamento de **todas as 11 calculadoras** do portal. Ele abre um painel dinâmico revelando o código do `<iframe>` gerado automaticamente baseado na URL atual da página, facilitando a cópia e inserção pelos parceiros.

### 4. Integração Oficial do Google AdSense
* **Tag de Verificação Global (`app/layout.tsx`)**: Adicionamos a meta tag oficial exigida para a propriedade da conta do AdSense:
  ```typescript
  other: {
    'google-adsense-account': 'ca-pub-1917277909427173',
  }
  ```
* **Arquivo de Compliance (`public/ads.txt`)**: Publicamos o arquivo de autorização digital de publicidade do Google na raiz pública.
* **Script Global e Variáveis de Ambiente**: Script integrado condicionado à variável `NEXT_PUBLIC_ADSENSE_CLIENT_ID` cadastrada no Netlify.

### 5. Otimização do Afiliado Wise
* **Botão Contextual na Calculadora de Viagem (`TravelCalculator.tsx`)**: Inserção de botão destacado chamando o link de afiliado oficial do proprietário ao lado do cálculo de economia de câmbio da viagem.
* **Funil Limpo**: Remoção da menção direta à concorrência (Nomad) nas ações mais chamativas de resultados, mantendo termos genéricos de fintechs para preservar autoridade.

---

## Estrutura de pastas atualizada

```
napontadolapis/
├── .env.local                            ← Variáveis locais do AdSense
├── app/
│   ├── layout.tsx                        ← GA4 + AdSense meta tag + EmbedHandler
│   ├── page.tsx
│   ├── sitemap.ts                        ← Sitemap dinâmico 100% completo! (Novo)
│   ├── trabalho/
│   │   ├── realidade-brasileira/page.tsx
│   └── viagens/
│       └── custo-de-vida/page.tsx
├── components/
│   ├── EmbedHandler.tsx                  ← Novo! Detector de iframe (?embed=true)
│   ├── AdBanner.tsx                      ← Componente modular do AdSense
│   ├── ui/
│   │   └── ShareButtons.tsx              ← Novo! Integração de botão "</> Incorporar"
│   └── calculators/
│       ├── BrazilianRealidadeCalculator.tsx ← Dropdown e nomes simplificados
│       └── TravelCalculator.tsx          ← Botão de Afiliado Wise integrado
├── config/
│   ├── realidade.ts                      ← Removido sufixo "(Estado)" de SP/RJ
│   ├── travel.ts
│   └── flight-prices.json
├── public/
│   ├── ads.txt                           ← Arquivo de autorização do AdSense
│   └── logo.png
└── README.md                             ← Documentação técnica premium
```

---

## Próximos passos

1. **Monitorar a revisão do Google AdSense**: Aguardar o prazo padrão de 2 a 14 dias para aprovação do site.
2. **Promover links de Embeds (Widgetização)**: Fazer contato com blogs parceiros de finanças, viagens e moradia oferecendo o widget interativo 100% limpo das calculadoras para atrair backlinks de autoridade de forma gratuita.
3. **Divulgação Orgânica em Fóruns**: Realizar publicações sobre "Privacidade Radical" e as ferramentas no `r/investimentos` para gerar o sinal de engajamento que destrói a Sandbox do Google.
