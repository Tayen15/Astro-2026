'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, Pencil, Trash2, X, Loader2, Search } from 'lucide-react';

interface User {
  id: string;
  email: string;
  name: string | null;
  role: string;
  createdAt: string;
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [modal, setModal] = useState<{ mode: 'create' | 'edit'; user?: User } | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<User | null>(null);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const fetchUsers = async () => {
    const res = await fetch('/api/users');
    const json = await res.json();
    setUsers(json.data || []);
    setLoading(false);
  };

  useEffect(() => { fetchUsers(); }, []);

  const filtered = users.filter((u) =>
    u.email.toLowerCase().includes(search.toLowerCase()) ||
    u.name?.toLowerCase().includes(search.toLowerCase())
  );

  const handleCreate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSaving(true);
    const form = new FormData(e.currentTarget);
    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: form.get('email'),
          password: form.get('password'),
          name: form.get('name'),
        }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Gagal membuat user');
      setModal(null);
      fetchUsers();
    } catch (err: any) {
      alert(err.message);
    }
    setSaving(false);
  };

  const handleUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!modal?.user) return;
    setSaving(true);
    const form = new FormData(e.currentTarget);
    try {
      const res = await fetch('/api/users', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: modal.user.id,
          name: form.get('name'),
          role: form.get('role'),
        }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Gagal mengupdate user');
      setModal(null);
      fetchUsers();
    } catch (err: any) {
      alert(err.message);
    }
    setSaving(false);
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      const res = await fetch('/api/users', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: deleteTarget.id }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Gagal menghapus user');
      setDeleteTarget(null);
      fetchUsers();
    } catch (err: any) {
      alert(err.message);
    }
    setDeleting(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-6 h-6 animate-spin text-astro-cyan" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 uppercase tracking-tight">User</h1>
          <p className="text-sm text-slate-500 font-light mt-1">{users.length} akun terdaftar</p>
        </div>
        <button
          onClick={() => setModal({ mode: 'create' })}
          className="flex items-center gap-1.5 px-4 py-2.5 bg-astro-cyan text-slate-950 font-bold text-xs tracking-wider uppercase transition-all hover:bg-cyan-400 cursor-pointer"
          style={{ clipPath: 'polygon(6px 0, 100% 0, calc(100% - 6px) 100%, 0 100%)' }}
        >
          <Plus className="w-3.5 h-3.5" /> Tambah User
        </button>
      </div>

      {/* Search */}
      <div className="relative max-w-xs">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Cari nama atau email..."
          className="w-full pl-9 pr-3 py-2.5 bg-white border border-slate-200 text-xs font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-astro-cyan transition-colors"
          style={{ clipPath: 'polygon(5px 0, 100% 0, calc(100% - 5px) 100%, 0 100%)' }}
        />
      </div>

      {/* Table */}
      <div className="bg-white border border-slate-200 overflow-hidden"
        style={{ clipPath: 'polygon(14px 0, 100% 0, calc(100% - 14px) 100%, 0 100%)' }}
      >
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                <th className="text-left px-5 py-3 w-10">No</th>
                <th className="text-left px-5 py-3">Nama</th>
                <th className="text-left px-5 py-3">Email</th>
                <th className="text-left px-5 py-3">Role</th>
                <th className="text-right px-5 py-3 hidden md:table-cell">Didaftarkan</th>
                <th className="text-right px-5 py-3 w-24">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-5 py-12 text-center text-slate-400 text-sm">
                    {search ? 'Tidak ditemukan.' : 'Belum ada user.'}
                  </td>
                </tr>
              ) : (
                filtered.map((u, i) => (
                  <tr key={u.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-5 py-3.5 text-slate-400 text-xs font-mono">{i + 1}</td>
                    <td className="px-5 py-3.5">
                      <p className="font-medium text-slate-900">{u.name || '—'}</p>
                    </td>
                    <td className="px-5 py-3.5">
                      <p className="text-sm text-slate-700">{u.email}</p>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className={`inline-block px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider border ${
                        u.role === 'admin'
                          ? 'bg-cyan-50 text-astro-cyan border-cyan-200'
                          : 'bg-slate-50 text-slate-600 border-slate-200'
                      }`}
                        style={{ clipPath: 'polygon(3px 0, 100% 0, calc(100% - 3px) 100%, 0 100%)' }}
                      >
                        {u.role}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-right hidden md:table-cell">
                      <span className="text-xs text-slate-500">
                        {u.createdAt ? new Date(u.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }) : '—'}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => setModal({ mode: 'edit', user: u })}
                          className="p-1.5 text-slate-400 hover:text-astro-cyan transition-colors cursor-pointer"
                          title="Edit"
                        >
                          <Pencil className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => setDeleteTarget(u)}
                          className="p-1.5 text-slate-400 hover:text-red-500 transition-colors cursor-pointer"
                          title="Hapus"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ─── Modal Create / Edit ─── */}
      <AnimatePresence>
        {modal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[70] flex items-center justify-center"
          >
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setModal(null)} />
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative w-full max-w-md mx-4 bg-white rounded-2xl overflow-hidden"
            >
              <div className="flex items-center justify-between p-5 border-b border-slate-100">
                <h2 className="text-sm font-black text-slate-900 uppercase tracking-tight">
                  {modal.mode === 'create' ? 'Tambah User' : 'Edit User'}
                </h2>
                <button onClick={() => setModal(null)} className="p-2 rounded-xl hover:bg-slate-100 text-slate-500 hover:text-slate-800 transition-colors cursor-pointer">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={modal.mode === 'create' ? handleCreate : handleUpdate} className="p-5 space-y-4">
                <div>
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Nama</label>
                  <input
                    name="name"
                    defaultValue={modal.user?.name || ''}
                    placeholder="Nama lengkap"
                    className="mt-1 w-full px-3.5 py-2.5 bg-white border border-slate-200 text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-astro-cyan transition-colors"
                    style={{ clipPath: 'polygon(5px 0, 100% 0, calc(100% - 5px) 100%, 0 100%)' }}
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Email</label>
                  <input
                    name="email"
                    type="email"
                    defaultValue={modal.user?.email || ''}
                    required
                    disabled={modal.mode === 'edit'}
                    placeholder="email@example.com"
                    className="mt-1 w-full px-3.5 py-2.5 bg-white border border-slate-200 text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-astro-cyan transition-colors disabled:bg-slate-50 disabled:text-slate-400"
                    style={{ clipPath: 'polygon(5px 0, 100% 0, calc(100% - 5px) 100%, 0 100%)' }}
                  />
                </div>

                {modal.mode === 'create' && (
                  <div>
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Password</label>
                    <input
                      name="password"
                      type="password"
                      required
                      minLength={6}
                      placeholder="Minimal 6 karakter"
                      className="mt-1 w-full px-3.5 py-2.5 bg-white border border-slate-200 text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-astro-cyan transition-colors"
                      style={{ clipPath: 'polygon(5px 0, 100% 0, calc(100% - 5px) 100%, 0 100%)' }}
                    />
                  </div>
                )}

                <div>
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Role</label>
                  <select
                    name="role"
                    defaultValue={modal.user?.role || 'participant'}
                    className="mt-1 w-full px-3.5 py-2.5 bg-white border border-slate-200 text-sm font-medium text-slate-700 focus:outline-none focus:border-astro-cyan transition-colors cursor-pointer"
                    style={{ clipPath: 'polygon(5px 0, 100% 0, calc(100% - 5px) 100%, 0 100%)' }}
                  >
                    <option value="participant">Participant</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>

                <div className="flex justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setModal(null)}
                    className="px-5 py-2.5 text-xs font-bold text-slate-600 hover:text-slate-800 uppercase tracking-wider transition-colors cursor-pointer"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="px-5 py-2.5 bg-astro-cyan text-slate-950 font-bold text-xs tracking-wider uppercase transition-all hover:bg-cyan-400 disabled:opacity-50 cursor-pointer"
                    style={{ clipPath: 'polygon(6px 0, 100% 0, calc(100% - 6px) 100%, 0 100%)' }}
                  >
                    {saving ? 'Menyimpan...' : 'Simpan'}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ─── Delete Confirmation ─── */}
      <AnimatePresence>
        {deleteTarget && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[70] flex items-center justify-center"
          >
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setDeleteTarget(null)} />
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative w-full max-w-sm mx-4 bg-white rounded-2xl overflow-hidden p-6 text-center"
            >
              <Trash2 className="w-10 h-10 text-red-400 mx-auto mb-3" />
              <h3 className="text-base font-black text-slate-900 mb-1">Hapus User</h3>
              <p className="text-sm text-slate-500 mb-6">
                Yakin ingin menghapus <strong>{deleteTarget.name || deleteTarget.email}</strong>? Tindakan ini tidak bisa dibatalkan.
              </p>
              <div className="flex justify-center gap-3">
                <button
                  onClick={() => setDeleteTarget(null)}
                  className="px-5 py-2.5 text-xs font-bold text-slate-600 hover:text-slate-800 uppercase tracking-wider transition-colors cursor-pointer"
                >
                  Batal
                </button>
                <button
                  onClick={handleDelete}
                  disabled={deleting}
                  className="px-5 py-2.5 bg-red-600 text-white font-bold text-xs tracking-wider uppercase transition-all hover:bg-red-500 disabled:opacity-50 cursor-pointer"
                  style={{ clipPath: 'polygon(6px 0, 100% 0, calc(100% - 6px) 100%, 0 100%)' }}
                >
                  {deleting ? 'Menghapus...' : 'Hapus'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
