import type { Metadata } from 'next'
import { RegisterPage } from '@/components/rajaakun/register-page'
import { SITE } from '@/lib/marketplace'

export const metadata: Metadata = {
  title: 'Daftar Pembeli & Penjual Akun',
  description:
    'Daftar gratis di ' +
    SITE.domain +
    ' lewat WhatsApp: jadi pembeli akun bergaransi atau buka toko penjual akun gratis — kurasi admin 24 jam, komisi transparan.',
  alternates: {
    canonical: '/daftar',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function DaftarPage() {
  return <RegisterPage />
}
