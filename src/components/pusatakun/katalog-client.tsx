'use client'

/**
 * PUSATAKUN — Klien halaman /katalog:
 * membungkus Catalog (section penuh dgn filter & grid) + sheet detail produk,
 * serta menerapkan filter awal dari query URL (?kategori=slug&q=...).
 */

import { useCallback, useEffect, useState } from 'react'
import { Catalog } from './catalog'
import { ProductDetailSheet } from './product-detail-sheet'
import { useCatalogStore } from '@/store/catalog-store'
import type { CategoryDTO, ProductDTO } from '@/lib/marketplace'

export function KatalogClient({
  categories,
  initialProducts,
  initialTotal,
}: {
  categories: CategoryDTO[]
  initialProducts: ProductDTO[]
  initialTotal: number
}) {
  const [detailProduct, setDetailProduct] = useState<ProductDTO | null>(null)
  const [detailOpen, setDetailOpen] = useState(false)

  const openDetail = useCallback((product: ProductDTO) => {
    setDetailProduct(product)
    setDetailOpen(true)
  }, [])

  // Terapkan filter dari URL (?kategori=slug atau ?q=...) sekali saat mount.
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const q = (params.get('q') ?? '').trim()
    const kategoriSlug = (params.get('kategori') ?? '').trim()
    if (!q && !kategoriSlug) return

    const store = useCatalogStore.getState()
    if (q) store.setQ(q)
    if (kategoriSlug) {
      const match = categories.find((c) => c.slug === kategoriSlug)
      if (match) store.setCategory(match.id)
    }
    // Setelah filter diterapkan, pastikan pengguna melihat area katalog.
    document.getElementById('katalog')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }, [categories])

  return (
    <>
      <h1 className="sr-only">
        Katalog Jual Beli Akun — Instagram, TikTok, YouTube, Game &amp; Streaming Bergaransi
      </h1>
      <Catalog
        categories={categories}
        initialProducts={initialProducts}
        initialTotal={initialTotal}
        onOpenDetail={openDetail}
      />
      <ProductDetailSheet
        product={detailProduct}
        open={detailOpen}
        onOpenChange={setDetailOpen}
      />
    </>
  )
}
