/**
 * RAJA AKUN — Kerangka artikel legal/kebijakan (Syarat & Ketentuan, Privasi, Garansi).
 * Server-safe. Termasuk Daftar Isi (anchor) + CTA bantuan di akhir.
 */

import Link from 'next/link'
import { FileText, MessageCircle, ShieldCheck } from 'lucide-react'
import { waLink } from '@/lib/marketplace'

export type TocItem = { id: string; label: string }

/** Satu bagian isi dengan judul ber-anchor. */
export function LegalSection({
  id,
  title,
  children,
}: {
  id: string
  title: string
  children: React.ReactNode
}) {
  return (
    <section id={id} aria-labelledby={`${id}-judul`} className="scroll-mt-28">
      <h2
        id={`${id}-judul`}
        className="flex items-center gap-3 border-l-4 border-primary pl-4 text-lg font-extrabold tracking-tight text-foreground sm:text-xl"
      >
        {title}
      </h2>
      <div className="mt-4 space-y-3.5 text-[15px] leading-relaxed text-muted-foreground [&_a]:font-semibold [&_a]:text-primary [&_a]:underline-offset-2 hover:[_a]:underline">
        {children}
      </div>
    </section>
  )
}

/** Daftar berbutir dengan penanda emas. */
export function LegalList({ items }: { items: React.ReactNode[] }) {
  return (
    <ul className="space-y-2.5">
      {items.map((item, i) => (
        <li key={i} className="flex items-start gap-3">
          <span aria-hidden="true" className="mt-[9px] h-1.5 w-1.5 shrink-0 rotate-45 bg-primary" />
          <span className="flex-1">{item}</span>
        </li>
      ))}
    </ul>
  )
}

/** Kerangka halaman legal: daftar isi + konten + kartu bantuan. */
export function LegalArticle({
  toc,
  updated,
  children,
}: {
  toc: TocItem[]
  updated: string
  children: React.ReactNode
}) {
  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="lg:grid lg:grid-cols-[260px_1fr] lg:gap-10">
        {/* Daftar isi — sticky di desktop */}
        <aside className="mb-10 lg:mb-0">
          <nav
            aria-label="Daftar isi"
            className="glass rounded-2xl p-5 lg:sticky lg:top-28"
          >
            <p className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.22em] text-primary">
              <FileText className="h-4 w-4" aria-hidden="true" />
              Daftar Isi
            </p>
            <ol className="mt-4 space-y-1">
              {toc.map((item, i) => (
                <li key={item.id}>
                  <a
                    href={`#${item.id}`}
                    className="flex min-h-[36px] items-center gap-2.5 rounded-lg px-2 text-sm text-muted-foreground transition-colors hover:bg-primary/10 hover:text-primary"
                  >
                    <span className="w-5 shrink-0 text-right font-mono text-[11px] text-muted-foreground/60">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    {item.label}
                  </a>
                </li>
              ))}
            </ol>
            <p className="mt-4 border-t border-border pt-3 text-[11px] leading-relaxed text-muted-foreground/70">
              Terakhir diperbarui: {updated}
            </p>
          </nav>
        </aside>

        {/* Isi */}
        <article className="max-w-3xl space-y-10">
          {children}

          {/* CTA bantuan */}
          <div className="rounded-2xl border border-primary/30 bg-primary/10 p-6">
            <p className="flex items-center gap-2 text-base font-extrabold text-foreground">
              <ShieldCheck className="h-5 w-5 text-primary" aria-hidden="true" />
              Masih ada pertanyaan?
            </p>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              Tim admin Raja Akun siap menjelaskan ketentuan apa pun lewat WhatsApp — gratis,
              dijawab manusia asli 24/7. Atau telusuri{' '}
              <Link href="/pusat-bantuan" className="font-semibold text-primary underline-offset-2 hover:underline">
                Pusat Bantuan
              </Link>{' '}
              untuk ringkasan singkat.
            </p>
            <a
              href={waLink('Halo Admin Raja Akun! Saya mau bertanya soal kebijakan di situs ini.')}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-flex min-h-[44px] items-center gap-2 rounded-xl bg-primary px-5 text-sm font-bold text-primary-foreground shadow-lg shadow-primary/25 transition-transform hover:scale-[1.02]"
            >
              <MessageCircle className="h-4 w-4" aria-hidden="true" />
              Tanya Admin via WhatsApp
            </a>
          </div>
        </article>
      </div>
    </div>
  )
}
