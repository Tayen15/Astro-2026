'use client';

import { useRouter } from 'next/navigation';
import type { Competition } from '@/types/astro';

interface Props {
  competition: Competition;
}

export default function RegisterSection({ competition }: Props) {
  const router = useRouter();

  return (
    <div className="w-full text-center">
      <button
        onClick={() => router.push(`/daftar/${competition.id}`)}
        className="group relative flex items-center justify-center gap-2 w-full max-w-md mx-auto px-8 py-3.5 bg-astro-cyan hover:bg-cyan-400 text-slate-950 font-black text-sm tracking-wider uppercase transition-all duration-200 ease-in-out active:scale-95 cursor-pointer"
        style={{ clipPath: 'polygon(10px 0, 100% 0, calc(100% - 10px) 100%, 0 100%)' }}
      >
        <span className="relative z-10">Daftar {competition.title}</span>
      </button>
    </div>
  );
}
