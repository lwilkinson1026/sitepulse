import { Resend } from "resend";

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/**
 * Emails the team a label/value table. If Resend isn't configured the fields
 * are logged instead so nothing is lost — the same fallback the contact route
 * uses. Never throws: a failed notification must not block a checkout or make
 * Stripe retry a webhook.
 */
export async function notifyTeam(
  tag: string,
  subject: string,
  fields: ReadonlyArray<readonly [string, string]>,
  replyTo?: string,
): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO_EMAIL;
  const from = process.env.CONTACT_FROM_EMAIL;

  if (!apiKey || !to || !from) {
    console.warn(
      `[${tag}] RESEND_API_KEY / CONTACT_TO_EMAIL / CONTACT_FROM_EMAIL not set — logging instead of sending`,
    );
    console.log(`[${tag}] ${subject}`, Object.fromEntries(fields), {
      at: new Date().toISOString(),
    });
    return;
  }

  try {
    const resend = new Resend(apiKey);
    const { error } = await resend.emails.send({
      from,
      to,
      replyTo,
      subject,
      text: fields.map(([k, v]) => `${k}: ${v}`).join("\n"),
      html: `<table style="font-family:system-ui,sans-serif;font-size:14px;line-height:1.6">${fields
        .map(
          ([k, v]) =>
            `<tr><td style="padding-right:16px"><strong>${escapeHtml(k)}</strong></td><td>${escapeHtml(v)}</td></tr>`,
        )
        .join("")}</table>`,
    });
    if (error) console.error(`[${tag}] Resend error:`, error);
  } catch (err) {
    console.error(`[${tag}] send failed:`, err);
  }
}
