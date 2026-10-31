import type { Metadata } from 'next'
import { DashboardGuard } from '@/components/pusatakun/dashboard-guard'
import { SellerDashboard } from '@/components/pusatakun/dashboard-seller-page'

/**
 * /dashboard/penjual — Dashboard Penjual (area akun).
 * Tidak diindeks mesin pencari.
 */
export const metadata: Metadata = {
  title: 'Dashboard Penjual — Pusatakun',
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: { index: false, follow: false },
  },
}

export default function SellerDashboardPage() {
  return (
    <DashboardGuard>
      <SellerDashboard />
    </DashboardGuard>
  )
}
