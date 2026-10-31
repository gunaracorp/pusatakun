'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { Flame, ShieldCheck, Star, Zap } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { discountPercent, formatCompact, formatIDR, waLink, type ProductDTO } from '@/lib/marketplace'
import { EASE } from './motion-primitives'

const LEVEL_STYLES: Record<string, string> = {
  FRESH: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/25',
  AMAN: 'bg-amber-500/15 text-amber-400 border-amber-500/25',
  PREMIUM: 'bg-violet-500/15 text-violet-300 border-violet-500/25',
  MONETIZE: 'bg-rose-500/15 text-rose-400 border-rose-500/25',
}

function stockTone(stock: number, total: number): { bar: string; text: string } {
  const ratio = total > 0 ? stock / total : 0
  if (ratio > 0.5) return { bar: 'bg-emerald-500', text: 'text-emerald-400' }
  if (ratio > 0.2) return { bar: 'bg-amber-500', text: 'text-amber-400' }
  return { bar: 'bg-rose-500', text: 'text-rose-400' }
}

export function ProductCard({
  product,
  index,
  onOpenDetail,
}: {
  product: ProductDTO
  index: number
  onOpenDetail: (product: ProductDTO) => void
}) {
  const discount = discountPercent(product.price, product.oldPrice)
  const tone = stockTone(product.stock, product.totalStock)
  const buyLink = waLink(
    `Halo Admin Raja Akun! Saya mau beli produk "${product.name}" seharga ${formatIDR(product.price)}. Masih ready?`,
  )

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{ duration: 0.45, ease: EASE, delay: Math.min(index * 0.04, 0.4) }}
      whileHover={{ y: -6 }}
      id={`produk-${product.slug}`}
      className="h-full scroll-mt-28"
    >
      <Card className="glass card-glow flex h-full flex-col gap-3 rounded-2xl p-5">
        {/* Top badges */}
        <div className="flex items-center justify-between gap-2">
          <span
            className={`inline-flex items-center rounded-full border px-2.5 py-1 text-[10px] font-bold tracking-wider ${LEVEL_STYLES[product.level] ?? 'bg-secondary text-secondary-foreground border-border'}`}
          >
            {product.level}
          </span>
          <div className="flex items-center gap-1.5">
            {product.hot ? (
              <span className="inline-flex items-center gap-1 rounded-full bg-red-500/15 px-2.5 py-1 text-[10px] font-bold text-red-400">
                <Flame className="h-3 w-3" aria-hidden="true" />
                HOT
              </span>
            ) : null}
            {discount ? (
              <span className="inline-flex items-center rounded-full bg-primary px-2.5 py-1 text-[10px] font-bold text-primary-foreground">
                -{discount}%
              </span>
            ) : null}
          </div>
        </div>

        {/* Title & meta */}
        <div className="flex-1">
          <h3 className="line-clamp-2 min-h-[2.5rem] text-sm font-bold leading-snug text-foreground">
            <Link
              href={`/produk/${product.slug}`}
              className="transition-colors hover:text-primary"
              aria-label={`Lihat halaman lengkap ${product.name}`}
            >
              {product.name}
            </Link>
          </h3>
          <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-muted-foreground">
            <span className="font-medium text-primary/90">{product.categoryName}</span>
            <span className="inline-flex items-center gap-1">
              <ShieldCheck className="h-3 w-3 text-primary" aria-hidden="true" />
              {product.warranty}
            </span>
          </div>
          <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-muted-foreground">
            {product.description}
          </p>
        </div>

        {/* Stock scarcity */}
        <div>
          <div className="flex items-center justify-between text-[11px]">
            <span className="text-muted-foreground">Stok tersisa</span>
            <span className={`font-bold ${tone.text}`}>{product.stock}</span>
          </div>
          <div
            className="mt-1 h-1.5 overflow-hidden rounded-full bg-secondary"
            role="progressbar"
            aria-valuenow={product.stock}
            aria-valuemin={0}
            aria-valuemax={product.totalStock}
            aria-label={`Sisa stok ${product.stock} dari ${product.totalStock}`}
          >
            <div
              className={`h-full rounded-full ${tone.bar} transition-all duration-700`}
              style={{ width: `${Math.max(4, Math.round((product.stock / Math.max(product.totalStock, 1)) * 100))}%` }}
            />
          </div>
        </div>

        {/* Rating & sold */}
        <div className="flex items-center gap-3 text-[11px] text-muted-foreground">
          <span className="inline-flex items-center gap-1 font-semibold text-foreground">
            <Star className="h-3.5 w-3.5 fill-primary text-primary" aria-hidden="true" />
            {product.rating.toFixed(1)}
          </span>
          <span className="inline-flex items-center gap-1">
            <Zap className="h-3 w-3 text-primary" aria-hidden="true" />
            Terjual {formatCompact(product.sold)}
          </span>
        </div>

        {/* Price */}
        <div className="border-t border-border pt-3">
          <div className="flex items-end justify-between gap-2">
            <div>
              <p className="text-lg font-extrabold tracking-tight text-primary">
                {formatIDR(product.price)}
              </p>
              {product.oldPrice ? (
                <p className="text-xs text-muted-foreground line-through">
                  {formatIDR(product.oldPrice)}
                </p>
              ) : null}
            </div>
          </div>
          <div className="mt-3 flex gap-2">
            <Button
              asChild
              size="sm"
              className="h-10 min-h-[44px] flex-1 rounded-xl text-sm font-semibold"
            >
              <a href={buyLink} target="_blank" rel="noopener noreferrer" aria-label={`Beli ${product.name} via WhatsApp`}>
                Beli
              </a>
            </Button>
            <Button
              size="sm"
              variant="secondary"
              onClick={() => onOpenDetail(product)}
              className="h-10 min-h-[44px] flex-1 rounded-xl text-sm font-semibold"
              aria-label={`Lihat detail ${product.name}`}
            >
              Detail
            </Button>
          </div>
        </div>
      </Card>
    </motion.article>
  )
}
