'use client';

import { useState, useEffect } from 'react';
import {
  Loader2, Pencil, X, Check, Search, Plus, Trophy,
  Coins, Users, MapPin, Calendar, Phone, User,
} from 'lucide-react';

interface Competition {
  id: string;
  title: string;
  category: string;
  tagline: string | null;
  description: string | null;
  fee: number;
  maxSlots: number;
  filledSlots: number;
  scheduleDate: string | null;
  location: string | null;
  prizesFirst: string | null;
  prizesSecond: string | null;
  prizesThird: string | null;
  rulesSummary: string[] | null;
  rulebookUrl: string | null;
  contactName: string | null;
  contactWhatsapp: string | null;
}

const emptyForm = {
  id: '',
  title: '',
  category: 'akademik',
  tagline: '',
  description: '',
  fee: 0,
  maxSlots: 0,
  filledSlots: 0,
  scheduleDate: '',
  location: '',
  prizesFirst: '',
  prizesSecond: '',
  prizesThird: '',
  rulesSummary: '',
  rulebookUrl: '',
  contactName: '',
  contactWhatsapp: '',
};

const catColors: Record<string, string> = {
  akademik: 'text-emerald-700 bg-emerald-50 border-emerald-200',
  olahraga: 'text-orange-700 bg-orange-50 border-orange-200',
  esports: 'text-cyan-700 bg-cyan-50 border-cyan-200',
};

