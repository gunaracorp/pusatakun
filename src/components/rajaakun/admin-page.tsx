'use client'

/**
 * RAJA AKUN — Halaman Panel Admin (/admin)
 * =========================================
 * Halaman tunggal SOLID (tanpa Sheet transparan):
 *  1) Gerbang login WhatsApp khusus administrator.
 *  2) Nomor pemilik (+62 813-1651-6524) otomatis berperan ADMIN.
 *  3) Dashboard kurasi tampil INLINE di halaman ini — kartu solid kontras penuh.
 * Tidak diindeks mesin pencari (robots noindex via metadata halaman).
 */

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import Link from 'next/link'
import {
  Check,
  Crown,
  Home,
  Loader2,
  LogOut,
  MessageCircle,
  RefreshCw,
  ShieldAlert,
  ShieldCheck,
  Smartphone,
  Tag,
  X,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useToast } from '@/hooks/use-toast'
import {
  AuthTopBar,
  DevCodeBox,
  ErrorBox,
  OtpSlots,
  PhoneField,
  StepDots,
  StepTitle,
  formatCountdown,
} from '@/components/rajaakun/auth-shell'
import { ROLE_BADGE_LABELS } from '@/components/rajaakun/role-badges'
import {
  formatIDR,
  listingWaLink,
  LISTING_STATUS_LABEL,
  SITE,
  type ListingStatus,
  type SellerListingDTO,
} from '@/lib/marketplace'
import { useCurrentYear } from '@/lib/use-current-year'
import { cn } from '@/lib/utils'
import { useAuthStore } from '@/store/auth-store'

type RequestOtpResponse = {
  ok: boolean
  phoneDisplay?: string
  devCode?: string
  expiresInSec?: number
  resendInSec?: number
  error?: string
}

type VerifyResponse = {
  ok: boolean
  user?: { id: string; phone: string; name: string | null; role: 'BUYER' | 'SELLER' | 'ADMIN'; createdAt: string }
  isNew?: boolean
  error?: string
}

const FILTERS: { value: ListingStatus | ''; label: string }[] = [
  { value: 'PENDING', label: 'Perlu Kurasi' },
  { value: 'APPROVED', label: 'Tayang' },
  { value: 'REJECTED', label: 'Ditolak' },
  { value: 'SOLD', label: 'Terjual' },
  { value: '', label: 'Semua' },
]

/** Badge status SOLID — tanpa alpha, terbaca tegas. */
const STATUS_BADGE: Record<ListingStatus, string> = {
  PENDING: 'bg-amber-400 text-zinc-950',
  APPROVED: 'bg-emerald-500 text-zinc-950',
  REJECTED: 'bg-red-500 text-white',
  SOLD: 'bg-zinc-400 text-zinc-950',
}

