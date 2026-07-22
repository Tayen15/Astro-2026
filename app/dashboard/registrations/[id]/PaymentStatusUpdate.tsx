'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, Check } from 'lucide-react';

interface Props {
  registrationId: string;
  currentStatus: string;
}

export default function PaymentStatusUpdate({ registrationId, currentStatus }: Props) {
  const [status, setStatus] = useState(currentStatus);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const router = useRouter();

  const handleUpdate = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/registrations/${registrationId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ paymentStatus: status }),
      });

      if (!res.ok) throw new Error('Failed to update');

      setDone(true);
      router.refresh();
      setTimeout(() => setDone(false), 2000);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pt-3 border-t border-slate-100 space-y-3">
      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
        Update Status Pembayaran
      </span>
      <select
        value={status}
        onChange={(e) => setStatus(e.target.value)}
        className="w-full px-3 py-2 bg-white border border-slate-200 text-xs font-medium text-slate-700 focus:outline-none focus:border-astro-cyan transition-colors cursor-pointer"
        style={{ clipPath: 'polygon(4px 0, 100% 0, calc(100% - 4px) 100%, 0 100%)' }}
      >
        <option value="pending">Pending</option>
        <option value="detecting">Detecting</option>
        <option value="paid">Paid / Lunas</option>
        <option value="failed">Failed / Gagal</option>
      </select>

      <button
        onClick={handleUpdate}
        disabled={loading || status === currentStatus}
        className="flex items-center justify-center gap-2 w-full px-4 py-2.5 bg-astro-cyan hover:bg-cyan-400 disabled:bg-slate-100 disabled:text-slate-400 text-slate-950 font-bold text-xs tracking-wider uppercase transition-all duration-200 cursor-pointer disabled:cursor-not-allowed"
        style={{ clipPath: 'polygon(5px 0, 100% 0, calc(100% - 5px) 100%, 0 100%)' }}
      >
        {loading ? (
          <Loader2 className="w-3.5 h-3.5 animate-spin" />
        ) : done ? (
          <><Check className="w-3.5 h-3.5" /> Tersimpan</>
        ) : (
          'Simpan Perubahan'
        )}
      </button>
    </div>
  );
}
