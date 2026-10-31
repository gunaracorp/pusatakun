'use client'

/**
 * PUSATAKUN — Pusat Bantuan: panduan beli/jual, glosarium level akun,
 * dan FAQ lengkap dari basis data (dengan FAQ JSON-LD di halamannya).
 */

import Link from 'next/link'
import {
  ArrowRight,
  BookOpen,
  CreditCard,
  Crown,
  KeyRound,
  MessageCircle,
  RefreshCcw,
  Search,
  ShieldCheck,
  Store,
  Timer,
  Wallet,
} from 'lucide-react'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { Reveal } from './motion-primitives'
import { waLink, type FaqDTO } from '@/lib/marketplace'

const BUY_STEPS = [
  {
    icon: Search,
    title: 'Pilih akunmu',
    body: 'Telusuri /katalog — filter kategori, level keamanan, dan harga. Baca deskripsi, spesifikasi, dan masa garansi di kartu produk.',
  },
  {
    icon: MessageCircle,
    title: 'Klik Beli via WhatsApp',
    body: 'Pesan otomatis terisi berisi nama produk & harga. Admin memeriksa ketersediaan dan mengonfirmasi totalnya.',
  },
  {
    icon: CreditCard,
    title: 'Bayar sesuai instruksi admin',
    body: 'Metode pembayaran diinformasikan admin di chat. Kirim bukti pembayaran di chat yang sama agar terdokumentasi.',
  },
  {
    icon: Timer,
    title: 'Terima akun 5–15 menit',
    body: 'Admin menyerahkan data akun, mendampingi login pertama, dan menandai pesanan selesai. Rekam video serah terima untuk jaga-jaga.',
  },
] as const

const SELL_STEPS = [
  {
    icon: Store,
    title: 'Daftar sebagai penjual',
    body: 'Klik Daftar, pilih peran Penjual, verifikasi nomor WhatsApp — gratis tanpa biaya pendaftaran.',
  },
  {
    icon: KeyRound,
    title: 'Isi listing akunmu',
    body: 'Lengkapi platform, judul, deskripsi jujur, level, dan harga. Listing masuk ke antrian kurasi.',
  },
  {
    icon: ShieldCheck,
    title: 'Lolos kurasi admin',
    body: 'Admin memeriksa kelengkapan & legalitas. Status kurasi bisa dipantau di dashboard penjual.',
  },
  {
    icon: Wallet,
    title: 'Terjual & terima pembayaran',
    body: 'Saat ada pembeli, admin mendampingi serah terima. Kamu dibayar sesuai kesepakatan yang tercatat di chat.',
  },
] as const

const LEVEL_GLOSSARY = [
  {
    badge: 'FRESH',
    tone: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/25',
    title: 'Akun Fresh',
    body: 'Akun baru/berumur muda, biasanya belum punya riwayat aktivitas berat. Cocok untuk dimulai dari nol dan diisi konten sendiri.',
  },
  {
    badge: 'AMAN',
    tone: 'bg-amber-500/15 text-amber-400 border-amber-500/25',
    title: 'Akun Aman',
    body: 'Akun dengan riwayat bersih — tidak tercatat pelanggaran, lengkap dengan data pemulihan, siap dipakai normal.',
  },
  {
    badge: 'PREMIUM',
    tone: 'bg-violet-500/15 text-violet-300 border-violet-500/25',
    title: 'Akun Premium',
    body: 'Akun berkualitas tinggi: umur lebih tua, konten/follower bagus, atau sudah lengkap data keamanannya. Harga lebih tinggi, risiko lebih rendah.',
  },
  {
    badge: 'MONETIZE',
    tone: 'bg-rose-500/15 text-rose-400 border-rose-500/25',
    title: 'Akun Monetize',
    body: 'Akun yang sudah aktif monetisasi (mis. YouTube AdSense, TikTok Creator) sehingga bisa langsung menghasilkan pendapatan.',
  },
] as const

