import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET() {
  try {
    const res = await query('SELECT * FROM departments ORDER BY name');
    return NextResponse.json(res.rows);
  } catch {
    return NextResponse.json({ error: 'DB error' }, { status: 500 });
  }
}
