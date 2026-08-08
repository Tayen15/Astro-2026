'use client';

import { useState } from 'react';
import { authClient } from '@/src/lib/auth-client';
import Link from 'next/link';
import { Search, ChevronRight, Loader2 } from 'lucide-react';
import Pagination from '@/components/Pagination';
import { useCompetitions, useRegistrations } from '@/src/lib/hooks/use-queries';

const PAGE_SIZE = 10;

const statusColors: Record<string, string> = {
  pending: 'bg-amber-50 text-amber-700 border-amber-200',
  detecting: 'bg-blue-50 text-blue-700 border-blue-200',
  paid: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  failed: 'bg-red-50 text-red-700 border-red-200',
};

export default function RegistrationsPage() {
  const [tab, setTab] = useState<'all' | 'mine'>('all');
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [lombaFilter, setLombaFilter] = useState('');

  const { data: allCompetitions } = useCompetitions();
  const { data: regPage, isLoading: loading } = useRegistrations({ pageSize: 100 });
  const { data: session } = authClient.useSession();

  const userEmail = session?.user?.email ?? '';
  const registrations = Array.isArray(regPage) ? regPage : (regPage as any)?.data ?? [];
  const myRegistrations = userEmail
    ? registrations.filter(
        (r: any) =>
          r.email?.toLowerCase() === userEmail.toLowerCase() ||
          (r as any).userId,
      )
    : [];

  const displayed = tab === 'mine' ? myRegistrations : registrations;

  const [page, setPage] = useState(1);
  const filtered = displayed.filter((reg: any) => {
    const matchSearch = !search ||
      reg.fullName?.toLowerCase().includes(search.toLowerCase()) ||
      reg.teamName?.toLowerCase().includes(search.toLowerCase()) ||
      reg.email?.toLowerCase().includes(search.toLowerCase());
    const matchStatus = !statusFilter || reg.paymentStatus === statusFilter;
    const matchLomba = !lombaFilter || reg.competitionName === lombaFilter;
    return matchSearch && matchStatus && matchLomba;
  });
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-6 h-6 animate-spin text-astro-cyan" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-slate-900 uppercase tracking-tight">Pendaftaran</h1>
        <p className="text-sm text-slate-500 font-light mt-1">
          {tab === 'mine' ? `${userEmail} — ${myRegistrations.length} pendaftaran` : `${registrations.length} total pendaftaran`}
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-slate-100 p-1 rounded-lg w-fit">
        <button
          onClick={() => { setTab('all'); setSearch(''); setStatusFilter(''); setLombaFilter(''); }}
          className={`px-4 py-2 text-xs font-bold tracking-wider uppercase rounded-md transition-all duration-200 cursor-pointer ${
            tab === 'all' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'
          }`}
        >
          Semua Pendaftaran
        </button>
        <button
          onClick={() => { setTab('mine'); setSearch(''); setStatusFilter(''); setLombaFilter(''); }}
          className={`px-4 py-2 text-xs font-bold tracking-wider uppercase rounded-md transition-all duration-200 cursor-pointer ${
            tab === 'mine' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'
          }`}
        >
          Pendaftaran Saya
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari nama, tim, atau email..."
            className="w-full pl-9 pr-3 py-2.5 bg-white border border-slate-200 text-xs font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-astro-cyan transition-colors"
            style={{ clipPath: 'polygon(5px 0, 100% 0, calc(100% - 5px) 100%, 0 100%)' }}
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
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
          value={lombaFilter}
          onChange={(e) => setLombaFilter(e.target.value)}
          className="px-3 py-2.5 bg-white border border-slate-200 text-xs font-medium text-slate-700 focus:outline-none focus:border-astro-cyan transition-colors cursor-pointer"
          style={{ clipPath: 'polygon(5px 0, 100% 0, calc(100% - 5px) 100%, 0 100%)' }}
        >
          <option value="">Semua Lomba</option>
          {(allCompetitions ?? []).map((c: any) => (
            <option key={c.id} value={c.title}>{c.title}</option>
          ))}
        </select>
      </div>

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
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-5 py-12 text-center text-slate-400 text-sm">
                    Belum ada pendaftaran.
                  </td>
                </tr>
              ) : (
                paginated.map((reg: any, i: number) => (
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

      <Pagination currentPage={page} totalItems={filtered.length} pageSize={PAGE_SIZE} onPageChange={setPage} />
    </div>
  );
}
