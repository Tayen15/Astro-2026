import { db } from '@/src/db';
import { competitions, registrations } from '@/src/db/schema';
import { count, sql, eq } from 'drizzle-orm';
import { Users, Trophy, Banknote, CheckCircle2 } from 'lucide-react';
import OverviewCharts from '@/components/OverviewCharts';

export default async function DashboardOverview() {
  const totalRegistrations = await db.select({ count: count() }).from(registrations);
  const totalCompetitions = await db.select({ count: count() }).from(competitions);
  const paidRegistrations = await db
    .select({ count: count() })
    .from(registrations)
    .where(eq(registrations.paymentStatus, 'paid'));
  const totalRevenue = await db
    .select({ total: sql<number>`COALESCE(SUM(payment_amount), 0)` })
    .from(registrations)
    .where(eq(registrations.paymentStatus, 'paid'));

  // Per competition stats
  const perCompetition = await db
    .select({
      name: competitions.title,
      category: competitions.category,
      count: count(),
    })
    .from(registrations)
    .innerJoin(competitions, eq(registrations.competitionId, competitions.id))
    .groupBy(competitions.id, competitions.title, competitions.category);

  const stats = [
    {
      label: 'Total Pendaftar',
      value: totalRegistrations[0].count,
      icon: Users,
      color: 'text-cyan-600 bg-cyan-50 border-cyan-200',
    },
    {
      label: 'Total Lomba',
      value: totalCompetitions[0].count,
      icon: Trophy,
      color: 'text-emerald-600 bg-emerald-50 border-emerald-200',
    },
    {
      label: 'Pembayaran Terverifikasi',
      value: paidRegistrations[0].count,
      icon: CheckCircle2,
      color: 'text-green-600 bg-green-50 border-green-200',
    },
    {
      label: 'Total Revenue',
      value: `Rp ${(totalRevenue[0]?.total || 0).toLocaleString('id-ID')}`,
      icon: Banknote,
      color: 'text-amber-600 bg-amber-50 border-amber-200',
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-black text-slate-900 uppercase tracking-tight">Overview</h1>
        <p className="text-sm text-slate-500 font-light mt-1">
          Ringkasan data pendaftaran ASTRO 2026
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              className="bg-white border border-slate-200 p-5 flex items-start gap-4"
              style={{ clipPath: 'polygon(10px 0, 100% 0, calc(100% - 10px) 100%, 0 100%)' }}
            >
              <div
                className={`p-3 border ${stat.color}`}
                style={{ clipPath: 'polygon(4px 0, 100% 0, calc(100% - 4px) 100%, 0 100%)' }}
              >
                <Icon className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.15em]">
                  {stat.label}
                </p>
                <p className="text-2xl font-black text-slate-900 mt-1">{stat.value}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Charts */}
      <OverviewCharts />

      {/* Per Competition Table */}
      <div className="bg-white border border-slate-200"
        style={{ clipPath: 'polygon(14px 0, 100% 0, calc(100% - 14px) 100%, 0 100%)' }}
      >
        <div className="p-5 border-b border-slate-100">
          <h2 className="text-sm font-black text-slate-900 uppercase tracking-tight">
            Pendaftar Per Lomba
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                <th className="text-left px-5 py-3">Lomba</th>
                <th className="text-left px-5 py-3">Kategori</th>
                <th className="text-right px-5 py-3">Jumlah Pendaftar</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {perCompetition.length === 0 ? (
                <tr>
                  <td colSpan={3} className="px-5 py-8 text-center text-slate-400 text-sm">
                    Belum ada data pendaftaran.
                  </td>
                </tr>
              ) : (
                perCompetition.map((row) => (
                  <tr key={row.name} className="hover:bg-slate-50 transition-colors">
                    <td className="px-5 py-3.5 font-medium text-slate-900">{row.name}</td>
                    <td className="px-5 py-3.5 text-slate-500 uppercase text-[10px] font-bold tracking-wider">
                      {row.category}
                    </td>
                    <td className="px-5 py-3.5 text-right font-black text-slate-900">{row.count}</td>
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
