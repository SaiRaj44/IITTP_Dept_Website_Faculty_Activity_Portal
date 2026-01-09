import { NextResponse } from 'next/server'
import connectDB from '@/app/lib/mongodb'
import FacultyInformation from '@/app/models/website/faculty-information'

export const dynamic = 'force-dynamic'

export async function GET() {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://cse.iittp.ac.in'

  // Static routes
  const staticRoutes = [
    '',
    '/academics/labs',
    '/academics/programmes',
    '/activities/announcements',
    '/activities/awards-honours',
    '/activities/guest-lectures',
    '/activities/placements',
    '/activity-portal',
    '/activity-portal/attended-events',
    '/activity-portal/books',
    '/activity-portal/equipments',
    '/activity-portal/fellowships',
    '/activity-portal/honours-awards',
    '/activity-portal/journal-editorial-boards',
    '/activity-portal/lectures-delivered',
    '/activity-portal/mou',
    '/activity-portal/organized-events',
    '/activity-portal/patents',
    '/activity-portal/projects',
    '/activity-portal/publications',
    '/activity-portal/software-designed',
    '/activity-portal/sponsored-projects',
    '/activity-portal/visit-abroad',
    '/activity-portal/visitors',
    '/asset-management',
    '/asset-management/All-Assets',
    '/asset-management/locations',
    '/asset-management/My-Asset-List',
    '/asset-management/vendors',
    '/dashboard',
    '/people/alumni',
    '/people/B.Tech',
    '/people/faculty',
    '/people/graduands',
    '/people/M.Tech',
    '/people/research-scholars',
    '/people/staff',
    '/people/students',
    '/reports',
    '/research/areas',
    '/research/books',
    '/research/patents',
    '/research/projects',
    '/research/publications',
    '/research/sponsored-projects',
    '/signin',
    '/website-updates',
    '/website-updates/announcements',
    '/website-updates/faculty-information',
    '/website-updates/graduands-information',
    '/website-updates/news',
    '/website-updates/placement-statistics',
    '/website-updates/scholar-information',
    '/website-updates/slider-images',
    '/website-updates/staff-information',
    '/website-updates/student-information',
  ]

  const staticUrls = staticRoutes.map(route => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
  }))

  // Dynamic faculty routes
  let facultyUrls: { url: string; lastModified: Date }[] = []
  try {
    console.log('Attempting to connect to database for sitemap generation...')
    await connectDB()
    console.log('Database connected successfully')

    const faculty = await FacultyInformation.find(
      { published: true, isActive: true },
      'profileUrl updatedAt'
    )
    console.log(`Found ${faculty.length} faculty records`)

    facultyUrls = faculty
      .filter(fac => fac.profileUrl && !fac.profileUrl.startsWith('http') && fac.profileUrl.trim() !== '' && fac.profileUrl !== '#')
      .map(fac => ({
        url: `${baseUrl}/people/faculty/${fac.profileUrl}`,
        lastModified: fac.updatedAt || new Date(),
      }))

    console.log(`Generated ${facultyUrls.length} faculty URLs for sitemap`)
  } catch (error) {
    console.error('Error fetching faculty for sitemap:', error)
    console.error('MongoDB URI:', process.env.MONGODB_URI)
  }

  const allUrls = [...staticUrls, ...facultyUrls]

  // Generate XML
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<?xml-stylesheet type="text/xsl" href="/sitemap.xsl"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allUrls.map(({ url, lastModified }) => `  <url>
    <loc>${url}</loc>
    <lastmod>${lastModified.toISOString()}</lastmod>
  </url>`).join('\n')}
</urlset>`

  return new NextResponse(xml, {
    headers: {
      'Content-Type': 'application/xml',
    },
  })
}