/* ─── Form Fields Sub-component ─── */
function FormFields({ form, setForm, isAdd }: { form: any; setForm: (f: any) => void; isAdd?: boolean }) {
  const update = (field: string, value: any) => setForm({ ...form, [field]: value });
  const inp = (field: string) =>
    `w-full px-3 py-2 border border-slate-200 text-sm mt-1 focus:outline-none focus:border-astro-cyan`;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {isAdd && (
        <div>
          <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">ID (slug)</label>
          <input value={form.id} onChange={(e) => update('id', e.target.value.toLowerCase().replace(/\s+/g, '-'))}
            placeholder="contoh: lomba-baru"
            className={inp('id')}
            style={{ clipPath: 'polygon(4px 0, 100% 0, calc(100% - 4px) 100%, 0 100%)' }}
          />
        </div>
      )}
      <div>
        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Judul</label>
        <input value={form.title} onChange={(e) => update('title', e.target.value)}
          className={inp('title')}
          style={{ clipPath: 'polygon(4px 0, 100% 0, calc(100% - 4px) 100%, 0 100%)' }}
        />
      </div>
      <div>
        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Kategori</label>
        <select value={form.category} onChange={(e) => update('category', e.target.value)}
          className={`${inp('category')} cursor-pointer`}
          style={{ clipPath: 'polygon(4px 0, 100% 0, calc(100% - 4px) 100%, 0 100%)' }}
        >
          <option value="akademik">Akademik</option>
          <option value="olahraga">Olahraga</option>
          <option value="esports">Esports</option>
        </select>
      </div>
      <div className="sm:col-span-2">
        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Tagline</label>
        <input value={form.tagline} onChange={(e) => update('tagline', e.target.value)}
          className={inp('tagline')}
          style={{ clipPath: 'polygon(4px 0, 100% 0, calc(100% - 4px) 100%, 0 100%)' }}
        />
      </div>
      <div className="sm:col-span-2">
        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Deskripsi</label>
        <textarea value={form.description} onChange={(e) => update('description', e.target.value)}
          rows={3} className={inp('description')}
          style={{ clipPath: 'polygon(4px 0, 100% 0, calc(100% - 4px) 100%, 0 100%)' }}
        />
      </div>
      <div>
        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1"><Coins className="w-3 h-3" /> Biaya (Rp)</label>
        <input type="number" value={form.fee} onChange={(e) => update('fee', e.target.value)}
          className={inp('fee')}
          style={{ clipPath: 'polygon(4px 0, 100% 0, calc(100% - 4px) 100%, 0 100%)' }}
        />
      </div>
      <div>
        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1"><Users className="w-3 h-3" /> Kuota</label>
        <input type="number" value={form.maxSlots} onChange={(e) => update('maxSlots', e.target.value)}
          className={inp('maxSlots')}
          style={{ clipPath: 'polygon(4px 0, 100% 0, calc(100% - 4px) 100%, 0 100%)' }}
        />
      </div>
      <div>
        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1"><Calendar className="w-3 h-3" /> Tanggal</label>
        <input type="date" value={form.scheduleDate} onChange={(e) => update('scheduleDate', e.target.value)}
          className={inp('scheduleDate')}
          style={{ clipPath: 'polygon(4px 0, 100% 0, calc(100% - 4px) 100%, 0 100%)' }}
        />
      </div>
      <div>
        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1"><MapPin className="w-3 h-3" /> Lokasi</label>
        <input value={form.location} onChange={(e) => update('location', e.target.value)}
          className={inp('location')}
          style={{ clipPath: 'polygon(4px 0, 100% 0, calc(100% - 4px) 100%, 0 100%)' }}
        />
      </div>
      <div className="sm:col-span-2">
        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1"><Trophy className="w-3 h-3" /> Hadiah</label>
        <div className="grid grid-cols-3 gap-3 mt-1">
          <input value={form.prizesFirst} onChange={(e) => update('prizesFirst', e.target.value)}
            placeholder="Juara 1" className={inp('prizesFirst')}
            style={{ clipPath: 'polygon(4px 0, 100% 0, calc(100% - 4px) 100%, 0 100%)' }}
          />
          <input value={form.prizesSecond} onChange={(e) => update('prizesSecond', e.target.value)}
            placeholder="Juara 2" className={inp('prizesSecond')}
            style={{ clipPath: 'polygon(4px 0, 100% 0, calc(100% - 4px) 100%, 0 100%)' }}
          />
          <input value={form.prizesThird} onChange={(e) => update('prizesThird', e.target.value)}
            placeholder="Juara 3" className={inp('prizesThird')}
            style={{ clipPath: 'polygon(4px 0, 100% 0, calc(100% - 4px) 100%, 0 100%)' }}
          />
        </div>
      </div>
      <div className="sm:col-span-2">
        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Aturan (1 baris = 1 aturan)</label>
        <textarea value={form.rulesSummary} onChange={(e) => update('rulesSummary', e.target.value)}
          rows={3} className={inp('rulesSummary')}
          style={{ clipPath: 'polygon(4px 0, 100% 0, calc(100% - 4px) 100%, 0 100%)' }}
        />
      </div>
      <div>
        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1"><User className="w-3 h-3" /> Kontak (Nama)</label>
        <input value={form.contactName} onChange={(e) => update('contactName', e.target.value)}
          className={inp('contactName')}
          style={{ clipPath: 'polygon(4px 0, 100% 0, calc(100% - 4px) 100%, 0 100%)' }}
        />
      </div>
      <div>
        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1"><Phone className="w-3 h-3" /> Kontak (WhatsApp)</label>
        <input value={form.contactWhatsapp} onChange={(e) => update('contactWhatsapp', e.target.value)}
          className={inp('contactWhatsapp')}
          style={{ clipPath: 'polygon(4px 0, 100% 0, calc(100% - 4px) 100%, 0 100%)' }}
        />
      </div>
    </div>
  );
}

