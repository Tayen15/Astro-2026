'use client';

import { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';

const MotionImage = motion.create(Image);
import { ChevronDown, MessageCircle } from 'lucide-react';
import type { FAQItem } from '@/types/astro';

interface Props {
  faqs: FAQItem[];
}

export default function FAQSection({ faqs }: Props) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const reduce = useReducedMotion();

  return (
    <section id="faq" className="relative overflow-hidden">
      {/* Background — starts at sky-100 (connects Timeline's bottom) → deeper sky */}
      <div className="absolute inset-0 bg-gradient-to-b from-sky-100 via-sky-200 to-slate-50 -z-10" />
      {/* Grass image — full-width carpet */}
      <div className="absolute bottom-0 left-0 right-0 w-full h-[300px] md:h-[400px] pointer-events-none select-none z-10">
        <Image
          src="/assets/padang-rumput.png"
          alt=""
          width={1920}
          height={400}
          className="w-full h-full object-cover object-bottom"
          style={{ maxHeight: '400px' }}
        />
      </div>

      {/* ─── FLOATING BLOB ROUND IMAGES ─── */}
      <MotionImage
        src="/assets/blob-round.png"
        alt=""
        width={144}
        height={144}
        animate={{ y: [0, -20, 0] }}
        transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute top-[8%] left-[6%] w-24 h-24 md:w-36 md:h-36 object-contain pointer-events-none select-none z-0"
      />
      <MotionImage
        src="/assets/blob-round.png"
        alt=""
        width={128}
        height={128}
        animate={{ y: [0, -14, 0] }}
        transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute top-[15%] right-[3%] w-20 h-20 md:w-32 md:h-32 object-contain pointer-events-none select-none z-0"
      />
      <MotionImage
        src="/assets/blob-round.png"
        alt=""
        width={96}
        height={96}
        animate={{ y: [0, -16, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute top-[55%] left-[2%] w-16 h-16 md:w-24 md:h-24 object-contain pointer-events-none select-none z-0"
      />
      <MotionImage
        src="/assets/blob-round.png"
        alt=""
        width={112}
        height={112}
        animate={{ y: [0, -12, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute top-[60%] right-[6%] w-20 h-20 md:w-28 md:h-28 object-contain pointer-events-none select-none z-0"
      />

      {/* ─── FISH IMAGES ─── */}
      <MotionImage
        src="/assets/fish1.png"
        alt=""
        width={112}
        height={80}
        animate={{ x: [0, 25, 0] }}
        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute top-[28%] left-[1%] w-20 h-auto md:w-28 object-contain pointer-events-none select-none z-0 opacity-60"
      />
      <MotionImage
        src="/assets/fish-in-blob.png"
        alt=""
        width={128}
        height={96}
        animate={{ y: [0, -18, 0] }}
        transition={{ duration: 11, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute bottom-[15%] right-[2%] w-24 h-auto md:w-32 object-contain pointer-events-none select-none z-0 opacity-60"
      />

      {/* White gradient overlay on top of grass → smooth fade to footer */}
      <div className="absolute bottom-0 left-0 right-0 h-40 md:h-56 bg-gradient-to-t from-slate-50 via-slate-50/60 to-transparent pointer-events-none select-none z-20" />

      {/* Extra spacing so grass reaches footer */}
      <div className="h-[300px] md:h-[400px]" />
      {/* Angular accent lines */}
      <div className="absolute top-[20%] -left-[10%] w-[400px] h-[400px] bg-sky-500/5 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[30%] right-[5%] w-[100px] h-[2px] bg-gradient-to-r from-sky-300/20 to-transparent skew-x-[-12deg] pointer-events-none" />

      <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 -mt-50 mb-20">
        {/* Section Header */}
        <motion.div
          className="text-center mb-12 md:mb-14"
          initial={reduce ? false : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] as const }}
        >
          <div className="flex justify-center mb-3">
            <div className="w-[60px] h-[4px] bg-gradient-to-r from-sky-400 to-slate-900 skew-x-[-12deg]" />
          </div>
          <h2 className="font-masterpiece text-5xl md:text-6xl lg:text-7xl text-slate-900 mb-3 leading-tight">
            Frequently Asked <span className="text-sky-500">Questions</span>
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
                className={`relative bg-white border transition-all duration-200 ${isOpen
                    ? 'border-sky-400/40 shadow-sm'
                    : 'border-slate-200 hover:border-slate-300'
                  }`}
                style={{ clipPath: 'polygon(10px 0, 100% 0, calc(100% - 10px) 100%, 0 100%)' }}
              >
                {/* Top accent corner when open */}
                {isOpen && (
                  <div
                    className="absolute -top-[1px] -left-[1px] w-6 h-6 bg-sky-400"
                    style={{ clipPath: 'polygon(0 0, 100% 0, 0 100%)' }}
                  />
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
                    <ChevronDown className={`w-4 h-4 ${isOpen ? 'text-sky-500' : 'text-slate-450'}`} />
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
            <div className="p-3 bg-sky-50 border border-sky-200"
              style={{ clipPath: 'polygon(5px 0, 100% 0, calc(100% - 5px) 100%, 0 100%)' }}
            >
              <MessageCircle className="w-6 h-6 text-sky-500" />
            </div>
            <div>
              <p className="text-slate-900 font-black uppercase text-sm tracking-wider">Masih punya pertanyaan?</p>
              <p className="text-sm text-slate-500 mt-1 font-light">Hubungi kami via WhatsApp untuk respon yang lebih cepat.</p>
            </div>
            <a
              href="https://wa.me/628123456789"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 bg-sky-400 hover:bg-sky-300 text-slate-950 font-black text-xs tracking-wider uppercase transition-all duration-200 ease-in-out active:scale-95"
              style={{ clipPath: 'polygon(6px 0, 100% 0, calc(100% - 6px) 100%, 0 100%)' }}
            >
              Hubungi Kami
            </a>
          </div>
        </motion.div>
      </div>

    </section>
  );
}