export function HelpCenter({ faqs }: { faqs: FaqDTO[] }) {
  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      {/* Pintasan cepat */}
      <Reveal>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { icon: BookOpen, label: 'Cara Membeli', href: '#cara-membeli' },
            { icon: Store, label: 'Cara Menjual', href: '#cara-menjual' },
            { icon: Crown, label: 'Arti Level Akun', href: '#level-akun' },
            { icon: RefreshCcw, label: 'Klaim Garansi', href: '/garansi' },
          ].map((s) => (
            <a
              key={s.href}
              href={s.href}
              className="glass group inline-flex min-h-[56px] items-center gap-3 rounded-xl px-4 text-sm font-bold text-foreground transition-all hover:-translate-y-0.5 hover:border-primary/40"
            >
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/15">
                <s.icon className="h-4 w-4 text-primary" aria-hidden="true" />
              </span>
              {s.label}
              <ArrowRight
                className="ml-auto h-4 w-4 text-primary opacity-0 transition-all group-hover:translate-x-1 group-hover:opacity-100"
                aria-hidden="true"
              />
            </a>
          ))}
        </div>
      </Reveal>

      {/* Cara membeli */}
      <section id="cara-membeli" aria-labelledby="cara-membeli-judul" className="mt-14 scroll-mt-28">
        <Reveal>
          <h2 id="cara-membeli-judul" className="text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl">
            Cara <span className="text-gradient-gold">membeli</span> akun — 4 langkah
          </h2>
        </Reveal>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {BUY_STEPS.map((s, i) => (
            <Reveal key={s.title} delay={i * 0.07}>
              <div className="glass relative h-full rounded-2xl p-5">
                <span className="absolute right-4 top-4 font-mono text-4xl font-black text-primary/15">
                  {i + 1}
                </span>
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground">
                  <s.icon className="h-5 w-5" aria-hidden="true" />
                </span>
                <h3 className="mt-3.5 text-sm font-extrabold text-foreground">{s.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{s.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Cara menjual */}
      <section id="cara-menjual" aria-labelledby="cara-menjual-judul" className="mt-14 scroll-mt-28">
        <Reveal>
          <h2 id="cara-menjual-judul" className="text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl">
            Cara <span className="text-gradient-gold">menjual</span> akun — 4 langkah
          </h2>
        </Reveal>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {SELL_STEPS.map((s, i) => (
            <Reveal key={s.title} delay={i * 0.07}>
              <div className="glass relative h-full rounded-2xl p-5">
                <span className="absolute right-4 top-4 font-mono text-4xl font-black text-primary/15">
                  {i + 1}
                </span>
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground">
                  <s.icon className="h-5 w-5" aria-hidden="true" />
                </span>
                <h3 className="mt-3.5 text-sm font-extrabold text-foreground">{s.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{s.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
        <Reveal delay={0.15} className="mt-5">
          <p className="text-sm text-muted-foreground">
            Siap jual?{' '}
            <Link href="/daftar?peran=penjual" className="font-bold text-primary underline-offset-2 hover:underline">
              Daftar sebagai penjual di sini
            </Link>{' '}
            — atau baca dulu aturannya di{' '}
            <Link href="/syarat-ketentuan" className="font-bold text-primary underline-offset-2 hover:underline">
              Syarat &amp; Ketentuan
            </Link>
            .
          </p>
        </Reveal>
      </section>

      {/* Glosarium level */}
      <section id="level-akun" aria-labelledby="level-akun-judul" className="mt-14 scroll-mt-28">
        <Reveal>
          <h2 id="level-akun-judul" className="text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl">
            Arti <span className="text-gradient-gold">level akun</span> di katalog
          </h2>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">
            Setiap produk kami beri label level agar kamu tahu kelas kualitasnya sekilas — tanpa
            perlu menanyakan ulang ke admin.
          </p>
        </Reveal>
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {LEVEL_GLOSSARY.map((g, i) => (
            <Reveal key={g.badge} delay={i * 0.06}>
              <div className="glass flex h-full gap-4 rounded-2xl p-5">
                <span
                  className={`inline-flex h-fit shrink-0 items-center rounded-full border px-3 py-1 text-[11px] font-bold tracking-wider ${g.tone}`}
                >
                  {g.badge}
                </span>
                <div>
                  <h3 className="text-sm font-extrabold text-foreground">{g.title}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{g.body}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* FAQ dari database */}
      <section id="faq-lengkap" aria-labelledby="faq-lengkap-judul" className="mt-14 scroll-mt-28">
        <Reveal>
          <h2 id="faq-lengkap-judul" className="text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl">
            Pertanyaan yang <span className="text-gradient-gold">sering ditanyakan</span>
          </h2>
        </Reveal>
        <Reveal delay={0.1} className="mt-6 max-w-3xl">
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq) => (
              <AccordionItem
                key={faq.id}
                value={faq.id}
                className="glass mb-3 rounded-xl border border-border px-5 last:border-b!"
              >
                <AccordionTrigger className="py-5 text-sm font-semibold hover:text-primary hover:no-underline sm:text-base [&>svg]:h-5 [&>svg]:w-5 [&>svg]:text-primary">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="pb-5 text-sm leading-relaxed text-muted-foreground">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </Reveal>
      </section>

      {/* CTA */}
      <Reveal className="mt-12">
        <div className="rounded-2xl border border-primary/30 bg-primary/10 p-8 text-center">
          <h2 className="text-xl font-extrabold text-foreground sm:text-2xl">
            Jawabanmu tidak ada di daftar?
          </h2>
          <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-muted-foreground">
            Tanyakan langsung ke admin — dijawab manusia asli, rata-rata kurang dari 2 menit, 24/7.
          </p>
          <a
            href={waLink('Halo Admin Pusatakun! Saya sudah cek Pusat Bantuan tapi masih ada yang mau ditanyakan.')}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-5 inline-flex min-h-[44px] items-center gap-2 rounded-xl bg-primary px-6 text-sm font-bold text-primary-foreground shadow-lg shadow-primary/25 transition-transform hover:scale-[1.02]"
          >
            <MessageCircle className="h-4 w-4" aria-hidden="true" />
            Chat Admin Sekarang
          </a>
        </div>
      </Reveal>
    </div>
  )
}
