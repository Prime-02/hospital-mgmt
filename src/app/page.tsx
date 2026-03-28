import { query } from '@/lib/db';
import { DashboardStats } from '@/lib/types';
import { DashboardClient } from './DashboardClient';

async function getStats(): Promise<DashboardStats> {
  const [patients, doctors, todayAppts, critical, completed, pending] =
    await Promise.all([
      query("SELECT COUNT(*) FROM patients WHERE status != 'discharged'"),
      query("SELECT COUNT(*) FROM doctors WHERE status = 'active'"),
      query("SELECT COUNT(*) FROM appointments WHERE scheduled_at::date = CURRENT_DATE"),
      query("SELECT COUNT(*) FROM patients WHERE status = 'critical'"),
      query("SELECT COUNT(*) FROM appointments WHERE status='completed' AND scheduled_at::date=CURRENT_DATE"),
      query("SELECT COUNT(*) FROM appointments WHERE status IN ('scheduled','confirmed') AND scheduled_at >= NOW()"),
    ]);
  return {
    totalPatients:       parseInt(patients.rows[0].count),
    totalDoctors:        parseInt(doctors.rows[0].count),
    todayAppointments:   parseInt(todayAppts.rows[0].count),
    criticalPatients:    parseInt(critical.rows[0].count),
    completedToday:      parseInt(completed.rows[0].count),
    pendingAppointments: parseInt(pending.rows[0].count),
  };
}

async function getRecentAppointments() {
  const res = await query(
    `SELECT a.id, a.scheduled_at, a.status, a.reason, a.duration_min,
       p.first_name||' '||p.last_name AS patient_name,
       d.first_name||' '||d.last_name AS doctor_name,
       dep.name AS department_name
     FROM appointments a
     JOIN patients p ON p.id = a.patient_id
     JOIN doctors  d ON d.id = a.doctor_id
     LEFT JOIN departments dep ON dep.id = a.department_id
     ORDER BY a.scheduled_at DESC LIMIT 8`
  );
  return res.rows;
}

async function getCriticalPatients() {
  const res = await query(
    `SELECT id, first_name, last_name, blood_type, status, medical_notes, phone
     FROM patients WHERE status IN ('critical','stable') ORDER BY status, updated_at DESC LIMIT 6`
  );
  return res.rows;
}

export default async function DashboardPage() {
  const [stats, appointments, criticalPatients] = await Promise.all([
    getStats(),
    getRecentAppointments(),
    getCriticalPatients(),
  ]);

  return <DashboardClient stats={stats} appointments={appointments} criticalPatients={criticalPatients} />;
}
