import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";

interface SaweriaWebhookBody {
  version: string;
  created_at: string;
  id: string;
  type: string;
  amount_raw: number;
  cut: number;
  donator_name: string;
  donator_email: string;
  donator_is_user: boolean;
  message: string;
  etc: {
    qr_string?: string;
    amount_to_display?: number;
    transaction_fee_policy?: string;
  };
}

export async function POST(req: NextRequest) {
  const body: SaweriaWebhookBody = await req.json();

  // Parse platform from donator_name (format: "platform-name")
  const platform = body.donator_name?.split("-")[0]?.toLowerCase() ?? "";

  // Save donation to DB
  await pool.query(
    `INSERT INTO donations (
      id, version, created_at, type, amount_raw, cut,
      donator_name, donator_email, donator_is_user, message,
      platform, qr_string, amount_to_display, transaction_fee_policy
    ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14)
    ON CONFLICT (id) DO NOTHING`,
    [
      body.id,
      body.version,
      body.created_at,
      body.type,
      body.amount_raw,
      body.cut,
      body.donator_name,
      body.donator_email,
      body.donator_is_user,
      body.message,
      platform,
      body.etc?.qr_string ?? null,
      body.etc?.amount_to_display ?? null,
      body.etc?.transaction_fee_policy ?? null,
    ]
  );

  // Look up webhook target for this platform
  const { rows } = await pool.query(
    "SELECT webhook_url FROM webhook_targets WHERE platform = $1",
    [platform]
  );

  let forwardedTo: string | null = null;
  let forwardedAt: string | null = null;

  if (rows.length > 0) {
    const targetUrl: string = rows[0].webhook_url;

    try {
      await fetch(targetUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      forwardedTo = targetUrl;
      forwardedAt = new Date().toISOString();

      await pool.query(
        "UPDATE donations SET forwarded_to = $1, forwarded_at = $2 WHERE id = $3",
        [forwardedTo, forwardedAt, body.id]
      );
    } catch {
      // Forward failure is non-fatal, donation is already saved
    }
  }

  return NextResponse.json({ received: true, platform, forwarded_to: forwardedTo });
}
