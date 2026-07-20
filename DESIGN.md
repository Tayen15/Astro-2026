# Design System & UI Specifications (`DESIGN.md`)
## Project: Astro Event Web Application (Next.js + Tailwind CSS)

---

## 1. Visual Theme & Philosophy

**Theme Name:** *Deep Space Cyber-Minimalism*  
**Design Concept:**  
Kombinasi antara nuansa **Space/Astro** yang misterius dan luas dengan sentuhan **Glow Cyber/Modern** yang bersih. Desain ini menggunakan kontras tinggi antara latar gelap (*Deep Obsidian*) dengan elemen interaktif bernuansa *Neon Cyan* dan *Electric Violet* untuk menciptakan kesan eksklusif, kompetitif, dan futuristik.

---

## 2. Color Palette & Utility System

AI Agent harus mengonfigurasi `tailwind.config.ts` atau variabel CSS menggunakan palet warna berikut:

### Core Colors
* **Background Primary (Deep Slate/Obsidian):** `#030712` (`slate-950`) — Latar belakang utama.
* **Background Surface (Glass Cards):** `#0F172A` (`slate-900`) dengan transparansi `bg-slate-900/60 backdrop-blur-xl`.
* **Border Lines:** `#1E293B` (`slate-800`) / `#334155` (`slate-700`).

### Accent Colors (Glow & Category Indicators)
* **Astro Neon Cyan (Primary Brand):** `#06B6D4` (`cyan-500`) — Tombol CTA, Teks Highlight, Active States.
* **Electric Violet (Secondary Brand):** `#8B5CF6` (`violet-500`) — Aksen Glow, Header Gradient.
* **Category Badges:**
  * 🧠 **Akademik:** `Emerald / Amber` (`#10B981` / `#F59E0B`) — Kesan fokus & kecerdasan.
  * ⚽ **Olahraga:** `Orange / Flame Red` (`#F97316` / `#EF4444`) — Kesan energi & fisik.
  * 🎮 **Esports:** `Neon Purple / Cyan` (`#A855F7` / `#06B6D4`) — Kesan digital & gamer.

---

## 3. Typography & Hierarchy

Menggunakan font modern sans-serif dengan geometri tegas dari `next/font/google`.

* **Primary Font:** `Plus Jakarta Sans` atau `Inter` (Navigasi, Body, UI Elements).
* **Accent/Display Font (Optional for Numbers/Headings):** `Space Grotesk` (Countdown, Metrics, Header Title).

### Hierarchy Rules
* **Hero Title (H1):** `text-4xl md:text-6xl lg:text-7xl font-extrabold tracking-tight` (Gunakan efek `bg-gradient-to-r from-white via-slate-200 to-cyan-400 bg-clip-text text-transparent`).
* **Section Title (H2):** `text-3xl md:text-4xl font-bold tracking-tight text-white`.
* **Card Title (H3):** `text-xl font-semibold text-slate-100`.
* **Body Text:** `text-sm md:text-base text-slate-400 font-normal leading-relaxed`.

---

## 4. Unique Visual & Interactive Effects

Untuk memberikan pengalaman unik dan kreatif, terapkan efek-efek berikut pada komponen:

### A. Cosmic Radial Glow Background
Gunakan efek latar belakang pendar bintang di `HeroSection` dan background utama:
```tsx
// Latar belakang bintang & pendar warna halus
<div className="absolute inset-0 -z-10 overflow-hidden">
  <div className="absolute -top-[20%] left-[50%] -translate-x-[50%] w-[1000px] h-[500px] bg-gradient-to-b from-violet-600/20 via-cyan-500/10 to-transparent blur-[120px] rounded-full pointer-events-none" />
</div>
B. Glassmorphism Card Style (GlassCard)
Setiap Card Lomba dan Container Utama menggunakan gaya kaca gelap transparan:

Classes: bg-slate-900/60 backdrop-blur-md border border-slate-800/80 rounded-2xl hover:border-cyan-500/50 transition-all duration-300 shadow-xl shadow-black/40

C. Animated Glow Borders / Hover Effects
Saat user melakukan hover pada Card Lomba atau Button:

Card Hover: Subtle translate-y-[-4px] dengan bayangan pendar Cyan (hover:shadow-[0_0_25px_rgba(6,182,212,0.15)]).

Button Glow: bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold shadow-[0_0_20px_rgba(6,182,212,0.4)] hover:shadow-[0_0_30px_rgba(6,182,212,0.6)] transition-all.

5. UI Component Design Specifications
5.1. Header / Navbar
Visual: Floating Navbar dengan efek backdrop-blur-lg bg-slate-950/70 border-b border-slate-800/60.

Logo: Ikon Bintang/Planet (Sparkles / Orbit dari Lucide) + Teks ASTRO 2026 bernuansa metalik.

Active Link: Garis indikator Cyan bercahaya di bawah link aktif.

5.2. Countdown Timer Block
Visual Layout: 4 Kotak Terpisah (Hari, Jam, Menit, Detik).

Style Per Card:

Box: bg-slate-900 border border-slate-800 rounded-xl p-3 md:p-4 text-center.

Angka: text-3xl md:text-5xl font-extrabold text-cyan-400 font-mono tracking-wider.

Label: text-xs uppercase text-slate-500 tracking-widest mt-1.

5.3. Filter & Competition Cards Section
Filter Tabs Layout: Capsule/Pill Switcher dengan latar bg-slate-900 p-1.5 rounded-full border border-slate-800.

Card Lomba Anatomy:

Top Bar: Category Badge (kiri) + Status Kuota "Sisa X Slot" (kanan).

Middle: Judul Lomba (Bold), Tagline (Italic/Slate-400), Ringkasan Biaya (Rp XX.XXX).

Progress Bar Slot: Progress bar tipis h-1.5 bg-slate-800 rounded-full dengan fill warna cyan-500 sesuai rasio filledSlots / maxSlots.

Bottom Actions:

Secondary Button: Detail & Rulebook (Outline style).

Primary Button: Daftar (Solid Cyan glow).

5.4. Detail Competition Modal
Backdrop: Overlay gelap dengan Blur tinggi (bg-black/70 backdrop-blur-md).

Modal Container: Card besar di tengah layar dengan penutup tombol X mengambang di pojok kanan atas.

Content Styling: Tab navigasi di dalam modal untuk memisahkan Aksi/Overview, Hadiah (Juara 1, 2, 3 dengan badge Tropi), dan Rulebook/Aturan Main.

5.5. Interactive Timeline
Layout: Centered atau Left-aligned Vertical Line (w-0.5 bg-gradient-to-b from-cyan-500 via-violet-500 to-slate-800).

Node Icon: Lingkaran bersinar (w-4 h-4 rounded-full bg-cyan-400 ring-4 ring-cyan-500/20).

6. Micro-animations & Assets Rules
Icons: Gunakan lucide-react secara konsisten dengan ukuran standar w-5 h-5 atau w-4 h-4.

Transitions: Gunakan standar transition-all duration-200 ease-in-out pada semua efek hover dan state change.

No Heavy Assets: Hindari penggunaan gambar PNG/JPG berukuran besar yang memberatkan loading. Utamakan efek CSS Gradients, Glassmorphism, SVG Icons, dan Tailwind Utilities.