import type { Metadata } from 'next'
import { PageShell } from '@/components/pusatakun/page-shell'
import { PageHero } from '@/components/pusatakun/page-hero'
import { LacakClient } from '@/components/pusatakun/lacak-client'
import { getPageCategories } from '@/lib/page-data'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Lacak Pesanan — Cek Status Pesananmu Realtime',
  description:
    'Lacak status pesanan akunmu di Pusatakun cukup dengan kode pesanan: menunggu pembayaran, diproses, selesai, atau dibatalkan — realtime langsung dari sistem, tanpa perlu chat admin.',
  alternates: { canonical: '/lacak' },
  robots: { index: true, follow: true },
}

export default async function LacakPage() {
  const categories = await getPageCategories()
  return (
    <PageShell categories={categories}>
      <PageHero
        kicker="LACAK PESANAN"
        title="Pesananmu Sekarang"
        highlight="Di Mana?"
        description="Masukkan kode pesanan (contoh: ORD-A1B2C3) untuk melihat status terkini langsung dari sistem Pusatakun — realtime, tanpa perlu chat admin."
        breadcrumb={[{ label: 'Lacak Pesanan' }]}
      />
      <LacakClient />
    </PageShell>
  )
}
