import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import {
  ArrowRight,
  BadgeCheck,
  Check,
  Package,
  RefreshCcw,
  ShieldCheck,
  Star,
  Store,
  Zap,
} from 'lucide-react'
import { PageShell } from '@/components/pusatakun/page-shell'
import { Breadcrumbs } from '@/components/pusatakun/page-hero'
import { Reveal } from '@/components/pusatakun/motion-primitives'
import {
  CopyNameButton,
  HotBadge,
  RelatedProducts,
} from '@/components/pusatakun/product-page-client'
import { SITE, discountPercent, formatCompact, formatIDR, waLink } from '@/lib/marketplace'
import {
  getCategoryIdBySlug,
  getPageCategories,
  getProductBySlug,
  getRelatedProducts,
} from '@/lib/page-data'
import { breadcrumbListJsonLd, productJsonLd } from '@/lib/seo'

export const dynamic = 'force-dynamic'

type Props = { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const product = await getProductBySlug(slug)
  if (!product) {
    return { title: 'Produk Tidak Ditemukan' }
  }

  const discount = discountPercent(product.price, product.oldPrice)
  const description =
    `${product.name} — ${formatIDR(product.price)} di ${SITE.name}. ${product.description} ` +
    `${product.warranty}, stok ${product.stock}, level ${product.level}, kirim instan 5–15 menit, checkout dibantu admin 24/7.`

  return {
    title: `${product.name} — ${formatIDR(product.price)}`,
    description,
    alternates: { canonical: `/produk/${product.slug}` },
    robots: { index: true, follow: true },
    openGraph: {
      type: 'website',
      locale: 'id_ID',
      url: `${SITE.url}/produk/${product.slug}`,
      siteName: SITE.name,
      title: `${product.name}${discount ? ` (Diskon ${discount}%)` : ''} — ${formatIDR(product.price)}`,
      description,
      images: [{ url: '/og-image.jpg', width: 1200, height: 630, alt: product.name }],
    },
    twitter: {
      card: 'summary_large_image',
      title: product.name,
      description,
      images: ['/og-image.jpg'],
    },
  }
}

