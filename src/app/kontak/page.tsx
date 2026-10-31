import type { Metadata } from 'next'
import {
  ArrowRight,
  Clock,
  Mail,
  MapPin,
  MessageCircle,
  Scale,
  ShieldCheck,
  Store,
  Users,
} from 'lucide-react'
import Link from 'next/link'
import { PageHero } from '@/components/pusatakun/page-hero'
import { PageShell } from '@/components/pusatakun/page-shell'
import { Reveal } from '@/components/pusatakun/motion-primitives'
import { SITE, waLink } from '@/lib/marketplace'
import { getPageCategories } from '@/lib/page-data'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Kontak & Bantuan Cepat',
  description:
    'Hubungi admin Pusatakun 24/7 via WhatsApp +62 813-1651-6524 — dijawab manusia asli. Email resmi, alamat kantor Jakarta Pusat, dan panduan kanal mana untuk kebutuhanmu.',
  alternates: { canonical: '/kontak' },
  robots: { index: true, follow: true },
}

const CHANNELS = [
  {
    icon: MessageCircle,
    title: 'WhatsApp Admin (utama)',
    detail: SITE.whatsappDisplay,
    note: 'Online 24/7 · dijawab manusia asli · semua urusan beli, jual, dan klaim garansi dimulai di sini.',
    href: waLink('Halo Admin Pusatakun! Saya butuh bantuan.'),
    cta: 'Chat Sekarang',
    primary: true,
  },
  {
    icon: Mail,
    title: 'Email Resmi',
    detail: SITE.email,
    note: 'Untuk dokumen, kerja sama, dan permintaan data pribadi (privasi/garansi tertulis). Balasan maks. 1×24 jam.',
    href: `mailto:${SITE.email}`,
    cta: 'Kirim Email',
    primary: false,
  },
  {
    icon: MapPin,
    title: 'Kantor',
    detail: SITE.address,
    note: 'Kunjungan dengan janji temu — chat admin dulu untuk menjadwalkan.',
    href: waLink('Halo Admin Pusatakun! Saya ingin menjadwalkan kunjungan ke kantor.'),
    cta: 'Jadwalkan Kunjungan',
    primary: false,
  },
] as const

const TOPICS = [
  {
    icon: Users,
    title: 'Beli Akun',
    body: 'Tanya stok, nego harga, minta rekomendasi sesuai budget.',
    href: waLink('Halo Admin Pusatakun! Saya mau beli akun. Boleh tanya-tanya dulu?'),
  },
  {
    icon: Store,
    title: 'Jual Akun',
    body: 'Daftarkan akunmu, tanya proses kurasi dan pembayaran.',
    href: waLink('Halo Admin Pusatakun! Saya mau jual akun. Bagaimana prosesnya?'),
  },
  {
    icon: ShieldCheck,
    title: 'Klaim Garansi',
    body: 'Akun bermasalah dalam masa garansi? Kirim video + kode pesanan.',
    href: waLink('Halo Admin Pusatakun! Saya ingin klaim garansi untuk pesanan saya.'),
  },
  {
    icon: Scale,
    title: 'Kerja Sama & Lainnya',
    body: 'Reseller, kemitraan, atau pertanyaan legal/privasi.',
    href: waLink('Halo Admin Pusatakun! Saya ingin berdiskusi soal kerja sama.'),
  },
] as const

