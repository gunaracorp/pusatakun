'use client'

/**
 * PUSATAKUN — Halaman promo: countdown flash sale (hydration-safe), kupon
 * copy-to-clipboard, daftar promo berjalan + syarat ringkas.
 */

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Check, Copy, Flame, Gift, Rocket, Users } from 'lucide-react'
import { Reveal } from '@/components/pusatakun/motion-primitives'
import { useToast } from '@/hooks/use-toast'

function pad(n: number): string {
  return String(n).padStart(2, '0')
}

function msToMidnight(): number {
  const now = new Date()
  const end = new Date(now)
  end.setHours(23, 59, 59, 999)
  return Math.max(0, end.getTime() - now.getTime())
}

const PROMOS = [
  {
    icon: Flame,
    badge: 'HARIAN',
    title: 'Flash Sale Harian — Diskon s/d 40%',
    desc: 'Setiap hari, akun pilihan dipotong hingga 40% sampai tengah malam. Sebut kupon PUSATA40 ke admin saat checkout.',
    term: 'Berlaku 1 akun per transaksi · tidak bisa digabung promo lain.',
    coupon: 'PUSATA40',
  },
  {
    icon: Users,
    badge: 'RESELLER',
    title: 'Bundel Reseller — Beli 5 Gratis 1 Level Naik',
    desc: 'Beli 5 akun dalam satu bulan, akun ke-6 dapat upgrade level satu tingkat (FRESH→AMAN, AMAN→PREMIUM) tanpa biaya.',
    term: 'Diakumulasikan otomatis dari pesanan selesai · klaim via admin.',
    coupon: null,
  },
  {
    icon: Rocket,
    badge: 'PENJUAL BARU',
    title: 'Komisi 0% Bulan Pertama untuk Penjual Baru',
    desc: 'Daftar jadi penjual bulan ini dan nikmati komisi 0% untuk 10 transaksi pertama — 100% harga jual jadi milikmu.',
    term: 'Otomatis aktif setelah kurasi listing pertama disetujui.',
    coupon: null,
  },
  {
    icon: Gift,
    badge: 'SETIA',
    title: 'Garansi Ekstra +7 Hari untuk Pembeli Kembali',
    desc: 'Transaksi kedua dan seterusnya mendapat perpanjangan garansi +7 hari pada semua jenis akun.',
    term: 'Terikat nomor WhatsApp yang terdaftar · berlaku selamanya.',
    coupon: null,
  },
]

