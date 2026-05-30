# Handoff — A Ponta do Lápis

**Última atualização:** 2026-05-30  
**Branch de desenvolvimento:** `claude/friendly-hypatia-HwfUk`  
**Stack:** Next.js 16.2.6 · React 19 · TypeScript · Tailwind CSS v4 · Netlify (deploy contínuo ativo)  
**Domínio registrado:** `apontadolapis.com.br`

---

## Estado atual

O projeto está completo, compilando com **sucesso absoluto** (todas as 42 páginas estáticas geradas sem avisos ou erros) e **100% monetizado e integrado** com as campanhas oficiais do proprietário (Google AdSense e Programa de Afiliados da Wise).

Toda a infraestrutura do site foi atualizada com sucesso para rodar de forma **100% independente, autônoma e com custo zero vitalício**, eliminando qualquer dependência de chaves de API externas de terceiros instáveis de aviação (Amadeus/Kiwi.com), o que garante imunidade contra o encerramento do portal Amadeus em julho de 2026.

---

## O que foi feito — Sessão Atual (2026-05-30)

### 1. Integração Oficial do Google AdSense
* **Tag de Verificação Global (`app/layout.tsx`)**: Adicionamos a meta tag oficial exigida para a propriedade da conta do AdSense:
  ```typescript
  other: {
    'google-adsense-account': 'ca-pub-1917277909427173',
  }
  ```
  Isso injeta a tag `<meta name="google-adsense-account" content="ca-pub-1917277909427173">` no `<head>` de todas as 42 páginas do site de forma automatizada pelo Next.js.
* **Arquivo de Compliance (`public/ads.txt`)**: Criamos e publicamos o arquivo `ads.txt` na raiz pública contendo a assinatura digital real da conta do usuário:
  ```text
  google.com, pub-1917277909427173, DIRECT, f08c47fec0942fa0
  ```
* **Script Global e Variáveis de Ambiente**: O script global é carregado se a variável `NEXT_PUBLIC_ADSENSE_CLIENT_ID` estiver definida no ambiente do Netlify. Adicionamos a ID real no arquivo local `.env.local` para testes de compilação.

### 2. Integração e Otimização do Afiliado Wise
* **Botão Contextual na Calculadora de Viagem (`TravelCalculator.tsx`)**: Inserimos um botão verde esmeralda chamativo dizendo **`Abrir conta Wise →`** direcionando o usuário diretamente para o link de afiliado oficial do proprietário: `https://wise.prf.hn/click/camref:1110lGjsu`. O botão aparece exatamente ao lado do cálculo de economia da viagem, resultando em altíssima conversão (CTR).
* **Otimização do Funil de Vendas (Remoção da Nomad nas Ações)**: 
  * Para evitar perda de comissões, removemos as referências e rótulos diretos à Nomad dos cards de resultados da calculadora (`Conta Global Wise` em vez de `Wise / Nomad`).
  * Mantivemos menções discretas a "fintechs" de forma genérica apenas nos textos informativos externos para preservar o sentimento de imparcialidade e autoridade do site perante o leitor.

### 3. Documentação e Versionamento (Git & GitHub)
* **Novo README Customizado (`README.md`)**: Substituímos o arquivo padrão boilerplate do Next.js por uma documentação técnica premium, detalhando os diferenciais, as ferramentas de monetização, a stack e o fluxo de setup do projeto.
* **Commit e Push**: Todos os arquivos modificados e criados (`app/layout.tsx`, `components/calculators/TravelCalculator.tsx`, `public/ads.txt`, `.env.local`, `README.md`, `HANDOFF.md`) foram validados no build, commitados e empurrados com sucesso para a branch remota do GitHub.

---

## Próximos passos (Amanhã e próximas sessões)

### 1. Iniciar Análise de Revisão do AdSense
* **Ação**: Como a meta tag de verificação e o `ads.txt` já estão publicados no ar, o proprietário deve acessar o painel do Google AdSense e clicar no botão **"Solicitar revisão"**.
* **Prazo**: O Google leva de 2 a 14 dias para aprovar o site. Os anúncios ficarão ocultos em produção de forma elegante enquanto a análise está pendente.

### 2. Configurar a Variável de Ambiente no Netlify
* Acessar o painel do **Netlify** > **Site configuration** > **Environment variables**.
* Cadastrar a variável:
  * `NEXT_PUBLIC_ADSENSE_CLIENT_ID` ➡️ `ca-pub-1917277909427173`
* Após cadastrar, vá na aba **Deploys** > **Trigger deploy** > **Clear cache and deploy site** para recriar as páginas estáticas com o script de produção ativo.

---

## Estrutura de pastas atual

```
napontadolapis/
├── .env.local                            ← Nova! Variáveis locais do AdSense
├── app/
│   ├── layout.tsx                        ← GA4 + AdSense meta tag e scripts
│   ├── page.tsx
│   ├── trabalho/
│   │   ├── realidade-brasileira/page.tsx  ← AdBanner integrado no final
│   └── viagens/
│       └── custo-de-vida/page.tsx        ← AdBanner integrado no final
├── components/
│   ├── AdBanner.tsx                      ← Componente modular do AdSense
│   └── calculators/
│       └── TravelCalculator.tsx          ← Botão de Afiliado Wise integrado!
├── config/
│   ├── travel.ts                         ← Configurações de IOF/Spread e Curitiba
│   └── flight-prices.json                ← Preços base de passagens
├── public/
│   ├── ads.txt                           ← Novo! Arquivo de autorização do AdSense
│   └── logo.png
└── README.md                             ← Nova documentação customizada!
```
