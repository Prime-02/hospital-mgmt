'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Appointment, Patient, Doctor, Department } from '@/lib/types';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { PageHeader } from '@/components/ui/PageHeader';
import { Plus, Search, Edit2, Trash2, X, Calendar, Clock } from 'lucide-react';

interface Props {
  appointments: Appointment[];
  patients: Partial<Patient>[];
  doctors: Partial<Doctor>[];
  departments: Department[];
  search: string;
  status: string;
  date: string;
}

type AptStatus = Appointment['status'];

const EMPTY: Partial<Appointment> = {
  patient_id: undefined,
  doctor_id: undefined,
  department_id: undefined,
  scheduled_at: '',
  duration_min: 30,
  reason: '',
  notes: '',
  status: 'scheduled',
};

const statusOpts: AptStatus[] = ['scheduled','confirmed','in_progress','completed','cancelled','no_show'];

function fmtDate(dt: string) {
  return new Date(dt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
}
function fmtTime(dt: string) {
  return new Date(dt).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
}
function toDateTimeLocal(dt: string) {
  if (!dt) return '';
  const d = new Date(dt);
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

const statusColors: Record<string, string> = {
  scheduled: 'border-l-violet-400',
  confirmed: 'border-l-sky-400',
  in_progress: 'border-l-amber-400',
  completed: 'border-l-emerald-400',
  cancelled: 'border-l-red-400',
  no_show: 'border-l-slate-300',
};

export function AppointmentsClient({ appointments, patients, doctors, departments, search, status, date }: Props) {
  const router = useRouter();
  const [modal,   setModal]   = useState<'add' | 'edit' | null>(null);
  const [form,    setForm]    = useState<Partial<Appointment>>(EMPTY);
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState('');
  const [delId,   setDelId]   = useState<number | null>(null);

  const pushFilter = (key: string, val: string) => {
    const p = new URLSearchParams({ search, status, date });
    p.set(key, val);
    router.push(`/appointments?${p}`);
  };

  const openAdd  = () => { setForm(EMPTY); setError(''); setModal('add'); };
  const openEdit = (a: Appointment) => {
    setForm({ ...a, scheduled_at: toDateTimeLocal(a.scheduled_at) });
    setError(''); setModal('edit');
  };
  const close    = () => { setModal(null); setError(''); };

  const save = async () => {
    setLoading(true); setError('');
    try {
      const url    = modal === 'edit' ? `/api/appointments/${form.id}` : '/api/appointments';
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
      await fetch(`/api/appointments/${id}`, { method: 'DELETE' });
      setDelId(null); router.refresh();
    } finally { setLoading(false); }
  };

  const quickStatus = async (id: number, newStatus: AptStatus) => {
    await fetch(`/api/appointments/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...(appointments.find(a => a.id === id) || {}), status: newStatus }),
    });
    router.refresh();
  };

  return (
    <div className="p-7 page-enter">
      <PageHeader
        title="Appointments"
        subtitle={`${appointments.length} appointments`}
        action={<button className="btn-primary" onClick={openAdd}><Plus size={16} />Schedule Appointment</button>}
      />

      {/* Filters */}
      <div className="flex gap-3 mb-6 flex-wrap">
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            className="field-input pl-9"
            placeholder="Search patient or doctor…"
            defaultValue={search}
            onKeyDown={e => { if (e.key === 'Enter') pushFilter('search', (e.target as HTMLInputElement).value); }}
          />
        </div>
        <select className="field-input w-44" value={status} onChange={e => pushFilter('status', e.target.value)}>
          <option value="">All statuses</option>
          {statusOpts.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
        <input
          type="date"
          className="field-input w-44"
          value={date}
          onChange={e => pushFilter('date', e.target.value)}
        />
        {(search || status || date) && (
          <button className="btn-secondary" onClick={() => router.push('/appointments')}>Clear</button>
        )}
      </div>

      {/* Table */}
      <div className="card overflow-hidden">
        <table className="data-table">
          <thead>
            <tr>
              <th>Patient</th>
              <th>Doctor</th>
              <th>Department</th>
              <th>Date & Time</th>
              <th>Duration</th>
              <th>Reason</th>
              <th>Status</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {appointments.length === 0 && (
              <tr><td colSpan={8} className="text-center py-14 text-slate-400">No appointments found</td></tr>
            )}
            {appointments.map(a => (
              <tr key={a.id} className={`border-l-2 ${statusColors[a.status] ?? 'border-l-transparent'}`}>
                <td>
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                      {(a.patient_name ?? '?').split(' ').map((n: string) => n[0]).join('').slice(0, 2)}
                    </div>
                    <span className="font-medium text-slate-800">{a.patient_name}</span>
                  </div>
                </td>
                <td className="text-slate-600">Dr. {a.doctor_name}</td>
                <td>
                  {a.department_name
                    ? <span className="bg-slate-100 text-slate-600 text-xs px-2 py-0.5 rounded-md">{a.department_name}</span>
                    : <span className="text-slate-400">—</span>}
                </td>
                <td>
                  <div className="flex items-center gap-1.5 text-sm">
                    <Calendar size={13} className="text-slate-400" />
                    <span>{fmtDate(a.scheduled_at)}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-slate-400 mt-0.5">
                    <Clock size={11} />
                    <span>{fmtTime(a.scheduled_at)}</span>
                  </div>
                </td>
                <td className="text-sm text-slate-600">{a.duration_min} min</td>
                <td className="max-w-[160px]">
                  <p className="text-xs text-slate-500 truncate">{a.reason ?? '—'}</p>
                </td>
                <td>
                  <select
                    className="text-xs border border-slate-200 rounded-lg px-2 py-1 bg-white focus:outline-none focus:ring-1 focus:ring-teal-400 cursor-pointer"
                    value={a.status}
                    onChange={e => quickStatus(a.id, e.target.value as AptStatus)}
                  >
                    {statusOpts.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </td>
                <td>
                  <div className="flex items-center gap-1.5">
                    <button onClick={() => openEdit(a)} className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors">
                      <Edit2 size={14} />
                    </button>
                    <button onClick={() => setDelId(a.id)} className="p-1.5 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-600 transition-colors">
                      <Trash2 size={14} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add/Edit Modal */}
      {modal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={e => e.target === e.currentTarget && close()}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto animate-slide-up">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 sticky top-0 bg-white z-10">
              <div className="flex items-center gap-2">
                <Calendar size={18} className="text-teal-500" />
                <h2 className="font-bold text-slate-800" style={{ fontFamily: 'Playfair Display, serif' }}>
                  {modal === 'add' ? 'Schedule Appointment' : 'Edit Appointment'}
                </h2>
              </div>
              <button onClick={close} className="p-1.5 hover:bg-slate-100 rounded-lg"><X size={18} /></button>
            </div>
            <div className="p-6 space-y-4">
              {error && <p className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-2.5 rounded-xl">{error}</p>}

              <div>
                <label className="field-label">Patient</label>
                <select className="field-input" value={form.patient_id ?? ''} onChange={e => setForm(f => ({ ...f, patient_id: parseInt(e.target.value) }))}>
                  <option value="">Select patient…</option>
                  {patients.map(p => <option key={p.id} value={p.id}>{p.first_name} {p.last_name}</option>)}
                </select>
              </div>
              <div>
                <label className="field-label">Doctor</label>
                <select className="field-input" value={form.doctor_id ?? ''} onChange={e => setForm(f => ({ ...f, doctor_id: parseInt(e.target.value) }))}>
                  <option value="">Select doctor…</option>
                  {doctors.map(d => <option key={d.id} value={d.id}>Dr. {d.first_name} {d.last_name}</option>)}
                </select>
              </div>
              <div>
                <label className="field-label">Department</label>
                <select className="field-input" value={form.department_id ?? ''} onChange={e => setForm(f => ({ ...f, department_id: e.target.value ? parseInt(e.target.value) : undefined }))}>
                  <option value="">None</option>
                  {departments.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="field-label">Date & Time</label>
                  <input type="datetime-local" className="field-input" value={form.scheduled_at ?? ''} onChange={e => setForm(f => ({ ...f, scheduled_at: e.target.value }))} />
                </div>
                <div>
                  <label className="field-label">Duration (minutes)</label>
                  <input type="number" min={10} max={240} className="field-input" value={form.duration_min ?? 30} onChange={e => setForm(f => ({ ...f, duration_min: parseInt(e.target.value) }))} />
                </div>
              </div>
              <div>
                <label className="field-label">Status</label>
                <select className="field-input" value={form.status ?? 'scheduled'} onChange={e => setForm(f => ({ ...f, status: e.target.value as AptStatus }))}>
                  {statusOpts.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div>
                <label className="field-label">Reason for Visit</label>
                <input className="field-input" value={form.reason ?? ''} onChange={e => setForm(f => ({ ...f, reason: e.target.value }))} />
              </div>
              <div>
                <label className="field-label">Notes</label>
                <textarea className="field-input resize-none" rows={2} value={form.notes ?? ''} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} />
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button onClick={close} className="btn-secondary">Cancel</button>
                <button onClick={save} disabled={loading} className="btn-primary disabled:opacity-60">
                  {loading ? 'Saving…' : modal === 'add' ? 'Schedule' : 'Save Changes'}
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
            <h3 className="font-bold text-slate-800 mb-2">Cancel Appointment?</h3>
            <p className="text-slate-500 text-sm mb-5">This will permanently delete the appointment record.</p>
            <div className="flex gap-3 justify-end">
              <button onClick={() => setDelId(null)} className="btn-secondary">Keep It</button>
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
