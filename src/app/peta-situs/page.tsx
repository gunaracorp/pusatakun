import type { Metadata } from 'next'
import Link from 'next/link'
import { ChevronRight } from 'lucide-react'
import { PageShell } from '@/components/pusatakun/page-shell'
import { PageHero } from '@/components/pusatakun/page-hero'
import { Reveal } from '@/components/pusatakun/motion-primitives'
import { getPageCategories, getCatalogInitialProducts } from '@/lib/page-data'
import { BLOG_ARTICLES } from '@/lib/blog-data'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Peta Situs — Semua Halaman Pusatakun',
  description:
    'Peta situs lengkap Pusatakun: semua halaman utama, katalog akun per produk, artikel blog, dan halaman kebijakan — temukan apa pun yang kamu cari dari satu tempat.',
  alternates: { canonical: '/peta-situs' },
  robots: { index: true, follow: true },
}

type LinkGroup = {
  title: string
  links: { label: string; href: string }[]
}

export default async function PetaSitusPage() {
  const [categories, { products }] = await Promise.all([
    getPageCategories(),
    getCatalogInitialProducts(100),
  ])

  const groups: LinkGroup[] = [
    {
      title: 'Halaman Utama',
      links: [
        { label: 'Beranda', href: '/' },
        { label: 'Katalog Akun', href: '/katalog' },
        { label: 'Statistik Pasar', href: '/statistik' },
        { label: 'Promo & Kupon', href: '/promo' },
        { label: 'Ulasan Pembeli', href: '/ulasan' },
        { label: 'Peta Situs', href: '/peta-situs' },
      ],
    },
    {
      title: 'Akun & Transaksi',
      links: [
        { label: 'Lacak Pesanan', href: '/lacak' },
        { label: 'Cek Garansi', href: '/cek-garansi' },
        { label: 'Kalkulator Reseller', href: '/kalkulator' },
        { label: 'Program Mitra', href: '/mitra' },
        { label: 'Masuk (WhatsApp OTP)', href: '/masuk' },
        { label: 'Daftar Akun', href: '/daftar' },
        { label: 'Dashboard Pembeli', href: '/dashboard' },
        { label: 'Dashboard Penjual', href: '/dashboard/penjual' },
      ],
    },
    {
      title: 'Bantuan & Informasi',
      links: [
        { label: 'Pusat Bantuan', href: '/pusat-bantuan' },
        { label: 'Kamus Istilah Akun', href: '/kamus' },
        { label: 'Kebijakan Garansi & Pengembalian', href: '/garansi' },
        { label: 'Tentang Kami', href: '/tentang' },
        { label: 'Kontak & Kantor', href: '/kontak' },
        { label: 'Blog & Panduan', href: '/blog' },
        { label: 'Pedoman Media (Brand Kit)', href: '/pedoman-media' },
      ],
    },
    {
      title: 'Legal',
      links: [
        { label: 'Syarat & Ketentuan', href: '/syarat-ketentuan' },
        { label: 'Kebijakan Privasi', href: '/kebijakan-privasi' },
      ],
    },
  ]

  const blogGroup: LinkGroup = {
    title: 'Artikel Blog',
    links: BLOG_ARTICLES.map((a) => ({ label: a.title, href: `/blog/${a.slug}` })),
  }

  const productGroup: LinkGroup = {
    title: 'Katalog Akun per Produk',
    links: products.map((p) => ({ label: p.name, href: `/produk/${p.slug}` })),
  }

  const categoryGroup: LinkGroup = {
    title: 'Kategori',
    links: categories.map((c) => ({ label: `${c.name} (${c.productCount})`, href: `/katalog?kategori=${c.slug}` })),
  }

  const all = [...groups, blogGroup, categoryGroup, productGroup]

  return (
    <PageShell categories={categories}>
      <PageHero
        kicker="PETA SITUS"
        title="Semua Halaman,"
        highlight="Satu Tempat"
        description="Peta situs versi manusia (XML versi mesin ada di /sitemap.xml). Jika ada halaman yang tidak kamu temukan, berarti memang belum dibuat — minta saja lewat WhatsApp."
        breadcrumb={[{ label: 'Peta Situs' }]}
      />

      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {all.map((g, gi) => (
            <Reveal key={g.title} delay={Math.min(gi * 0.04, 0.3)}>
              <nav aria-label={g.title} className="glass h-full rounded-2xl p-6">
                <h2 className="text-xs font-extrabold uppercase tracking-[0.2em] text-primary">
                  {g.title}
                </h2>
                <ul className="mt-4 space-y-1.5">
                  {g.links.map((l) => (
                    <li key={l.href}>
                      <Link
                        href={l.href}
                        className="group flex min-h-[36px] items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-primary"
                      >
                        <ChevronRight
                          className="h-3.5 w-3.5 shrink-0 opacity-40 transition-transform group-hover:translate-x-0.5 group-hover:opacity-100"
                          aria-hidden="true"
                        />
                        {l.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            </Reveal>
          ))}
        </div>
      </div>
    </PageShell>
  )
}
