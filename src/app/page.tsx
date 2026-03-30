import { query } from '@/lib/db';
import { DashboardStats } from '@/lib/types';
import { DashboardClient } from './dashboard/DashboardClient';

// Combined stats query - reduces from 6 queries to 1
async function getStats(): Promise<DashboardStats> {
  const result = await query(`
    SELECT 
      COALESCE((SELECT COUNT(*) FROM patients WHERE status != 'discharged'), 0) as total_patients,
      COALESCE((SELECT COUNT(*) FROM doctors WHERE status = 'active'), 0) as total_doctors,
      COALESCE((SELECT COUNT(*) FROM appointments WHERE scheduled_at::date = CURRENT_DATE), 0) as today_appointments,
      COALESCE((SELECT COUNT(*) FROM patients WHERE status = 'critical'), 0) as critical_patients,
      COALESCE((SELECT COUNT(*) FROM appointments WHERE status='completed' AND scheduled_at::date = CURRENT_DATE), 0) as completed_today,
      COALESCE((SELECT COUNT(*) FROM appointments WHERE status IN ('scheduled','confirmed') AND scheduled_at >= NOW()), 0) as pending_appointments
  `);

  const data = result.rows[0];
  return {
    totalPatients: parseInt(String(data.total_patients)),
    totalDoctors: parseInt(String(data.total_doctors)),
    todayAppointments: parseInt(String(data.today_appointments)),
    criticalPatients: parseInt(String(data.critical_patients)),
    completedToday: parseInt(String(data.completed_today)),
    pendingAppointments: parseInt(String(data.pending_appointments)),
  };
}

// Get recent appointments with optimized query
async function getRecentAppointments() {
  const res = await query(
    `SELECT 
       a.id, 
       a.scheduled_at, 
       a.status, 
       a.reason, 
       a.duration_min,
       CONCAT(p.first_name, ' ', p.last_name) AS patient_name,
       CONCAT(d.first_name, ' ', d.last_name) AS doctor_name,
       dep.name AS department_name
     FROM appointments a
     INNER JOIN patients p ON p.id = a.patient_id
     INNER JOIN doctors d ON d.id = a.doctor_id
     LEFT JOIN departments dep ON dep.id = a.department_id
     ORDER BY a.scheduled_at DESC 
     LIMIT 8`
  );
  return res.rows;
}

// Get critical patients with optimized query
async function getCriticalPatients() {
  const res = await query(
    `SELECT 
       id, 
       first_name, 
       last_name, 
       blood_type, 
       status, 
       medical_notes, 
       phone,
       updated_at
     FROM patients 
     WHERE status IN ('critical', 'stable') 
     ORDER BY 
       CASE WHEN status = 'critical' THEN 1 ELSE 2 END,
       updated_at DESC 
     LIMIT 6`
  );
  return res.rows;
}

// Main dashboard page
export default async function DashboardPage() {
  const [stats, appointments, criticalPatients] = await Promise.all([
    getStats(),
    getRecentAppointments(),
    getCriticalPatients(),
  ]);

  return <DashboardClient
    stats={stats}
    appointments={appointments}
    criticalPatients={criticalPatients}
  />;
}