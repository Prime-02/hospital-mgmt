import { query } from '@/lib/db';
import { AppointmentsClient } from './AppointmentsClient';

export default async function AppointmentsPage({
  searchParams,
}: {
  searchParams: { search?: string; status?: string; date?: string };
}) {
  const search = searchParams.search || '';
  const status = searchParams.status || '';
  const date   = searchParams.date   || '';

  let where = 'WHERE 1=1';
  const params: unknown[] = [];
  let i = 1;

  if (search) {
    where += ` AND (p.first_name ILIKE $${i} OR p.last_name ILIKE $${i} OR d.first_name ILIKE $${i} OR d.last_name ILIKE $${i})`;
    params.push(`%${search}%`); i++;
  }
  if (status) { where += ` AND a.status = $${i}`; params.push(status); i++; }
  if (date)   { where += ` AND a.scheduled_at::date = $${i}`; params.push(date); i++; }

  const [appointments, patients, doctors, departments] = await Promise.all([
    query(
      `SELECT a.*,
         p.first_name||' '||p.last_name AS patient_name,
         d.first_name||' '||d.last_name AS doctor_name,
         dep.name AS department_name
       FROM appointments a
       JOIN patients p ON p.id = a.patient_id
       JOIN doctors  d ON d.id = a.doctor_id
       LEFT JOIN departments dep ON dep.id = a.department_id
       ${where} ORDER BY a.scheduled_at DESC`,
      params
    ),
    query('SELECT id, first_name, last_name FROM patients ORDER BY first_name'),
    query('SELECT id, first_name, last_name FROM doctors ORDER BY first_name'),
    query('SELECT * FROM departments ORDER BY name'),
  ]);

  return (
    <AppointmentsClient
      appointments={appointments.rows}
      patients={patients.rows}
      doctors={doctors.rows}
      departments={departments.rows}
      search={search}
      status={status}
      date={date}
    />
  );
}
