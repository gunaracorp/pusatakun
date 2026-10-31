'use client'

/**
 * RAJA AKUN — Shell bersama untuk semua halaman selain beranda & auth.
 * Navbar fixed + main + Footer sticky + utilitas mengambang.
 * Footer menempel di dasar viewport saat konten pendek (mt-auto).
 */

import { useEffect } from 'react'
import type { CategoryDTO } from '@/lib/marketplace'
import { useAuthStore } from '@/store/auth-store'
import { BackToTop } from './back-to-top'
import { FloatingWhatsApp } from './floating-whatsapp'
import { Footer } from './footer'
import { Navbar } from './navbar'

export function PageShell({
  categories,
  children,
}: {
  categories: CategoryDTO[]
  children: React.ReactNode
}) {
  const fetchMe = useAuthStore((s) => s.fetchMe)

  // Sinkronkan sesi login (cookie httpOnly) setelah mount — render awal tetap deterministik.
  useEffect(() => {
    void fetchMe()
  }, [fetchMe])

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer categories={categories} />
      <FloatingWhatsApp />
      <BackToTop />
    </div>
  )
}
