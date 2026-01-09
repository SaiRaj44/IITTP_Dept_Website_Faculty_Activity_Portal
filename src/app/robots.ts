import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/api/', '/signin/', '/dashboard/', '/asset-management/', '/activity-portal/', '/website-updates/'],
    },
    sitemap: 'https://cse.iittp.ac.in/sitemap.xml', // Replace with your actual domain
  }
}