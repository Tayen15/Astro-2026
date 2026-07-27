import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/src/db';
import { competitions, registrations } from '@/src/db/schema';
import { eq, sql } from 'drizzle-orm';
import { createClient } from '@/src/db/supabase/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;

    const [reg] = await db
      .select()
      .from(registrations)
      .where(eq(registrations.id, id));

    if (!reg) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }

    return NextResponse.json({ data: reg });
  } catch (error) {
    console.error('GET /api/registrations/[id] error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const body = await request.json();

    // Get current registration before update (to check status changes)
    const [current] = await db
      .select()
      .from(registrations)
      .where(eq(registrations.id, id));

    if (!current) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }

    const [updated] = await db
      .update(registrations)
      .set({
        ...body,
        updatedAt: new Date(),
      })
      .where(eq(registrations.id, id))
      .returning();

    // Auto-update filledSlots when paymentStatus changes to/from 'paid'
    if (body.paymentStatus && body.paymentStatus !== current.paymentStatus) {
      const wasPaid = current.paymentStatus === 'paid';
      const nowPaid = body.paymentStatus === 'paid';
      const isTeam = current.type === 'team';
      const delta = isTeam ? 1 : 1; // Each approved registration = 1 slot

      if (!wasPaid && nowPaid) {
        // Just approved -> increment filledSlots
        await db
          .update(competitions)
          .set({
            filledSlots: sql`${competitions.filledSlots} + ${delta}`,
          })
          .where(eq(competitions.id, current.competitionId));

        // Fetch competition name for email
        const [comp] = await db
          .select({ title: competitions.title })
          .from(competitions)
          .where(eq(competitions.id, current.competitionId));

        // Send confirmation email
        const participantName = current.fullName || current.teamName || current.leaderName || 'Peserta';
        const regType = current.type === 'team' ? 'Tim' : 'Individu';
        const reference = current.paymentReference || '-';

        try {
          await resend.emails.send({
            from: 'ASTRO 2026 <noreply@mailer.kta.blue>',
            to: current.email,
            subject: `Pembayaran Dikonfirmasi - ${comp?.title || 'ASTRO 2026'}`,
            html: `
              <div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto; padding: 32px 24px; background: #f8fafc; border-radius: 16px;">
                <div style="text-align: center; margin-bottom: 24px;">
                  <img src="https://abhshprulipnmetfumrt.supabase.co/storage/v1/object/public/assets/logo-astro.png" alt="ASTRO" style="height: 48px;" />
                </div>
                <h1 style="font-size: 20px; font-weight: 900; color: #0f172a; text-align: center; text-transform: uppercase; letter-spacing: 0.02em; margin-bottom: 8px;">
                  Pembayaran Dikonfirmasi
                </h1>
                <p style="font-size: 14px; color: #64748b; text-align: center; margin-bottom: 24px;">
                  Pendaftaran kamu telah berhasil dikonfirmasi
                </p>
                <div style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 12px; padding: 24px; margin-bottom: 24px;">
                  <p style="font-size: 12px; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.1em; font-weight: 700; margin-bottom: 12px;">Detail Pendaftaran</p>
                  <table style="width: 100%; font-size: 14px; color: #0f172a;">
                    <tr><td style="padding: 4px 0; color: #64748b;">Nama</td><td style="padding: 4px 0; font-weight: 700;">${participantName}</td></tr>
                    <tr><td style="padding: 4px 0; color: #64748b;">Tipe</td><td style="padding: 4px 0; font-weight: 700;">${regType}</td></tr>
                    <tr><td style="padding: 4px 0; color: #64748b;">Lomba</td><td style="padding: 4px 0; font-weight: 700;">${comp?.title || '-'}</td></tr>
                    <tr><td style="padding: 4px 0; color: #64748b;">Referensi</td><td style="padding: 4px 0; font-weight: 700;">${reference}</td></tr>
                    <tr><td style="padding: 4px 0; color: #64748b;">Status</td><td style="padding: 4px 0; font-weight: 700; color: #10b981;">LUNAS</td></tr>
                  </table>
                </div>
                <p style="font-size: 14px; color: #64748b; text-align: center; margin-bottom: 24px;">
                  Kamu bisa cek status pendaftaran kapan saja melalui halaman Cek Pendaftaran di website ASTRO 2026.
                </p>
                <div style="text-align: center; margin-bottom: 24px;">
                  <a href="${process.env.NEXT_PUBLIC_BASE_URL || 'https://astro2026.example.com'}/cek-pendaftaran" style="display: inline-block; padding: 12px 32px; background: #06b6d4; color: #0f172a; text-decoration: none; font-weight: 900; font-size: 13px; text-transform: uppercase; letter-spacing: 0.05em; clip-path: polygon(8px 0, 100% 0, calc(100% - 8px) 100%, 0 100%);">
                    Cek Pendaftaran
                  </a>
                </div>
                <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 24px 0;" />
                <p style="font-size: 11px; color: #cbd5e1; text-align: center;">
                  ASTRO 2026 — Ajang Lomba Pelajar Tingkat Nasional
                </p>
              </div>
            `,
          });
        } catch (emailErr) {
          console.error('Failed to send confirmation email:', emailErr);
          // Don't fail the request if email fails
        }
      } else if (wasPaid && !nowPaid) {
        // Un-approved -> decrement filledSlots (min 0)
        await db
          .update(competitions)
          .set({
            filledSlots: sql`GREATEST(${competitions.filledSlots} - ${delta}, 0)`,
          })
          .where(eq(competitions.id, current.competitionId));
      }
    }

    return NextResponse.json({ data: updated });
  } catch (error) {
    console.error('PATCH /api/registrations/[id] error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
