'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowRight, BadgeCheck, Check, Copy, MessageCircle, Package, ShieldCheck, Star, Zap } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { discountPercent, formatCompact, formatIDR, waLink, type ProductDTO } from '@/lib/marketplace'

export function ProductDetailSheet({
  product,
  open,
  onOpenChange,
}: {
  product: ProductDTO | null
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  const [copied, setCopied] = useState(false)

  // Reset copy indicator whenever the sheet is (re)opened — via event handler,
  // not effect, to comply with react-hooks/set-state-in-effect.
  function handleOpenChange(next: boolean) {
    if (next) setCopied(false)
    onOpenChange(next)
  }

  if (!product) return null

  const discount = discountPercent(product.price, product.oldPrice)
  const buyLink = waLink(
    `Halo Admin Pusatakun! Saya mau beli produk "${product.name}" seharga ${formatIDR(product.price)}. Masih ready? Mohon diproses ya.`,
  )

  async function copyName() {
    try {
      await navigator.clipboard.writeText(product!.name)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 1600)
    } catch {
      // clipboard unavailable — silent fail is acceptable for this nicety
    }
  }

  return (
    <Sheet open={open} onOpenChange={handleOpenChange}>
      <SheetContent
        side="right"
        className="glass flex w-full flex-col gap-0 overflow-y-auto border-l border-border bg-background/95 p-0 sm:max-w-md"
      >
        <SheetHeader className="gap-3 border-b border-border p-6 text-left">
          <div className="flex flex-wrap items-center gap-2">
            <Badge className="bg-primary text-primary-foreground">{product.categoryName}</Badge>
            <Badge variant="outline" className="border-primary/30 text-primary">
              {product.level}
            </Badge>
            {discount ? (
              <Badge className="bg-red-500/15 text-red-400 hover:bg-red-500/15">
                Hemat {discount}%
              </Badge>
            ) : null}
          </div>
          <SheetTitle className="text-xl font-extrabold leading-snug text-foreground">
            {product.name}
          </SheetTitle>
          <SheetDescription asChild>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
              <span className="inline-flex items-center gap-1">
                <Star className="h-3.5 w-3.5 fill-primary text-primary" aria-hidden="true" />
                {product.rating.toFixed(1)} / 5.0
              </span>
              <span className="inline-flex items-center gap-1">
                <Zap className="h-3.5 w-3.5 text-primary" aria-hidden="true" />
                Terjual {formatCompact(product.sold)}
              </span>
              <span className="inline-flex items-center gap-1">
                <Package className="h-3.5 w-3.5 text-primary" aria-hidden="true" />
                Stok {product.stock}
              </span>
            </div>
          </SheetDescription>
        </SheetHeader>

        <div className="flex flex-col gap-6 p-6">
          {/* Price block */}
          <div className="rounded-2xl border border-primary/25 bg-primary/10 p-5">
            <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
              Harga Spesial Hari Ini
            </p>
            <div className="mt-1 flex flex-wrap items-baseline gap-3">
              <span className="text-3xl font-black tracking-tight text-primary">
                {formatIDR(product.price)}
              </span>
              {product.oldPrice ? (
                <span className="text-sm text-muted-foreground line-through">
                  {formatIDR(product.oldPrice)}
                </span>
              ) : null}
            </div>
            <p className="mt-2 inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-400">
              <ShieldCheck className="h-4 w-4" aria-hidden="true" />
              {product.warranty}
            </p>
          </div>

          {/* Description */}
          <section aria-label="Deskripsi produk">
            <h3 className="text-sm font-bold uppercase tracking-widest text-foreground">
              Deskripsi
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              {product.description}
            </p>
          </section>

          {/* Specs */}
          <section aria-label="Spesifikasi produk">
            <h3 className="text-sm font-bold uppercase tracking-widest text-foreground">
              Yang Kamu Dapatkan
            </h3>
            <ul className="mt-3 space-y-2.5">
              {product.specs.map((spec) => (
                <li key={spec} className="flex items-start gap-2.5 text-sm text-muted-foreground">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/15">
                    <Check className="h-3 w-3 text-primary" aria-hidden="true" />
                  </span>
                  {spec}
                </li>
              ))}
            </ul>
          </section>

          <Separator className="bg-border" />

          {/* Guarantee row */}
          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="rounded-xl border border-border bg-card/60 p-3">
              <ShieldCheck className="mx-auto h-5 w-5 text-primary" aria-hidden="true" />
              <p className="mt-1.5 text-[11px] font-semibold text-foreground">Garansi Penuh</p>
            </div>
            <div className="rounded-xl border border-border bg-card/60 p-3">
              <Zap className="mx-auto h-5 w-5 text-primary" aria-hidden="true" />
              <p className="mt-1.5 text-[11px] font-semibold text-foreground">Kirim 5-15 Mnt</p>
            </div>
            <div className="rounded-xl border border-border bg-card/60 p-3">
              <BadgeCheck className="mx-auto h-5 w-5 text-primary" aria-hidden="true" />
              <p className="mt-1.5 text-[11px] font-semibold text-foreground">Admin Verified</p>
            </div>
          </div>

          {/* CTAs */}
          <div className="mt-auto flex flex-col gap-3">
            <Button asChild size="lg" className="h-12 rounded-xl text-base font-bold">
              <a href={buyLink} target="_blank" rel="noopener noreferrer">
                <MessageCircle className="h-5 w-5" aria-hidden="true" />
                Beli via WhatsApp
              </a>
            </Button>
            <Link
              href={`/produk/${product.slug}`}
              className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-xl border border-primary/40 px-4 text-sm font-bold text-primary transition-colors hover:bg-primary/10"
            >
              Halaman Produk Lengkap
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
            <Button
              variant="secondary"
              onClick={copyName}
              className="h-11 rounded-xl text-sm font-semibold"
              aria-live="polite"
            >
              <Copy className="h-4 w-4" aria-hidden="true" />
              {copied ? 'Nama produk tersalin!' : 'Salin nama produk'}
            </Button>
            <p className="text-center text-[11px] leading-relaxed text-muted-foreground">
              Dengan membeli, kamu setuju dengan{' '}
              <Link href="/syarat-ketentuan" className="font-semibold text-primary underline-offset-2 hover:underline">
                Syarat &amp; Ketentuan
              </Link>{' '}
              dan{' '}
              <Link href="/garansi" className="font-semibold text-primary underline-offset-2 hover:underline">
                Kebijakan Garansi
              </Link>{' '}
              Pusatakun. Klaim garansi cukup chat admin dengan bukti video penerimaan.
            </p>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
