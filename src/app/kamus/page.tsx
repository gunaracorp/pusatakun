import type { Metadata } from 'next'
import { PageShell } from '@/components/pusatakun/page-shell'
import { PageHero } from '@/components/pusatakun/page-hero'
import { KamusClient } from '@/components/pusatakun/kamus-client'
import { SITE } from '@/lib/marketplace'
import { getPageCategories } from '@/lib/page-data'
import { KAMUS } from '@/lib/kamus-data'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Kamus Istilah Akun — Glosarium Jual Beli Akun A-Z',
  description:
    'Kamus lengkap istilah jual beli akun: FRESH, AMAN, PREMIUM, MONETIZE, escrow, shadowban, PVA, 2FA, engagement rate, dan puluhan istilah lain — definisi ringkas dari tim Pusatakun.',
  alternates: { canonical: '/kamus' },
  robots: { index: true, follow: true },
}

export default async function KamusPage() {
  const categories = await getPageCategories()

  const definedTermJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'DefinedTermSet',
    name: 'Kamus Istilah Jual Beli Akun Pusatakun',
    url: `${SITE.url}/kamus`,
    hasDefinedTerm: KAMUS.map((e) => ({
      '@type': 'DefinedTerm',
      name: e.term,
      description: e.definition,
      inDefinedTermSet: { '@type': 'DefinedTermSet', name: 'Kamus Istilah Jual Beli Akun Pusatakun' },
    })),
  }

  return (
    <PageShell categories={categories}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(definedTermJsonLd) }}
      />
      <PageHero
        kicker="KAMUS ISTILAH"
        title="Glosarium Jual Beli Akun"
        highlight="A sampai Z"
        description="Semua istilah yang muncul di dunia jual beli akun — dijelaskan satu kalimat tegas, tanpa jargon berputar-putar. Dari FRESH sampai shadowban."
        breadcrumb={[{ label: 'Kamus Istilah' }]}
      />
      <KamusClient />
    </PageShell>
  )
}
