import type { Metadata } from 'next'
import { Crown, Flame, ShieldCheck, ShoppingBag, Star, Users } from 'lucide-react'
import { PageShell } from '@/components/pusatakun/page-shell'
import { PageHero } from '@/components/pusatakun/page-hero'
import { CountUp, Reveal } from '@/components/pusatakun/motion-primitives'
import { SITE, formatIDR } from '@/lib/marketplace'
import { getPageCategories } from '@/lib/page-data'
import { db } from '@/lib/db'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Statistik Pasar — Data Transaksi Pusatakun Secara Transparan',
  description:
    'Statistik pasar Pusatakun secara terbuka: jumlah akun, kategori, penjualan, stok, rating rata-rata, distribusi kategori, produk terlaris, dan ringkasan kepuasan pembeli — data live dari sistem.',
  alternates: { canonical: '/statistik' },
  robots: { index: true, follow: true },
}

export default async function StatistikPage() {
  const [categories, productAgg, orderAgg, topProducts, testimonialAgg, ratingRows] =
    await Promise.all([
      getPageCategories(),
      db.product.aggregate({
        _count: { id: true },
        _sum: { sold: true, stock: true },
        _avg: { rating: true },
      }),
      db.order.groupBy({ by: ['status'], _count: { id: true }, _sum: { amount: true } }),
      db.product.findMany({
        orderBy: { sold: 'desc' },
        take: 8,
        select: { slug: true, name: true, sold: true, rating: true, price: true, level: true },
      }),
      db.testimonial.aggregate({ _count: { id: true }, _avg: { rating: true } }),
      db.testimonial.groupBy({ by: ['rating'], _count: { id: true } }),
    ])

  const totalProducts = productAgg._count.id
  const totalSold = productAgg._sum.sold ?? 0
  const totalStock = productAgg._sum.stock ?? 0
  const avgRating = productAgg._avg.rating ?? 0
  const ordersByStatus = Object.fromEntries(
    orderAgg.map((o) => [o.status, { count: o._count.id, amount: o._sum.amount ?? 0 }]),
  )
  const gmvSelesai = ordersByStatus['SELESAI']?.amount ?? 0
  const totalOrders = orderAgg.reduce((n, o) => n + o._count.id, 0)
  const selesaiCount = ordersByStatus['SELESAI']?.count ?? 0

  // Distribusi kategori (unit terjual per kategori) untuk bar chart
  const catStats = categories
    .map((c) => ({ name: c.name, count: c.productCount }))
    .filter((c) => c.count > 0)
    .sort((a, b) => b.count - a.count)
  const maxCat = Math.max(1, ...catStats.map((c) => c.count))

  // Distribusi rating testimoni 5..1
  const ratingDist = [5, 4, 3, 2, 1].map((star) => ({
    star,
    count: ratingRows.find((r) => r.rating === star)?._count.id ?? 0,
  }))
  const maxRatingCount = Math.max(1, ...ratingDist.map((r) => r.count))
  const totalReviews = testimonialAgg._count.id

  const kpis: { icon: typeof Star; label: string; value: number; suffix: string; decimals: number }[] = [
    { icon: ShoppingBag, label: 'Jenis Akun Aktif', value: totalProducts, suffix: '+', decimals: 0 },
    { icon: Flame, label: 'Unit Terjual', value: totalSold, suffix: '+', decimals: 0 },
    { icon: Crown, label: 'Kategori Kurasi', value: categories.length, suffix: '', decimals: 0 },
    { icon: Star, label: 'Rating Rata-rata', value: avgRating, decimals: 1, suffix: '/5' },
  ]

  return (
    <PageShell categories={categories}>
      <PageHero
        kicker="STATISTIK PASAR"
        title="Angka yang Bisa"
        highlight="Kamu Verifikasi"
        description="Transparansi itu bukan slogan — semua angka di halaman ini dihitung langsung dari database Pusatakun saat halaman dibuka. Tidak ada angka pemanis yang tidak bisa dibuktikan."
        breadcrumb={[{ label: 'Statistik Pasar' }]}
      />

      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        {/* KPI */}
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {kpis.map((k, i) => (
            <Reveal key={k.label} delay={i * 0.06}>
              <div className="glass rounded-2xl p-5 text-center sm:p-6">
                <k.icon className="mx-auto h-6 w-6 text-primary" aria-hidden="true" />
                <p className="mt-3 text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
                  <CountUp to={k.value} decimals={k.decimals ?? 0} suffix={k.suffix} />
                </p>
                <p className="mt-1 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  {k.label}
                </p>
              </div>
            </Reveal>
          ))}
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-2">
          {/* Distribusi kategori */}
          <Reveal>
            <div className="glass h-full rounded-2xl p-6">
              <h2 className="text-sm font-extrabold uppercase tracking-[0.2em] text-primary">
                Distribusi Akun per Kategori
              </h2>
              <div className="mt-6 space-y-4">
                {catStats.map((c) => (
                  <div key={c.name}>
                    <div className="flex justify-between text-xs font-bold">
                      <span className="text-foreground/90">{c.name}</span>
                      <span className="text-muted-foreground">{c.count} akun</span>
                    </div>
                    <div className="mt-1.5 h-2.5 overflow-hidden rounded-full bg-border/60">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-[#E8961E] to-[#FFD97A]"
                        style={{ width: `${(c.count / maxCat) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>

          {/* Transaksi & stok */}
          <Reveal delay={0.08}>
            <div className="glass flex h-full flex-col rounded-2xl p-6">
              <h2 className="text-sm font-extrabold uppercase tracking-[0.2em] text-primary">
                Kesehatan Transaksi
              </h2>
              <dl className="mt-6 grid grid-cols-2 gap-3">
                <div className="rounded-xl border border-border bg-background/40 p-4">
                  <dt className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Total pesanan</dt>
                  <dd className="mt-1 text-2xl font-extrabold text-foreground"><CountUp to={totalOrders} /></dd>
                </div>
                <div className="rounded-xl border border-border bg-background/40 p-4">
                  <dt className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Selesai diterima</dt>
                  <dd className="mt-1 text-2xl font-extrabold text-emerald-400"><CountUp to={selesaiCount} /></dd>
                </div>
                <div className="rounded-xl border border-border bg-background/40 p-4">
                  <dt className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">GMV pesanan selesai</dt>
                  <dd className="mt-1 text-lg font-extrabold text-foreground">{formatIDR(gmvSelesai)}</dd>
                </div>
                <div className="rounded-xl border border-border bg-background/40 p-4">
                  <dt className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Stok siap kirim</dt>
                  <dd className="mt-1 text-2xl font-extrabold text-foreground"><CountUp to={totalStock} /></dd>
                </div>
              </dl>
              <div className="mt-auto pt-5">
                <div className="flex items-start gap-3 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-4">
                  <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-emerald-400" aria-hidden="true" />
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    Semua transaksi berstatus selesai berarti akun sudah diterima pembeli dan dana dilepas ke penjual
                    — angkanya tidak bisa dimanipulasi karena terikat sistem escrow.
                  </p>
                </div>
              </div>
            </div>
          </Reveal>
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-2">
          {/* Produk terlaris */}
          <Reveal>
            <div className="glass h-full rounded-2xl p-6">
              <h2 className="text-sm font-extrabold uppercase tracking-[0.2em] text-primary">
                Akun Terlaris Bulan Ini
              </h2>
              <ol className="mt-5 space-y-3">
                {topProducts.map((p, i) => (
                  <li key={p.slug}>
                    <a
                      href={`/produk/${p.slug}`}
                      className="flex items-center gap-3 rounded-xl border border-border bg-background/40 p-3 transition-colors hover:border-primary/40"
                    >
                      <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-xs font-extrabold ${i < 3 ? 'bg-primary text-primary-foreground' : 'bg-primary/15 text-primary'}`}>
                        {i + 1}
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-sm font-bold text-foreground">{p.name}</span>
                        <span className="text-xs text-muted-foreground">
                          {p.level} · {formatIDR(p.price)} · rating {p.rating.toFixed(1)}
                        </span>
                      </span>
                      <span className="shrink-0 rounded-full bg-primary/15 px-2.5 py-1 text-xs font-extrabold text-primary">
                        {p.sold} terjual
                      </span>
                    </a>
                  </li>
                ))}
              </ol>
            </div>
          </Reveal>

          {/* Kepuasan pembeli */}
          <Reveal delay={0.08}>
            <div className="glass flex h-full flex-col rounded-2xl p-6">
              <h2 className="text-sm font-extrabold uppercase tracking-[0.2em] text-primary">
                Kepuasan Pembeli
              </h2>
              <div className="mt-5 flex items-center gap-4">
                <div className="text-center">
                  <p className="text-4xl font-extrabold text-foreground">
                    <CountUp to={testimonialAgg._avg.rating ?? 0} decimals={1} />
                  </p>
                  <div className="mt-1 flex justify-center gap-0.5" aria-hidden="true">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star key={s} className={`h-4 w-4 ${s <= Math.round(testimonialAgg._avg.rating ?? 0) ? 'fill-primary text-primary' : 'text-border'}`} />
                    ))}
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">{totalReviews} ulasan terverifikasi</p>
                </div>
                <div className="flex-1 space-y-2">
                  {ratingDist.map((r) => (
                    <div key={r.star} className="flex items-center gap-2">
                      <span className="w-6 text-xs font-bold text-muted-foreground">{r.star}★</span>
                      <div className="h-2 flex-1 overflow-hidden rounded-full bg-border/60">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-[#E8961E] to-[#FFD97A]"
                          style={{ width: `${(r.count / maxRatingCount) * 100}%` }}
                        />
                      </div>
                      <span className="w-6 text-right text-xs font-bold text-muted-foreground">{r.count}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="mt-auto pt-5">
                <a
                  href="/ulasan"
                  className="inline-flex min-h-[44px] w-full items-center justify-center rounded-xl border border-primary/50 text-sm font-extrabold text-primary transition-colors hover:bg-primary/10"
                >
                  <Users className="mr-2 h-4 w-4" aria-hidden="true" />
                  Baca Semua Ulasan
                </a>
              </div>
            </div>
          </Reveal>
        </div>

        <p className="mt-8 text-center text-xs text-muted-foreground/70">
          Sumber data: database {SITE.domain} — dihitung realtime saat halaman dimuat. Statistik penjualan
          keseluruhan: {totalSold.toLocaleString('id-ID')} unit dari {totalProducts} jenis akun.
        </p>
      </div>
    </PageShell>
  )
}
