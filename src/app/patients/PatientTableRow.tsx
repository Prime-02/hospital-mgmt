'use client';
import { Edit2, Trash2 } from 'lucide-react';
import { Patient } from '@/lib/types';
import { Avatar } from '@/components/ui/Avatar';
import { StatusBadge } from '@/components/ui/StatusBadge';

interface PatientTableRowProps {
    patient: Patient;
    onEdit: (patient: Patient) => void;
    onDelete: (id: number) => void;
}

export function PatientTableRow({ patient, onEdit, onDelete }: PatientTableRowProps) {
    return (
        <tr>
            {/* Name */}
            <td>
                <div className="flex items-center gap-2.5">
                    <Avatar
                        initials={`${patient.first_name[0]}${patient.last_name[0]}`}
                        size="md"
                    />
                    <div>
                        <p className="font-semibold text-slate-800">
                            {patient.first_name} {patient.last_name}
                        </p>
                        <p className="text-xs text-slate-400">#{patient.id}</p>
                    </div>
                </div>
            </td>

            {/* Contact */}
            <td>
                <p className="text-sm">{patient.email ?? '—'}</p>
                <p className="text-xs text-slate-400">{patient.phone ?? '—'}</p>
            </td>

            {/* DOB / Gender */}
            <td>
                <p className="text-sm">
                    {patient.date_of_birth
                        ? new Date(patient.date_of_birth).toLocaleDateString('en-GB')
                        : '—'}
                </p>
                <p className="text-xs text-slate-400 capitalize">
                    {patient.gender ?? '—'}
                </p>
            </td>

            {/* Blood */}
            <td>
                {patient.blood_type ? (
                    <span className="inline-block bg-red-50 text-red-700 text-xs font-bold px-2 py-0.5 rounded-lg">
                        {patient.blood_type}
                    </span>
                ) : (
                    <span className="text-slate-400">—</span>
                )}
            </td>

            {/* Status */}
            <td>
                <StatusBadge status={patient.status} />
            </td>

            {/* Notes */}
            <td className="max-w-[180px]">
                <p className="text-xs text-slate-500 truncate">
                    {patient.medical_notes ?? '—'}
                </p>
            </td>

            {/* Actions */}
            <td>
                <div className="flex items-center gap-1.5">
                    <button
                        onClick={() => onEdit(patient)}
                        className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors"
                    >
                        <Edit2 size={14} />
                    </button>
                    <button
                        onClick={() => onDelete(patient.id)}
                        className="p-1.5 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-600 transition-colors"
                    >
                        <Trash2 size={14} />
                    </button>
                </div>
            </td>
        </tr>
    );
}