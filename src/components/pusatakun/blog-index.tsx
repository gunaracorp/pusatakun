'use client'

/**
 * PUSATAKUN — Index blog: pencarian + filter kategori + kartu artikel.
 */

import Link from 'next/link'
import { useMemo, useState } from 'react'
import { ArrowRight, CalendarDays, Clock, Search } from 'lucide-react'
import { Reveal } from '@/components/pusatakun/motion-primitives'
import type { BlogArticle } from '@/lib/blog-data'
import { formatDateID } from '@/lib/blog-data'

export function BlogIndex({
  articles,
  categories,
}: {
  articles: BlogArticle[]
  categories: string[]
}) {
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState<string | null>(null)

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return articles.filter((a) => {
      const matchCat = !category || a.category === category
      const matchQ =
        !q ||
        a.title.toLowerCase().includes(q) ||
        a.excerpt.toLowerCase().includes(q) ||
        a.tags.some((t) => t.toLowerCase().includes(q))
      return matchCat && matchQ
    })
  }, [articles, query, category])

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      {/* Pencarian + filter kategori */}
      <div className="glass rounded-2xl p-4 sm:p-5">
        <label className="relative block">
          <span className="sr-only">Cari artikel</span>
          <Search
            className="pointer-events-none absolute left-4 top-1/2 h-4.5 w-4.5 -translate-y-1/2 text-muted-foreground"
            aria-hidden="true"
          />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Cari artikel… (mis. escrow, shadowban, komisi)"
            className="min-h-[48px] w-full rounded-xl border border-border bg-background/60 pl-11 pr-4 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground/60 focus:border-primary/60"
          />
        </label>
        <div className="mt-3 flex flex-wrap gap-2" role="group" aria-label="Filter kategori artikel">
          <button
            type="button"
            onClick={() => setCategory(null)}
            aria-pressed={category === null}
            className={`min-h-[36px] rounded-full px-4 text-xs font-bold transition-colors ${
              category === null
                ? 'bg-primary text-primary-foreground'
                : 'border border-border text-muted-foreground hover:text-foreground'
            }`}
          >
            Semua ({articles.length})
          </button>
          {categories.map((cat) => {
            const count = articles.filter((a) => a.category === cat).length
            if (count === 0) return null
            return (
              <button
                key={cat}
                type="button"
                onClick={() => setCategory(category === cat ? null : cat)}
                aria-pressed={category === cat}
                className={`min-h-[36px] rounded-full px-4 text-xs font-bold transition-colors ${
                  category === cat
                    ? 'bg-primary text-primary-foreground'
                    : 'border border-border text-muted-foreground hover:text-foreground'
                }`}
              >
                {cat} ({count})
              </button>
            )
          })}
        </div>
      </div>

      {/* Grid artikel */}
      {filtered.length === 0 ? (
        <p className="mt-12 text-center text-sm text-muted-foreground">
          Tidak ada artikel yang cocok. Coba kata kunci lain.
        </p>
      ) : (
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((a, i) => (
            <Reveal key={a.slug} delay={i * 0.06}>
              <Link
                href={`/blog/${a.slug}`}
                className="glass group flex h-full flex-col rounded-2xl p-6 transition-transform duration-300 hover:-translate-y-1"
              >
                <div className="flex items-center gap-2 text-[11px] font-semibold text-muted-foreground">
                  <span className="rounded-full bg-primary/15 px-2.5 py-1 font-bold text-primary">
                    {a.category}
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <CalendarDays className="h-3.5 w-3.5" aria-hidden="true" />
                    {formatDateID(a.date)}
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5" aria-hidden="true" />
                    {a.readMinutes} mnt
                  </span>
                </div>
                <h2 className="mt-4 text-lg font-extrabold leading-snug text-foreground transition-colors group-hover:text-primary">
                  {a.title}
                </h2>
                <p className="mt-2.5 flex-1 text-sm leading-relaxed text-muted-foreground">
                  {a.excerpt}
                </p>
                <div className="mt-5 flex items-center justify-between">
                  <span className="text-xs font-bold text-primary">Baca artikel</span>
                  <ArrowRight
                    className="h-4 w-4 text-primary transition-transform duration-300 group-hover:translate-x-1"
                    aria-hidden="true"
                  />
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      )}
    </div>
  )
}
