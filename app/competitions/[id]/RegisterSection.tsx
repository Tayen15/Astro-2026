'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import type { Competition } from '@/types/astro';

interface Props {
  competition: Competition;
}

export default function RegisterSection({ competition }: Props) {
  const router = useRouter();

  return (
    <div className="w-full text-center">
      <Button
        onClick={() => router.push(`/register/${competition.id}`)}
        size="lg"
        className="clip-angled mx-auto w-full max-w-md text-sm font-black uppercase tracking-wider active:scale-95"
      >
        Daftar {competition.title}
      </Button>
    </div>
  );
}
