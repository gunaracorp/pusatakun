import type { Metadata } from 'next'
import { PageShell } from '@/components/pusatakun/page-shell'
import { PageHero } from '@/components/pusatakun/page-hero'
import { BlogIndex } from '@/components/pusatakun/blog-index'
import { SITE } from '@/lib/marketplace'
import { getPageCategories } from '@/lib/page-data'
import { BLOG_ARTICLES, BLOG_CATEGORIES } from '@/lib/blog-data'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Blog Pusatakun — Panduan Jual Beli Akun, Keamanan & Insight Pasar',
  description:
    'Artikel edukasi dari tim Pusatakun: panduan aman membeli akun, arti level FRESH/AMAN/PREMIUM/MONETIZE, cara kerja escrow, panduan penjual, dan insight harga akun terkini.',
  alternates: { canonical: '/blog' },
  robots: { index: true, follow: true },
}

export default async function BlogPage() {
  const categories = await getPageCategories()

  const blogJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Blog',
    name: `Blog ${SITE.name}`,
    url: `${SITE.url}/blog`,
    description:
      'Artikel edukasi jual beli akun media sosial: panduan pembeli, panduan penjual, keamanan, dan insight pasar dari tim Pusatakun.',
    inLanguage: 'id-ID',
    publisher: { '@id': `${SITE.url}/#organization` },
    blogPost: BLOG_ARTICLES.map((a) => ({
      '@type': 'BlogPosting',
      headline: a.title,
      description: a.excerpt,
      datePublished: a.date,
      author: { '@type': 'Organization', name: SITE.name },
      url: `${SITE.url}/blog/${a.slug}`,
    })),
  }

  return (
    <PageShell categories={categories}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blogJsonLd) }}
      />
      <PageHero
        kicker="BLOG PUSATAKUN"
        title="Belajar Jual Beli Akun"
        highlight="Cara yang Benar"
        description="Panduan praktis, standar keamanan, dan insight pasar — ditulis tim kurasi yang memproses transaksi akun setiap hari."
        breadcrumb={[{ label: 'Blog' }]}
      />
      <BlogIndex articles={BLOG_ARTICLES} categories={[...BLOG_CATEGORIES]} />
    </PageShell>
  )
}
