import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET(_: NextRequest, { params }: { params: { id: string } }) {
  try {
    const res = await query(
      `SELECT d.*, dep.name AS department_name
       FROM doctors d LEFT JOIN departments dep ON dep.id = d.department_id
       WHERE d.id = $1`,
      [params.id]
    );
    if (!res.rows[0]) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json(res.rows[0]);
  } catch {
    return NextResponse.json({ error: 'DB error' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const body = await req.json();
  const { first_name, last_name, email, phone, specialization, department_id, license_number, status } = body;
  try {
    const res = await query(
      `UPDATE doctors SET first_name=$1,last_name=$2,email=$3,phone=$4,
        specialization=$5,department_id=$6,license_number=$7,status=$8,updated_at=NOW()
       WHERE id=$9 RETURNING *`,
      [first_name,last_name,email,phone||null,specialization,department_id||null,license_number,status,params.id]
    );
    if (!res.rows[0]) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json(res.rows[0]);
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'DB error';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

export async function DELETE(_: NextRequest, { params }: { params: { id: string } }) {
  try {
    await query('DELETE FROM doctors WHERE id=$1', [params.id]);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'DB error' }, { status: 500 });
  }
}
