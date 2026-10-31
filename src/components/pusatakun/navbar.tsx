'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useScroll,
  useSpring,
} from 'framer-motion'
import { ArrowRight, Crown, Menu, MessageCircle, Store } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { SITE, waLink } from '@/lib/marketplace'
import { cn } from '@/lib/utils'
import { useAuthStore } from '@/store/auth-store'
import { AccountMenu, LoginButton, MobileAccountCard } from './account-menu'
import { EASE } from './motion-primitives'

const NAV_LINKS = [
  { label: 'Katalog', href: '/katalog' },
  { label: 'Kategori', href: '/#kategori' },
  { label: 'Cara Kerja', href: '/#cara-kerja' },
  { label: 'Testimoni', href: '/#testimoni' },
  { label: 'Bantuan', href: '/pusat-bantuan' },
]

const PROMO_ITEMS = [
  'Promo Gajian — Diskon s/d 40% Semua Akun',
  'Garansi 100% Uang Kembali',
  'Pengiriman Instan 5-15 Menit',
  'Support 24/7 Nonstop',
]

function PromoRow({ hidden = false }: { hidden?: boolean }) {
  return (
    <div aria-hidden={hidden || undefined} className="flex shrink-0 items-center">
      {/* duplicated internally so one half is wide enough for ultrawide screens */}
      {PROMO_ITEMS.concat(PROMO_ITEMS).map((item, index) => (
        <span
          key={`${item}-${index}`}
          className="mx-7 inline-flex items-center gap-2 whitespace-nowrap text-[11px] font-semibold tracking-wide"
        >
          <span aria-hidden="true" className="h-1 w-1 rotate-45 bg-primary-foreground/70" />
          {item}
        </span>
      ))}
    </div>
  )
}

function BrandMark() {
  return (
    <Link
      href="/"
      aria-label="Pusatakun — kembali ke beranda"
      className="group flex min-h-[44px] items-center gap-3"
    >
      <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary shadow-lg shadow-primary/25 transition-transform duration-300 group-hover:rotate-3 group-hover:scale-105">
        <Crown className="h-5 w-5 text-primary-foreground" aria-hidden="true" />
      </span>
      <span className="flex flex-col leading-none">
        <span className="text-lg font-extrabold tracking-tight text-foreground">
          Pusata<span className="text-gradient-gold">kun</span>
        </span>
        <span className="mt-1 text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
          {SITE.domain}
        </span>
      </span>
    </Link>
  )
}

