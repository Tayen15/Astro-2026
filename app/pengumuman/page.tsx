import { db } from '@/src/db';
import { competitions } from '@/src/db/schema';
import { asc } from 'drizzle-orm';
import type { Metadata } from 'next';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import PengumumanClient from './PengumumanClient';
import { ANNOUNCEMENT_WINNERS } from '@/data/announcementData';
import type { Winner } from '@/data/announcementData';

export const metadata: Metadata = {
  title: 'Pengumuman Pemenang — ASTRO 2026',
  description: 'Daftar pemenang seluruh cabang lomba ASTRO 2026.',
};

function buildWinnersMap() {
  const map: Record<string, { first: Winner[]; second: Winner[]; third: Winner[] }> = {};
  for (const w of ANNOUNCEMENT_WINNERS) {
    map[w.competitionId] = w.winners;
  }
  return map;
}

function buildPrizesMap(comps: any[]) {
  const map: Record<string, { first: string | null; second: string | null; third: string | null }> = {};
  for (const c of comps) {
    map[c.id] = {
      first: c.prizesFirst || null,
      second: c.prizesSecond || null,
      third: c.prizesThird || null,
    };
  }
  return map;
}

export default async function PengumumanPage() {
  let dbCompetitions: any[] = [];

  try {
    dbCompetitions = await db.select().from(competitions).orderBy(asc(competitions.createdAt));
  } catch (e) {
    // DB unavailable
  }

  const winnersMap = buildWinnersMap();
  const hasDbData = dbCompetitions.length > 0;

  const comps = hasDbData
    ? dbCompetitions.map((c: any) => ({
        id: c.id,
        title: c.title,
        category: c.category as 'akademik' | 'olahraga' | 'esports',
        tagline: c.tagline || '',
        scheduleDate: c.scheduleDate?.toISOString?.() || c.scheduleDate || null,
        location: c.location || '',
        type: c.type || 'individual',
      }))
    : [];

  const prizesMap = buildPrizesMap(dbCompetitions);

  return (
    <>
      <Navbar />
      <main>
        <PengumumanClient competitions={comps} winners={winnersMap} prizes={prizesMap} />
      </main>
      <Footer />
    </>
  );
}
