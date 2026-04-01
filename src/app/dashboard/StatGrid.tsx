'use client';
import { DashboardStats } from '@/lib/types';
import { StatCard } from './StatCard';
import {
    Activity,
    AlertTriangle,
    Calendar,
    CheckCircle2,
    Clock,
    Stethoscope,
    Users,
} from 'lucide-react';

interface StatGridProps {
    stats: DashboardStats;
}

export function StatGrid({ stats }: StatGridProps) {
    const cards = [
        {
            label: 'Active Patients',
            value: stats.totalPatients,
            icon: Users,
            light: 'bg-blue-50',
            text: 'text-blue-600',
            trend: '+3 this week',
        },
        {
            label: 'Active Doctors',
            value: stats.totalDoctors,
            icon: Stethoscope,
            light: 'bg-teal-50',
            text: 'text-teal-600',
            trend: 'All on duty',
        },
        {
            label: "Today's Appointments",
            value: stats.todayAppointments,
            icon: Calendar,
            light: 'bg-violet-50',
            text: 'text-violet-600',
            trend: `${stats.completedToday} completed`,
        },
        {
            label: 'Critical Patients',
            value: stats.criticalPatients,
            icon: AlertTriangle,
            light: 'bg-red-50',
            text: 'text-red-600',
            trend: 'Needs attention',
        },
        {
            label: 'Pending Appointments',
            value: stats.pendingAppointments,
            icon: Clock,
            light: 'bg-amber-50',
            text: 'text-amber-600',
            trend: 'Upcoming',
        },
        {
            label: 'Completed Today',
            value: stats.completedToday,
            icon: CheckCircle2,
            light: 'bg-emerald-50',
            text: 'text-emerald-600',
            trend: 'Good progress',
        },
    ];

    return (
        <div className="grid grid-cols-1 gap-4 mb-8 sm:grid-cols-2 xl:grid-cols-3">
            {cards.map((card) => (
                <StatCard key={card.label} {...card} />
            ))}
        </div>
    );
}