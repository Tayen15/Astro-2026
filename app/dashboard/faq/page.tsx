'use client';

import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Loader2, Pencil, Trash2, Check, X, ChevronUp, ChevronDown } from 'lucide-react';
import DeleteModal from '@/components/DeleteModal';
import Pagination from '@/components/Pagination';
import { useFaqs, queryKeys } from '@/src/lib/hooks/use-queries';
import { apiHelpers } from '@/src/lib/api';

const PAGE_SIZE = 10;

interface FAQItem {
  id: number;
  question: string;
  answer: string;
  sortOrder: number | null;
}

export default function FAQPage() {
  const qc = useQueryClient();
  const { data: faqsData, isLoading: loading } = useFaqs();
  const faqs = faqsData ?? [];
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState({ question: '', answer: '' });
  const [showAdd, setShowAdd] = useState(false);
  const [addForm, setAddForm] = useState({ question: '', answer: '' });
  const [saving, setSaving] = useState(false);
  const [deleteModal, setDeleteModal] = useState<{ title: string; message: string; onConfirm: () => void } | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [page, setPage] = useState(1);

  const invalidate = () => qc.invalidateQueries({ queryKey: queryKeys.faqs.all });

  const saveMutation = useMutation({
    mutationFn: ({ id, body }: { id: number; body: { question: string; answer: string; sortOrder?: number | null } }) =>
      apiHelpers.faqs.update(String(id), body),
    onSuccess: () => { setEditingId(null); invalidate(); },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => apiHelpers.faqs.remove(String(id)),
    onSuccess: () => { setDeleteModal(null); invalidate(); },
  });

  const addMutation = useMutation({
    mutationFn: (body: { question: string; answer: string }) => apiHelpers.faqs.create(body),
    onSuccess: () => { setAddForm({ question: '', answer: '' }); setShowAdd(false); invalidate(); },
  });

  const handleEdit = (faq: FAQItem) => {
    setEditingId(faq.id);
    setEditForm({ question: faq.question, answer: faq.answer });
  };

  const handleSave = async (id: number) => {
    setSaving(true);
    await saveMutation.mutateAsync({ id, body: editForm });
    setSaving(false);
  };

  const handleDelete = (id: number) => {
    setDeleteModal({
      title: 'Hapus FAQ',
      message: 'Yakin ingin menghapus FAQ ini? Tindakan ini tidak bisa dibatalkan.',
      onConfirm: async () => {
        setDeleteLoading(true);
        await deleteMutation.mutateAsync(id);
        setDeleteLoading(false);
      },
    });
  };

  const handleAdd = async () => {
    if (!addForm.question || !addForm.answer) return;
    setSaving(true);
    await addMutation.mutateAsync(addForm);
    setSaving(false);
  };

  const handleMove = async (id: number, direction: 'up' | 'down') => {
    const idx = faqs.findIndex((f) => f.id === id);
    if (direction === 'up' && idx === 0) return;
    if (direction === 'down' && idx === faqs.length - 1) return;

    const swapIdx = direction === 'up' ? idx - 1 : idx + 1;
    const currentOrder = faqs[idx].sortOrder;
    const swapOrder = faqs[swapIdx].sortOrder;

    // Swap sort orders
    await Promise.all([
      saveMutation.mutateAsync({ id: faqs[idx].id, body: { ...faqs[idx], sortOrder: swapOrder } }),
      saveMutation.mutateAsync({ id: faqs[swapIdx].id, body: { ...faqs[swapIdx], sortOrder: currentOrder } }),
    ]);

    invalidate();
  };

  if (loading) {
    return <div className="flex justify-center py-20"><Loader2 className="w-6 h-6 animate-spin text-astro-cyan" /></div>;
  }

  const faqPaginated = faqs.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div className="space-y-6 max-w-7xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-slate-900 uppercase tracking-tight">FAQ</h1>
          <p className="text-sm text-slate-500 font-light mt-1">{faqs.length} pertanyaan</p>
        </div>
        <button
          onClick={() => setShowAdd(!showAdd)}
          className="flex items-center gap-2 px-5 py-2.5 bg-astro-cyan text-slate-950 font-bold text-xs tracking-wider uppercase transition-all hover:bg-cyan-400 cursor-pointer"
          style={{ clipPath: 'polygon(6px 0, 100% 0, calc(100% - 6px) 100%, 0 100%)' }}
        >
          <Plus className="w-3.5 h-3.5" /> Tambah FAQ
        </button>
      </div>

      {/* Add Form */}
      {showAdd && (
        <div className="bg-white border border-slate-200 p-5 space-y-4"
          style={{ clipPath: 'polygon(10px 0, 100% 0, calc(100% - 10px) 100%, 0 100%)' }}
        >
          <h2 className="text-sm font-black text-slate-900 uppercase tracking-tight">Tambah FAQ Baru</h2>
          <div className="space-y-3">
            <div>
              <label className="block text-[10px] font-bold text-slate-700 uppercase tracking-[0.15em] mb-1">Pertanyaan</label>
              <input
                value={addForm.question}
                onChange={(e) => setAddForm({ ...addForm, question: e.target.value })}
                className="w-full px-4 py-3 border border-slate-200 text-sm focus:outline-none focus:border-astro-cyan"
                style={{ clipPath: 'polygon(5px 0, 100% 0, calc(100% - 5px) 100%, 0 100%)' }}
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-700 uppercase tracking-[0.15em] mb-1">Jawaban</label>
              <textarea
                value={addForm.answer}
                onChange={(e) => setAddForm({ ...addForm, answer: e.target.value })}
                rows={4}
                className="w-full px-4 py-3 border border-slate-200 text-sm focus:outline-none focus:border-astro-cyan"
                style={{ clipPath: 'polygon(5px 0, 100% 0, calc(100% - 5px) 100%, 0 100%)' }}
              />
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleAdd}
                disabled={saving}
                className="px-5 py-2.5 bg-astro-cyan text-slate-950 font-bold text-xs tracking-wider uppercase hover:bg-cyan-400 disabled:bg-slate-200 disabled:text-slate-400 cursor-pointer"
                style={{ clipPath: 'polygon(5px 0, 100% 0, calc(100% - 5px) 100%, 0 100%)' }}
              >
                {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : 'Simpan'}
              </button>
              <button
                onClick={() => setShowAdd(false)}
                className="px-5 py-2.5 border border-slate-300 text-slate-600 font-bold text-xs tracking-wider uppercase hover:bg-slate-50 cursor-pointer"
                style={{ clipPath: 'polygon(5px 0, 100% 0, calc(100% - 5px) 100%, 0 100%)' }}
              >
                Batal
              </button>
            </div>
          </div>
        </div>
      )}

      {/* FAQ List */}
      <div className="bg-white border border-slate-200"
        style={{ clipPath: 'polygon(14px 0, 100% 0, calc(100% - 14px) 100%, 0 100%)' }}
      >
        <div className="divide-y divide-slate-100">
          {faqPaginated.map((faq, idx) => (
            <div key={faq.id} className="p-5">
              {editingId === faq.id ? (
                <div className="space-y-3">
                  <input
                    value={editForm.question}
                    onChange={(e) => setEditForm({ ...editForm, question: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 text-sm font-medium focus:outline-none focus:border-astro-cyan"
                    style={{ clipPath: 'polygon(4px 0, 100% 0, calc(100% - 4px) 100%, 0 100%)' }}
                  />
                  <textarea
                    value={editForm.answer}
                    onChange={(e) => setEditForm({ ...editForm, answer: e.target.value })}
                    rows={3}
                    className="w-full px-3 py-2 border border-slate-200 text-sm focus:outline-none focus:border-astro-cyan"
                    style={{ clipPath: 'polygon(4px 0, 100% 0, calc(100% - 4px) 100%, 0 100%)' }}
                  />
                  <div className="flex gap-2">
                    <button onClick={() => handleSave(faq.id)} disabled={saving} className="flex items-center gap-1 px-3 py-1.5 bg-emerald-500 text-white text-[10px] font-bold uppercase tracking-wider hover:bg-emerald-400 cursor-pointer">
                      {saving ? <Loader2 className="w-3 h-3 animate-spin" /> : <Check className="w-3 h-3" />} Simpan
                    </button>
                    <button onClick={() => setEditingId(null)} className="flex items-center gap-1 px-3 py-1.5 border border-slate-300 text-slate-600 text-[10px] font-bold uppercase tracking-wider hover:bg-slate-50 cursor-pointer">
                      <X className="w-3 h-3" /> Batal
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3 flex-1">
                    {/* Move buttons */}
                    <div className="flex flex-col gap-0.5 pt-0.5">
                      <button onClick={() => handleMove(faq.id, 'up')}
                        disabled={idx === 0}
                        className="p-0.5 text-slate-400 hover:text-slate-700 disabled:text-slate-200 disabled:cursor-not-allowed cursor-pointer"
                      >
                        <ChevronUp className="w-3.5 h-3.5" />
                      </button>
                      <button onClick={() => handleMove(faq.id, 'down')}
                        disabled={idx === faqs.length - 1}
                        className="p-0.5 text-slate-400 hover:text-slate-700 disabled:text-slate-200 disabled:cursor-not-allowed cursor-pointer"
                      >
                        <ChevronDown className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-sm font-bold text-slate-900 mb-1">{faq.question}</h3>
                      <p className="text-sm text-slate-600 leading-relaxed">{faq.answer}</p>
                    </div>
                  </div>
                  <div className="flex gap-1 flex-shrink-0">
                    <button onClick={() => handleEdit(faq)} className="p-2 text-slate-400 hover:text-astro-cyan transition-colors cursor-pointer" title="Edit">
                      <Pencil className="w-3.5 h-3.5" />
                    </button>
                    <button onClick={() => handleDelete(faq.id)} className="p-2 text-slate-400 hover:text-red-500 transition-colors cursor-pointer" title="Hapus">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <Pagination currentPage={page} totalItems={faqs.length} pageSize={PAGE_SIZE} onPageChange={setPage} />

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