export default async function ProdukDetailPage({ params }: Props) {
  const { slug } = await params
  const product = await getProductBySlug(slug)
  if (!product) notFound()

  const [categories, related] = await Promise.all([
    getPageCategories(),
    getCategoryIdBySlug(product.categorySlug).then((categoryId) =>
      getRelatedProducts(categoryId, product.slug, 4),
    ),
  ])

  const discount = discountPercent(product.price, product.oldPrice)
  const buyLink = waLink(
    `Halo Admin Pusatakun! Saya mau beli produk "${product.name}" seharga ${formatIDR(product.price)}. Masih ready? Mohon diproses ya.`,
  )
  const stockRatio = product.totalStock > 0 ? product.stock / product.totalStock : 0
  const stockTone =
    stockRatio > 0.5
      ? 'bg-emerald-500 text-emerald-400'
      : stockRatio > 0.2
        ? 'bg-amber-500 text-amber-400'
        : 'bg-rose-500 text-rose-400'

  const jsonLd = [
    productJsonLd(product),
    breadcrumbListJsonLd([
      { name: 'Home', item: SITE.url },
      { name: 'Katalog', item: `${SITE.url}/katalog` },
      { name: product.categoryName, item: `${SITE.url}/katalog?kategori=${product.categorySlug}` },
      { name: product.name, item: `${SITE.url}/produk/${product.slug}` },
    ]),
  ]

  return (
    <PageShell categories={categories}>
      {jsonLd.map((block, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(block) }}
        />
      ))}

      <div className="relative mx-auto max-w-7xl px-4 pb-16 pt-28 sm:px-6 sm:pt-32 lg:px-8">
        <Breadcrumbs
          items={[
            { label: 'Katalog', href: '/katalog' },
            { label: product.categoryName, href: `/katalog?kategori=${product.categorySlug}` },
            { label: product.name },
          ]}
        />

        <div className="grid gap-8 lg:grid-cols-[1fr_380px]">
          {/* ===== Kolom info ===== */}
          <div>
            <Reveal>
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center rounded-full bg-primary px-3 py-1 text-[11px] font-bold text-primary-foreground">
                  {product.categoryName}
                </span>
                <span className="inline-flex items-center rounded-full border border-primary/30 px-3 py-1 text-[11px] font-bold text-primary">
                  Level {product.level}
                </span>
                {product.hot ? <HotBadge /> : null}
                {discount ? (
                  <span className="inline-flex items-center rounded-full bg-red-500/15 px-3 py-1 text-[11px] font-bold text-red-400">
                    Hemat {discount}%
                  </span>
                ) : null}
                {product.featured ? (
                  <span className="inline-flex items-center rounded-full border border-primary/30 px-3 py-1 text-[11px] font-bold text-primary">
                    Pilihan Editor
                  </span>
                ) : null}
              </div>

              <h1 className="mt-4 text-2xl font-extrabold leading-tight tracking-tight text-foreground sm:text-3xl lg:text-4xl">
                {product.name}
              </h1>

              <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-muted-foreground">
                <span className="inline-flex items-center gap-1.5 font-semibold text-foreground">
                  <Star className="h-4 w-4 fill-primary text-primary" aria-hidden="true" />
                  {product.rating.toFixed(1)} / 5.0
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Zap className="h-4 w-4 text-primary" aria-hidden="true" />
                  Terjual {formatCompact(product.sold)}
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <ShieldCheck className="h-4 w-4 text-primary" aria-hidden="true" />
                  {product.warranty}
                </span>
              </div>
            </Reveal>

            <Reveal delay={0.08}>
              <section aria-label="Deskripsi produk" className="glass mt-6 rounded-2xl p-6">
                <h2 className="text-sm font-bold uppercase tracking-widest text-foreground">
                  Deskripsi
                </h2>
                <p className="mt-3 text-[15px] leading-relaxed text-muted-foreground">
                  {product.description}
                </p>
              </section>
            </Reveal>

            <Reveal delay={0.12}>
              <section aria-label="Spesifikasi produk" className="glass mt-4 rounded-2xl p-6">
                <h2 className="text-sm font-bold uppercase tracking-widest text-foreground">
                  Yang Kamu Dapatkan
                </h2>
                <ul className="mt-4 grid gap-2.5 sm:grid-cols-2">
                  {product.specs.map((spec) => (
                    <li key={spec} className="flex items-start gap-2.5 text-sm text-muted-foreground">
                      <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/15">
                        <Check className="h-3 w-3 text-primary" aria-hidden="true" />
                      </span>
                      {spec}
                    </li>
                  ))}
                </ul>
              </section>
            </Reveal>

            <Reveal delay={0.16}>
              <section aria-label="Keamanan pembelian" className="mt-4 grid gap-3 sm:grid-cols-3">
                {[
                  { icon: ShieldCheck, title: 'Garansi Tertulis', body: product.warranty },
                  { icon: Zap, title: 'Kirim Instan', body: '5–15 menit setelah bayar' },
                  { icon: BadgeCheck, title: 'Kurasi Admin', body: 'Produk diverifikasi sebelum tayang' },
                ].map((f) => (
                  <div key={f.title} className="glass rounded-2xl p-4 text-center">
                    <f.icon className="mx-auto h-6 w-6 text-primary" aria-hidden="true" />
                    <p className="mt-2 text-xs font-extrabold text-foreground">{f.title}</p>
                    <p className="mt-1 text-[11px] leading-relaxed text-muted-foreground">{f.body}</p>
                  </div>
                ))}
              </section>
            </Reveal>
          </div>

          {/* ===== Kolom beli (sticky desktop) ===== */}
          <aside className="lg:sticky lg:top-28 lg:self-start">
            <Reveal delay={0.1}>
              <div className="glass rounded-2xl border border-primary/25 p-6">
                <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
                  Harga Spesial Hari Ini
                </p>
                <div className="mt-1 flex flex-wrap items-baseline gap-3">
                  <span className="text-3xl font-black tracking-tight text-primary sm:text-4xl">
                    {formatIDR(product.price)}
                  </span>
                  {product.oldPrice ? (
                    <span className="text-sm text-muted-foreground line-through">
                      {formatIDR(product.oldPrice)}
                    </span>
                  ) : null}
                </div>

                {/* Stok */}
                <div className="mt-5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="inline-flex items-center gap-1.5 text-muted-foreground">
                      <Package className="h-3.5 w-3.5" aria-hidden="true" />
                      Stok tersisa
                    </span>
                    <span className={`font-bold ${stockTone.split(' ')[1]}`}>{product.stock}</span>
                  </div>
                  <div
                    className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-secondary"
                    role="progressbar"
                    aria-valuenow={product.stock}
                    aria-valuemin={0}
                    aria-valuemax={product.totalStock}
                    aria-label={`Sisa stok ${product.stock} dari ${product.totalStock}`}
                  >
                    <div
                      className={`h-full rounded-full ${stockTone.split(' ')[0]}`}
                      style={{ width: `${Math.max(4, Math.round(stockRatio * 100))}%` }}
                    />
                  </div>
                </div>

                <div className="mt-6 flex flex-col gap-3">
                  <a
                    href={buyLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-xl bg-primary px-5 text-base font-bold text-primary-foreground shadow-lg shadow-primary/25 transition-transform hover:scale-[1.02]"
                  >
                    Beli via WhatsApp
                  </a>
                  <CopyNameButton name={product.name} />
                </div>

                <ul className="mt-5 space-y-2.5 border-t border-border pt-4 text-xs leading-relaxed text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
                    <span>
                      Dilindungi{' '}
                      <Link href="/garansi" className="font-semibold text-primary underline-offset-2 hover:underline">
                        {product.warranty}
                      </Link>{' '}
                      — ganti akun atau uang kembali 100%.
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Store className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
                    <span>Checkout dipandu admin manusia 24/7 via WhatsApp resmi {SITE.whatsappDisplay}.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <RefreshCcw className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
                    <span>
                      Rekam video saat serah terima — klaim garansi jadi proses kilat.
                    </span>
                  </li>
                </ul>
              </div>
            </Reveal>
          </aside>
        </div>

        {/* ===== Produk terkait ===== */}
        {related.length > 0 ? (
          <section aria-labelledby="terkait-judul" className="mt-16">
            <Reveal>
              <div className="mb-6 flex items-end justify-between gap-4">
                <h2 id="terkait-judul" className="text-xl font-extrabold tracking-tight text-foreground sm:text-2xl">
                  Akun serupa di <span className="text-gradient-gold">{product.categoryName}</span>
                </h2>
                <Link
                  href={`/katalog?kategori=${product.categorySlug}`}
                  className="inline-flex min-h-[44px] shrink-0 items-center gap-1.5 text-sm font-bold text-primary hover:underline"
                >
                  Lihat semua
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
              </div>
            </Reveal>
            <RelatedProducts products={related} />
          </section>
        ) : null}
      </div>
    </PageShell>
  )
}
