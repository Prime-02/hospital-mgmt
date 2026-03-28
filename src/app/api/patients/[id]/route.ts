import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET(_: NextRequest, { params }: { params: { id: string } }) {
  try {
    const res = await query('SELECT * FROM patients WHERE id = $1', [params.id]);
    if (!res.rows[0]) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json(res.rows[0]);
  } catch (err) {
    return NextResponse.json({ error: 'DB error' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const body = await req.json();
  const {
    first_name, last_name, email, phone, date_of_birth,
    gender, blood_type, address, emergency_contact_name,
    emergency_contact_phone, medical_notes, status,
  } = body;

  try {
    const res = await query(
      `UPDATE patients SET
        first_name=$1,last_name=$2,email=$3,phone=$4,date_of_birth=$5,
        gender=$6,blood_type=$7,address=$8,emergency_contact_name=$9,
        emergency_contact_phone=$10,medical_notes=$11,status=$12,
        updated_at=NOW()
       WHERE id=$13 RETURNING *`,
      [first_name,last_name,email||null,phone||null,date_of_birth||null,
       gender||null,blood_type||null,address||null,emergency_contact_name||null,
       emergency_contact_phone||null,medical_notes||null,status,params.id]
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
    await query('DELETE FROM patients WHERE id = $1', [params.id]);
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: 'DB error' }, { status: 500 });
  }
}
