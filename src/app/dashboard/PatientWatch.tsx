'use client';
import Link from 'next/link';
import { TrendingUp } from 'lucide-react';
import { Patient } from '@/lib/types';
import { Avatar } from '@/components/ui/Avatar';
import { StatusBadge } from '@/components/ui/StatusBadge';

interface PatientWatchProps {
    patients: Partial<Patient>[];
}

export function PatientWatch({ patients }: PatientWatchProps) {
    return (
        <div className="col-span-2 card overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
                <div className="flex items-center gap-2">
                    <TrendingUp size={16} className="text-red-500" />
                    <h2 className="font-semibold text-slate-700 text-sm">Patient Watch</h2>
                </div>
                <Link
                    href="/patients"
                    className="text-xs text-teal-600 font-semibold hover:underline"
                >
                    View all →
                </Link>
            </div>

            <div className="divide-y divide-slate-50">
                {patients.length === 0 && (
                    <p className="text-slate-400 text-sm text-center py-10">
                        No patients to watch
                    </p>
                )}
                {patients.map((p) => (
                    <div
                        key={p.id}
                        className="px-5 py-3.5 hover:bg-slate-50/60 transition-colors"
                    >
                        <div className="flex items-start justify-between gap-2">
                            <div className="flex items-center gap-2.5">
                                <Avatar
                                    initials={`${p.first_name![0]}${p.last_name![0]}`}
                                    colorClass={
                                        p.status === 'critical' ? 'bg-red-500' : 'bg-blue-500'
                                    }
                                    size="sm"
                                />
                                <div>
                                    <p className="text-sm font-semibold text-slate-700">
                                        {p.first_name} {p.last_name}
                                    </p>
                                    <p className="text-xs text-slate-400">
                                        {p.blood_type ?? '—'} · {p.phone ?? 'No phone'}
                                    </p>
                                </div>
                            </div>
                            <StatusBadge status={p.status!} />
                        </div>
                        {p.medical_notes && (
                            <p className="text-xs text-slate-500 mt-1.5 ml-9 line-clamp-1">
                                {p.medical_notes}
                            </p>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}