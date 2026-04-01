'use client';
import { RecentAppointments } from './RecentAppointments';
import { PatientWatch } from './PatientWatch';
import { Appointment, Patient } from '@/lib/types';

interface DashboardContentProps {
    appointments: Partial<Appointment>[];
    criticalPatients: Partial<Patient>[];
}

export function DashboardContent({ appointments, criticalPatients }: DashboardContentProps) {
    return (
        <div className="grid grid-cols-1 gap-6 xl:grid-cols-5">
            <RecentAppointments appointments={appointments} />
            <PatientWatch patients={criticalPatients} />
        </div>
    );
}