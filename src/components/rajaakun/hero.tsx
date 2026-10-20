'use client'

import { useEffect, useRef, useState } from 'react'
import {
  motion,
  useScroll,
  useTransform,
  type Variants,
} from 'framer-motion'
import {
  ArrowRight,
  Clapperboard,
  Instagram,
  LayoutGrid,
  MessageCircle,
  Mouse,
  Package,
  Search,
  ShieldCheck,
  ShoppingBag,
  Star,
  Swords,
  Zap,
  type LucideIcon,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { formatIDR, waLink, type CategoryDTO, type StatsDTO } from '@/lib/marketplace'
import { useCatalogStore } from '@/store/catalog-store'
import { CountUp, EASE } from './motion-primitives'

const H1_LINE_1 = ['Pusat', 'Jual', 'Beli', 'Akun', 'Media', 'Sosial']
const H1_LINE_2 = ['Terlengkap', '&', 'Termurah']

const containerVariants: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08, delayChildren: 0.15 } },
}

const wordVariants: Variants = {
  hidden: { opacity: 0, y: 28, filter: 'blur(10px)' },
  show: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { duration: 0.7, ease: EASE },
  },
}

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0 },
}

type FloatingCard = {
  icon: LucideIcon
  gradient: string
  title: string
  price: string
  badge: string
  badgeClass: string
  position: string
  delay: string
}

const FLOAT_CARDS: FloatingCard[] = [
  {
    icon: Instagram,
    gradient: 'from-fuchsia-500 to-rose-500',
    title: 'Akun IG Aman 1K',
    price: formatIDR(85000),
    badge: 'Terjual 1.4K+',
    badgeClass: 'bg-primary/15 text-primary',
    position: 'left-0 top-4',
    delay: '0s',
  },
  {
    icon: Clapperboard,
    gradient: 'from-red-500 to-rose-600',
    title: 'Netflix Premium 4K',
    price: formatIDR(45000),
    badge: 'Hot',
    badgeClass: 'bg-red-500/15 text-red-400',
    position: 'right-0 top-36',
    delay: '1.2s',
  },
  {
    icon: Swords,
    gradient: 'from-amber-500 to-red-500',
    title: 'ML VIP Full Skin',
    price: formatIDR(2500000),
    badge: 'Premium',
    badgeClass: 'bg-amber-500/15 text-amber-400',
    position: 'left-10 bottom-6',
    delay: '2.2s',
  },
]

