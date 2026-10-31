'use client'

/**
 * PUSATAKUN — Kamus istilah: pencarian realtime + filter kategori + jump huruf.
 */

import { useMemo, useState } from 'react'
import { BookOpen, Search } from 'lucide-react'
import { Reveal } from '@/components/pusatakun/motion-primitives'
import { KAMUS, KAMUS_CATEGORIES, type KamusEntry } from '@/lib/kamus-data'

export function KamusClient() {
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState<string | null>(null)
  const [openTerm, setOpenTerm] = useState<string | null>(null)

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return KAMUS.filter((e) => {
      const matchCat = !category || e.category === category
      const matchQ =
        !q ||
        e.term.toLowerCase().includes(q) ||
        e.definition.toLowerCase().includes(q)
      return matchCat && matchQ
    }).sort((a, b) => a.term.localeCompare(b.term, 'id'))
  }, [query, category])

  const letters = useMemo(
    () => [...new Set(filtered.map((e) => e.term[0].toUpperCase()))].sort(),
    [filtered],
  )

  function toggle(term: string) {
    setOpenTerm(openTerm === term ? null : term)
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
      {/* Kontrol */}
      <div className="glass rounded-2xl p-4 sm:p-5">
        <label className="relative block">
          <span className="sr-only">Cari istilah</span>
          <Search
            className="pointer-events-none absolute left-4 top-1/2 h-4.5 w-4.5 -translate-y-1/2 text-muted-foreground"
            aria-hidden="true"
          />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Cari istilah… (mis. escrow, shadowban, garansi)"
            className="min-h-[48px] w-full rounded-xl border border-border bg-background/60 pl-11 pr-4 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground/60 focus:border-primary/60"
          />
        </label>
        <div className="mt-3 flex flex-wrap gap-2" role="group" aria-label="Filter kategori istilah">
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
            Semua ({KAMUS.length})
          </button>
          {KAMUS_CATEGORIES.map((cat) => {
            const count = KAMUS.filter((e) => e.category === cat).length
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

      {/* Jump huruf */}
      {letters.length > 1 ? (
        <nav aria-label="Lompat ke huruf" className="mt-5 flex flex-wrap gap-1.5">
          {letters.map((l) => (
            <a
              key={l}
              href={`#huruf-${l}`}
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-border text-xs font-extrabold text-muted-foreground transition-colors hover:border-primary/50 hover:text-primary"
            >
              {l}
            </a>
          ))}
        </nav>
      ) : null}

      {/* Daftar istilah */}
      {filtered.length === 0 ? (
        <p className="mt-12 text-center text-sm text-muted-foreground">
          Istilah tidak ditemukan. Coba kata kunci lain, atau tanyakan langsung ke admin.
        </p>
      ) : (
        <div className="mt-8 space-y-8">
          {letters.map((letter) => (
            <section key={letter} id={`huruf-${letter}`} aria-label={`Istilah huruf ${letter}`}>
              <h2 className="flex items-center gap-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-sm font-extrabold text-primary-foreground">
                  {letter}
                </span>
                <span className="h-px flex-1 bg-border" aria-hidden="true" />
              </h2>
              <div className="mt-4 grid gap-3 md:grid-cols-2">
                {filtered
                  .filter((e) => e.term[0].toUpperCase() === letter)
                  .map((entry: KamusEntry) => {
                    const open = openTerm === entry.term
                    return (
                      <Reveal key={entry.term} delay={0.03}>
                        <button
                          type="button"
                          onClick={() => toggle(entry.term)}
                          aria-expanded={open}
                          className="glass h-full w-full rounded-xl p-5 text-left transition-transform duration-300 hover:-translate-y-0.5"
                        >
                          <div className="flex items-center justify-between gap-3">
                            <h3 className="text-base font-extrabold text-foreground">{entry.term}</h3>
                            <span className="shrink-0 rounded-full bg-primary/15 px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-wider text-primary">
                              {entry.category}
                            </span>
                          </div>
                          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                            {entry.definition}
                          </p>
                          {entry.detail ? (
                            <div
                              className={`grid transition-all duration-300 ${open ? 'mt-3 grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}
                            >
                              <p className="overflow-hidden border-l-2 border-primary/50 pl-3 text-sm leading-relaxed text-foreground/80">
                                {entry.detail}
                              </p>
                            </div>
                          ) : null}
                          {entry.detail ? (
                            <p className="mt-3 inline-flex items-center gap-1.5 text-[11px] font-bold text-primary">
                              <BookOpen className="h-3.5 w-3.5" aria-hidden="true" />
                              {open ? 'Tutup detail' : 'Baca detail'}
                            </p>
                          ) : null}
                        </button>
                      </Reveal>
                    )
                  })}
              </div>
            </section>
          ))}
        </div>
      )}
    </div>
  )
}
