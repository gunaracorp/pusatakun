'use client'

/**
 * PUSATAKUN — Halaman ulasan: ringkasan rating + filter bintang + urutan.
 */

import { useMemo, useState } from 'react'
import { Star } from 'lucide-react'
import { Reveal } from '@/components/pusatakun/motion-primitives'

export type UlasanDTO = {
  id: string
  name: string
  city: string
  role: string
  content: string
  rating: number
  initials: string
}

type SortKey = 'tertinggi' | 'terendah' | 'default'

function Stars({ n }: { n: number }) {
  return (
    <span className="flex gap-0.5" aria-label={`Rating ${n} dari 5`} role="img">
      {[1, 2, 3, 4, 5].map((s) => (
        <Star
          key={s}
          className={`h-4 w-4 ${s <= n ? 'fill-primary text-primary' : 'text-border'}`}
          aria-hidden="true"
        />
      ))}
    </span>
  )
}

export function UlasanClient({ testimonials }: { testimonials: UlasanDTO[] }) {
  const [minRating, setMinRating] = useState<number>(0)
  const [sort, setSort] = useState<SortKey>('default')

  const avg =
    testimonials.length > 0
      ? testimonials.reduce((n, t) => n + t.rating, 0) / testimonials.length
      : 0
  const dist = [5, 4, 3, 2, 1].map((star) => ({
    star,
    count: testimonials.filter((t) => t.rating === star).length,
  }))
  const maxCount = Math.max(1, ...dist.map((d) => d.count))

  const filtered = useMemo(() => {
    let list = testimonials.filter((t) => t.rating >= minRating)
    if (sort === 'tertinggi') list = [...list].sort((a, b) => b.rating - a.rating)
    if (sort === 'terendah') list = [...list].sort((a, b) => a.rating - b.rating)
    return list
  }, [testimonials, minRating, sort])

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="grid gap-6 lg:grid-cols-[320px_1fr]">
        {/* Ringkasan + filter */}
        <aside className="space-y-5 lg:sticky lg:top-24 lg:self-start">
          <div className="glass rounded-2xl p-6 text-center">
            <p className="text-5xl font-extrabold tracking-tight text-foreground">
              {avg.toFixed(1)}
            </p>
            <div className="mt-2 flex justify-center">
              <Stars n={Math.round(avg)} />
            </div>
            <p className="mt-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">
              {testimonials.length} ulasan terverifikasi
            </p>
            <div className="mt-5 space-y-2">
              {dist.map((d) => (
                <button
                  key={d.star}
                  type="button"
                  onClick={() => setMinRating(minRating === d.star ? 0 : d.star)}
                  aria-pressed={minRating === d.star}
                  className={`flex w-full items-center gap-2 rounded-lg px-2 py-1.5 transition-colors ${minRating === d.star ? 'bg-primary/15' : 'hover:bg-background/60'}`}
                >
                  <span className="w-7 text-xs font-bold text-muted-foreground">{d.star}★</span>
                  <span className="h-2 flex-1 overflow-hidden rounded-full bg-border/60">
                    <span
                      className="block h-full rounded-full bg-gradient-to-r from-[#E8961E] to-[#FFD97A]"
                      style={{ width: `${(d.count / maxCount) * 100}%` }}
                    />
                  </span>
                  <span className="w-6 text-right text-xs font-bold text-muted-foreground">{d.count}</span>
                </button>
              ))}
            </div>
            {minRating > 0 ? (
              <p className="mt-3 text-xs font-bold text-primary">
                Menampilkan rating ≥ {minRating} bintang
              </p>
            ) : null}
          </div>

          <div className="glass rounded-2xl p-5">
            <label htmlFor="sort-ulasan" className="text-xs font-extrabold uppercase tracking-[0.2em] text-primary">
              Urutkan
            </label>
            <select
              id="sort-ulasan"
              value={sort}
              onChange={(e) => setSort(e.target.value as SortKey)}
              className="mt-3 min-h-[44px] w-full rounded-xl border border-border bg-background/60 px-3 text-sm font-semibold text-foreground outline-none focus:border-primary/60"
            >
              <option value="default">Urutan kurasi</option>
              <option value="tertinggi">Rating tertinggi</option>
              <option value="terendah">Rating terendah</option>
            </select>
          </div>
        </aside>

        {/* Daftar ulasan */}
        <div>
          {filtered.length === 0 ? (
            <p className="glass rounded-2xl p-10 text-center text-sm text-muted-foreground">
              Tidak ada ulasan dengan filter ini. Klik ulang filter bintang untuk mereset.
            </p>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2">
              {filtered.map((t, i) => (
                <Reveal key={t.id} delay={Math.min(i * 0.05, 0.4)}>
                  <figure className="glass flex h-full flex-col rounded-2xl p-6">
                    <div className="flex items-center gap-3">
                      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary/15 text-sm font-extrabold text-primary">
                        {t.initials}
                      </span>
                      <div className="min-w-0">
                        <figcaption className="truncate text-sm font-extrabold text-foreground">
                          {t.name}
                        </figcaption>
                        <p className="truncate text-xs text-muted-foreground">
                          {t.role} · {t.city}
                        </p>
                      </div>
                    </div>
                    <blockquote className="mt-4 flex-1 text-sm leading-relaxed text-muted-foreground">
                      &ldquo;{t.content}&rdquo;
                    </blockquote>
                    <div className="mt-4">
                      <Stars n={t.rating} />
                    </div>
                  </figure>
                </Reveal>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
