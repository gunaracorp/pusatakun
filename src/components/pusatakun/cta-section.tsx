'use client'

import { motion } from 'framer-motion'
import { Crown, Headset, MessageCircle, ShieldCheck, Zap } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { waLink } from '@/lib/marketplace'
import { EASE, Reveal } from './motion-primitives'

const TRUST_CHIPS = [
  { icon: ShieldCheck, label: 'Garansi 100%' },
  { icon: Zap, label: 'Instan 5–15 Menit' },
  { icon: Headset, label: 'Support 24/7' },
]

export function CtaSection() {
  function goToKatalog() {
    document.getElementById('katalog')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section id="kontak" className="scroll-mt-28 py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal>
          <div className="relative overflow-hidden rounded-3xl border border-primary/20 bg-royal-glow p-8 text-center sm:p-16">
            {/* Decorative conic rings */}
            <div
              aria-hidden="true"
              className="conic-ring absolute -left-32 -top-32 h-96 w-96 rounded-full opacity-40 blur-2xl"
            />
            <div
              aria-hidden="true"
              className="conic-ring absolute -bottom-32 -right-32 h-96 w-96 rounded-full opacity-30 blur-2xl"
              style={{ animationDirection: 'reverse' }}
            />

            <div className="relative">
              <motion.div
                aria-hidden="true"
                initial={{ opacity: 0, scale: 0.6 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, margin: '-80px' }}
                transition={{ duration: 0.7, ease: EASE }}
                className="animate-float mx-auto mb-8 flex h-20 w-20 items-center justify-center rounded-2xl bg-primary/15 ring-1 ring-primary/40"
              >
                <Crown className="h-10 w-10 text-primary" />
              </motion.div>

              <h2 className="text-3xl font-black tracking-tight text-foreground sm:text-5xl">
                Siap Punya Akun Impianmu <span className="text-gradient-gold">Hari Ini Juga?</span>
              </h2>

              <p className="mx-auto mt-5 max-w-2xl text-base text-muted-foreground sm:text-lg">
                Klik tombol di bawah — admin langsung membalas dengan katalog terbaru dan
                rekomendasi akun terbaik sesuai budget kamu.
              </p>

              <div className="mt-9 flex flex-col items-center justify-center gap-4 sm:flex-row">
                <Button
                  asChild
                  size="lg"
                  className="animate-pulse-glow h-14 rounded-full px-8 text-base font-bold"
                >
                  <a
                    href={waLink('Halo Admin Pusatakun! Saya siap beli. Mohon diproses ya.')}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <MessageCircle className="h-5 w-5" aria-hidden="true" />
                    Chat Admin via WhatsApp
                  </a>
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  onClick={goToKatalog}
                  className="glass h-14 rounded-full px-8 text-base font-semibold"
                >
                  Lihat Katalog Lagi
                </Button>
              </div>

              <ul className="mt-10 flex flex-wrap items-center justify-center gap-3">
                {TRUST_CHIPS.map((chip) => (
                  <li
                    key={chip.label}
                    className="glass inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-medium text-foreground/90"
                  >
                    <chip.icon className="h-4 w-4 text-primary" aria-hidden="true" />
                    {chip.label}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
