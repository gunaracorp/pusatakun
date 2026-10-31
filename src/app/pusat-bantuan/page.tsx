import type { Metadata } from 'next'
import { db } from '@/lib/db'
import { PageHero } from '@/components/pusatakun/page-hero'
import { PageShell } from '@/components/pusatakun/page-shell'
import { HelpCenter } from '@/components/pusatakun/help-center'
import { faqJsonLd } from '@/lib/seo'
import { SITE } from '@/lib/marketplace'
import { getPageCategories } from '@/lib/page-data'
import type { FaqDTO } from '@/lib/marketplace'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Pusat Bantuan',
  description:
    'Pusat Bantuan Pusatakun — cara membeli akun 4 langkah, cara jadi penjual, arti level FRESH/AMAN/PREMIUM/MONETIZE, dan jawaban pertanyaan yang paling sering ditanyakan.',
  alternates: { canonical: '/pusat-bantuan' },
  robots: { index: true, follow: true },
}

export default async function PusatBantuanPage() {
  const [categories, faqsRaw] = await Promise.all([
    getPageCategories(),
    db.faq.findMany({ orderBy: { order: 'asc' } }),
  ])
  const faqs: FaqDTO[] = faqsRaw.map((f) => ({ id: f.id, question: f.question, answer: f.answer }))

  return (
    <PageShell categories={categories}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd(faqs)) }}
      />
      <PageHero
        kicker="PUSAT BANTUAN"
        title="Semua yang perlu kamu tahu,"
        highlight="satu halaman"
        description={`Panduan singkat membeli & menjual akun di ${SITE.name} — lengkap dengan arti label level akun dan jawaban pertanyaan populer.`}
        breadcrumb={[{ label: 'Pusat Bantuan' }]}
      />
      <HelpCenter faqs={faqs} />
    </PageShell>
  )
}
