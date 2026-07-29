import type { Metadata } from 'next';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import PengumumanClient from './PengumumanClient';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Pengumuman Pemenang — ASTRO 2026',
  description: 'Daftar pemenang seluruh cabang lomba ASTRO 2026.',
};

interface CompetitionItem {
  id: string;
  title: string;
  category: string;
  tagline: string;
  type: string | null;
  origin: string | null;
  isFree: string | null;
  hasWinners: boolean;
}

export default async function PengumumanPage() {
  let comps: CompetitionItem[] = [];

  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/competitions/with-winners`, {
      cache: 'no-store',
    });
    const json = await res.json();
    comps = (json.data || []).map((c: any) => ({
      id: c.id,
      title: c.title,
      category: c.category as string,
      tagline: c.tagline || '',
      type: c.type || 'individual',
      origin: c.origin || 'internal',
      isFree: c.isFree || '0',
      hasWinners: c.hasWinners,
    }));
  } catch (e) {
    console.error('Failed to fetch competitions with winners:', e);
  }

  return (
    <>
      <Navbar />
      <main>
        <PengumumanClient competitions={comps} />
      </main>
      <Footer />
    </>
  );
}
