import type { Metadata, Viewport } from 'next'
import { Geist_Mono, Plus_Jakarta_Sans } from 'next/font/google'
import './globals.css'
import { Toaster } from '@/components/ui/toaster'
import { buildHomeMetadata } from '@/lib/seo'

const jakarta = Plus_Jakarta_Sans({
  variable: '--font-jakarta',
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export const metadata: Metadata = buildHomeMetadata()

export const viewport: Viewport = {
  themeColor: '#F0A93C',
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" suppressHydrationWarning data-scroll-behavior="smooth">
      <body
        className={`${jakarta.variable} ${geistMono.variable} antialiased bg-background text-foreground font-sans`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
