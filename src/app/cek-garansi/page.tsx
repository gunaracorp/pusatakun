import type { Metadata } from 'next'
import Link from 'next/link'
import { PageShell } from '@/components/pusatakun/page-shell'
import { PageHero } from '@/components/pusatakun/page-hero'
import { CekGaransiClient } from '@/components/pusatakun/cek-garansi-client'
import { getPageCategories } from '@/lib/page-data'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Cek Garansi — Status Masa Garansi Pesananmu',
  description:
    'Cek masa garansi akun yang kamu beli di Pusatakun cukup dengan kode pesanan: sisa hari garansi, tanggal mulai-berakhir, dan status klaim — realtime langsung dari sistem.',
  alternates: { canonical: '/cek-garansi' },
  robots: { index: true, follow: true },
}

export default async function CekGaransiPage() {
  const categories = await getPageCategories()
  return (
    <PageShell categories={categories}>
      <PageHero
        kicker="CEK GARANSI"
        title="Garansimu Masih"
        highlight="Berlaku?"
        description="Masukkan kode pesanan untuk melihat sisa masa garansi, tanggal mulai, dan tanggal berakhir — dihitung langsung dari sistem sejak akun kamu terima."
        breadcrumb={[{ label: 'Cek Garansi' }]}
      />
      <CekGaransiClient />
      <div className="mx-auto max-w-3xl px-4 pb-16 sm:px-6 lg:px-8">
        <p className="text-center text-sm text-muted-foreground">
          Belum paham aturan garansi? Baca{' '}
          <Link href="/garansi" className="font-bold text-primary hover:underline">
            Kebijakan Garansi &amp; Pengembalian
          </Link>{' '}
          dulu ya.
        </p>
      </div>
    </PageShell>
  )
}
