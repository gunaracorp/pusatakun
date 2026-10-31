'use client'

/**
 * PUSATAKUN — Shell dashboard terpadu.
 * Sidebar (desktop) + tab horizontal (mobile) yang menyesuaikan peran:
 *  - Pembeli : /dashboard
 *  - Penjual : /dashboard/penjual
 *  - Pemilik : /dashboard/admin (khusus ADMIN)
 */

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  Crown,
  Home,
  LogOut,
  ShieldCheck,
  ShoppingBag,
  Store,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { SITE } from '@/lib/marketplace'
import { useCurrentYear } from '@/lib/use-current-year'
import { cn } from '@/lib/utils'
import { useAuthStore } from '@/store/auth-store'
import { ROLE_BADGE_LABELS } from './role-badges'

export type DashboardKey = 'pembeli' | 'penjual' | 'admin'

const NAV: {
  key: DashboardKey
  href: string
  label: string
  desc: string
  Icon: typeof ShoppingBag
  roles: Array<'BUYER' | 'SELLER' | 'ADMIN'>
}[] = [
  {
    key: 'pembeli',
    href: '/dashboard',
    label: 'Dashboard Pembeli',
    desc: 'Pesanan & profil',
    Icon: ShoppingBag,
    roles: ['BUYER', 'SELLER', 'ADMIN'],
  },
  {
    key: 'penjual',
    href: '/dashboard/penjual',
    label: 'Dashboard Penjual',
    desc: 'Toko & pendapatan',
    Icon: Store,
    roles: ['SELLER', 'ADMIN'],
  },
  {
    key: 'admin',
    href: '/dashboard/admin',
    label: 'Dashboard Pemilik',
    desc: 'Pusat komando situs',
    Icon: ShieldCheck,
    roles: ['ADMIN'],
  },
]

export function DashboardShell({
  active,
  children,
}: {
  active: DashboardKey
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const year = useCurrentYear()
  const { user, logout } = useAuthStore()
  if (!user) return null

  const badge = ROLE_BADGE_LABELS[user.role]
  const items = NAV.filter((n) => n.roles.includes(user.role))

  const navList = (
    <nav aria-label="Navigasi dashboard" className="flex flex-col gap-1.5">
      {items.map((item) => {
        const isActive = item.key === active
        return (
          <Link
            key={item.key}
            href={item.href}
            aria-current={isActive ? 'page' : undefined}
            className={cn(
              'flex min-h-[56px] items-center gap-3 rounded-2xl border px-4 py-3 transition-colors',
              isActive
                ? 'border-primary/60 bg-primary/10'
                : 'border-transparent hover:border-border hover:bg-card/60',
            )}
          >
            <span
              className={cn(
                'flex h-10 w-10 shrink-0 items-center justify-center rounded-xl',
                isActive ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground',
              )}
            >
              <item.Icon className="h-5 w-5" aria-hidden="true" />
            </span>
            <span className="min-w-0">
              <span
                className={cn(
                  'block truncate text-sm font-extrabold',
                  isActive ? 'text-primary' : 'text-foreground',
                )}
              >
                {item.label}
              </span>
              <span className="block truncate text-xs text-muted-foreground">{item.desc}</span>
            </span>
          </Link>
        )
      })}
    </nav>
  )

  const userCard = (
    <div className="rounded-2xl border border-border bg-card p-4">
      <div className="flex items-center gap-3">
        <span
          aria-hidden="true"
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-amber-400 to-yellow-600 text-xs font-extrabold text-zinc-950"
        >
          {(user.name ?? 'RA')
            .trim()
            .split(/\s+/)
            .slice(0, 2)
            .map((p) => p[0]?.toUpperCase() ?? '')
            .join('') || 'RA'}
        </span>
        <div className="min-w-0">
          <p className="truncate text-sm font-extrabold text-foreground">
            {user.name ?? 'Akun Pusatakun'}
          </p>
          <p className="truncate text-xs text-muted-foreground">+{user.phone}</p>
        </div>
      </div>
      <span
        className={cn(
          'mt-3 inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider',
          badge.className,
        )}
      >
        <badge.Icon className="h-3 w-3" aria-hidden="true" />
        {badge.label}
      </span>
      <Button
        variant="outline"
        size="sm"
        onClick={() => void logout()}
        className="mt-3 h-10 w-full rounded-full text-xs"
      >
        <LogOut className="mr-1.5 h-3.5 w-3.5" aria-hidden="true" />
        Keluar
      </Button>
    </div>
  )

  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* ===== Top bar mobile ===== */}
      <div className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur lg:hidden">
        <div className="flex h-14 items-center justify-between px-4">
          <Link href="/" aria-label="Pusatakun — kembali ke beranda" className="flex items-center gap-2.5">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
              <Crown className="h-4 w-4 text-primary-foreground" aria-hidden="true" />
            </span>
            <span className="text-base font-extrabold text-foreground">
              Pusata<span className="text-gradient-gold">kun</span>
            </span>
          </Link>
          <Button
            variant="outline"
            size="sm"
            onClick={() => void logout()}
            className="h-9 rounded-full text-xs"
          >
            <LogOut className="mr-1 h-3.5 w-3.5" aria-hidden="true" />
            Keluar
          </Button>
        </div>
        <div className="scrollbar-none flex gap-2 overflow-x-auto px-4 pb-3" role="tablist" aria-label="Pilih dashboard">
          {items.map((item) => {
            const isActive = item.key === active
            return (
              <Link
                key={item.key}
                href={item.href}
                role="tab"
                aria-selected={isActive}
                className={cn(
                  'inline-flex min-h-[38px] shrink-0 items-center gap-1.5 rounded-full border px-3.5 text-xs font-bold transition-colors',
                  isActive
                    ? 'border-primary bg-primary text-primary-foreground'
                    : 'border-border text-muted-foreground hover:text-foreground',
                )}
              >
                <item.Icon className="h-3.5 w-3.5" aria-hidden="true" />
                {item.label.replace('Dashboard ', '')}
              </Link>
            )
          })}
        </div>
      </div>

      {/* ===== Layout utama ===== */}
      <div className="mx-auto w-full max-w-7xl flex-1 px-4 py-6 sm:px-6 lg:grid lg:grid-cols-[264px_1fr] lg:gap-8 lg:px-8 lg:py-10">
        {/* Sidebar desktop */}
        <aside className="hidden lg:block">
          <div className="sticky top-8 space-y-5">
            <Link
              href="/"
              aria-label="Pusatakun — kembali ke beranda"
              className="flex min-h-[44px] items-center gap-3"
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary shadow-lg shadow-primary/25">
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

            {navList}
            {userCard}

            <Link
              href="/"
              className="flex min-h-[44px] items-center gap-2 rounded-2xl border border-border px-4 text-sm font-semibold text-muted-foreground transition-colors hover:border-primary/50 hover:text-primary"
            >
              <Home className="h-4 w-4" aria-hidden="true" />
              Kembali ke Beranda
            </Link>
          </div>
        </aside>

        {/* Konten */}
        <main className="min-w-0">{children}</main>
      </div>

      {/* Footer ringkas */}
      <footer className="mt-auto border-t border-border bg-card/30">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-4 py-5 text-xs text-muted-foreground sm:flex-row sm:px-6 lg:px-8">
          <p>
            © {year} Pusatakun — {SITE.domain}
          </p>
          <p className="font-semibold text-primary/80">Area akun terlindungi · Support 24/7</p>
        </div>
      </footer>
    </div>
  )
}
