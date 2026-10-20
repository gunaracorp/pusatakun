import type { Metadata } from 'next'
import { AdminPage } from '@/components/rajaakun/admin-page'

/**
 * Halaman PANEL ADMIN — area internal.
 * Tidak diindeks & tidak ditautkan dari mesin pencari.
 */
export const metadata: Metadata = {
  title: 'Panel Admin',
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: {
      index: false,
      follow: false,
    },
  },
}

export default function AdminDashboardLoginPage() {
  return <AdminPage />
}
