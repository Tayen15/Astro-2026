'use client';

import { useState, useEffect } from 'react';
import {
  Loader2, Pencil, X, Check, Search, Plus, Trophy,
  Coins, Users, MapPin, Calendar, Phone, User, Tag,
  Trash2, EyeOff, Eye, Clock,
} from 'lucide-react';
import { toast } from 'sonner';
import DeleteModal from '@/components/DeleteModal';
import Pagination from '@/components/Pagination';

const PAGE_SIZE = 10;

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
  isActive: string | null;
  type: string | null;
  maxTeamMembers: number | null;
  minTeamMembers: number | null;
  membersRequired: string | null;
}

interface Category {
  id: string;
  label: string;
  color: string;
  sortOrder: number;
}

const emptyForm = {
  id: '',
  title: '',
  category: 'akademik',
  type: 'individual',
  maxTeamMembers: 5,
  minTeamMembers: 3,
  membersRequired: 'required',
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
  isActive: '1',
  feeDisplay: '',
  isFree: false,
  origin: 'internal',
};

/* ─── Form Fields Sub-component ─── */
function formatRupiah(val: string) {
  const num = val.replace(/\D/g, '');
  if (!num) return '';
  return new Intl.NumberFormat('id-ID').format(Number(num));
}

function parseRupiah(val: string) {
  return Number(val.replace(/\D/g, '')) || 0;
}

