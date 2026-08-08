'use client';

import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Pencil, X, Check, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import DeleteModal from '@/components/DeleteModal';
import Pagination from '@/components/Pagination';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Field, FieldGroup, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Spinner } from '@/components/ui/spinner';
import { Textarea } from '@/components/ui/textarea';
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

  if (loading) return <div className="flex justify-center py-20"><Spinner className="size-6 text-primary" /></div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black uppercase tracking-tight text-foreground">Journey</h1>
          <p className="mt-1 text-sm font-light text-muted-foreground">{items.length} perjalanan</p>
        </div>
        <Button onClick={() => { setShowAdd(!showAdd); setEditingId(null); setForm({ id: '', theme: '', participants: 0, universities: 0, competitionsCount: 0, achievement: '', description: '', highlights: '', sortOrder: 0 }); }}
          className="clip-angled text-xs font-bold uppercase tracking-wider">
          <Plus data-icon="inline-start" /> Tambah Journey
        </Button>
      </div>

      {showAdd && (
        <Card className="clip-angled relative border-border">
          <div className="absolute -top-px -left-px size-8 bg-primary" style={{ clipPath: 'polygon(0 0, 100% 0, 0 100%)' }} />
          <CardContent className="space-y-4 p-5">
            <h2 className="text-sm font-black uppercase tracking-tight text-foreground">{editingId ? 'Edit' : 'Tambah'} Journey</h2>
            <FieldGroup className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              <Field>
                <FieldLabel>ID <span className="text-destructive">*</span></FieldLabel>
                <Input value={form.id}
                  readOnly={!!editingId}
                  onChange={(e) => setForm({ ...form, id: editingId ? form.id : e.target.value.toLowerCase().replace(/\s+/g, '-') })}
                  placeholder="2023"
                  className={editingId ? 'cursor-not-allowed bg-muted text-muted-foreground' : ''} />
              </Field>
              <Field>
                <FieldLabel>Tema <span className="text-destructive">*</span></FieldLabel>
                <Input value={form.theme} onChange={(e) => setForm({ ...form, theme: e.target.value })} placeholder="Tema" />
              </Field>
              <Field>
                <FieldLabel>Sort Order</FieldLabel>
                <Input type="number" value={form.sortOrder} onChange={(e) => setForm({ ...form, sortOrder: Number(e.target.value) })} />
              </Field>
              <Field>
                <FieldLabel>Peserta</FieldLabel>
                <Input type="number" value={form.participants} onChange={(e) => setForm({ ...form, participants: Number(e.target.value) })} />
              </Field>
              <Field>
                <FieldLabel>Universitas</FieldLabel>
                <Input type="number" value={form.universities} onChange={(e) => setForm({ ...form, universities: Number(e.target.value) })} />
              </Field>
              <Field>
                <FieldLabel>Cabang Lomba</FieldLabel>
                <Input type="number" value={form.competitionsCount} onChange={(e) => setForm({ ...form, competitionsCount: Number(e.target.value) })} />
              </Field>
              <Field className="sm:col-span-3">
                <FieldLabel>Pencapaian</FieldLabel>
                <Input value={form.achievement} onChange={(e) => setForm({ ...form, achievement: e.target.value })} placeholder="Pencapaian" />
              </Field>
              <Field className="sm:col-span-3">
                <FieldLabel>Deskripsi</FieldLabel>
                <Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3} />
              </Field>
              <Field className="sm:col-span-3">
                <FieldLabel>Highlights (1 baris = 1 highlight)</FieldLabel>
                <Textarea value={form.highlights} onChange={(e) => setForm({ ...form, highlights: e.target.value })} rows={3} />
              </Field>
            </FieldGroup>
            <div className="flex gap-2 pt-2">
              <Button onClick={handleSave} disabled={saving} className="clip-angled-sm gap-1 text-xs font-bold uppercase tracking-wider">
                {saving ? <Spinner data-icon="inline-start" /> : <Check data-icon="inline-start" />} Simpan
              </Button>
              <Button variant="outline" className="clip-angled-sm gap-1 text-xs font-bold uppercase tracking-wider"
                onClick={() => { setShowAdd(false); setEditingId(null); setForm({ id: '', theme: '', participants: 0, universities: 0, competitionsCount: 0, achievement: '', description: '', highlights: '', sortOrder: 0 }); }}>
                <X data-icon="inline-start" /> Batal
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 gap-3">
        {paginated.map((item) => (
          <Card key={item.id} className="clip-angled group relative border-border p-4">
            <CardContent className="flex items-center justify-between gap-4 p-0">
              <div className="flex items-center gap-3">
                <Badge variant="secondary" className="bg-muted px-2.5 py-1 text-xs font-black text-foreground">{item.id}</Badge>
                <span className="text-sm font-bold text-foreground">{item.theme}</span>
                <span className="text-[11px] text-muted-foreground">{item.participants} peserta</span>
              </div>
              <div className="flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                <Button variant="ghost" size="icon-sm" onClick={() => handleEdit(item)} aria-label="Edit"><Pencil /></Button>
                <Button variant="ghost" size="icon-sm" onClick={() => handleDelete(item.id, item.theme)} aria-label="Hapus" className="text-muted-foreground hover:text-destructive"><Trash2 /></Button>
              </div>
            </CardContent>
          </Card>
        ))}
        {items.length === 0 && <p className="py-4 text-center text-sm italic text-muted-foreground">Belum ada data journey.</p>}
      </div>
      <Pagination currentPage={page} totalItems={items.length} pageSize={PAGE_SIZE} onPageChange={setPage} />

      <DeleteModal open={!!deleteModal} title={deleteModal?.title || ''} message={deleteModal?.message || ''}
        onConfirm={deleteModal?.onConfirm || (() => {})} onCancel={() => setDeleteModal(null)} loading={false} />
    </div>
  );
}
