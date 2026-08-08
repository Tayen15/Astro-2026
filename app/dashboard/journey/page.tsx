'use client';

import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Loader2, Plus, Pencil, X, Check, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import DeleteModal from '@/components/DeleteModal';
import Pagination from '@/components/Pagination';
import { useJourneys, queryKeys } from '@/src/lib/hooks/use-queries';
import { apiHelpers } from '@/src/lib/api';

interface Journey {
  id: string;
  theme: string;
  participants: number | null;
  universities: number | null;
  competitionsCount: number | null;
  achievement: string | null;
  description: string | null;
  highlights: string[] | null;
  isActive: string | null;
  sortOrder: number | null;
  createdAt: Date;
}

const PAGE_SIZE = 10;

export default function JourneyPage() {
  const qc = useQueryClient();
  const { data: itemsData, isLoading: loading } = useJourneys();
  const items = itemsData ?? [];
  const [page, setPage] = useState(1);
  const [showAdd, setShowAdd] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [deleteModal, setDeleteModal] = useState<{ title: string; message: string; onConfirm: () => void } | null>(null);

  const [form, setForm] = useState({
    id: '', theme: '', participants: 0, universities: 0,
    competitionsCount: 0, achievement: '', description: '', highlights: '',
    sortOrder: 0,
  });

  const invalidate = () => qc.invalidateQueries({ queryKey: queryKeys.journeys.all });

  const saveMutation = useMutation({
    mutationFn: (body: Record<string, unknown>) =>
      editingId
        ? apiHelpers.journeys.update(editingId, body)
        : apiHelpers.journeys.create(body),
    onSuccess: () => {
      setForm({ id: '', theme: '', participants: 0, universities: 0, competitionsCount: 0, achievement: '', description: '', highlights: '', sortOrder: 0 });
      setEditingId(null); setShowAdd(false);
      toast.success(editingId ? 'Journey diperbarui' : 'Journey ditambahkan');
      invalidate();
    },
    onError: () => toast.error('Gagal menyimpan'),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => apiHelpers.journeys.remove(id),
    onSuccess: () => { toast.success('Journey dihapus'); setDeleteModal(null); invalidate(); },
    onError: () => toast.error('Gagal menghapus'),
  });

  const handleEdit = (item: Journey) => {
    setForm({
      id: item.id,
      theme: item.theme,
      participants: item.participants || 0,
      universities: item.universities || 0,
      competitionsCount: item.competitionsCount || 0,
      achievement: item.achievement || '',
      description: item.description || '',
      highlights: item.highlights?.join('\n') || '',
      sortOrder: item.sortOrder || 0,
    });
    setEditingId(item.id);
    setShowAdd(true);
  };

  const handleSave = async () => {
    if (!form.id || !form.theme) { toast.error('ID dan theme wajib diisi'); return; }
    setSaving(true);
    try {
      const body = {
        ...form,
        participants: Number(form.participants),
        universities: Number(form.universities),
        competitionsCount: Number(form.competitionsCount),
        sortOrder: Number(form.sortOrder),
        highlights: form.highlights.split('\n').filter(s => s.trim()),
      };
      await saveMutation.mutateAsync(body);
    } catch { toast.error('Gagal menyimpan'); }
    setSaving(false);
  };

  const handleDelete = (id: string, theme: string) => {
    setDeleteModal({
      title: 'Hapus Journey', message: 'Yakin ingin menghapus "' + theme + '"?',
      onConfirm: async () => {
        await deleteMutation.mutateAsync(id);
      },
    });
  };

  const paginated = items.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  if (loading) return <div className="flex justify-center py-20"><Loader2 className="w-6 h-6 animate-spin text-astro-cyan" /></div>;

  const inp = (_field: string) => `w-full px-3 py-2 border border-slate-200 text-sm mt-1 focus:outline-none focus:border-astro-cyan`;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-slate-900 uppercase tracking-tight">Journey</h1>
          <p className="text-sm text-slate-500 font-light mt-1">{items.length} perjalanan</p>
        </div>
        <button onClick={() => { setShowAdd(!showAdd); setEditingId(null); setForm({ id: '', theme: '', participants: 0, universities: 0, competitionsCount: 0, achievement: '', description: '', highlights: '', sortOrder: 0 }); }}
          className="flex items-center gap-2 px-5 py-2.5 bg-astro-cyan text-slate-950 font-bold text-xs tracking-wider uppercase hover:bg-cyan-400 cursor-pointer"
          style={{ clipPath: 'polygon(6px 0, 100% 0, calc(100% - 6px) 100%, 0 100%)' }}>
          <Plus className="w-3.5 h-3.5" /> Tambah Journey
        </button>
      </div>

      {showAdd && (
        <div className="bg-white border border-slate-200 relative p-5 space-y-4"
          style={{ clipPath: 'polygon(14px 0, 100% 0, calc(100% - 14px) 100%, 0 100%)' }}>
          <div className="absolute -top-[1px] -left-[1px] w-8 h-8 bg-astro-cyan" style={{ clipPath: 'polygon(0 0, 100% 0, 0 100%)' }} />
          <h2 className="text-sm font-black text-slate-900 uppercase tracking-tight">{editingId ? 'Edit' : 'Tambah'} Journey</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">ID <span className="text-red-400">*</span></label>
              <input value={form.id} onChange={(e) => setForm({ ...form, id: editingId ? form.id : e.target.value.toLowerCase().replace(/\s+/g, '-') })}
                readOnly={!!editingId} placeholder="2023" className={inp('id') + (editingId ? ' bg-slate-50 text-slate-400 cursor-not-allowed' : '')}
                style={{ clipPath: 'polygon(4px 0, 100% 0, calc(100% - 4px) 100%, 0 100%)' }} />
            </div>
            <div>
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Tema <span className="text-red-400">*</span></label>
              <input value={form.theme} onChange={(e) => setForm({ ...form, theme: e.target.value })}
                placeholder="Tema" className={inp('theme')}
                style={{ clipPath: 'polygon(4px 0, 100% 0, calc(100% - 4px) 100%, 0 100%)' }} />
            </div>
            <div>
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Sort Order</label>
              <input type="number" value={form.sortOrder} onChange={(e) => setForm({ ...form, sortOrder: Number(e.target.value) })}
                className={inp('sortOrder')}
                style={{ clipPath: 'polygon(4px 0, 100% 0, calc(100% - 4px) 100%, 0 100%)' }} />
            </div>
            <div>
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Peserta</label>
              <input type="number" value={form.participants} onChange={(e) => setForm({ ...form, participants: Number(e.target.value) })}
                className={inp('participants')}
                style={{ clipPath: 'polygon(4px 0, 100% 0, calc(100% - 4px) 100%, 0 100%)' }} />
            </div>
            <div>
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Universitas</label>
              <input type="number" value={form.universities} onChange={(e) => setForm({ ...form, universities: Number(e.target.value) })}
                className={inp('universities')}
                style={{ clipPath: 'polygon(4px 0, 100% 0, calc(100% - 4px) 100%, 0 100%)' }} />
            </div>
            <div>
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Cabang Lomba</label>
              <input type="number" value={form.competitionsCount} onChange={(e) => setForm({ ...form, competitionsCount: Number(e.target.value) })}
                className={inp('competitionsCount')}
                style={{ clipPath: 'polygon(4px 0, 100% 0, calc(100% - 4px) 100%, 0 100%)' }} />
            </div>
            <div className="sm:col-span-3">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Pencapaian</label>
              <input value={form.achievement} onChange={(e) => setForm({ ...form, achievement: e.target.value })}
                placeholder="Pencapaian" className={inp('achievement')}
                style={{ clipPath: 'polygon(4px 0, 100% 0, calc(100% - 4px) 100%, 0 100%)' }} />
            </div>
            <div className="sm:col-span-3">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Deskripsi</label>
              <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })}
                rows={3} className={inp('description')}
                style={{ clipPath: 'polygon(4px 0, 100% 0, calc(100% - 4px) 100%, 0 100%)' }} />
            </div>
            <div className="sm:col-span-3">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Highlights (1 baris = 1 highlight)</label>
              <textarea value={form.highlights} onChange={(e) => setForm({ ...form, highlights: e.target.value })}
                rows={3} className={inp('highlights')}
                style={{ clipPath: 'polygon(4px 0, 100% 0, calc(100% - 4px) 100%, 0 100%)' }} />
            </div>
          </div>
          <div className="flex gap-2 pt-2">
            <button onClick={handleSave} disabled={saving}
              className="flex items-center gap-1 px-4 py-2 bg-astro-cyan text-slate-950 font-bold text-xs tracking-wider uppercase hover:bg-cyan-400 disabled:bg-slate-200 disabled:text-slate-400 cursor-pointer"
              style={{ clipPath: 'polygon(5px 0, 100% 0, calc(100% - 5px) 100%, 0 100%)' }}>
              {saving ? <Loader2 className="w-3 h-3 animate-spin" /> : <Check className="w-3 h-3" />} Simpan
            </button>
            <button onClick={() => { setShowAdd(false); setEditingId(null); setForm({ id: '', theme: '', participants: 0, universities: 0, competitionsCount: 0, achievement: '', description: '', highlights: '', sortOrder: 0 }); }}
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
              <span className="px-2.5 py-1 bg-slate-100 text-slate-700 text-xs font-black">{item.id}</span>
              <span className="text-sm font-bold text-slate-900">{item.theme}</span>
              <span className="text-[11px] text-slate-400">{item.participants} peserta</span>
            </div>
            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <button onClick={() => handleEdit(item)} className="p-1.5 text-slate-400 hover:text-astro-cyan cursor-pointer"><Pencil className="w-3.5 h-3.5" /></button>
              <button onClick={() => handleDelete(item.id, item.theme)} className="p-1.5 text-slate-400 hover:text-red-500 cursor-pointer"><Trash2 className="w-3.5 h-3.5" /></button>
            </div>
          </div>
        ))}
        {items.length === 0 && <p className="text-sm text-slate-400 italic py-4 text-center">Belum ada data journey.</p>}
      </div>
      <Pagination currentPage={page} totalItems={items.length} pageSize={PAGE_SIZE} onPageChange={setPage} />

      <DeleteModal open={!!deleteModal} title={deleteModal?.title || ''} message={deleteModal?.message || ''}
        onConfirm={deleteModal?.onConfirm || (() => {})} onCancel={() => setDeleteModal(null)} loading={false} />
    </div>
  );
}
