import { MetadataRoute } from 'next'
import { destinations } from '@/config/travel'

export default function sitemap(): MetadataRoute.Sitemap {
  const base = 'https://apontadolapis.com.br'
  const now = new Date()

  const destinationPages: MetadataRoute.Sitemap = destinations.map((d) => ({
    url: `${base}/viagens/${d.id}`,
    lastModified: now,
    changeFrequency: 'monthly',
    priority: 0.7,
  }))

  return [
    { url: base, lastModified: now, changeFrequency: 'monthly', priority: 1 },
    { url: `${base}/privacidade`, lastModified: now, changeFrequency: 'yearly', priority: 0.3 },
    { url: `${base}/glossario`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${base}/sobre`, lastModified: now, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${base}/trabalho/uber-vs-carro`, lastModified: now, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${base}/apostas`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${base}/apostas/probabilidades`, lastModified: now, changeFrequency: 'monthly', priority: 0.75 },
    { url: `${base}/fale-conosco`, lastModified: now, changeFrequency: 'yearly', priority: 0.3 },
    { url: `${base}/investimentos`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${base}/investimentos/amortizacao`, lastModified: now, changeFrequency: 'monthly', priority: 0.95 },
    { url: `${base}/investimentos/itbi-e-cartorio`, lastModified: now, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${base}/investimentos/reserva-de-emergencia`, lastModified: now, changeFrequency: 'monthly', priority: 0.95 },
    { url: `${base}/investimentos/viver-de-renda`, lastModified: now, changeFrequency: 'monthly', priority: 0.85 },
    { url: `${base}/investimentos/parcelado-ou-a-vista`, lastModified: now, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${base}/investimentos/fuga-do-rotativo`, lastModified: now, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${base}/investimentos/financiamento-ou-consorcio`, lastModified: now, changeFrequency: 'monthly', priority: 0.95 },
    { url: `${base}/juros-compostos`, lastModified: now, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${base}/fumo`, lastModified: now, changeFrequency: 'monthly', priority: 0.75 },
    { url: `${base}/dividir`, lastModified: now, changeFrequency: 'monthly', priority: 0.75 },
    { url: `${base}/trabalho/realidade-brasileira`, lastModified: now, changeFrequency: 'monthly', priority: 0.95 },
    { url: `${base}/trabalho/imposto-de-renda`, lastModified: now, changeFrequency: 'monthly', priority: 0.95 },
    { url: `${base}/trabalho/rescisao`, lastModified: now, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${base}/trabalho/seguro-desemprego`, lastModified: now, changeFrequency: 'monthly', priority: 0.85 },
    { url: `${base}/viagens`, lastModified: now, changeFrequency: 'monthly', priority: 0.85 },
    { url: `${base}/viagens/custo-de-vida`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${base}/viagens/milhas-ou-dinheiro`, lastModified: now, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${base}/viagens/planejar`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    ...destinationPages,
  ]
}
