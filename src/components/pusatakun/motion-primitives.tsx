'use client'

import { useEffect, useRef, useState } from 'react'
import {
  MotionConfig,
  animate,
  motion,
  useInView,
  useReducedMotion,
} from 'framer-motion'
import { formatCompact } from '@/lib/marketplace'
import { cn } from '@/lib/utils'

/** Premium easing curve used across all Pusatakun animations. */
export const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1]

/* ============ Reveal ============ */

export function Reveal({
  children,
  delay = 0,
  y = 24,
  className,
}: {
  children: React.ReactNode
  delay?: number
  y?: number
  className?: string
}) {
  return (
    <MotionConfig reducedMotion="user">
      <motion.div
        initial={{ opacity: 0, y }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.6, delay, ease: EASE }}
        className={className}
      >
        {children}
      </motion.div>
    </MotionConfig>
  )
}

/* ============ CountUp ============ */

/**
 * Manual number formatting — NEVER use Intl.NumberFormat here
 * (server/client formatting may differ => hydration mismatch).
 * Thousand separator: dot. Decimal separator: comma (id-ID style).
 */
function formatManual(value: number, decimals: number): string {
  const fixed = value.toFixed(decimals)
  const [intPart, decPart] = fixed.split('.')
  const withDots = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, '.')
  return decPart ? `${withDots},${decPart}` : withDots
}

export function CountUp({
  to,
  decimals = 0,
  prefix = '',
  suffix = '',
  className,
  compact = false,
}: {
  to: number
  decimals?: number
  prefix?: string
  suffix?: string
  className?: string
  compact?: boolean
}) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, margin: '-40px' })
  const prefersReduced = useReducedMotion()
  const [display, setDisplay] = useState(() =>
    compact ? formatCompact(0) : formatManual(0, decimals),
  )

  useEffect(() => {
    if (!inView) return
    const render = (v: number) =>
      setDisplay(compact ? formatCompact(v) : formatManual(v, decimals))

    if (prefersReduced) {
      render(to)
      return
    }

    const controls = animate(0, to, {
      duration: 1.6,
      ease: EASE,
      onUpdate: render,
    })
    return () => controls.stop()
  }, [inView, to, decimals, compact, prefersReduced])

  return (
    <span ref={ref} className={className}>
      {prefix}
      {display}
      {suffix}
    </span>
  )
}

/* ============ SectionHeading ============ */

export function SectionHeading({
  kicker,
  title,
  highlight,
  subtitle,
  align = 'center',
}: {
  kicker: string
  title: string
  highlight?: string
  subtitle?: string
  align?: 'center' | 'left'
}) {
  const centered = align === 'center'

  return (
    <Reveal className={cn('mb-10 sm:mb-14', centered ? 'text-center' : 'text-left')}>
      <div className={cn('flex', centered ? 'justify-center' : 'justify-start')}>
        <span className="glass inline-flex min-h-[32px] items-center gap-2 rounded-full px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.22em] text-primary">
          <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-primary" />
          {kicker}
        </span>
      </div>

      <h2 className="mt-5 text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
        {title}
        {highlight ? <> <span className="text-gradient-gold">{highlight}</span></> : null}
      </h2>

      {subtitle ? (
        <p
          className={cn(
            'mt-4 max-w-2xl text-base text-muted-foreground sm:text-lg',
            centered && 'mx-auto',
          )}
        >
          {subtitle}
        </p>
      ) : null}
    </Reveal>
  )
}
