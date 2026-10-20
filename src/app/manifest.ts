import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Raja Akun — Marketplace Akun Terlengkap',
    short_name: 'RajaAkun',
    description:
      'Marketplace jual beli akun media sosial, game, dan streaming terlengkap & terpercaya se-Indonesia. Akun murah bergaransi, proses instan, support 24/7.',
    start_url: '/',
    display: 'standalone',
    background_color: '#141210',
    theme_color: '#F0A93C',
    lang: 'id',
    icons: [
      {
        src: '/icon.svg',
        sizes: 'any',
        type: 'image/svg+xml',
        purpose: 'any',
      },
      {
        src: '/icon.svg',
        sizes: 'any',
        type: 'image/svg+xml',
        purpose: 'maskable',
      },
    ],
  }
}
