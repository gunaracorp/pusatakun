'use client'

/**
 * PUSATAKUN — Guard halaman dashboard.
 * Memastikan pengguna sudah masuk (sesi cookie httpOnly) sebelum konten
 * dashboard dirender. Belum masuk -> dialihkan ke /masuk.
 */

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Crown, Loader2, LogIn } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useAuthStore } from '@/store/auth-store'

export function DashboardGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const { user, status, fetchMe } = useAuthStore()

  useEffect(() => {
    if (status === 'idle') void fetchMe()
  }, [status, fetchMe])

  useEffect(() => {
    if (status === 'ready' && !user) {
      router.replace('/masuk')
    }
  }, [status, user, router])

  // Belum selesai dicek -> kerangka memuat (mencegah kedip konten)
  if (status !== 'ready' || !user) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-background">
        <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary shadow-lg shadow-primary/25">
          <Crown className="h-7 w-7 text-primary-foreground" aria-hidden="true" />
        </span>
        <p className="flex items-center gap-2 text-sm font-semibold text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
          Memeriksa sesi akun…
        </p>
      </div>
    )
  }

  return <>{children}</>
}

/** Panel akses terbatas untuk peran yang tidak memenuhi syarat halaman. */
export function AccessLimitedPanel({
  title,
  description,
}: {
  title: string
  description: string
}) {
  return (
    <div className="mx-auto max-w-md rounded-3xl border border-border bg-card p-8 text-center">
      <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/15">
        <Crown className="h-7 w-7 text-primary" aria-hidden="true" />
      </span>
      <h2 className="mt-4 text-xl font-extrabold text-foreground">{title}</h2>
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{description}</p>
      <Button asChild className="mt-6 h-11 rounded-full px-6 font-bold">
        <Link href="/dashboard">
          <LogIn className="mr-2 h-4 w-4" aria-hidden="true" />
          Ke Dashboard Saya
        </Link>
      </Button>
    </div>
  )
}
