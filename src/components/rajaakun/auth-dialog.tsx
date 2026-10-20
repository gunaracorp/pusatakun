'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import {
  BadgeCheck,
  Check,
  Copy,
  Crown,
  Loader2,
  MessageCircle,
  ShoppingBag,
  Store,
  TimerReset,
  UserRound,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp'
import { Label } from '@/components/ui/label'
import { useToast } from '@/hooks/use-toast'
import { SITE, waLink } from '@/lib/marketplace'
import { cn } from '@/lib/utils'
import { useAuthStore, type AuthUser } from '@/store/auth-store'

type Step = 'phone' | 'otp' | 'profile'

type RequestOtpResponse = {
  ok: boolean
  phone?: string
  phoneDisplay?: string
  isNew?: boolean
  viaWhatsapp?: boolean
  devCode?: string
  expiresInSec?: number
  resendInSec?: number
  error?: string
}

type VerifyResponse = {
  ok: boolean
  user?: AuthUser
  isNew?: boolean
  error?: string
}

const ROLE_CARDS = [
  {
    role: 'BUYER' as const,
    title: 'Pembeli',
    icon: ShoppingBag,
    points: ['Checkout dibantu admin 24/7', 'Riwayat pesanan & garansi penuh', 'Akses katalog & flash promo'],
  },
  {
    role: 'SELLER' as const,
    title: 'Penjual',
    icon: Store,
    points: ['Buka toko gratis, listing dikurasi admin', 'Akun tayang di depan ribuan pembeli', 'Komisi transparan, tanpa biaya daftar'],
  },
] as const

function formatCountdown(totalSec: number): string {
  const s = Math.max(0, totalSec)
  const m = Math.floor(s / 60)
  const r = s % 60
  return `${m}:${String(r).padStart(2, '0')}`
}

