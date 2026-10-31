import type { MetadataRoute } from 'next'
import { SITE } from '@/lib/marketplace'
import { getAllProductSlugs } from '@/lib/page-data'
import { getAllBlogSlugs } from '@/lib/blog-data'

export const dynamic = 'force-dynamic'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date()

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: SITE.url, lastModified: now, changeFrequency: 'daily', priority: 1 },
    { url: `${SITE.url}/katalog`, lastModified: now, changeFrequency: 'daily', priority: 0.9 },
    { url: `${SITE.url}/blog`, lastModified: now, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${SITE.url}/lacak`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${SITE.url}/cek-garansi`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${SITE.url}/kalkulator`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${SITE.url}/statistik`, lastModified: now, changeFrequency: 'daily', priority: 0.7 },
    { url: `${SITE.url}/promo`, lastModified: now, changeFrequency: 'daily', priority: 0.7 },
    { url: `${SITE.url}/kamus`, lastModified: now, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${SITE.url}/ulasan`, lastModified: now, changeFrequency: 'weekly', priority: 0.6 },
    { url: `${SITE.url}/mitra`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${SITE.url}/pedoman-media`, lastModified: now, changeFrequency: 'yearly', priority: 0.4 },
    { url: `${SITE.url}/peta-situs`, lastModified: now, changeFrequency: 'monthly', priority: 0.4 },
    { url: `${SITE.url}/pusat-bantuan`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${SITE.url}/masuk`, lastModified: now, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${SITE.url}/daftar`, lastModified: now, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${SITE.url}/tentang`, lastModified: now, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${SITE.url}/kontak`, lastModified: now, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${SITE.url}/garansi`, lastModified: now, changeFrequency: 'yearly', priority: 0.5 },
    { url: `${SITE.url}/syarat-ketentuan`, lastModified: now, changeFrequency: 'yearly', priority: 0.3 },
    { url: `${SITE.url}/kebijakan-privasi`, lastModified: now, changeFrequency: 'yearly', priority: 0.3 },
    // Catatan: /admin & /dashboard sengaja TIDAK didaftarkan (area privat, noindex).
  ]

  // Semua halaman detail produk (SEO: 1 URL per produk).
  const products = await getAllProductSlugs()
  const productRoutes: MetadataRoute.Sitemap = products.map((p) => ({
    url: `${SITE.url}/produk/${p.slug}`,
    lastModified: p.updatedAt,
    changeFrequency: 'weekly',
    priority: 0.8,
  }))

  // Semua artikel blog (SEO & AEO: konten edukasi).
  const blogRoutes: MetadataRoute.Sitemap = getAllBlogSlugs().map((slug) => ({
    url: `${SITE.url}/blog/${slug}`,
    lastModified: now,
    changeFrequency: 'monthly',
    priority: 0.6,
  }))

  return [...staticRoutes, ...productRoutes, ...blogRoutes]
}
