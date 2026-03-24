import { MetadataRoute } from 'next'
 
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: '/admin/', // Evitar que Google indexe el panel de admin
    },
    sitemap: 'https://artesanias-mabe.vercel.app/sitemap.xml',
  }
}
