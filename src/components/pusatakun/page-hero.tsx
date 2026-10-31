/**
 * PUSATAKUN — Kepala halaman standar untuk semua subhalaman.
 * Server-safe (tanpa hook): breadcrumb + judul + subjudul, tema royal dark gold.
 */

import Link from 'next/link'
import { ChevronRight, Crown } from 'lucide-react'
import { SITE } from '@/lib/marketplace'

export function Breadcrumbs({ items }: { items: { label: string; href?: string }[] }) {
  return (
    <nav aria-label="Breadcrumb" className="mb-6">
      <ol className="flex flex-wrap items-center gap-1.5 text-xs text-muted-foreground">
        <li>
          <Link
            href="/"
            className="inline-flex min-h-[32px] items-center gap-1.5 font-semibold transition-colors hover:text-primary"
          >
            <Crown className="h-3.5 w-3.5 text-primary" aria-hidden="true" />
            Beranda
          </Link>
        </li>
        {items.map((item, i) => (
          <li key={i} className="inline-flex items-center gap-1.5">
            <ChevronRight className="h-3.5 w-3.5 opacity-50" aria-hidden="true" />
            {item.href ? (
              <Link
                href={item.href}
                className="inline-flex min-h-[32px] items-center font-semibold transition-colors hover:text-primary"
              >
                {item.label}
              </Link>
            ) : (
              <span className="font-semibold text-foreground/80" aria-current="page">
                {item.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  )
}

/** Hero pembuka subhalaman: breadcrumb + kicker + judul + deskripsi. */
export function PageHero({
  kicker,
  title,
  highlight,
  description,
  breadcrumb,
}: {
  kicker: string
  title: string
  highlight?: string
  description?: string
  breadcrumb: { label: string; href?: string }[]
}) {
  return (
    <header className="relative overflow-hidden border-b border-border">
      {/* Glow royal (pola sama dgn beranda) */}
      <div
        aria-hidden="true"
        className="bg-royal-glow pointer-events-none absolute inset-0"
      />
      <div className="relative mx-auto max-w-7xl px-4 pb-12 pt-28 sm:px-6 sm:pt-32 lg:px-8">
        <Breadcrumbs items={breadcrumb} />
        <div className="flex justify-start">
          <span className="glass inline-flex min-h-[32px] items-center gap-2 rounded-full px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.22em] text-primary">
            <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-primary" />
            {kicker}
          </span>
        </div>
        <h1 className="mt-5 max-w-3xl text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
          {title}
          {highlight ? <> <span className="text-gradient-gold">{highlight}</span></> : null}
        </h1>
        {description ? (
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
            {description}
          </p>
        ) : null}
        <p className="mt-4 text-xs text-muted-foreground/70">
          {SITE.domain} · {SITE.company}
        </p>
      </div>
    </header>
  )
}