export default async function KontakPage() {
  const categories = await getPageCategories()

  return (
    <PageShell categories={categories}>
      <PageHero
        kicker="HUBUNGI KAMI"
        title="Kami online"
        highlight="24/7"
        description="Satu nomor WhatsApp untuk semuanya — dijawab langsung oleh admin Pusatakun, bukan bot, bukan call center. Rata-rata dijawab dalam hitungan menit."
        breadcrumb={[{ label: 'Kontak' }]}
      />

      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Kanal utama */}
        <div className="grid gap-4 lg:grid-cols-3">
          {CHANNELS.map((c, i) => (
            <Reveal key={c.title} delay={i * 0.08}>
              <div
                className={`flex h-full flex-col rounded-2xl p-6 ${
                  c.primary
                    ? 'border border-primary/40 bg-primary/10 shadow-lg shadow-primary/10'
                    : 'glass'
                }`}
              >
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary text-primary-foreground">
                  <c.icon className="h-5 w-5" aria-hidden="true" />
                </span>
                <h2 className="mt-4 text-sm font-bold uppercase tracking-widest text-muted-foreground">
                  {c.title}
                </h2>
                <p className="mt-1 text-lg font-extrabold leading-snug text-foreground">{c.detail}</p>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">{c.note}</p>
                <a
                  href={c.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`mt-5 inline-flex min-h-[44px] items-center justify-center gap-2 rounded-xl px-5 text-sm font-bold transition-transform hover:scale-[1.02] ${
                    c.primary
                      ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/25'
                      : 'border border-primary/40 text-primary hover:bg-primary/10'
                  }`}
                >
                  {c.cta}
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </a>
              </div>
            </Reveal>
          ))}
        </div>

        {/* Panduan topik */}
        <Reveal className="mt-14">
          <h2 className="text-center text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl">
            Chat admin untuk <span className="text-gradient-gold">kebutuhanmu</span>
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-center text-sm leading-relaxed text-muted-foreground">
            Klik topik di bawah — pesan WhatsApp sudah terisi otomatis, tinggal tekan kirim.
          </p>
        </Reveal>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {TOPICS.map((t, i) => (
            <Reveal key={t.title} delay={i * 0.06}>
              <a
                href={t.href}
                target="_blank"
                rel="noopener noreferrer"
                className="glass group flex h-full flex-col rounded-2xl p-5 transition-transform hover:-translate-y-1"
              >
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/15">
                  <t.icon className="h-5 w-5 text-primary" aria-hidden="true" />
                </span>
                <h3 className="mt-3.5 text-sm font-extrabold text-foreground">{t.title}</h3>
                <p className="mt-1.5 flex-1 text-sm leading-relaxed text-muted-foreground">{t.body}</p>
                <span className="mt-3 inline-flex items-center gap-1.5 text-xs font-bold text-primary">
                  Buka WhatsApp
                  <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" aria-hidden="true" />
                </span>
              </a>
            </Reveal>
          ))}
        </div>

        {/* Jam layanan + tautan cepat */}
        <div className="mt-14 grid gap-4 lg:grid-cols-2">
          <Reveal>
            <div className="glass h-full rounded-2xl p-6 sm:p-8">
              <p className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.22em] text-primary">
                <Clock className="h-4 w-4" aria-hidden="true" />
                Jam Layanan
              </p>
              <div className="mt-4 space-y-3 text-sm">
                <div className="flex items-center justify-between gap-4 border-b border-border pb-3">
                  <span className="font-semibold text-foreground">WhatsApp admin</span>
                  <span className="font-bold text-emerald-400">24 jam · 7 hari</span>
                </div>
                <div className="flex items-center justify-between gap-4 border-b border-border pb-3">
                  <span className="font-semibold text-foreground">Serah terima akun</span>
                  <span className="text-muted-foreground">Instan 5–15 menit setelah bayar</span>
                </div>
                <div className="flex items-center justify-between gap-4 border-b border-border pb-3">
                  <span className="font-semibold text-foreground">Verifikasi klaim garansi</span>
                  <span className="text-muted-foreground">Maks. 1×24 jam</span>
                </div>
                <div className="flex items-center justify-between gap-4">
                  <span className="font-semibold text-foreground">Email</span>
                  <span className="text-muted-foreground">Maks. 1×24 jam kerja</span>
                </div>
              </div>
            </div>
          </Reveal>
          <Reveal delay={0.08}>
            <div className="glass flex h-full flex-col rounded-2xl p-6 sm:p-8">
              <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-primary">
                Jelajahi Dulu
              </p>
              <p className="mt-4 flex-1 text-sm leading-relaxed text-muted-foreground">
                Sebelum chat, jawaban tercepat kadang sudah tersedia di halaman-halaman ini:
              </p>
              <nav aria-label="Tautan bantuan cepat" className="mt-4 grid gap-2">
                {[
                  { label: 'Pusat Bantuan — cara beli, jual & istilah akun', href: '/pusat-bantuan' },
                  { label: 'Kebijakan Garansi & Pengembalian', href: '/garansi' },
                  { label: 'Syarat & Ketentuan', href: '/syarat-ketentuan' },
                  { label: 'Kebijakan Privasi', href: '/kebijakan-privasi' },
                ].map((l) => (
                  <Link
                    key={l.href}
                    href={l.href}
                    className="group inline-flex min-h-[44px] items-center justify-between gap-3 rounded-xl border border-border px-4 text-sm font-semibold text-foreground transition-colors hover:border-primary/50 hover:text-primary"
                  >
                    {l.label}
                    <ArrowRight
                      className="h-4 w-4 shrink-0 text-primary transition-transform group-hover:translate-x-1"
                      aria-hidden="true"
                    />
                  </Link>
                ))}
              </nav>
            </div>
          </Reveal>
        </div>
      </div>
    </PageShell>
  )
}
