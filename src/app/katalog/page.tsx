import type { Metadata } from 'next'
import { PageShell } from '@/components/rajaakun/page-shell'
import { Breadcrumbs } from '@/components/rajaakun/page-hero'
import { KatalogClient } from '@/components/rajaakun/katalog-client'
import { SITE } from '@/lib/marketplace'
import {
  getCatalogInitialProducts,
  getPageCategories,
} from '@/lib/page-data'
import { breadcrumbListJsonLd, productListJsonLd } from '@/lib/seo'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Katalog Akun — Semua Produk Bergaransi',
  description:
    'Katalog lengkap Raja Akun: 47+ jenis akun Instagram, TikTok, YouTube, Facebook, Telegram, WhatsApp, Gmail, Discord, game ML/FF/Genshin, hingga Netflix & Spotify. Filter kategori, level keamanan, dan harga. Semua bergaransi & ready stok.',
  alternates: { canonical: '/katalog' },
  robots: { index: true, follow: true },
}

export default async function KatalogPage() {
  const [categories, { products, total }] = await Promise.all([
    getPageCategories(),
    getCatalogInitialProducts(24),
  ])

  const jsonLd = [
    breadcrumbListJsonLd([
      { name: 'Home', item: SITE.url },
      { name: 'Katalog Akun', item: `${SITE.url}/katalog` },
    ]),
    productListJsonLd(products),
  ]

  return (
    <PageShell categories={categories}>
      {jsonLd.map((block, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(block) }}
        />
      ))}

      <div className="mx-auto max-w-7xl px-4 pt-28 sm:px-6 sm:pt-32 lg:px-8">
        <Breadcrumbs items={[{ label: 'Katalog' }]} />
      </div>

      <KatalogClient categories={categories} initialProducts={products} initialTotal={total} />
    </PageShell>
  )
}
