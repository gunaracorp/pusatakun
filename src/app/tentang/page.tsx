import type { Metadata } from 'next'
import { TentangPage } from '@/components/pusatakun/tentang-page'

export const metadata: Metadata = {
  title: 'Tentang Kami',
  description:
    'Kenali Pusatakun (pusatakun.web.id) — marketplace jual beli akun media sosial yang berdiri sejak 2021 di bawah PT Digital Bisnis Manajemen. Misi, nilai, cara kerja kurasi admin, dan komitmen garansi kami.',
  alternates: { canonical: '/tentang' },
  robots: { index: true, follow: true },
}

export default function TentangRoute() {
  return <TentangPage />
}
