'use client';

import { useState, useEffect } from 'react';
import { Loader2, Plus, Pencil, X, Check, Trash2, Star, Share2 } from 'lucide-react';
import { toast } from 'sonner';
import DeleteModal from '@/components/DeleteModal';
import Pagination from '@/components/Pagination';

interface Sponsor {
  id: number;
  name: string;
  tier: string;
  website: string | null;
  logo?: string | null;
}
interface MediaPartner {
  id: number;
  name: string;
  website: string | null;
  logo?: string | null;
}

const PAGE_SIZE = 10;

export default function SponsorPage() {
  const [sponsors, setSponsors] = useState<Sponsor[]>([]);
  const [mediaPartners, setMediaPartners] = useState<MediaPartner[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<'sponsor' | 'media-partner'>('sponsor');
  const [spPage, setSpPage] = useState(1);
  const [mpPage, setMpPage] = useState(1);

  const [spForm, setSpForm] = useState({ name: '', website: '', logo: '', tier: 'gold' });
  const [spEditingId, setSpEditingId] = useState<number | null>(null);
  const [spSaving, setSpSaving] = useState(false);
  const [showSpAdd, setShowSpAdd] = useState(false);
  const [mpForm, setMpForm] = useState({ name: '', website: '', logo: '' });
  const [mpEditingId, setMpEditingId] = useState<number | null>(null);
  const [mpSaving, setMpSaving] = useState(false);
  const [showMpAdd, setShowMpAdd] = useState(false);
  const [deleteModal, setDeleteModal] = useState<{ title: string; message: string; onConfirm: () => void } | null>(null);

  const fetchData = async () => {
    const [spRes, mpRes] = await Promise.all([
      fetch('/api/sponsors'),
      fetch('/api/media-partners'),
    ]);
    setSponsors((await spRes.json()).data || []);
    setMediaPartners((await mpRes.json()).data || []);
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, []);

  const handleSpSave = async () => {
    if (!spForm.name && !spForm.logo) { toast.error('Nama atau logo wajib diisi'); return; }
    setSpSaving(true);
    try {
      if (spEditingId) {
        await fetch('/api/sponsors/' + spEditingId, {
          method: 'PUT', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(spForm),
        });
      } else {
        await fetch('/api/sponsors', {
          method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(spForm),
        });
      }
      setSpForm({ name: '', website: '', logo: '', tier: 'gold' });
      setSpEditingId(null); setShowSpAdd(false);
      toast.success(spEditingId ? 'Sponsor diperbarui' : 'Sponsor ditambahkan');
      fetchData();
    } catch { toast.error('Gagal menyimpan sponsor'); }
    setSpSaving(false);
  };

  const handleSpEdit = (s: Sponsor) => {
    setSpForm({ name: s.name, website: s.website || '', logo: s.logo || '', tier: (s as any).tier || 'gold' });
    setSpEditingId(s.id); setShowSpAdd(true);
  };

  const handleSpDelete = (id: number, name: string) => {
    setDeleteModal({
      title: 'Hapus Sponsor', message: 'Yakin ingin menghapus "' + name + '"?',
      onConfirm: async () => {
        const res = await fetch('/api/sponsors/' + id, { method: 'DELETE' });
        if (!res.ok) { toast.error('Gagal menghapus'); return; }
        toast.success('Sponsor dihapus'); setDeleteModal(null); fetchData();
      },
    });
  };

  const handleMpSave = async () => {
    if (!mpForm.name && !mpForm.logo) { toast.error('Nama atau logo wajib diisi'); return; }
    setMpSaving(true);
    try {
      if (mpEditingId) {
        await fetch('/api/media-partners/' + mpEditingId, {
          method: 'PUT', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(mpForm),
        });
      } else {
        await fetch('/api/media-partners', {
          method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(mpForm),
        });
      }
      setMpForm({ name: '', website: '', logo: '' });
      setMpEditingId(null); setShowMpAdd(false);
      toast.success(mpEditingId ? 'Media partner diperbarui' : 'Media partner ditambahkan');
      fetchData();
    } catch { toast.error('Gagal menyimpan media partner'); }
    setMpSaving(false);
  };

  const handleMpEdit = (m: MediaPartner) => {
    setMpForm({ name: m.name, website: m.website || '', logo: m.logo || '' });
    setMpEditingId(m.id); setShowMpAdd(true);
  };

  const handleMpDelete = (id: number, name: string) => {
    setDeleteModal({
      title: 'Hapus Media Partner', message: 'Yakin ingin menghapus "' + name + '"?',
      onConfirm: async () => {
        const res = await fetch('/api/media-partners/' + id, { method: 'DELETE' });
        if (!res.ok) { toast.error('Gagal menghapus'); return; }
        toast.success('Media partner dihapus'); setDeleteModal(null); fetchData();
      },
    });
  };

  const tierBadge = (tier: string) => {
    const colors: Record<string, string> = {
      platinum: 'bg-amber-100 text-amber-700 border-amber-200',
      gold: 'bg-yellow-50 text-yellow-700 border-yellow-200',
      silver: 'bg-slate-100 text-slate-500 border-slate-200',
    };
    return colors[tier] || colors.silver;
  };

  const spPaginated = sponsors.slice((spPage - 1) * PAGE_SIZE, spPage * PAGE_SIZE);
  const mpPaginated = mediaPartners.slice((mpPage - 1) * PAGE_SIZE, mpPage * PAGE_SIZE);

  const tabBtn = (active: boolean) =>
    `flex items-center gap-2 px-5 py-2.5 text-xs font-bold tracking-wider uppercase transition-all cursor-pointer ${
      active ? 'bg-astro-cyan text-slate-950' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
    }`;

  if (loading) return <div className="flex justify-center py-20"><Loader2 className="w-6 h-6 animate-spin text-astro-cyan" /></div>;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-black text-slate-900 uppercase tracking-tight">Sponsor &amp; Media Partner</h1>

      {/* Tabs */}
      <div className="flex gap-2">
        <button onClick={() => { setTab('sponsor'); setShowSpAdd(false); }} className={tabBtn(tab === 'sponsor')}
          style={{ clipPath: 'polygon(5px 0, 100% 0, calc(100% - 5px) 100%, 0 100%)' }}>
          <Star className="w-3.5 h-3.5" /> Sponsor ({sponsors.length})
        </button>
        <button onClick={() => { setTab('media-partner'); setShowMpAdd(false); }} className={tabBtn(tab === 'media-partner')}
          style={{ clipPath: 'polygon(5px 0, 100% 0, calc(100% - 5px) 100%, 0 100%)' }}>
          <Share2 className="w-3.5 h-3.5" /> Media Partner ({mediaPartners.length})
        </button>
      </div>

      {/* Sponsor Tab */}
      {tab === 'sponsor' && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm text-slate-500">{sponsors.length} sponsor</p>
            <button onClick={() => { setShowSpAdd(!showSpAdd); setSpEditingId(null); setSpForm({ name: '', tier: 'gold', website: '', logo: '' }); }}
              className="flex items-center gap-2 px-5 py-2.5 bg-astro-cyan text-slate-950 font-bold text-xs tracking-wider uppercase hover:bg-cyan-400 cursor-pointer"
              style={{ clipPath: 'polygon(6px 0, 100% 0, calc(100% - 6px) 100%, 0 100%)' }}>
              <Plus className="w-3.5 h-3.5" /> Tambah Sponsor
            </button>
          </div>

          {showSpAdd && (
            <div className="bg-white border border-slate-200 relative p-5 space-y-4 mb-5"
              style={{ clipPath: 'polygon(14px 0, 100% 0, calc(100% - 14px) 100%, 0 100%)' }}>
              <div className="absolute -top-[1px] -left-[1px] w-8 h-8 bg-astro-cyan" style={{ clipPath: 'polygon(0 0, 100% 0, 0 100%)' }} />
              <h2 className="text-sm font-black text-slate-900 uppercase tracking-tight">{spEditingId ? 'Edit' : 'Tambah'} Sponsor</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Nama <span className="text-slate-400 font-normal normal-case">(opsional, untuk alt text)</span></label>
                  <input value={spForm.name} onChange={(e) => setSpForm({ ...spForm, name: e.target.value })}
                    placeholder="Nama sponsor" className="w-full px-3 py-2 border border-slate-200 text-sm mt-1 focus:outline-none focus:border-astro-cyan"
                    style={{ clipPath: 'polygon(4px 0, 100% 0, calc(100% - 4px) 100%, 0 100%)' }} />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Website <span className="text-slate-400 font-normal normal-case">(opsional)</span></label>
                  <input value={spForm.website} onChange={(e) => setSpForm({ ...spForm, website: e.target.value })}
                    placeholder="https://..." className="w-full px-3 py-2 border border-slate-200 text-sm mt-1 focus:outline-none focus:border-astro-cyan"
                    style={{ clipPath: 'polygon(4px 0, 100% 0, calc(100% - 4px) 100%, 0 100%)' }} />
                </div>
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                  Logo <span className="text-slate-400 font-normal normal-case">(upload gambar, opsional jika ada teks nama)</span>
                </label>
                <div className="flex items-center gap-3 mt-1">
                  <label className="cursor-pointer">
                    <div className="px-4 py-2 bg-slate-100 border border-slate-200 hover:bg-slate-200 transition-colors text-xs font-bold text-slate-700 uppercase tracking-wider"
                      style={{ clipPath: 'polygon(5px 0, 100% 0, calc(100% - 5px) 100%, 0 100%)' }}
                    >
                      Pilih File
                    </div>
                    <input type="file" accept="image/*" className="hidden"
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (!file) return;
                        const formData = new FormData();
                        formData.append('file', file);
                        try {
                          const res = await fetch('/api/upload', { method: 'POST', body: formData });
                          const json = await res.json();
                          if (json.url) setSpForm({ ...spForm, logo: json.url });
                        } catch { console.error('Upload failed'); }
                      }}
                    />
                  </label>
                  {spForm.logo && (
                    <span className="text-xs text-emerald-600 font-semibold">File terpilih</span>
                  )}
                </div>
              </div>
              {spForm.logo && (
                <div className="flex items-center gap-3 p-3 bg-slate-50 border border-slate-200"
                  style={{ clipPath: 'polygon(6px 0, 100% 0, calc(100% - 6px) 100%, 0 100%)' }}>
                  <img src={spForm.logo} alt="Preview" className="w-10 h-10 object-contain rounded" />
                  <span className="text-xs text-slate-500">Preview logo</span>
                  <button onClick={() => setSpForm({ ...spForm, logo: '' })}
                    className="ml-auto text-xs text-red-500 hover:text-red-700 cursor-pointer">Hapus</button>
                </div>
              )}
              <div className="flex gap-2 pt-2">
                <button onClick={handleSpSave} disabled={spSaving}
                  className="flex items-center gap-1 px-4 py-2 bg-astro-cyan text-slate-950 font-bold text-xs tracking-wider uppercase hover:bg-cyan-400 disabled:bg-slate-200 disabled:text-slate-400 cursor-pointer"
                  style={{ clipPath: 'polygon(5px 0, 100% 0, calc(100% - 5px) 100%, 0 100%)' }}>
                  {spSaving ? <Loader2 className="w-3 h-3 animate-spin" /> : <Check className="w-3 h-3" />} Simpan
                </button>
                <button onClick={() => { setShowSpAdd(false); setSpEditingId(null); setSpForm({ name: '', tier: 'gold', website: '', logo: '' }); }}
                  className="flex items-center gap-1 px-4 py-2 border border-slate-300 text-slate-600 font-bold text-xs tracking-wider uppercase hover:bg-slate-50 cursor-pointer"
                  style={{ clipPath: 'polygon(5px 0, 100% 0, calc(100% - 5px) 100%, 0 100%)' }}>
                  <X className="w-3 h-3" /> Batal
                </button>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 gap-3">
            {spPaginated.map((s) => (
              <div key={s.id} className="bg-white border border-slate-200 relative p-4 flex items-center justify-between group"
                style={{ clipPath: 'polygon(12px 0, 100% 0, calc(100% - 12px) 100%, 0 100%)' }}>
                <div className="flex items-center gap-3">
                  {s.logo ? (
                    <img src={s.logo} alt="" className="w-8 h-8 object-contain rounded" />
                  ) : null}
                  <span className="text-sm font-bold text-slate-900">{s.name || '(tanpa nama)'}</span>
                  {s.website && <span className="text-[11px] text-slate-400 hidden sm:block">{s.website.replace(/https?:\/\//, '')}</span>}
                </div>
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => handleSpEdit(s)} className="p-1.5 text-slate-400 hover:text-astro-cyan cursor-pointer"><Pencil className="w-3.5 h-3.5" /></button>
                  <button onClick={() => handleSpDelete(s.id, s.name)} className="p-1.5 text-slate-400 hover:text-red-500 cursor-pointer"><Trash2 className="w-3.5 h-3.5" /></button>
                </div>
              </div>
            ))}
            {sponsors.length === 0 && <p className="text-sm text-slate-400 italic py-4 text-center">Belum ada sponsor.</p>}
          </div>
          <Pagination currentPage={spPage} totalItems={sponsors.length} pageSize={PAGE_SIZE} onPageChange={setSpPage} />
        </div>
      )}

      {/* Media Partner Tab */}
      {tab === 'media-partner' && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm text-slate-500">{mediaPartners.length} media partner</p>
            <button onClick={() => { setShowMpAdd(!showMpAdd); setMpEditingId(null); setMpForm({ name: '', website: '', logo: '' }); }}
              className="flex items-center gap-2 px-5 py-2.5 bg-astro-cyan text-slate-950 font-bold text-xs tracking-wider uppercase hover:bg-cyan-400 cursor-pointer"
              style={{ clipPath: 'polygon(6px 0, 100% 0, calc(100% - 6px) 100%, 0 100%)' }}>
              <Plus className="w-3.5 h-3.5" /> Tambah Media Partner
            </button>
          </div>

          {showMpAdd && (
            <div className="bg-white border border-slate-200 relative p-5 space-y-4 mb-5"
              style={{ clipPath: 'polygon(14px 0, 100% 0, calc(100% - 14px) 100%, 0 100%)' }}>
              <div className="absolute -top-[1px] -left-[1px] w-8 h-8 bg-astro-cyan" style={{ clipPath: 'polygon(0 0, 100% 0, 0 100%)' }} />
              <h2 className="text-sm font-black text-slate-900 uppercase tracking-tight">{mpEditingId ? 'Edit' : 'Tambah'} Media Partner</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Nama <span className="text-slate-400 font-normal normal-case">(opsional, untuk alt text)</span></label>
                  <input value={mpForm.name} onChange={(e) => setMpForm({ ...mpForm, name: e.target.value })}
                    placeholder="Nama" className="w-full px-3 py-2 border border-slate-200 text-sm mt-1 focus:outline-none focus:border-astro-cyan"
                    style={{ clipPath: 'polygon(4px 0, 100% 0, calc(100% - 4px) 100%, 0 100%)' }} />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Website <span className="text-slate-400 font-normal normal-case">(opsional)</span></label>
                  <input value={mpForm.website} onChange={(e) => setMpForm({ ...mpForm, website: e.target.value })}
                    placeholder="https://..." className="w-full px-3 py-2 border border-slate-200 text-sm mt-1 focus:outline-none focus:border-astro-cyan"
                    style={{ clipPath: 'polygon(4px 0, 100% 0, calc(100% - 4px) 100%, 0 100%)' }} />
                </div>
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                  Logo <span className="text-slate-400 font-normal normal-case">(upload gambar, opsional jika ada teks nama)</span>
                </label>
                <div className="flex items-center gap-3 mt-1">
                  <label className="cursor-pointer">
                    <div className="px-4 py-2 bg-slate-100 border border-slate-200 hover:bg-slate-200 transition-colors text-xs font-bold text-slate-700 uppercase tracking-wider"
                      style={{ clipPath: 'polygon(5px 0, 100% 0, calc(100% - 5px) 100%, 0 100%)' }}
                    >
                      Pilih File
                    </div>
                    <input type="file" accept="image/*" className="hidden"
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (!file) return;
                        const formData = new FormData();
                        formData.append('file', file);
                        try {
                          const res = await fetch('/api/upload', { method: 'POST', body: formData });
                          const json = await res.json();
                          if (json.url) setMpForm({ ...mpForm, logo: json.url });
                        } catch { console.error('Upload failed'); }
                      }}
                    />
                  </label>
                  {mpForm.logo && (
                    <span className="text-xs text-emerald-600 font-semibold">File terpilih</span>
                  )}
                </div>
              </div>
              {mpForm.logo && (
                <div className="flex items-center gap-3 p-3 bg-slate-50 border border-slate-200"
                  style={{ clipPath: 'polygon(6px 0, 100% 0, calc(100% - 6px) 100%, 0 100%)' }}>
                  <img src={mpForm.logo} alt="Preview" className="w-10 h-10 object-contain rounded" />
                  <span className="text-xs text-slate-500">Preview logo</span>
                  <button onClick={() => setMpForm({ ...mpForm, logo: '' })}
                    className="ml-auto text-xs text-red-500 hover:text-red-700 cursor-pointer">Hapus</button>
                </div>
              )}
              <div className="flex gap-2 pt-2">
                <button onClick={handleMpSave} disabled={mpSaving}
                  className="flex items-center gap-1 px-4 py-2 bg-astro-cyan text-slate-950 font-bold text-xs tracking-wider uppercase hover:bg-cyan-400 disabled:bg-slate-200 disabled:text-slate-400 cursor-pointer"
                  style={{ clipPath: 'polygon(5px 0, 100% 0, calc(100% - 5px) 100%, 0 100%)' }}>
                  {mpSaving ? <Loader2 className="w-3 h-3 animate-spin" /> : <Check className="w-3 h-3" />} Simpan
                </button>
                <button onClick={() => { setShowMpAdd(false); setMpEditingId(null); setMpForm({ name: '', website: '', logo: '' }); }}
                  className="flex items-center gap-1 px-4 py-2 border border-slate-300 text-slate-600 font-bold text-xs tracking-wider uppercase hover:bg-slate-50 cursor-pointer"
                  style={{ clipPath: 'polygon(5px 0, 100% 0, calc(100% - 5px) 100%, 0 100%)' }}>
                  <X className="w-3 h-3" /> Batal
                </button>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 gap-3">
            {mpPaginated.map((m) => (
              <div key={m.id} className="bg-white border border-slate-200 relative p-4 flex items-center justify-between group"
                style={{ clipPath: 'polygon(12px 0, 100% 0, calc(100% - 12px) 100%, 0 100%)' }}>
                <div className="flex items-center gap-3">
                  {m.logo ? (
                    <img src={m.logo} alt="" className="w-8 h-8 object-contain rounded" />
                  ) : null}
                  <span className="text-sm font-bold text-slate-900">{m.name || '(tanpa nama)'}</span>
                  {m.website && <span className="text-[11px] text-slate-400 hidden sm:block">{m.website.replace(/https?:\/\//, '')}</span>}
                </div>
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => handleMpEdit(m)} className="p-1.5 text-slate-400 hover:text-astro-cyan cursor-pointer"><Pencil className="w-3.5 h-3.5" /></button>
                  <button onClick={() => handleMpDelete(m.id, m.name)} className="p-1.5 text-slate-400 hover:text-red-500 cursor-pointer"><Trash2 className="w-3.5 h-3.5" /></button>
                </div>
              </div>
            ))}
            {mediaPartners.length === 0 && <p className="text-sm text-slate-400 italic py-4 text-center">Belum ada media partner.</p>}
          </div>
          <Pagination currentPage={mpPage} totalItems={mediaPartners.length} pageSize={PAGE_SIZE} onPageChange={setMpPage} />
        </div>
      )}

      <DeleteModal
        open={!!deleteModal}
        title={deleteModal?.title || ''}
        message={deleteModal?.message || ''}
        onConfirm={deleteModal?.onConfirm || (() => {})}
        onCancel={() => setDeleteModal(null)}
        loading={false}
      />
    </div>
  );
}
