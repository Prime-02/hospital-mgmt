import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET(_: NextRequest, { params }: { params: { id: string } }) {
  try {
    const res = await query(
      `SELECT a.*,
        p.first_name||' '||p.last_name AS patient_name,
        d.first_name||' '||d.last_name AS doctor_name,
        dep.name AS department_name
       FROM appointments a
       JOIN patients p ON p.id = a.patient_id
       JOIN doctors  d ON d.id = a.doctor_id
       LEFT JOIN departments dep ON dep.id = a.department_id
       WHERE a.id = $1`,
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
  const { patient_id, doctor_id, department_id, scheduled_at, duration_min, reason, notes, status } = body;
  try {
    const res = await query(
      `UPDATE appointments SET patient_id=$1,doctor_id=$2,department_id=$3,scheduled_at=$4,
        duration_min=$5,reason=$6,notes=$7,status=$8,updated_at=NOW()
       WHERE id=$9 RETURNING *`,
      [patient_id,doctor_id,department_id||null,scheduled_at,duration_min,reason||null,notes||null,status,params.id]
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
    await query('DELETE FROM appointments WHERE id=$1', [params.id]);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'DB error' }, { status: 500 });
  }
}
