import { NextResponse } from 'next/server';
import { db } from '@/src/db';
import { registrations, competitions } from '@/src/db/schema';
import { eq, desc } from 'drizzle-orm';

export async function GET() {
  try {
    const data = await db
      .select({
        reference: registrations.paymentReference,
        type: registrations.type,
        fullName: registrations.fullName,
        identityNumber: registrations.identityNumber,
        teamName: registrations.teamName,
        leaderName: registrations.leaderName,
        leaderIdentity: registrations.leaderIdentity,
        members: registrations.members,
        institution: registrations.institution,
        email: registrations.email,
        whatsapp: registrations.whatsapp,
        paymentStatus: registrations.paymentStatus,
        paymentMethod: registrations.paymentMethod,
        paymentAmount: registrations.paymentAmount,
        createdAt: registrations.createdAt,
        competitionName: competitions.title,
        competitionCategory: competitions.category,
      })
      .from(registrations)
      .innerJoin(competitions, eq(registrations.competitionId, competitions.id))
      .orderBy(desc(registrations.createdAt));

    // Build CSV
    const headers = [
      'Referensi', 'Tipe', 'Nama Lengkap', 'No Identitas',
      'Nama Tim', 'Nama Ketua', 'Identitas Ketua', 'Anggota',
      'Instansi', 'Email', 'WhatsApp', 'Lomba', 'Kategori',
      'Status Bayar', 'Metode Bayar', 'Jumlah', 'Tanggal Daftar',
    ];

    const rows = data.map((r) => [
      r.reference || '',
      r.type || '',
      (r.type === 'team' ? '' : r.fullName || ''),
      (r.type === 'team' ? '' : r.identityNumber || ''),
      (r.type === 'team' ? r.teamName || '' : ''),
      (r.type === 'team' ? r.leaderName || '' : ''),
      (r.type === 'team' ? r.leaderIdentity || '' : ''),
      (r.type === 'team' ? (r.members || '').replace(/\n/g, '; ') : ''),
      r.institution || '',
      r.email || '',
      r.whatsapp || '',
      r.competitionName || '',
      r.competitionCategory || '',
      r.paymentStatus || '',
      r.paymentMethod || '',
      r.paymentAmount?.toString() || '0',
      r.createdAt ? new Date(r.createdAt).toISOString() : '',
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map((row) =>
        row
          .map((cell) => `"${String(cell).replace(/"/g, '""')}"`)
          .join(','),
      ),
    ].join('\n');

    return new NextResponse(csvContent, {
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': `attachment; filename="astro-pendaftaran-${new Date().toISOString().split('T')[0]}.csv"`,
      },
    });
  } catch (error) {
    console.error('GET /api/export error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
