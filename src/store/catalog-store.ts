'use client'

import { create } from 'zustand'
import type { SortOption } from '@/lib/marketplace'

type CatalogState = {
  q: string
  category: string // 'semua' | CategoryDTO.id
  level: string // 'Semua' | 'FRESH' | 'AMAN' | 'PREMIUM' | 'MONETIZE'
  priceIdx: number // -1 = semua harga, else index of PRICE_RANGES
  sort: SortOption
  setQ: (q: string) => void
  setCategory: (category: string) => void
  setLevel: (level: string) => void
  setPriceIdx: (priceIdx: number) => void
  setSort: (sort: SortOption) => void
  reset: () => void
}

export const useCatalogStore = create<CatalogState>((set) => ({
  q: '',
  category: 'semua',
  level: 'Semua',
  priceIdx: -1,
  sort: 'populer',
  setQ: (q) => set({ q }),
  setCategory: (category) => set({ category }),
  setLevel: (level) => set({ level }),
  setPriceIdx: (priceIdx) => set({ priceIdx }),
  setSort: (sort) => set({ sort }),
  reset: () => set({ q: '', category: 'semua', level: 'Semua', priceIdx: -1, sort: 'populer' }),
}))
