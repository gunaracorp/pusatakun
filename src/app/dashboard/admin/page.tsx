import type { Metadata } from 'next'
import { DashboardGuard } from '@/components/pusatakun/dashboard-guard'
import { OwnerDashboard } from '@/components/pusatakun/dashboard-owner-page'

/**
 * /dashboard/admin — Pusat Komando Pemilik (khusus ADMIN).
 * Tidak diindeks mesin pencari.
 */
export const metadata: Metadata = {
  title: 'Dashboard Pemilik — Pusatakun',
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
