'use client'

import { motion } from 'framer-motion'
import { MessageCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { waLink } from '@/lib/marketplace'
import { EASE } from './motion-primitives'

export function FloatingWhatsApp() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.5, y: 16 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ delay: 1.2, duration: 0.5, ease: EASE }}
      className="fixed bottom-5 right-5 z-50"
    >
      <Button
        asChild
        className="animate-pulse-glow relative h-14 w-14 rounded-full shadow-2xl"
      >
        <a
          href={waLink('Halo Admin Pusatakun! Saya mau tanya akun.')}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Chat WhatsApp Admin"
        >
          <span
            aria-hidden="true"
            className="animate-ping absolute inset-0 rounded-full bg-primary/40"
          />
          <MessageCircle
            className="relative h-6 w-6"
            aria-hidden="true"
          />
        </a>
      </Button>
    </motion.div>
  )
}
