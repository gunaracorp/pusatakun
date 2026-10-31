'use client'

import { MessageCircle } from 'lucide-react'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { Button } from '@/components/ui/button'
import { waLink, type FaqDTO } from '@/lib/marketplace'
import { Reveal, SectionHeading } from './motion-primitives'

export function FaqSection({ faqs }: { faqs: FaqDTO[] }) {
  return (
    <section id="faq" className="scroll-mt-28 py-20 sm:py-28">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          kicker="FAQ"
          title="Pertanyaan yang Sering"
          highlight="Ditanyakan"
          subtitle="Semua yang perlu kamu tahu sebelum membeli akun di Pusatakun."
        />

        <Accordion type="single" collapsible className="w-full">
          {faqs.map((faq, index) => (
            <Reveal key={faq.id} delay={index * 0.06} className="mb-3">
              <AccordionItem
                value={faq.id}
                className="glass rounded-xl border border-border px-5 last:border-b!"
              >
                <AccordionTrigger className="py-5 text-sm font-semibold hover:text-primary hover:no-underline sm:text-base [&>svg]:h-5 [&>svg]:w-5 [&>svg]:text-primary">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="pb-5 text-sm leading-relaxed text-muted-foreground">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            </Reveal>
          ))}
        </Accordion>

        <Reveal delay={0.2} className="mt-8">
          <div className="glass flex flex-col items-center justify-between gap-4 rounded-2xl border border-primary/20 p-6 text-center sm:flex-row sm:text-left">
            <div>
              <h3 className="font-bold text-foreground">Masih ada pertanyaan?</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Admin siap membalas kurang dari 2 menit, 24 jam nonstop.
              </p>
            </div>
            <Button asChild className="h-11 shrink-0 rounded-full px-6 font-semibold">
              <a
                href={waLink('Halo Admin, saya mau tanya seputar pembelian akun.')}
                target="_blank"
                rel="noopener noreferrer"
              >
                <MessageCircle className="h-4 w-4" aria-hidden="true" />
                Tanya Admin
              </a>
            </Button>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
