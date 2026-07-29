import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/src/db';
import { registrations, competitions } from '@/src/db/schema';
import { eq, and, sql } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const competitionId = searchParams.get('competitionId') || '';

    if (!competitionId) {
      return NextResponse.json({ error: 'competitionId wajib diisi' }, { status: 400 });
    }

    // Ambil semua registrasi lunas yang juara & yang punya sertifikat
    const data = await db
      .select({
        id: registrations.id,
        competitionId: registrations.competitionId,
        type: registrations.type,
        fullName: registrations.fullName,
        teamName: registrations.teamName,
        leaderName: registrations.leaderName,
        email: registrations.email,
        winnerRank: registrations.winnerRank,
        certificates: registrations.certificates,
        competitionName: competitions.title,
        prizes: competitions.prizes,
      })
      .from(registrations)
      .innerJoin(competitions, eq(registrations.competitionId, competitions.id))
      .where(
        and(
          eq(registrations.competitionId, competitionId),
          eq(registrations.paymentStatus, 'paid'),
          sql`(${registrations.isWinner} = '1' OR ${sql`jsonb_array_length(${registrations.certificates})`} > 0)`,
        ),
      )
      .orderBy(registrations.winnerRank);

    // Pisahkan: winners (juara) dan certHolders (punya sertifikat tapi bukan juara)
    const winners = data.filter((r) => r.winnerRank);
    const certHolders = data.filter((r) => !r.winnerRank && (r.certificates?.length || 0) > 0);

    return NextResponse.json({ winners, certHolders });
  } catch (error) {
    console.error('GET /api/registrations/winners error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
