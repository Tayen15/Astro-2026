import type { Metadata } from 'next';
import { db } from '@/src/db';
import { competitions, registrations } from '@/src/db/schema';
import { eq, desc } from 'drizzle-orm';
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
  hasWinners: boolean;
}

export default async function PengumumanPage() {
  let comps: CompetitionItem[] = [];

  try {
    // Query competitions langsung dari DB (tanpa fetch API)
    const allComps = await db
      .select({
        id: competitions.id,
        title: competitions.title,
        category: competitions.category,
        tagline: competitions.tagline,
        type: competitions.type,
      })
      .from(competitions)
      .orderBy(desc(competitions.createdAt));

    // Cari competitionId yang punya winner
    const compsWithWinners = await db
      .select({ id: registrations.competitionId })
      .from(registrations)
      .where(eq(registrations.isWinner, '1'))
      .groupBy(registrations.competitionId);

    const winnerIds = new Set(compsWithWinners.map((r) => r.id));

    comps = allComps.map((c) => ({
      id: c.id,
      title: c.title,
      category: c.category,
      tagline: c.tagline || '',
      type: c.type || 'individual',
      hasWinners: winnerIds.has(c.id),
    }));
  } catch (e) {
    console.error('Failed to load competitions with winners:', e);
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
