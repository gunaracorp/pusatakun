'use client'

/**
 * RAJA AKUN — Halaman Daftar (/daftar)
 * =====================================
 * Halaman tunggal SOLID. Alur: pilih peran (Pembeli/Penjual) -> nomor
 * WhatsApp -> OTP 6 digit -> nama tampilan -> selesai.
 * Mendukung ?peran=penjual untuk pra-pilih peran Penjual.
 */

import { useEffect, useMemo, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  Check,
  Crown,
  Loader2,
  MessageCircle,
  ShieldCheck,
  Smartphone,
  UserRound,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useToast } from '@/hooks/use-toast'
import {
  AuthBrandPanel,
  AuthTopBar,
  DevCodeBox,
  ErrorBox,
  OtpSlots,
  PhoneField,
  RoleCards,
  StepDots,
  StepTitle,
  formatCountdown,
} from '@/components/rajaakun/auth-shell'
import { SITE } from '@/lib/marketplace'
import { useAuthStore, type AuthUser } from '@/store/auth-store'

type Step = 'role' | 'phone' | 'otp' | 'profile'

type RequestOtpResponse = {
  ok: boolean
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

export function RegisterPage() {
  const router = useRouter()
  const { toast } = useToast()
  const { setUser } = useAuthStore()

  const [step, setStep] = useState<Step>('role')
  const [role, setRole] = useState<'BUYER' | 'SELLER'>('BUYER')
  const [phone, setPhone] = useState('')
  const [phoneDisplay, setPhoneDisplay] = useState('')
  const [code, setCode] = useState('')
  const [devCode, setDevCode] = useState<string | null>(null)
  const [name, setName] = useState('')

  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [expiryAt, setExpiryAt] = useState<number | null>(null)
  const [resendAt, setResendAt] = useState<number | null>(null)
  const [now, setNow] = useState(() => Date.now())
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  // Pra-pilih peran dari URL (?peran=penjual) — dibaca sekali setelah mount
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    if (params.get('peran') === 'penjual') setRole('SELLER')
  }, [])

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
  const roleLabel = role === 'SELLER' ? 'Penjual' : 'Pembeli'

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
      setStep('profile')
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
        title: `Selamat datang, ${data.user.name ?? 'Raja'}!`,
        description:
          role === 'SELLER'
            ? 'Akun penjualmu aktif. Buka menu akun (kiri atas) lalu pilih Dashboard Penjual untuk mendaftarkan akun pertamamu.'
            : 'Akun pembelimu aktif. Yuk jelajahi katalog dan temukan akun impianmu!',
      })
      router.replace('/')
    } catch {
      setError('Koneksi bermasalah. Coba lagi ya.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <AuthTopBar href="/masuk" hint="Sudah punya akun? Masuk" />

      <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-royal-glow" />

      <main className="relative z-10 flex flex-1 items-center justify-center px-4 py-10 sm:px-6 sm:py-14">
        <div className="grid w-full max-w-5xl overflow-hidden rounded-3xl border-2 border-primary/30 bg-card shadow-2xl shadow-black/60 lg:grid-cols-[6fr_5fr]">
          <AuthBrandPanel
            kicker={role === 'SELLER' ? 'Daftar Jadi Penjual' : 'Daftar Raja Akun'}
            title={
              role === 'SELLER' ? (
                <>
                  Tokomu, raja,
                  <br />
                  kami antarkan.
                </>
              ) : (
                <>
                  Mulai belanja akun
                  <br />
                  bergaransi.
                </>
              )
            }
            subtitle={
              role === 'SELLER'
                ? 'Buka toko gratis di Raja Akun — ribuan pembeli aktif setiap hari, kurasi admin 24 jam, komisi transparan tanpa biaya daftar.'
                : 'Bergabung gratis — beli akun media sosial, game, dan streaming dengan garansi penuh serta checkout dibantu admin 24/7.'
            }
            points={
              role === 'SELLER'
                ? [
                    {
                      title: 'Daftar gratis, langsung tayang',
                      desc: 'Listing kamu dikurasi admin maksimal 24 jam lalu tampil publik.',
                    },
                    {
                      title: 'Pembeli datang sendiri',
                      desc: 'Trafik ribuan pencari akun setiap hari tanpa perlu promosi.',
                    },
                    {
                      title: 'Aman & transparan',
                      desc: 'Setiap pesanan tercatat, chat admin langsung untuk pencairan.',
                    },
                  ]
                : [
                    {
                      title: 'Garansi penuh',
                      desc: 'Uang kembali 100% bila akun bermasalah di masa garansi.',
                    },
                    {
                      title: 'Pengiriman instan',
                      desc: 'Rata-rata 5–15 menit setelah pembayaran dikonfirmasi admin.',
                    },
                    {
                      title: 'Checkout dibantu admin',
                      desc: 'Bingung? Admin mendampingi lewat WhatsApp sampai selesai.',
                    },
                  ]
            }
            note={SITE.whatsappDisplay}
          />

          {/* ===== Panel formulir SOLID ===== */}
          <section className="flex flex-col justify-center bg-card p-7 sm:p-10" aria-live="polite">
            {step === 'role' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between gap-3">
                  <StepTitle
                    icon={Crown}
                    title="Daftar sebagai apa?"
                    subtitle="Pilih peranmu sekarang — bisa diubah atau ditambah kapan saja nanti."
                  />
                  <StepDots step={1} total={4} />
                </div>

                <RoleCards value={role} onChange={setRole} name="peran-daftar" />

                {error && <ErrorBox message={error} />}

                <Button
                  type="button"
                  onClick={() => {
                    setError(null)
                    setStep('phone')
                  }}
                  className="h-13 w-full rounded-2xl text-base font-black"
                >
                  Lanjut sebagai {roleLabel}
                  <UserRound className="h-5 w-5" aria-hidden="true" />
                </Button>

                <p className="flex items-center justify-center gap-1.5 text-center text-xs font-medium text-muted-foreground">
                  <ShieldCheck className="h-3.5 w-3.5 text-primary" aria-hidden="true" />
                  Gratis 100% — tanpa biaya pendaftaran
                </p>
              </div>
            )}

            {step === 'phone' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between gap-3">
                  <StepTitle
                    icon={MessageCircle}
                    title={`Halo, calon ${roleLabel}!`}
                    subtitle="Masukkan nomor WhatsApp aktif untuk menerima kode verifikasi."
                  />
                  <StepDots step={2} total={4} />
                </div>

                <form
                  className="space-y-5"
                  onSubmit={(e) => {
                    e.preventDefault()
                    if (phoneValid && !submitting) void handleRequestOtp()
                  }}
                >
                  <PhoneField
                    id="daftar-phone"
                    value={phone}
                    onChange={setPhone}
                    disabled={submitting}
                  />
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

                <button
                  type="button"
                  onClick={() => setStep('role')}
                  className="inline-flex min-h-[44px] items-center text-sm font-semibold text-muted-foreground transition-colors hover:text-foreground"
                >
                  ← Ganti peran
                </button>
              </div>
            )}

            {step === 'otp' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between gap-3">
                  <StepTitle
                    icon={Smartphone}
                    title="Cek WhatsApp Kamu"
                    subtitle={
                      <>
                        Kami mengirim 6 digit kode ke{' '}
                        <span className="font-bold text-foreground">{phoneDisplay}</span>. Berlaku{' '}
                        {expiryLeft ?? '5:00'}.
                      </>
                    }
                  />
                  <StepDots step={3} total={4} />
                </div>

                {devCode && <DevCodeBox code={devCode} phoneDisplay={phoneDisplay} />}

                {!devCode && (
                  <div className="rounded-2xl border-2 border-primary/50 bg-muted p-4">
                    <p className="text-sm font-bold text-foreground">Kode dikirim via WhatsApp</p>
                    <p className="mt-0.5 text-xs font-medium text-muted-foreground">
                      Tidak sampai? Kirim ulang kode di bawah, atau hubungi admin di{' '}
                      <span className="font-bold text-foreground">{SITE.whatsappDisplay}</span>.
                    </p>
                  </div>
                )}

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
                    <Check className="h-5 w-5" aria-hidden="true" />
                  )}
                  Verifikasi Kode
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
              </div>
            )}

            {step === 'profile' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between gap-3">
                  <StepTitle
                    icon={UserRound}
                    title="Siapa nama panggilanmu?"
                    subtitle={`Nomor ${phoneDisplay} terverifikasi. Peran: ${roleLabel}.`}
                  />
                  <StepDots step={4} total={4} />
                </div>

                <div className="space-y-2">
                  <label htmlFor="daftar-name" className="block text-sm font-bold text-foreground">
                    Nama tampilan
                  </label>
                  <input
                    id="daftar-name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="cth. Gugun Gunara"
                    maxLength={60}
                    autoComplete="name"
                    autoFocus
                    className="h-13 w-full rounded-xl border-2 border-input bg-muted px-4 text-base font-bold text-foreground outline-none transition-colors placeholder:font-medium placeholder:text-muted-foreground focus:border-primary"
                  />
                  <p className="text-xs font-medium text-muted-foreground">
                    Nama ini ditampilkan pada pesanan dan toko kamu.
                  </p>
                </div>

                {error && <ErrorBox message={error} />}

                <Button
                  type="button"
                  onClick={() => void handleCompleteProfile()}
                  disabled={submitting}
                  className="h-13 w-full rounded-2xl text-base font-black"
                >
                  {submitting ? (
                    <Loader2 className="h-5 w-5 animate-spin" aria-hidden="true" />
                  ) : (
                    <Crown className="h-5 w-5" aria-hidden="true" />
                  )}
                  Selesai — Masuk ke Raja Akun
                </Button>
              </div>
            )}
          </section>
        </div>
      </main>

      <footer className="relative z-10 border-t border-border bg-background py-5">
        <p className="text-center text-xs font-medium text-muted-foreground">
          © {new Date().getFullYear()} Raja Akun ({SITE.domain}) · Sebuah layanan dari{' '}
          {SITE.company}
        </p>
      </footer>
    </div>
  )
}
