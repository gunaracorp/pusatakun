'use client'

import { useSyncExternalStore } from 'react'
import { Clock, Crown, Instagram, Mail, MapPin, MessageCircle } from 'lucide-react'
import { SITE, waLink, type CategoryDTO } from '@/lib/marketplace'

const NAV_LINKS = [
  { label: 'Katalog', href: '#katalog' },
  { label: 'Cara Kerja', href: '#cara-kerja' },
  { label: 'Testimoni', href: '#testimoni' },
  { label: 'FAQ', href: '#faq' },
  { label: 'Keunggulan', href: '#keunggulan' },
]

const SOCIALS = [
  {
    label: 'Instagram Raja Akun',
    href: `https://instagram.com/${SITE.instagramHandle.replace('@', '')}`,
    icon: Instagram,
  },
  {
    label: 'WhatsApp Admin',
    href: waLink('Halo Admin Raja Akun!'),
    icon: MessageCircle,
  },
  {
    label: 'Email Support',
    href: `mailto:${SITE.email}`,
    icon: Mail,
  },
]

// ---- Hydration-safe current year (no setState-in-effect) ----
const subscribeNoop = () => () => {}
const getYear = () => new Date().getFullYear()
const getServerYear = () => 2025

export function Footer({ categories }: { categories: CategoryDTO[] }) {
  // Hydration-safe dynamic year: server snapshot is fixed (2025),
  // client snapshot resolves after mount without setState-in-effect.
  const year = useSyncExternalStore(subscribeNoop, getYear, getServerYear)

  function goToKategori() {
    document.getElementById('kategori')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <footer className="mt-auto border-t border-border bg-card/30">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div>
            <a href="#beranda" className="inline-flex min-h-[44px] items-center gap-3" aria-label="Raja Akun — beranda">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary shadow-lg shadow-primary/25">
                <Crown className="h-5 w-5 text-primary-foreground" aria-hidden="true" />
              </span>
              <span className="flex flex-col leading-none">
                <span className="text-lg font-extrabold tracking-tight text-foreground">
                  Raja<span className="text-gradient-gold">Akun</span>
                </span>
                <span className="mt-1 text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                  {SITE.domain}
                </span>
              </span>
            </a>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted-foreground">
              Marketplace jual beli akun media sosial, game & streaming terlengkap
              se-Indonesia. Garansi penuh, pengiriman instan, support 24/7.
            </p>
            <div className="mt-5 flex items-center gap-2">
              {SOCIALS.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  className="glass flex h-11 w-11 items-center justify-center rounded-full text-muted-foreground transition-all hover:scale-105 hover:text-primary"
                >
                  <social.icon className="h-4.5 w-4.5" aria-hidden="true" />
                </a>
              ))}
            </div>
          </div>

          {/* Popular categories */}
          <nav aria-label="Kategori populer">
            <h3 className="text-sm font-bold uppercase tracking-widest text-foreground">
              Kategori Populer
            </h3>
            <ul className="mt-4 space-y-1">
              {categories.slice(0, 8).map((category) => (
                <li key={category.id}>
                  <button
                    type="button"
                    onClick={goToKategori}
                    className="inline-flex min-h-[36px] items-center text-sm text-muted-foreground transition-colors hover:text-primary"
                  >
                    {category.name}
                  </button>
                </li>
              ))}
            </ul>
          </nav>

          {/* Navigation */}
          <nav aria-label="Navigasi footer">
            <h3 className="text-sm font-bold uppercase tracking-widest text-foreground">
              Navigasi
            </h3>
            <ul className="mt-4 space-y-1">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="inline-flex min-h-[36px] items-center text-sm text-muted-foreground transition-colors hover:text-primary"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          {/* Contact */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-widest text-foreground">
              Hubungi Kami
            </h3>
            <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
              <li>
                <a
                  href={waLink('Halo Admin Raja Akun!')}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-[36px] items-center gap-2.5 transition-colors hover:text-primary"
                >
                  <MessageCircle className="h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
                  WhatsApp {SITE.whatsappDisplay}
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${SITE.email}`}
                  className="inline-flex min-h-[36px] items-center gap-2.5 transition-colors hover:text-primary"
                >
                  <Mail className="h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
                  {SITE.email}
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <Clock className="h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
                Online 24/7
              </li>
              <li className="flex items-center gap-2.5">
                <MapPin className="h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
                Jakarta, Indonesia
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 flex flex-col items-center justify-between gap-3 border-t border-border pt-6 text-xs text-muted-foreground sm:flex-row">
          <p>© {year} Raja Akun — {SITE.domain}. Seluruh hak cipta.</p>
          <p className="font-semibold text-primary/80">{SITE.tagline}</p>
        </div>
      </div>
    </footer>
  )
}
