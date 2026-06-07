import { NextRequest, NextResponse } from "next/server";

const SAWERIA_URL =
  "https://backend.saweria.co/donations/snap/0b5a44a3-85ed-47f2-bf3d-a8bd423e5eec";

const DEFAULT_EMAIL = "menglabsofficial@gmail.com";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { nominal, email, platform, name } = body;

  if (!nominal || !platform || !name) {
    return NextResponse.json(
      { error: "nominal, platform, and name are required" },
      { status: 400 }
    );
  }

  const payload = {
    agree: true,
    notUnderage: true,
    message: "",
    amount: String(nominal),
    payment_type: "qris",
    vote: "",
    currency: "IDR",
    customer_info: {
      first_name: `${platform}-${name}`,
      email: email || DEFAULT_EMAIL,
      phone: "",
    },
  };

  const res = await fetch(SAWERIA_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      accept: "*/*",
      "accept-language": "en-US,en;q=0.9",
      origin: "https://saweria.co",
      referer: "https://saweria.co/",
      "user-agent":
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36",
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const text = await res.text();
    return NextResponse.json(
      { error: "Saweria request failed", detail: text },
      { status: res.status }
    );
  }

  const data = await res.json();
  const qr_string = data?.data?.qr_string;

  if (!qr_string) {
    return NextResponse.json(
      { error: "qr_string not found in response" },
      { status: 502 }
    );
  }

  return NextResponse.json({ qr_string }, { status: 201 });
}
