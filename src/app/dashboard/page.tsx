import type { Metadata } from 'next'
import { DashboardGuard } from '@/components/rajaakun/dashboard-guard'
import { BuyerDashboard } from '@/components/rajaakun/dashboard-buyer-page'

/**
 * /dashboard — Dashboard Pembeli (area akun).
 * Tidak diindeks mesin pencari.
 */
export const metadata: Metadata = {
  title: 'Dashboard Pembeli — Raja Akun',
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: { index: false, follow: false },
  },
}

export default function DashboardPage() {
  return (
    <DashboardGuard>
      <BuyerDashboard />
    </DashboardGuard>
  )
}
