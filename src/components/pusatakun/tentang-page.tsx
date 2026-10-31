import {
  ArrowRight,
  BadgeCheck,
  Building2,
  Crown,
  HeartHandshake,
  MapPin,
  MessageCircle,
  Scale,
  ShieldCheck,
  Sparkles,
  Timer,
} from 'lucide-react'
import Link from 'next/link'
import { db } from '@/lib/db'
import { CountUp, Reveal } from './motion-primitives'
import { PageHero } from './page-hero'
import { PageShell } from './page-shell'
import { SITE, formatIDR, waLink } from '@/lib/marketplace'
import { getPageCategories } from '@/lib/page-data'

const VALUES = [
  {
    icon: ShieldCheck,
    title: 'Aman Itu Wajib, Bukan Bonus',
    body: 'Setiap listing wajib lolos kurasi admin. Akun hasil bajakan, phishing, atau perampasan kami tolak dan bekukan tanpa kompromi.',
  },
  {
    icon: Scale,
    title: 'Adil ke Dua Belah Pihak',
    body: 'Aturan yang sama berlaku untuk pembeli dan penjual. Klaim garansi ditimbang dari bukti, bukan dari siapa yang lebih banyak bicara.',
  },
  {
    icon: Timer,
    title: 'Cepat Itu Standar',
    body: 'Serah terima instan 5–15 menit pada jam normal, klaim garansi diverifikasi maksimal 1×24 jam. Admin online 24/7 — manusia asli, bukan bot.',
  },
  {
    icon: HeartHandshake,
    title: 'Transparan Sejak Awal',
    body: 'Harga yang kamu lihat adalah harga yang kamu bayar. Detail produk, level keamanan, dan masa garansi tertulis di tiap kartu produk.',
  },
] as const

