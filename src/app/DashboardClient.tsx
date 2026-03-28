'use client';
import { DashboardStats, Appointment, Patient } from '@/lib/types';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { Users, Stethoscope, Calendar, AlertTriangle, CheckCircle2, Clock, TrendingUp, Activity } from 'lucide-react';
import Link from 'next/link';

interface Props {
  stats: DashboardStats;
  appointments: Partial<Appointment>[];
  criticalPatients: Partial<Patient>[];
}

const statCards = (s: DashboardStats) => [
  {
    label: 'Active Patients',
    value: s.totalPatients,
    icon: Users,
    color: 'bg-blue-500',
    light: 'bg-blue-50',
    text: 'text-blue-600',
    trend: '+3 this week',
  },
  {
    label: 'Active Doctors',
    value: s.totalDoctors,
    icon: Stethoscope,
    color: 'bg-teal-500',
    light: 'bg-teal-50',
    text: 'text-teal-600',
    trend: 'All on duty',
  },
  {
    label: "Today's Appointments",
    value: s.todayAppointments,
    icon: Calendar,
    color: 'bg-violet-500',
    light: 'bg-violet-50',
    text: 'text-violet-600',
    trend: `${s.completedToday} completed`,
  },
  {
    label: 'Critical Patients',
    value: s.criticalPatients,
    icon: AlertTriangle,
    color: 'bg-red-500',
    light: 'bg-red-50',
    text: 'text-red-600',
    trend: 'Needs attention',
  },
  {
    label: 'Pending Appointments',
    value: s.pendingAppointments,
    icon: Clock,
    color: 'bg-amber-500',
    light: 'bg-amber-50',
    text: 'text-amber-600',
    trend: 'Upcoming',
  },
  {
    label: 'Completed Today',
    value: s.completedToday,
    icon: CheckCircle2,
    color: 'bg-emerald-500',
    light: 'bg-emerald-50',
    text: 'text-emerald-600',
    trend: 'Good progress',
  },
];

function fmt(dt: string) {
  return new Date(dt).toLocaleString('en-GB', {
    day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit',
  });
}

export function DashboardClient({ stats, appointments, criticalPatients }: Props) {
  const cards = statCards(stats);

  return (
    <div className="p-7 page-enter">
      {/* Header */}
      <div className="mb-8">
        <p className="text-slate-500 text-sm mb-0.5">
          {new Date().toLocaleDateString('en-GB', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </p>
        <h1 className="text-3xl font-bold text-slate-800" style={{ fontFamily: 'Playfair Display, serif' }}>
          Good morning, Admin 👋
        </h1>
        <p className="text-slate-500 mt-1 text-sm">Here's what's happening at MediCore today.</p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        {cards.map((c) => {
          const Icon = c.icon;
          return (
            <div key={c.label} className="card p-5 flex items-start gap-4 hover:shadow-card-hover transition-shadow">
              <div className={`${c.light} p-3 rounded-xl flex-shrink-0`}>
                <Icon size={22} className={c.text} />
              </div>
              <div className="min-w-0">
                <p className="text-slate-500 text-xs font-medium uppercase tracking-wide mb-1">{c.label}</p>
                <p className="stat-number text-3xl font-bold text-slate-800">{c.value}</p>
                <p className={`text-xs ${c.text} mt-1 font-medium`}>{c.trend}</p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-5 gap-6">
        {/* Recent appointments */}
        <div className="col-span-3 card overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <Activity size={16} className="text-teal-500" />
              <h2 className="font-semibold text-slate-700 text-sm">Recent Appointments</h2>
            </div>
            <Link href="/appointments" className="text-xs text-teal-600 font-semibold hover:underline">
              View all →
            </Link>
          </div>
          <div className="divide-y divide-slate-50">
            {appointments.length === 0 && (
              <p className="text-slate-400 text-sm text-center py-10">No appointments found</p>
            )}
            {appointments.map((a) => (
              <div key={a.id} className="flex items-center gap-3 px-5 py-3.5 hover:bg-slate-50/60 transition-colors">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-teal-400 to-teal-600 flex items-center justify-center flex-shrink-0">
                  <span className="text-white text-xs font-bold">
                    {(a.patient_name ?? '?').split(' ').map((n: string) => n[0]).join('').slice(0, 2)}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-slate-700 truncate">{a.patient_name}</p>
                  <p className="text-xs text-slate-400 truncate">Dr. {a.doctor_name} · {a.department_name}</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <StatusBadge status={a.status!} />
                  <p className="text-xs text-slate-400 mt-1">{fmt(a.scheduled_at!)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Critical & Stable patients */}
        <div className="col-span-2 card overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <TrendingUp size={16} className="text-red-500" />
              <h2 className="font-semibold text-slate-700 text-sm">Patient Watch</h2>
            </div>
            <Link href="/patients" className="text-xs text-teal-600 font-semibold hover:underline">
              View all →
            </Link>
          </div>
          <div className="divide-y divide-slate-50">
            {criticalPatients.length === 0 && (
              <p className="text-slate-400 text-sm text-center py-10">No patients to watch</p>
            )}
            {criticalPatients.map((p) => (
              <div key={p.id} className="px-5 py-3.5 hover:bg-slate-50/60 transition-colors">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0 ${p.status === 'critical' ? 'bg-red-500' : 'bg-blue-500'}`}>
                      {p.first_name![0]}{p.last_name![0]}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-700">{p.first_name} {p.last_name}</p>
                      <p className="text-xs text-slate-400">{p.blood_type ?? '—'} · {p.phone ?? 'No phone'}</p>
                    </div>
                  </div>
                  <StatusBadge status={p.status!} />
                </div>
                {p.medical_notes && (
                  <p className="text-xs text-slate-500 mt-1.5 ml-9 line-clamp-1">{p.medical_notes}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
