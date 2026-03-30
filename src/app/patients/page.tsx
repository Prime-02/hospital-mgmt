import { query } from '@/lib/db';
import { PatientsClient } from './PatientsClient';
import { Patient } from '@/lib/types';

export default async function PatientsPage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string; status?: string; page?: string }>;
}) {
  const params = await searchParams;
  const search = params.search || '';
  const status = params.status || '';
  const page = parseInt(params.page || '1');
  const limit = 10;
  const offset = (page - 1) * limit;

  let where = 'WHERE 1=1';
  const queryParams: unknown[] = [];
  let i = 1;

  if (search) {
    where += ` AND (first_name ILIKE $${i} OR last_name ILIKE $${i} OR email ILIKE $${i} OR phone ILIKE $${i})`;
    queryParams.push(`%${search}%`); i++;
  }
  if (status) { where += ` AND status = $${i}`; queryParams.push(status); i++; }

  const countRes = await query(`SELECT COUNT(*) FROM patients ${where}`, queryParams);
  const total = parseInt(String(countRes.rows[0].count)); // Convert to string first

  const rows: { rows: Patient[] } = await query(
    `SELECT * FROM patients ${where} ORDER BY created_at DESC LIMIT $${i} OFFSET $${i + 1}`,
    [...queryParams, limit, offset]
  );

  return (
    <PatientsClient
      patients={rows.rows}
      total={total}
      page={page}
      limit={limit}
      search={search}
      status={status}
    />
  );
}