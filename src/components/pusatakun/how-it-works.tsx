'use client'

import { motion, type Variants } from 'framer-motion'
import {
  MessageCircle,
  MousePointerClick,
  Send,
  Wallet,
  type LucideIcon,
} from 'lucide-react'
import { EASE, SectionHeading } from './motion-primitives'

const STEPS: { num: string; icon: LucideIcon; title: string; desc: string }[] = [
  {
    num: '01',
    icon: MousePointerClick,
    title: 'Pilih Akun',
    desc: 'Telusuri katalog, filter sesuai kebutuhan & budget kamu.',
  },
  {
    num: '02',
    icon: MessageCircle,
    title: 'Chat Admin',
    desc: 'Klik tombol Beli — admin balas kurang dari 2 menit.',
  },
  {
    num: '03',
    icon: Wallet,
    title: 'Pembayaran',
    desc: 'QRIS, transfer bank, atau e-wallet. Terkonfirmasi otomatis.',
  },
  {
    num: '04',
    icon: Send,
    title: 'Akun Terkirim',
    desc: 'Data lengkap masuk WhatsApp kamu dalam 5–15 menit. Garansi aktif.',
  },
]

const gridVariants: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
}

const stepVariants: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE } },
}

export function HowItWorks() {
  return (
    <section id="cara-kerja" className="scroll-mt-28 py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          kicker="Cara Kerja"
          title="Beli Akun Semudah"
          highlight="4 Langkah"
          subtitle="Dari memilih sampai akun masuk WhatsApp — semuanya di bawah 15 menit."
        />

        <div className="relative">
          {/* Animated connector line (desktop) */}
          <motion.div
            aria-hidden="true"
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 1.2, ease: EASE, delay: 0.3 }}
            className="absolute inset-x-0 top-[52px] hidden h-px origin-left bg-gradient-to-r from-transparent via-primary/40 to-transparent lg:block"
          />

          <motion.ol
            variants={gridVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: '-80px' }}
            className="relative grid gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6"
          >
            {STEPS.map((step) => (
              <motion.li
                key={step.num}
                variants={stepVariants}
                className="flex flex-col items-center text-center lg:items-start lg:text-left"
              >
                <div className="glass relative flex h-20 w-20 items-center justify-center rounded-full">
                  <span className="text-gradient-gold text-3xl font-black">{step.num}</span>
                  <span className="absolute -right-1 -top-1 flex h-7 w-7 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg shadow-primary/30">
                    <step.icon className="h-3.5 w-3.5" aria-hidden="true" />
                  </span>
                </div>
                <h3 className="mt-5 text-lg font-bold text-foreground">{step.title}</h3>
                <p className="mt-2 max-w-xs text-sm leading-relaxed text-muted-foreground">
                  {step.desc}
                </p>
              </motion.li>
            ))}
          </motion.ol>
        </div>
      </div>
    </section>
  )
}