export function Hero({ stats, categories }: { stats: StatsDTO; categories: CategoryDTO[] }) {
  const [query, setQuery] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)
  const sectionRef = useRef<HTMLElement>(null)

  // Light parallax on the floating-card composition
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start'],
  })
  const cardY = useTransform(scrollYProgress, [0, 1], [0, -60])

  // Keyboard shortcut "/" focuses the search input
  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key !== '/') return
      const target = event.target as HTMLElement | null
      const isTyping =
        target &&
        (target.tagName === 'INPUT' ||
          target.tagName === 'TEXTAREA' ||
          target.isContentEditable)
      if (isTyping) return
      event.preventDefault()
      inputRef.current?.focus()
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [])

  function goToKatalog() {
    document.getElementById('katalog')?.scrollIntoView({ behavior: 'smooth' })
  }

  function onSearchSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    useCatalogStore.getState().setQ(query.trim())
    useCatalogStore.getState().setCategory('semua')
    goToKatalog()
  }

  function onQuickCategory(categoryId: string) {
    useCatalogStore.getState().setCategory(categoryId)
    goToKatalog()
  }

  const quickCategories = categories.slice(0, 5)

  return (
    <section
      id="beranda"
      ref={sectionRef}
      className="relative scroll-mt-28 overflow-hidden bg-royal-glow"
    >
      {/* Decorative layers */}
      <div aria-hidden="true" className="bg-royal-grid absolute inset-0" />
      <div
        aria-hidden="true"
        className="animate-float absolute -left-24 -top-24 h-96 w-96 rounded-full bg-amber-500/20 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="animate-float-slow absolute -right-32 top-40 h-[28rem] w-[28rem] rounded-full bg-violet-500/15 blur-3xl"
        style={{ animationDelay: '1.5s' }}
      />
      <div
        aria-hidden="true"
        className="animate-float absolute bottom-0 left-1/3 h-80 w-80 rounded-full bg-yellow-500/10 blur-3xl"
        style={{ animationDelay: '3s' }}
      />

      <div className="relative mx-auto flex min-h-[92svh] w-full max-w-7xl items-center px-4 pb-20 pt-32 sm:px-6 lg:px-8">
        <div className="grid w-full items-center gap-12 lg:grid-cols-12">
          {/* ============ LEFT COLUMN ============ */}
          <div className="lg:col-span-7">
            {/* Badge */}
            <motion.div
              variants={fadeUp}
              initial="hidden"
              animate="show"
              transition={{ duration: 0.7, ease: EASE }}
            >
              <span className="glass inline-flex min-h-[40px] items-center gap-2.5 rounded-full px-4 py-2 text-xs font-medium text-foreground/90">
                <span aria-hidden="true" className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary/70" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
                </span>
                <ShieldCheck className="h-4 w-4 text-primary" aria-hidden="true" />
                Marketplace Akun #1 Indonesia — Sejak 2021
              </span>
            </motion.div>

            {/* H1 word-by-word */}
            <motion.h1
              variants={containerVariants}
              initial="hidden"
              animate="show"
              className="mt-6 text-4xl font-black leading-[1.05] tracking-tight text-foreground sm:text-6xl lg:text-7xl"
            >
              <span className="block">
                {H1_LINE_1.map((word) => (
                  <motion.span
                    key={word}
                    variants={wordVariants}
                    className="mr-[0.28em] inline-block will-change-transform"
                  >
                    {word}
                  </motion.span>
                ))}
              </span>
              <span className="block">
                {H1_LINE_2.map((word) => (
                  <motion.span
                    key={word}
                    variants={wordVariants}
                    className="text-gradient-gold mr-[0.28em] inline-block will-change-transform"
                  >
                    {word}
                  </motion.span>
                ))}
              </span>
            </motion.h1>

            {/* SEO subtitle */}
            <motion.p
              variants={fadeUp}
              initial="hidden"
              animate="show"
              transition={{ duration: 0.7, ease: EASE, delay: 0.35 }}
              className="mt-6 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg"
            >
              Jual beli 100+ jenis akun: Instagram, TikTok, YouTube, Facebook, akun game,
              hingga streaming premium. Semua akun bergaransi penuh, dikirim instan 5–15
              menit, dan diproses admin manusia asli 24/7.
            </motion.p>

            {/* Search form */}
            <motion.form
              variants={fadeUp}
              initial="hidden"
              animate="show"
              transition={{ duration: 0.7, ease: EASE, delay: 0.45 }}
              onSubmit={onSearchSubmit}
              role="search"
              className="glass mt-8 flex flex-col gap-2 rounded-2xl p-2 sm:flex-row sm:items-center"
            >
              <label htmlFor="hero-search" className="sr-only">
                Cari akun
              </label>
              <Input
                id="hero-search"
                ref={inputRef}
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Cari akun impianmu... contoh: IG 1K, Netflix, ML VIP"
                className="h-12 min-w-0 flex-1 border-0 bg-transparent px-4 text-base shadow-none focus-visible:ring-0 focus-visible:ring-offset-0"
              />
              <Button type="submit" className="h-12 rounded-xl px-6 text-base font-semibold">
                <Search className="h-5 w-5" aria-hidden="true" />
                Cari
              </Button>
            </motion.form>

            {/* Quick category chips */}
            <motion.div
              variants={fadeUp}
              initial="hidden"
              animate="show"
              transition={{ duration: 0.7, ease: EASE, delay: 0.55 }}
              className="mt-3 flex flex-wrap items-center gap-2"
            >
              <span className="text-xs text-muted-foreground">Populer:</span>
              {quickCategories.map((category) => (
                <button
                  key={category.id}
                  type="button"
                  onClick={() => onQuickCategory(category.id)}
                  className="glass inline-flex min-h-[44px] items-center rounded-full px-4 text-xs font-medium text-muted-foreground transition-colors hover:text-primary"
                >
                  {category.name}
                </button>
              ))}
            </motion.div>

            {/* CTA row */}
            <motion.div
              variants={fadeUp}
              initial="hidden"
              animate="show"
              transition={{ duration: 0.7, ease: EASE, delay: 0.65 }}
              className="mt-7 flex flex-col gap-3 sm:flex-row"
            >
              <Button
                size="lg"
                onClick={goToKatalog}
                className="h-12 rounded-xl px-7 text-base font-semibold transition-transform hover:scale-[1.03]"
              >
                Jelajahi Katalog
                <ArrowRight className="h-5 w-5" aria-hidden="true" />
              </Button>
              <Button
                size="lg"
                asChild
                variant="outline"
                className="glass h-12 rounded-xl px-7 text-base font-semibold"
              >
                <a
                  href={waLink(
                    'Halo Admin Raja Akun! Saya mau beli akun. Boleh info katalog terbaru?',
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <MessageCircle className="h-5 w-5 text-primary" aria-hidden="true" />
                  Chat Admin Sekarang
                </a>
              </Button>
            </motion.div>

            {/* Stats row */}
            <motion.dl
              variants={fadeUp}
              initial="hidden"
              animate="show"
              transition={{ duration: 0.7, ease: EASE, delay: 0.75 }}
              className="mt-10 grid grid-cols-2 gap-6 border-t border-border pt-8 sm:grid-cols-4"
            >
              <div>
                <dt className="sr-only">Jenis Akun</dt>
                <dd className="flex items-center gap-2">
                  <Package className="h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
                  <CountUp to={stats.totalProducts} suffix="+" className="text-2xl font-extrabold text-foreground" />
                </dd>
                <p className="mt-1 text-xs text-muted-foreground">Jenis Akun</p>
              </div>
              <div>
                <dt className="sr-only">Akun Terjual</dt>
                <dd className="flex items-center gap-2">
                  <ShoppingBag className="h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
                  <CountUp to={stats.totalSold} compact className="text-2xl font-extrabold text-foreground" />
                </dd>
                <p className="mt-1 text-xs text-muted-foreground">Akun Terjual</p>
              </div>
              <div>
                <dt className="sr-only">Kategori</dt>
                <dd className="flex items-center gap-2">
                  <LayoutGrid className="h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
                  <CountUp to={stats.totalCategories} suffix="+" className="text-2xl font-extrabold text-foreground" />
                </dd>
                <p className="mt-1 text-xs text-muted-foreground">Kategori</p>
              </div>
              <div>
                <dt className="sr-only">Rating Puas</dt>
                <dd className="flex items-center gap-2">
                  <Star className="h-4 w-4 shrink-0 fill-primary text-primary" aria-hidden="true" />
                  <CountUp to={stats.avgRating} decimals={1} className="text-2xl font-extrabold text-foreground" />
                </dd>
                <p className="mt-1 text-xs text-muted-foreground">Rating Puas</p>
              </div>
            </motion.dl>
          </div>

          {/* ============ RIGHT COLUMN — floating composition ============ */}
          <div className="relative hidden h-[540px] md:block lg:col-span-5">
            <motion.div style={{ y: cardY }} className="relative h-full w-full">
              {/* Backdrop rings */}
              <div
                aria-hidden="true"
                className="conic-ring absolute left-1/2 top-1/2 h-[26rem] w-[26rem] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-50 blur-md"
              />
              <div
                aria-hidden="true"
                className="glass absolute left-1/2 top-1/2 h-80 w-80 -translate-x-1/2 -translate-y-1/2 rounded-full"
              />

              {/* Floating product mini-cards */}
              {FLOAT_CARDS.map((card) => (
                <div
                  key={card.title}
                  aria-hidden="true"
                  className={`animate-float glass absolute w-64 rounded-2xl p-4 shadow-2xl ${card.position}`}
                  style={{ animationDelay: card.delay }}
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={`flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br ${card.gradient}`}
                    >
                      <card.icon className="h-5 w-5 text-white" />
                    </span>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-foreground">{card.title}</p>
                      <p className="text-sm font-bold text-primary">{card.price}</p>
                    </div>
                  </div>
                  <span
                    className={`mt-3 inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-semibold ${card.badgeClass}`}
                  >
                    {card.badge}
                  </span>
                </div>
              ))}

              {/* Floating chips */}
              <div
                aria-hidden="true"
                className="animate-float-slow glass absolute right-2 top-0 flex items-center gap-2 rounded-full px-4 py-2 text-xs font-semibold text-foreground shadow-xl"
              >
                <ShieldCheck className="h-4 w-4 text-primary" />
                Garansi 100%
              </div>
              <div
                aria-hidden="true"
                className="animate-float glass absolute bottom-24 right-6 flex items-center gap-2 rounded-full px-4 py-2 text-xs font-semibold text-foreground shadow-xl"
                style={{ animationDelay: '0.8s' }}
              >
                <Zap className="h-4 w-4 text-primary" />
                Instan 5-15 Menit
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div
        aria-hidden="true"
        className="absolute bottom-6 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 opacity-60 sm:flex"
      >
        <Mouse className="h-5 w-5 text-muted-foreground" />
        <span className="relative block h-8 w-px overflow-hidden bg-border">
          <motion.span
            className="absolute left-0 top-0 block h-3 w-px bg-primary"
            animate={{ y: [-12, 32] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
          />
        </span>
      </div>
    </section>
  )
}
