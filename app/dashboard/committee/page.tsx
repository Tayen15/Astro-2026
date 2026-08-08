"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import Image from "next/image";
import {
  Plus,
  Pencil,
  X,
  Check,
  Trash2,
  Building2,
} from "lucide-react";
import { toast } from "sonner";
import DeleteModal from "@/components/DeleteModal";
import Pagination from "@/components/Pagination";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Spinner } from "@/components/ui/spinner";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import {
  useCommitteeMembers,
  useCommitteeDivisions,
  queryKeys,
} from "@/src/lib/hooks/use-queries";
import { apiHelpers } from "@/src/lib/api";

interface CommitteeMember {
  id: number;
  name: string;
  role: string;
  division: string;
  divisionName: string;
  image: string;
  isLeader: string | null;
  quote: string | null;
  instagram: string | null;
  linkedin: string | null;
  sortOrder: number | null;
  createdAt: Date;
}

interface Division {
  id: number;
  name: string;
  slug: string;
  shortName: string | null;
}

const PAGE_SIZE = 10;

export default function CommitteePage() {
  const qc = useQueryClient();
  const { data: itemsData, isLoading: loading } = useCommitteeMembers();
  const { data: divisionsData } = useCommitteeDivisions();
  const items = itemsData ?? [];
  const divisions = divisionsData ?? [];
  const [page, setPage] = useState(1);
  const [showAdd, setShowAdd] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);
  const [deleteModal, setDeleteModal] = useState<{
    title: string;
    message: string;
    onConfirm: () => void;
  } | null>(null);
  const [showDivManager, setShowDivManager] = useState(false);
  const [divForm, setDivForm] = useState({ name: "", shortName: "", slug: "" });
  const [divEditingId, setDivEditingId] = useState<number | null>(null);
  const [divSaving, setDivSaving] = useState(false);

  const [form, setForm] = useState({
    name: "",
    role: "",
    division: "",
    divisionName: "",
    image: "",
    isLeader: "0",
    quote: "",
    instagram: "",
    linkedin: "",
  });

  const invalidate = () => {
    qc.invalidateQueries({ queryKey: queryKeys.committeeMembers.all });
    qc.invalidateQueries({ queryKey: queryKeys.committeeDivisions.all });
  };

  const saveMutation = useMutation({
    mutationFn: (body: Record<string, unknown>) =>
      editingId
        ? apiHelpers.committeeMembers.update(String(editingId), body)
        : apiHelpers.committeeMembers.create(body),
    onSuccess: () => {
      setForm({
        name: "",
        role: "",
        division: divisions[0]?.slug || "",
        divisionName: divisions[0]?.name || "",
        image: "",
        isLeader: "0",
        quote: "",
        instagram: "",
        linkedin: "",
      });
      setEditingId(null);
      setShowAdd(false);
      toast.success(editingId ? "Anggota diperbarui" : "Anggota ditambahkan");
      invalidate();
    },
    onError: () => toast.error("Gagal menyimpan"),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => apiHelpers.committeeMembers.remove(String(id)),
    onSuccess: () => {
      toast.success("Anggota dihapus");
      setDeleteModal(null);
      invalidate();
    },
    onError: () => toast.error("Gagal menghapus"),
  });

  const divSaveMutation = useMutation({
    mutationFn: (body: Record<string, unknown>) =>
      divEditingId
        ? apiHelpers.committeeDivisions.update(String(divEditingId), body)
        : apiHelpers.committeeDivisions.create(body),
    onSuccess: () => {
      setDivForm({ name: "", shortName: "", slug: "" });
      setDivEditingId(null);
      toast.success(divEditingId ? "Divisi diperbarui" : "Divisi ditambahkan");
      invalidate();
    },
    onError: () => toast.error("Gagal menyimpan divisi"),
  });

  const divDeleteMutation = useMutation({
    mutationFn: (id: number) =>
      apiHelpers.committeeDivisions.remove(String(id)),
    onSuccess: () => {
      toast.success("Divisi dihapus");
      setDivEditingId(null);
      setDivForm({ name: "", shortName: "", slug: "" });
      invalidate();
    },
    onError: () => toast.error("Gagal menghapus divisi"),
  });

  const handleDivisionChange = (slug: string) => {
    const div = divisions.find((d) => d.slug === slug);
    setForm({ ...form, division: slug, divisionName: div?.name || slug });
  };

  const handleEdit = (item: CommitteeMember) => {
    setForm({
      name: item.name,
      role: item.role,
      division: item.division,
      divisionName: item.divisionName,
      image: item.image,
      isLeader: item.isLeader || "0",
      quote: item.quote || "",
      instagram: item.instagram || "",
      linkedin: item.linkedin || "",
    });
    setEditingId(item.id);
    setShowAdd(true);
  };

  const handleSave = async () => {
    if (!form.name || !form.role || !form.division || !form.image) {
      toast.error("Nama, jabatan, divisi, dan foto wajib diisi");
      return;
    }
    setSaving(true);
    try {
      const body = {
        ...form,
        divisionName: form.divisionName || form.division,
        isLeader: form.isLeader === "1",
      };
      await saveMutation.mutateAsync(body);
    } catch {
      toast.error("Gagal menyimpan");
    }
    setSaving(false);
  };

  const handleDelete = (id: number, name: string) => {
    setDeleteModal({
      title: "Hapus Anggota",
      message: 'Yakin ingin menghapus "' + name + '"?',
      onConfirm: async () => {
        await deleteMutation.mutateAsync(id);
      },
    });
  };

  const handleDivSave = async () => {
    if (!divForm.name || !divForm.slug) {
      toast.error("Nama dan slug wajib diisi");
      return;
    }
    setDivSaving(true);
    try {
      await divSaveMutation.mutateAsync(divForm);
    } catch {
      toast.error("Gagal menyimpan divisi");
    }
    setDivSaving(false);
  };

  const handleDivEdit = (div: Division) => {
    setDivForm({
      name: div.name,
      shortName: (div as any).shortName || "",
      slug: div.slug,
    });
    setDivEditingId(div.id);
  };

  const handleDivDelete = async (id: number) => {
    await divDeleteMutation.mutateAsync(id);
  };

  const paginated = items.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  if (loading)
    return (
      <div className="flex justify-center py-20">
        <Spinner className="size-6 text-primary" />
      </div>
    );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black uppercase tracking-tight text-foreground">
            Committee
          </h1>
          <p className="mt-1 text-sm font-light text-muted-foreground">
            {items.length} anggota
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => {
              setShowDivManager(!showDivManager);
              setShowAdd(false);
            }}
            className="clip-angled text-xs font-bold uppercase tracking-wider"
          >
            <Building2 data-icon="inline-start" /> Kelola Divisi
          </Button>
          <Button
            onClick={() => {
              setShowAdd(!showAdd);
              setShowDivManager(false);
              setEditingId(null);
              setForm({
                name: "",
                role: "",
                division: divisions[0]?.slug || "",
                divisionName: divisions[0]?.name || "",
                image: "",
                isLeader: "0",
                quote: "",
                instagram: "",
                linkedin: "",
              });
            }}
            className="clip-angled text-xs font-bold uppercase tracking-wider"
          >
            <Plus data-icon="inline-start" /> Tambah Anggota
          </Button>
        </div>
      </div>

      {/* Division Manager */}
      {showDivManager && (
        <Card className="clip-angled relative border-border">
          <div className="absolute -top-px -left-px size-8 bg-primary" style={{ clipPath: "polygon(0 0, 100% 0, 0 100%)" }} />
          <CardContent className="space-y-4 p-5">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-black uppercase tracking-tight text-foreground">
                Kelola Divisi
              </h2>
              <Button variant="ghost" size="icon-sm" onClick={() => setShowDivManager(false)} aria-label="Tutup"><X /></Button>
            </div>
            <FieldGroup className="flex items-end gap-3">
              <Field className="flex-1">
                <FieldLabel>Nama Divisi</FieldLabel>
                <Input
                  value={divForm.name}
                  onChange={(e) =>
                    setDivForm({
                      ...divForm,
                      name: e.target.value,
                      slug: divEditingId
                        ? divForm.slug
                        : e.target.value
                            .toLowerCase()
                            .replace(/\s+/g, "-")
                            .replace(/[^a-z0-9-]/g, ""),
                    })
                  }
                  placeholder="Badan Pengurus Harian"
                />
              </Field>
              <Field className="flex-1">
                <FieldLabel>Singkatan <span className="font-normal normal-case text-muted-foreground">(opsional)</span></FieldLabel>
                <Input
                  value={divForm.shortName}
                  onChange={(e) => setDivForm({ ...divForm, shortName: e.target.value })}
                  placeholder="BPH"
                />
              </Field>
              <Field className="flex-1">
                <FieldLabel>Slug</FieldLabel>
                <Input
                  value={divForm.slug}
                  onChange={(e) => setDivForm({ ...divForm, slug: e.target.value })}
                  placeholder="bph"
                />
              </Field>
              <Button onClick={handleDivSave} disabled={divSaving} size="icon" aria-label="Simpan divisi">
                {divSaving ? <Spinner className="size-4" /> : divEditingId ? <Check className="size-4" /> : <Plus className="size-4" />}
              </Button>
              {divEditingId && (
                <Button variant="outline" onClick={() => { setDivEditingId(null); setDivForm({ name: "", shortName: "", slug: "" }); }} className="text-xs font-bold uppercase tracking-wider">
                  Batal
                </Button>
              )}
            </FieldGroup>
            <div className="flex flex-wrap gap-2">
              {divisions.map((d) => {
                const displayLabel = d.shortName
                  ? `${d.name} (${d.shortName})`
                  : d.name;
                return (
                  <Badge key={d.id} variant="secondary" className="gap-2 border border-border px-3 py-1.5 text-xs font-bold">
                    <span>{displayLabel}</span>
                    <Button variant="ghost" size="icon-xs" onClick={() => handleDivEdit(d)} aria-label="Edit" className="ml-1 text-muted-foreground hover:text-primary"><Pencil /></Button>
                    <Button variant="ghost" size="icon-xs" onClick={() => handleDivDelete(d.id)} aria-label="Hapus" className="text-muted-foreground hover:text-destructive"><X /></Button>
                  </Badge>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {showAdd && (
        <Card className="clip-angled relative border-border">
          <div className="absolute -top-px -left-px size-8 bg-primary" style={{ clipPath: "polygon(0 0, 100% 0, 0 100%)" }} />
          <CardContent className="space-y-4 p-5">
            <h2 className="text-sm font-black uppercase tracking-tight text-foreground">
              {editingId ? "Edit" : "Tambah"} Anggota
            </h2>
            <FieldGroup className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              <Field>
                <FieldLabel>Nama <span className="text-destructive">*</span></FieldLabel>
                <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Nama" />
              </Field>
              <Field>
                <FieldLabel>Jabatan <span className="text-destructive">*</span></FieldLabel>
                <Input value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} placeholder="Ketua Pelaksana / Staf" />
              </Field>
              <Field>
                <FieldLabel>Tipe</FieldLabel>
                <ToggleGroup type="single" value={form.isLeader} onValueChange={(v) => v && setForm({ ...form, isLeader: v })} spacing={2} className="mt-1 w-full">
                  <ToggleGroupItem value="1" className="flex-1 text-xs font-bold uppercase tracking-wider">Koordinator</ToggleGroupItem>
                  <ToggleGroupItem value="0" className="flex-1 text-xs font-bold uppercase tracking-wider">Staf</ToggleGroupItem>
                </ToggleGroup>
              </Field>
              <Field>
                <FieldLabel>Divisi <span className="text-destructive">*</span></FieldLabel>
                <Select value={form.division} onValueChange={handleDivisionChange}>
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {divisions.map((d) => {
                        const label = d.shortName
                          ? `${d.name} (${d.shortName})`
                          : d.name;
                        return (
                          <SelectItem key={d.slug} value={d.slug}>{label}</SelectItem>
                        );
                      })}
                    </SelectGroup>
                  </SelectContent>
                </Select>
                <input type="hidden" value={form.divisionName} />
              </Field>
              <Field>
                <FieldLabel>Quote</FieldLabel>
                <Input value={form.quote} onChange={(e) => setForm({ ...form, quote: e.target.value })} placeholder="Quote" />
              </Field>
              <Field>
                <FieldLabel>Instagram</FieldLabel>
                <Input value={form.instagram} onChange={(e) => setForm({ ...form, instagram: e.target.value })} placeholder="@username" />
              </Field>
            </FieldGroup>
            <FieldGroup className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <Field>
                <FieldLabel>LinkedIn</FieldLabel>
                <Input value={form.linkedin} onChange={(e) => setForm({ ...form, linkedin: e.target.value })} placeholder="URL LinkedIn" />
              </Field>
              <Field>
                <FieldLabel>Foto <span className="text-destructive">*</span></FieldLabel>
                <div className="flex items-center gap-3">
                  <label className="cursor-pointer">
                    <span className="clip-angled-sm inline-block border border-border bg-muted px-4 py-2 text-xs font-bold uppercase tracking-wider text-muted-foreground transition-colors hover:bg-accent">
                      Upload File
                    </span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (!file) return;
                        try {
                          const uploadRes = await apiHelpers.upload(file);
                          const url = (uploadRes as any)?.url;
                          if (url) setForm({ ...form, image: url });
                        } catch {
                          console.error("Upload failed");
                        }
                      }}
                    />
                  </label>
                  <span className="text-[10px] text-muted-foreground">atau</span>
                  <Input value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} placeholder="Atau URL gambar..." className="flex-1" />
                </div>
              </Field>
            </FieldGroup>
            {form.image && (
              <div className="clip-angled-sm flex items-center gap-3 border border-border bg-muted/50 p-3">
                <Image src={form.image} alt="Preview" width={48} height={48} unoptimized className="size-12 rounded-full object-cover" />
                <span className="text-xs text-muted-foreground">Preview</span>
                <Button variant="ghost" size="sm" onClick={() => setForm({ ...form, image: "" })} className="ml-auto text-xs text-destructive hover:text-destructive">Hapus</Button>
              </div>
            )}
            <div className="flex gap-2 pt-2">
              <Button onClick={handleSave} disabled={saving} className="clip-angled-sm gap-1 text-xs font-bold uppercase tracking-wider">
                {saving ? <Spinner data-icon="inline-start" /> : <Check data-icon="inline-start" />} Simpan
              </Button>
              <Button variant="outline" className="clip-angled-sm gap-1 text-xs font-bold uppercase tracking-wider"
                onClick={() => {
                  setShowAdd(false);
                  setEditingId(null);
                  setForm({
                    name: "",
                    role: "",
                    division: divisions[0]?.slug || "",
                    divisionName: divisions[0]?.name || "",
                    image: "",
                    isLeader: "0",
                    quote: "",
                    instagram: "",
                    linkedin: "",
                  });
                }}>
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
                {item.image && (
                  <Image src={item.image} alt="" width={40} height={40} unoptimized className="size-10 rounded-full object-cover" />
                )}
                <div>
                  <span className="text-sm font-bold text-foreground">{item.name}</span>
                  <div className="mt-0.5 flex gap-2">
                    <span className="text-[10px] font-semibold text-muted-foreground">{item.role}</span>
                    {item.isLeader === "1" && (
                      <Badge variant="outline" className="clip-angled-sm border-amber-200 bg-amber-50 text-[9px] font-bold uppercase text-amber-700">
                        Koordinator
                      </Badge>
                    )}
                    <span className="text-[10px] text-muted-foreground/60">|</span>
                    <span className="text-[10px] text-muted-foreground">{item.divisionName || item.division}</span>
                  </div>
                </div>
              </div>
              <div className="flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                <Button variant="ghost" size="icon-sm" onClick={() => handleEdit(item)} aria-label="Edit"><Pencil /></Button>
                <Button variant="ghost" size="icon-sm" onClick={() => handleDelete(item.id, item.name)} aria-label="Hapus" className="text-muted-foreground hover:text-destructive"><Trash2 /></Button>
              </div>
            </CardContent>
          </Card>
        ))}
        {items.length === 0 && (
          <p className="py-4 text-center text-sm italic text-muted-foreground">
            Belum ada anggota committee.
          </p>
        )}
      </div>
      <Pagination
        currentPage={page}
        totalItems={items.length}
        pageSize={PAGE_SIZE}
        onPageChange={setPage}
      />

      <DeleteModal
        open={!!deleteModal}
        title={deleteModal?.title || ""}
        message={deleteModal?.message || ""}
        onConfirm={deleteModal?.onConfirm || (() => {})}
        onCancel={() => setDeleteModal(null)}
        loading={false}
      />
    </div>
  );
}