export function Navbar() {
  const router = useRouter()
  const { scrollY, scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 140,
    damping: 30,
    restDelta: 0.001,
  })
  const [scrolled, setScrolled] = useState(false)
  const [promoVisible, setPromoVisible] = useState(true)
  const { user } = useAuthStore()

  useMotionValueEvent(scrollY, 'change', (latest) => {
    setScrolled(latest > 24)
    setPromoVisible(latest <= 40)
  })

  function goToSeller() {
    // Sudah login -> dashboard penjual; belum -> halaman tunggal daftar (peran penjual)
    if (user) router.push('/dashboard/penjual')
    else router.push('/daftar?peran=penjual')
  }

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      {/* Reading progress bar */}
      <motion.div
        aria-hidden="true"
        style={{ scaleX }}
        className="absolute inset-x-0 top-0 z-10 h-[3px] origin-left bg-gradient-to-r from-amber-400 via-yellow-200 to-amber-400"
      />

      {/* Promo strip */}
      <AnimatePresence initial={false}>
        {promoVisible && (
          <motion.div
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: EASE }}
            className="overflow-hidden bg-primary text-primary-foreground"
          >
            <div className="mask-fade-x overflow-hidden py-1.5">
              <div
                className="marquee-track"
                style={{ '--marquee-duration': '26s' } as React.CSSProperties}
              >
                <PromoRow />
                <PromoRow hidden />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main bar */}
      <div
        className={cn(
          'transition-all duration-300',
          scrolled ? 'glass border-b border-border' : 'border-b border-transparent',
        )}
      >
        <nav
          aria-label="Navigasi utama"
          className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8"
        >
          <BrandMark />

          {/* Desktop links */}
          <ul className="hidden items-center gap-1 lg:flex">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="group relative flex min-h-[44px] items-center px-3 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
                >
                  {link.label}
                  <span
                    aria-hidden="true"
                    className="absolute inset-x-3 bottom-2.5 h-0.5 origin-left scale-x-0 rounded-full bg-primary transition-transform duration-300 ease-out group-hover:scale-x-100"
                  />
                </Link>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              onClick={goToSeller}
              aria-label="Jual akun — daftar jadi penjual"
              className="hidden h-11 rounded-full px-4 font-semibold text-primary hover:bg-primary/10 md:inline-flex"
            >
              <Store className="h-4 w-4" aria-hidden="true" />
              Jual Akun
            </Button>

            {user ? (
              <AccountMenu />
            ) : (
              <LoginButton className="h-11 gap-2 rounded-full border-primary/50 px-4 font-semibold transition-transform hover:scale-105 hover:bg-primary/10 sm:px-5" />
            )}

            <Button
              asChild
              className="h-11 rounded-full px-4 font-semibold transition-transform hover:scale-105 sm:px-5"
            >
              <a
                href={waLink('Halo Admin Pusatakun, saya mau tanya-tanya dulu.')}
                target="_blank"
                rel="noopener noreferrer"
              >
                <MessageCircle className="h-4 w-4" aria-hidden="true" />
                <span className="hidden sm:inline">Chat Admin</span>
                <span className="sm:hidden">Chat</span>
              </a>
            </Button>

            {/* Mobile menu */}
            <Sheet>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  aria-label="Buka menu navigasi"
                  className="glass h-11 w-11 rounded-full lg:hidden"
                >
                  <Menu className="h-5 w-5" aria-hidden="true" />
                </Button>
              </SheetTrigger>
              <SheetContent
                side="right"
                className="glass w-[320px] overflow-y-auto border-l border-border sm:max-w-[320px]"
              >
                <SheetHeader>
                  <SheetTitle className="flex items-center gap-2 text-lg font-extrabold">
                    <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary">
                      <Crown className="h-4 w-4 text-primary-foreground" aria-hidden="true" />
                    </span>
                    Pusata<span className="text-gradient-gold">kun</span>
                  </SheetTitle>
                  <SheetDescription className="sr-only">
                    Daftar tautan navigasi Pusatakun
                  </SheetDescription>
                </SheetHeader>

                <div className="px-4">
                  <MobileAccountCard />
                </div>

                <nav aria-label="Navigasi mobile" className="mt-4 flex flex-col gap-1 px-4">
                  <SheetClose asChild>
                    <button
                      type="button"
                      onClick={goToSeller}
                      className="flex min-h-[48px] items-center justify-between rounded-xl px-4 text-base font-bold text-primary"
                    >
                      <span className="inline-flex items-center gap-2">
                        <Store className="h-4 w-4" aria-hidden="true" />
                        Jual Akun
                      </span>
                      <ArrowRight className="h-4 w-4 text-primary/60" aria-hidden="true" />
                    </button>
                  </SheetClose>
                  {NAV_LINKS.map((link) => (
                    <SheetClose asChild key={link.href}>
                      <Link
                        href={link.href}
                        className="flex min-h-[48px] items-center justify-between rounded-xl px-4 text-base font-medium text-foreground/90 transition-colors hover:bg-primary/10 hover:text-primary"
                      >
                        {link.label}
                        <ArrowRight className="h-4 w-4 text-primary/60" aria-hidden="true" />
                      </Link>
                    </SheetClose>
                  ))}
                </nav>

                <div className="mt-auto space-y-3 border-t border-border p-4">
                  <SheetClose asChild>
                    <Button asChild className="h-12 w-full rounded-full font-semibold">
                      <a
                        href={waLink('Halo Admin Pusatakun, saya mau tanya-tanya dulu.')}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <MessageCircle className="h-5 w-5" aria-hidden="true" />
                        Chat Admin Sekarang
                      </a>
                    </Button>
                  </SheetClose>
                  <p className="text-center text-xs text-muted-foreground">
                    WhatsApp {SITE.whatsappDisplay} — online 24/7
                  </p>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </nav>
      </div>
    </header>
  )
}