export function AdminPage() {
  const { user, status, setUser, fetchMe, logout } = useAuthStore()

  // ===== Gerbang login =====
  const [step, setStep] = useState<'phone' | 'otp'>('phone')
  const [phone, setPhone] = useState('')
  const [phoneDisplay, setPhoneDisplay] = useState('')
  const [code, setCode] = useState('')
  const [devCode, setDevCode] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [expiryAt, setExpiryAt] = useState<number | null>(null)
  const [resendAt, setResendAt] = useState<number | null>(null)
  const [now, setNow] = useState(() => Date.now())
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    void fetchMe()
  }, [fetchMe])

  useEffect(() => {
    if (step !== 'otp') return
    timerRef.current = setInterval(() => setNow(Date.now()), 1000)
    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [step])

  const expiryLeft = useMemo(
    () => (expiryAt ? formatCountdown(Math.ceil((expiryAt - now) / 1000)) : null),
    [expiryAt, now],
  )
  const resendLeft = useMemo(
    () => (resendAt ? Math.ceil((resendAt - now) / 1000) : 0),
    [resendAt, now],
  )

  const digits = phone.replace(/\D+/g, '')
  const phoneValid = /^(0?8\d{7,11}|628\d{8,11})$/.test(digits)

  async function handleRequestOtp() {
    setError(null)
    setSubmitting(true)
    try {
      const res = await fetch('/api/auth/request-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone }),
      })
      const data = (await res.json()) as RequestOtpResponse
      if (!res.ok || !data.ok) {
        setError(data.error ?? 'Gagal mengirim kode. Coba lagi ya.')
        return
      }
      setPhoneDisplay(data.phoneDisplay ?? phone)
      setDevCode(data.devCode ?? null)
      setExpiryAt(Date.now() + (data.expiresInSec ?? 300) * 1000)
      setResendAt(Date.now() + (data.resendInSec ?? 60) * 1000)
      setCode('')
      setStep('otp')
    } catch {
      setError('Koneksi bermasalah. Periksa internet kamu ya.')
    } finally {
      setSubmitting(false)
    }
  }

  async function handleVerify() {
    setError(null)
    if (code.length !== 6) {
      setError('Masukkan 6 digit kode verifikasi.')
      return
    }
    setSubmitting(true)
    try {
      const res = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, code }),
      })
      const data = (await res.json()) as VerifyResponse
      if (!res.ok || !data.ok || !data.user) {
        setError(data.error ?? 'Kode salah atau kedaluwarsa.')
        return
      }
      setUser(data.user)
      // Dashboard / kartu akses-ditolak muncul otomatis sesuai role.
    } catch {
      setError('Koneksi bermasalah. Coba lagi ya.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      {/* Strip identitas admin — solid emas */}
      <div aria-hidden="true" className="h-1.5 w-full bg-primary" />

      <AuthTopBar href="/" hint="Ke Beranda" />

      <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-royal-glow" />

      <main className="relative z-10 flex flex-1 justify-center px-4 py-10 sm:px-6 sm:py-14">
        {/* ===== Belum tahu sesi: loader ===== */}
        {status !== 'ready' && (
          <div className="flex flex-col items-center justify-center gap-3 self-center">
            <Loader2 className="h-9 w-9 animate-spin text-primary" aria-hidden="true" />
            <p className="text-sm font-semibold text-muted-foreground">Memeriksa sesi admin…</p>
          </div>
        )}

        {/* ===== Sudah login tapi bukan admin ===== */}
        {status === 'ready' && user && user.role !== 'ADMIN' && (
          <NoAccessCard
            phone={user.phone}
            onLogout={() => {
              void logout()
              setStep('phone')
              setPhone('')
              setCode('')
              setDevCode(null)
              setError(null)
            }}
          />
        )}

        {/* ===== Admin: dashboard inline ===== */}
        {status === 'ready' && user && user.role === 'ADMIN' && (
          <AdminDashboard />
        )}

        {/* ===== Belum login: gerbang OTP ===== */}
        {status === 'ready' && !user && (
          <div className="w-full max-w-md self-start">
            <div className="overflow-hidden rounded-3xl border-2 border-primary/40 bg-card shadow-2xl shadow-black/60">
              {/* Kepala kartu — solid emas */}
              <div className="flex items-center gap-4 bg-primary p-6 text-primary-foreground">
                <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-zinc-950 shadow-lg">
                  <ShieldCheck className="h-7 w-7 text-amber-400" aria-hidden="true" />
                </span>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.28em] text-zinc-900">
                    Area Terbatas
                  </p>
                  <h1 className="text-2xl font-black leading-tight">Panel Admin</h1>
                </div>
              </div>

              <div className="space-y-6 p-6 sm:p-8" aria-live="polite">
                {step === 'phone' && (
                  <>
                    <div className="flex items-center justify-between gap-3">
                      <StepTitle
                        icon={ShieldCheck}
                        title="Verifikasi Administrator"
                        subtitle="Masuk dengan nomor WhatsApp pemilik untuk membuka dasbor kurasi."
                      />
                      <StepDots step={1} total={2} />
                    </div>

                    <form
                      className="space-y-5"
                      onSubmit={(e) => {
                        e.preventDefault()
                        if (phoneValid && !submitting) void handleRequestOtp()
                      }}
                    >
                      <PhoneField id="admin-phone" value={phone} onChange={setPhone} disabled={submitting} />
                      {error && <ErrorBox message={error} />}
                      <Button
                        type="submit"
                        disabled={!phoneValid || submitting}
                        className="h-13 w-full rounded-2xl text-base font-black"
                      >
                        {submitting ? (
                          <Loader2 className="h-5 w-5 animate-spin" aria-hidden="true" />
                        ) : (
                          <MessageCircle className="h-5 w-5" aria-hidden="true" />
                        )}
                        Kirim Kode Verifikasi
                      </Button>
                    </form>

                    <div className="rounded-2xl border-2 border-border bg-muted p-4">
                      <p className="flex items-center gap-2 text-sm font-bold text-foreground">
                        <ShieldAlert className="h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
                        Hanya nomor pemilik
                      </p>
                      <p className="mt-1 text-xs font-medium leading-relaxed text-muted-foreground">
                        Nomor yang terdaftar sebagai pemilik (berakhiran{' '}
                        <span className="font-bold text-foreground">6524</span>) otomatis diakui
                        sebagai ADMIN. Nomor lain tidak akan mendapatkan akses dasbor.
                      </p>
                    </div>
                  </>
                )}

                {step === 'otp' && (
                  <>
                    <div className="flex items-center justify-between gap-3">
                      <StepTitle
                        icon={Smartphone}
                        title="Cek WhatsApp Kamu"
                        subtitle={
                          <>
                            6 digit kode dikirim ke{' '}
                            <span className="font-bold text-foreground">{phoneDisplay}</span>.
                            Berlaku {expiryLeft ?? '5:00'}.
                          </>
                        }
                      />
                      <StepDots step={2} total={2} />
                    </div>

                    {devCode && <DevCodeBox code={devCode} phoneDisplay={phoneDisplay} />}

                    {error && <ErrorBox message={error} />}

                    <OtpSlots value={code} onChange={setCode} disabled={submitting} />

                    <Button
                      type="button"
                      onClick={() => void handleVerify()}
                      disabled={submitting || code.length !== 6}
                      className="h-13 w-full rounded-2xl text-base font-black"
                    >
                      {submitting ? (
                        <Loader2 className="h-5 w-5 animate-spin" aria-hidden="true" />
                      ) : (
                        <ShieldCheck className="h-5 w-5" aria-hidden="true" />
                      )}
                      Verifikasi & Buka Panel
                    </Button>

                    <div className="flex items-center justify-between gap-3">
                      <button
                        type="button"
                        onClick={() => void handleRequestOtp()}
                        disabled={resendLeft > 0 || submitting}
                        className="inline-flex min-h-[44px] items-center gap-1.5 text-sm font-bold text-primary disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        <MessageCircle className="h-4 w-4" aria-hidden="true" />
                        {resendLeft > 0 ? `Kirim ulang ${resendLeft}s` : 'Kirim ulang kode'}
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setStep('phone')
                          setError(null)
                        }}
                        className="inline-flex min-h-[44px] items-center text-sm font-semibold text-muted-foreground transition-colors hover:text-foreground"
                      >
                        Ganti nomor
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>

            <p className="mt-5 text-center text-xs font-medium text-muted-foreground">
              Bukan admin?{' '}
              <Link href="/masuk" className="font-bold text-primary underline underline-offset-2">
                Masuk sebagai pembeli / penjual
              </Link>
            </p>
          </div>
        )}
      </main>

      <footer className="relative z-10 border-t border-border bg-background py-5">
        <p className="text-center text-xs font-medium text-muted-foreground">
          © {useCurrentYear()} Raja Akun ({SITE.domain}) · Sistem internal{' '}
          {SITE.company}
        </p>
      </footer>
    </div>
  )
}

