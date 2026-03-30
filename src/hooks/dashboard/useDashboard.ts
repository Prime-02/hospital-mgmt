"use client";
import { useMemo } from "react";
import { DashboardStats, Appointment, Patient } from "@/lib/types";

export function useDashboard(
  stats: DashboardStats,
  appointments: Partial<Appointment>[],
  criticalPatients: Partial<Patient>[],
) {
  const dashboardData = useMemo(() => {
    return {
      stats,
      appointments,
      criticalPatients,
      summary: {
        totalActive: stats.totalPatients + stats.totalDoctors,
        completionRate:
          stats.todayAppointments > 0
            ? Math.round((stats.completedToday / stats.todayAppointments) * 100)
            : 0,
      },
    };
  }, [stats, appointments, criticalPatients]);

  return {
    dashboardData,
    hasCriticalPatients: criticalPatients.length > 0,
    hasAppointments: appointments.length > 0,
  };
}
