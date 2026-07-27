'use client';

import { useState, useEffect } from 'react';
import { Loader2, Plus, Pencil, X, Check, Trash2, Image as ImageIcon, Tag } from 'lucide-react';
import { toast } from 'sonner';
import DeleteModal from '@/components/DeleteModal';
import Pagination from '@/components/Pagination';

interface GalleryItem {
  id: number;
  title: string;
  category: string;
  imageUrl: string;
  year: string;
  likesCount: number;
  sortOrder: number | null;
}

interface Category {
  id: number;
  name: string;
  slug: string;
}

const PAGE_SIZE = 10;
const YEARS = ['ASTRO 2023', 'ASTRO 2024', 'ASTRO 2025', 'ASTRO 2026'];

export default function GalleryPage() {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [showAdd, setShowAdd] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);
  const [deleteModal, setDeleteModal] = useState<{ title: string; message: string; onConfirm: () => void } | null>(null);
  const [showCatManager, setShowCatManager] = useState(false);
  const [catForm, setCatForm] = useState({ name: '', slug: '' });
  const [catEditingId, setCatEditingId] = useState<number | null>(null);
  const [catSaving, setCatSaving] = useState(false);

  const [form, setForm] = useState({ title: '', category: '', imageUrl: '', year: 'ASTRO 2025', likesCount: 0, sortOrder: 0 });

  const fetchData = async () => {
    const [gRes, cRes] = await Promise.all([
      fetch('/api/gallery'),
      fetch('/api/gallery-categories'),
    ]);
    setItems((await gRes.json()).data || []);
    setCategories((await cRes.json()).data || []);
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, []);

  // Auto-set first category
  useEffect(() => {
    if (categories.length > 0 && !form.category) {
      setForm(f => ({ ...f, category: categories[0].slug }));
    }
  }, [categories]);

  const handleEdit = (item: GalleryItem) => {
    setForm({ title: item.title, category: item.category, imageUrl: item.imageUrl, year: item.year, likesCount: item.likesCount, sortOrder: item.sortOrder || 0 });
    setEditingId(item.id);
    setShowAdd(true);
  };

  const handleSave = async () => {
    if (!form.title || !form.imageUrl) { toast.error('Title dan gambar wajib diisi'); return; }
    if (!form.category) { toast.error('Kategori wajib dipilih'); return; }
    setSaving(true);
    try {
      const body = { ...form, likesCount: Number(form.likesCount), sortOrder: Number(form.sortOrder) };
      if (editingId) {
        await fetch('/api/gallery/' + editingId, {
          method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body),
        });
      } else {
        await fetch('/api/gallery', {
          method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body),
        });
      }
      setForm({ title: '', category: categories[0]?.slug || '', imageUrl: '', year: 'ASTRO 2025', likesCount: 0, sortOrder: 0 });
      setEditingId(null); setShowAdd(false);
      toast.success(editingId ? 'Foto diperbarui' : 'Foto ditambahkan');
      fetchData();
    } catch { toast.error('Gagal menyimpan'); }
    setSaving(false);
  };

  const handleDelete = (id: number, title: string) => {
    setDeleteModal({
      title: 'Hapus Foto', message: 'Yakin ingin menghapus "' + title + '"?',
      onConfirm: async () => {
        const res = await fetch('/api/gallery/' + id, { method: 'DELETE' });
        if (!res.ok) { toast.error('Gagal menghapus'); return; }
        toast.success('Foto dihapus'); setDeleteModal(null); fetchData();
      },
    });
  };

  const handleCatSave = async () => {
    if (!catForm.name || !catForm.slug) { toast.error('Nama dan slug wajib diisi'); return; }
    setCatSaving(true);
    try {
      if (catEditingId) {
        await fetch('/api/gallery-categories', {
          method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: catEditingId, ...catForm }),
        });
      } else {
        await fetch('/api/gallery-categories', {
          method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(catForm),
        });
      }
      setCatForm({ name: '', slug: '' });
      setCatEditingId(null);
      toast.success(catEditingId ? 'Kategori diperbarui' : 'Kategori ditambahkan');
      fetchData();
    } catch { toast.error('Gagal menyimpan kategori'); }
    setCatSaving(false);
  };

  const handleCatEdit = (cat: Category) => {
    setCatForm({ name: cat.name, slug: cat.slug });
    setCatEditingId(cat.id);
  };

  const handleCatDelete = async (id: number) => {
    const res = await fetch('/api/gallery-categories?id=' + id, { method: 'DELETE' });
    if (!res.ok) { toast.error('Gagal menghapus kategori'); return; }
    toast.success('Kategori dihapus');
    setCatEditingId(null);
    setCatForm({ name: '', slug: '' });
    fetchData();
  };

  const paginated = items.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  if (loading) return <div className="flex justify-center py-20"><Loader2 className="w-6 h-6 animate-spin text-astro-cyan" /></div>;

  const inp = `w-full px-3 py-2 border border-slate-200 text-sm mt-1 focus:outline-none focus:border-astro-cyan`;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-slate-900 uppercase tracking-tight">Galeri Foto</h1>
          <p className="text-sm text-slate-500 font-light mt-1">{items.length} foto</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => { setShowCatManager(!showCatManager); setShowAdd(false); }}
            className="flex items-center gap-2 px-5 py-2.5 border border-slate-300 text-slate-700 font-bold text-xs tracking-wider uppercase hover:bg-slate-50 cursor-pointer"
            style={{ clipPath: 'polygon(6px 0, 100% 0, calc(100% - 6px) 100%, 0 100%)' }}>
            <Tag className="w-3.5 h-3.5" /> Kelola Kategori
          </button>
          <button onClick={() => { setShowAdd(!showAdd); setShowCatManager(false); setEditingId(null); setForm({ title: '', category: categories[0]?.slug || '', imageUrl: '', year: 'ASTRO 2025', likesCount: 0, sortOrder: 0 }); }}
            className="flex items-center gap-2 px-5 py-2.5 bg-astro-cyan text-slate-950 font-bold text-xs tracking-wider uppercase hover:bg-cyan-400 cursor-pointer"
            style={{ clipPath: 'polygon(6px 0, 100% 0, calc(100% - 6px) 100%, 0 100%)' }}>
            <Plus className="w-3.5 h-3.5" /> Tambah Foto
          </button>
        </div>
      </div>

      {/* Category Manager */}
      {showCatManager && (
        <div className="bg-white border border-slate-200 relative p-5 space-y-4"
          style={{ clipPath: 'polygon(14px 0, 100% 0, calc(100% - 14px) 100%, 0 100%)' }}>
          <div className="absolute -top-[1px] -left-[1px] w-8 h-8 bg-astro-cyan" style={{ clipPath: 'polygon(0 0, 100% 0, 0 100%)' }} />
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-black text-slate-900 uppercase tracking-tight">Kelola Kategori Gallery</h2>
            <button onClick={() => setShowCatManager(false)} className="p-1 text-slate-400 hover:text-slate-600 cursor-pointer"><X className="w-4 h-4" /></button>
          </div>
          <div className="flex gap-3 items-end">
            <div className="flex-1">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Nama</label>
              <input value={catForm.name} onChange={(e) => setCatForm({ ...catForm, name: e.target.value, slug: editingId ? catForm.slug : e.target.value.toLowerCase().replace(/\s+/g, '-') })}
                placeholder="Nama kategori" className={inp}
                style={{ clipPath: 'polygon(4px 0, 100% 0, calc(100% - 4px) 100%, 0 100%)' }} />
            </div>
            <div className="flex-1">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Slug</label>
              <input value={catForm.slug} onChange={(e) => setCatForm({ ...catForm, slug: e.target.value })}
                placeholder="competition" className={inp}
                style={{ clipPath: 'polygon(4px 0, 100% 0, calc(100% - 4px) 100%, 0 100%)' }} />
            </div>
            <button onClick={handleCatSave} disabled={catSaving}
              className="px-4 py-2 bg-astro-cyan text-slate-950 font-bold text-xs tracking-wider uppercase hover:bg-cyan-400 disabled:bg-slate-200 cursor-pointer"
              style={{ clipPath: 'polygon(5px 0, 100% 0, calc(100% - 5px) 100%, 0 100%)' }}>
              {catSaving ? <Loader2 className="w-3 h-3 animate-spin" /> : catEditingId ? <Check className="w-3 h-3" /> : <Plus className="w-3 h-3" />}
            </button>
            {catEditingId && (
              <button onClick={() => { setCatEditingId(null); setCatForm({ name: '', slug: '' }); }}
                className="px-4 py-2 border border-slate-300 text-slate-600 font-bold text-xs tracking-wider uppercase hover:bg-slate-50 cursor-pointer"
                style={{ clipPath: 'polygon(5px 0, 100% 0, calc(100% - 5px) 100%, 0 100%)' }}>
                Batal
              </button>
            )}
          </div>
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <div key={cat.id} className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 border border-slate-200 text-xs font-bold text-slate-700">
                <span>{cat.name}</span>
                <span className="text-[10px] text-slate-400">({cat.slug})</span>
                <button onClick={() => handleCatEdit(cat)} className="text-slate-400 hover:text-astro-cyan cursor-pointer ml-1"><Pencil className="w-3 h-3" /></button>
                <button onClick={() => handleCatDelete(cat.id)} className="text-slate-400 hover:text-red-500 cursor-pointer"><X className="w-3 h-3" /></button>
              </div>
            ))}
          </div>
        </div>
      )}

      {showAdd && (
        <div className="bg-white border border-slate-200 relative p-5 space-y-4"
          style={{ clipPath: 'polygon(14px 0, 100% 0, calc(100% - 14px) 100%, 0 100%)' }}>
          <div className="absolute -top-[1px] -left-[1px] w-8 h-8 bg-astro-cyan" style={{ clipPath: 'polygon(0 0, 100% 0, 0 100%)' }} />
          <h2 className="text-sm font-black text-slate-900 uppercase tracking-tight">{editingId ? 'Edit' : 'Tambah'} Foto</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Judul <span className="text-red-400">*</span></label>
              <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })}
                placeholder="Judul foto" className={inp}
                style={{ clipPath: 'polygon(4px 0, 100% 0, calc(100% - 4px) 100%, 0 100%)' }} />
            </div>
            <div>
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Kategori <span className="text-red-400">*</span></label>
              <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}
                className={inp + ' cursor-pointer'}
                style={{ clipPath: 'polygon(4px 0, 100% 0, calc(100% - 4px) 100%, 0 100%)' }}>
                {categories.map((c) => <option key={c.slug} value={c.slug}>{c.name}</option>)}
              </select>
            </div>
            <div>
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Tahun</label>
              <select value={form.year} onChange={(e) => setForm({ ...form, year: e.target.value })}
                className={inp + ' cursor-pointer'}
                style={{ clipPath: 'polygon(4px 0, 100% 0, calc(100% - 4px) 100%, 0 100%)' }}>
                {YEARS.map((y) => <option key={y} value={y}>{y}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Gambar <span className="text-red-400">*</span></label>
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
                      if (json.url) setForm({ ...form, imageUrl: json.url });
                    } catch { console.error('Upload failed'); }
                  }} />
              </label>
              <span className="text-[10px] text-slate-400">atau</span>
              <input value={form.imageUrl} onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
                placeholder="Atau masukkan URL gambar..." className={`${inp} flex-1`}
                style={{ clipPath: 'polygon(4px 0, 100% 0, calc(100% - 4px) 100%, 0 100%)' }} />
            </div>
          </div>
          {form.imageUrl && (
            <div className="flex items-center gap-3 p-3 bg-slate-50 border border-slate-200"
              style={{ clipPath: 'polygon(6px 0, 100% 0, calc(100% - 6px) 100%, 0 100%)' }}>
              <img src={form.imageUrl} alt="Preview" className="w-16 h-12 object-cover rounded" />
              <span className="text-xs text-slate-500">Preview</span>
              <button onClick={() => setForm({ ...form, imageUrl: '' })}
                className="ml-auto text-xs text-red-500 hover:text-red-700 cursor-pointer">Hapus</button>
            </div>
          )}
          <div className="flex gap-2 pt-2">
            <button onClick={handleSave} disabled={saving}
              className="flex items-center gap-1 px-4 py-2 bg-astro-cyan text-slate-950 font-bold text-xs tracking-wider uppercase hover:bg-cyan-400 disabled:bg-slate-200 disabled:text-slate-400 cursor-pointer"
              style={{ clipPath: 'polygon(5px 0, 100% 0, calc(100% - 5px) 100%, 0 100%)' }}>
              {saving ? <Loader2 className="w-3 h-3 animate-spin" /> : <Check className="w-3 h-3" />} Simpan
            </button>
            <button onClick={() => { setShowAdd(false); setEditingId(null); setForm({ title: '', category: categories[0]?.slug || '', imageUrl: '', year: 'ASTRO 2025', likesCount: 0, sortOrder: 0 }); }}
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
              {item.imageUrl && <img src={item.imageUrl} alt="" className="w-12 h-9 object-cover rounded" />}
              <div>
                <span className="text-sm font-bold text-slate-900">{item.title}</span>
                <div className="flex gap-2 mt-0.5">
                  <span className="text-[10px] font-semibold text-slate-500 uppercase">{item.category}</span>
                  <span className="text-[10px] text-slate-400">|</span>
                  <span className="text-[10px] text-slate-500">{item.year}</span>
                </div>
              </div>
            </div>
            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <button onClick={() => handleEdit(item)} className="p-1.5 text-slate-400 hover:text-astro-cyan cursor-pointer"><Pencil className="w-3.5 h-3.5" /></button>
              <button onClick={() => handleDelete(item.id, item.title)} className="p-1.5 text-slate-400 hover:text-red-500 cursor-pointer"><Trash2 className="w-3.5 h-3.5" /></button>
            </div>
          </div>
        ))}
        {items.length === 0 && <p className="text-sm text-slate-400 italic py-4 text-center">Belum ada foto.</p>}
      </div>
      <Pagination currentPage={page} totalItems={items.length} pageSize={PAGE_SIZE} onPageChange={setPage} />

      <DeleteModal open={!!deleteModal} title={deleteModal?.title || ''} message={deleteModal?.message || ''}
        onConfirm={deleteModal?.onConfirm || (() => {})} onCancel={() => setDeleteModal(null)} loading={false} />
    </div>
  );
}
