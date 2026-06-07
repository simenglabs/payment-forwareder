import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";

// DELETE /api/webhook-targets/[id]
export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const { rowCount } = await pool.query(
    "DELETE FROM webhook_targets WHERE id = $1",
    [id]
  );

  if (rowCount === 0) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json({ success: true });
}
