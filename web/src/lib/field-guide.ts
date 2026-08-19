import crypto from "node:crypto";

/** Cookie that grants access to the gated field-guide download. */
export const GUIDE_COOKIE = "sp_field_guide";

/** File name the browser sees when the PDF is downloaded. */
export const GUIDE_DOWNLOAD_NAME = "Sitepulse-Field-Guide.pdf";

/** How long an unlock lasts. */
export const GUIDE_MAX_AGE = 60 * 60 * 24 * 30; // 30 days

let ephemeralSecret: string | null = null;

function secret(): string {
  const configured = process.env.FIELD_GUIDE_SECRET;
  if (configured) return configured;

  // Fail safe rather than open: without a configured secret we still sign
  // tokens, just with a per-process key. Unlocks stop working across restarts
  // and across serverless instances, which is loud enough to get noticed.
  if (!ephemeralSecret) {
    ephemeralSecret = crypto.randomBytes(32).toString("hex");
    console.warn(
      "[field-guide] FIELD_GUIDE_SECRET is not set — signing with an ephemeral per-process key. Set it in .env.local and in the Vercel project env vars.",
    );
  }
  return ephemeralSecret;
}

function sign(payload: string): string {
  return crypto.createHmac("sha256", secret()).update(payload).digest("base64url");
}

/** Mint a signed token proving `email` unlocked the guide. */
export function issueAccessToken(email: string, issuedAt: number = Date.now()): string {
  const body = Buffer.from(`${issuedAt}:${email.toLowerCase()}`).toString("base64url");
  return `${body}.${sign(body)}`;
}

/** Verify a token; returns null if it is malformed, forged, or expired. */
export function readAccessToken(
  token: string | undefined,
): { email: string; issuedAt: number } | null {
  if (!token) return null;

  const dot = token.indexOf(".");
  if (dot < 1) return null;

  const body = token.slice(0, dot);
  const provided = Buffer.from(token.slice(dot + 1));
  const expected = Buffer.from(sign(body));
  if (provided.length !== expected.length) return null;
  if (!crypto.timingSafeEqual(provided, expected)) return null;

  const decoded = Buffer.from(body, "base64url").toString("utf8");
  const sep = decoded.indexOf(":");
  if (sep < 1) return null;

  const issuedAt = Number(decoded.slice(0, sep));
  const email = decoded.slice(sep + 1);
  if (!Number.isFinite(issuedAt) || !email) return null;
  if (Date.now() - issuedAt > GUIDE_MAX_AGE * 1000) return null;

  return { email, issuedAt };
}
