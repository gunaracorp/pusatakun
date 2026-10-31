import type { Metadata } from 'next'
import Link from 'next/link'
import { BadgeCheck, GraduationCap, LineChart, MessagesSquare, ShieldCheck, Wallet } from 'lucide-react'
import { PageShell } from '@/components/pusatakun/page-shell'
import { PageHero } from '@/components/pusatakun/page-hero'
import { Reveal } from '@/components/pusatakun/motion-primitives'
import { SITE, waLink } from '@/lib/marketplace'
import { getPageCategories } from '@/lib/page-data'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Program Mitra & Reseller — Buka Toko Gratis di Pusatakun',
  description:
    'Jadi mitra reseller akun Pusatakun: toko gratis, kurasi 24 jam, komisi 90/10 transparan, prioritas antrean kurasi, dukungan pemasaran, dan komunitas reseller. Daftar sekarang, tayang hari ini.',
  alternates: { canonical: '/mitra' },
  robots: { index: true, follow: true },
}

const BENEFITS = [
  {
    icon: Wallet,
    title: 'Komisi 90/10 transparan',
    desc: 'Kamu menerima 90% harga jual. Tidak ada biaya pendaftaran, biaya listing, atau biaya tersembunyi lainnya.',
  },
  {
    icon: ShieldCheck,
    title: 'Escrow melindungimu juga',
    desc: 'Dana pembeli ditahan sistem dan cair otomatis setelah konfirmasi — kamu tidak perlu mengejar-ngejar pembayaran.',
  },
  {
    icon: BadgeCheck,
    title: 'Badge penjual terverifikasi',
    desc: 'Identitas WhatsApp terverifikasi tampil di setiap listing — pembeli lebih percaya, listing lebih cepat laku.',
  },
  {
    icon: MessagesSquare,
    title: 'Kurasi respons cepat',
    desc: 'Listing dikurasi maksimal 1x24 jam. Mitra aktif mendapat prioritas antrean pada jam ramai.',
  },
  {
    icon: LineChart,
    title: 'Dashboard penjualan lengkap',
    desc: 'Pantau listing tayang, antrean kurasi, pesanan masuk, dan penerimaan dari Dashboard Penjual — update realtime.',
  },
  {
    icon: GraduationCap,
    title: 'Panduan listing yang laku',
    desc: 'Tim kurasi memberi catatan perbaikan konkret saat listing ditolak — kamu belajar sambil menjual.',
  },
]

const TIERS = [
  {
    name: 'Mitra Baru',
    requirement: '0-9 transaksi selesai',
    perks: ['Komisi 90/10 standar', 'Kurasi standar', 'Badge terverifikasi'],
  },
  {
    name: 'Mitra Aktif',
    requirement: '10-49 transaksi selesai',
    perks: ['Prioritas antrean kurasi', 'Notifikasi stok dicari pembeli', 'Ulasan listing dipinjamkan di beranda'],
    featured: true,
  },
  {
    name: 'Mitra Emas',
    requirement: '50+ transaksi selesai',
    perks: ['Komisi 0% bulan pertama tiap kuartal', 'Kurasi express < 3 jam', 'Slot promo khusus & dukungan pemasaran'],
  },
]

const STEPS = [
  { n: '01', title: 'Daftar via WhatsApp OTP', desc: 'Masuk dengan nomor WhatsApp, pilih peran Penjual — tanpa kata sandi, tanpa biaya.' },
  { n: '02', title: 'Daftarkan akun yang dijual', desc: 'Isi platform, judul, harga, level, dan deskripsi jujur. Sertakan bukti kepemilikan.' },
  { n: '03', title: 'Lewati kurasi (maks 24 jam)', desc: 'Admin memverifikasi listing. Kalau kurang, kamu dapat catatan perbaikan yang jelas.' },
  { n: '04', title: 'Tayang & terima dana 90%', desc: 'Listing tampil ke ribuan pembeli. Setelah escrow selesai, dana diproses ke kanalmu.' },
]

