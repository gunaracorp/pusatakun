'use client'

import { motion, type Variants } from 'framer-motion'
import {
  ArrowRight,
  Clapperboard,
  Facebook,
  Gamepad2,
  Instagram,
  Linkedin,
  Mail,
  MessageCircle,
  Music,
  Send,
  ShoppingBag,
  Sparkles,
  Swords,
  Twitter,
  Youtube,
  type LucideIcon,
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { formatCompact, waLink, type CategoryDTO } from '@/lib/marketplace'
import { EASE, Reveal, SectionHeading } from './motion-primitives'

/** Maps DB icon keys (and friendly aliases) to lucide components. */
const ICON_MAP: Record<string, LucideIcon> = {
  instagram: Instagram,
  tiktok: Music,
  music: Music,
  youtube: Youtube,
  facebook: Facebook,
  twitter: Twitter,
  telegram: Send,
  send: Send,
  whatsapp: MessageCircle,
  'message-circle': MessageCircle,
  email: Mail,
  mail: Mail,
  linkedin: Linkedin,
  discord: Gamepad2,
  'gamepad-2': Gamepad2,
  game: Swords,
  swords: Swords,
  streaming: Clapperboard,
  clapperboard: Clapperboard,
  marketplace: ShoppingBag,
  'shopping-bag': ShoppingBag,
  lainnya: Sparkles,
  sparkles: Sparkles,
}

function resolveIcon(iconKey: string): LucideIcon {
  return ICON_MAP[iconKey] ?? Sparkles
}

const gridVariants: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06 } },
}

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: EASE } },
}

export function CategoriesSection({
  categories,
  onSelect,
}: {
  categories: CategoryDTO[]
  onSelect: (categoryId: string) => void
}) {
  return (
    <section id="kategori" className="scroll-mt-28 py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          kicker="Kategori Lengkap"
          title="Semua Jenis Akun"
          highlight="Dalam Satu Raja"
          subtitle="Dari media sosial sampai game & streaming — 100+ jenis akun siap kirim instan."
        />

        <motion.div
          variants={gridVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-80px' }}
          className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
          role="list"
        >
          {categories.map((category) => {
            const Icon = resolveIcon(category.icon)
            return (
              <motion.div key={category.id} variants={cardVariants} role="listitem">
                <motion.button
                  type="button"
                  whileHover={{ y: -6 }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ duration: 0.35, ease: EASE }}
                  onClick={() => onSelect(category.id)}
                  aria-label={`Lihat ${category.productCount} produk kategori ${category.name}`}
                  className="card-glow glass group flex min-h-[112px] w-full flex-col items-start gap-4 rounded-2xl p-5 text-left"
                >
                  <div className="flex w-full items-start justify-between gap-3">
                    <span
                      className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br text-white shadow-lg transition-transform duration-300 group-hover:scale-110 ${category.gradient}`}
                    >
                      <Icon className="h-5 w-5" aria-hidden="true" />
                    </span>
                    <Badge variant="secondary" className="rounded-full">
                      {formatCompact(category.productCount)} produk
                    </Badge>
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-bold text-foreground transition-colors group-hover:text-primary">
                      {category.name}
                    </h3>
                    <p className="mt-0.5 line-clamp-1 text-xs text-muted-foreground">
                      {category.tagline}
                    </p>
                  </div>
                </motion.button>
              </motion.div>
            )
          })}
        </motion.div>

        <Reveal delay={0.15} className="mt-8 text-center">
          <a
            href={waLink('Halo Admin Raja Akun, saya cari akun custom. Bisa dibantu?')}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-[44px] items-center justify-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            Belum menemukan? <span className="font-semibold text-foreground">Chat admin</span>
            — akun custom bisa di-request
            <ArrowRight className="h-4 w-4 text-primary" aria-hidden="true" />
          </a>
        </Reveal>
      </div>
    </section>
  )
}
