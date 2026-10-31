import type { Metadata } from 'next'
import Link from 'next/link'
import { PageShell } from '@/components/pusatakun/page-shell'
import { PageHero } from '@/components/pusatakun/page-hero'
import { PromoClient } from '@/components/pusatakun/promo-client'
import { getPageCategories } from '@/lib/page-data'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Promo & Kupon — Diskon Berjalan di Pusatakun',
  description:
    'Semua promo Pusatakun dalam satu halaman: flash sale harian dengan hitung mundur, kupon PUSATA40 diskon s/d 40%, bundel reseller, dan garansi harga — sebut kuponnya ke admin saat checkout.',
  alternates: { canonical: '/promo' },
  robots: { index: true, follow: true },
}

export default async function PromoPage() {
  const categories = await getPageCategories()
  return (
    <PageShell categories={categories}>
      <PageHero
        kicker="PROMO & KUPON"
        title="Hemat Maksimal,"
        highlight="Transparan"
        description="Tidak ada harga siluman: semua potongan ada di halaman ini dengan syarat yang jelas. Salin kuponnya, sebut ke admin saat checkout, selesai."
        breadcrumb={[{ label: 'Promo' }]}
      />
      <PromoClient />
      <div className="mx-auto max-w-3xl px-4 pb-16 sm:px-6 lg:px-8">
        <p className="text-center text-sm text-muted-foreground">
          Ingin promo khusus untuk pembelian jumlah banyak?{' '}
          <Link href="/kontak" className="font-bold text-primary hover:underline">
            Ngobrol dengan admin
          </Link>{' '}
          — negosiasi bundel selalu terbuka.
        </p>
      </div>
    </PageShell>
  )
}
