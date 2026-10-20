'use client'

/**
 * RAJA AKUN — Auth Shell (Halaman Tunggal Login / Daftar / Admin)
 * ================================================================
 * Prinsip desain (permintaan pemilik):
 *  - SEMUA permukaan konten SOLID — tanpa glass/backdrop transparan.
 *  - Kontras maksimal: panel emas solid + teks hampir-hitam, panel gelap
 *    solid + teks hampir-putih. Tidak ada warna bertumpuk yang mengaburkan.
 *  - Target sentuh >= 44px, label tegas, error dalam kotak merah solid.
 */

import { useState, type ReactNode } from 'react'
import Link from 'next/link'
import {
  BadgeCheck,
  Check,
  Copy,
  Crown,
  MessageCircle,
  ShoppingBag,
  Store,
  type LucideIcon,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { SITE, waLink } from '@/lib/marketplace'
import { cn } from '@/lib/utils'

// ============ Helper waktu ============

/** Detik -> "m:ss" (format manual, aman hydration). */
export function formatCountdown(totalSec: number): string {
  const s = Math.max(0, totalSec)
  const m = Math.floor(s / 60)
  const r = s % 60
  return `${m}:${String(r).padStart(2, '0')}`
}

// ============ Bar atas halaman auth ============

export function AuthTopBar({ href, hint }: { href: string; hint: string }) {
  return (
    <header className="relative z-10 border-b border-border bg-background">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link
          href="/"
          aria-label="Raja Akun — kembali ke beranda"
          className="group flex min-h-[44px] items-center gap-3"
        >
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary shadow-lg shadow-primary/30 transition-transform duration-300 group-hover:rotate-3 group-hover:scale-105">
            <Crown className="h-5 w-5 text-primary-foreground" aria-hidden="true" />
          </span>
          <span className="flex flex-col leading-none">
            <span className="text-lg font-extrabold tracking-tight text-foreground">
              Raja<span className="text-gradient-gold">Akun</span>
            </span>
            <span className="mt-1 text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
              {SITE.domain}
            </span>
          </span>
        </Link>
        <Link
          href={href}
          className="inline-flex min-h-[44px] items-center rounded-full border-2 border-primary px-4 text-sm font-bold text-primary transition-colors hover:bg-primary hover:text-primary-foreground sm:px-5"
        >
          {hint}
        </Link>
      </div>
    </header>
  )
}

// ============ Panel merek emas SOLID ============

export type BrandPoint = { title: string; desc: string }

export function AuthBrandPanel({
  kicker,
  title,
  subtitle,
  points,
  note,
}: {
  kicker: string
  title: ReactNode
  subtitle: string
  points: BrandPoint[]
  note: string
}) {
  return (
    <aside className="relative flex flex-col justify-between overflow-hidden bg-gradient-to-br from-amber-400 via-yellow-500 to-amber-600 p-7 text-zinc-950 sm:p-9 lg:p-10">
      {/* Hiasan mahkota — dekoratif murni, tidak menyentuh teks */}
      <Crown
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-12 -right-12 h-52 w-52 text-zinc-950/10"
      />
      <Crown
        aria-hidden="true"
        className="pointer-events-none absolute -left-10 -top-10 h-32 w-32 rotate-12 text-zinc-950/10"
      />

      <div className="relative">
        <p className="text-[11px] font-black uppercase tracking-[0.28em] text-zinc-900">
          {kicker}
        </p>
        <h2 className="mt-3 text-3xl font-black leading-[1.15] tracking-tight lg:text-4xl">
          {title}
        </h2>
        <p className="mt-3 max-w-md text-sm font-semibold leading-relaxed text-zinc-900">
          {subtitle}
        </p>

        <ul className="mt-8 space-y-4">
          {points.map((point) => (
            <li key={point.title} className="flex items-start gap-3">
              <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-zinc-950 shadow-md">
                <Check className="h-4 w-4 text-amber-400" aria-hidden="true" />
              </span>
              <span>
                <span className="block text-sm font-black leading-snug">{point.title}</span>
                <span className="block text-xs font-semibold leading-relaxed text-zinc-900">
                  {point.desc}
                </span>
              </span>
            </li>
          ))}
        </ul>
      </div>

      <div className="relative mt-10 flex items-center gap-3 rounded-2xl bg-zinc-950 p-4 shadow-xl">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-amber-400">
          <MessageCircle className="h-5 w-5 text-zinc-950" aria-hidden="true" />
        </span>
        <div className="min-w-0">
          <p className="text-xs font-bold uppercase tracking-wider text-amber-400">
            Support WhatsApp 24/7
          </p>
          <p className="truncate text-sm font-extrabold text-zinc-50">{note}</p>
        </div>
      </div>
    </aside>
  )
}

// ============ Judul langkah ============

export function StepTitle({
  icon: Icon,
  title,
  subtitle,
}: {
  icon: LucideIcon
  title: string
  subtitle?: ReactNode
}) {
  return (
    <div className="flex items-start gap-3">
      <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary shadow-lg shadow-primary/30">
        <Icon className="h-6 w-6 text-primary-foreground" aria-hidden="true" />
      </span>
      <div className="min-w-0">
        <h1 className="text-xl font-extrabold leading-tight text-foreground lg:text-2xl">
          {title}
        </h1>
        {subtitle && (
          <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{subtitle}</p>
        )}
      </div>
    </div>
  )
}

/** Titik progres langkah — solid, kontras jelas antara aktif & belum. */
export function StepDots({ step, total }: { step: number; total: number }) {
  return (
    <div
      className="flex items-center gap-2"
      role="status"
      aria-label={`Langkah ${step} dari ${total}`}
    >
      {Array.from({ length: total }, (_, i) => (
        <span
          key={i}
          aria-hidden="true"
          className={cn(
            'h-2 rounded-full transition-all duration-300',
            i < step ? 'w-7 bg-primary' : 'w-2 bg-muted-foreground/40',
          )}
        />
      ))}
      <span className="ml-1 text-xs font-bold text-muted-foreground">
        {step}/{total}
      </span>
    </div>
  )
}

// ============ Field nomor telepon SOLID ============

export function PhoneField({
  id,
  value,
  onChange,
  disabled,
  autoFocus,
}: {
  id: string
  value: string
  onChange: (v: string) => void
  disabled?: boolean
  autoFocus?: boolean
}) {
  return (
    <div className="space-y-2">
      <label htmlFor={id} className="block text-sm font-bold text-foreground">
        Nomor WhatsApp aktif
      </label>
      <div className="flex items-stretch gap-2">
        <span className="flex h-13 shrink-0 items-center rounded-xl border-2 border-input bg-muted px-4 text-base font-black text-foreground">
          +62
        </span>
        <input
          id={id}
          name={id}
          type="tel"
          inputMode="tel"
          autoComplete="tel-national"
          autoFocus={autoFocus}
          value={value}
          onChange={(e) => onChange(e.target.value.replace(/[^\d+\s-]/g, ''))}
          placeholder="813-1651-6524"
          disabled={disabled}
          aria-describedby={`${id}-hint`}
          className="h-13 w-full min-w-0 rounded-xl border-2 border-input bg-muted px-4 text-lg font-bold tracking-wide text-foreground shadow-inner outline-none transition-colors placeholder:font-medium placeholder:text-muted-foreground focus:border-primary disabled:opacity-60"
        />
      </div>
      <p id={`${id}-hint`} className="text-xs font-medium text-muted-foreground">
        Format bebas: 08xx, 8xx, atau 62 8xx. Pastikan WhatsApp aktif untuk menerima kode.
      </p>
    </div>
  )
}

// ============ Kotak kode demo — SOLID EMAS ============

export function DevCodeBox({ code, phoneDisplay }: { code: string; phoneDisplay: string }) {
  const [copied, setCopied] = useState(false)

  function copy() {
    navigator.clipboard?.writeText(code).catch(() => {})
    setCopied(true)
    window.setTimeout(() => setCopied(false), 1500)
  }

  return (
    <div
      className="rounded-2xl border-2 border-yellow-700/60 bg-primary p-4 shadow-xl shadow-primary/20"
      data-testid="dev-code"
    >
      <p className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.14em] text-zinc-950">
        <BadgeCheck className="h-4 w-4" aria-hidden="true" />
        Mode Demo — Kode Verifikasi Kamu
      </p>
      <div className="mt-2.5 flex items-center justify-between gap-3">
        <span
          className="font-mono text-3xl font-black tracking-[0.3em] text-zinc-950"
          aria-label={`Kode verifikasi ${code.split('').join(' ')}`}
        >
          {code}
        </span>
        <Button
          type="button"
          size="sm"
          onClick={copy}
          className="h-10 shrink-0 gap-1.5 rounded-full bg-zinc-950 font-bold text-amber-300 hover:bg-zinc-800 hover:text-amber-200"
          aria-label="Salin kode verifikasi"
        >
          {copied ? (
            <Check className="h-4 w-4" aria-hidden="true" />
          ) : (
            <Copy className="h-4 w-4" aria-hidden="true" />
          )}
          {copied ? 'Tersalin' : 'Salin'}
        </Button>
      </div>
      <p className="mt-2.5 text-xs font-semibold leading-relaxed text-zinc-900">
        Pada mode produksi, kode dikirim otomatis ke WhatsApp {phoneDisplay} via WhatsApp
        Business API. Belum menerima kode?{' '}
        <a
          href={waLink(
            `Halo Admin Raja Akun, saya butuh bantuan login untuk nomor ${phoneDisplay}.`,
          )}
          target="_blank"
          rel="noopener noreferrer"
          className="font-black text-zinc-950 underline decoration-2 underline-offset-2"
        >
          Hubungi Admin
        </a>
      </p>
    </div>
  )
}

