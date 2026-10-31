'use client'

import type { CSSProperties } from 'react'
import { Star } from 'lucide-react'
import { Card } from '@/components/ui/card'
import type { TestimonialDTO } from '@/lib/marketplace'
import { cn } from '@/lib/utils'
import { SectionHeading } from './motion-primitives'

function TestimonialCard({ testimonial }: { testimonial: TestimonialDTO }) {
  return (
    <Card className="glass mr-4 w-[340px] shrink-0 rounded-2xl border-border p-6 sm:w-[400px]">
      <div className="flex items-center gap-3">
        <span
          aria-hidden="true"
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-amber-400 to-yellow-600 text-sm font-bold text-primary-foreground"
        >
          {testimonial.initials}
        </span>
        <div className="min-w-0">
          <p className="truncate font-semibold text-foreground">{testimonial.name}</p>
          <p className="truncate text-xs text-muted-foreground">
            {testimonial.city} — {testimonial.role}
          </p>
        </div>
      </div>

      <div className="mt-3 flex items-center gap-0.5" aria-label={`Rating ${testimonial.rating} dari 5`}>
        {Array.from({ length: 5 }).map((_, index) => (
          <Star
            key={index}
            aria-hidden="true"
            className={cn(
              'h-3.5 w-3.5',
              index < testimonial.rating ? 'fill-primary text-primary' : 'text-muted-foreground/40',
            )}
          />
        ))}
      </div>

      <blockquote className="mt-3 text-sm leading-relaxed text-muted-foreground">
        {testimonial.content}
      </blockquote>
    </Card>
  )
}

function MarqueeRow({
  items,
  reverse = false,
  duration,
}: {
  items: TestimonialDTO[]
  reverse?: boolean
  duration: string
}) {
  return (
    <div className="marquee-hover-pause mask-fade-x overflow-hidden py-2">
      <div
        className={cn('marquee-track', reverse && 'marquee-reverse')}
        style={{ '--marquee-duration': duration } as CSSProperties}
      >
        <div className="flex shrink-0">
          {items.map((item) => (
            <TestimonialCard key={item.id} testimonial={item} />
          ))}
        </div>
        <div className="flex shrink-0" aria-hidden="true">
          {items.map((item) => (
            <TestimonialCard key={`dup-${item.id}`} testimonial={item} />
          ))}
        </div>
      </div>
    </div>
  )
}

export function TestimonialsSection({ testimonials }: { testimonials: TestimonialDTO[] }) {
  const half = Math.ceil(testimonials.length / 2)
  const firstSet = testimonials.slice(0, half)
  const secondSet = testimonials.slice(half)

  return (
    <section id="testimoni" className="scroll-mt-28 overflow-hidden py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          kicker="Testimoni Asli"
          title="Kata Mereka yang"
          highlight="Sudah Cuan"
          subtitle="Ribuan pembeli & reseller sudah membuktikan. Berikut kata mereka."
        />
      </div>

      <div className="space-y-4">
        <MarqueeRow items={firstSet} duration="55s" />
        <MarqueeRow items={secondSet} reverse duration="65s" />
      </div>
    </section>
  )
}
