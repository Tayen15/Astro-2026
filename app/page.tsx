import { db } from '@/src/db';
import { competitions, faqs as faqsTable } from '@/src/db/schema';
import { desc } from 'drizzle-orm';
import type { AstroData, Competition } from '@/types/astro';
import Navbar from '@/components/Navbar';
import HeroSection from '@/components/HeroSection';
import StatsBar from '@/components/StatsBar';
import AboutSection from '@/components/AboutSection';
import TimelineSection from '@/components/TimelineSection';
import SponsorSection from '@/components/SponsorSection';
import FAQSection from '@/components/FAQSection';
import Footer from '@/components/Footer';
import astroData from '@/data/astro-data.json';

const fallbackData = astroData as AstroData;

export default async function Home() {
  // Try fetching from DB, fallback to JSON
  let dbCompetitions: any[] = [];
  let dbFaqs: any[] = [];

  try {
    dbCompetitions = await db.select().from(competitions);
    dbFaqs = await db.select().from(faqsTable).orderBy(desc(faqsTable.sortOrder));
  } catch (e) {
    // DB not available, use JSON
  }

  const hasDbData = dbCompetitions.length > 0;

  // Transform DB competitions to match Competition type
  const data: AstroData = hasDbData ? {
    ...fallbackData,
    competitions: dbCompetitions.map((c) => ({
      id: c.id,
      title: c.title,
      category: c.category as 'akademik' | 'olahraga' | 'esports',
      tagline: c.tagline || '',
      description: c.description || '',
      fee: c.fee,
      maxSlots: c.maxSlots,
      filledSlots: c.filledSlots,
      scheduleDate: c.scheduleDate?.toISOString?.() || c.scheduleDate || '',
      location: c.location || '',
      prizes: {
        first: c.prizesFirst || '',
        second: c.prizesSecond || '',
        third: c.prizesThird || '',
      },
      rulesSummary: c.rulesSummary || [],
      rulebookUrl: c.rulebookUrl || '',
      registrationUrl: '',
      contactPerson: {
        name: c.contactName || '',
        whatsapp: c.contactWhatsapp || '',
      },
      isFree: c.isFree === '1',
      origin: c.origin || 'internal',
    })),
    faqs: dbFaqs.map((f: any) => ({
      q: f.question,
      a: f.answer,
    })),
  } : fallbackData;

  return (
    <>
      <Navbar />
      <main>
        <HeroSection eventConfig={data.eventConfig} />
        <StatsBar data={data} />
        <AboutSection competitions={data.competitions} />
        <TimelineSection timeline={data.timeline} />
        <FAQSection faqs={data.faqs} />
        <SponsorSection />
      </main>
      <Footer />
    </>
  );
}
