import type { Metadata } from 'next'
import Link from 'next/link'
import { PageShell } from '@/components/pusatakun/page-shell'
import { PageHero } from '@/components/pusatakun/page-hero'
import { KalkulatorClient } from '@/components/pusatakun/kalkulator-client'
import { getPageCategories } from '@/lib/page-data'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Kalkulator Reseller — Hitung Profit Jual Beli Akunmu',
  description:
    'Kalkulator profit reseller akun gratis: atur harga beli, harga jual, dan jumlah transaksi bulanan untuk melihat penerimaan bersih 90%, komisi platform, margin, dan ROI secara realtime.',
  alternates: { canonical: '/kalkulator' },
  robots: { index: true, follow: true },
}

export default async function KalkulatorPage() {
  const categories = await getPageCategories()
  return (
    <PageShell categories={categories}>
      <PageHero
        kicker="KALKULATOR RESELLER"
        title="Hitung Untungmu"
        highlight="Sebelum Jualan"
        description="Geser, lihat hasil. Model komisi Pusatakun transparan: kamu menerima 90% harga jual, platform 10% — tanpa biaya pendaftaran, tanpa biaya listing."
        breadcrumb={[{ label: 'Kalkulator Reseller' }]}
      />
      <KalkulatorClient />
      <div className="mx-auto max-w-3xl px-4 pb-16 sm:px-6 lg:px-8">
        <p className="text-center text-sm text-muted-foreground">
          Siap mulai?{' '}
          <Link href="/mitra" className="font-bold text-primary hover:underline">
            Buka toko gratis di Pusatakun →
          </Link>
        </p>
      </div>
    </PageShell>
  )
}
