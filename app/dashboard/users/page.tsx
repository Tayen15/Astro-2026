"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Pencil, Trash2, Search } from "lucide-react";
import { toast } from "sonner";
import Pagination from "@/components/Pagination";
import { ResponsiveAlertDialog } from "@/components/responsive-alert-dialog";
import { ResponsiveModal } from "@/components/responsive-modal";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Spinner } from "@/components/ui/spinner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useUsers, queryKeys } from "@/src/lib/hooks/use-queries";
import { apiHelpers } from "@/src/lib/api";
import { cn } from "@/lib/utils";

const PAGE_SIZE = 10;

interface User {
  id: string;
  email: string;
  name: string | null;
  role: string;
  createdAt: string;
}

export default function UsersPage() {
  const qc = useQueryClient();
  const { data: usersData, isLoading: loading } = useUsers();
  const users = (usersData as any)?.data ?? usersData ?? [];
  const [search, setSearch] = useState("");
  const [modal, setModal] = useState<{
    mode: "create" | "edit";
    user?: User;
  } | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<User | null>(null);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const invalidateUsers = () =>
    qc.invalidateQueries({ queryKey: queryKeys.users.all });

  const createMutation = useMutation({
    mutationFn: (body: {
      email: string;
      password: string;
      name: string;
      role: string;
    }) => apiHelpers.users.create(body),
    onSuccess: () => {
      toast.success("User berhasil dibuat");
      setModal(null);
      invalidateUsers();
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const updateMutation = useMutation({
    mutationFn: ({
      id,
      body,
    }: {
      id: string;
      body: { name: string; role: string };
    }) => apiHelpers.users.update(id, body),
    onSuccess: () => {
      toast.success("User berhasil diupdate");
      setModal(null);
      invalidateUsers();
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => apiHelpers.users.remove(id),
    onSuccess: () => {
      toast.success("User berhasil dihapus");
      setDeleteTarget(null);
      invalidateUsers();
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const filtered = users.filter(
    (u: User) =>
      u.email.toLowerCase().includes(search.toLowerCase()) ||
      u.name?.toLowerCase().includes(search.toLowerCase()),
  );
  const [page, setPage] = useState(1);
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const handleCreate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSaving(true);
    const form = new FormData(e.currentTarget);
    try {
      await createMutation.mutateAsync({
        email: String(form.get("email")),
        password: String(form.get("password")),
        name: String(form.get("name")),
        role: String(form.get("role") || "participant"),
      });
    } catch {
      // handled by onError
    }
    setSaving(false);
  };

  const handleUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!modal?.user) return;
    setSaving(true);
    const form = new FormData(e.currentTarget);
    try {
      await updateMutation.mutateAsync({
        id: modal.user.id,
        body: {
          name: String(form.get("name")),
          role: String(form.get("role")),
        },
      });
    } catch {
      // handled by onError
    }
    setSaving(false);
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await deleteMutation.mutateAsync(deleteTarget.id);
    } catch {
      // handled by onError
    }
    setDeleting(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Spinner className="size-6 text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black uppercase tracking-tight text-foreground">
            User
          </h1>
          <p className="mt-1 text-sm font-light text-muted-foreground">
            {users.length} akun terdaftar
          </p>
        </div>
        <Button
          onClick={() => setModal({ mode: "create" })}
          className="clip-angled text-xs font-bold uppercase tracking-wider"
        >
          <Plus data-icon="inline-start" /> Tambah User
        </Button>
      </div>

      {/* Search */}
      <div className="max-w-xs">
        <InputGroup className="clip-angled h-10 border-border bg-background">
          <InputGroupAddon align="inline-start">
            <Search className="size-3.5 text-muted-foreground" />
          </InputGroupAddon>
          <InputGroupInput
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari nama atau email..."
            className="text-xs font-medium"
          />
        </InputGroup>
      </div>

      {/* Table */}
      <div className="clip-angled-lg overflow-hidden border border-border bg-background">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                <TableHead className="w-10 px-5">No</TableHead>
                <TableHead className="px-5">Nama</TableHead>
                <TableHead className="px-5">Email</TableHead>
                <TableHead className="px-5">Role</TableHead>
                <TableHead className="hidden px-5 text-right md:table-cell">
                  Didaftarkan
                </TableHead>
                <TableHead className="w-24 px-5 text-right">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="divide-y divide-border">
              {paginated.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="px-5 py-12 text-center text-sm text-muted-foreground"
                  >
                    {search ? "Tidak ditemukan." : "Belum ada user."}
                  </TableCell>
                </TableRow>
              ) : (
                paginated.map((u, i) => (
                  <TableRow key={u.id} className="hover:bg-muted/50">
                    <TableCell className="px-5 py-3.5 font-mono text-xs text-muted-foreground">
                      {i + 1}
                    </TableCell>
                    <TableCell className="px-5 py-3.5">
                      <p className="font-medium text-foreground">
                        {u.name || "—"}
                      </p>
                    </TableCell>
                    <TableCell className="px-5 py-3.5">
                      <p className="text-sm text-foreground">{u.email}</p>
                    </TableCell>
                    <TableCell className="px-5 py-3.5">
                      <Badge
                        variant="outline"
                        className={cn(
                          "clip-angled-sm border text-[10px] font-bold uppercase tracking-wider",
                          u.role === "admin"
                            ? "border-cyan-200 bg-cyan-50 text-astro-cyan"
                            : "border-slate-200 bg-muted text-muted-foreground",
                        )}
                      >
                        {u.role}
                      </Badge>
                    </TableCell>
                    <TableCell className="hidden px-5 py-3.5 text-right md:table-cell">
                      <span className="text-xs text-muted-foreground">
                        {u.createdAt
                          ? new Date(u.createdAt).toLocaleDateString("id-ID", {
                              day: "numeric",
                              month: "long",
                              year: "numeric",
                            })
                          : "—"}
                      </span>
                    </TableCell>
                    <TableCell className="px-5 py-3.5 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          onClick={() => setModal({ mode: "edit", user: u })}
                          title="Edit"
                          aria-label="Edit"
                        >
                          <Pencil />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          onClick={() => setDeleteTarget(u)}
                          title="Hapus"
                          aria-label="Hapus"
                          className="text-muted-foreground hover:text-destructive"
                        >
                          <Trash2 />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      <Pagination
        currentPage={page}
        totalItems={filtered.length}
        pageSize={PAGE_SIZE}
        onPageChange={setPage}
      />

      {/* ─── Modal Create / Edit ─── */}
      <ResponsiveModal
        open={!!modal}
        onOpenChange={(next) => !next && setModal(null)}
        title={modal?.mode === "create" ? "Tambah User" : "Edit User"}
        description={
          modal?.mode === "create"
            ? "Buat akun user baru."
            : `Edit akun ${modal?.user?.email}`
        }
        titleClassName="text-sm font-black uppercase tracking-tight"
        contentClassName="max-w-md"
      >
        <form
          onSubmit={modal?.mode === "create" ? handleCreate : handleUpdate}
          className="flex flex-col gap-4"
        >
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="user-name">Nama</FieldLabel>
              <Input
                id="user-name"
                name="name"
                defaultValue={modal?.user?.name || ""}
                placeholder="Nama lengkap"
              />
            </Field>

            <Field>
              <FieldLabel htmlFor="user-email">Email</FieldLabel>
              <Input
                id="user-email"
                name="email"
                type="email"
                defaultValue={modal?.user?.email || ""}
                required
                disabled={modal?.mode === "edit"}
                placeholder="email@example.com"
              />
            </Field>

            {modal?.mode === "create" && (
              <Field>
                <FieldLabel htmlFor="user-password">Password</FieldLabel>
                <Input
                  id="user-password"
                  name="password"
                  type="password"
                  required
                  minLength={6}
                  placeholder="Minimal 6 karakter"
                />
              </Field>
            )}

            <Field>
              <FieldLabel htmlFor="user-role">Role</FieldLabel>
              <Select
                name="role"
                defaultValue={modal?.user?.role || "participant"}
              >
                <SelectTrigger id="user-role" className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="participant">Participant</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </Field>
          </FieldGroup>

          <div className="flex justify-end gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setModal(null)}
            >
              Batal
            </Button>
            <Button type="submit" disabled={saving} className="clip-angled-sm">
              {saving ? <Spinner data-icon="inline-start" /> : null}
              {saving ? "Menyimpan..." : "Simpan"}
            </Button>
          </div>
        </form>
      </ResponsiveModal>

      {/* ─── Delete Confirmation ─── */}
      <ResponsiveAlertDialog
        open={!!deleteTarget}
        onOpenChange={(next) => !next && setDeleteTarget(null)}
        title="Hapus User"
        description={
          <>
            Yakin ingin menghapus{" "}
            <strong>{deleteTarget?.name || deleteTarget?.email}</strong>?
            Tindakan ini tidak bisa dibatalkan.
          </>
        }
        cancelText="Batal"
        confirmText="Hapus"
        destructive
        loading={deleting}
        onConfirm={handleDelete}
      />
    </div>
  );
}