export function AuthDialog() {
  const { toast } = useToast()
  const { authOpen, authMode, closeAuth, setUser } = useAuthStore()

  const [step, setStep] = useState<Step>('phone')
  const [phone, setPhone] = useState('')
  const [phoneDisplay, setPhoneDisplay] = useState('')
  const [code, setCode] = useState('')
  const [devCode, setDevCode] = useState<string | null>(null)
  const [viaWhatsapp, setViaWhatsapp] = useState(false)
  const [isNewUser, setIsNewUser] = useState(false)
  const [name, setName] = useState('')
  const [role, setRole] = useState<'BUYER' | 'SELLER'>(authMode === 'seller' ? 'SELLER' : 'BUYER')

  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)

  // Countdown kedaluwarsa OTP + cooldown kirim ulang (tick tiap detik selagi dialog terbuka)
  const [expiryAt, setExpiryAt] = useState<number | null>(null)
  const [resendAt, setResendAt] = useState<number | null>(null)
  const [now, setNow] = useState(() => Date.now())
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    if (!authOpen) return
    timerRef.current = setInterval(() => setNow(Date.now()), 1000)
    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [authOpen])

  // Reset penuh setiap kali dialog ditutup/dibuka
  useEffect(() => {
    if (!authOpen) {
      setStep('phone')
      setPhone('')
      setCode('')
      setDevCode(null)
      setError(null)
      setExpiryAt(null)
      setResendAt(null)
      setCopied(false)
    } else {
      setRole(authMode === 'seller' ? 'SELLER' : 'BUYER')
    }
  }, [authOpen, authMode])

  const expiryLeft = useMemo(
    () => (expiryAt ? formatCountdown(Math.ceil((expiryAt - now) / 1000)) : null),
    [expiryAt, now],
  )
  const resendLeft = useMemo(
    () => (resendAt ? Math.ceil((resendAt - now) / 1000) : 0),
    [resendAt, now],
  )

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
      setIsNewUser(!!data.isNew)
      setViaWhatsapp(!!data.viaWhatsapp)
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
    if (code.replace(/\D/g, '').length !== 6) {
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
      if (data.isNew) {
        setIsNewUser(true)
        setStep('profile')
      } else {
        toast({
          title: 'Berhasil masuk!',
          description: `Selamat datang kembali di Raja Akun${data.user.name ? `, ${data.user.name}` : ''}.`,
        })
        closeAuth()
      }
    } catch {
      setError('Koneksi bermasalah. Coba lagi ya.')
    } finally {
      setSubmitting(false)
    }
  }

  async function handleCompleteProfile() {
    setError(null)
    if (name.trim().length < 2) {
      setError('Tulis nama tampilan kamu (minimal 2 huruf).')
      return
    }
    setSubmitting(true)
    try {
      const res = await fetch('/api/auth/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: name.trim(), role }),
      })
      const data = (await res.json()) as { ok: boolean; user?: AuthUser; error?: string }
      if (!res.ok || !data.ok || !data.user) {
        setError(data.error ?? 'Gagal menyimpan profil.')
        return
      }
      setUser(data.user)
      toast({
        title: 'Akun WhatsApp terhubung!',
        description:
          role === 'SELLER'
            ? 'Kamu terdaftar sebagai Penjual — buka Dashboard Penjual untuk mendaftarkan akun pertamamu.'
            : 'Kamu terdaftar sebagai Pembeli — selamat berbelanja akun bergaransi!',
      })
      closeAuth()
    } catch {
      setError('Koneksi bermasalah. Coba lagi ya.')
    } finally {
      setSubmitting(false)
    }
  }

  function copyDevCode() {
    if (!devCode) return
    navigator.clipboard?.writeText(devCode).catch(() => {})
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  return (
    <Dialog open={authOpen} onOpenChange={(open) => !open && closeAuth()}>
      <DialogContent className="glass max-h-[92vh] overflow-y-auto border-border sm:max-w-md">
        {step === 'phone' && (
          <PhoneStep
            phone={phone}
            setPhone={setPhone}
            submitting={submitting}
            error={error}
            mode={authMode}
            onSubmit={handleRequestOtp}
          />
        )}

        {step === 'otp' && (
          <div className="space-y-5">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-xl font-extrabold">
                <MessageCircle className="h-5 w-5 text-primary" aria-hidden="true" />
                Cek WhatsApp Kamu
              </DialogTitle>
              <DialogDescription>
                Kami mengirim 6 digit kode verifikasi ke{' '}
                <span className="font-semibold text-foreground">{phoneDisplay}</span>. Berlaku{' '}
                {expiryLeft ?? '5:00'}.
              </DialogDescription>
            </DialogHeader>

            {!viaWhatsapp && devCode && (
              <div className="rounded-xl border border-primary/30 bg-primary/10 p-4" data-testid="dev-code">
                <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-primary">
                  <BadgeCheck className="h-4 w-4" aria-hidden="true" />
                  Mode Demo — Kode Kamu
                </p>
                <div className="mt-2 flex items-center justify-between gap-3">
                  <span className="font-mono text-2xl font-extrabold tracking-[0.35em] text-foreground">
                    {devCode}
                  </span>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={copyDevCode}
                    className="h-9 gap-1.5 rounded-full"
                    aria-label="Salin kode verifikasi"
                  >
                    {copied ? <Check className="h-4 w-4" aria-hidden="true" /> : <Copy className="h-4 w-4" aria-hidden="true" />}
                    {copied ? 'Tersalin' : 'Salin'}
                  </Button>
                </div>
                <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                  Pada mode produksi, kode dikirim otomatis ke WhatsApp kamu via WhatsApp Business
                  API. Belum menerima kode?{' '}
                  <a
                    href={waLink(
                      `Halo Admin Raja Akun, saya butuh bantuan login untuk nomor ${phoneDisplay}.`,
                    )}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-semibold text-primary underline underline-offset-2"
                  >
                    Hubungi admin
                  </a>
                  .
                </p>
              </div>
            )}

            <div className="flex flex-col items-center gap-3">
              <InputOTP maxLength={6} value={code} onChange={setCode} disabled={submitting}>
                <InputOTPGroup>
                  {[0, 1, 2, 3, 4, 5].map((i) => (
                    <InputOTPSlot key={i} index={i} className="h-12 w-11 border-border text-lg font-bold" />
                  ))}
                </InputOTPGroup>
              </InputOTP>
              {error && <p className="text-sm font-medium text-destructive">{error}</p>}
            </div>

            <Button
              type="button"
              onClick={handleVerify}
              disabled={submitting || code.length !== 6}
              className="h-12 w-full rounded-full text-base font-bold"
            >
              {submitting ? <Loader2 className="h-5 w-5 animate-spin" aria-hidden="true" /> : <Check className="h-5 w-5" aria-hidden="true" />}
              Verifikasi & Masuk
            </Button>

            <div className="flex items-center justify-between text-sm">
              <button
                type="button"
                onClick={handleRequestOtp}
                disabled={resendLeft > 0 || submitting}
                className="inline-flex min-h-[36px] items-center gap-1.5 font-semibold text-primary disabled:opacity-50"
              >
                <TimerReset className="h-4 w-4" aria-hidden="true" />
                {resendLeft > 0 ? `Kirim ulang ${resendLeft}s` : 'Kirim ulang kode'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setStep('phone')
                  setError(null)
                }}
                className="inline-flex min-h-[36px] items-center font-medium text-muted-foreground hover:text-foreground"
              >
                Ganti nomor
              </button>
            </div>
          </div>
        )}

        {step === 'profile' && (
          <div className="space-y-5">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-xl font-extrabold">
                <UserRound className="h-5 w-5 text-primary" aria-hidden="true" />
                Lengkapi Profil
              </DialogTitle>
              <DialogDescription>
                Satu langkah terakhir — kenalkan dirimu dan pilih peran di Raja Akun. Peran bisa
                diubah kapan saja nanti.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-2">
              <Label htmlFor="auth-name">Nama tampilan</Label>
              <Input
                id="auth-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="cth. Gugun Gunara"
                maxLength={60}
                className="h-12"
                autoComplete="name"
              />
            </div>

            <div className="space-y-2">
              <Label>Daftar sebagai</Label>
              <div className="grid gap-3 sm:grid-cols-2" role="radiogroup" aria-label="Pilih peran akun">
                {ROLE_CARDS.map((card) => (
                  <button
                    key={card.role}
                    type="button"
                    role="radio"
                    aria-checked={role === card.role}
                    onClick={() => setRole(card.role)}
                    className={cn(
                      'rounded-2xl border p-4 text-left transition-all duration-300',
                      role === card.role
                        ? 'border-primary bg-primary/10 shadow-lg shadow-primary/10'
                        : 'border-border bg-card/40 hover:border-primary/40',
                    )}
                  >
                    <card.icon
                      className={cn('h-6 w-6', role === card.role ? 'text-primary' : 'text-muted-foreground')}
                      aria-hidden="true"
                    />
                    <p className="mt-2 font-extrabold text-foreground">Jadi {card.title}</p>
                    <ul className="mt-2 space-y-1">
                      {card.points.map((point) => (
                        <li key={point} className="flex items-start gap-1.5 text-xs text-muted-foreground">
                          <Check className="mt-0.5 h-3 w-3 shrink-0 text-primary" aria-hidden="true" />
                          {point}
                        </li>
                      ))}
                    </ul>
                  </button>
                ))}
              </div>
            </div>

            {error && <p className="text-sm font-medium text-destructive">{error}</p>}

            <Button
              type="button"
              onClick={handleCompleteProfile}
              disabled={submitting}
              className="h-12 w-full rounded-full text-base font-bold"
            >
              {submitting ? (
                <Loader2 className="h-5 w-5 animate-spin" aria-hidden="true" />
              ) : (
                <Crown className="h-5 w-5" aria-hidden="true" />
              )}
              Masuk ke Raja Akun
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}

function PhoneStep({
  phone,
  setPhone,
  submitting,
  error,
  mode,
  onSubmit,
}: {
  phone: string
  setPhone: (v: string) => void
  submitting: boolean
  error: string | null
  mode: 'login' | 'seller'
  onSubmit: () => void
}) {
  const digits = phone.replace(/\D+/g, '')
  const valid = /^(0?8\d{7,11}|628\d{8,11})$/.test(digits)

  return (
    <div className="space-y-5">
      <DialogHeader>
        <DialogTitle className="flex items-center gap-2 text-xl font-extrabold">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary">
            <Crown className="h-4.5 w-4.5 text-primary-foreground" aria-hidden="true" />
          </span>
          {mode === 'seller' ? 'Jadi Penjual di Raja Akun' : 'Masuk dengan WhatsApp'}
        </DialogTitle>
        <DialogDescription>
          {mode === 'seller'
            ? 'Daftarkan akunmu ke rajaakun.web.id — ribuan pembeli aktif setiap hari, kurasi admin 24 jam, komisi transparan.'
            : 'Satu nomor WhatsApp untuk semua: beli akun bergaransi, pantau pesanan, atau buka toko penjual gratis.'}
        </DialogDescription>
      </DialogHeader>

      <form
        className="space-y-4"
        onSubmit={(e) => {
          e.preventDefault()
          if (valid && !submitting) onSubmit()
        }}
      >
        <div className="space-y-2">
          <Label htmlFor="auth-phone">Nomor WhatsApp aktif</Label>
          <div className="flex items-center gap-2">
            <span className="flex h-12 items-center rounded-lg border border-border bg-muted/40 px-3 font-semibold text-muted-foreground">
              +62
            </span>
            <Input
              id="auth-phone"
              inputMode="tel"
              autoComplete="tel-national"
              value={phone}
              onChange={(e) => setPhone(e.target.value.replace(/[^\d+\s-]/g, ''))}
              placeholder="813-1651-6524"
              className="h-12 flex-1 text-base"
              aria-describedby="auth-phone-hint"
            />
          </div>
          <p id="auth-phone-hint" className="text-xs text-muted-foreground">
            Format bebas: 08xx, 8xx, atau 62 8xx. Pastikan WhatsApp-nya aktif untuk menerima kode.
          </p>
        </div>

        {error && <p className="text-sm font-medium text-destructive">{error}</p>}

        <Button type="submit" disabled={!valid || submitting} className="h-12 w-full rounded-full text-base font-bold">
          {submitting ? (
            <Loader2 className="h-5 w-5 animate-spin" aria-hidden="true" />
          ) : (
            <MessageCircle className="h-5 w-5" aria-hidden="true" />
          )}
          Kirim Kode Verifikasi
        </Button>
      </form>

      <ul className="space-y-2 rounded-xl border border-border bg-card/40 p-4">
        {[
          'Kode verifikasi dikirim via WhatsApp — bukan SMS biasa',
          'Nomor kamu aman: dipakai hanya untuk akun & transaksi di Raja Akun',
          'Bisa jadi pembeli, penjual, atau keduanya dalam satu akun',
        ].map((point) => (
          <li key={point} className="flex items-start gap-2 text-xs text-muted-foreground">
            <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" aria-hidden="true" />
            {point}
          </li>
        ))}
      </ul>
    </div>
  )
}
