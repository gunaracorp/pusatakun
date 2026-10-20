'use client'

import { useSyncExternalStore } from 'react'

/**
 * Hook tahun berjalan yang aman terhadap hydration mismatch.
 *
 * Masalah: `new Date().getFullYear()` yang dipanggil saat render bisa berbeda
 * antara server dan klien (mis. pergantian tahun tepat saat halaman dirender),
 * dan React 19 akan melaporkannya sebagai hydration mismatch di console.
 *
 * Solusi (pola resmi React):
 * - Server snapshot → nilai tetap (fallback).
 * - Snapshot hydration → memakai snapshot server agar HTML awal cocok.
 * - Setelah hydration, React membandingkan snapshot klien dan re-render bila beda.
 */
const subscribeNoop = () => () => {}
const FALLBACK_YEAR = 2025

export function useCurrentYear(): number {
  return useSyncExternalStore(
    subscribeNoop,
    () => new Date().getFullYear(),
    () => FALLBACK_YEAR,
  )
}
