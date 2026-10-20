import type { Metadata } from 'next'
import { LoginPage } from '@/components/rajaakun/login-page'
import { SITE } from '@/lib/marketplace'

export const metadata: Metadata = {
  title: 'Masuk dengan WhatsApp',
  description:
    'Masuk ke Raja Akun dengan nomor WhatsApp — kode verifikasi 6 digit instan, tanpa kata sandi. Satu akun untuk beli & jual akun media sosial bergaransi di ' +
    SITE.domain +
    '.',
  alternates: {
    canonical: '/masuk',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function MasukPage() {
  return <LoginPage />
}
