import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET() {
  try {
    const [patients, doctors, todayAppts, critical, completed, pending] =
      await Promise.all([
        query('SELECT COUNT(*) FROM patients WHERE status != $1', ['discharged']),
        query("SELECT COUNT(*) FROM doctors WHERE status = 'active'"),
        query(
          "SELECT COUNT(*) FROM appointments WHERE scheduled_at::date = CURRENT_DATE"
        ),
        query("SELECT COUNT(*) FROM patients WHERE status = 'critical'"),
        query(
          "SELECT COUNT(*) FROM appointments WHERE status = 'completed' AND scheduled_at::date = CURRENT_DATE"
        ),
        query(
          "SELECT COUNT(*) FROM appointments WHERE status IN ('scheduled','confirmed') AND scheduled_at >= NOW()"
        ),
      ]);

    return NextResponse.json({
      totalPatients:       parseInt(patients.rows[0].count),
      totalDoctors:        parseInt(doctors.rows[0].count),
      todayAppointments:   parseInt(todayAppts.rows[0].count),
      criticalPatients:    parseInt(critical.rows[0].count),
      completedToday:      parseInt(completed.rows[0].count),
      pendingAppointments: parseInt(pending.rows[0].count),
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'DB error' }, { status: 500 });
  }
}
