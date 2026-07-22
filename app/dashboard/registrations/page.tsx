import { db } from '@/src/db';
import { registrations, competitions, users } from '@/src/db/schema';
import { eq, desc, sql, ilike } from 'drizzle-orm';
import Link from 'next/link';
import { Search, Filter, ChevronRight } from 'lucide-react';

const statusColors: Record<string, string> = {
  pending: 'bg-amber-50 text-amber-700 border-amber-200',
  detecting: 'bg-blue-50 text-blue-700 border-blue-200',
  paid: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  failed: 'bg-red-50 text-red-700 border-red-200',
};

export const dynamic = 'force-dynamic';

export default async function RegistrationsPage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string; status?: string; lomba?: string }>;
}) {
  const params = await searchParams;
  const search = params.search || '';
  const statusFilter = params.status || '';
  const lombaFilter = params.lomba || '';

  // Build query
  const conditions = [];
  if (search) {
    conditions.push(
      sql`(${registrations.fullName} ILIKE ${'%' + search + '%'} OR ${registrations.teamName} ILIKE ${'%' + search + '%'} OR ${registrations.email} ILIKE ${'%' + search + '%'})`,
    );
  }
  if (statusFilter) {
    conditions.push(eq(registrations.paymentStatus, statusFilter));
  }
  if (lombaFilter) {
    conditions.push(eq(registrations.competitionId, lombaFilter));
  }

  const where = conditions.length > 0 ? sql`${conditions.reduce((a, b) => sql`${a} AND ${b}`)}` : undefined;

  const allRegistrations = await db
    .select({
      id: registrations.id,
      type: registrations.type,
      fullName: registrations.fullName,
      teamName: registrations.teamName,
      email: registrations.email,
      institution: registrations.institution,
      paymentStatus: registrations.paymentStatus,
      paymentAmount: registrations.paymentAmount,
      paymentReference: registrations.paymentReference,
      createdAt: registrations.createdAt,
      competitionName: competitions.title,
      competitionCategory: competitions.category,
    })
    .from(registrations)
    .innerJoin(competitions, eq(registrations.competitionId, competitions.id))
    .where(where)
    .orderBy(desc(registrations.createdAt));

  // Get all competitions for filter dropdown
  const allCompetitions = await db
    .select({ id: competitions.id, title: competitions.title })
    .from(competitions)
    .orderBy(competitions.title);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-slate-900 uppercase tracking-tight">Pendaftaran</h1>
        <p className="text-sm text-slate-500 font-light mt-1">
          {allRegistrations.length} total pendaftaran
        </p>
      </div>

      {/* Filters */}
      <form className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
          <input
            name="search"
            defaultValue={search}
            placeholder="Cari nama, tim, atau email..."
            className="w-full pl-9 pr-3 py-2.5 bg-white border border-slate-200 text-xs font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-astro-cyan transition-colors"
            style={{ clipPath: 'polygon(5px 0, 100% 0, calc(100% - 5px) 100%, 0 100%)' }}
          />
        </div>

        <select
          name="status"
          defaultValue={statusFilter}
          className="px-3 py-2.5 bg-white border border-slate-200 text-xs font-medium text-slate-700 focus:outline-none focus:border-astro-cyan transition-colors cursor-pointer"
          style={{ clipPath: 'polygon(5px 0, 100% 0, calc(100% - 5px) 100%, 0 100%)' }}
        >
          <option value="">Semua Status</option>
          <option value="pending">Pending</option>
          <option value="detecting">Detecting</option>
          <option value="paid">Paid</option>
          <option value="failed">Failed</option>
        </select>

        <select
          name="lomba"
          defaultValue={lombaFilter}
          className="px-3 py-2.5 bg-white border border-slate-200 text-xs font-medium text-slate-700 focus:outline-none focus:border-astro-cyan transition-colors cursor-pointer"
          style={{ clipPath: 'polygon(5px 0, 100% 0, calc(100% - 5px) 100%, 0 100%)' }}
        >
          <option value="">Semua Lomba</option>
          {allCompetitions.map((c) => (
            <option key={c.id} value={c.id}>{c.title}</option>
          ))}
        </select>

        <button
          type="submit"
          className="px-5 py-2.5 bg-astro-cyan text-slate-950 font-bold text-xs tracking-wider uppercase transition-all duration-200 hover:bg-cyan-400 cursor-pointer"
          style={{ clipPath: 'polygon(6px 0, 100% 0, calc(100% - 6px) 100%, 0 100%)' }}
        >
          <Filter className="w-3.5 h-3.5 inline mr-1" />
          Filter
        </button>
      </form>

      {/* Table */}
      <div className="bg-white border border-slate-200 overflow-hidden"
        style={{ clipPath: 'polygon(14px 0, 100% 0, calc(100% - 14px) 100%, 0 100%)' }}
      >
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                <th className="text-left px-5 py-3 w-10">No</th>
                <th className="text-left px-5 py-3">Referensi</th>
                <th className="text-left px-5 py-3">Nama / Tim</th>
                <th className="text-left px-5 py-3 hidden md:table-cell">Lomba</th>
                <th className="text-left px-5 py-3">Status</th>
                <th className="text-right px-5 py-3 hidden md:table-cell">Tanggal</th>
                <th className="text-right px-5 py-3 w-10"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {allRegistrations.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-5 py-12 text-center text-slate-400 text-sm">
                    Belum ada pendaftaran.
                  </td>
                </tr>
              ) : (
                allRegistrations.map((reg, i) => (
                  <tr key={reg.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-5 py-3.5 text-slate-400 text-xs font-mono">{i + 1}</td>
                    <td className="px-5 py-3.5">
                      <code className="text-xs font-mono font-bold text-slate-700">
                        {reg.paymentReference || '—'}
                      </code>
                    </td>
                    <td className="px-5 py-3.5">
                      <p className="font-medium text-slate-900">
                        {reg.type === 'team' ? reg.teamName : reg.fullName}
                      </p>
                      <p className="text-xs text-slate-500">{reg.email}</p>
                    </td>
                    <td className="px-5 py-3.5 hidden md:table-cell">
                      <span className="text-sm text-slate-700">{reg.competitionName}</span>
                    </td>
                    <td className="px-5 py-3.5">
                      <span
                        className={`inline-block px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider border ${statusColors[reg.paymentStatus] || statusColors.pending}`}
                        style={{ clipPath: 'polygon(3px 0, 100% 0, calc(100% - 3px) 100%, 0 100%)' }}
                      >
                        {reg.paymentStatus}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-right hidden md:table-cell">
                      <span className="text-xs text-slate-500">
                        {reg.createdAt ? new Date(reg.createdAt).toLocaleDateString('id-ID') : '—'}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <Link
                        href={`/dashboard/registrations/${reg.id}`}
                        className="text-slate-400 hover:text-astro-cyan transition-colors inline-flex items-center"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
