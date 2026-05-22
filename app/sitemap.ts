import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const base = 'https://napontadolapis.com.br'
  return [
    { url: base, lastModified: new Date(), changeFrequency: 'monthly', priority: 1 },
    { url: `${base}/apostas`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.9 },
    { url: `${base}/apostas/probabilidades`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${base}/investimentos`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${base}/fumo`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
  ]
}