// ============ OTP slots — SOLID ============

export function OtpSlots({
  value,
  onChange,
  disabled,
}: {
  value: string
  onChange: (v: string) => void
  disabled?: boolean
}) {
  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative">
        {/* Input nyata menutupi seluruh area slot — klik/ketuk di mana pun langsung fokus & menaikkan papan angka */}
        <input
          inputMode="numeric"
          autoComplete="one-time-code"
          aria-label="Kode verifikasi 6 digit"
          maxLength={6}
          value={value}
          disabled={disabled}
          onChange={(e) => onChange(e.target.value.replace(/\D/g, '').slice(0, 6))}
          className="absolute inset-0 z-10 h-full w-full cursor-pointer opacity-0 disabled:cursor-not-allowed"
        />
        <div className="flex gap-2.5">
          {Array.from({ length: 6 }, (_, i) => {
            const char = value[i] ?? ''
            const active = value.length === i
            return (
              <span
                key={i}
                aria-hidden="true"
                className={cn(
                  'flex h-14 w-11 items-center justify-center rounded-xl border-2 bg-muted text-2xl font-black text-foreground shadow-inner transition-all duration-200 sm:h-16 sm:w-12',
                  active ? 'border-primary ring-4 ring-primary/25' : 'border-input',
                )}
              >
                {char}
              </span>
            )
          })}
        </div>
      </div>
      <p className="text-xs font-medium text-muted-foreground">
        Ketik 6 digit kode yang dikirim ke WhatsApp kamu
      </p>
    </div>
  )
}

