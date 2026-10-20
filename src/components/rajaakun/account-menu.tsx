'use client'

import Link from 'next/link'
import {
  LayoutDashboard,
  LogOut,
  ShieldCheck,
  ShoppingBag,
  Store,
  UserRound,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { initialsOf } from '@/lib/marketplace'
import { ROLE_BADGE_LABELS } from '@/components/rajaakun/role-badges'
import { useAuthStore } from '@/store/auth-store'

export function AccountMenu() {
  const { user, openDashboard, logout } = useAuthStore()
  if (!user) return null

  const badge = ROLE_BADGE_LABELS[user.role]
  const initials = initialsOf(user.name)

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          aria-label="Menu akun saya"
          className="glass h-11 gap-2 rounded-full pl-1.5 pr-3"
        >
          <span
            aria-hidden="true"
            className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-amber-400 to-yellow-600 text-xs font-extrabold text-zinc-950"
          >
            {initials}
          </span>
          <span className="hidden max-w-[110px] truncate text-sm font-semibold sm:inline">
            {user.name ?? 'Akun Saya'}
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="glass w-64 border-border">
        <DropdownMenuLabel>
          <p className="truncate text-sm font-extrabold">{user.name ?? 'Akun Raja Akun'}</p>
          <p className="mt-0.5 truncate text-xs font-normal text-muted-foreground">
            WhatsApp +{user.phone}
          </p>
          <span
            className={`mt-1.5 inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${badge.className}`}
          >
            <badge.Icon className="h-3 w-3" aria-hidden="true" />
            {badge.label}
          </span>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => openDashboard('buyer')} className="cursor-pointer gap-2">
          <ShoppingBag className="h-4 w-4 text-primary" aria-hidden="true" />
          Pesanan Saya
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => openDashboard('seller')} className="cursor-pointer gap-2">
          <Store className="h-4 w-4 text-primary" aria-hidden="true" />
          Dashboard Penjual
        </DropdownMenuItem>
        {user.role === 'ADMIN' && (
          <DropdownMenuItem asChild className="cursor-pointer">
            <Link href="/admin" className="gap-2">
              <ShieldCheck className="h-4 w-4 text-amber-400" aria-hidden="true" />
              Panel Admin (Halaman Penuh)
            </Link>
          </DropdownMenuItem>
        )}
        <DropdownMenuItem onClick={() => openDashboard('seller')} className="cursor-pointer gap-2">
          <LayoutDashboard className="h-4 w-4 text-primary" aria-hidden="true" />
          Toko Saya
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => void logout()} className="cursor-pointer gap-2 text-destructive focus:text-destructive">
          <LogOut className="h-4 w-4" aria-hidden="true" />
          Keluar
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

/** Tombol Masuk (belum login) — halaman tunggal /masuk. Dipakai navbar desktop & mobile. */
export function LoginButton({ href = '/masuk', className }: { href?: string; className?: string }) {
  return (
    <Button
      variant="outline"
      asChild
      aria-label="Masuk atau daftar dengan WhatsApp"
      className={
        className ??
        'h-11 gap-2 rounded-full border-primary/50 px-4 font-semibold transition-transform hover:scale-105 hover:bg-primary/10'
      }
    >
      <Link href={href}>
        <UserRound className="h-4 w-4" aria-hidden="true" />
        <span>Masuk</span>
      </Link>
    </Button>
  )
}

/** Kartu akun untuk sheet menu mobile. */
export function MobileAccountCard() {
  const { user, openDashboard, logout } = useAuthStore()
  if (!user) {
    return (
      <Link
        href="/masuk"
        className="flex w-full items-center gap-3 rounded-2xl border-2 border-primary bg-primary/10 p-4 text-left transition-colors hover:bg-primary/20"
      >
        <span className="flex h-11 w-11 items-center justify-center rounded-full bg-primary">
          <UserRound className="h-5 w-5 text-primary-foreground" aria-hidden="true" />
        </span>
        <span>
          <span className="block text-sm font-extrabold text-foreground">Masuk / Daftar</span>
          <span className="block text-xs text-muted-foreground">Satu klik via WhatsApp — gratis</span>
        </span>
      </Link>
    )
  }

  const badge = ROLE_BADGE_LABELS[user.role]
  return (
    <div className="space-y-2 rounded-2xl border border-border bg-card/40 p-4">
      <div className="flex items-center gap-3">
        <span
          aria-hidden="true"
          className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-amber-400 to-yellow-600 text-sm font-extrabold text-zinc-950"
        >
          {initialsOf(user.name)}
        </span>
        <div className="min-w-0">
          <p className="truncate text-sm font-extrabold">{user.name ?? 'Akun Raja Akun'}</p>
          <p className="truncate text-xs text-muted-foreground">+{user.phone}</p>
          <span
            className={`mt-1 inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${badge.className}`}
          >
            <badge.Icon className="h-3 w-3" aria-hidden="true" />
            {badge.label}
          </span>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-2 pt-1">
        <Button
          variant="outline"
          size="sm"
          className="h-10 text-xs"
          onClick={() => openDashboard('buyer')}
        >
          <ShoppingBag className="mr-1 h-3.5 w-3.5" aria-hidden="true" />
          Pesanan
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="h-10 text-xs"
          onClick={() => openDashboard('seller')}
        >
          <Store className="mr-1 h-3.5 w-3.5" aria-hidden="true" />
          Toko
        </Button>
        <Button variant="outline" size="sm" className="h-10 text-xs" onClick={() => void logout()}>
          <LogOut className="mr-1 h-3.5 w-3.5" aria-hidden="true" />
          Keluar
        </Button>
      </div>
    </div>
  )
}
