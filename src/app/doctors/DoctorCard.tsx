'use client';
import { Edit2, Trash2 } from 'lucide-react';
import { Doctor } from '@/lib/types';
import { Avatar } from '@/components/ui/Avatar';
import { StatusBadge } from '@/components/ui/StatusBadge';

interface DoctorCardProps {
    doctor: Doctor;
    index: number;
    onEdit: (doctor: Doctor) => void;
    onDelete: (id: number) => void;
}

export function DoctorCard({ doctor, index, onEdit, onDelete }: DoctorCardProps) {
    const infoRows: [string, string][] = [
        ['Dept', doctor.department_name ?? '—'],
        ['License', doctor.license_number],
        ['Email', doctor.email],
        ['Phone', doctor.phone ?? '—'],
    ];

    return (
        <div className="card p-5 hover:shadow-card-hover transition-shadow">
            <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                    <Avatar
                        initials={doctor.avatar_initials || `${doctor.first_name[0]}${doctor.last_name[0]}`}
                        colorIndex={index}
                        size="lg"
                    />
                    <div>
                        <p className="font-bold text-slate-800">
                            Dr. {doctor.first_name} {doctor.last_name}
                        </p>
                        <p className="text-xs text-slate-400">{doctor.specialization}</p>
                    </div>
                </div>
                <StatusBadge status={doctor.status} />
            </div>

            {/* Info rows */}
            <div className="space-y-1.5 text-sm text-slate-500 mb-4">
                {infoRows.map(([label, value]) => (
                    <div key={label} className="flex items-center gap-2">
                        <span className="w-20 text-xs text-slate-400 uppercase tracking-wide font-medium">
                            {label}
                        </span>
                        <span
                            className={`text-slate-600 truncate text-xs ${label === 'License' ? 'font-mono' : ''
                                }`}
                        >
                            {value}
                        </span>
                    </div>
                ))}
            </div>

            <div className="flex gap-2 pt-3 border-t border-slate-100">
                <button
                    onClick={() => onEdit(doctor)}
                    className="flex-1 btn-secondary py-2 text-xs justify-center"
                >
                    <Edit2 size={13} /> Edit
                </button>
                <button
                    onClick={() => onDelete(doctor.id)}
                    className="p-2 hover:bg-red-50 hover:text-red-600 rounded-lg text-slate-400 transition-colors"
                >
                    <Trash2 size={14} />
                </button>
            </div>
        </div>
    );
}