export default function KompetisiPage() {
  const [competitions, setCompetitions] = useState<Competition[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<any>({});
  const [showAdd, setShowAdd] = useState(false);
  const [addForm, setAddForm] = useState<any>({ ...emptyForm });
  const [saving, setSaving] = useState(false);

  const fetchData = async () => {
    const res = await fetch('/api/competitions');
    const json = await res.json();
    setCompetitions(json.data || []);
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, []);

  const handleEdit = (comp: Competition) => {
    setShowAdd(false);
    setEditingId(comp.id);
    setEditForm({
      title: comp.title,
      category: comp.category,
      tagline: comp.tagline || '',
      description: comp.description || '',
      fee: comp.fee,
      maxSlots: comp.maxSlots,
      filledSlots: comp.filledSlots,
      scheduleDate: comp.scheduleDate ? comp.scheduleDate.split('T')[0] : '',
      location: comp.location || '',
      prizesFirst: comp.prizesFirst || '',
      prizesSecond: comp.prizesSecond || '',
      prizesThird: comp.prizesThird || '',
      rulesSummary: comp.rulesSummary?.join('\n') || '',
      rulebookUrl: comp.rulebookUrl || '',
      contactName: comp.contactName || '',
      contactWhatsapp: comp.contactWhatsapp || '',
    });
  };

  const handleCancelEdit = () => setEditingId(null);

  const handleSave = async (id: string) => {
    setSaving(true);
    try {
      const body = {
        ...editForm,
        fee: parseInt(editForm.fee) || 0,
        maxSlots: parseInt(editForm.maxSlots) || 0,
        filledSlots: parseInt(editForm.filledSlots) || 0,
        rulesSummary: editForm.rulesSummary.split('\n').filter((s: string) => s.trim()),
        scheduleDate: editForm.scheduleDate ? new Date(editForm.scheduleDate).toISOString() : null,
      };

      await fetch(`/api/competitions/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      setEditingId(null);
      fetchData();
    } catch (err) {
      console.error(err);
    }
    setSaving(false);
  };

  const handleAdd = async () => {
    if (!addForm.title || !addForm.id) return;
    setSaving(true);
    try {
      const body = {
        ...addForm,
        fee: parseInt(addForm.fee) || 0,
        maxSlots: parseInt(addForm.maxSlots) || 0,
        filledSlots: parseInt(addForm.filledSlots) || 0,
        rulesSummary: addForm.rulesSummary.split('\n').filter((s: string) => s.trim()),
        scheduleDate: addForm.scheduleDate ? new Date(addForm.scheduleDate).toISOString() : null,
      };

      await fetch('/api/competitions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      setAddForm({ ...emptyForm });
      setShowAdd(false);
      fetchData();
    } catch (err) {
      console.error(err);
    }
    setSaving(false);
  };

  const filtered = competitions.filter(
    (c) =>
      c.title.toLowerCase().includes(search.toLowerCase()) ||
      c.category.toLowerCase().includes(search.toLowerCase()),
  );

  if (loading) {
    return <div className="flex justify-center py-20"><Loader2 className="w-6 h-6 animate-spin text-astro-cyan" /></div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-slate-900 uppercase tracking-tight">Kompetisi</h1>
          <p className="text-sm text-slate-500 font-light mt-1">{competitions.length} lomba terdaftar</p>
        </div>
        <button
          onClick={() => { setShowAdd(!showAdd); setEditingId(null); }}
          className="flex items-center gap-2 px-5 py-2.5 bg-astro-cyan text-slate-950 font-bold text-xs tracking-wider uppercase transition-all hover:bg-cyan-400 cursor-pointer"
          style={{ clipPath: 'polygon(6px 0, 100% 0, calc(100% - 6px) 100%, 0 100%)' }}
        >
          <Plus className="w-3.5 h-3.5" /> Tambah Lomba
        </button>
      </div>

      {/* Add Form */}
      {showAdd && (
        <div className="bg-white border border-slate-200 relative p-5 space-y-4"
          style={{ clipPath: 'polygon(14px 0, 100% 0, calc(100% - 14px) 100%, 0 100%)' }}
        >
          <div className="absolute -top-[1px] -left-[1px] w-8 h-8 bg-astro-cyan"
            style={{ clipPath: 'polygon(0 0, 100% 0, 0 100%)' }}
          />
          <h2 className="text-sm font-black text-slate-900 uppercase tracking-tight">Tambah Lomba Baru</h2>
          <FormFields form={addForm} setForm={setAddForm} isAdd />
          <div className="flex gap-2 pt-2">
            <button onClick={handleAdd} disabled={saving}
              className="flex items-center gap-1 px-4 py-2 bg-astro-cyan text-slate-950 font-bold text-xs tracking-wider uppercase hover:bg-cyan-400 cursor-pointer"
              style={{ clipPath: 'polygon(5px 0, 100% 0, calc(100% - 5px) 100%, 0 100%)' }}
            >
              {saving ? <Loader2 className="w-3 h-3 animate-spin" /> : <Check className="w-3 h-3" />} Simpan
            </button>
            <button onClick={() => setShowAdd(false)}
              className="flex items-center gap-1 px-4 py-2 border border-slate-300 text-slate-600 font-bold text-xs tracking-wider uppercase hover:bg-slate-50 cursor-pointer"
              style={{ clipPath: 'polygon(5px 0, 100% 0, calc(100% - 5px) 100%, 0 100%)' }}
            >
              <X className="w-3 h-3" /> Batal
            </button>
          </div>
        </div>
      )}

      {/* Search */}
      <div className="relative max-w-xs">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
        <input value={search} onChange={(e) => setSearch(e.target.value)}
          placeholder="Cari lomba..."
          className="w-full pl-9 pr-3 py-2.5 bg-white border border-slate-200 text-xs font-medium focus:outline-none focus:border-astro-cyan"
          style={{ clipPath: 'polygon(5px 0, 100% 0, calc(100% - 5px) 100%, 0 100%)' }}
        />
      </div>

      {/* List */}
      <div className="grid grid-cols-1 gap-4">
        {filtered.map((comp) => (
          <div key={comp.id}
            className="bg-white border border-slate-200 relative"
            style={{ clipPath: 'polygon(14px 0, 100% 0, calc(100% - 14px) 100%, 0 100%)' }}
          >
            <div className="absolute -top-[1px] -left-[1px] w-8 h-8 bg-astro-cyan"
              style={{ clipPath: 'polygon(0 0, 100% 0, 0 100%)' }}
            />
            <div className="p-5">
              {editingId === comp.id ? (
                <div className="space-y-4">
                  <h2 className="text-sm font-black text-slate-900 uppercase tracking-tight">Edit Lomba</h2>
                  <FormFields form={editForm} setForm={setEditForm} />
                  <div className="flex gap-2 pt-2">
                    <button onClick={() => handleSave(comp.id)} disabled={saving}
                      className="flex items-center gap-1 px-4 py-2 bg-astro-cyan text-slate-950 font-bold text-xs tracking-wider uppercase hover:bg-cyan-400 cursor-pointer"
                      style={{ clipPath: 'polygon(5px 0, 100% 0, calc(100% - 5px) 100%, 0 100%)' }}
                    >
                      {saving ? <Loader2 className="w-3 h-3 animate-spin" /> : <Check className="w-3 h-3" />} Simpan
                    </button>
                    <button onClick={handleCancelEdit}
                      className="flex items-center gap-1 px-4 py-2 border border-slate-300 text-slate-600 font-bold text-xs tracking-wider uppercase hover:bg-slate-50 cursor-pointer"
                      style={{ clipPath: 'polygon(5px 0, 100% 0, calc(100% - 5px) 100%, 0 100%)' }}
                    >
                      <X className="w-3 h-3" /> Batal
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-base font-black text-slate-900 uppercase tracking-tight">{comp.title}</h3>
                      <span
                        className={`px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider border ${catColors[comp.category] || 'bg-slate-50 text-slate-600 border-slate-200'}`}
                        style={{ clipPath: 'polygon(3px 0, 100% 0, calc(100% - 3px) 100%, 0 100%)' }}
                      >
                        {comp.category}
                      </span>
                    </div>
                    {comp.tagline && (
                      <p className="text-sm text-slate-500 font-light mb-2">{comp.tagline}</p>
                    )}
                    <div className="flex flex-wrap gap-x-5 gap-y-1.5 text-xs text-slate-600">
                      <span className="flex items-center gap-1"><Coins className="w-3 h-3" /> Rp {comp.fee.toLocaleString('id-ID')}</span>
                      <span className="flex items-center gap-1"><Users className="w-3 h-3" /> {comp.filledSlots}/{comp.maxSlots} terisi</span>
                      {comp.location && <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {comp.location}</span>}
                      {comp.scheduleDate && (
                        <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {new Date(comp.scheduleDate).toLocaleDateString('id-ID')}</span>
                      )}
                    </div>
                  </div>
                  <button onClick={() => handleEdit(comp)}
                    className="p-2 text-slate-400 hover:text-astro-cyan transition-colors cursor-pointer flex-shrink-0"
                    title="Edit"
                  >
                    <Pencil className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
