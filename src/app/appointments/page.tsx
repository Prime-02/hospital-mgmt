// ✅ Fixed code
import { query } from '@/lib/db';
import { AppointmentsClient } from './AppointmentsClient';
import { Appointment, Department, Doctor, Patient } from '@/lib/types';

// Define the extended Appointment type with joined fields
interface AppointmentWithDetails extends Appointment {
  patient_name: string;
  doctor_name: string;
  department_name: string;
}

export default async function AppointmentsPage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string; status?: string; date?: string }>;
}) {
  const params = await searchParams;
  const search = params.search || '';
  const status = params.status || '';
  const date = params.date || '';

  let where = 'WHERE 1=1';
  const queryParams: unknown[] = [];
  let i = 1;

  if (search) {
    where += ` AND (p.first_name ILIKE $${i} OR p.last_name ILIKE $${i} OR d.first_name ILIKE $${i} OR d.last_name ILIKE $${i})`;
    queryParams.push(`%${search}%`); i++;
  }
  if (status) { where += ` AND a.status = $${i}`; queryParams.push(status); i++; }
  if (date) { where += ` AND a.scheduled_at::date = $${i}`; queryParams.push(date); i++; }

  const [appointments, patients, doctors, departments] = await Promise.all([
    query<AppointmentWithDetails>(
      `SELECT a.*,
         p.first_name||' '||p.last_name AS patient_name,
         d.first_name||' '||d.last_name AS doctor_name,
         dep.name AS department_name
       FROM appointments a
       JOIN patients p ON p.id = a.patient_id
       JOIN doctors  d ON d.id = a.doctor_id
       LEFT JOIN departments dep ON dep.id = a.department_id
       ${where} ORDER BY a.scheduled_at DESC`,
      queryParams
    ),
    query<Patient>('SELECT id, first_name, last_name FROM patients ORDER BY first_name'),
    query<Doctor>('SELECT id, first_name, last_name FROM doctors ORDER BY first_name'),
    query<Department>('SELECT * FROM departments ORDER BY name'),
  ]);

  return (
    <AppointmentsClient
      appointments={appointments.rows as AppointmentWithDetails[]}
      patients={patients.rows as Patient[]}
      doctors={doctors.rows as Doctor[]}
      departments={departments.rows as Department[]}
      search={search}
      status={status}
      date={date}
    />
  );
}