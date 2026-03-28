'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Doctor, Department } from '@/lib/types';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { PageHeader } from '@/components/ui/PageHeader';
import { Plus, Search, Edit2, Trash2, X, Stethoscope } from 'lucide-react';

interface Props {
  doctors: Doctor[];
  departments: Department[];
  search: string;
  status: string;
}

const EMPTY: Partial<Doctor> = {
  first_name: '', last_name: '', email: '', phone: '',
  specialization: '', department_id: undefined,
  license_number: '', status: 'active', avatar_initials: '',
};

const statusOpts = ['active', 'on_leave', 'inactive'];

export function DoctorsClient({ doctors, departments, search, status }: Props) {
  const router = useRouter();
  const [modal,   setModal]   = useState<'add' | 'edit' | null>(null);
  const [form,    setForm]    = useState<Partial<Doctor>>(EMPTY);
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState('');
  const [delId,   setDelId]   = useState<number | null>(null);

  const pushFilter = (key: string, val: string) => {
    const p = new URLSearchParams({ search, status });
    p.set(key, val);
    router.push(`/doctors?${p}`);
  };

  const openAdd  = () => { setForm(EMPTY); setError(''); setModal('add'); };
  const openEdit = (d: Doctor) => { setForm({ ...d }); setError(''); setModal('edit'); };
  const close    = () => { setModal(null); setError(''); };

  const save = async () => {
    setLoading(true); setError('');
    const payload = {
      ...form,
      avatar_initials: form.avatar_initials ||
        `${form.first_name?.[0] ?? ''}${form.last_name?.[0] ?? ''}`.toUpperCase(),
    };
    try {
      const url    = modal === 'edit' ? `/api/doctors/${form.id}` : '/api/doctors';
      const method = modal === 'edit' ? 'PUT' : 'POST';
      const res    = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
      if (!res.ok) { const d = await res.json(); throw new Error(d.error); }
      close(); router.refresh();
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Failed');
    } finally { setLoading(false); }
  };

  const del = async (id: number) => {
    setLoading(true);
    try {
      await fetch(`/api/doctors/${id}`, { method: 'DELETE' });
      setDelId(null); router.refresh();
    } finally { setLoading(false); }
  };

  const avatarColors = [
    'from-teal-400 to-teal-600',
    'from-blue-400 to-blue-600',
    'from-violet-400 to-violet-600',
    'from-emerald-400 to-emerald-600',
    'from-amber-400 to-amber-600',
    'from-rose-400 to-rose-600',
  ];

  return (
    <div className="p-7 page-enter">
      <PageHeader
        title="Doctors"
        subtitle={`${doctors.length} physicians registered`}
        action={<button className="btn-primary" onClick={openAdd}><Plus size={16} />Add Doctor</button>}
      />

      {/* Filters */}
      <div className="flex gap-3 mb-6">
        <div className="relative flex-1 max-w-sm">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            className="field-input pl-9"
            placeholder="Search doctors…"
            defaultValue={search}
            onKeyDown={e => { if (e.key === 'Enter') pushFilter('search', (e.target as HTMLInputElement).value); }}
          />
        </div>
        <select className="field-input w-40" value={status} onChange={e => pushFilter('status', e.target.value)}>
          <option value="">All statuses</option>
          {statusOpts.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>

      {/* Cards grid */}
      <div className="grid grid-cols-2 xl:grid-cols-3 gap-4">
        {doctors.length === 0 && (
          <div className="col-span-3 text-center py-20 text-slate-400">No doctors found</div>
        )}
        {doctors.map((d, idx) => (
          <div key={d.id} className="card p-5 hover:shadow-card-hover transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${avatarColors[idx % avatarColors.length]} flex items-center justify-center text-white font-bold text-sm flex-shrink-0`}>
                  {d.avatar_initials || `${d.first_name[0]}${d.last_name[0]}`}
                </div>
                <div>
                  <p className="font-bold text-slate-800">Dr. {d.first_name} {d.last_name}</p>
                  <p className="text-xs text-slate-400">{d.specialization}</p>
                </div>
              </div>
              <StatusBadge status={d.status} />
            </div>

            <div className="space-y-1.5 text-sm text-slate-500 mb-4">
              <div className="flex items-center gap-2">
                <span className="w-20 text-xs text-slate-400 uppercase tracking-wide font-medium">Dept</span>
                <span className="text-slate-700">{d.department_name ?? '—'}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-20 text-xs text-slate-400 uppercase tracking-wide font-medium">License</span>
                <span className="font-mono text-xs text-slate-600">{d.license_number}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-20 text-xs text-slate-400 uppercase tracking-wide font-medium">Email</span>
                <span className="text-slate-600 truncate text-xs">{d.email}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-20 text-xs text-slate-400 uppercase tracking-wide font-medium">Phone</span>
                <span className="text-slate-600 text-xs">{d.phone ?? '—'}</span>
              </div>
            </div>

            <div className="flex gap-2 pt-3 border-t border-slate-100">
              <button onClick={() => openEdit(d)} className="flex-1 btn-secondary py-2 text-xs justify-center">
                <Edit2 size={13} /> Edit
              </button>
              <button onClick={() => setDelId(d.id)} className="p-2 hover:bg-red-50 hover:text-red-600 rounded-lg text-slate-400 transition-colors">
                <Trash2 size={14} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add/Edit Modal */}
      {modal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={e => e.target === e.currentTarget && close()}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto animate-slide-up">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 sticky top-0 bg-white z-10">
              <div className="flex items-center gap-2">
                <Stethoscope size={18} className="text-teal-500" />
                <h2 className="font-bold text-slate-800" style={{ fontFamily: 'Playfair Display, serif' }}>
                  {modal === 'add' ? 'Add New Doctor' : 'Edit Doctor'}
                </h2>
              </div>
              <button onClick={close} className="p-1.5 hover:bg-slate-100 rounded-lg"><X size={18} /></button>
            </div>
            <div className="p-6 space-y-4">
              {error && <p className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-2.5 rounded-xl">{error}</p>}
              <div className="grid grid-cols-2 gap-4">
                {(['first_name','last_name'] as const).map(k => (
                  <div key={k}>
                    <label className="field-label">{k === 'first_name' ? 'First Name' : 'Last Name'}</label>
                    <input className="field-input" value={(form[k] as string) ?? ''} onChange={e => setForm(f => ({ ...f, [k]: e.target.value }))} />
                  </div>
                ))}
                <div>
                  <label className="field-label">Email</label>
                  <input type="email" className="field-input" value={form.email ?? ''} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} />
                </div>
                <div>
                  <label className="field-label">Phone</label>
                  <input type="tel" className="field-input" value={form.phone ?? ''} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} />
                </div>
                <div>
                  <label className="field-label">Specialization</label>
                  <input className="field-input" value={form.specialization ?? ''} onChange={e => setForm(f => ({ ...f, specialization: e.target.value }))} />
                </div>
                <div>
                  <label className="field-label">License Number</label>
                  <input className="field-input font-mono" value={form.license_number ?? ''} onChange={e => setForm(f => ({ ...f, license_number: e.target.value }))} />
                </div>
                <div>
                  <label className="field-label">Department</label>
                  <select className="field-input" value={form.department_id ?? ''} onChange={e => setForm(f => ({ ...f, department_id: e.target.value ? parseInt(e.target.value) : undefined }))}>
                    <option value="">None</option>
                    {departments.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="field-label">Status</label>
                  <select className="field-input" value={form.status ?? 'active'} onChange={e => setForm(f => ({ ...f, status: e.target.value as Doctor['status'] }))}>
                    {statusOpts.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button onClick={close} className="btn-secondary">Cancel</button>
                <button onClick={save} disabled={loading} className="btn-primary disabled:opacity-60">
                  {loading ? 'Saving…' : modal === 'add' ? 'Add Doctor' : 'Save Changes'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete confirm */}
      {delId !== null && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-sm animate-slide-up">
            <h3 className="font-bold text-slate-800 mb-2">Remove Doctor?</h3>
            <p className="text-slate-500 text-sm mb-5">This action cannot be undone.</p>
            <div className="flex gap-3 justify-end">
              <button onClick={() => setDelId(null)} className="btn-secondary">Cancel</button>
              <button onClick={() => del(delId)} disabled={loading} className="btn-danger disabled:opacity-60">
                {loading ? 'Removing…' : 'Remove'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
