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

export type AuthMode = 'login' | 'seller'
export type DashboardView = 'seller' | 'buyer' | 'admin'

type AuthState = {
  user: AuthUser | null
  /** idle = belum dicek (render awal SSR/CSR identik), loading = sedang fetch, ready = selesai */
  status: 'idle' | 'loading' | 'ready'
  authOpen: boolean
  authMode: AuthMode
  dashboard: DashboardView | null
  fetchMe: () => Promise<void>
  setUser: (user: AuthUser | null) => void
  openAuth: (mode?: AuthMode) => void
  closeAuth: () => void
  openDashboard: (view: DashboardView) => void
  closeDashboard: () => void
  logout: () => Promise<void>
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  status: 'idle',
  authOpen: false,
  authMode: 'login',
  dashboard: null,

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

  openAuth: (mode = 'login') => set({ authOpen: true, authMode: mode }),
  closeAuth: () => set({ authOpen: false }),

  openDashboard: (view) => set({ dashboard: view }),
  closeDashboard: () => set({ dashboard: null }),

  logout: async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' })
    } finally {
      set({ user: null, dashboard: null, authOpen: false })
    }
  },
}))
