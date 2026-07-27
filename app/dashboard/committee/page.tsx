'use client';

import { useState, useEffect } from 'react';
import { Loader2, Plus, Pencil, X, Check, Trash2, Users, Building2 } from 'lucide-react';
import { toast } from 'sonner';
import DeleteModal from '@/components/DeleteModal';
import Pagination from '@/components/Pagination';

interface CommitteeMember {
  id: number;
  name: string;
  role: string;
  division: string;
  divisionName: string;
  image: string;
  isLeader: string;
  quote: string | null;
  instagram: string | null;
  linkedin: string | null;
}

interface Division {
  id: number;
  name: string;
  slug: string;
}

const PAGE_SIZE = 10;

export default function CommitteePage() {
  const [items, setItems] = useState<CommitteeMember[]>([]);
  const [divisions, setDivisions] = useState<Division[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [showAdd, setShowAdd] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);
  const [deleteModal, setDeleteModal] = useState<{ title: string; message: string; onConfirm: () => void } | null>(null);
  const [showDivManager, setShowDivManager] = useState(false);
  const [divForm, setDivForm] = useState({ name: '', shortName: '', slug: '' });
  const [divEditingId, setDivEditingId] = useState<number | null>(null);
  const [divSaving, setDivSaving] = useState(false);

  const [form, setForm] = useState({
    name: '', role: '', division: '', divisionName: '', image: '',
    isLeader: '0', quote: '', instagram: '', linkedin: '',
  });

  const fetchData = async () => {
    const [cRes, dRes] = await Promise.all([
      fetch('/api/committee'),
      fetch('/api/committee-divisions'),
    ]);
    setItems((await cRes.json()).data || []);
    setDivisions((await dRes.json()).data || []);
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, []);

  // Auto-select first division
  useEffect(() => {
    if (divisions.length > 0 && !form.division) {
      setForm(f => ({ ...f, division: divisions[0].slug, divisionName: divisions[0].name }));
    }
  }, [divisions]);

  const handleDivisionChange = (slug: string) => {
    const div = divisions.find(d => d.slug === slug);
    setForm({ ...form, division: slug, divisionName: div?.name || slug });
  };

  const handleEdit = (item: CommitteeMember) => {
    setForm({
      name: item.name, role: item.role, division: item.division,
      divisionName: item.divisionName, image: item.image,
      isLeader: item.isLeader, quote: item.quote || '',
      instagram: item.instagram || '', linkedin: item.linkedin || '',
    });
    setEditingId(item.id);
    setShowAdd(true);
  };

  const handleSave = async () => {
    if (!form.name || !form.role || !form.division || !form.image) {
      toast.error('Nama, jabatan, divisi, dan foto wajib diisi'); return;
    }
    setSaving(true);
    try {
      const body = { ...form, divisionName: form.divisionName || form.division };
      if (editingId) {
        await fetch('/api/committee/' + editingId, {
          method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body),
        });
      } else {
        await fetch('/api/committee', {
          method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body),
        });
      }
      setForm({ name: '', role: '', division: divisions[0]?.slug || '', divisionName: divisions[0]?.name || '', image: '', isLeader: '0', quote: '', instagram: '', linkedin: '' });
      setEditingId(null); setShowAdd(false);
      toast.success(editingId ? 'Anggota diperbarui' : 'Anggota ditambahkan');
      fetchData();
    } catch { toast.error('Gagal menyimpan'); }
    setSaving(false);
  };

  const handleDelete = (id: number, name: string) => {
    setDeleteModal({
      title: 'Hapus Anggota', message: 'Yakin ingin menghapus "' + name + '"?',
      onConfirm: async () => {
        const res = await fetch('/api/committee/' + id, { method: 'DELETE' });
        if (!res.ok) { toast.error('Gagal menghapus'); return; }
        toast.success('Anggota dihapus'); setDeleteModal(null); fetchData();
      },
    });
  };

  const handleDivSave = async () => {
    if (!divForm.name || !divForm.slug) { toast.error('Nama dan slug wajib diisi'); return; }
    setDivSaving(true);
    try {
      if (divEditingId) {
        await fetch('/api/committee-divisions', {
          method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: divEditingId, ...divForm }),
        });
      } else {
        await fetch('/api/committee-divisions', {
          method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(divForm),
        });
      }
      setDivForm({ name: '', shortName: '', slug: '' });
      setDivEditingId(null);
      toast.success(divEditingId ? 'Divisi diperbarui' : 'Divisi ditambahkan');
      fetchData();
    } catch { toast.error('Gagal menyimpan divisi'); }
    setDivSaving(false);
  };

  const handleDivEdit = (div: Division) => {
    setDivForm({ name: div.name, shortName: (div as any).shortName || '', slug: div.slug });
    setDivEditingId(div.id);
  };

  const handleDivDelete = async (id: number) => {
    const res = await fetch('/api/committee-divisions?id=' + id, { method: 'DELETE' });
    if (!res.ok) { toast.error('Gagal menghapus divisi'); return; }
    toast.success('Divisi dihapus');
    setDivEditingId(null);
    setDivForm({ name: '', shortName: '', slug: '' });
    fetchData();
  };

  const paginated = items.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  if (loading) return <div className="flex justify-center py-20"><Loader2 className="w-6 h-6 animate-spin text-astro-cyan" /></div>;

  const inp = `w-full px-3 py-2 border border-slate-200 text-sm mt-1 focus:outline-none focus:border-astro-cyan`;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-slate-900 uppercase tracking-tight">Committee</h1>
          <p className="text-sm text-slate-500 font-light mt-1">{items.length} anggota</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => { setShowDivManager(!showDivManager); setShowAdd(false); }}
            className="flex items-center gap-2 px-5 py-2.5 border border-slate-300 text-slate-700 font-bold text-xs tracking-wider uppercase hover:bg-slate-50 cursor-pointer"
            style={{ clipPath: 'polygon(6px 0, 100% 0, calc(100% - 6px) 100%, 0 100%)' }}>
            <Building2 className="w-3.5 h-3.5" /> Kelola Divisi
          </button>
          <button onClick={() => { setShowAdd(!showAdd); setShowDivManager(false); setEditingId(null); setForm({ name: '', role: '', division: divisions[0]?.slug || '', divisionName: divisions[0]?.name || '', image: '', isLeader: '0', quote: '', instagram: '', linkedin: '' }); }}
            className="flex items-center gap-2 px-5 py-2.5 bg-astro-cyan text-slate-950 font-bold text-xs tracking-wider uppercase hover:bg-cyan-400 cursor-pointer"
            style={{ clipPath: 'polygon(6px 0, 100% 0, calc(100% - 6px) 100%, 0 100%)' }}>
            <Plus className="w-3.5 h-3.5" /> Tambah Anggota
          </button>
        </div>
      </div>

      {/* Division Manager */}
      {showDivManager && (
        <div className="bg-white border border-slate-200 relative p-5 space-y-4"
          style={{ clipPath: 'polygon(14px 0, 100% 0, calc(100% - 14px) 100%, 0 100%)' }}>
          <div className="absolute -top-[1px] -left-[1px] w-8 h-8 bg-astro-cyan" style={{ clipPath: 'polygon(0 0, 100% 0, 0 100%)' }} />
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-black text-slate-900 uppercase tracking-tight">Kelola Divisi</h2>
            <button onClick={() => setShowDivManager(false)} className="p-1 text-slate-400 hover:text-slate-600 cursor-pointer"><X className="w-4 h-4" /></button>
          </div>
          <div className="flex gap-3 items-end">
            <div className="flex-1">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Nama Divisi</label>
              <input value={divForm.name} onChange={(e) => setDivForm({ ...divForm, name: e.target.value, slug: divEditingId ? divForm.slug : e.target.value.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '') })}
                placeholder="Badan Pengurus Harian" className={inp}
                style={{ clipPath: 'polygon(4px 0, 100% 0, calc(100% - 4px) 100%, 0 100%)' }} />
            </div>
            <div className="flex-1">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Singkatan <span className="text-slate-400 font-normal normal-case">(opsional)</span></label>
              <input value={divForm.shortName} onChange={(e) => setDivForm({ ...divForm, shortName: e.target.value })}
                placeholder="BPH" className={inp}
                style={{ clipPath: 'polygon(4px 0, 100% 0, calc(100% - 4px) 100%, 0 100%)' }} />
            </div>
            <div className="flex-1">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Slug</label>
              <input value={divForm.slug} onChange={(e) => setDivForm({ ...divForm, slug: e.target.value })}
                placeholder="bph" className={inp}
                style={{ clipPath: 'polygon(4px 0, 100% 0, calc(100% - 4px) 100%, 0 100%)' }} />
            </div>
            <button onClick={handleDivSave} disabled={divSaving}
              className="px-4 py-2 bg-astro-cyan text-slate-950 font-bold text-xs tracking-wider uppercase hover:bg-cyan-400 disabled:bg-slate-200 cursor-pointer"
              style={{ clipPath: 'polygon(5px 0, 100% 0, calc(100% - 5px) 100%, 0 100%)' }}>
              {divSaving ? <Loader2 className="w-3 h-3 animate-spin" /> : divEditingId ? <Check className="w-3 h-3" /> : <Plus className="w-3 h-3" />}
            </button>
            {divEditingId && (
              <button onClick={() => { setDivEditingId(null); setDivForm({ name: '', shortName: '', slug: '' }); }}
                className="px-4 py-2 border border-slate-300 text-slate-600 font-bold text-xs tracking-wider uppercase hover:bg-slate-50 cursor-pointer"
                style={{ clipPath: 'polygon(5px 0, 100% 0, calc(100% - 5px) 100%, 0 100%)' }}>
                Batal
              </button>
            )}
          </div>
          <div className="flex flex-wrap gap-2">
            {divisions.map((d) => {
              const displayLabel = d.shortName ? `${d.name} (${d.shortName})` : d.name;
              return (
                <div key={d.id} className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 border border-slate-200 text-xs font-bold text-slate-700">
                  <span>{displayLabel}</span>
                  <button onClick={() => handleDivEdit(d)} className="text-slate-400 hover:text-astro-cyan cursor-pointer ml-1"><Pencil className="w-3 h-3" /></button>
                  <button onClick={() => handleDivDelete(d.id)} className="text-slate-400 hover:text-red-500 cursor-pointer"><X className="w-3 h-3" /></button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {showAdd && (
        <div className="bg-white border border-slate-200 relative p-5 space-y-4"
          style={{ clipPath: 'polygon(14px 0, 100% 0, calc(100% - 14px) 100%, 0 100%)' }}>
          <div className="absolute -top-[1px] -left-[1px] w-8 h-8 bg-astro-cyan" style={{ clipPath: 'polygon(0 0, 100% 0, 0 100%)' }} />
          <h2 className="text-sm font-black text-slate-900 uppercase tracking-tight">{editingId ? 'Edit' : 'Tambah'} Anggota</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Nama <span className="text-red-400">*</span></label>
              <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Nama" className={inp}
                style={{ clipPath: 'polygon(4px 0, 100% 0, calc(100% - 4px) 100%, 0 100%)' }} />
            </div>
            <div>
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Jabatan <span className="text-red-400">*</span></label>
              <input value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}
                placeholder="Ketua Pelaksana / Staf" className={inp}
                style={{ clipPath: 'polygon(4px 0, 100% 0, calc(100% - 4px) 100%, 0 100%)' }} />
            </div>
            <div>
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Tipe</label>
              <div className="flex gap-2 mt-1">
                <button type="button" onClick={() => setForm({ ...form, isLeader: '1' })}
                  className={`flex-1 px-3 py-2 text-xs font-bold tracking-wider uppercase transition-all cursor-pointer ${form.isLeader === '1' ? 'bg-astro-cyan text-slate-950' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'}`}
                  style={{ clipPath: 'polygon(4px 0, 100% 0, calc(100% - 4px) 100%, 0 100%)' }}>Koordinator</button>
                <button type="button" onClick={() => setForm({ ...form, isLeader: '0' })}
                  className={`flex-1 px-3 py-2 text-xs font-bold tracking-wider uppercase transition-all cursor-pointer ${form.isLeader === '0' ? 'bg-astro-cyan text-slate-950' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'}`}
                  style={{ clipPath: 'polygon(4px 0, 100% 0, calc(100% - 4px) 100%, 0 100%)' }}>Staf</button>
              </div>
            </div>
            <div>
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Divisi <span className="text-red-400">*</span></label>
              <select value={form.division} onChange={(e) => handleDivisionChange(e.target.value)}
                className={inp + ' cursor-pointer'}
                style={{ clipPath: 'polygon(4px 0, 100% 0, calc(100% - 4px) 100%, 0 100%)' }}>
                {divisions.map((d) => {
                  const label = d.shortName ? `${d.name} (${d.shortName})` : d.name;
                  return <option key={d.slug} value={d.slug}>{label}</option>;
                })}
              </select>
              <input type="hidden" value={form.divisionName} />
            </div>
            <div>
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Quote</label>
              <input value={form.quote} onChange={(e) => setForm({ ...form, quote: e.target.value })}
                placeholder="Quote" className={inp}
                style={{ clipPath: 'polygon(4px 0, 100% 0, calc(100% - 4px) 100%, 0 100%)' }} />
            </div>
            <div>
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Instagram</label>
              <input value={form.instagram} onChange={(e) => setForm({ ...form, instagram: e.target.value })}
                placeholder="@username" className={inp}
                style={{ clipPath: 'polygon(4px 0, 100% 0, calc(100% - 4px) 100%, 0 100%)' }} />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">LinkedIn</label>
              <input value={form.linkedin} onChange={(e) => setForm({ ...form, linkedin: e.target.value })}
                placeholder="URL LinkedIn" className={inp}
                style={{ clipPath: 'polygon(4px 0, 100% 0, calc(100% - 4px) 100%, 0 100%)' }} />
            </div>
            <div>
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Foto <span className="text-red-400">*</span></label>
              <div className="flex items-center gap-3 mt-1">
                <label className="cursor-pointer">
                  <div className="px-4 py-2 bg-slate-100 border border-slate-200 hover:bg-slate-200 transition-colors text-xs font-bold text-slate-700 uppercase tracking-wider"
                    style={{ clipPath: 'polygon(5px 0, 100% 0, calc(100% - 5px) 100%, 0 100%)' }}>
                    Upload File
                  </div>
                  <input type="file" accept="image/*" className="hidden"
                    onChange={async (e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;
                      const fd = new FormData();
                      fd.append('file', file);
                      try {
                        const res = await fetch('/api/upload', { method: 'POST', body: fd });
                        const json = await res.json();
                        if (json.url) setForm({ ...form, image: json.url });
                      } catch { console.error('Upload failed'); }
                    }} />
                </label>
                <span className="text-[10px] text-slate-400">atau</span>
                <input value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })}
                  placeholder="Atau URL gambar..." className={`${inp} flex-1`}
                  style={{ clipPath: 'polygon(4px 0, 100% 0, calc(100% - 4px) 100%, 0 100%)' }} />
              </div>
            </div>
          </div>
          {form.image && (
            <div className="flex items-center gap-3 p-3 bg-slate-50 border border-slate-200"
              style={{ clipPath: 'polygon(6px 0, 100% 0, calc(100% - 6px) 100%, 0 100%)' }}>
              <img src={form.image} alt="Preview" className="w-12 h-12 object-cover rounded-full" />
              <span className="text-xs text-slate-500">Preview</span>
              <button onClick={() => setForm({ ...form, image: '' })}
                className="ml-auto text-xs text-red-500 hover:text-red-700 cursor-pointer">Hapus</button>
            </div>
          )}
          <div className="flex gap-2 pt-2">
            <button onClick={handleSave} disabled={saving}
              className="flex items-center gap-1 px-4 py-2 bg-astro-cyan text-slate-950 font-bold text-xs tracking-wider uppercase hover:bg-cyan-400 disabled:bg-slate-200 disabled:text-slate-400 cursor-pointer"
              style={{ clipPath: 'polygon(5px 0, 100% 0, calc(100% - 5px) 100%, 0 100%)' }}>
              {saving ? <Loader2 className="w-3 h-3 animate-spin" /> : <Check className="w-3 h-3" />} Simpan
            </button>
            <button onClick={() => { setShowAdd(false); setEditingId(null); setForm({ name: '', role: '', division: divisions[0]?.slug || '', divisionName: divisions[0]?.name || '', image: '', isLeader: '0', quote: '', instagram: '', linkedin: '' }); }}
              className="flex items-center gap-1 px-4 py-2 border border-slate-300 text-slate-600 font-bold text-xs tracking-wider uppercase hover:bg-slate-50 cursor-pointer"
              style={{ clipPath: 'polygon(5px 0, 100% 0, calc(100% - 5px) 100%, 0 100%)' }}>
              <X className="w-3 h-3" /> Batal
            </button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 gap-3">
        {paginated.map((item) => (
          <div key={item.id} className="bg-white border border-slate-200 relative p-4 flex items-center justify-between group"
            style={{ clipPath: 'polygon(12px 0, 100% 0, calc(100% - 12px) 100%, 0 100%)' }}>
            <div className="flex items-center gap-3">
              {item.image && <img src={item.image} alt="" className="w-10 h-10 object-cover rounded-full" />}
              <div>
                <span className="text-sm font-bold text-slate-900">{item.name}</span>
                <div className="flex gap-2 mt-0.5">
                  <span className="text-[10px] font-semibold text-slate-500">{item.role}</span>
                  {item.isLeader === '1' && (
                    <span className="text-[9px] font-bold uppercase text-amber-700 bg-amber-50 border border-amber-200 px-1.5 py-0.5"
                      style={{ clipPath: 'polygon(2px 0, 100% 0, calc(100% - 2px) 100%, 0 100%)' }}>Koordinator</span>
                  )}
                  <span className="text-[10px] text-slate-400">|</span>
                  <span className="text-[10px] text-slate-500">{item.divisionName || item.division}</span>
                </div>
              </div>
            </div>
            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <button onClick={() => handleEdit(item)} className="p-1.5 text-slate-400 hover:text-astro-cyan cursor-pointer"><Pencil className="w-3.5 h-3.5" /></button>
              <button onClick={() => handleDelete(item.id, item.name)} className="p-1.5 text-slate-400 hover:text-red-500 cursor-pointer"><Trash2 className="w-3.5 h-3.5" /></button>
            </div>
          </div>
        ))}
        {items.length === 0 && <p className="text-sm text-slate-400 italic py-4 text-center">Belum ada anggota committee.</p>}
      </div>
      <Pagination currentPage={page} totalItems={items.length} pageSize={PAGE_SIZE} onPageChange={setPage} />

      <DeleteModal open={!!deleteModal} title={deleteModal?.title || ''} message={deleteModal?.message || ''}
        onConfirm={deleteModal?.onConfirm || (() => {})} onCancel={() => setDeleteModal(null)} loading={false} />
    </div>
  );
}
