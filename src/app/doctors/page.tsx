import { query } from '@/lib/db';
import { DoctorsClient } from './DoctorsClient';

export default async function DoctorsPage({
  searchParams,
}: {
  searchParams: { search?: string; status?: string };
}) {
  const search = searchParams.search || '';
  const status = searchParams.status || '';

  let where = 'WHERE 1=1';
  const params: unknown[] = [];
  let i = 1;

  if (search) {
    where += ` AND (d.first_name ILIKE $${i} OR d.last_name ILIKE $${i} OR d.specialization ILIKE $${i} OR d.email ILIKE $${i})`;
    params.push(`%${search}%`); i++;
  }
  if (status) { where += ` AND d.status = $${i}`; params.push(status); i++; }

  const [doctors, departments] = await Promise.all([
    query(
      `SELECT d.*, dep.name AS department_name
       FROM doctors d LEFT JOIN departments dep ON dep.id = d.department_id
       ${where} ORDER BY d.created_at DESC`,
      params
    ),
    query('SELECT * FROM departments ORDER BY name'),
  ]);

  return <DoctorsClient doctors={doctors.rows} departments={departments.rows} search={search} status={status} />;
}
