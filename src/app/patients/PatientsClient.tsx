'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Patient } from '@/lib/types';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { PageHeader } from '@/components/ui/PageHeader';
import { Plus, Search, Edit2, Trash2, X, ChevronLeft, ChevronRight, User } from 'lucide-react';

interface Props {
  patients: Patient[];
  total: number;
  page: number;
  limit: number;
  search: string;
  status: string;
}

const EMPTY: Partial<Patient> = {
  first_name: '', last_name: '', email: '', phone: '',
  date_of_birth: '', gender: undefined, blood_type: undefined,
  address: '', emergency_contact_name: '', emergency_contact_phone: '',
  medical_notes: '', status: 'active',
};

const statusOpts = ['', 'active', 'stable', 'critical', 'discharged'];
const genderOpts = ['male', 'female', 'other'];
const bloodOpts  = ['A+','A-','B+','B-','AB+','AB-','O+','O-'];

export function PatientsClient({ patients, total, page, limit, search, status }: Props) {
  const router = useRouter();
  const [modal,   setModal]   = useState<'add' | 'edit' | null>(null);
  const [form,    setForm]    = useState<Partial<Patient>>(EMPTY);
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState('');
  const [delId,   setDelId]   = useState<number | null>(null);

  const totalPages = Math.ceil(total / limit);

  const pushFilter = (key: string, val: string) => {
    const p = new URLSearchParams({ search, status, page: '1' });
    p.set(key, val);
    router.push(`/patients?${p}`);
  };

  const openAdd  = () => { setForm(EMPTY); setError(''); setModal('add'); };
  const openEdit = (p: Patient) => { setForm({ ...p }); setError(''); setModal('edit'); };
  const close    = () => { setModal(null); setError(''); };

  const save = async () => {
    setLoading(true); setError('');
    try {
      const url    = modal === 'edit' ? `/api/patients/${form.id}` : '/api/patients';
      const method = modal === 'edit' ? 'PUT' : 'POST';
      const res    = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
      if (!res.ok) { const d = await res.json(); throw new Error(d.error); }
      close(); router.refresh();
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Failed');
    } finally { setLoading(false); }
  };

  const del = async (id: number) => {
    setLoading(true);
    try {
      await fetch(`/api/patients/${id}`, { method: 'DELETE' });
      setDelId(null); router.refresh();
    } finally { setLoading(false); }
  };

  const field = (key: keyof Patient, label: string, type = 'text', opts?: string[]) => (
    <div>
      <label className="field-label">{label}</label>
      {opts ? (
        <select
          className="field-input"
          value={(form[key] as string) ?? ''}
          onChange={e => setForm(f => ({ ...f, [key]: e.target.value || undefined }))}
        >
          <option value="">Select…</option>
          {opts.map(o => <option key={o} value={o}>{o}</option>)}
        </select>
      ) : (
        <input
          type={type}
          className="field-input"
          value={(form[key] as string) ?? ''}
          onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
        />
      )}
    </div>
  );

  return (
    <div className="p-7 page-enter">
      <PageHeader
        title="Patients"
        subtitle={`${total} total patients`}
        action={<button className="btn-primary" onClick={openAdd}><Plus size={16} />Add Patient</button>}
      />

      {/* Filters */}
      <div className="flex gap-3 mb-6">
        <div className="relative flex-1 max-w-sm">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            className="field-input pl-9"
            placeholder="Search patients…"
            defaultValue={search}
            onKeyDown={e => { if (e.key === 'Enter') pushFilter('search', (e.target as HTMLInputElement).value); }}
          />
        </div>
        <select
          className="field-input w-40"
          value={status}
          onChange={e => pushFilter('status', e.target.value)}
        >
          {statusOpts.map(s => <option key={s} value={s}>{s || 'All statuses'}</option>)}
        </select>
      </div>

      {/* Table */}
      <div className="card overflow-hidden">
        <table className="data-table">
          <thead>
            <tr>
              <th>Patient</th>
              <th>Contact</th>
              <th>DOB / Gender</th>
              <th>Blood</th>
              <th>Status</th>
              <th>Notes</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {patients.length === 0 && (
              <tr><td colSpan={7} className="text-center py-14 text-slate-400">No patients found</td></tr>
            )}
            {patients.map(p => (
              <tr key={p.id}>
                <td>
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                      {p.first_name[0]}{p.last_name[0]}
                    </div>
                    <div>
                      <p className="font-semibold text-slate-800">{p.first_name} {p.last_name}</p>
                      <p className="text-xs text-slate-400">#{p.id}</p>
                    </div>
                  </div>
                </td>
                <td>
                  <p className="text-sm">{p.email ?? '—'}</p>
                  <p className="text-xs text-slate-400">{p.phone ?? '—'}</p>
                </td>
                <td>
                  <p className="text-sm">{p.date_of_birth ? new Date(p.date_of_birth).toLocaleDateString('en-GB') : '—'}</p>
                  <p className="text-xs text-slate-400 capitalize">{p.gender ?? '—'}</p>
                </td>
                <td>
                  {p.blood_type
                    ? <span className="inline-block bg-red-50 text-red-700 text-xs font-bold px-2 py-0.5 rounded-lg">{p.blood_type}</span>
                    : <span className="text-slate-400">—</span>}
                </td>
                <td><StatusBadge status={p.status} /></td>
                <td className="max-w-[180px]">
                  <p className="text-xs text-slate-500 truncate">{p.medical_notes ?? '—'}</p>
                </td>
                <td>
                  <div className="flex items-center gap-1.5">
                    <button onClick={() => openEdit(p)} className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors">
                      <Edit2 size={14} />
                    </button>
                    <button onClick={() => setDelId(p.id)} className="p-1.5 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-600 transition-colors">
                      <Trash2 size={14} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-5">
          <p className="text-sm text-slate-500">Page {page} of {totalPages} · {total} patients</p>
          <div className="flex gap-2">
            <button
              disabled={page <= 1}
              onClick={() => router.push(`/patients?search=${search}&status=${status}&page=${page - 1}`)}
              className="btn-secondary py-2 px-3 disabled:opacity-40"
            ><ChevronLeft size={16} /></button>
            <button
              disabled={page >= totalPages}
              onClick={() => router.push(`/patients?search=${search}&status=${status}&page=${page + 1}`)}
              className="btn-secondary py-2 px-3 disabled:opacity-40"
            ><ChevronRight size={16} /></button>
          </div>
        </div>
      )}

      {/* Add/Edit Modal */}
      {modal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={e => e.target === e.currentTarget && close()}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto animate-slide-up">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 sticky top-0 bg-white z-10">
              <div className="flex items-center gap-2">
                <User size={18} className="text-teal-500" />
                <h2 className="font-bold text-slate-800" style={{ fontFamily: 'Playfair Display, serif' }}>
                  {modal === 'add' ? 'Add New Patient' : 'Edit Patient'}
                </h2>
              </div>
              <button onClick={close} className="p-1.5 hover:bg-slate-100 rounded-lg"><X size={18} /></button>
            </div>
            <div className="p-6 space-y-5">
              {error && <p className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-2.5 rounded-xl">{error}</p>}
              <div className="grid grid-cols-2 gap-4">
                {field('first_name', 'First Name')}
                {field('last_name',  'Last Name')}
                {field('email', 'Email', 'email')}
                {field('phone', 'Phone', 'tel')}
                {field('date_of_birth', 'Date of Birth', 'date')}
                {field('gender', 'Gender', 'text', genderOpts)}
                {field('blood_type', 'Blood Type', 'text', bloodOpts)}
                {field('status', 'Status', 'text', ['active','stable','critical','discharged'])}
              </div>
              <div>
                <label className="field-label">Address</label>
                <input className="field-input" value={form.address ?? ''} onChange={e => setForm(f => ({ ...f, address: e.target.value }))} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                {field('emergency_contact_name',  'Emergency Contact Name')}
                {field('emergency_contact_phone', 'Emergency Contact Phone', 'tel')}
              </div>
              <div>
                <label className="field-label">Medical Notes</label>
                <textarea
                  className="field-input resize-none"
                  rows={3}
                  value={form.medical_notes ?? ''}
                  onChange={e => setForm(f => ({ ...f, medical_notes: e.target.value }))}
                />
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button onClick={close} className="btn-secondary">Cancel</button>
                <button onClick={save} disabled={loading} className="btn-primary disabled:opacity-60">
                  {loading ? 'Saving…' : modal === 'add' ? 'Add Patient' : 'Save Changes'}
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
            <h3 className="font-bold text-slate-800 mb-2">Delete Patient?</h3>
            <p className="text-slate-500 text-sm mb-5">This action cannot be undone. All related records will be removed.</p>
            <div className="flex gap-3 justify-end">
              <button onClick={() => setDelId(null)} className="btn-secondary">Cancel</button>
              <button onClick={() => del(delId)} disabled={loading} className="btn-danger disabled:opacity-60">
                {loading ? 'Deleting…' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
