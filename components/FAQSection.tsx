'use client';

import { useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';
import { ChevronDown, MessageCircle } from 'lucide-react';
import type { FAQItem } from '@/types/astro';

interface Props {
  faqs: FAQItem[];
}

export default function FAQSection({ faqs }: Props) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const reduce = useReducedMotion();

  return (
    <section id="faq" className="relative py-20 md:py-28">
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-cyan-500/2 blur-[150px] rounded-full pointer-events-none" />

      <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6">
        <motion.div
          className="text-center mb-12 md:mb-14"
          initial={reduce ? false : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] as const }}
        >
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-slate-900 mb-3">
            Frequently Asked <span className="text-cyan-600">Questions</span>
          </h2>
          <p className="text-sm md:text-base text-slate-655 font-normal leading-relaxed">Punya pertanyaan? Cek dulu FAQ berikut.</p>
        </motion.div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <motion.div
                key={idx}
                initial={reduce ? false : { opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.05, duration: 0.4 }}
                className={`bg-white border border-slate-100 rounded-2xl transition-all duration-200 ease-in-out shadow-sm hover:shadow-md overflow-hidden ${
                  isOpen ? 'border-cyan-500/40' : 'hover:border-slate-200'
                }`}
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : idx)}
                  className="w-full flex items-center justify-between gap-4 p-5 md:p-6 text-left cursor-pointer"
                  aria-expanded={isOpen}
                >
                  <span className="text-sm md:text-base font-semibold text-slate-800 pr-4">{faq.q}</span>
                  <motion.div
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] as const }}
                    className="flex-shrink-0"
                  >
                    <ChevronDown className={`w-5 h-5 ${isOpen ? 'text-cyan-600' : 'text-slate-455'}`} />
                  </motion.div>
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      key="content"
                      initial={reduce ? false : { height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] as const }}
                      className="overflow-hidden"
                    >
                      <div className="px-5 md:px-6 pb-5 md:pb-6 text-sm md:text-base text-slate-650 leading-relaxed border-t border-slate-100 pt-4">
                        {faq.a}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <motion.div
          className="mt-10 text-center"
          initial={reduce ? false : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="inline-flex flex-col items-center gap-3 p-6 rounded-2xl bg-slate-50 border border-slate-200">
            <MessageCircle className="w-6 h-6 text-cyan-500" />
            <div>
              <p className="text-slate-900 font-semibold">Masih punya pertanyaan?</p>
              <p className="text-sm text-slate-600 mt-0.5">Hubungi kami via WhatsApp untuk respon yang lebih cepat.</p>
            </div>
            <a
              href="https://wa.me/628123456789"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold rounded-full text-sm transition-all duration-200 ease-in-out shadow-[0_0_20px_rgba(6,182,212,0.4)] hover:shadow-[0_0_30px_rgba(6,182,212,0.6)] active:scale-95"
            >
              Hubungi Kami
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
