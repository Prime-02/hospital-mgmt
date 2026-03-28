import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const search = searchParams.get('search') || '';
  const status = searchParams.get('status') || '';

  let where = 'WHERE 1=1';
  const params: unknown[] = [];
  let i = 1;

  if (search) {
    where += ` AND (d.first_name ILIKE $${i} OR d.last_name ILIKE $${i} OR d.specialization ILIKE $${i})`;
    params.push(`%${search}%`);
    i++;
  }
  if (status) {
    where += ` AND d.status = $${i}`;
    params.push(status);
    i++;
  }

  try {
    const res = await query(
      `SELECT d.*, dep.name AS department_name
       FROM doctors d
       LEFT JOIN departments dep ON dep.id = d.department_id
       ${where} ORDER BY d.created_at DESC`,
      params
    );
    return NextResponse.json(res.rows);
  } catch (err) {
    return NextResponse.json({ error: 'DB error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const {
    first_name, last_name, email, phone, specialization,
    department_id, license_number, status = 'active', avatar_initials,
  } = body;

  if (!first_name || !last_name || !specialization || !license_number) {
    return NextResponse.json({ error: 'Required fields missing' }, { status: 400 });
  }

  try {
    const res = await query(
      `INSERT INTO doctors
         (first_name,last_name,email,phone,specialization,department_id,license_number,status,avatar_initials)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNING *`,
      [first_name,last_name,email,phone||null,specialization,
       department_id||null,license_number,status,
       avatar_initials || `${first_name[0]}${last_name[0]}`.toUpperCase()]
    );
    return NextResponse.json(res.rows[0], { status: 201 });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'DB error';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
