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
    { url: `${base}/apostas`, lastModified: now, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${base}/apostas/probabilidades`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${base}/investimentos`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${base}/fumo`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${base}/viagens`, lastModified: now, changeFrequency: 'monthly', priority: 0.85 },
    { url: `${base}/viagens/planejar`, lastModified: now, changeFrequency: 'monthly', priority: 0.85 },
    ...destinationPages,
  ]
}
