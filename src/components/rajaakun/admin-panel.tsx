'use client'

import { useCallback, useEffect, useState } from 'react'
import {
  Check,
  Crown,
  Loader2,
  MessageCircle,
  RefreshCw,
  ShieldCheck,
  Tag,
  X,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { formatIDR, listingWaLink, LISTING_STATUS_LABEL, type ListingStatus, type SellerListingDTO } from '@/lib/marketplace'
import { cn } from '@/lib/utils'
import { useAuthStore } from '@/store/auth-store'

const STATUS_STYLE: Record<ListingStatus, string> = {
  PENDING: 'bg-amber-500/15 text-amber-400',
  APPROVED: 'bg-emerald-500/15 text-emerald-400',
  REJECTED: 'bg-red-500/15 text-red-400',
  SOLD: 'bg-zinc-500/20 text-zinc-300',
}

const FILTERS: { value: string; label: string }[] = [
  { value: 'PENDING', label: 'Perlu Kurasi' },
  { value: 'APPROVED', label: 'Tayang' },
  { value: 'REJECTED', label: 'Ditolak' },
  { value: 'SOLD', label: 'Terjual' },
  { value: '', label: 'Semua' },
]

export function AdminPanelSheet() {
  const { user, dashboard, closeDashboard } = useAuthStore()
  const open = dashboard === 'admin'

  const [filter, setFilter] = useState('PENDING')
  const [listings, setListings] = useState<SellerListingDTO[]>([])
  const [loading, setLoading] = useState(false)
  const [busyId, setBusyId] = useState<string | null>(null)

  const load = useCallback(async () => {
    if (!user || user.role !== 'ADMIN') return
    setLoading(true)
    try {
      const qs = filter ? `&status=${filter}` : ''
      const res = await fetch(`/api/listings?admin=1${qs}`, { cache: 'no-store' })
      const data = (await res.json()) as { ok: boolean; listings?: SellerListingDTO[] }
      if (data.ok && data.listings) setListings(data.listings)
    } catch {
      // senyap
    } finally {
      setLoading(false)
    }
  }, [user, filter])

  useEffect(() => {
    if (open) void load()
  }, [open, load])

  async function moderate(id: string, action: 'approve' | 'reject' | 'mark-sold' | 'delete') {
    setBusyId(id)
    try {
      await fetch('/api/admin/listings', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, action }),
      })
      setListings((prev) =>
        prev.filter((l) => {
          if (l.id !== id) return true
          if (action === 'delete') return false
          // keep visible for filters "Semua"; for status filters, refresh removes it
          return true
        }),
      )
      void load()
    } finally {
      setBusyId(null)
    }
  }

  return (
    <Sheet open={open} onOpenChange={(o) => !o && closeDashboard()}>
      <SheetContent side="right" className="glass w-full overflow-y-auto border-l border-border sm:max-w-lg">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2 text-xl font-extrabold">
            <ShieldCheck className="h-5 w-5 text-amber-400" aria-hidden="true" />
            Panel Admin — Kurasi Listing
          </SheetTitle>
          <SheetDescription>
            Setujui, tolak, atau tandai terjual. Hanya nomor WhatsApp pemilik yang punya akses ini.
          </SheetDescription>
        </SheetHeader>

        <div className="space-y-4 px-4 pb-10">
          <div className="flex flex-wrap gap-2" role="tablist" aria-label="Filter status listing">
            {FILTERS.map((f) => (
              <button
                key={f.value}
                type="button"
                role="tab"
                aria-selected={filter === f.value}
                onClick={() => setFilter(f.value)}
                className={cn(
                  'min-h-[36px] rounded-full border px-3 text-xs font-bold transition-colors',
                  filter === f.value
                    ? 'border-primary bg-primary/15 text-primary'
                    : 'border-border text-muted-foreground hover:text-foreground',
                )}
              >
                {f.label}
              </button>
            ))}
          </div>

          <div className="flex items-center justify-between">
            <p className="text-xs text-muted-foreground">{listings.length} listing</p>
            <Button variant="ghost" size="sm" className="h-9 gap-1.5 text-xs" onClick={() => void load()}>
              <RefreshCw className={cn('h-3.5 w-3.5', loading && 'animate-spin')} aria-hidden="true" />
              Muat ulang
            </Button>
          </div>

          {loading && listings.length === 0 && (
            <div className="flex justify-center py-10">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" aria-hidden="true" />
            </div>
          )}

          {!loading && listings.length === 0 && (
            <div className="rounded-2xl border border-dashed border-border p-8 text-center">
              <Crown className="mx-auto h-8 w-8 text-muted-foreground/50" aria-hidden="true" />
              <p className="mt-3 text-sm font-semibold text-foreground">Antrean kosong</p>
              <p className="mt-1 text-xs text-muted-foreground">
                Tidak ada listing pada filter ini.
              </p>
            </div>
          )}

          {listings.map((listing) => (
            <div key={listing.id} className="rounded-2xl border border-border bg-card/40 p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="truncate text-sm font-extrabold text-foreground">{listing.title}</p>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    {listing.platformName} · {listing.level} · {listing.code} ·{' '}
                    {listing.sellerName ?? listing.sellerInitials}
                  </p>
                  <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">{listing.description}</p>
                </div>
                <span
                  className={`shrink-0 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider ${STATUS_STYLE[listing.status]}`}
                >
                  {LISTING_STATUS_LABEL[listing.status]}
                </span>
              </div>
              <div className="mt-2 flex items-center gap-2">
                <Tag className="h-3.5 w-3.5 text-primary" aria-hidden="true" />
                <p className="text-sm font-extrabold text-primary">{formatIDR(listing.price)}</p>
                {listing.followers && (
                  <span className="text-xs text-muted-foreground">· {listing.followers} follower</span>
                )}
              </div>

              <div className="mt-3 flex flex-wrap gap-2">
                {listing.status === 'PENDING' && (
                  <>
                    <Button
                      size="sm"
                      className="h-9 rounded-full text-xs font-bold"
                      disabled={busyId === listing.id}
                      onClick={() => void moderate(listing.id, 'approve')}
                    >
                      <Check className="mr-1 h-3.5 w-3.5" aria-hidden="true" />
                      Setujui
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-9 rounded-full text-xs"
                      disabled={busyId === listing.id}
                      onClick={() => void moderate(listing.id, 'reject')}
                    >
                      <X className="mr-1 h-3.5 w-3.5" aria-hidden="true" />
                      Tolak
                    </Button>
                  </>
                )}
                {listing.status === 'APPROVED' && (
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-9 rounded-full text-xs"
                    disabled={busyId === listing.id}
                    onClick={() => void moderate(listing.id, 'mark-sold')}
                  >
                    <Crown className="mr-1 h-3.5 w-3.5" aria-hidden="true" />
                    Tandai Terjual
                  </Button>
                )}
                {listing.status !== 'PENDING' && (
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-9 rounded-full text-xs text-destructive"
                    disabled={busyId === listing.id}
                    onClick={() => void moderate(listing.id, 'delete')}
                  >
                    <X className="mr-1 h-3.5 w-3.5" aria-hidden="true" />
                    Hapus
                  </Button>
                )}
                <Button asChild size="sm" variant="ghost" className="h-9 rounded-full text-xs">
                  <a
                    href={listingWaLink(listing.code, listing.title, listing.sellerName ?? '')}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <MessageCircle className="mr-1 h-3.5 w-3.5" aria-hidden="true" />
                    Chat Penjual
                  </a>
                </Button>
              </div>
            </div>
          ))}
        </div>
      </SheetContent>
    </Sheet>
  )
}
