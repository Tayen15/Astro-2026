import astroData from '@/data/astro-data.json';
import type { AstroData } from '@/types/astro';
import Navbar from '@/components/Navbar';
import HeroSection from '@/components/HeroSection';
import StatsBar from '@/components/StatsBar';
import AboutSection from '@/components/AboutSection';
import CompetitionSection from '@/components/CompetitionSection';
import TimelineSection from '@/components/TimelineSection';
import Image from 'next/image';
import FAQSection from '@/components/FAQSection';
import Footer from '@/components/Footer';

const data = astroData as AstroData;

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <HeroSection eventConfig={data.eventConfig} />
        <StatsBar data={data} />
        <AboutSection />
        <CompetitionSection competitions={data.competitions} />
        <TimelineSection timeline={data.timeline} />
        <FAQSection faqs={data.faqs} />
      </main>
      <Footer />
    </>
  );
}
