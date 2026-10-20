'use client'

import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { RotateCcw, Search, SearchX, Zap } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Skeleton } from '@/components/ui/skeleton'
import {
  LEVELS,
  PRICE_RANGES,
  SORT_OPTIONS,
  type CategoryDTO,
  type ProductDTO,
  type SortOption,
} from '@/lib/marketplace'
import { useCatalogStore } from '@/store/catalog-store'
import { EASE, SectionHeading } from './motion-primitives'
import { ProductCard } from './product-card'

const PAGE_SIZE = 24

type ApiResult = {
  ok: boolean
  total: number
  products: ProductDTO[]
}

/* ============ Flash sale countdown (hydration-safe) ============ */
function useMidnightCountdown(): string | null {
  const [left, setLeft] = useState<string | null>(null)

  useEffect(() => {
    function pad(n: number) {
      return n.toString().padStart(2, '0')
    }
    function tick() {
      const now = new Date()
      const end = new Date(now)
      end.setHours(24, 0, 0, 0)
      const diff = Math.max(0, end.getTime() - now.getTime())
      setLeft(
        `${pad(Math.floor(diff / 3_600_000))}:${pad(Math.floor((diff % 3_600_000) / 60_000))}:${pad(Math.floor((diff % 60_000) / 1000))}`,
      )
    }
    tick()
    const id = window.setInterval(tick, 1000)
    return () => window.clearInterval(id)
  }, [])

  return left
}

function FlashBanner() {
  const left = useMidnightCountdown()
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, ease: EASE }}
      className="mb-8 flex flex-col items-center justify-between gap-3 rounded-2xl border border-primary/30 bg-gradient-to-r from-amber-500/15 via-primary/10 to-amber-500/15 p-4 sm:flex-row sm:p-5"
    >
      <div className="flex items-center gap-3">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground">
          <Zap className="h-5 w-5" aria-hidden="true" />
        </span>
        <div>
          <p className="text-sm font-extrabold tracking-wide text-foreground">
            FLASH SALE HARI INI — Diskon s/d 40%
          </p>
          <p className="text-xs text-muted-foreground">
            Sebut kupon <span className="font-bold text-primary">RAJA40</span> ke admin saat checkout.
          </p>
        </div>
      </div>
      <div className="flex items-center gap-2 text-sm">
        <span className="text-xs font-medium text-muted-foreground">Berakhir dalam</span>
        <span
          className="rounded-lg border border-primary/30 bg-background/60 px-3 py-1.5 font-mono text-base font-bold tabular-nums text-primary"
          aria-live="off"
          suppressHydrationWarning
        >
          {left ?? '--:--:--'}
        </span>
      </div>
    </motion.div>
  )
}

