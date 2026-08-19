import { readFile } from "node:fs/promises";
import path from "node:path";
import { NextRequest, NextResponse } from "next/server";
import {
  GUIDE_COOKIE,
  GUIDE_DOWNLOAD_NAME,
  readAccessToken,
} from "@/lib/field-guide";

export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  const access = readAccessToken(req.cookies.get(GUIDE_COOKIE)?.value);
  if (!access) {
    // Bounce back to the gate rather than returning a bare 401 — this URL is
    // reachable from a stale bookmark once the unlock expires.
    return NextResponse.redirect(new URL("/field-guide?expired=1", req.url));
  }

  let pdf: Buffer;
  try {
    // Literal segments keep Turbopack's file tracing scoped to private/
    // instead of pulling in the whole project.
    pdf = await readFile(
      path.join(process.cwd(), "private", "sitepulse-field-guide.pdf"),
    );
  } catch (err) {
    console.error("[field-guide] could not read the PDF:", err);
    return NextResponse.json(
      { error: "The field guide is temporarily unavailable." },
      { status: 500 },
    );
  }

  return new NextResponse(new Uint8Array(pdf), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Length": String(pdf.byteLength),
      "Content-Disposition": `attachment; filename="${GUIDE_DOWNLOAD_NAME}"`,
      "Cache-Control": "private, no-store",
    },
  });
}
