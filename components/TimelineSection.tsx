'use client';

import { motion, useReducedMotion } from 'motion/react';
import { CalendarDays } from 'lucide-react';
import type { TimelineItem } from '@/types/astro';

interface Props {
  timeline: TimelineItem[];
}

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: i * 0.15, ease: [0.16, 1, 0.3, 1] as const },
  }),
};

export default function TimelineSection({ timeline }: Props) {
  const reduce = useReducedMotion();

  return (
    <section id="timeline" className="relative py-20 md:py-28">
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-violet-500/3 blur-[150px] rounded-full pointer-events-none" />

      <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6">
        <motion.div
          className="text-center mb-14 md:mb-16"
          initial={reduce ? false : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-slate-900 mb-3">
            Timeline <span className="text-violet-600">Event</span>
          </h2>
          <p className="text-sm md:text-base text-slate-600 font-normal leading-relaxed">Catat tanggal penting ASTRO 2026 agar tidak terlewat!</p>
        </motion.div>

        <div className="relative">
          <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-cyan-500 via-violet-500 to-slate-200" />

          <div className="space-y-10 md:space-y-12">
            {timeline.map((item, idx) => (
              <motion.div
                key={idx}
                custom={idx}
                variants={reduce ? undefined : itemVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.3 }}
                className={`relative flex flex-col md:flex-row items-start gap-4 md:gap-8 ${
                  idx % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
                }`}
              >
                {/* Node */}
                <div className="absolute left-4 md:left-1/2 -translate-x-1/2 z-10">
                  <div className="w-4 h-4 rounded-full bg-cyan-400 ring-4 ring-cyan-500/20" />
                </div>

                {/* Content */}
                <div className={`ml-10 md:ml-0 md:w-[calc(50%-24px)] ${
                  idx % 2 === 0 ? 'md:pr-0 md:text-right' : 'md:pl-0 md:text-left'
                }`}>
                  <div className={`bg-white border border-slate-100 rounded-2xl hover:border-cyan-500/50 shadow-md hover:shadow-lg transition-all duration-200 ease-in-out p-5 md:p-6 ${
                    idx % 2 === 0 ? 'md:text-right' : 'md:text-left'
                  }`}>
                    <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-50 border border-cyan-200 text-cyan-700 text-xs font-medium mb-3 ${
                      idx % 2 === 0 ? 'md:ml-auto' : 'md:mr-auto'
                    }`}>
                      <CalendarDays className="w-3.5 h-3.5" />
                      {item.date}
                    </div>
                    <h3 className="text-lg font-semibold text-slate-900 mb-1">{item.title}</h3>
                    <p className="text-sm text-slate-650 leading-relaxed">{item.desc}</p>
                  </div>
                </div>

                <div className="hidden md:block md:w-[calc(50%-24px)]" />
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
