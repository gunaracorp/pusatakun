'use client'

/**
 * PUSATAKUN — Bagian interaktif halaman /produk/[slug]:
 * tombol salin nama produk + grid produk terkait (klik = navigasi halaman).
 */

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Check, Copy, Flame } from 'lucide-react'
import { ProductCard } from './product-card'
import { Reveal } from './motion-primitives'
import type { ProductDTO } from '@/lib/marketplace'

export function CopyNameButton({ name }: { name: string }) {
  const [copied, setCopied] = useState(false)

  async function copy() {
    try {
      await navigator.clipboard.writeText(name)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 1600)
    } catch {
      // clipboard tidak tersedia — abaikan dengan tenang
    }
  }

  return (
    <button
      type="button"
      onClick={copy}
      aria-live="polite"
      className="inline-flex min-h-[44px] w-full items-center justify-center gap-2 rounded-xl border border-primary/40 px-5 text-sm font-bold text-primary transition-colors hover:bg-primary/10"
    >
      {copied ? <Check className="h-4 w-4" aria-hidden="true" /> : <Copy className="h-4 w-4" aria-hidden="true" />}
      {copied ? 'Nama produk tersalin!' : 'Salin nama produk'}
    </button>
  )
}

export function HotBadge() {
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-red-500/15 px-2.5 py-1 text-[10px] font-bold text-red-400">
      <Flame className="h-3 w-3" aria-hidden="true" />
      HOT
    </span>
  )
}

export function RelatedProducts({ products }: { products: ProductDTO[] }) {
  const router = useRouter()

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {products.map((product, i) => (
        <ProductCard
          key={product.id}
          product={product}
          index={i}
          onOpenDetail={(p) => router.push(`/produk/${p.slug}`)}
        />
      ))}
    </div>
  )
}