export default async function MitraPage() {
  const categories = await getPageCategories()
  return (
    <PageShell categories={categories}>
      <PageHero
        kicker="PROGRAM MITRA"
        title="Buka Toko Gratis,"
        highlight="Jual dengan Tenang"
        description="Pusatakun mencari penjual jangka panjang, bukan pemburu komisi sekali jalan. Kami beri infrastruktur escrow, kurasi, dan trafik — kamu fokus stok dan reputasi."
        breadcrumb={[{ label: 'Program Mitra' }]}
      />

      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Keunggulan */}
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {BENEFITS.map((b, i) => (
            <Reveal key={b.title} delay={i * 0.05}>
              <div className="glass h-full rounded-2xl p-6">
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/15">
                  <b.icon className="h-5.5 w-5.5 text-primary" aria-hidden="true" />
                </span>
                <h2 className="mt-4 text-base font-extrabold text-foreground">{b.title}</h2>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{b.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>

        {/* Langkah */}
        <Reveal>
          <h2 className="mt-16 text-center text-2xl font-extrabold text-foreground sm:text-3xl">
            Empat langkah sampai listing pertama tayang
          </h2>
        </Reveal>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((s, i) => (
            <Reveal key={s.n} delay={i * 0.06}>
              <div className="glass h-full rounded-2xl p-6">
                <span className="text-3xl font-extrabold text-primary/40">{s.n}</span>
                <h3 className="mt-3 text-sm font-extrabold text-foreground">{s.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{s.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>

        {/* Tier */}
        <Reveal>
          <h2 className="mt-16 text-center text-2xl font-extrabold text-foreground sm:text-3xl">
            Tiga level mitra — naik level otomatis dari reputasi
          </h2>
        </Reveal>
        <div className="mt-8 grid gap-5 lg:grid-cols-3">
          {TIERS.map((t, i) => (
            <Reveal key={t.name} delay={i * 0.06}>
              <div className={`glass h-full rounded-2xl p-6 ${t.featured ? 'border-primary/50 ring-1 ring-primary/30' : ''}`}>
                {t.featured ? (
                  <span className="mb-3 inline-block rounded-full bg-primary px-3 py-1 text-[10px] font-extrabold uppercase tracking-[0.18em] text-primary-foreground">
                    Paling umum
                  </span>
                ) : null}
                <h3 className="text-lg font-extrabold text-foreground">{t.name}</h3>
                <p className="mt-1 text-xs font-bold uppercase tracking-wider text-primary">{t.requirement}</p>
                <ul className="mt-4 space-y-2.5">
                  {t.perks.map((p) => (
                    <li key={p} className="flex items-start gap-2.5 text-sm text-muted-foreground">
                      <BadgeCheck className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
                      {p}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          ))}
        </div>

        {/* CTA */}
        <Reveal>
          <div className="glass mt-14 flex flex-col items-center gap-5 rounded-3xl p-8 text-center sm:p-10">
            <h2 className="text-2xl font-extrabold text-foreground sm:text-3xl">
              Siap jadi bagian dari ekosistem {SITE.name}?
            </h2>
            <p className="max-w-xl text-sm leading-relaxed text-muted-foreground sm:text-base">
              Hitung dulu potensimu lewat Kalkulator Reseller, lalu daftar dari Dashboard Penjual —
              gratis dan tanpa komitmen.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <Link
                href="/dashboard/penjual"
                className="inline-flex min-h-[48px] items-center rounded-xl bg-primary px-6 text-sm font-extrabold text-primary-foreground transition-opacity hover:opacity-90"
              >
                Buka Toko Gratis
              </Link>
              <Link
                href="/kalkulator"
                className="inline-flex min-h-[48px] items-center rounded-xl border border-primary/50 px-6 text-sm font-extrabold text-primary transition-colors hover:bg-primary/10"
              >
                Coba Kalkulator Profit
              </Link>
              <a
                href={waLink('Halo Admin Pusatakun! Saya tertarik ikut Program Mitra reseller. Boleh dijelaskan alurnya?')}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-[48px] items-center rounded-xl border border-border px-6 text-sm font-extrabold text-muted-foreground transition-colors hover:text-foreground"
              >
                Tanya via WhatsApp
              </a>
            </div>
          </div>
        </Reveal>
      </div>
    </PageShell>
  )
}
