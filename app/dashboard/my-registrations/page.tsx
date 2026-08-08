'use client';

import { useState } from 'react';
import { authClient } from '@/src/lib/auth-client';
import { ClipboardList, Loader2 } from 'lucide-react';
import Link from 'next/link';
import Pagination from '@/components/Pagination';
import { useRegistrations } from '@/src/lib/hooks/use-queries';

const PAGE_SIZE = 10;

const statusColors: Record<string, string> = {
  pending: 'bg-amber-50 text-amber-700 border-amber-200',
  detecting: 'bg-blue-50 text-blue-700 border-blue-200',
  paid: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  failed: 'bg-red-50 text-red-700 border-red-200',
};

export default function MyRegistrationsPage() {
  const [page, setPage] = useState(1);
  const { data: session } = authClient.useSession();
  const userEmail = session?.user?.email ?? '';

  const { data: regPage, isLoading: loading } = useRegistrations({
    search: userEmail,
    pageSize: 100,
  });

  const registrations = Array.isArray(regPage) ? regPage : (regPage as any)?.data ?? [];
  const paginated = registrations.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

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
        <h1 className="text-2xl font-black text-slate-900 uppercase tracking-tight">Pendaftaran Saya</h1>
        <p className="text-sm text-slate-500 font-light mt-1">
          {userEmail} — {registrations.length} pendaftaran
        </p>
      </div>

      {registrations.length === 0 ? (
        <div className="bg-white border border-slate-200 p-12 text-center"
          style={{ clipPath: 'polygon(14px 0, 100% 0, calc(100% - 14px) 100%, 0 100%)' }}
        >
          <ClipboardList className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <p className="text-sm text-slate-500">Belum ada pendaftaran.</p>
          <Link href="/#competitions" className="inline-block mt-3 text-xs font-bold text-astro-cyan hover:underline uppercase tracking-wider">
            Lihat Lomba →
          </Link>
        </div>
      ) : (
        <div className="bg-white border border-slate-200"
          style={{ clipPath: 'polygon(14px 0, 100% 0, calc(100% - 14px) 100%, 0 100%)' }}
        >
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                  <th className="text-left px-5 py-3">Lomba</th>
                  <th className="text-left px-5 py-3 hidden sm:table-cell">Referensi</th>
                  <th className="text-left px-5 py-3">Status</th>
                  <th className="text-right px-5 py-3">Tanggal</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {paginated.map((reg: any) => (
                  <tr key={reg.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-5 py-3.5 font-medium text-slate-900">{reg.competitionName}</td>
                    <td className="px-5 py-3.5 hidden sm:table-cell">
                      <code className="text-xs font-mono text-slate-600">{reg.paymentReference || '—'}</code>
                    </td>
                    <td className="px-5 py-3.5">
                      <span
                        className={`inline-block px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider border ${statusColors[reg.paymentStatus] || 'bg-slate-50 text-slate-600 border-slate-200'}`}
                        style={{ clipPath: 'polygon(3px 0, 100% 0, calc(100% - 3px) 100%, 0 100%)' }}
                      >
                        {reg.paymentStatus}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-right text-xs text-slate-500">
                      {reg.createdAt ? new Date(reg.createdAt).toLocaleDateString('id-ID') : '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <Pagination currentPage={page} totalItems={registrations.length} pageSize={PAGE_SIZE} onPageChange={setPage} />
    </div>
  );
}
