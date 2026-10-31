'use client'

/**
 * RAJA AKUN — Error boundary global (client).
 * Dirender saat terjadi error runtime yang tidak tertangani.
 */

import { useEffect } from 'react'
import { Crown, Home, RotateCcw, TriangleAlert } from 'lucide-react'
import Link from 'next/link'
import { SITE, waLink } from '@/lib/marketplace'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Catat ke console agar terlihat di log server/client debugging.
    console.error('[RajaAkun Error Boundary]', error)
  }, [error])

  return (
    <div className="relative flex min-h-screen flex-col overflow-hidden bg-background text-foreground">
      <div aria-hidden="true" className="bg-royal-glow pointer-events-none absolute inset-0" />
      <main className="relative flex flex-1 items-center justify-center px-4 py-28">
        <div className="w-full max-w-lg text-center">
          <span className="glass mx-auto inline-flex min-h-[40px] items-center gap-2 rounded-full px-5 py-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-primary">
            <Crown className="h-4 w-4" aria-hidden="true" />
            {SITE.domain}
          </span>

          <span className="mx-auto mt-8 flex h-16 w-16 items-center justify-center rounded-2xl bg-red-500/15">
            <TriangleAlert className="h-8 w-8 text-red-400" aria-hidden="true" />
          </span>
          <h1 className="mt-6 text-2xl font-extrabold tracking-tight sm:text-3xl">
            Ada yang tidak beres di pihak kami
          </h1>
          <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-muted-foreground sm:text-base">
            Terjadi kesalahan tak terduga saat menampilkan halaman ini. Coba muat ulang — kalau
            masih sama, admin kami siap membantu 24/7.
          </p>

          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <button
              type="button"
              onClick={reset}
              className="inline-flex min-h-[48px] w-full items-center justify-center gap-2 rounded-xl bg-primary px-6 text-sm font-bold text-primary-foreground shadow-lg shadow-primary/25 transition-transform hover:scale-[1.02] sm:w-auto"
            >
              <RotateCcw className="h-4 w-4" aria-hidden="true" />
              Muat Ulang Halaman
            </button>
            <Link
              href="/"
              className="inline-flex min-h-[48px] w-full items-center justify-center gap-2 rounded-xl border border-primary/40 px-6 text-sm font-bold text-primary transition-colors hover:bg-primary/10 sm:w-auto"
            >
              <Home className="h-4 w-4" aria-hidden="true" />
              Kembali ke Beranda
            </Link>
          </div>

          <a
            href={waLink('Halo Admin Raja Akun! Saya menemukan error di situs ini.')}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-8 inline-flex min-h-[44px] items-center text-sm font-semibold text-muted-foreground transition-colors hover:text-primary"
          >
            Lapor error ke Admin via WhatsApp
          </a>
        </div>
      </main>
    </div>
  )
}