export async function TentangPage() {
  const categories = await getPageCategories()
  const [totalProducts, agg] = await Promise.all([
    db.product.count(),
    db.product.aggregate({ _sum: { sold: true, stock: true }, _avg: { rating: true } }),
  ])
  const totalSold = agg._sum.sold ?? 0
  const avgRating = Math.round((agg._avg.rating ?? 4.9) * 10) / 10
  const hargaMulai = await db.product.aggregate({ _min: { price: true } })

  const stats = [
    { value: totalProducts, suffix: '+', label: 'Jenis akun dalam katalog' },
    { value: totalSold, suffix: '+', label: 'Akun berhasil terjual' },
    { value: avgRating, suffix: ' / 5', label: 'Rating kepuasan pembeli', decimals: 1 },
    { value: 24, suffix: '/7', label: 'Admin siaga setiap hari' },
  ] as const

  return (
    <PageShell categories={categories}>
      <PageHero
        kicker="TENTANG KAMI"
        title="Pusat Segala"
        highlight="Akun Premium"
        description={`${SITE.name} berdiri sejak ${SITE.founded} dengan satu tujuan: membuat jual beli akun digital terasa tenang — jelas aturannya, terjaga keamanannya, dan selalu ada manusia yang bisa diajak bicara.`}
        breadcrumb={[{ label: 'Tentang Kami' }]}
      />

      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Statistik */}
        <Reveal>
          <dl className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            {stats.map((s) => (
              <div key={s.label} className="glass rounded-2xl p-6 text-center">
                <dd className="text-3xl font-black tracking-tight text-primary sm:text-4xl">
                  <CountUp to={s.value} suffix={s.suffix} decimals={'decimals' in s ? s.decimals : 0} />
                </dd>
                <dt className="mt-2 text-xs font-medium leading-relaxed text-muted-foreground sm:text-sm">
                  {s.label}
                </dt>
              </div>
            ))}
          </dl>
        </Reveal>

        {/* Cerita */}
        <div className="mt-16 grid gap-10 lg:grid-cols-2 lg:items-center">
          <Reveal>
            <span className="glass inline-flex min-h-[32px] items-center gap-2 rounded-full px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.22em] text-primary">
              <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
              Cerita Kami
            </span>
            <h2 className="mt-4 text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl">
              Lahir dari masalah yang kami alami sendiri
            </h2>
            <div className="mt-4 space-y-4 text-[15px] leading-relaxed text-muted-foreground">
              <p>
                Berdagang akun digital dulu terasa seperti judi: pembeli takut akun diambil kembali,
                penjual takut uangnya tidak masuk, dan harga sering berubah tanpa alasan jelas.
                Kami tahu karena kami juga pernah jadi pembeli dan penjual yang kecewa.
              </p>
              <p>
                Sejak {SITE.founded}, {SITE.name} membangun caranya sendiri: katalog yang jujur
                (level keamanan FRESH/AMAN/PREMIUM/MONETIZE di tiap produk), kurasi admin untuk
                setiap listing penjual, checkout yang dipandu langsung oleh admin manusia lewat
                WhatsApp, dan garansi tertulis di setiap produk.
              </p>
              <p>
                Hari ini, ribuan akun sudah berpindah tangan melalui kami — dari akun Instagram
                fresh sampai akun game monetize — dengan rating kepuasan{' '}
                <strong className="text-foreground">{avgRating.toFixed(1)}/5</strong> dan harga mulai{' '}
                <strong className="text-foreground">{formatIDR(hargaMulai._min.price ?? 0)}</strong>.
              </p>
            </div>
          </Reveal>

          {/* Identitas hukum */}
          <Reveal delay={0.1}>
            <div className="glass rounded-2xl p-6 sm:p-8">
              <p className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.22em] text-primary">
                <Building2 className="h-4 w-4" aria-hidden="true" />
                Identitas Resmi
              </p>
              <div className="mt-5 space-y-4 text-sm">
                <div className="flex items-start gap-3">
                  <Crown className="mt-0.5 h-5 w-5 shrink-0 text-primary" aria-hidden="true" />
                  <div>
                    <p className="font-bold text-foreground">{SITE.name}</p>
                    <p className="mt-0.5 text-muted-foreground">
                      Dikelola oleh <strong className="text-foreground">{SITE.company}</strong> — didukung
                      sistem oleh {SITE.companySupport}.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-primary" aria-hidden="true" />
                  <div>
                    <p className="font-bold text-foreground">Kantor</p>
                    <p className="mt-0.5 leading-relaxed text-muted-foreground">{SITE.address}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <BadgeCheck className="mt-0.5 h-5 w-5 shrink-0 text-primary" aria-hidden="true" />
                  <div>
                    <p className="font-bold text-foreground">Kanal Resmi</p>
                    <p className="mt-0.5 leading-relaxed text-muted-foreground">
                      WhatsApp {SITE.whatsappDisplay} · {SITE.email} · {SITE.domain}
                    </p>
                  </div>
                </div>
              </div>
              <a
                href={waLink('Halo Admin Pusatakun! Saya kenalan dulu, mau tanya-tanya soal layanan kalian.')}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-6 inline-flex min-h-[44px] items-center gap-2 rounded-xl bg-primary px-5 text-sm font-bold text-primary-foreground shadow-lg shadow-primary/25 transition-transform hover:scale-[1.02]"
              >
                <MessageCircle className="h-4 w-4" aria-hidden="true" />
                Sapa Admin Kami
              </a>
            </div>
          </Reveal>
        </div>

        {/* Nilai */}
        <div className="mt-16">
          <Reveal className="text-center">
            <h2 className="text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl">
              Empat nilai yang <span className="text-gradient-gold">tidak bisa ditawar</span>
            </h2>
          </Reveal>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {VALUES.map((v, i) => (
              <Reveal key={v.title} delay={i * 0.08}>
                <div className="glass h-full rounded-2xl p-6">
                  <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/15">
                    <v.icon className="h-5 w-5 text-primary" aria-hidden="true" />
                  </span>
                  <h3 className="mt-4 text-sm font-extrabold text-foreground">{v.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{v.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>

        {/* CTA */}
        <Reveal className="mt-16">
          <div className="rounded-2xl border border-primary/30 bg-primary/10 p-8 text-center sm:p-10">
            <h2 className="text-xl font-extrabold text-foreground sm:text-2xl">
              Siap mulai? Katalog kami buka 24 jam.
            </h2>
            <p className="mx-auto mt-2 max-w-xl text-sm leading-relaxed text-muted-foreground">
              Jelajahi {totalProducts}+ jenis akun yang sudah dikurasi, atau daftarkan akunmu untuk
              dijual — gratis, dipandu admin dari kurasi sampai terjual.
            </p>
            <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link
                href="/katalog"
                className="inline-flex min-h-[44px] items-center gap-2 rounded-xl bg-primary px-6 text-sm font-bold text-primary-foreground shadow-lg shadow-primary/25 transition-transform hover:scale-[1.02]"
              >
                Lihat Katalog Akun
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
              <Link
                href="/pusat-bantuan"
                className="inline-flex min-h-[44px] items-center gap-2 rounded-xl border border-primary/40 px-6 text-sm font-bold text-primary transition-colors hover:bg-primary/10"
              >
                Pelajari Cara Kerjanya
              </Link>
            </div>
          </div>
        </Reveal>
      </div>
    </PageShell>
  )
}
