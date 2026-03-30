'use client';
import { DashboardHeader } from './DashboardHeader';
import { DashboardContent } from './DashboardContent';
import { DashboardStats, Appointment, Patient } from '@/lib/types';
import { useDashboard } from '@/hooks/dashboard/useDashboard';
import { StatGrid } from './StatGrid';

interface Props {
  stats: DashboardStats;
  appointments: Partial<Appointment>[];
  criticalPatients: Partial<Patient>[];
}

export function DashboardClient({ stats, appointments, criticalPatients }: Props) {
  const { dashboardData } = useDashboard(stats, appointments, criticalPatients);

  return (
    <div className="p-7 page-enter">
      <DashboardHeader userName="Admin" />
      <StatGrid stats={dashboardData.stats} />
      <DashboardContent
        appointments={dashboardData.appointments}
        criticalPatients={dashboardData.criticalPatients}
      />
    </div>
  );
}