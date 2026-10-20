'use client'

/**
 * RAJA AKUN — Halaman Masuk (/masuk)
 * ===================================
 * Halaman tunggal SOLID (tanpa dialog, tanpa panel transparan).
 * Alur: nomor WhatsApp -> OTP 6 digit -> (pengguna baru) lengkapi profil.
 */

import { useEffect, useMemo, useRef, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  ArrowRight,
  Check,
  Crown,
  Home,
  Loader2,
  LogOut,
  MessageCircle,
  ShieldCheck,
  Smartphone,
  UserRound,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useToast } from '@/hooks/use-toast'
import { ROLE_BADGE_LABELS } from '@/components/rajaakun/role-badges'
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

export function LoginPage() {
  const router = useRouter()
  const { toast } = useToast()
  const { user, status, setUser, fetchMe, logout } = useAuthStore()

  const [step, setStep] = useState<Step>('phone')
  const [phone, setPhone] = useState('')
  const [phoneDisplay, setPhoneDisplay] = useState('')
  const [code, setCode] = useState('')
  const [devCode, setDevCode] = useState<string | null>(null)
  const [isNewUser, setIsNewUser] = useState(false)
  const [name, setName] = useState('')
  const [role, setRole] = useState<'BUYER' | 'SELLER'>('BUYER')

  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Countdown OTP + cooldown kirim ulang (tick tiap detik selagi di langkah OTP)
  const [expiryAt, setExpiryAt] = useState<number | null>(null)
  const [resendAt, setResendAt] = useState<number | null>(null)
  const [now, setNow] = useState(() => Date.now())
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  // Sinkronkan sesi (cookie httpOnly) saat halaman dibuka
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

  /** Kartu "sudah masuk" hanya saat sesi aktif & pengguna tidak sedang menyelesaikan alur profil. */
  const showLoggedIn = status === 'ready' && user !== null && step !== 'profile'

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
      if (data.isNew) {
        setIsNewUser(true)
        setStep('profile')
      } else {
        toast({
          title: 'Berhasil masuk!',
          description: `Selamat datang kembali di Raja Akun${data.user.name ? `, ${data.user.name}` : ''}.`,
        })
        router.replace('/')
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
            ? 'Kamu terdaftar sebagai Penjual — buka Dashboard Penjual untuk daftarkan akun pertamamu.'
            : 'Kamu terdaftar sebagai Pembeli — selamat berbelanja akun bergaransi!',
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
      <AuthTopBar href="/daftar" hint="Daftar Akun Baru" />

      {/* Latar dekoratif di belakang — kartu konten di atasnya 100% solid */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-royal-glow" />

      <main className="relative z-10 flex flex-1 items-center justify-center px-4 py-10 sm:px-6 sm:py-14">
        <div className="grid w-full max-w-5xl overflow-hidden rounded-3xl border-2 border-primary/30 bg-card shadow-2xl shadow-black/60 lg:grid-cols-[5fr_6fr]">
          <AuthBrandPanel
            kicker="Masuk Raja Akun"
            title={
              <>
                Satu nomor WhatsApp
                <br />
                untuk semua.
              </>
            }
            subtitle="Beli akun bergaransi, pantau pesanan, atau buka toko penjual — semuanya dari satu login WhatsApp, tanpa kata sandi."
            points={[
              {
                title: 'Verifikasi instan via WhatsApp',
                desc: 'Kode 6 digit dikirim langsung ke WhatsApp kamu — bukan SMS biasa.',
              },
              {
                title: 'Nomor aman & privat',
                desc: 'Dipakai hanya untuk akun & transaksi di Raja Akun. Tidak dibagikan.',
              },
              {
                title: 'Pembeli & penjual sekaligus',
                desc: 'Satu akun untuk berbelanja sekaligus menjual akun milikmu.',
              },
            ]}
            note={SITE.whatsappDisplay}
          />

          {/* ===== Panel formulir SOLID ===== */}
          <section className="flex flex-col justify-center bg-card p-7 sm:p-10" aria-live="polite">
            {status !== 'ready' && (
              <div className="flex flex-col items-center gap-3 py-16">
                <Loader2 className="h-8 w-8 animate-spin text-primary" aria-hidden="true" />
                <p className="text-sm font-semibold text-muted-foreground">
                  Memeriksa sesi login…
                </p>
              </div>
            )}

            {status === 'ready' && showLoggedIn && (
              <LoggedInCard user={user} onLogout={() => void logout()} />
            )}

            {status === 'ready' && !showLoggedIn && (
              <>
                {step === 'phone' && (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between gap-3">
                      <StepTitle
                        icon={MessageCircle}
                        title="Masuk dengan WhatsApp"
                        subtitle="Tanpa kata sandi. Cukup nomor WhatsApp + kode verifikasi."
                      />
                      <StepDots step={1} total={isNewUser ? 3 : 2} />
                    </div>

                    <form
                      className="space-y-5"
                      onSubmit={(e) => {
                        e.preventDefault()
                        if (phoneValid && !submitting) void handleRequestOtp()
                      }}
                    >
                      <PhoneField
                        id="masuk-phone"
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

                    <div className="rounded-2xl border-2 border-border bg-muted p-4">
                      <p className="text-sm font-bold text-foreground">
                        Belum punya akun Raja Akun?
                      </p>
                      <p className="mt-0.5 text-xs font-medium text-muted-foreground">
                        Daftar gratis lewat WhatsApp — jadi pembeli atau penjual, pilihanmu.
                      </p>
                      <Button
                        asChild
                        variant="outline"
                        className="mt-3 h-11 w-full rounded-xl border-2 border-primary font-bold text-primary hover:bg-primary hover:text-primary-foreground"
                      >
                        <Link href="/daftar">
                          Daftar Akun Baru
                          <ArrowRight className="h-4 w-4" aria-hidden="true" />
                        </Link>
                      </Button>
                    </div>

                    <p className="text-center">
                      <Link
                        href="/admin"
                        className="inline-flex min-h-[44px] items-center gap-1.5 text-xs font-semibold text-muted-foreground transition-colors hover:text-primary"
                      >
                        <ShieldCheck className="h-3.5 w-3.5" aria-hidden="true" />
                        Panel Admin
                      </Link>
                    </p>
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
                            <span className="font-bold text-foreground">{phoneDisplay}</span>.
                            Berlaku {expiryLeft ?? '5:00'}.
                          </>
                        }
                      />
                      <StepDots step={2} total={isNewUser ? 3 : 2} />
                    </div>

                    {!devCode && (
                      <div className="rounded-2xl border-2 border-primary/50 bg-muted p-4">
                        <p className="text-sm font-bold text-foreground">
                          Kode dikirim via WhatsApp
                        </p>
                        <p className="mt-0.5 text-xs font-medium text-muted-foreground">
                          Tidak sampai?{' '}
                          <a
                            href={waLink(
                              `Halo Admin Raja Akun, saya butuh bantuan login untuk nomor ${phoneDisplay}.`,
                            )}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="font-bold text-primary underline underline-offset-2"
                          >
                            Hubungi admin
                          </a>{' '}
                          atau kirim ulang kode di bawah.
                        </p>
                      </div>
                    )}

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
                        <Check className="h-5 w-5" aria-hidden="true" />
                      )}
                      Verifikasi & Masuk
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
                        title="Lengkapi Profil"
                        subtitle="Satu langkah terakhir — kenalkan dirimu dan pilih peran di Raja Akun."
                      />
                      <StepDots step={3} total={3} />
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="masuk-name" className="block text-sm font-bold text-foreground">
                        Nama tampilan
                      </label>
                      <input
                        id="masuk-name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="cth. Gugun Gunara"
                        maxLength={60}
                        autoComplete="name"
                        className="h-13 w-full rounded-xl border-2 border-input bg-muted px-4 text-base font-bold text-foreground outline-none transition-colors placeholder:font-medium placeholder:text-muted-foreground focus:border-primary"
                      />
                    </div>

                    <div className="space-y-2">
                      <p className="text-sm font-bold text-foreground">Daftar sebagai</p>
                      <RoleCards value={role} onChange={setRole} name="peran-masuk" />
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
                      Masuk ke Raja Akun
                    </Button>
                  </div>
                )}
              </>
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

// ============ Tampilan saat sudah login ============

function LoggedInCard({ user, onLogout }: { user: AuthUser; onLogout: () => void }) {
  const badge = ROLE_BADGE_LABELS[user.role]
  return (
    <div className="space-y-6">
      <StepTitle
        icon={Check}
        title={`Kamu sudah masuk${user.name ? `, ${user.name}` : ''}!`}
        subtitle="Sesi WhatsApp kamu aktif. Tidak perlu masuk lagi — langsung lanjut beraktivitas."
      />

      <div className="flex items-center gap-4 rounded-2xl border-2 border-border bg-muted p-4">
        <span
          aria-hidden="true"
          className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-amber-400 to-yellow-600 text-lg font-black text-zinc-950"
        >
          {(user.name ?? 'RA')
            .trim()
            .split(/\s+/)
            .slice(0, 2)
            .map((p) => p[0]?.toUpperCase() ?? '')
            .join('')}
        </span>
        <div className="min-w-0">
          <p className="truncate text-base font-extrabold text-foreground">
            {user.name ?? 'Akun Raja Akun'}
          </p>
          <p className="truncate text-sm font-medium text-muted-foreground">+{user.phone}</p>
          <span
            className={cn(
              'mt-1 inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider',
              badge.className,
            )}
          >
            <badge.Icon className="h-3 w-3" aria-hidden="true" />
            {badge.label}
          </span>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <Button asChild className="h-13 rounded-2xl text-base font-black">
          <Link href="/">
            <Home className="h-5 w-5" aria-hidden="true" />
            Ke Beranda
          </Link>
        </Button>
        {user.role === 'ADMIN' ? (
          <Button
            asChild
            variant="outline"
            className="h-13 rounded-2xl border-2 border-primary font-black text-primary hover:bg-primary hover:text-primary-foreground"
          >
            <Link href="/admin">
              <ShieldCheck className="h-5 w-5" aria-hidden="true" />
              Panel Admin
            </Link>
          </Button>
        ) : (
          <Button
            variant="outline"
            onClick={onLogout}
            className="h-13 rounded-2xl border-2 border-border font-bold text-muted-foreground hover:text-foreground"
          >
            <LogOut className="h-5 w-5" aria-hidden="true" />
            Keluar
          </Button>
        )}
      </div>
    </div>
  )
}
