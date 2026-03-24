import { MetadataRoute } from 'next'
 
export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://artesanias-mabe.vercel.app' // Cambiar por el dominio final del usuario
  
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
