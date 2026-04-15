import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://www.travelerlocal.ai'
  const lastModified = new Date()

  return [
    { url: baseUrl, lastModified, changeFrequency: 'daily', priority: 1 },
    { url: `${baseUrl}/chat`, lastModified, changeFrequency: 'daily', priority: 0.9 },
    { url: `${baseUrl}/food`, lastModified, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${baseUrl}/transport`, lastModified, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${baseUrl}/trips`, lastModified, changeFrequency: 'weekly', priority: 0.7 },
    { url: `${baseUrl}/explore`, lastModified, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${baseUrl}/essentials`, lastModified, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${baseUrl}/hotels`, lastModified, changeFrequency: 'daily', priority: 0.7 },
    { url: `${baseUrl}/privacy`, lastModified, changeFrequency: 'monthly', priority: 0.3 },
    { url: `${baseUrl}/terms`, lastModified, changeFrequency: 'monthly', priority: 0.3 },
  ]
}
