import { MetadataRoute } from 'next'
 
export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://artesaniasmabe.com.ar'
  
  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    // Si tuviéramos páginas de productos individuales /product/[id], 
    // aquí haríamos un fetch a Supabase y mapearíamos las URLs.
  ]
}
