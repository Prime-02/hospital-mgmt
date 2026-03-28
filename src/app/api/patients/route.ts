import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const search = searchParams.get('search') || '';
  const status = searchParams.get('status') || '';
  const page   = parseInt(searchParams.get('page') || '1');
  const limit  = 10;
  const offset = (page - 1) * limit;

  try {
    let where = 'WHERE 1=1';
    const params: unknown[] = [];
    let i = 1;

    if (search) {
      where += ` AND (first_name ILIKE $${i} OR last_name ILIKE $${i} OR email ILIKE $${i})`;
      params.push(`%${search}%`);
      i++;
    }
    if (status) {
      where += ` AND status = $${i}`;
      params.push(status);
      i++;
    }

    const countRes = await query(`SELECT COUNT(*) FROM patients ${where}`, params);
    const total    = parseInt(countRes.rows[0].count);

    const rows = await query(
      `SELECT * FROM patients ${where} ORDER BY created_at DESC LIMIT $${i} OFFSET $${i + 1}`,
      [...params, limit, offset]
    );

    return NextResponse.json({ patients: rows.rows, total, page, limit });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'DB error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const {
    first_name, last_name, email, phone, date_of_birth,
    gender, blood_type, address, emergency_contact_name,
    emergency_contact_phone, medical_notes, status = 'active',
  } = body;

  if (!first_name || !last_name) {
    return NextResponse.json({ error: 'first_name and last_name required' }, { status: 400 });
  }

  try {
    const res = await query(
      `INSERT INTO patients
         (first_name,last_name,email,phone,date_of_birth,gender,blood_type,
          address,emergency_contact_name,emergency_contact_phone,medical_notes,status)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12)
       RETURNING *`,
      [first_name,last_name,email||null,phone||null,date_of_birth||null,
       gender||null,blood_type||null,address||null,
       emergency_contact_name||null,emergency_contact_phone||null,
       medical_notes||null,status]
    );
    return NextResponse.json(res.rows[0], { status: 201 });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'DB error';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
