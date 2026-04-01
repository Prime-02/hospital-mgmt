'use client';
import { Calendar, Clock, Edit2, Trash2 } from 'lucide-react';
import { Appointment, AptStatus } from '@/lib/types';
import { fmtDate, fmtTime } from '@/lib/format';
import { Avatar, initialsFromName } from '@/components/ui/Avatar';

const STATUS_OPTS: AptStatus[] = [
    'scheduled',
    'confirmed',
    'in_progress',
    'completed',
    'cancelled',
    'no_show',
];

const STATUS_BORDER: Record<string, string> = {
    scheduled: 'border-l-violet-400',
    confirmed: 'border-l-sky-400',
    in_progress: 'border-l-amber-400',
    completed: 'border-l-emerald-400',
    cancelled: 'border-l-red-400',
    no_show: 'border-l-slate-300',
};

interface AppointmentTableProps {
    appointments: Appointment[];
    onEdit: (appointment: Appointment) => void;
    onDelete: (id: number) => void;
    onStatusChange: (id: number, status: AptStatus) => void;
}

export function AppointmentTable({
    appointments,
    onEdit,
    onDelete,
    onStatusChange,
}: AppointmentTableProps) {
    if (appointments.length === 0) {
        return (
            <div className="card overflow-hidden">
                <div className="text-center py-14 text-slate-400">
                    No appointments found
                </div>
            </div>
        );
    }

    return (
        <div className="card overflow-hidden">
            <div className="overflow-x-auto">
                <table className="data-table min-w-[720px]">
                    <thead>
                        <tr>
                            <th>Patient</th>
                            <th>Doctor</th>
                            <th>Department</th>
                            <th>Date &amp; Time</th>
                            <th>Duration</th>
                            <th>Reason</th>
                            <th>Status</th>
                            <th />
                        </tr>
                    </thead>
                    <tbody>
                        {appointments.map((a) => (
                            <tr
                                key={a.id}
                                className={`border-l-2 ${STATUS_BORDER[a.status] ?? 'border-l-transparent'}`}
                            >
                                <td>
                                    <div className="flex items-center gap-2">
                                        <Avatar
                                            initials={initialsFromName(a.patient_name ?? '?')}
                                            colorIndex={0}
                                            size="sm"
                                        />
                                        <span className="font-medium text-slate-800">{a.patient_name}</span>
                                    </div>
                                </td>
                                <td className="text-slate-600">Dr. {a.doctor_name}</td>
                                <td>
                                    {a.department_name ? (
                                        <span className="bg-slate-100 text-slate-600 text-xs px-2 py-0.5 rounded-md">
                                            {a.department_name}
                                        </span>
                                    ) : (
                                        <span className="text-slate-400">—</span>
                                    )}
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
                                        onChange={(e) => onStatusChange(a.id, e.target.value as AptStatus)}
                                    >
                                        {STATUS_OPTS.map((s) => (
                                            <option key={s} value={s}>
                                                {s}
                                            </option>
                                        ))}
                                    </select>
                                </td>
                                <td>
                                    <div className="flex items-center gap-1.5">
                                        <button
                                            onClick={() => onEdit(a)}
                                            className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors"
                                        >
                                            <Edit2 size={14} />
                                        </button>
                                        <button
                                            onClick={() => onDelete(a.id)}
                                            className="p-1.5 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-600 transition-colors"
                                        >
                                            <Trash2 size={14} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}