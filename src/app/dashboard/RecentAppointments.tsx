'use client';
import Link from 'next/link';
import { Activity } from 'lucide-react';
import { Appointment } from '@/lib/types';
import { fmtDateTime } from '@/lib/format';
import { Avatar, initialsFromName } from '@/components/ui/Avatar';
import { StatusBadge } from '@/components/ui/StatusBadge';

interface RecentAppointmentsProps {
    appointments: Partial<Appointment>[];
}

export function RecentAppointments({ appointments }: RecentAppointmentsProps) {
    return (
        <div className="col-span-3 card overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
                <div className="flex items-center gap-2">
                    <Activity size={16} className="text-teal-500" />
                    <h2 className="font-semibold text-slate-700 text-sm">Recent Appointments</h2>
                </div>
                <Link
                    href="/appointments"
                    className="text-xs text-teal-600 font-semibold hover:underline"
                >
                    View all →
                </Link>
            </div>

            <div className="divide-y divide-slate-50">
                {appointments.length === 0 && (
                    <p className="text-slate-400 text-sm text-center py-10">
                        No appointments found
                    </p>
                )}
                {appointments.map((a) => (
                    <div
                        key={a.id}
                        className="flex items-center gap-3 px-5 py-3.5 hover:bg-slate-50/60 transition-colors"
                    >
                        <Avatar
                            initials={initialsFromName(a.patient_name ?? '?')}
                            colorClass="bg-gradient-to-br from-teal-400 to-teal-600"
                            size="md"
                        />
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-slate-700 truncate">
                                {a.patient_name}
                            </p>
                            <p className="text-xs text-slate-400 truncate">
                                Dr. {a.doctor_name} · {a.department_name}
                            </p>
                        </div>
                        <div className="text-right flex-shrink-0">
                            <StatusBadge status={a.status!} />
                            <p className="text-xs text-slate-400 mt-1">
                                {fmtDateTime(a.scheduled_at!)}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}