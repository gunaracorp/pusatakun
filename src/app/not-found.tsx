import Link from 'next/link'
import { Crown, Home, MessageCircle, Search, ShoppingBag } from 'lucide-react'
import { SITE, waLink } from '@/lib/marketplace'

export default function NotFound() {
  return (
    <div className="relative flex min-h-screen flex-col overflow-hidden bg-background text-foreground">
      {/* Glow royal */}
      <div aria-hidden="true" className="bg-royal-glow pointer-events-none absolute inset-0" />

      <main className="relative flex flex-1 items-center justify-center px-4 py-28">
        <div className="w-full max-w-lg text-center">
          <span className="glass mx-auto inline-flex min-h-[40px] items-center gap-2 rounded-full px-5 py-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-primary">
            <Crown className="h-4 w-4" aria-hidden="true" />
            {SITE.domain}
          </span>

          <p className="mt-8 text-[6rem] font-black leading-none tracking-tight text-gradient-gold sm:text-[8rem]">
            404
          </p>
          <h1 className="mt-2 text-2xl font-extrabold tracking-tight sm:text-3xl">
            Halaman ini tidak ditemukan
          </h1>
          <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-muted-foreground sm:text-base">
            Mungkin tautannya sudah berubah, produk sudah terjual, atau alamatnya salah ketik.
            Tenang — semua akun terbaik kami tetap ada di katalog.
          </p>

          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              href="/katalog"
              className="inline-flex min-h-[48px] w-full items-center justify-center gap-2 rounded-xl bg-primary px-6 text-sm font-bold text-primary-foreground shadow-lg shadow-primary/25 transition-transform hover:scale-[1.02] sm:w-auto"
            >
              <ShoppingBag className="h-4 w-4" aria-hidden="true" />
              Lihat Katalog Akun
            </Link>
            <Link
              href="/"
              className="inline-flex min-h-[48px] w-full items-center justify-center gap-2 rounded-xl border border-primary/40 px-6 text-sm font-bold text-primary transition-colors hover:bg-primary/10 sm:w-auto"
            >
              <Home className="h-4 w-4" aria-hidden="true" />
              Kembali ke Beranda
            </Link>
          </div>

          <div className="mt-8 flex flex-col items-center gap-3">
            <Link
              href="/pusat-bantuan"
              className="inline-flex min-h-[44px] items-center gap-2 text-sm font-semibold text-muted-foreground transition-colors hover:text-primary"
            >
              <Search className="h-4 w-4" aria-hidden="true" />
              Cari jawaban di Pusat Bantuan
            </Link>
            <a
              href={waLink('Halo Admin Pusatakun! Saya menemukan halaman error 404 di situs ini.')}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-[44px] items-center gap-2 text-sm font-semibold text-muted-foreground transition-colors hover:text-primary"
            >
              <MessageCircle className="h-4 w-4" aria-hidden="true" />
              Lapor ke Admin (24/7)
            </a>
          </div>
        </div>
      </main>
    </div>
  )
}
