import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";
import { createHash } from "crypto";

const ADMIN_AUTH_KEY = process.env.ADMIN_AUTH_KEY || "hospital-admin-key";

function hashPassword(value: string) {
  return createHash("sha256").update(value).digest("hex");
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { username, email, password, authKey } = body;

  if (!username || !password || !authKey) {
    return NextResponse.json(
      { error: "username, password, and authKey are required" },
      { status: 400 },
    );
  }

  if (authKey !== ADMIN_AUTH_KEY) {
    return NextResponse.json({ error: "Invalid auth key" }, { status: 403 });
  }

  try {
    const existing = await query(
      "SELECT id FROM users WHERE username = $1 OR email = $2",
      [username, email || null],
    );

    if ((existing.rowCount ?? 0) > 0) {
      return NextResponse.json(
        { error: "A user with that username or email already exists" },
        { status: 409 },
      );
    }

    const passwordHash = hashPassword(password);
    const result = await query(
      `INSERT INTO users (username, email, password_hash, is_admin)
       VALUES ($1, $2, $3, true)
       RETURNING id, username, email, is_admin`,
      [username, email || null, passwordHash],
    );

    return NextResponse.json(
      {
        message: "Signup successful",
        user: result.rows[0],
      },
      { status: 201 },
    );
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "DB error";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
