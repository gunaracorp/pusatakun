'use client'

import { create } from 'zustand'

/** Mirip SessionUser di lib/auth (tanpa mengimpor kode server ke bundel klien). */
export type AuthUser = {
  id: string
  phone: string
  name: string | null
  role: 'BUYER' | 'SELLER' | 'ADMIN'
  createdAt: string
}

type AuthState = {
  user: AuthUser | null
  /** idle = belum dicek (render awal SSR/CSR identik), loading = sedang fetch, ready = selesai */
  status: 'idle' | 'loading' | 'ready'
  fetchMe: () => Promise<void>
  setUser: (user: AuthUser | null) => void
  logout: () => Promise<void>
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  status: 'idle',

  fetchMe: async () => {
    set({ status: 'loading' })
    try {
      const res = await fetch('/api/auth/me', { cache: 'no-store' })
      const data = (await res.json()) as { ok: boolean; user: AuthUser | null }
      set({ user: data.user ?? null, status: 'ready' })
    } catch {
      set({ user: null, status: 'ready' })
    }
  },

  setUser: (user) => set({ user, status: 'ready' }),

  logout: async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' })
    } finally {
      set({ user: null })
    }
  },
}))
