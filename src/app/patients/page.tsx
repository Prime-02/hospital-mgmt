import { query } from '@/lib/db';
import { PatientsClient } from './PatientsClient';

export default async function PatientsPage({
  searchParams,
}: {
  searchParams: { search?: string; status?: string; page?: string };
}) {
  const search = searchParams.search || '';
  const status = searchParams.status || '';
  const page   = parseInt(searchParams.page || '1');
  const limit  = 10;
  const offset = (page - 1) * limit;

  let where = 'WHERE 1=1';
  const params: unknown[] = [];
  let i = 1;

  if (search) {
    where += ` AND (first_name ILIKE $${i} OR last_name ILIKE $${i} OR email ILIKE $${i} OR phone ILIKE $${i})`;
    params.push(`%${search}%`); i++;
  }
  if (status) { where += ` AND status = $${i}`; params.push(status); i++; }

  const countRes = await query(`SELECT COUNT(*) FROM patients ${where}`, params);
  const total    = parseInt(countRes.rows[0].count);

  const rows = await query(
    `SELECT * FROM patients ${where} ORDER BY created_at DESC LIMIT $${i} OFFSET $${i + 1}`,
    [...params, limit, offset]
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
