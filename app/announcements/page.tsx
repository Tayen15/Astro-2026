import type { Metadata } from 'next';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import PengumumanClient from './PengumumanClient';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Pengumuman Pemenang — ASTRO 2026',
  description: 'Daftar pemenang seluruh cabang lomba ASTRO 2026.',
};

export default function PengumumanPage() {
  return (
    <>
      <Navbar />
      <main>
        <PengumumanClient />
      </main>
      <Footer />
    </>
  );
}
