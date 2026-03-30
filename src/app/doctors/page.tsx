import { query } from '@/lib/db';
import { DoctorsClient } from './DoctorsClient';
import { Department, Doctor } from '@/lib/types';


export default async function DoctorsPage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string; status?: string }>;
}) {
  const params = await searchParams;
  const search = params.search || '';
  const status = params.status || '';

  let where = 'WHERE 1=1';
  const queryParams: unknown[] = [];
  let i = 1;

  if (search) {
    where += ` AND (d.first_name ILIKE $${i} OR d.last_name ILIKE $${i} OR d.specialization ILIKE $${i} OR d.email ILIKE $${i})`;
    queryParams.push(`%${search}%`); i++;
  }
  if (status) { where += ` AND d.status = $${i}`; queryParams.push(status); i++; }

  const [doctors, departments] = await Promise.all([
    query<Doctor>(
      `SELECT d.*, dep.name AS department_name
       FROM doctors d LEFT JOIN departments dep ON dep.id = d.department_id
       ${where} ORDER BY d.created_at DESC`,
      queryParams
    ),
    query<Department>('SELECT * FROM departments ORDER BY name'),
  ]);

  return (
    <DoctorsClient
      doctors={doctors.rows as Doctor[]}
      departments={departments.rows as Department[]}
      search={search}
      status={status}
    />
  );
}