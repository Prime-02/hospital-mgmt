import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";
import { createHash } from "crypto";

function hashPassword(value: string) {
  return createHash("sha256").update(value).digest("hex");
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { username, password } = body;

  if (!username || !password) {
    return NextResponse.json(
      { error: "username and password are required" },
      { status: 400 },
    );
  }

  try {
    const passwordHash = hashPassword(password);
    const result = await query(
      `SELECT id, username, email, is_admin
       FROM users
       WHERE username = $1 AND password_hash = $2`,
      [username, passwordHash],
    );

    if (result.rowCount === 0) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 },
      );
    }

    const user = result.rows[0];
    if (!user.is_admin) {
      return NextResponse.json(
        { error: "Admin access required" },
        { status: 403 },
      );
    }

    return NextResponse.json({ message: "Login successful", user });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "DB error";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
