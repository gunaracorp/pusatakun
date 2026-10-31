import type { Metadata } from 'next'
import { PageShell } from '@/components/pusatakun/page-shell'
import { PageHero } from '@/components/pusatakun/page-hero'
import { UlasanClient } from '@/components/pusatakun/ulasan-client'
import { getPageCategories } from '@/lib/page-data'
import { db } from '@/lib/db'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Ulasan Pembeli — Semua Testimoni Terverifikasi',
  description:
    'Kumpulan ulasan pembeli Pusatakun: testimoni terverifikasi dengan filter rating dan urutan terbaru/tertinggi. Kejujuran adalah modal marketplace akun — baca pengalaman mereka dulu sebelum beli.',
  alternates: { canonical: '/ulasan' },
  robots: { index: true, follow: true },
}

export default async function UlasanPage() {
  const [categories, testimonials] = await Promise.all([
    getPageCategories(),
    db.testimonial.findMany({ orderBy: [{ order: 'asc' }] }),
  ])
  return (
    <PageShell categories={categories}>
      <PageHero
        kicker="ULASAN PEMBELI"
        title="Kata Mereka yang"
        highlight="Sudah Transaksi"
        description="Semua ulasan berasal dari pembeli dengan pesanan tercatat di sistem. Filter berdasarkan rating, urutkan sesuai kebutuhanmu — tanpa review palsu, tanpa penyaringan."
        breadcrumb={[{ label: 'Ulasan' }]}
      />
      <UlasanClient
        testimonials={testimonials.map((t) => ({
          id: t.id,
          name: t.name,
          city: t.city,
          role: t.role,
          content: t.content,
          rating: t.rating,
          initials: t.initials,
        }))}
      />
    </PageShell>
  )
}
