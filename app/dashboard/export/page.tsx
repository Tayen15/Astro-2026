'use client';

import { useState } from 'react';
import { Download, Loader2, FileSpreadsheet } from 'lucide-react';

export default function ExportPage() {
  const [loading, setLoading] = useState(false);
  const [format, setFormat] = useState('csv');

  const handleExport = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/export');
      if (!res.ok) throw new Error('Export failed');

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `astro-2026-pendaftaran-${new Date().toISOString().split('T')[0]}.csv`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error(err);
      alert('Gagal mengexport data.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-2xl font-black text-slate-900 uppercase tracking-tight">Export Data</h1>
        <p className="text-sm text-slate-500 font-light mt-1">
          Download data pendaftaran dalam format CSV.
        </p>
      </div>

      <div className="bg-white border border-slate-200 relative"
        style={{ clipPath: 'polygon(14px 0, 100% 0, calc(100% - 14px) 100%, 0 100%)' }}
      >
        <div className="absolute -top-[1px] -left-[1px] w-8 h-8 bg-astro-cyan"
          style={{ clipPath: 'polygon(0 0, 100% 0, 0 100%)' }}
        />
        <div className="p-6 md:p-8 space-y-6">
          <div className="flex items-center gap-3">
            <FileSpreadsheet className="w-8 h-8 text-astro-cyan" />
            <div>
              <h2 className="text-sm font-black text-slate-900 uppercase tracking-tight">Export Pendaftaran</h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Semua data pendaftaran termasuk status pembayaran akan diexport.
              </p>
            </div>
          </div>

          <div className="space-y-3">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.15em]">
              Format File
            </span>
            <div className="flex gap-3">
              <label className={`flex items-center gap-2 px-4 py-3 border cursor-pointer transition-all ${format === 'csv' ? 'border-astro-cyan bg-cyan-50' : 'border-slate-200 hover:border-slate-300'}`}
                style={{ clipPath: 'polygon(5px 0, 100% 0, calc(100% - 5px) 100%, 0 100%)' }}
              >
                <input
                  type="radio"
                  name="format"
                  value="csv"
                  checked={format === 'csv'}
                  onChange={() => setFormat('csv')}
                  className="accent-astro-cyan"
                />
                <span className="text-sm font-medium text-slate-700">CSV</span>
              </label>
              <label className={`flex items-center gap-2 px-4 py-3 border cursor-pointer transition-all opacity-50 ${format === 'xlsx' ? 'border-astro-cyan bg-cyan-50' : 'border-slate-200'}`}
                style={{ clipPath: 'polygon(5px 0, 100% 0, calc(100% - 5px) 100%, 0 100%)' }}
              >
                <input
                  type="radio"
                  name="format"
                  value="xlsx"
                  checked={format === 'xlsx'}
                  onChange={() => setFormat('xlsx')}
                  disabled
                  className="accent-astro-cyan"
                />
                <span className="text-sm font-medium text-slate-500">XLSX (coming soon)</span>
              </label>
            </div>
          </div>

          <button
            onClick={handleExport}
            disabled={loading}
            className="flex items-center justify-center gap-2 w-full sm:w-auto px-8 py-3.5 bg-astro-cyan hover:bg-cyan-400 disabled:bg-slate-200 disabled:text-slate-400 text-slate-950 font-black text-sm tracking-wider uppercase transition-all duration-200 ease-in-out active:scale-[0.98] cursor-pointer disabled:cursor-not-allowed"
            style={{ clipPath: 'polygon(10px 0, 100% 0, calc(100% - 10px) 100%, 0 100%)' }}
          >
            {loading ? (
              <><Loader2 className="w-4 h-4 animate-spin" /> Mengexport...</>
            ) : (
              <><Download className="w-4 h-4" /> Download CSV</>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
