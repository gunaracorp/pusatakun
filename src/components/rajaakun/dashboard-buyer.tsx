'use client'

import { useCallback, useEffect, useState } from 'react'
import {
  ExternalLink,
  Loader2,
  MessageCircle,
  PackageSearch,
  RefreshCw,
  ShoppingBag,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import {
  formatIDR,
  orderWaLink,
  ORDER_STATUS_LABEL,
  type OrderDTO,
  type OrderStatus,
} from '@/lib/marketplace'
import { cn } from '@/lib/utils'
import { useAuthStore } from '@/store/auth-store'

const STATUS_STYLE: Record<OrderStatus, string> = {
  MENUNGGU_PEMBAYARAN: 'bg-amber-500/15 text-amber-400',
  DIPROSES: 'bg-sky-500/15 text-sky-400',
  SELESAI: 'bg-emerald-500/15 text-emerald-400',
  DIBATALKAN: 'bg-red-500/15 text-red-400',
}

function formatTanggal(iso: string): string {
  // deterministik (tanpa Intl): 2025-01-31T... -> 31 Jan 2025
  const bulan = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des']
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return ''
  return `${String(d.getDate()).padStart(2, '0')} ${bulan[d.getMonth()]} ${d.getFullYear()}`
}

export function BuyerDashboardSheet() {
  const { user, dashboard, closeDashboard } = useAuthStore()
  const open = dashboard === 'buyer'

  const [orders, setOrders] = useState<OrderDTO[]>([])
  const [loading, setLoading] = useState(false)

  const load = useCallback(async () => {
    if (!user) return
    setLoading(true)
    try {
      const res = await fetch('/api/orders', { cache: 'no-store' })
      const data = (await res.json()) as { ok: boolean; orders?: OrderDTO[] }
      if (data.ok && data.orders) setOrders(data.orders)
    } catch {
      // senyap
    } finally {
      setLoading(false)
    }
  }, [user])

  useEffect(() => {
    if (open) void load()
  }, [open, load])

  return (
    <Sheet open={open} onOpenChange={(o) => !o && closeDashboard()}>
      <SheetContent side="right" className="glass w-full overflow-y-auto border-l border-border sm:max-w-md">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2 text-xl font-extrabold">
            <ShoppingBag className="h-5 w-5 text-primary" aria-hidden="true" />
            Pesanan Saya
          </SheetTitle>
          <SheetDescription>
            Riwayat pesanan akun — konfirmasi pembayaran & pengiriman dibantu admin 24/7 via WhatsApp.
          </SheetDescription>
        </SheetHeader>

        <div className="space-y-4 px-4 pb-10">
          <div className="flex items-center justify-between">
            <p className="text-xs text-muted-foreground">
              {orders.length} pesanan tercatat atas namamu
            </p>
            <Button variant="ghost" size="sm" className="h-9 gap-1.5 text-xs" onClick={() => void load()}>
              <RefreshCw className={cn('h-3.5 w-3.5', loading && 'animate-spin')} aria-hidden="true" />
              Muat ulang
            </Button>
          </div>

          {loading && orders.length === 0 && (
            <div className="flex items-center justify-center py-10">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" aria-hidden="true" />
            </div>
          )}

          {!loading && orders.length === 0 && (
            <div className="rounded-2xl border border-dashed border-border p-8 text-center">
              <PackageSearch className="mx-auto h-8 w-8 text-muted-foreground/50" aria-hidden="true" />
              <p className="mt-3 text-sm font-semibold text-foreground">Belum ada pesanan</p>
              <p className="mt-1 text-xs text-muted-foreground">
                Jelajahi katalog & klik &ldquo;Beli&rdquo; — pesanan akan tercatat di sini otomatis.
              </p>
            </div>
          )}

          {orders.map((order) => (
            <div key={order.id} className="rounded-2xl border border-border bg-card/40 p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="font-mono text-xs font-bold text-primary">{order.code}</p>
                  <p className="mt-1 truncate text-sm font-extrabold text-foreground">
                    {order.productName}
                  </p>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    {formatTanggal(order.createdAt)}
                    {order.quantity > 1 ? ` · ${order.quantity} item` : ''}
                  </p>
                </div>
                <span
                  className={`shrink-0 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider ${STATUS_STYLE[order.status]}`}
                >
                  {ORDER_STATUS_LABEL[order.status]}
                </span>
              </div>
              <div className="mt-3 flex items-center justify-between gap-2">
                <p className="text-base font-extrabold text-primary">{formatIDR(order.amount)}</p>
                {order.status === 'MENUNGGU_PEMBAYARAN' && (
                  <Button asChild size="sm" className="h-9 rounded-full text-xs font-bold">
                    <a
                      href={orderWaLink(order.code, order.productName, user?.name ?? '')}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <MessageCircle className="mr-1 h-3.5 w-3.5" aria-hidden="true" />
                      Bayar via WA
                    </a>
                  </Button>
                )}
                {order.status !== 'MENUNGGU_PEMBAYARAN' && (
                  <Button asChild size="sm" variant="outline" className="h-9 rounded-full text-xs">
                    <a
                      href={orderWaLink(order.code, order.productName, user?.name ?? '')}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <ExternalLink className="mr-1 h-3.5 w-3.5" aria-hidden="true" />
                      Tanya Admin
                    </a>
                  </Button>
                )}
              </div>
            </div>
          ))}

          <p className="text-center text-[10px] uppercase tracking-[0.25em] text-muted-foreground/60">
            Semua transaksi bergaransi & tercatat
          </p>
        </div>
      </SheetContent>
    </Sheet>
  )
}
