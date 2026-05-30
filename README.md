# A Ponta do Lápis — Calculadoras Financeiras Gratuitas

Plataforma de calculadoras financeiras minimalistas de alta utilidade e educação financeira para o brasileiro. Sem cadastro, sem recolhimento de dados pessoais (sem CPF/nuvem), rodando 100% no navegador do usuário de forma privada.

## 🚀 Diferenciais do Projeto
* **Arquitetura 100% Estática e Autônoma (Custo Zero)**: Removidas dependências instáveis de APIs de aviação de terceiros (Amadeus/Kiwi). A aplicação roda exclusivamente com bancos de dados de preços locais estáveis (`flight-prices.json`, `cities-cost.ts` e `realidade.ts`), garantindo imunidade contra desligamento de serviços, tempo de build ultrarrápido e custo vitalício zero de infraestrutura.
* **Monetização Otimizada**:
  * **Google AdSense**: Banners manuais modularizados e sutis (`AdBanner.tsx`) integrados no final das calculadoras de maior engajamento, com suporte nativo a tags globais de verificação no `<head>` (`google-adsense-account`) e arquivo de compliance `ads.txt` na raiz pública.
  * **Programa de Afiliados Wise**: Botão de conversão direta integrado contextualmente na calculadora de viagem ao lado das métricas de economia, otimizando cliques com o link de afiliado oficial.
* **Estética Premium**: Desenvolvido sob um sistema visual moderno, com modo claro e escuro dinâmicos, paleta sutil baseada em tons de pedra/areia (`var(--c-ink)`, `var(--c-bg)`), tipografia moderna e responsividade absoluta.

## 🛠️ Stack Tecnológica
* **Core**: Next.js (estático) & React 19
* **Tipagem**: TypeScript
* **Estilização**: Tailwind CSS v4 (Vanilla CSS para design tokens e flexibilidade máxima)
* **Build & Hosting**: Netlify (Continuous Deployment via Git)

## 📁 Principais Calculadoras
1. **Realidade Brasileira (`/trabalho/realidade-brasileira`)**: Simulação de renda individual comparada com o percentil de rendimento nacional, estadual e polos econômicos regionais específicos (como Londrina, Joinville, Campinas, etc.) com base no IBGE/PNAD e DIEESE.
2. **Planejador de Viagens (`/viagens`)**: Planejador completo com custos diários estimados para 22 destinos nacionais e internacionais (incluindo Curitiba) com plano de poupança automatizado usando fórmula de anuidade (PMT) indexada à taxa Selic.
3. **Outras Calculadoras**: Amortização de financiamento, Juros Compostos, Viver de Renda (renda passiva), Cigarro/Vape (estimativa de custo de vícios), Divisão de Contas, Seguro Desemprego e Rescisão.

## 💻 Desenvolvimento Local

1. Instale as dependências:
   ```bash
   npm install
   ```

2. Crie um arquivo `.env.local` na raiz com as suas variáveis de ambiente:
   ```env
   NEXT_PUBLIC_ADSENSE_CLIENT_ID=ca-pub-1917277909427173
   NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
   ```

3. Inicie o servidor de desenvolvimento:
   ```bash
   npm run dev
   ```

4. Faça o build de produção estática local:
   ```bash
   npm run build
   ```
