import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";

// GET /api/webhook-targets - list all
// POST /api/webhook-targets - create or upsert by platform
export async function GET() {
  const { rows } = await pool.query(
    "SELECT * FROM webhook_targets ORDER BY created_at DESC"
  );
  return NextResponse.json({ data: rows });
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { platform, webhook_url } = body;

  if (!platform || !webhook_url) {
    return NextResponse.json(
      { error: "platform and webhook_url are required" },
      { status: 400 }
    );
  }

  const { rows } = await pool.query(
    `INSERT INTO webhook_targets (platform, webhook_url)
     VALUES ($1, $2)
     ON CONFLICT (platform) DO UPDATE SET webhook_url = EXCLUDED.webhook_url
     RETURNING *`,
    [platform.toLowerCase(), webhook_url]
  );

  return NextResponse.json({ data: rows[0] }, { status: 201 });
}
