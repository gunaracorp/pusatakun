/**
 * PUSATAKUN — Skeleton pemuatan rute (brand royal dark gold).
 */

export default function Loading() {
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground" role="status" aria-label="Memuat halaman">
      <div className="flex flex-1 items-center justify-center px-4 py-32">
        <div className="flex flex-col items-center gap-5">
          <span className="flex h-16 w-16 animate-pulse items-center justify-center rounded-2xl bg-primary shadow-lg shadow-primary/25">
            <svg viewBox="0 0 24 24" className="h-8 w-8 text-primary-foreground" aria-hidden="true">
              <path
                fill="currentColor"
                d="M2 19h20l-2-9-5 4-3-7-3 7-5-4-2 9zm10-11.5 2.2 5.1 4-3.2 1 4.6H4.8l1-4.6 4 3.2L12 7.5z"
              />
            </svg>
          </span>
          <div className="flex items-center gap-2" aria-hidden="true">
            <span className="h-2 w-2 animate-bounce rounded-full bg-primary [animation-delay:0ms]" />
            <span className="h-2 w-2 animate-bounce rounded-full bg-primary [animation-delay:150ms]" />
            <span className="h-2 w-2 animate-bounce rounded-full bg-primary [animation-delay:300ms]" />
          </div>
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-muted-foreground">
            Memuat pusat akun...
          </p>
        </div>
      </div>
    </div>
  )
}
