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
    <section id="faq" className="relative py-20 md:py-28 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-50 via-white to-slate-50 -z-10" />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-cyan-500/2 blur-[150px] rounded-full pointer-events-none" />
      <div className="absolute top-[20%] -right-[10%] w-[400px] h-[400px] bg-slate-900/5 blur-[120px] rounded-full pointer-events-none" />
      {/* Angular accent lines */}
      <div className="absolute bottom-[30%] left-[5%] w-[100px] h-[2px] bg-gradient-to-r from-slate-200/20 to-transparent skew-x-[-12deg] pointer-events-none" />

      <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <motion.div
          className="text-center mb-12 md:mb-14"
          initial={reduce ? false : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] as const }}
        >
          <div className="flex justify-center mb-3">
            <div className="accent-line" />
          </div>
          <h2 className="text-display text-slate-900 mb-3">
            Frequently Asked <span className="text-astro-cyan">Questions</span>
          </h2>
          <p className="text-sm md:text-base text-slate-600 font-light leading-relaxed">
            Punya pertanyaan? Cek dulu FAQ berikut.
          </p>
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
                className={`bg-white border transition-all duration-200 ${
                  isOpen
                    ? 'border-cyan-500/40 shadow-sm'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
                style={{ clipPath: 'polygon(10px 0, 100% 0, calc(100% - 10px) 100%, 0 100%)' }}
              >
                {/* Top accent line when open */}
                {isOpen && (
                  <div className="h-1 w-full bg-astro-cyan" />
                )}

                <button
                  onClick={() => setOpenIndex(isOpen ? null : idx)}
                  className={`w-full flex items-center justify-between gap-4 p-5 md:p-6 text-left cursor-pointer ${isOpen ? '' : ''}`}
                  aria-expanded={isOpen}
                >
                  <span className={`text-sm md:text-base font-bold tracking-tight pr-4 ${isOpen ? 'text-slate-900' : 'text-slate-800'}`}>{faq.q}</span>
                  <motion.div
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] as const }}
                    className="flex-shrink-0 w-7 h-7 flex items-center justify-center border border-slate-200"
                    style={{ clipPath: 'polygon(3px 0, 100% 0, calc(100% - 3px) 100%, 0 100%)' }}
                  >
                    <ChevronDown className={`w-4 h-4 ${isOpen ? 'text-astro-cyan' : 'text-slate-450'}`} />
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
                      <div className="px-5 md:px-6 pb-5 md:pb-6 text-sm md:text-base text-slate-600 leading-relaxed border-t border-slate-100 pt-4">
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
          <div
            className="inline-flex flex-col items-center gap-3 p-8 bg-white border border-slate-200"
            style={{ clipPath: 'polygon(14px 0, 100% 0, calc(100% - 14px) 100%, 0 100%)' }}
          >
            <div className="p-3 bg-cyan-50 border border-cyan-200"
              style={{ clipPath: 'polygon(5px 0, 100% 0, calc(100% - 5px) 100%, 0 100%)' }}
            >
              <MessageCircle className="w-6 h-6 text-astro-cyan" />
            </div>
            <div>
              <p className="text-slate-900 font-black uppercase text-sm tracking-wider">Masih punya pertanyaan?</p>
              <p className="text-sm text-slate-500 mt-1 font-light">Hubungi kami via WhatsApp untuk respon yang lebih cepat.</p>
            </div>
            <a
              href="https://wa.me/628123456789"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 bg-astro-cyan hover:bg-cyan-400 text-slate-950 font-black text-xs tracking-wider uppercase transition-all duration-200 ease-in-out active:scale-95"
              style={{ clipPath: 'polygon(6px 0, 100% 0, calc(100% - 6px) 100%, 0 100%)' }}
            >
              Hubungi Kami
            </a>
          </div>
        </motion.div>
      </div>

      {/* Diagonal bottom transition */}
      <div className="absolute bottom-0 left-0 right-0 h-16 pointer-events-none">
        <svg viewBox="0 0 1440 64" preserveAspectRatio="none" className="w-full h-full" aria-hidden="true">
          <polygon points="0,64 1440,0 1440,64" fill="var(--color-surface-dark)" />
        </svg>
      </div>
    </section>
  );
}
