import type { Metadata } from 'next'
import { PageShell } from '@/components/pusatakun/page-shell'
import { PageHero } from '@/components/pusatakun/page-hero'
import { MediaKitClient } from '@/components/pusatakun/media-kit-client'
import { SITE } from '@/lib/marketplace'
import { getPageCategories } from '@/lib/page-data'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Pedoman Media — Brand Kit & Aset Resmi Pusatakun',
  description:
    'Aset brand resmi Pusatakun untuk media dan mitra: palet warna royal gold dengan kode hex, logo resmi, tipografi, nada bicara, dan identitas perusahaan. Gunakan aset ini saat menyebut Pusatakun.',
  alternates: { canonical: '/pedoman-media' },
  robots: { index: true, follow: true },
}

export default async function PedomanMediaPage() {
  const categories = await getPageCategories()
  return (
    <PageShell categories={categories}>
      <PageHero
        kicker="PEDOMAN MEDIA"
        title="Brand Kit Resmi"
        highlight="Pusatakun"
        description="Menulis tentang Pusatakun atau membuat materi kolaborasi? Ini sumber tunggal aset resmi — nama, warna, logo, dan nada bicara. Klik warna untuk menyalin kode hexnya."
        breadcrumb={[{ label: 'Pedoman Media' }]}
      />
      <MediaKitClient />
      <div className="mx-auto max-w-5xl px-4 pb-16 sm:px-6 lg:px-8">
        <div className="glass rounded-2xl p-6 sm:p-8">
          <h2 className="text-sm font-extrabold uppercase tracking-[0.2em] text-primary">
            Profil Singkat untuk Publikasi (Boilerplate)
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
            <strong className="text-foreground">{SITE.name}</strong> ({SITE.domain}) adalah marketplace jual
            beli akun media sosial, game, dan streaming terlengkap &amp; terpercaya #1 di Indonesia. Berdiri
            sejak {SITE.founded} dan dioperasikan oleh {SITE.company}, Pusatakun mengutamakan transaksi aman
            lewat escrow, kurasi manual setiap listing, garansi tertulis per produk, dan dukungan manusia asli
            24/7 via WhatsApp {SITE.whatsappDisplay}.
          </p>
          <dl className="mt-6 grid gap-3 text-sm sm:grid-cols-2">
            <div className="rounded-xl border border-border bg-background/40 p-4">
              <dt className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Nama resmi</dt>
              <dd className="mt-1 font-bold text-foreground">{SITE.name} (satu kata, P besar)</dd>
            </div>
            <div className="rounded-xl border border-border bg-background/40 p-4">
              <dt className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Domain resmi</dt>
              <dd className="mt-1 font-bold text-foreground">{SITE.domain}</dd>
            </div>
            <div className="rounded-xl border border-border bg-background/40 p-4">
              <dt className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Kontak media</dt>
              <dd className="mt-1 font-bold text-foreground">{SITE.email}</dd>
            </div>
            <div className="rounded-xl border border-border bg-background/40 p-4">
              <dt className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Badan hukum</dt>
              <dd className="mt-1 font-bold text-foreground">{SITE.company}</dd>
            </div>
          </dl>
        </div>
      </div>
    </PageShell>
  )
}
