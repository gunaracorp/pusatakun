'use client'

import { motion, type Variants } from 'framer-motion'
import {
  BadgePercent,
  Headset,
  Lock,
  ShieldCheck,
  Users,
  Zap,
  type LucideIcon,
} from 'lucide-react'
import { EASE, SectionHeading } from './motion-primitives'

const REASONS: { icon: LucideIcon; title: string; desc: string }[] = [
  {
    icon: ShieldCheck,
    title: 'Garansi 100% Bergaransi Penuh',
    desc: 'Setiap akun dikurasi ketat. Bermasalah? Ganti baru atau refund 100% dalam 1x24 jam.',
  },
  {
    icon: Zap,
    title: 'Pengiriman Instan',
    desc: 'Sistem otomatis 24 jam. Rata-rata akun terkirim 5–15 menit setelah pembayaran.',
  },
  {
    icon: Headset,
    title: 'Support 24/7 Nonstop',
    desc: 'Tim CS manusia asli siap membantu kapan pun, bahkan tengah malam.',
  },
  {
    icon: BadgePercent,
    title: 'Harga Termurah',
    desc: 'Harga langsung dari supplier. Sama atau lebih murah? Kami kembalikan selisihnya.',
  },
  {
    icon: Lock,
    title: '100% Aman & Privat',
    desc: 'Data pembeli terenkripsi. Transaksi rahasia, tanpa data dibagikan.',
  },
  {
    icon: Users,
    title: 'Komunitas 10.000+',
    desc: 'Ribuan reseller & pembeli aktif. Testimoni asli bisa dicek kapan saja.',
  },
]

const gridVariants: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
}

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE } },
}

export function WhyUs() {
  return (
    <section id="keunggulan" className="scroll-mt-28 py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          kicker="Kenapa Raja Akun"
          title="Alasan Jutaan Orang"
          highlight="Percaya Kami"
          subtitle="Ribuan reseller & pembeli memilih Raja Akun setiap hari — ini alasannya."
        />

        <motion.div
          variants={gridVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-80px' }}
          className="grid gap-4 md:grid-cols-2 lg:grid-cols-3"
        >
          {REASONS.map((reason) => (
            <motion.article
              key={reason.title}
              variants={cardVariants}
              whileHover={{ y: -6 }}
              className="card-glow glass group rounded-2xl p-6"
            >
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary ring-1 ring-primary/40 transition-transform duration-500 group-hover:rotate-12 group-hover:scale-110">
                <reason.icon className="h-5 w-5" aria-hidden="true" />
              </span>
              <h3 className="mt-4 font-bold text-foreground">{reason.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{reason.desc}</p>
            </motion.article>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
