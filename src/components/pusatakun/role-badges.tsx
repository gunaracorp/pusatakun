import type { LucideIcon } from 'lucide-react'
import { Crown, ShoppingBag, Store } from 'lucide-react'

/**
 * PUSATAKUN — Badge peran pengguna (SOLID, kontras penuh).
 * Dipakai bersama oleh halaman /masuk, /daftar, /admin, dan menu akun.
 */
export type RoleBadgeDef = {
  label: string
  /** Kelas badge solid — latar penuh + teks kontras (tanpa alpha). */
  className: string
  Icon: LucideIcon
}

export const ROLE_BADGE_LABELS: Record<'BUYER' | 'SELLER' | 'ADMIN', RoleBadgeDef> = {
  BUYER: { label: 'Pembeli', className: 'bg-emerald-500 text-zinc-950', Icon: ShoppingBag },
  SELLER: { label: 'Penjual', className: 'bg-primary text-primary-foreground', Icon: Store },
  ADMIN: { label: 'Admin', className: 'bg-amber-400 text-zinc-950', Icon: Crown },
}
