import { createHash } from "crypto";

const CONVERSIONS_ENDPOINT =
  "https://ads-api.x.com/12/measurement/conversions/rdcan";

function sha256(value: string): string {
  return createHash("sha256").update(value).digest("hex");
}

/** Normalize + SHA-256 an email per X's matching requirements. */
export function hashEmail(email: string): string {
  return sha256(email.trim().toLowerCase());
}

/** SHA-256 a phone number already in E.164 form (e.g. +14155551234). */
export function hashPhone(phoneE164: string): string {
  return sha256(phoneE164.trim());
}

export type ConversionIdentifier = {
  twclid?: string;
  hashed_email?: string;
  hashed_phone_number?: string;
  ip_address?: string;
  user_agent?: string;
};

export type Conversion = {
  event_id: string;
  conversion_time?: string;
  event_source_url?: string;
  conversion_id?: string;
  identifiers: ConversionIdentifier[];
};

export async function sendTwitterConversions(
  conversions: Conversion[],
): Promise<void> {
  const token = process.env.X_PIXEL_TOKEN;
  if (!token) {
    throw new Error("X_PIXEL_TOKEN is not set");
  }

  const withDefaults = conversions.map((c) => ({
    conversion_time: c.conversion_time ?? new Date().toISOString(),
    ...c,
  }));

  const res = await fetch(CONVERSIONS_ENDPOINT, {
    method: "POST",
    headers: {
      "X-Pixel-Token": token,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ conversions: withDefaults }),
  });

  if (!res.ok) {
    const detail = await res.text().catch(() => "");
    throw new Error(
      `X conversions API returned ${res.status}: ${detail.slice(0, 500)}`,
    );
  }
}