function FormFields({ form, setForm, isAdd, categories }: { form: any; setForm: (f: any) => void; isAdd?: boolean; categories: Category[] }) {
  const update = (field: string, value: any) => {
    const updated = { ...form, [field]: value };
    // Auto-generate slug from title when adding
    if (isAdd && field === 'title') {
      updated.id = value.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    }
    setForm(updated);
  };
  const inp = (field: string) =>
    `w-full px-3 py-2 border border-slate-200 text-sm mt-1 focus:outline-none focus:border-astro-cyan`;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {isAdd && (
        <div>
          <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">ID (slug)</label>
          <input value={form.id} readOnly
            className={`${inp('id')} bg-slate-50 text-slate-400 cursor-not-allowed`}
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
        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1"><Tag className="w-3 h-3" /> Kategori</label>
        <div className="flex gap-2 mt-1">
          <select value={form.category} onChange={(e) => update('category', e.target.value)}
            className={`${inp('category')} cursor-pointer flex-1`}
            style={{ clipPath: 'polygon(4px 0, 100% 0, calc(100% - 4px) 100%, 0 100%)' }}
          >
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>{cat.label}</option>
            ))}
          </select>
        </div>
      </div>
      <div>
        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1"><Users className="w-3 h-3" /> Tipe</label>
        <div className="flex gap-2 mt-1">
          <button type="button" onClick={() => update('type', 'individual')}
            className={`flex-1 px-3 py-2 text-xs font-bold tracking-wider uppercase transition-all cursor-pointer ${
              form.type === 'individual' ? 'bg-astro-cyan text-slate-950' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
            style={{ clipPath: 'polygon(4px 0, 100% 0, calc(100% - 4px) 100%, 0 100%)' }}
          >
            Individu
          </button>
          <button type="button" onClick={() => update('type', 'team')}
            className={`flex-1 px-3 py-2 text-xs font-bold tracking-wider uppercase transition-all cursor-pointer ${
              form.type === 'team' ? 'bg-astro-cyan text-slate-950' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
            style={{ clipPath: 'polygon(4px 0, 100% 0, calc(100% - 4px) 100%, 0 100%)' }}
          >
            Tim
          </button>
        </div>
      </div>
      {form.type === 'team' && (
        <div>
          <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1"><Users className="w-3 h-3" /> Maksimal Anggota per Tim</label>
          <input type="number" min={1} value={form.maxTeamMembers} onChange={(e) => update('maxTeamMembers', parseInt(e.target.value) || 1)}
            className={inp('maxTeamMembers')}
            style={{ clipPath: 'polygon(4px 0, 100% 0, calc(100% - 4px) 100%, 0 100%)' }}
          />
        </div>
      )}
      {form.type === 'team' && (
        <div>
          <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1"><Users className="w-3 h-3" /> Minimal Anggota per Tim (wajib diisi)</label>
          <input type="number" min={1} max={form.maxTeamMembers} value={form.minTeamMembers} onChange={(e) => update('minTeamMembers', parseInt(e.target.value) || 1)}
            className={inp('minTeamMembers')}
            style={{ clipPath: 'polygon(4px 0, 100% 0, calc(100% - 4px) 100%, 0 100%)' }}
          />
        </div>
      )}
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
        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1"><Tag className="w-3 h-3" /> Tipe Lomba</label>
        <div className="flex gap-2 mt-1">
          <button type="button" onClick={() => update('origin', 'internal')}
            className={'flex-1 px-3 py-2 text-xs font-bold tracking-wider uppercase transition-all cursor-pointer ' + (form.origin === 'internal' ? 'bg-astro-cyan text-slate-950' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50')}
            style={{ clipPath: 'polygon(4px 0, 100% 0, calc(100% - 4px) 100%, 0 100%)' }}>Internal</button>
          <button type="button" onClick={() => update('origin', 'external')}
            className={'flex-1 px-3 py-2 text-xs font-bold tracking-wider uppercase transition-all cursor-pointer ' + (form.origin === 'external' ? 'bg-astro-cyan text-slate-950' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50')}
            style={{ clipPath: 'polygon(4px 0, 100% 0, calc(100% - 4px) 100%, 0 100%)' }}>Eksternal</button>
        </div>
      </div>
      <div>
        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1"><Coins className="w-3 h-3" /> Biaya</label>
        <div className="flex gap-2 mt-1">
          <button type="button" onClick={() => update('isFree', false)}
            className={'flex-1 px-3 py-2 text-xs font-bold tracking-wider uppercase transition-all cursor-pointer ' + (!form.isFree ? 'bg-astro-cyan text-slate-950' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50')}
            style={{ clipPath: 'polygon(4px 0, 100% 0, calc(100% - 4px) 100%, 0 100%)' }}>Berbayar</button>
          <button type="button" onClick={() => update('isFree', true)}
            className={'flex-1 px-3 py-2 text-xs font-bold tracking-wider uppercase transition-all cursor-pointer ' + (form.isFree ? 'bg-astro-cyan text-slate-950' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50')}
            style={{ clipPath: 'polygon(4px 0, 100% 0, calc(100% - 4px) 100%, 0 100%)' }}>Gratis</button>
        </div>
        {!form.isFree && (
          <div className="relative mt-2">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-bold text-slate-500">Rp</span>
            <input type="text" inputMode="numeric" value={form.feeDisplay || formatRupiah(String(form.fee))} onChange={(e) => { update('feeDisplay', formatRupiah(e.target.value)); update('fee', parseRupiah(e.target.value)); }}
              className={inp('fee') + ' pl-10'} style={{ clipPath: 'polygon(4px 0, 100% 0, calc(100% - 4px) 100%, 0 100%)' }} />
          </div>
        )}
      </div>
      <div>
        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1"><Users className="w-3 h-3" /> {form.type === 'team' ? 'Kuota Tim' : 'Kuota Peserta'}</label>
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
        <input type="tel" inputMode="numeric" value={form.contactWhatsapp} onChange={(e) => update('contactWhatsapp', e.target.value.replace(/\D/g, ''))}
          className={inp('contactWhatsapp')}
          style={{ clipPath: 'polygon(4px 0, 100% 0, calc(100% - 4px) 100%, 0 100%)' }}
          placeholder="62812XXXXXXXX"
        />
      </div>
    </div>
  );
}

export default function KompetisiPage() {
  const [competitions, setCompetitions] = useState<Competition[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [sortBy, setSortBy] = useState<'newest' | 'az' | 'za'>('newest');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<any>({});
  const [showAdd, setShowAdd] = useState(false);
  const [addForm, setAddForm] = useState<any>({ ...emptyForm });
  const [saving, setSaving] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Category manager state
  const [showCatManager, setShowCatManager] = useState(false);
  const [catForm, setCatForm] = useState({ id: '', label: '', color: 'text-cyan-700 bg-cyan-50 border-cyan-200' });
  const [editingCatId, setEditingCatId] = useState<string | null>(null);
  const [catSaving, setCatSaving] = useState(false);

  // Delete modal
  const [deleteModal, setDeleteModal] = useState<{ title: string; message: string; onConfirm: () => void } | null>(null);

  // Timeline manager state
  interface TimelineItemData {
    id: number;
    competitionId: string;
    date: string;
    title: string;
    desc: string;
    sortOrder: number;
  }
  const [timelineOpen, setTimelineOpen] = useState<string | null>(null);
  const [timelineItems, setTimelineItems] = useState<Record<string, TimelineItemData[]>>({});
  const [tlForm, setTlForm] = useState({ date: '', title: '', desc: '' });
  const [tlEditingId, setTlEditingId] = useState<number | null>(null);
  const [tlSaving, setTlSaving] = useState(false);
  const [tlDateRange, setTlDateRange] = useState({ start: '', end: '' });

  const fetchData = async () => {
    const [compRes, catRes] = await Promise.all([
      fetch('/api/competitions'),
      fetch('/api/categories'),
    ]);
    const compJson = await compRes.json();
    const catJson = await catRes.json();
    setCompetitions(compJson.data || []);
    setCategories(catJson.data || []);
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, []);

  /* ─── Competition CRUD ─── */
  const handleEdit = (comp: Competition) => {
    setShowAdd(false);
    setEditingId(comp.id);
    setEditForm({
      title: comp.title,
      category: comp.category,
      type: comp.type || 'individual',
      maxTeamMembers: comp.maxTeamMembers || 5,
      minTeamMembers: comp.minTeamMembers || 1,
      membersRequired: comp.membersRequired || 'optional',
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
      feeDisplay: formatRupiah(String(comp.fee)),
      isFree: (comp as any).isFree === '1' || (comp as any).isFree === true,
      origin: (comp as any).origin || 'internal',
    });
  };

  const handleCancelEdit = () => setEditingId(null);

  const handleSave = async (id: string) => {
    setSaving(true);
    try {
      const { feeDisplay, ...submitData } = editForm;
      await fetch(`/api/competitions/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...submitData,
          fee: parseRupiah(String(editForm.fee)) || 0,
          maxSlots: parseInt(editForm.maxSlots) || 0,
          filledSlots: parseInt(editForm.filledSlots) || 0,
          rulesSummary: editForm.rulesSummary.split('\n').filter((s: string) => s.trim()),
          scheduleDate: editForm.scheduleDate ? new Date(editForm.scheduleDate).toISOString() : null,
        }),
      });
      setEditingId(null);
      toast.success('Lomba berhasil diperbarui');
      fetchData();
    } catch (err) { console.error(err); toast.error('Gagal menyimpan lomba'); }
    setSaving(false);
  };

  const handleAdd = async () => {
    if (!addForm.title || !addForm.id) return;
    setSaving(true);
    try {
      const { feeDisplay, ...submitData } = addForm;
      await fetch('/api/competitions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...submitData,
          fee: parseRupiah(String(addForm.fee)) || 0,
          maxSlots: parseInt(addForm.maxSlots) || 0,
          filledSlots: parseInt(addForm.filledSlots) || 0,
          rulesSummary: addForm.rulesSummary.split('\n').filter((s: string) => s.trim()),
          scheduleDate: addForm.scheduleDate ? new Date(addForm.scheduleDate).toISOString() : null,
        }),
      });
      setAddForm({ ...emptyForm });
      setShowAdd(false);
      toast.success('Lomba berhasil ditambahkan');
      fetchData();
    } catch (err) { console.error(err); toast.error('Gagal menambahkan lomba'); }
    setSaving(false);
  };

  /* ─── Toggle Active ─── */
  const handleToggleActive = async (comp: Competition) => {
    try {
      await fetch(`/api/competitions/${comp.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: comp.title,
          category: comp.category,
          tagline: comp.tagline,
          description: comp.description,
          fee: comp.fee,
          maxSlots: comp.maxSlots,
          filledSlots: comp.filledSlots,
          scheduleDate: comp.scheduleDate,
          location: comp.location,
          prizesFirst: comp.prizesFirst,
          prizesSecond: comp.prizesSecond,
          prizesThird: comp.prizesThird,
          rulesSummary: comp.rulesSummary,
          rulebookUrl: comp.rulebookUrl,
          contactName: comp.contactName,
          contactWhatsapp: comp.contactWhatsapp,
          isActive: comp.isActive !== '1',
        }),
      });
      toast.success(comp.isActive === '1' ? 'Lomba dinonaktifkan' : 'Lomba diaktifkan');
      fetchData();
    } catch (err) { console.error(err); toast.error('Gagal mengubah status'); }
  };

  /* ─── Delete Competition ─── */
  const handleDeleteComp = (id: string) => {
    setDeleteModal({
      title: 'Hapus Lomba',
      message: 'Yakin ingin menghapus lomba ini? Tindakan ini tidak bisa dibatalkan.',
      onConfirm: async () => {
        setDeleteLoading(true);
        try {
          const res = await fetch(`/api/competitions/${id}`, { method: 'DELETE' });
          const json = await res.json();
          if (!res.ok) { toast.error(json.error); setDeleteLoading(false); return; }
          toast.success('Lomba berhasil dihapus');
          fetchData();
        } catch (err) { console.error(err); toast.error('Gagal menghapus lomba'); }
      },
    });
  };

  /* ─── Timeline CRUD ─── */
  const composeDate = (start: string, end: string) => {
    if (!start) return '';
    const s = new Date(start + 'T00:00:00').toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
    if (!end) return s;
    const e = new Date(end + 'T00:00:00').toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
    return s === e ? s : `${s} - ${e}`;
  };

  const handleTimelineOpen = async (compId: string) => {
    if (timelineOpen === compId) {
      setTimelineOpen(null);
      return;
    }
    setTimelineOpen(compId);
    setTlEditingId(null);
    setTlForm({ date: '', title: '', desc: '' });
    setTlDateRange({ start: '', end: '' });
    try {
      const res = await fetch(`/api/competitions/${compId}/timeline`);
      const json = await res.json();
      setTimelineItems((prev) => ({ ...prev, [compId]: json.data || [] }));
    } catch {
      toast.error('Gagal memuat timeline');
    }
  };

  const handleTlSave = async (compId: string) => {
    const dateStr = composeDate(tlDateRange.start, tlDateRange.end);
    if (!tlForm.title || !dateStr || !tlForm.desc) {
      toast.error('Judul, tanggal, dan deskripsi wajib diisi');
      return;
    }
    const payload = { ...tlForm, date: dateStr, desc: tlForm.desc };
    setTlSaving(true);
    try {
      if (tlEditingId) {
        await fetch(`/api/competitions/${compId}/timeline/${tlEditingId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      } else {
        await fetch(`/api/competitions/${compId}/timeline`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      }
      setTlForm({ date: '', title: '', desc: '' });
      setTlDateRange({ start: '', end: '' });
      setTlEditingId(null);
      toast.success(tlEditingId ? 'Timeline diperbarui' : 'Timeline ditambahkan');
      const res = await fetch(`/api/competitions/${compId}/timeline`);
      const json = await res.json();
      setTimelineItems((prev) => ({ ...prev, [compId]: json.data || [] }));
    } catch {
      toast.error('Gagal menyimpan timeline');
    }
    setTlSaving(false);
  };

  const handleTlEdit = (item: TimelineItemData) => {
    setTlEditingId(item.id);
    setTlForm({ date: item.date, title: item.title, desc: item.desc });
    // Try to parse existing date back to range
    const parts = item.date.split(' - ');
    if (parts.length === 2) {
      // Convert Indonesian date-ish back to YYYY-MM-DD — best effort
      const guess = (s: string) => {
        try { return new Date(s).toISOString().split('T')[0]; } catch { return ''; }
      };
      setTlDateRange({ start: guess(parts[0]), end: guess(parts[1]) });
    } else {
      const d = new Date(item.date).toISOString().split('T')[0];
      setTlDateRange({ start: d, end: '' });
    }
  };

  const handleTlDelete = async (compId: string, itemId: number) => {
    if (!confirm('Hapus item timeline ini?')) return;
    try {
      await fetch(`/api/competitions/${compId}/timeline/${itemId}`, { method: 'DELETE' });
      toast.success('Item timeline dihapus');
      const res = await fetch(`/api/competitions/${compId}/timeline`);
      const json = await res.json();
      setTimelineItems((prev) => ({ ...prev, [compId]: json.data || [] }));
    } catch {
      toast.error('Gagal menghapus item timeline');
    }
  };

  /* ─── Category CRUD ─── */
  const handleCatSave = async () => {
    if (!catForm.label) return;
    setCatSaving(true);
    try {
      if (editingCatId) {
        await fetch(`/api/categories/${editingCatId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(catForm),
        });
        setEditingCatId(null);
      } else {
        await fetch('/api/categories', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(catForm),
        });
      }
      setCatForm({ id: '', label: '', color: 'text-cyan-700 bg-cyan-50 border-cyan-200' });
      fetchData();
    } catch (err) { console.error(err); }
    setCatSaving(false);
  };

  const handleCatEdit = (cat: Category) => {
    setCatForm({ id: cat.id, label: cat.label, color: cat.color });
    setEditingCatId(cat.id);
  };

  const handleCatDelete = (id: string) => {
    setDeleteModal({
      title: 'Hapus Kategori',
      message: 'Yakin ingin menghapus kategori ini? Hanya bisa dihapus jika tidak ada lomba yang menggunakannya.',
      onConfirm: async () => {
        setDeleteModal(null);
        const res = await fetch(`/api/categories/${id}`, { method: 'DELETE' });
        const json = await res.json();
        if (!res.ok) { alert(json.error); return; }
        fetchData();
      },
    });
  };

  const categoryOptions = [
    { value: '', label: 'Semua Kategori' },
    ...categories.map((c) => ({ value: c.id, label: c.label })),
  ];

  const filtered = [...competitions]
    .filter((c) => !search || c.title.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => {
      if (sortBy === 'az') return a.title.localeCompare(b.title);
      if (sortBy === 'za') return b.title.localeCompare(a.title);
      return 0; // newest — keep DB order
    });
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  if (loading) {
    return <div className="flex justify-center py-20"><Loader2 className="w-6 h-6 animate-spin text-astro-cyan" /></div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-slate-900 uppercase tracking-tight">Kompetisi</h1>
          <p className="text-sm text-slate-500 font-light mt-1">{competitions.length} lomba terdaftar</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => { setShowCatManager(!showCatManager); setShowAdd(false); setEditingId(null); }}
            className="flex items-center gap-2 px-5 py-2.5 border border-slate-300 text-slate-700 font-bold text-xs tracking-wider uppercase transition-all hover:bg-slate-50 cursor-pointer"
            style={{ clipPath: 'polygon(6px 0, 100% 0, calc(100% - 6px) 100%, 0 100%)' }}
          >
            <Tag className="w-3.5 h-3.5" /> Kelola Kategori
          </button>
          <button onClick={() => { setShowAdd(!showAdd); setEditingId(null); }}
            className="flex items-center gap-2 px-5 py-2.5 bg-astro-cyan text-slate-950 font-bold text-xs tracking-wider uppercase transition-all hover:bg-cyan-400 cursor-pointer"
            style={{ clipPath: 'polygon(6px 0, 100% 0, calc(100% - 6px) 100%, 0 100%)' }}
          >
            <Plus className="w-3.5 h-3.5" /> Tambah Lomba
          </button>
        </div>
      </div>

      {/* Category Manager */}
      {showCatManager && (
        <div className="bg-white border border-slate-200 relative p-5 space-y-4"
          style={{ clipPath: 'polygon(14px 0, 100% 0, calc(100% - 14px) 100%, 0 100%)' }}
        >
          <div className="absolute -top-[1px] -left-[1px] w-8 h-8 bg-astro-cyan"
            style={{ clipPath: 'polygon(0 0, 100% 0, 0 100%)' }}
          />
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-black text-slate-900 uppercase tracking-tight">Kelola Kategori</h2>
            <button onClick={() => setShowCatManager(false)}
              className="p-1 text-slate-400 hover:text-slate-600 cursor-pointer"><X className="w-4 h-4" /></button>
          </div>

          {/* Add/Edit form */}
          <div className="flex gap-3 items-end">
            <div className="flex-1">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Label</label>
              <input value={catForm.label} onChange={(e) => setCatForm({ ...catForm, label: e.target.value, id: editingCatId ? catForm.id : e.target.value.toLowerCase().replace(/\s+/g, '-') })}
                placeholder="Nama kategori"
                className="w-full px-3 py-2 border border-slate-200 text-sm mt-1 focus:outline-none focus:border-astro-cyan"
                style={{ clipPath: 'polygon(4px 0, 100% 0, calc(100% - 4px) 100%, 0 100%)' }}
              />
            </div>
            {!editingCatId && (
              <div className="flex-1">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">ID</label>
                <input value={catForm.id} onChange={(e) => setCatForm({ ...catForm, id: e.target.value })}
                  placeholder="slug-kategori"
                  className="w-full px-3 py-2 border border-slate-200 text-sm mt-1 focus:outline-none focus:border-astro-cyan"
                  style={{ clipPath: 'polygon(4px 0, 100% 0, calc(100% - 4px) 100%, 0 100%)' }}
                />
              </div>
            )}
            <select value={catForm.color} onChange={(e) => setCatForm({ ...catForm, color: e.target.value })}
              className="flex-1 px-3 py-2 border border-slate-200 text-xs mt-5 focus:outline-none focus:border-astro-cyan cursor-pointer"
              style={{ clipPath: 'polygon(4px 0, 100% 0, calc(100% - 4px) 100%, 0 100%)' }}
            >
              <option value="text-emerald-700 bg-emerald-50 border-emerald-200">Hijau (Akademik)</option>
              <option value="text-orange-700 bg-orange-50 border-orange-200">Oranye (Olahraga)</option>
              <option value="text-cyan-700 bg-cyan-50 border-cyan-200">Cyan (Esports)</option>
              <option value="text-purple-700 bg-purple-50 border-purple-200">Ungu</option>
              <option value="text-pink-700 bg-pink-50 border-pink-200">Pink</option>
              <option value="text-sky-700 bg-sky-50 border-sky-200">Sky</option>
              <option value="text-amber-700 bg-amber-50 border-amber-200">Amber</option>
            </select>
            <button onClick={handleCatSave} disabled={catSaving}
              className="px-4 py-2 bg-astro-cyan text-slate-950 font-bold text-xs tracking-wider uppercase hover:bg-cyan-400 disabled:bg-slate-200 disabled:text-slate-400 cursor-pointer"
              style={{ clipPath: 'polygon(5px 0, 100% 0, calc(100% - 5px) 100%, 0 100%)' }}
            >
              {catSaving ? <Loader2 className="w-3 h-3 animate-spin" /> : editingCatId ? <Check className="w-3 h-3" /> : <Plus className="w-3 h-3" />}
            </button>
            {editingCatId && (
              <button onClick={() => { setEditingCatId(null); setCatForm({ id: '', label: '', color: 'text-cyan-700 bg-cyan-50 border-cyan-200' }); }}
                className="px-4 py-2 border border-slate-300 text-slate-600 font-bold text-xs tracking-wider uppercase hover:bg-slate-50 cursor-pointer"
                style={{ clipPath: 'polygon(5px 0, 100% 0, calc(100% - 5px) 100%, 0 100%)' }}
              >Batal</button>
            )}
          </div>

          {/* Categories list */}
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <div key={cat.id}
                className={`flex items-center gap-2 px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider border ${cat.color}`}
                style={{ clipPath: 'polygon(4px 0, 100% 0, calc(100% - 4px) 100%, 0 100%)' }}
              >
                <span>{cat.label}</span>
                <button onClick={() => handleCatEdit(cat)} className="hover:opacity-60 cursor-pointer"><Pencil className="w-3 h-3" /></button>
                <button onClick={() => handleCatDelete(cat.id)} className="hover:opacity-60 cursor-pointer"><X className="w-3 h-3" /></button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Add Form */}
      {showAdd && (
        <div className="bg-white border border-slate-200 relative p-5 space-y-4"
          style={{ clipPath: 'polygon(14px 0, 100% 0, calc(100% - 14px) 100%, 0 100%)' }}
        >
          <div className="absolute -top-[1px] -left-[1px] w-8 h-8 bg-astro-cyan"
            style={{ clipPath: 'polygon(0 0, 100% 0, 0 100%)' }}
          />
          <h2 className="text-sm font-black text-slate-900 uppercase tracking-tight">Tambah Lomba Baru</h2>
          <FormFields form={addForm} setForm={setAddForm} isAdd categories={categories} />
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

      {/* Search + Sort */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
          <input value={search} onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari lomba..."
            className="w-full pl-9 pr-3 py-2.5 bg-white border border-slate-200 text-xs font-medium focus:outline-none focus:border-astro-cyan"
            style={{ clipPath: 'polygon(5px 0, 100% 0, calc(100% - 5px) 100%, 0 100%)' }}
          />
        </div>

        <div className="flex gap-1">
          {[
            { key: 'newest', label: 'Terbaru' },
            { key: 'az', label: 'A-Z' },
            { key: 'za', label: 'Z-A' },
          ].map((opt) => (
            <button key={opt.key}
              onClick={() => setSortBy(opt.key as 'newest' | 'az' | 'za')}
              className={`px-3 py-2 text-[10px] font-bold tracking-wider uppercase transition-all cursor-pointer ${
                sortBy === opt.key
                  ? 'bg-astro-cyan text-slate-950'
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
              style={{ clipPath: 'polygon(4px 0, 100% 0, calc(100% - 4px) 100%, 0 100%)' }}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* List */}
      <div className="grid grid-cols-1 gap-4">
        {paginated.map((comp) => {
          const cat = categories.find((c) => c.id === comp.category);
          const catColor = cat?.color || 'bg-slate-50 text-slate-600 border-slate-200';

          return (
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
                    <FormFields form={editForm} setForm={setEditForm} categories={categories} />
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
                      <div className="flex items-center gap-2 mb-2 flex-wrap">
                        <h3 className="text-base font-black text-slate-900 uppercase tracking-tight">{comp.title}</h3>
                        <span className={`px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider border ${catColor}`}
                          style={{ clipPath: 'polygon(3px 0, 100% 0, calc(100% - 3px) 100%, 0 100%)' }}
                        >
                          {cat?.label || comp.category}
                        </span>
                        <span className={`px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider border ${
                          (comp as any).isFree === '1' || (comp as any).isFree === true
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            : 'bg-amber-50 text-amber-700 border-amber-200'
                        }`}
                          style={{ clipPath: 'polygon(3px 0, 100% 0, calc(100% - 3px) 100%, 0 100%)' }}
                        >
                          {(comp as any).isFree === '1' || (comp as any).isFree === true ? 'Gratis' : 'Berbayar'}
                        </span>
                        <span className="px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider border bg-sky-50 text-sky-700 border-sky-200"
                          style={{ clipPath: 'polygon(3px 0, 100% 0, calc(100% - 3px) 100%, 0 100%)' }}
                        >
                          {(comp as any).origin === 'external' ? 'Eksternal' : 'Internal'}
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
                    <div className="flex gap-1 flex-shrink-0">
                      {comp.isActive !== '1' && (
                        <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider border bg-red-50 text-red-600 border-red-200 self-center mr-1"
                          style={{ clipPath: 'polygon(3px 0, 100% 0, calc(100% - 3px) 100%, 0 100%)' }}
                        >
                          Nonaktif
                        </span>
                      )}
                      <button onClick={() => handleToggleActive(comp)}
                        className={`p-2 transition-colors cursor-pointer ${comp.isActive === '1' ? 'text-slate-400 hover:text-amber-600' : 'text-amber-500 hover:text-green-600'}`}
                        title={comp.isActive === '1' ? 'Nonaktifkan' : 'Aktifkan'}
                      >
                        {comp.isActive === '1' ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                      <button onClick={() => handleEdit(comp)}
                        className="p-2 text-slate-400 hover:text-astro-cyan transition-colors cursor-pointer" title="Edit"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleTimelineOpen(comp.id)}
                        className={`p-2 transition-colors cursor-pointer ${timelineOpen === comp.id ? 'text-astro-cyan' : 'text-slate-400 hover:text-astro-cyan'}`}
                        title="Atur Timeline"
                      >
                        <Clock className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleDeleteComp(comp.id)}
                        className="p-2 text-slate-400 hover:text-red-500 transition-colors cursor-pointer" title="Hapus"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )}

                {/* ─── Timeline Manager ─── */}
                {timelineOpen === comp.id && (
                  <div className="border-t border-slate-200 mt-5 pt-5 space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-black text-slate-900 uppercase tracking-tight flex items-center gap-2">
                        <Clock className="w-4 h-4 text-astro-cyan" /> Timeline Lomba
                      </h3>
                      <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                        {(timelineItems[comp.id] || []).length} item
                      </span>
                    </div>

                    {/* Timeline list */}
                    <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                      {(timelineItems[comp.id] || []).length === 0 && (
                        <p className="text-xs text-slate-400 italic">Belum ada timeline. Tambah item baru di bawah.</p>
                      )}
                      {(timelineItems[comp.id] || []).map((item, idx) => (
                        <div key={item.id}
                          className="flex items-start gap-3 bg-slate-50 border border-slate-100 p-3 group"
                          style={{ clipPath: 'polygon(6px 0, 100% 0, calc(100% - 6px) 100%, 0 100%)' }}
                        >
                          <span className="flex-shrink-0 w-6 h-6 text-[10px] font-black bg-cyan-100 text-cyan-700 flex items-center justify-center"
                            style={{ clipPath: 'polygon(3px 0, 100% 0, calc(100% - 3px) 100%, 0 100%)' }}
                          >
                            {idx + 1}
                          </span>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-black text-slate-800 uppercase tracking-tight truncate">{item.title}</span>
                              <span className="text-[10px] text-slate-400 font-bold whitespace-nowrap">{item.date}</span>
                            </div>
                            <p className="text-[11px] text-slate-500 leading-relaxed line-clamp-1">{item.desc}</p>
                          </div>
                          <div className="flex gap-1 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button onClick={() => handleTlEdit(item)}
                              className="p-1 text-slate-400 hover:text-astro-cyan cursor-pointer" title="Edit"
                            >
                              <Pencil className="w-3 h-3" />
                            </button>
                            <button onClick={() => handleTlDelete(comp.id, item.id)}
                              className="p-1 text-slate-400 hover:text-red-500 cursor-pointer" title="Hapus"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Add/Edit form */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Tanggal Mulai</label>
                        <input type="date" value={tlDateRange.start}
                          onChange={(e) => setTlDateRange({ ...tlDateRange, start: e.target.value })}
                          className="w-full px-3 py-2 border border-slate-200 text-xs mt-1 focus:outline-none focus:border-astro-cyan"
                          style={{ clipPath: 'polygon(4px 0, 100% 0, calc(100% - 4px) 100%, 0 100%)' }}
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Tanggal Akhir <span className="text-slate-400 font-normal normal-case tracking-normal">(opsional)</span></label>
                        <input type="date" value={tlDateRange.end}
                          onChange={(e) => setTlDateRange({ ...tlDateRange, end: e.target.value })}
                          min={tlDateRange.start || undefined}
                          className="w-full px-3 py-2 border border-slate-200 text-xs mt-1 focus:outline-none focus:border-astro-cyan"
                          style={{ clipPath: 'polygon(4px 0, 100% 0, calc(100% - 4px) 100%, 0 100%)' }}
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-end">
                      <div>
                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Judul</label>
                        <input value={tlForm.title} onChange={(e) => setTlForm({ ...tlForm, title: e.target.value })}
                          placeholder="Pendaftaran Dibuka"
                          className="w-full px-3 py-2 border border-slate-200 text-xs mt-1 focus:outline-none focus:border-astro-cyan"
                          style={{ clipPath: 'polygon(4px 0, 100% 0, calc(100% - 4px) 100%, 0 100%)' }}
                        />
                      </div>
                      <div className="flex gap-2 self-end">
                        <button onClick={() => handleTlSave(comp.id)} disabled={tlSaving}
                          className="flex-1 px-3 py-2 bg-astro-cyan text-slate-950 font-bold text-xs tracking-wider uppercase hover:bg-cyan-400 disabled:bg-slate-200 disabled:text-slate-400 cursor-pointer"
                          style={{ clipPath: 'polygon(5px 0, 100% 0, calc(100% - 5px) 100%, 0 100%)' }}
                        >
                          {tlSaving ? <Loader2 className="w-3 h-3 animate-spin mx-auto" /> : tlEditingId ? <Check className="w-3 h-3 mx-auto" /> : <Plus className="w-3 h-3 mx-auto" />}
                        </button>
                        {tlEditingId && (
                          <button onClick={() => { setTlEditingId(null); setTlForm({ date: '', title: '', desc: '' }); setTlDateRange({ start: '', end: '' }); }}
                            className="px-3 py-2 border border-slate-300 text-slate-600 font-bold text-xs tracking-wider uppercase hover:bg-slate-50 cursor-pointer"
                            style={{ clipPath: 'polygon(5px 0, 100% 0, calc(100% - 5px) 100%, 0 100%)' }}
                          >
                            <X className="w-3 h-3" />
                          </button>
                        )}
                      </div>
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Deskripsi</label>
                      <textarea value={tlForm.desc} onChange={(e) => setTlForm({ ...tlForm, desc: e.target.value })}
                        placeholder="Deskripsi item timeline..."
                        rows={2}
                        className="w-full px-3 py-2 border border-slate-200 text-xs mt-1 focus:outline-none focus:border-astro-cyan"
                        style={{ clipPath: 'polygon(4px 0, 100% 0, calc(100% - 4px) 100%, 0 100%)' }}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <Pagination currentPage={page} totalItems={filtered.length} pageSize={PAGE_SIZE} onPageChange={setPage} />

      {/* Delete Modal */}
      <DeleteModal
        open={!!deleteModal}
        title={deleteModal?.title || ''}
        message={deleteModal?.message || ''}
        onConfirm={deleteModal?.onConfirm || (() => {})}
        onCancel={() => setDeleteModal(null)}
        loading={deleteLoading}
      />
    </div>
  );
}