// ============ Kartu akses ditolak (login non-admin di /admin) ============

function NoAccessCard({ phone, onLogout }: { phone: string; onLogout: () => void }) {
  return (
    <div className="w-full max-w-md self-center">
      <div className="space-y-6 rounded-3xl border-2 border-red-500/60 bg-card p-7 shadow-2xl shadow-black/60 sm:p-9">
        <div className="flex items-start gap-4">
          <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-destructive shadow-lg">
            <ShieldAlert className="h-7 w-7 text-white" aria-hidden="true" />
          </span>
          <div>
            <h1 className="text-2xl font-black leading-tight text-foreground">Akses Ditolak</h1>
            <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
              Nomor <span className="font-bold text-foreground">+{phone}</span> terverifikasi,
              tetapi bukan administrator Raja Akun.
            </p>
          </div>
        </div>

        <div className="rounded-2xl bg-destructive p-4">
          <p className="text-sm font-bold leading-snug text-white">
            Dasbor kurasi hanya dapat dibuka dengan nomor WhatsApp pemilik yang terdaftar di
            sistem. Silakan keluar dan masuk menggunakan nomor pemilik.
          </p>
        </div>

        <div className="grid gap-3">
          <Button
            onClick={onLogout}
            className="h-13 w-full rounded-2xl text-base font-black"
          >
            <LogOut className="h-5 w-5" aria-hidden="true" />
            Keluar & Coba Nomor Lain
          </Button>
          <Button
            asChild
            variant="outline"
            className="h-13 w-full rounded-2xl border-2 border-border font-bold text-foreground"
          >
            <Link href="/">
              <Home className="h-5 w-5" aria-hidden="true" />
              Kembali ke Beranda
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}

// ============ Dashboard admin INLINE (solid) ============

function AdminDashboard() {
  const { toast } = useToast()
  const { user, logout } = useAuthStore()

  const [filter, setFilter] = useState<ListingStatus | ''>('PENDING')
  const [listings, setListings] = useState<SellerListingDTO[]>([])
  const [loading, setLoading] = useState(true)
  const [busyId, setBusyId] = useState<string | null>(null)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/listings?admin=1', { cache: 'no-store' })
      const data = (await res.json()) as { ok: boolean; listings?: SellerListingDTO[] }
      if (data.ok && data.listings) setListings(data.listings)
    } catch {
      // senyap — kartu tetap menampilkan data terakhir
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void load()
  }, [load])

  const stats = useMemo(
    () => ({
      PENDING: listings.filter((l) => l.status === 'PENDING').length,
      APPROVED: listings.filter((l) => l.status === 'APPROVED').length,
      SOLD: listings.filter((l) => l.status === 'SOLD').length,
      REJECTED: listings.filter((l) => l.status === 'REJECTED').length,
    }),
    [listings],
  )

  const visible = useMemo(
    () => (filter ? listings.filter((l) => l.status === filter) : listings),
    [listings, filter],
  )

  async function moderate(id: string, action: 'approve' | 'reject' | 'mark-sold' | 'delete') {
    setBusyId(id)
    try {
      await fetch('/api/admin/listings', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, action }),
      })
      const label =
        action === 'approve'
          ? 'disetujui & tayang'
          : action === 'reject'
            ? 'ditolak'
            : action === 'mark-sold'
              ? 'ditandai terjual'
              : 'dihapus'
      toast({ title: 'Berhasil', description: `Listing ${label}.` })
      await load()
    } finally {
      setBusyId(null)
    }
  }

  const badge = ROLE_BADGE_LABELS.ADMIN

  return (
    <div className="w-full max-w-6xl">
      {/* Kepala dasbor */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary shadow-lg shadow-primary/30">
            <ShieldCheck className="h-7 w-7 text-primary-foreground" aria-hidden="true" />
          </span>
          <div>
            <h1 className="text-2xl font-black leading-tight text-foreground">
              Dasbor Kurasi Admin
            </h1>
            <p className="mt-0.5 flex flex-wrap items-center gap-2 text-sm font-medium text-muted-foreground">
              <span>{user?.name ?? 'Administrator'}</span>
              <span
                className={cn(
                  'inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-black uppercase tracking-wider',
                  badge.className,
                )}
              >
                <badge.Icon className="h-3 w-3" aria-hidden="true" />
                {badge.label}
              </span>
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={() => void load()}
            className="h-11 gap-1.5 rounded-full border-2 border-border font-bold"
          >
            <RefreshCw className={cn('h-4 w-4', loading && 'animate-spin')} aria-hidden="true" />
            Muat Ulang
          </Button>
          <Button
            variant="outline"
            onClick={() => void logout()}
            className="h-11 gap-1.5 rounded-full border-2 border-border font-bold text-muted-foreground hover:text-foreground"
          >
            <LogOut className="h-4 w-4" aria-hidden="true" />
            Keluar
          </Button>
        </div>
      </div>

      {/* Statistik solid */}
      <div className="mt-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatCard label="Perlu Kurasi" value={stats.PENDING} tone="bg-amber-400 text-zinc-950" />
        <StatCard label="Tayang" value={stats.APPROVED} tone="bg-emerald-500 text-zinc-950" />
        <StatCard label="Terjual" value={stats.SOLD} tone="bg-zinc-400 text-zinc-950" />
        <StatCard label="Ditolak" value={stats.REJECTED} tone="bg-red-500 text-white" />
      </div>

      {/* Filter tab solid */}
      <div className="mt-6 flex flex-wrap gap-2" role="tablist" aria-label="Filter status listing">
        {FILTERS.map((f) => (
          <button
            key={f.value || 'semua'}
            type="button"
            role="tab"
            aria-selected={filter === f.value}
            onClick={() => setFilter(f.value)}
            className={cn(
              'min-h-[40px] rounded-full border-2 px-4 text-sm font-bold transition-colors',
              filter === f.value
                ? 'border-primary bg-primary text-primary-foreground shadow-lg shadow-primary/25'
                : 'border-border bg-muted text-muted-foreground hover:border-primary/50 hover:text-foreground',
            )}
          >
            {f.label}
            {f.value && stats[f.value as ListingStatus] > 0 && (
              <span
                className={cn(
                  'ml-2 rounded-full px-1.5 py-0.5 text-[10px] font-black',
                  filter === f.value ? 'bg-zinc-950/15 text-zinc-950' : 'bg-background text-foreground',
                )}
              >
                {stats[f.value as ListingStatus]}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Daftar listing */}
      <div className="mt-5 space-y-3 pb-4">
        {loading && listings.length === 0 && (
          <div className="flex justify-center rounded-3xl border-2 border-border bg-card py-14">
            <Loader2 className="h-8 w-8 animate-spin text-primary" aria-hidden="true" />
          </div>
        )}

        {!loading && visible.length === 0 && (
          <div className="rounded-3xl border-2 border-dashed border-border bg-card p-10 text-center">
            <Crown className="mx-auto h-9 w-9 text-muted-foreground/60" aria-hidden="true" />
            <p className="mt-3 text-base font-extrabold text-foreground">Antrean kosong</p>
            <p className="mt-1 text-sm font-medium text-muted-foreground">
              Tidak ada listing pada filter ini.
            </p>
          </div>
        )}

        {visible.map((listing) => (
          <article
            key={listing.id}
            className="rounded-2xl border-2 border-border bg-card p-5 shadow-lg shadow-black/30 transition-colors hover:border-primary/40"
          >
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="min-w-0 flex-1">
                <p className="text-base font-extrabold text-foreground">{listing.title}</p>
                <p className="mt-0.5 text-xs font-semibold text-muted-foreground">
                  {listing.platformName} · {listing.level} ·{' '}
                  <span className="font-mono">{listing.code}</span> ·{' '}
                  {listing.sellerName ?? listing.sellerInitials}
                </p>
                {listing.description && (
                  <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                    {listing.description}
                  </p>
                )}
              </div>
              <span
                className={cn(
                  'shrink-0 rounded-full px-3 py-1 text-[11px] font-black uppercase tracking-wider',
                  STATUS_BADGE[listing.status],
                )}
              >
                {LISTING_STATUS_LABEL[listing.status]}
              </span>
            </div>

            <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1">
              <p className="flex items-center gap-1.5 text-lg font-black text-primary">
                <Tag className="h-4 w-4" aria-hidden="true" />
                {formatIDR(listing.price)}
              </p>
              {listing.followers && (
                <p className="text-xs font-bold text-muted-foreground">
                  {listing.followers} follower
                </p>
              )}
            </div>

            {listing.adminNote && (
              <p className="mt-2 rounded-xl border-2 border-primary/40 bg-muted px-3.5 py-2.5 text-xs font-semibold text-foreground">
                Catatan admin: {listing.adminNote}
              </p>
            )}

            <div className="mt-4 flex flex-wrap gap-2">
              {listing.status === 'PENDING' && (
                <>
                  <Button
                    size="sm"
                    disabled={busyId === listing.id}
                    onClick={() => void moderate(listing.id, 'approve')}
                    className="h-10 rounded-full px-4 text-xs font-black"
                  >
                    <Check className="mr-1 h-4 w-4" aria-hidden="true" />
                    Setujui
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    disabled={busyId === listing.id}
                    onClick={() => void moderate(listing.id, 'reject')}
                    className="h-10 rounded-full border-2 border-destructive px-4 text-xs font-bold text-destructive hover:bg-destructive hover:text-white"
                  >
                    <X className="mr-1 h-4 w-4" aria-hidden="true" />
                    Tolak
                  </Button>
                </>
              )}
              {listing.status === 'APPROVED' && (
                <Button
                  size="sm"
                  variant="outline"
                  disabled={busyId === listing.id}
                  onClick={() => void moderate(listing.id, 'mark-sold')}
                  className="h-10 rounded-full border-2 border-border px-4 text-xs font-bold"
                >
                  <Crown className="mr-1 h-4 w-4" aria-hidden="true" />
                  Tandai Terjual
                </Button>
              )}
              {listing.status !== 'PENDING' && (
                <Button
                  size="sm"
                  variant="ghost"
                  disabled={busyId === listing.id}
                  onClick={() => void moderate(listing.id, 'delete')}
                  className="h-10 rounded-full px-4 text-xs font-bold text-destructive hover:bg-destructive hover:text-white"
                >
                  <X className="mr-1 h-4 w-4" aria-hidden="true" />
                  Hapus
                </Button>
              )}
              <Button asChild size="sm" variant="ghost" className="h-10 rounded-full px-4 text-xs font-bold text-primary hover:bg-primary/10">
                <a
                  href={listingWaLink(listing.code, listing.title, listing.sellerName ?? '')}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <MessageCircle className="mr-1 h-4 w-4" aria-hidden="true" />
                  Chat Penjual
                </a>
              </Button>
            </div>
          </article>
        ))}
      </div>
    </div>
  )
}

// ============ Kartu statistik solid ============

function StatCard({ label, value, tone }: { label: string; value: number; tone: string }) {
  return (
    <div className="rounded-2xl border-2 border-border bg-card p-4 shadow-lg shadow-black/30">
      <div className="flex items-center justify-between gap-2">
        <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">{label}</p>
        <span
          aria-hidden="true"
          className={cn('h-3 w-3 rounded-full', tone)}
        />
      </div>
      <p className="mt-2 text-4xl font-black text-foreground tabular-nums">{value}</p>
      <div className={cn('mt-3 h-1.5 w-full rounded-full', tone)} aria-hidden="true" />
    </div>
  )
}
