import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const search = searchParams.get('search') || '';
  const status = searchParams.get('status') || '';
  const date   = searchParams.get('date')   || '';

  let where = 'WHERE 1=1';
  const params: unknown[] = [];
  let i = 1;

  if (search) {
    where += ` AND (p.first_name ILIKE $${i} OR p.last_name ILIKE $${i} OR d.first_name ILIKE $${i} OR d.last_name ILIKE $${i})`;
    params.push(`%${search}%`); i++;
  }
  if (status) { where += ` AND a.status = $${i}`; params.push(status); i++; }
  if (date)   { where += ` AND a.scheduled_at::date = $${i}`; params.push(date); i++; }

  try {
    const res = await query(
      `SELECT a.*,
        p.first_name||' '||p.last_name AS patient_name,
        d.first_name||' '||d.last_name AS doctor_name,
        dep.name AS department_name
       FROM appointments a
       JOIN patients p    ON p.id  = a.patient_id
       JOIN doctors  d    ON d.id  = a.doctor_id
       LEFT JOIN departments dep ON dep.id = a.department_id
       ${where} ORDER BY a.scheduled_at DESC`,
      params
    );
    return NextResponse.json(res.rows);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'DB error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { patient_id, doctor_id, department_id, scheduled_at, duration_min = 30, reason, notes, status = 'scheduled' } = body;

  if (!patient_id || !doctor_id || !scheduled_at) {
    return NextResponse.json({ error: 'patient_id, doctor_id and scheduled_at are required' }, { status: 400 });
  }

  try {
    const res = await query(
      `INSERT INTO appointments (patient_id,doctor_id,department_id,scheduled_at,duration_min,reason,notes,status)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING *`,
      [patient_id, doctor_id, department_id||null, scheduled_at, duration_min, reason||null, notes||null, status]
    );
    return NextResponse.json(res.rows[0], { status: 201 });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'DB error';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