export function PromoClient() {
  const [left, setLeft] = useState<number | null>(null)
  const [copied, setCopied] = useState<string | null>(null)
  const { toast } = useToast()

  // Hydration-safe: hitung mundur hanya mulai di klien
  useEffect(() => {
    const update = () => setLeft(msToMidnight())
    const initial = setTimeout(update, 0)
    const t = setInterval(update, 1000)
    return () => {
      clearTimeout(initial)
      clearInterval(t)
    }
  }, [])

  const h = left !== null ? Math.floor(left / 3_600_000) : null
  const m = left !== null ? Math.floor((left % 3_600_000) / 60_000) : null
  const s = left !== null ? Math.floor((left % 60_000) / 1000) : null

  async function copyCoupon(code: string) {
    try {
      await navigator.clipboard.writeText(code)
      setCopied(code)
      setTimeout(() => setCopied(null), 2000)
      toast({ title: 'Kupon disalin!', description: `Tempel kupon ${code} saat chat admin.` })
    } catch {
      toast({ title: 'Gagal menyalin', description: `Catat manual ya: ${code}` })
    }
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      {/* Banner flash sale */}
      <Reveal>
        <div className="glass relative overflow-hidden rounded-3xl p-6 text-center sm:p-10">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -top-24 left-1/2 h-64 w-[520px] -translate-x-1/2 rounded-full bg-primary/20 blur-3xl"
          />
          <span className="relative inline-flex items-center gap-2 rounded-full bg-primary/15 px-4 py-1.5 text-[11px] font-extrabold uppercase tracking-[0.22em] text-primary">
            <Flame className="h-3.5 w-3.5" aria-hidden="true" />
            Flash Sale Berakhir Dalam
          </span>
          <div
            className="relative mt-5 flex justify-center gap-2.5 font-mono"
            role="timer"
            aria-label={left !== null ? `Sisa waktu ${h} jam ${m} menit ${s} detik` : 'Menghitung sisa waktu'}
          >
            {[
              { v: h, label: 'JAM' },
              { v: m, label: 'MENIT' },
              { v: s, label: 'DETIK' },
            ].map((u) => (
              <div key={u.label} className="glass min-w-[86px] rounded-2xl px-4 py-3.5 sm:min-w-[104px]">
                <span className="block text-3xl font-extrabold tabular-nums text-foreground sm:text-4xl">
                  {u.v === null ? '--' : pad(u.v)}
                </span>
                <span className="mt-1 block text-[10px] font-extrabold tracking-[0.2em] text-muted-foreground">
                  {u.label}
                </span>
              </div>
            ))}
          </div>
          <p className="relative mx-auto mt-5 max-w-xl text-sm leading-relaxed text-muted-foreground">
            Reset setiap tengah malam. Diskon s/d 40% untuk akun pilihan — sebut kupon{' '}
            <strong className="text-foreground">PUSATA40</strong> ke admin saat checkout.
          </p>
          <button
            type="button"
            onClick={() => copyCoupon('PUSATA40')}
            className="relative mt-6 inline-flex min-h-[48px] items-center gap-2 rounded-xl bg-primary px-6 text-sm font-extrabold text-primary-foreground transition-opacity hover:opacity-90"
          >
            {copied === 'PUSATA40' ? <Check className="h-4 w-4" aria-hidden="true" /> : <Copy className="h-4 w-4" aria-hidden="true" />}
            {copied === 'PUSATA40' ? 'Kupon Disalin!' : 'Salin Kupon PUSATA40'}
          </button>
        </div>
      </Reveal>

      {/* Grid promo */}
      <div className="mt-10 grid gap-5 sm:grid-cols-2">
        {PROMOS.map((p, i) => (
          <Reveal key={p.title} delay={i * 0.06}>
            <div className="glass flex h-full flex-col rounded-2xl p-6">
              <div className="flex items-center justify-between">
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/15">
                  <p.icon className="h-5.5 w-5.5 text-primary" aria-hidden="true" />
                </span>
                <span className="rounded-full bg-primary/15 px-3 py-1 text-[10px] font-extrabold uppercase tracking-[0.18em] text-primary">
                  {p.badge}
                </span>
              </div>
              <h2 className="mt-4 text-lg font-extrabold leading-snug text-foreground">{p.title}</h2>
              <p className="mt-2.5 flex-1 text-sm leading-relaxed text-muted-foreground">{p.desc}</p>
              <p className="mt-3 text-xs italic text-muted-foreground/70">{p.term}</p>
              {p.coupon ? (
                <button
                  type="button"
                  onClick={() => copyCoupon(p.coupon!)}
                  className="mt-4 inline-flex min-h-[44px] items-center justify-center gap-2 rounded-xl border border-dashed border-primary/60 px-4 font-mono text-sm font-extrabold tracking-widest text-primary transition-colors hover:bg-primary/10"
                  aria-label={`Salin kupon ${p.coupon}`}
                >
                  {copied === p.coupon ? <Check className="h-4 w-4" aria-hidden="true" /> : <Copy className="h-4 w-4" aria-hidden="true" />}
                  {p.coupon}
                </button>
              ) : (
                <Link
                  href="/mitra"
                  className="mt-4 inline-flex min-h-[44px] items-center justify-center rounded-xl border border-primary/50 px-4 text-sm font-extrabold text-primary transition-colors hover:bg-primary/10"
                >
                  Lihat Programnya →
                </Link>
              )}
            </div>
          </Reveal>
        ))}
      </div>

      <p className="mt-8 text-center text-xs text-muted-foreground/70">
        Admin berhak memverifikasi kelayakan promo per transaksi. Promo yang disalahgunakan (multi-akun,
        klaim palsu) dapat dibatalkan sesuai Syarat &amp; Ketentuan.
      </p>
    </div>
  )
}