/* ============ Catalog ============ */
export function Catalog({
  categories,
  initialProducts,
  initialTotal,
  onOpenDetail,
}: {
  categories: CategoryDTO[]
  initialProducts: ProductDTO[]
  initialTotal: number
  onOpenDetail: (product: ProductDTO) => void
}) {
  const q = useCatalogStore((s) => s.q)
  const category = useCatalogStore((s) => s.category)
  const level = useCatalogStore((s) => s.level)
  const priceIdx = useCatalogStore((s) => s.priceIdx)
  const sort = useCatalogStore((s) => s.sort)
  const setQ = useCatalogStore((s) => s.setQ)
  const setCategory = useCatalogStore((s) => s.setCategory)
  const setLevel = useCatalogStore((s) => s.setLevel)
  const setPriceIdx = useCatalogStore((s) => s.setPriceIdx)
  const setSort = useCatalogStore((s) => s.setSort)
  const reset = useCatalogStore((s) => s.reset)

  // Local search input + debounced push into store
  const [input, setInput] = useState(q)
  const lastPushed = useRef(q)
  useEffect(() => {
    if (q !== lastPushed.current) {
      setInput(q)
      lastPushed.current = q
    }
  }, [q])
  useEffect(() => {
    const t = window.setTimeout(() => {
      if (input !== lastPushed.current) {
        lastPushed.current = input
        setQ(input)
      }
    }, 350)
    return () => window.clearTimeout(t)
  }, [input, setQ])

  const [items, setItems] = useState<ProductDTO[]>(initialProducts)
  const [total, setTotal] = useState(initialTotal)
  const [loading, setLoading] = useState(false)
  const [loadingMore, setLoadingMore] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const defaultFilters =
    q === '' && category === 'semua' && level === 'Semua' && priceIdx === -1 && sort === 'populer'

  // Skip the very first fetch when SSR data already matches default filters
  const skipFirstRef = useRef(initialProducts.length > 0)

  useEffect(() => {
    if (defaultFilters && skipFirstRef.current) {
      skipFirstRef.current = false
      return
    }
    const controller = new AbortController()
    let active = true
    ;(async () => {
      // One microtask keeps setState out of the synchronous effect body
      await Promise.resolve()
      if (!active) return
      setLoading(true)
      setError(null)
      const params = new URLSearchParams()
      if (q) params.set('q', q)
      if (category !== 'semua') params.set('category', category)
      if (level !== 'Semua') params.set('level', level)
      if (priceIdx >= 0 && PRICE_RANGES[priceIdx]) {
        params.set('minPrice', String(PRICE_RANGES[priceIdx].min))
        params.set('maxPrice', String(PRICE_RANGES[priceIdx].max))
      }
      params.set('sort', sort)
      params.set('limit', String(PAGE_SIZE))
      try {
        const res = await fetch(`/api/products?${params.toString()}`, {
          signal: controller.signal,
        })
        const data: ApiResult = await res.json()
        if (!active) return
        if (!data.ok) throw new Error('gagal')
        setItems(data.products)
        setTotal(data.total)
        setLoading(false)
      } catch (err: unknown) {
        if (err instanceof DOMException && err.name === 'AbortError') return
        if (!active) return
        setError('Gagal memuat katalog. Coba lagi.')
        setLoading(false)
      }
    })()
    return () => {
      active = false
      controller.abort()
    }
  }, [q, category, level, priceIdx, sort, defaultFilters])

  function loadMore() {
    if (loadingMore || items.length >= total) return
    setLoadingMore(true)
    const params = new URLSearchParams()
    if (q) params.set('q', q)
    if (category !== 'semua') params.set('category', category)
    if (level !== 'Semua') params.set('level', level)
    if (priceIdx >= 0 && PRICE_RANGES[priceIdx]) {
      params.set('minPrice', String(PRICE_RANGES[priceIdx].min))
      params.set('maxPrice', String(PRICE_RANGES[priceIdx].max))
    }
    params.set('sort', sort)
    params.set('limit', String(PAGE_SIZE))
    params.set('offset', String(items.length))
    fetch(`/api/products?${params.toString()}`)
      .then((r) => r.json())
      .then((data: ApiResult) => {
        if (!data.ok) throw new Error('gagal')
        setItems((prev) => [...prev, ...data.products])
        setTotal(data.total)
        setLoadingMore(false)
      })
      .catch(() => {
        setLoadingMore(false)
      })
  }

  const hasActiveFilters = !defaultFilters

  return (
    <section id="katalog" className="scroll-mt-28 py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          kicker="KATALOG RAJA"
          title="Cari Akun"
          highlight="Sesuai Keinginanmu"
          subtitle="Filter berdasarkan kategori, level keamanan, dan harga. Semua akun ready stok dan siap kirim instan."
        />

        <FlashBanner />

        {/* ============ Filter bar ============ */}
        <div className="glass sticky top-[72px] z-30 mb-6 rounded-2xl p-4">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
            {/* Search */}
            <div className="relative flex-1">
              <Search
                className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
                aria-hidden="true"
              />
              <label htmlFor="katalog-search" className="sr-only">
                Cari di katalog
              </label>
              <Input
                id="katalog-search"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Cari akun... (IG 1K, Netflix, ML VIP, Gmail)"
                className="h-11 rounded-xl border-border bg-background/40 pl-10"
              />
            </div>

            {/* Category select */}
            <div className="flex gap-3">
              <label htmlFor="katalog-kategori" className="sr-only">
                Filter kategori
              </label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger
                  id="katalog-kategori"
                  className="h-11 w-full rounded-xl bg-background/40 lg:w-48"
                >
                  <SelectValue placeholder="Semua Kategori" />
                </SelectTrigger>
                <SelectContent className="max-h-72">
                  <SelectItem value="semua">Semua Kategori</SelectItem>
                  {categories.map((c) => (
                    <SelectItem key={c.id} value={c.id}>
                      {c.name} ({c.productCount})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Sort select */}
              <label htmlFor="katalog-urutkan" className="sr-only">
                Urutkan
              </label>
              <Select value={sort} onValueChange={(v) => setSort(v as SortOption)}>
                <SelectTrigger
                  id="katalog-urutkan"
                  className="h-11 w-full rounded-xl bg-background/40 lg:w-44"
                >
                  <SelectValue placeholder="Urutkan" />
                </SelectTrigger>
                <SelectContent>
                  {SORT_OPTIONS.map((o) => (
                    <SelectItem key={o.value} value={o.value}>
                      {o.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Level + price chips */}
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <span className="mr-1 text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
              Level
            </span>
            {LEVELS.map((l) => (
              <button
                key={l}
                type="button"
                onClick={() => setLevel(l)}
                aria-pressed={level === l}
                className={`min-h-[36px] rounded-full px-3.5 text-xs font-semibold transition-all ${
                  level === l
                    ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/25'
                    : 'glass text-muted-foreground hover:text-foreground'
                }`}
              >
                {l}
              </button>
            ))}
            <span className="mx-1 hidden h-5 w-px bg-border sm:block" aria-hidden="true" />
            <span className="mr-1 text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
              Harga
            </span>
            <button
              type="button"
              onClick={() => setPriceIdx(-1)}
              aria-pressed={priceIdx === -1}
              className={`min-h-[36px] rounded-full px-3.5 text-xs font-semibold transition-all ${
                priceIdx === -1
                  ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/25'
                  : 'glass text-muted-foreground hover:text-foreground'
              }`}
            >
              Semua
            </button>
            {PRICE_RANGES.map((r, i) => (
              <button
                key={r.label}
                type="button"
                onClick={() => setPriceIdx(i)}
                aria-pressed={priceIdx === i}
                className={`min-h-[36px] rounded-full px-3.5 text-xs font-semibold transition-all ${
                  priceIdx === i
                    ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/25'
                    : 'glass text-muted-foreground hover:text-foreground'
                }`}
              >
                {r.label}
              </button>
            ))}
            {hasActiveFilters ? (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setInput('')
                  reset()
                }}
                className="ml-auto min-h-[36px] rounded-full px-3 text-xs font-semibold text-muted-foreground hover:text-foreground"
              >
                <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
                Reset
              </Button>
            ) : null}
          </div>
        </div>

        {/* Result count */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-2" aria-live="polite">
          <p className="text-sm text-muted-foreground">
            {loading ? (
              'Memuat katalog...'
            ) : (
              <>
                Menampilkan{' '}
                <span className="font-bold text-foreground">{items.length}</span> dari{' '}
                <span className="font-bold text-foreground">{total}</span> akun
              </>
            )}
          </p>
          {q ? (
            <Badge variant="outline" className="border-primary/30 text-primary">
              Pencarian: {q}
            </Badge>
          ) : null}
        </div>

        {/* ============ Grid ============ */}
        {error ? (
          <div className="flex flex-col items-center gap-4 rounded-2xl border border-destructive/30 bg-destructive/10 p-12 text-center">
            <SearchX className="h-10 w-10 text-destructive" aria-hidden="true" />
            <p className="font-semibold text-foreground">{error}</p>
            <Button variant="outline" onClick={() => reset()} className="rounded-xl">
              Coba Lagi
            </Button>
          </div>
        ) : loading ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="glass rounded-2xl p-5">
                <Skeleton className="h-5 w-20 bg-secondary" />
                <Skeleton className="mt-4 h-5 w-3/4 bg-secondary" />
                <Skeleton className="mt-2 h-3 w-1/2 bg-secondary" />
                <Skeleton className="mt-4 h-3 w-full bg-secondary" />
                <Skeleton className="mt-1.5 h-3 w-2/3 bg-secondary" />
                <Skeleton className="mt-5 h-2 w-full bg-secondary" />
                <Skeleton className="mt-5 h-7 w-24 bg-secondary" />
                <div className="mt-4 flex gap-2">
                  <Skeleton className="h-10 flex-1 bg-secondary" />
                  <Skeleton className="h-10 flex-1 bg-secondary" />
                </div>
              </div>
            ))}
          </div>
        ) : items.length === 0 ? (
          <div className="flex flex-col items-center gap-4 rounded-2xl border border-border bg-card/40 p-16 text-center">
            <span className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
              <SearchX className="h-8 w-8 text-primary" aria-hidden="true" />
            </span>
            <h3 className="text-lg font-bold text-foreground">Akun tidak ditemukan</h3>
            <p className="max-w-sm text-sm text-muted-foreground">
              Coba ubah kata kunci atau filter. Atau chat admin — akun custom bisa di-request
              sesuai keinginanmu.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <Button
                variant="outline"
                onClick={() => {
                  setInput('')
                  reset()
                }}
                className="rounded-xl"
              >
                Reset Filter
              </Button>
              <Button asChild className="rounded-xl">
                <a
                  href="https://wa.me/6281234567890?text=Halo%20Admin%20Raja%20Akun!%20Akun%20yang%20saya%20cari%20tidak%20ada%20di%20katalog.%20Bisa%20request%3F"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Request ke Admin
                </a>
              </Button>
            </div>
          </div>
        ) : (
          <>
            <motion.div layout className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              <AnimatePresence mode="popLayout">
                {items.map((p, i) => (
                  <ProductCard key={p.id} product={p} index={i} onOpenDetail={onOpenDetail} />
                ))}
              </AnimatePresence>
            </motion.div>

            {items.length < total ? (
              <div className="mt-10 flex justify-center">
                <Button
                  variant="outline"
                  size="lg"
                  onClick={loadMore}
                  disabled={loadingMore}
                  className="glass h-12 rounded-xl px-8 font-semibold"
                >
                  {loadingMore ? 'Memuat...' : `Muat Lebih Banyak (${total - items.length} lagi)`}
                </Button>
              </div>
            ) : null}
          </>
        )}
      </div>
    </section>
  )
}


