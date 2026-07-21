import type { Metadata } from "next";
import localFont from "next/font/local";
import { Plus_Jakarta_Sans, Space_Grotesk } from "next/font/google";
import "./globals.css";

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta-sans",
  subsets: ["latin"],
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  display: "swap",
});

const masterpiece = localFont({
  src: "../public/fonts/Masterpiece.ttf",
  variable: "--font-masterpiece",
  display: "swap",
});

export const metadata: Metadata = {
  title: "ASTRO 2026 | Where Innovation Meets the Stars",
  description:
    "Ajang kompetisi dan kreativitas terbesar tahun ini. Bergabunglah dalam ASTRO 2026 — pengalaman kompetisi multi-kategori yang menggabungkan akademik, olahraga, dan esports dalam satu panggung spektakuler.",
  keywords: [
    "ASTRO",
    "kompetisi",
    "lomba",
    "akademik",
    "olahraga",
    "esports",
    "hackathon",
    "futsal",
    "mobile legends",
    "valorant",
    "SMA",
    "SMK",
  ],
  openGraph: {
    title: "ASTRO 2026 | Where Innovation Meets the Stars",
    description:
      "Ajang kompetisi dan kreativitas terbesar tahun ini — Akademik, Olahraga, Esports.",
    url: "https://astro2026.example.com",
    siteName: "ASTRO 2026",
    locale: "id_ID",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "ASTRO 2026 | Where Innovation Meets the Stars",
    description:
      "Ajang kompetisi dan kreativitas terbesar tahun ini — Akademik, Olahraga, Esports.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="id"
      className={`${plusJakartaSans.variable} ${spaceGrotesk.variable} ${masterpiece.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-white text-slate-700">
        {children}
      </body>
    </html>
  );
}
