'use client'

import Link from 'next/link'
import { ArrowUpRight, Clock, Crown, Mail, MapPin, MessageCircle } from 'lucide-react'
import { SITE, waLink, type CategoryDTO } from '@/lib/marketplace'
import { useCurrentYear } from '@/lib/use-current-year'

const NAV_LINKS = [
  { label: 'Beranda', href: '/' },
  { label: 'Katalog Akun', href: '/katalog' },
  { label: 'Dashboard Akun', href: '/dashboard' },
  { label: 'Tentang Kami', href: '/tentang' },
  { label: 'Pusat Bantuan', href: '/pusat-bantuan' },
  { label: 'Kontak', href: '/kontak' },
  { label: 'Cara Kerja', href: '/#cara-kerja' },
  { label: 'Testimoni', href: '/#testimoni' },
]

const LEGAL_LINKS = [
  { label: 'Syarat & Ketentuan', href: '/syarat-ketentuan' },
  { label: 'Kebijakan Privasi', href: '/kebijakan-privasi' },
  { label: 'Kebijakan Garansi & Pengembalian', href: '/garansi' },
]

export function Footer({ categories }: { categories: CategoryDTO[] }) {
  const year = useCurrentYear()

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
            <p className="mt-3 text-xs text-muted-foreground">
              Sebuah layanan dari{' '}
              <a
                href={SITE.companySite}
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-foreground/80 transition-colors hover:text-primary"
              >
                {SITE.company}
              </a>
            </p>

            {/* Sosial media resmi (entity SEO: rel=me) */}
            <nav aria-label="Sosial media resmi" className="mt-5">
              <h3 className="text-[10px] font-bold uppercase tracking-[0.25em] text-muted-foreground/70">
                Sosial Media
              </h3>
              <ul className="mt-2.5 flex flex-wrap gap-1.5">
                {SITE.socials.map((social) => (
                  <li key={social.id}>
                    <a
                      href={social.url}
                      target="_blank"
                      rel="me noopener noreferrer"
                      aria-label={`${social.label} — ${social.handle}`}
                      className="inline-flex min-h-[32px] items-center gap-1 rounded-full border border-border/70 px-2.5 text-[11px] font-semibold text-muted-foreground transition-all hover:border-primary/50 hover:text-primary"
                    >
                      {social.label}
                      <ArrowUpRight className="h-3 w-3 opacity-60" aria-hidden="true" />
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
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

          {/* Navigasi */}
          <nav aria-label="Navigasi footer">
            <h3 className="text-sm font-bold uppercase tracking-widest text-foreground">
              Jelajah
            </h3>
            <ul className="mt-4 space-y-1">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="inline-flex min-h-[36px] items-center text-sm text-muted-foreground transition-colors hover:text-primary"
                  >
                    {link.label}
                  </Link>
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
              <li className="flex items-start gap-2.5">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
                <span className="leading-relaxed">{SITE.address}</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 space-y-3 border-t border-border pt-6">
          <div className="flex flex-col items-center justify-between gap-3 text-xs text-muted-foreground sm:flex-row">
            <p>© {year} Raja Akun — {SITE.domain} · {SITE.company}</p>
            <p className="font-semibold text-primary/80">{SITE.tagline}</p>
          </div>
          {/* Tautan legal (standar internasional) */}
          <nav aria-label="Tautan legal" className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2">
            {LEGAL_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="inline-flex min-h-[32px] items-center text-[11px] font-semibold text-muted-foreground underline-offset-4 transition-colors hover:text-primary hover:underline"
              >
                {link.label}
              </Link>
            ))}
          </nav>
          {/* Baris kredit sistem (branding internal — halus & crawlable) */}
          <p className="text-center text-[11px] leading-relaxed text-muted-foreground/60">
            Support system oleh{' '}
            <a
              href={SITE.companySupportSite}
              target="_blank"
              rel="noopener noreferrer"
              className="underline decoration-border underline-offset-2 transition-colors hover:text-muted-foreground"
            >
              {SITE.companySupport}
            </a>{' '}
            ({SITE.companySupportSite.replace('https://', '')}) · Sistem dikurangi {SITE.founder} —{' '}
            {SITE.founderAlias} · {SITE.founderHandles.join(' & ')}
          </p>
        </div>
      </div>
    </footer>
  )
}