// ============ Kotak error — SOLID MERAH ============

export function ErrorBox({ message }: { message: string }) {
  return (
    <p
      role="alert"
      className="rounded-xl bg-destructive px-4 py-3 text-sm font-bold leading-snug text-white shadow-lg"
    >
      {message}
    </p>
  )
}

// ============ Kartu peran (Pembeli / Penjual) — SOLID ============

export const ROLE_CARDS = [
  {
    role: 'BUYER' as const,
    title: 'Pembeli',
    icon: ShoppingBag,
    desc: 'Beli akun bergaransi dengan bantuan admin 24/7.',
    points: [
      'Checkout dibantu admin 24/7',
      'Riwayat pesanan & garansi penuh',
      'Akses katalog & flash promo',
    ],
  },
  {
    role: 'SELLER' as const,
    title: 'Penjual',
    icon: Store,
    desc: 'Buka toko gratis, akunmu tayang di depan ribuan pembeli.',
    points: [
      'Buka toko gratis, tanpa biaya daftar',
      'Listing dikurasi admin 24 jam',
      'Komisi transparan & pencairan cepat',
    ],
  },
] as const

export function RoleCards({
  value,
  onChange,
  name = 'peran',
}: {
  value: 'BUYER' | 'SELLER'
  onChange: (role: 'BUYER' | 'SELLER') => void
  name?: string
}) {
  return (
    <div className="grid gap-3 sm:grid-cols-2" role="radiogroup" aria-label="Pilih peran akun">
      {ROLE_CARDS.map((card) => {
        const selected = value === card.role
        return (
          <button
            key={card.role}
            type="button"
            role="radio"
            aria-checked={selected}
            name={name}
            onClick={() => onChange(card.role)}
            className={cn(
              'rounded-2xl border-2 p-4 text-left transition-all duration-300',
              selected
                ? 'border-primary bg-accent shadow-lg shadow-primary/20'
                : 'border-border bg-muted hover:border-primary/60',
            )}
          >
            <span className="flex items-center justify-between">
              <span
                className={cn(
                  'flex h-10 w-10 items-center justify-center rounded-xl',
                  selected ? 'bg-primary' : 'bg-background',
                )}
              >
                <card.icon
                  className={cn(
                    'h-5 w-5',
                    selected ? 'text-primary-foreground' : 'text-muted-foreground',
                  )}
                  aria-hidden="true"
                />
              </span>
              <span
                className={cn(
                  'flex h-5 w-5 items-center justify-center rounded-full border-2',
                  selected ? 'border-primary bg-primary' : 'border-muted-foreground/50',
                )}
                aria-hidden="true"
              >
                {selected && <Check className="h-3 w-3 text-primary-foreground" />}
              </span>
            </span>
            <span className="mt-3 block text-base font-extrabold text-foreground">
              Jadi {card.title}
            </span>
            <span className="mt-0.5 block text-xs font-medium leading-relaxed text-muted-foreground">
              {card.desc}
            </span>
            <span className="mt-3 block space-y-1.5">
              {card.points.map((point) => (
                <span
                  key={point}
                  className="flex items-start gap-1.5 text-xs font-medium text-muted-foreground"
                >
                  <Check
                    className="mt-0.5 h-3 w-3 shrink-0 text-primary"
                    aria-hidden="true"
                  />
                  {point}
                </span>
              ))}
            </span>
          </button>
        )
      })}
    </div>
  )
}
