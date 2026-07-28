import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/src/db';
import { registrations, competitions } from '@/src/db/schema';
import { eq } from 'drizzle-orm';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: NextRequest) {
  try {
    const { registrationId, competitionId } = await request.json();
    if (!registrationId || !competitionId) {
      return NextResponse.json({ error: 'registrationId dan competitionId wajib diisi' }, { status: 400 });
    }

    // Get registration data
    const [reg] = await db.select().from(registrations).where(eq(registrations.id, registrationId));
    if (!reg) return NextResponse.json({ error: 'Pendaftaran tidak ditemukan' }, { status: 404 });

    // Get competition data
    const [comp] = await db.select().from(competitions).where(eq(competitions.id, competitionId));
    if (!comp) return NextResponse.json({ error: 'Lomba tidak ditemukan' }, { status: 404 });

    const certs: { name: string; url: string }[] = (reg as any).certificates || [];
    if (!certs.length) {
      return NextResponse.json({ error: 'Belum ada sertifikat yang diupload untuk peserta ini.' }, { status: 400 });
    }

    const participantName = reg.fullName || reg.teamName || reg.leaderName || 'Peserta';
    const rank = reg.winnerRank ? `Juara ${reg.winnerRank}` : 'Peserta';

    // Build certificate download links
    const certLinks = certs
      .map(
        (c) =>
          `<tr><td style="padding: 6px 0; color: #64748b; font-size: 13px;">${c.name}</td>
            <td style="padding: 6px 0; text-align: right;">
              <a href="${process.env.NEXT_PUBLIC_BASE_URL || 'https://astro2026.example.com'}${c.url}"
                 style="display: inline-block; padding: 8px 20px; background: #06b6d4; color: #0f172a; text-decoration: none; font-weight: 900; font-size: 11px; text-transform: uppercase; letter-spacing: 0.05em; clip-path: polygon(5px 0, 100% 0, calc(100% - 5px) 100%, 0 100%);">
                Download
              </a>
            </td></tr>`,
      )
      .join('');

    // Send email with all certificates
    try {
      await resend.emails.send({
        from: 'ASTRO 2026 <noreply@mailer.kta.blue>',
        to: reg.email,
        subject: `Sertifikat - ${comp.title} | ASTRO 2026`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 520px; margin: 0 auto; padding: 32px 24px; background: #f8fafc; border-radius: 16px;">
            <div style="text-align: center; margin-bottom: 24px;">
              <img src="https://abhshprulipnmetfumrt.supabase.co/storage/v1/object/public/assets/logo-astro.png" alt="ASTRO" style="height: 48px;" />
            </div>
            <h1 style="font-size: 20px; font-weight: 900; color: #0f172a; text-align: center; text-transform: uppercase; letter-spacing: 0.02em; margin-bottom: 8px;">
              Sertifikat ASTRO 2026
            </h1>
            <p style="font-size: 14px; color: #64748b; text-align: center; margin-bottom: 24px;">
              Berikut adalah sertifikat untuk partisipasi ${participantName} di ${comp.title}.
            </p>
            <div style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 12px; padding: 20px 24px; margin-bottom: 24px;">
              <table style="width: 100%; font-size: 14px; color: #0f172a;">
                <tr><td style="padding: 4px 0; color: #64748b;">Tim / Peserta</td><td style="padding: 4px 0; font-weight: 700;">${participantName}</td></tr>
                <tr><td style="padding: 4px 0; color: #64748b;">Lomba</td><td style="padding: 4px 0; font-weight: 700;">${comp.title}</td></tr>
                <tr><td style="padding: 4px 0; color: #64748b;">Status</td><td style="padding: 4px 0; font-weight: 700;">${rank}</td></tr>
              </table>
            </div>
            <h3 style="font-size: 13px; font-weight: 900; color: #0f172a; text-transform: uppercase; letter-spacing: 0.03em; margin-bottom: 12px;">
              Sertifikat Anggota
            </h3>
            <table style="width: 100%; border-collapse: collapse;">
              ${certLinks}
            </table>
            <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 24px 0;" />
            <p style="font-size: 11px; color: #cbd5e1; text-align: center;">
              ASTRO 2026 — Ajang Lomba Pelajar Tingkat Nasional
            </p>
          </div>
        `,
      });
    } catch (emailErr) {
      console.error('Failed to send certificate email:', emailErr);
      return NextResponse.json({ error: 'Gagal mengirim email sertifikat' }, { status: 500 });
    }

    // Mark certificate as sent
    await db.update(registrations).set({
      certificateSent: '1',
      updatedAt: new Date(),
    }).where(eq(registrations.id, registrationId));

    return NextResponse.json({ success: true, message: 'Sertifikat berhasil dikirim' });
  } catch (error) {
    console.error('POST /api/certificates/send error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
