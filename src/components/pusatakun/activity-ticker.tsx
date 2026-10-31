'use client'

import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { BadgeCheck, CheckCircle2, X } from 'lucide-react'
import { EASE } from './motion-primitives'

/** Deterministic fake purchase feed — no Math.random()/Date.now() to avoid hydration mismatch. */
const TICKER_ITEMS = [
  { name: 'Rizk***', product: 'Akun IG Aman 1K', minutes: '2 menit lalu' },
  { name: 'Sint***', product: 'Netflix Premium 4K', minutes: '5 menit lalu' },
  { name: 'Andi***', product: 'TikTok Fresh', minutes: '8 menit lalu' },
  { name: 'Maya***', product: 'Gmail PVA', minutes: '11 menit lalu' },
  { name: 'Faj***', product: 'Akun FB Aman 5K', minutes: '14 menit lalu' },
  { name: 'Lin***', product: 'Discord Token Aged', minutes: '18 menit lalu' },
  { name: 'Bay***', product: 'Spotify Premium 1 Tahun', minutes: '23 menit lalu' },
  { name: 'Rin***', product: 'Shopee Level 3', minutes: '27 menit lalu' },
]

const TICKER_INTERVAL_MS = 7000

export function ActivityTicker() {
  const [visible, setVisible] = useState(true)
  const [index, setIndex] = useState(0)

  useEffect(() => {
    if (!visible) return
    const id = window.setInterval(() => {
      setIndex((prev) => (prev + 1) % TICKER_ITEMS.length)
    }, TICKER_INTERVAL_MS)
    return () => window.clearInterval(id)
  }, [visible])

  const current = TICKER_ITEMS[index]

  return (
    <aside
      aria-live="polite"
      className="fixed bottom-4 left-4 z-40 hidden max-w-xs sm:block"
    >
      <AnimatePresence mode="wait">
        {visible && (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -24 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -24 }}
            transition={{ duration: 0.45, ease: EASE }}
            className="glass relative rounded-xl border-primary/20 p-3 pr-9 shadow-xl"
          >
            <div className="flex items-start gap-2.5">
              <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-primary" aria-hidden="true" />
              <div className="min-w-0">
                <p className="text-xs font-medium text-foreground">
                  <span className="font-bold">{current.name}</span> baru beli{' '}
                  <span className="font-semibold text-primary">{current.product}</span>
                </p>
                <p className="mt-1 flex items-center gap-1 text-[11px] text-muted-foreground">
                  {current.minutes}
                  <span aria-hidden="true">•</span>
                  <BadgeCheck className="h-3.5 w-3.5 text-primary" aria-hidden="true" />
                  Terverifikasi
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setVisible(false)}
              aria-label="Tutup notifikasi pembelian"
              className="absolute right-1.5 top-1.5 flex h-8 w-8 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-primary/10 hover:text-foreground"
            >
              <X className="h-3.5 w-3.5" aria-hidden="true" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </aside>
  )
}
