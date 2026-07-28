'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, Search, Trophy, Award, Check, X, Send, Users, Mail } from 'lucide-react';
import { toast } from 'sonner';
import Pagination from '@/components/Pagination';

interface Competition {
  id: string;
  title: string;
  certificateEnabled: string;
  certificateType: string;
  certificateTemplate: string | null;
}

interface Registration {
  id: string;
  type: string;
  fullName: string | null;
  teamName: string | null;
  leaderName: string | null;
  email: string;
  isWinner: string;
  winnerRank: string | null;
  certificateSent: string;
}

const PAGE_SIZE = 10;

export default function SertifikatPage() {
  const router = useRouter();
  const [competitions, setCompetitions] = useState<Competition[]>([]);
  const [selectedComp, setSelectedComp] = useState<string>('');
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    fetch('/api/competitions')
      .then(r => r.json())
      .then(json => {
        const filtered = (json.data || []).filter((c: Competition) => c.certificateEnabled === '1');
        setCompetitions(filtered);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!selectedComp) return;
    fetch('/api/registrations?lomba=' + selectedComp)
      .then(r => r.json())
      .then(json => {
        // Only show paid registrations
        const paid = (json.data || []).filter((r: any) => r.paymentStatus === 'paid');
        setRegistrations(paid);
      })
      .catch(() => {});
  }, [selectedComp]);

  const toggleWinner = async (regId: string, rank: string | null) => {
    const isWinner = rank ? '1' : '0';
    try {
      const res = await fetch('/api/registrations/' + regId, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isWinner, winnerRank: rank }),
      });
      if (!res.ok) throw new Error();
      toast.success(rank ? 'Ditandai sebagai juara ' + rank : 'Juara dibatalkan');
      // Refresh
      const r = await fetch('/api/registrations?lomba=' + selectedComp);
      const json = await r.json();
      setRegistrations((json.data || []).filter((r: any) => r.paymentStatus === 'paid'));
    } catch {
      toast.error('Gagal menyimpan');
    }
  };

  const sendCertificate = async (reg: Registration) => {
    setSending(true);
    try {
      const res = await fetch('/api/certificates/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          registrationId: reg.id,
          competitionId: selectedComp,
        }),
      });
      const json = await res.json();
      if (!res.ok) { toast.error(json.error || 'Gagal'); return; }
      toast.success('Sertifikat dikirim ke ' + reg.email);
      // Refresh
      const r = await fetch('/api/registrations?lomba=' + selectedComp);
      const j = await r.json();
      setRegistrations((j.data || []).filter((r: any) => r.paymentStatus === 'paid'));
    } catch {
      toast.error('Gagal mengirim sertifikat');
    }
    setSending(false);
  };

  const paginated = registrations.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  if (loading) return <div className="flex justify-center py-20"><Loader2 className="w-6 h-6 animate-spin text-astro-cyan" /></div>;

  const inp = `w-full px-3 py-2 border border-slate-200 text-sm focus:outline-none focus:border-astro-cyan`;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-slate-900 uppercase tracking-tight">Sertifikat</h1>
        <p className="text-sm text-slate-500 font-light mt-1">Kelola pemenang dan kirim sertifikat</p>
      </div>

      {/* Select competition */}
      {competitions.length === 0 ? (
        <div className="bg-white border border-slate-200 p-8 text-center">
          <Trophy className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <p className="text-sm text-slate-500">Belum ada lomba dengan sertifikat aktif.</p>
          <p className="text-xs text-slate-400 mt-1">Aktifkan sertifikat di menu Kompetisi terlebih dahulu.</p>
        </div>
      ) : (
        <div className="flex gap-3 items-end">
          <div className="flex-1 max-w-md">
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Pilih Lomba</label>
            <select value={selectedComp} onChange={(e) => { setSelectedComp(e.target.value); setPage(1); }}
              className={inp + ' mt-1 w-full cursor-pointer'}
              style={{ clipPath: 'polygon(4px 0, 100% 0, calc(100% - 4px) 100%, 0 100%)' }}>
              <option value="">-- Pilih Lomba --</option>
              {competitions.map((c) => (
                <option key={c.id} value={c.id}>{c.title} ({c.certificateType === 'all' ? 'Semua' : 'Juara Saja'})</option>
              ))}
            </select>
          </div>
        </div>
      )}

      {selectedComp && (
        <>
          <div className="flex items-center justify-between">
            <p className="text-sm text-slate-500">{registrations.length} peserta (lunas)</p>
            <span className="text-[10px] font-bold text-slate-400 uppercase">
              {competitions.find(c => c.id === selectedComp)?.certificateType === 'all' ? 'Semua peserta dapat sertifikat' : 'Hanya juara (1/2/3)'}
            </span>
          </div>

          <div className="grid grid-cols-1 gap-2">
            {paginated.map((reg) => {
              const name = reg.fullName || reg.teamName || reg.leaderName || '-';
              return (
                <div key={reg.id} className="bg-white border border-slate-200 relative p-4 flex items-center justify-between group"
                  style={{ clipPath: 'polygon(12px 0, 100% 0, calc(100% - 12px) 100%, 0 100%)' }}>
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div>
                      <span className="text-sm font-bold text-slate-900">{name}</span>
                      <div className="flex items-center gap-2 mt-0.5 text-xs text-slate-500">
                        <Mail className="w-3 h-3" /> {reg.email}
                        <span className="text-slate-300">|</span>
                        {reg.type === 'team' ? 'Tim' : 'Individu'}
                        {reg.isWinner === '1' && (
                          <span className="text-emerald-600 font-bold flex items-center gap-1">
                            <Trophy className="w-3 h-3" /> Juara {reg.winnerRank}
                          </span>
                        )}
                        {reg.certificateSent === '1' && (
                          <span className="text-cyan-600 font-bold flex items-center gap-1">
                            <Check className="w-3 h-3" /> Sertifikat terkirim
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-1.5 items-center">
                    {/* Winner rank buttons */}
                    {['1', '2', '3'].map((rank) => (
                      <button key={rank}
                        onClick={() => toggleWinner(reg.id, reg.isWinner === '1' && reg.winnerRank === rank ? null : rank)}
                        className={`w-8 h-8 text-[10px] font-black transition-all cursor-pointer ${
                          reg.isWinner === '1' && reg.winnerRank === rank
                            ? 'bg-amber-400 text-amber-950 shadow-sm'
                            : 'bg-slate-100 text-slate-400 hover:bg-slate-200'
                        }`}
                        style={{ clipPath: 'polygon(3px 0, 100% 0, calc(100% - 3px) 100%, 0 100%)' }}
                        title={`Tandai juara ${rank}`}
                      >
                        {rank}
                      </button>
                    ))}
                    {/* Send certificate */}
                    {((competitions.find(c => c.id === selectedComp)?.certificateType === 'all') || reg.isWinner === '1') && (
                      <button onClick={() => sendCertificate(reg)}
                        disabled={sending || reg.certificateSent === '1'}
                        className={`px-3 py-2 text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer disabled:cursor-not-allowed ${
                          reg.certificateSent === '1'
                            ? 'bg-emerald-50 text-emerald-600 border border-emerald-200'
                            : 'bg-astro-cyan text-slate-950 hover:bg-cyan-400'
                        }`}
                        style={{ clipPath: 'polygon(4px 0, 100% 0, calc(100% - 4px) 100%, 0 100%)' }}>
                        {reg.certificateSent === '1' ? 'Terkirim' : 'Kirim'}
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
            {registrations.length === 0 && (
              <p className="text-sm text-slate-400 italic py-8 text-center">Belum ada peserta lunas untuk lomba ini.</p>
            )}
          </div>
          <Pagination currentPage={page} totalItems={registrations.length} pageSize={PAGE_SIZE} onPageChange={setPage} />
        </>
      )}
    </div>
  );
}
