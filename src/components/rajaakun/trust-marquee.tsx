'use client'

import type { CSSProperties } from 'react'
import {
  BadgePercent,
  CalendarCheck,
  Database,
  Headset,
  RefreshCcw,
  ShieldCheck,
  Users,
  Zap,
  type LucideIcon,
} from 'lucide-react'

const FEATURES: { icon: LucideIcon; label: string }[] = [
  { icon: ShieldCheck, label: 'Garansi 100% Aman' },
  { icon: Zap, label: 'Pengiriman Instan 5–15 Menit' },
  { icon: Headset, label: 'Support 24/7' },
  { icon: BadgePercent, label: 'Harga Termurah' },
  { icon: RefreshCcw, label: 'Refund 100%' },
  { icon: Users, label: '10.000+ Pelanggan' },
  { icon: Database, label: 'Data Login Lengkap' },
  { icon: CalendarCheck, label: 'Restock Setiap Hari' },
]

const PLATFORMS = [
  'Instagram',
  'TikTok',
  'YouTube',
  'Facebook',
  'X (Twitter)',
  'Telegram',
  'WhatsApp',
  'Gmail',
  'Netflix',
  'Spotify',
  'Disney+ Hotstar',
  'Mobile Legends',
  'Free Fire',
  'Genshin Impact',
  'Valorant',
  'Shopee',
]

function FeatureRow({ hidden = false }: { hidden?: boolean }) {
  return (
    <div aria-hidden={hidden || undefined} className="flex shrink-0 items-center">
      {FEATURES.map((feature) => (
        <span
          key={feature.label}
          className="mx-6 inline-flex items-center gap-2.5 whitespace-nowrap text-sm font-medium text-foreground/90"
        >
          <feature.icon className="h-4 w-4 text-primary" aria-hidden="true" />
          {feature.label}
        </span>
      ))}
    </div>
  )
}

function PlatformRow({ hidden = false }: { hidden?: boolean }) {
  return (
    <div aria-hidden={hidden || undefined} className="flex shrink-0 items-center">
      {PLATFORMS.map((platform) => (
        <span key={platform} className="inline-flex items-center whitespace-nowrap">
          <span className="text-sm font-medium text-muted-foreground">{platform}</span>
          <span aria-hidden="true" className="mx-6 h-1.5 w-1.5 rotate-45 bg-primary/60" />
        </span>
      ))}
    </div>
  )
}

export function TrustMarquee() {
  return (
    <section
      id="keunggulan-strip"
      aria-label="Keunggulan layanan dan platform yang tersedia"
      className="scroll-mt-28 border-y border-border bg-card/50"
    >
      {/* Row 1 — selling points */}
      <div className="marquee-hover-pause mask-fade-x overflow-hidden py-4">
        <div
          className="marquee-track"
          style={{ '--marquee-duration': '36s' } as CSSProperties}
        >
          <FeatureRow />
          <FeatureRow hidden />
        </div>
      </div>

      {/* Row 2 — platforms */}
      <div className="marquee-hover-pause mask-fade-x overflow-hidden border-t border-border/60 py-4">
        <div
          className="marquee-track marquee-reverse"
          style={{ '--marquee-duration': '40s' } as CSSProperties}
        >
          <PlatformRow />
          <PlatformRow hidden />
        </div>
      </div>
    </section>
  )
}
