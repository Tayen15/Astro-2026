'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  Loader2, Trophy, Award, Check, X, Send, Users, Mail,
  Upload, ExternalLink, Save, Plus, FileText,
} from 'lucide-react';
import { toast } from 'sonner';
import Pagination from '@/components/Pagination';

const PAGE_SIZE = 5;

interface CertItem {
  name: string;
  url: string;
}

interface Registration {
  id: string;
  type: string;
  fullName: string | null;
  teamName: string | null;
  leaderName: string | null;
  email: string;
  institution: string;
  paymentStatus: string;
  isWinner: string;
  winnerRank: string | null;
  certificateSent: string;
  certificates: CertItem[];
}

interface DraftEntry {
  isWinner: string;
  winnerRank: string | null;
}

interface WinnerManagerProps {
  competitionId: string;
}

export default function WinnerManager({ competitionId }: WinnerManagerProps) {
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [saving, setSaving] = useState(false);

  const [draftChanges, setDraftChanges] = useState<Record<string, DraftEntry>>({});

  // New cert input per reg (before save)
  const [newCert, setNewCert] = useState<Record<string, { name: string; uploading: boolean }>>({});

  const fetchRegistrations = useCallback(async () => {
    try {
      const res = await fetch(`/api/registrations?lomba=${competitionId}`);
      const json = await res.json();
      const data: Registration[] = (json.data || []);
      const seen = new Set<string>();
      const paid = data.filter((r) => {
        if (r.paymentStatus !== 'paid') return false;
        if (seen.has(r.id)) return false;
        seen.add(r.id);
        return true;
      });
      setRegistrations(paid);
    } catch (err) {
      console.error('Failed to fetch registrations', err);
    }
  }, [competitionId]);

  useEffect(() => {
    const init = async () => {
      setLoading(true);
      await fetchRegistrations();
      setDraftChanges({});
      setLoading(false);
    };
    init();
  }, [competitionId, fetchRegistrations]);

  // ─── Multi Upload per Peserta ───
  const handleUploadCert = async (e: React.ChangeEvent<HTMLInputElement>, regId: string) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const name = newCert[regId]?.name?.trim() || file.name.replace(/\.[^/.]+$/, '');
    if (!name) {
      toast.error('Masukkan nama peserta untuk sertifikat ini');
      return;
    }

    setNewCert((prev) => ({ ...prev, [regId]: { name, uploading: true } }));
    const fd = new FormData();
    fd.append('file', file);
    try {
      const res = await fetch('/api/upload', { method: 'POST', body: fd });
      const json = await res.json();
      if (!json.url) { toast.error(json.error || 'Gagal upload'); setNewCert((prev) => ({ ...prev, [regId]: { name, uploading: false } })); return; }

      // Get current certs
      const reg = registrations.find((r) => r.id === regId);
      const current = reg?.certificates || [];
      const updated = [...current, { name, url: json.url }];

      // Save to server immediately
      const saveRes = await fetch(`/api/registrations/${regId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ certificates: updated }),
      });
      if (!saveRes.ok) throw new Error();
      toast.success(`Sertifikat untuk "${name}" berhasil ditambahkan`);
      await fetchRegistrations();
      setNewCert((prev) => {
        const next = { ...prev };
        delete next[regId];
        return next;
      });
    } catch {
      toast.error('Upload gagal');
      setNewCert((prev) => ({ ...prev, [regId]: { name, uploading: false } }));
    }
  };

  const handleDeleteCert = async (regId: string, certUrl: string) => {
    const reg = registrations.find((r) => r.id === regId);
    if (!reg) return;
    const updated = reg.certificates.filter((c) => c.url !== certUrl);
    try {
      const res = await fetch(`/api/registrations/${regId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ certificates: updated }),
      });
      if (!res.ok) throw new Error();
      toast.success('Sertifikat dihapus');
      await fetchRegistrations();
    } catch {
      toast.error('Gagal menghapus');
    }
  };

  // ─── Toggle Winner (Draft) ───
  const getEffective = (reg: Registration) => {
    const draft = draftChanges[reg.id];
    if (draft) return draft;
    return { isWinner: reg.isWinner, winnerRank: reg.winnerRank };
  };

  const handleToggleWinner = (regId: string, rank: string) => {
    const reg = registrations.find((r) => r.id === regId);
    if (!reg) return;
    const eff = getEffective(reg);
    if (eff.isWinner === '1' && eff.winnerRank === rank) {
      setDraftChanges((prev) => ({ ...prev, [regId]: { isWinner: '0', winnerRank: null } }));
      return;
    }
    setDraftChanges((prev) => ({ ...prev, [regId]: { isWinner: '1', winnerRank: rank } }));
  };

  // ─── Bulk Save ───
  const hasChanges = Object.keys(draftChanges).length > 0;

  const handleSaveAll = async () => {
    if (!hasChanges) return;
    setSaving(true);
    const entries = Object.entries(draftChanges);
    let success = 0;
    let fail = 0;
    for (const [regId, change] of entries) {
      try {
        const res = await fetch(`/api/registrations/${regId}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ isWinner: change.isWinner, winnerRank: change.winnerRank }),
        });
        if (res.ok) success++;
        else fail++;
      } catch { fail++; }
    }
    if (fail === 0) toast.success(`Semua ${success} perubahan berhasil disimpan`);
    else toast.warning(`${success} berhasil, ${fail} gagal`);
    setDraftChanges({});
    await fetchRegistrations();
    setSaving(false);
  };

  // ─── Send Certificate Email ───
  const sendCertificate = async (reg: Registration) => {
    try {
      const res = await fetch('/api/certificates/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ registrationId: reg.id, competitionId }),
      });
      const json = await res.json();
      if (!res.ok) { toast.error(json.error || 'Gagal'); return; }
      toast.success('Sertifikat berhasil dikirim ke ' + reg.email);
      await fetchRegistrations();
    } catch {
      toast.error('Gagal mengirim sertifikat');
    }
  };

  const paginated = registrations.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  if (loading) {
    return <div className="flex justify-center py-8"><Loader2 className="w-5 h-5 animate-spin text-astro-cyan" /></div>;
  }

  const inp = `w-full px-3 py-2 border border-slate-200 text-xs focus:outline-none focus:border-astro-cyan`;

  return (
    <div className="space-y-5 text-slate-800 text-left">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-3 border-b border-slate-100">
        <div>
          <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
            <Award className="w-4 h-4 text-astro-cyan" /> Kelola Juara & Sertifikat
          </h4>
          <p className="text-[10px] text-slate-500 mt-0.5">
            Tentukan juara dan upload sertifikat per anggota tim/peserta.
          </p>
        </div>
      </div>

      {/* Registrations List */}
      <div className="space-y-2">
        <div className="flex justify-between items-center text-[10px] text-slate-500 font-bold uppercase tracking-wider">
          <span>Daftar Peserta ({registrations.length} Lunas)</span>
          <span>Halaman {page} dari {Math.max(1, Math.ceil(registrations.length / PAGE_SIZE))}</span>
        </div>

        <div className="grid grid-cols-1 gap-2">
          {paginated.map((reg) => {
            const name = reg.fullName || reg.teamName || reg.leaderName || 'Peserta';
            const eff = getEffective(reg);
            const isWinner = eff.isWinner === '1';
            const isSent = reg.certificateSent === '1';
            const isDraft = !!draftChanges[reg.id];
            const certs = reg.certificates || [];

            return (
              <div key={reg.id}
                className={`border p-3 transition-colors ${
                  isDraft ? 'bg-amber-50/80 border-amber-200' : 'bg-slate-50 border-slate-200'
                }`}
                style={{ clipPath: 'polygon(6px 0, 100% 0, calc(100% - 6px) 100%, 0 100%)' }}
              >
                {/* Info Baris Atas */}
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs font-black text-slate-900 uppercase tracking-tight">{name}</span>
                      {reg.type === 'team' && (
                        <span className="text-[8px] bg-slate-200 text-slate-700 px-1.5 py-0.5 font-bold uppercase tracking-wider rounded">Tim</span>
                      )}
                      {isWinner && (
                        <span className={`text-[9px] px-1.5 py-0.5 font-bold uppercase tracking-wider flex items-center gap-0.5 border ${
                          isDraft ? 'bg-amber-200 text-amber-900 border-amber-300' : 'bg-amber-100 text-amber-800 border-amber-200'
                        }`} style={{ clipPath: 'polygon(2px 0, 100% 0, calc(100% - 2px) 100%, 0 100%)' }}>
                          <Trophy className="w-2.5 h-2.5" /> Juara {eff.winnerRank}
                          {isDraft && <span className="ml-0.5 text-[7px] opacity-60">(draft)</span>}
                        </span>
                      )}
                      {isSent && (
                        <span className="text-[9px] bg-emerald-100 text-emerald-800 border border-emerald-200 px-1.5 py-0.5 font-bold uppercase tracking-wider flex items-center gap-0.5"
                          style={{ clipPath: 'polygon(2px 0, 100% 0, calc(100% - 2px) 100%, 0 100%)' }}>
                          <Check className="w-2.5 h-2.5" /> Terkirim
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 mt-0.5 text-[10px] text-slate-500">
                      <Mail className="w-3 h-3 text-slate-400" /> {reg.email}
                      <span>•</span>
                      <span>{reg.institution}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 flex-shrink-0">
                    {/* Winner Buttons */}
                    <div className="flex items-center gap-0.5 bg-white border border-slate-200 p-0.5"
                      style={{ clipPath: 'polygon(3px 0, 100% 0, calc(100% - 3px) 100%, 0 100%)' }}>
                      {['1', '2', '3'].map((rank) => {
                        const active = isWinner && eff.winnerRank === rank;
                        return (
                          <button key={rank} onClick={() => handleToggleWinner(reg.id, rank)}
                            className={`w-7 h-7 text-[10px] font-black transition-all cursor-pointer ${
                              active ? 'bg-amber-400 text-amber-950 shadow-sm' : 'text-slate-400 hover:bg-slate-100 hover:text-slate-700'
                            }`} style={{ clipPath: 'polygon(2px 0, 100% 0, calc(100% - 2px) 100%, 0 100%)' }}
                            title={active ? `Batalkan Juara ${rank}` : `Tandai Juara ${rank}`}>{rank}</button>
                        );
                      })}
                    </div>

                    {/* Send button */}
                    <button onClick={() => sendCertificate(reg)} disabled={saving}
                      className={`px-2.5 py-1.5 text-[9px] font-bold uppercase tracking-wider flex items-center gap-1 transition-all cursor-pointer ${
                        isSent ? 'bg-slate-200 text-slate-400 hover:bg-slate-300' : 'bg-astro-cyan text-slate-950 hover:bg-cyan-400'
                      }`} style={{ clipPath: 'polygon(3px 0, 100% 0, calc(100% - 3px) 100%, 0 100%)' }}>
                      <Send className="w-2.5 h-2.5" /> {isSent ? 'Kirim Ulang' : 'Kirim'}
                    </button>
                  </div>
                </div>

                {/* ─── Daftar Sertifikat yang sudah diupload ─── */}
                {certs.length > 0 && (
                  <div className="border-t border-slate-200 pt-2 mt-2 space-y-1.5">
                    <p className="text-[9px] font-bold text-slate-500 uppercase tracking-wider">Sertifikat Terupload:</p>
                    {certs.map((c, i) => (
                      <div key={i} className="flex items-center justify-between bg-white border border-slate-100 px-2.5 py-1.5"
                        style={{ clipPath: 'polygon(3px 0, 100% 0, calc(100% - 3px) 100%, 0 100%)' }}>
                        <div className="flex items-center gap-2 min-w-0">
                          <FileText className="w-3 h-3 text-slate-400 flex-shrink-0" />
                          <span className="text-[11px] font-bold text-slate-700 truncate">{c.name}</span>
                          <a href={c.url} target="_blank" rel="noopener noreferrer"
                            className="text-slate-400 hover:text-astro-cyan flex-shrink-0" title="Lihat">
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        </div>
                        <button onClick={() => handleDeleteCert(reg.id, c.url)}
                          className="p-0.5 text-slate-400 hover:text-red-500 transition-colors cursor-pointer flex-shrink-0">
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {/* ─── Upload Sertifikat Baru ─── */}
                <div className="border-t border-slate-100 pt-2 mt-2 flex items-center gap-2">
                  <input
                    value={newCert[reg.id]?.name || ''}
                    onChange={(e) => setNewCert((prev) => ({ ...prev, [reg.id]: { name: e.target.value, uploading: prev[reg.id]?.uploading || false } }))}
                    placeholder="Nama anggota..."
                    className={`${inp} flex-1 min-w-0 bg-white`}
                    style={{ clipPath: 'polygon(3px 0, 100% 0, calc(100% - 3px) 100%, 0 100%)' }}
                  />
                  <label className="cursor-pointer flex-shrink-0">
                    <div className={`px-3 py-2 text-[9px] font-bold uppercase tracking-wider flex items-center gap-1 transition-colors ${
                      newCert[reg.id]?.uploading
                        ? 'bg-slate-200 text-slate-400'
                        : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`} style={{ clipPath: 'polygon(3px 0, 100% 0, calc(100% - 3px) 100%, 0 100%)' }}>
                      {newCert[reg.id]?.uploading
                        ? <Loader2 className="w-3 h-3 animate-spin" />
                        : <Upload className="w-3 h-3" />
                      }
                      Upload
                    </div>
                    <input type="file" accept="image/*,.pdf" className="hidden"
                      disabled={newCert[reg.id]?.uploading}
                      onChange={(e) => handleUploadCert(e, reg.id)} />
                  </label>
                </div>
              </div>
            );
          })}

          {registrations.length === 0 && (
            <div className="bg-slate-50 border border-slate-200 border-dashed py-8 text-center"
              style={{ clipPath: 'polygon(6px 0, 100% 0, calc(100% - 6px) 100%, 0 100%)' }}>
              <Users className="w-8 h-8 text-slate-300 mx-auto mb-2" />
              <p className="text-xs text-slate-400 italic">Belum ada peserta yang melakukan pembayaran lunas.</p>
            </div>
          )}
        </div>

        <Pagination currentPage={page} totalItems={registrations.length} pageSize={PAGE_SIZE} onPageChange={setPage} />
      </div>

      {/* Sticky Bottom Bulk Save */}
      {hasChanges && (
        <div className="sticky bottom-0 bg-white border-t-2 border-amber-300 p-4 -mx-1 -mb-1 shadow-lg"
          style={{ clipPath: 'polygon(10px 0, 100% 0, calc(100% - 10px) 100%, 0 100%)' }}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-black text-slate-900 uppercase tracking-tight">
                {hasChanges} perubahan belum disimpan
              </p>
              <p className="text-[10px] text-slate-500 mt-0.5">Klik simpan untuk mengirim perubahan juara ke server.</p>
            </div>
            <div className="flex gap-2">
              <button onClick={() => { setDraftChanges({}); toast.info('Perubahan dibatalkan'); }}
                disabled={saving}
                className="px-4 py-2 border border-slate-300 text-slate-600 font-bold text-xs tracking-wider uppercase hover:bg-slate-50 cursor-pointer disabled:opacity-50"
                style={{ clipPath: 'polygon(5px 0, 100% 0, calc(100% - 5px) 100%, 0 100%)' }}>
                <X className="w-3.5 h-3.5 inline mr-1" /> Batal
              </button>
              <button onClick={handleSaveAll} disabled={saving}
                className="flex items-center gap-1.5 px-6 py-2 bg-amber-500 text-amber-950 font-black text-xs tracking-wider uppercase hover:bg-amber-400 transition-all cursor-pointer disabled:opacity-50"
                style={{ clipPath: 'polygon(5px 0, 100% 0, calc(100% - 5px) 100%, 0 100%)' }}>
                {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
                {saving ? 'Menyimpan...' : 'Simpan Semua'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
