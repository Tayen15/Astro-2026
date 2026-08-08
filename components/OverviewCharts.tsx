'use client';

import { useState, useEffect } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell,
} from 'recharts';
import { apiHelpers } from '@/src/lib/api';

interface ChartData {
  name: string;
  category: string;
  count: number;
}

interface StatusData {
  name: string;
  value: number;
  color: string;
}

const COLORS = ['#06b6d4', '#10b981', '#f59e0b', '#ef4444'];

const STATUS_LABELS: Record<string, string> = {
  pending: 'Pending',
  detecting: 'Detecting',
  paid: 'Paid',
  failed: 'Failed',
};

export default function OverviewCharts() {
  const [perCompetition, setPerCompetition] = useState<ChartData[]>([]);
  const [statusDistribution, setStatusDistribution] = useState<StatusData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const stats = await apiHelpers.registrations.stats();
        setPerCompetition(stats.perCompetition || []);
        setStatusDistribution(stats.statusDistribution || []);
      } catch {
        // fallback
      }
      setLoading(false);
    }
    fetchData();
  }, []);

  if (loading) return null;

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white border border-slate-200 shadow-md px-4 py-3 text-xs">
          <p className="font-bold text-slate-900 mb-1">{label}</p>
          {payload.map((p: any, i: number) => (
            <p key={i} style={{ color: p.color }} className="font-medium">
              {p.name}: {p.value}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
      {/* Bar Chart — Pendaftar Per Lomba */}
      <div className="lg:col-span-3 bg-white border border-slate-200"
        style={{ clipPath: 'polygon(14px 0, 100% 0, calc(100% - 14px) 100%, 0 100%)' }}
      >
        <div className="p-5 border-b border-slate-100">
          <h2 className="text-sm font-black text-slate-900 uppercase tracking-tight">
            Pendaftar Per Lomba
          </h2>
        </div>
        <div className="p-5">
          {perCompetition.length === 0 ? (
            <p className="text-sm text-slate-400 text-center py-8">Belum ada data.</p>
          ) : (
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={perCompetition} margin={{ top: 10, right: 10, left: -10, bottom: 5 }}>
                <XAxis
                  dataKey="name"
                  tick={{ fontSize: 10, fill: '#64748b' }}
                  tickLine={false}
                  axisLine={{ stroke: '#e2e8f0' }}
                  interval={0}
                  angle={-20}
                  textAnchor="end"
                  height={60}
                />
                <YAxis tick={{ fontSize: 10, fill: '#64748b' }} tickLine={false} axisLine={false} allowDecimals={false} />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: '#f1f5f9' }} />
                <Bar dataKey="count" name="Pendaftar" radius={[4, 4, 0, 0]} barSize={32}>
                  {perCompetition.map((_, idx) => (
                    <Cell key={`cell-${idx}`} fill={COLORS[idx % COLORS.length]} fillOpacity={0.85} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* Pie Chart — Status Pembayaran */}
      <div className="lg:col-span-2 bg-white border border-slate-200"
        style={{ clipPath: 'polygon(14px 0, 100% 0, calc(100% - 14px) 100%, 0 100%)' }}
      >
        <div className="p-5 border-b border-slate-100">
          <h2 className="text-sm font-black text-slate-900 uppercase tracking-tight">
            Status Pembayaran
          </h2>
        </div>
        <div className="p-5">
          {statusDistribution.length === 0 ? (
            <p className="text-sm text-slate-400 text-center py-8">Belum ada data.</p>
          ) : (
            <div className="flex flex-col items-center">
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={statusDistribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={80}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {statusDistribution.map((entry, idx) => (
                      <Cell key={`cell-${idx}`} fill={entry.color} stroke="transparent" />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex flex-wrap justify-center gap-4 mt-2">
                {statusDistribution.map((s) => (
                  <div key={s.name} className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: s.color }} />
                    <span className="text-[10px] font-medium text-slate-600 uppercase tracking-wider">
                      {STATUS_LABELS[s.name] || s.name}: {s.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
