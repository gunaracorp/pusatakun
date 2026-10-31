import type { Metadata } from 'next'
import { DashboardGuard } from '@/components/rajaakun/dashboard-guard'
import { OwnerDashboard } from '@/components/rajaakun/dashboard-owner-page'

/**
 * /dashboard/admin — Pusat Komando Pemilik (khusus ADMIN).
 * Tidak diindeks mesin pencari.
 */
export const metadata: Metadata = {
  title: 'Dashboard Pemilik — Raja Akun',
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: { index: false, follow: false },
  },
}

export default function OwnerDashboardPage() {
  return (
    <DashboardGuard>
      <OwnerDashboard />
    </DashboardGuard>
  )
}
