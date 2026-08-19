import type { Metadata } from "next";
import { cookies } from "next/headers";
import Image from "next/image";
import Link from "next/link";
import { Eyebrow } from "../components/Eyebrow";
import { Footer } from "../components/Footer";
import { Header } from "../components/Header";
import { GUIDE_COOKIE, readAccessToken } from "@/lib/field-guide";
import { FieldGuideForm } from "./FieldGuideForm";

export const metadata: Metadata = {
  title: "Sitepulse — Printable Field Guide",
  description:
    "Download the Sitepulse printable field guide: annotated photos of every panel, port, and control on the unit, plus fueling, charging, and safety notes. Free PDF.",
};

const INSIDE: ReadonlyArray<{ label: string; body: string }> = [
  {
    label: "Every panel, annotated",
    body: "Photographs of the unit from all sides with each port, latch, and control called out by name — so a crew that has never seen a Sitepulse can find what they need.",
  },
  {
    label: "Fuel & charge inputs",
    body: "The auxiliary/quick-disconnect fuel input, the 110/120 V wall charge cable, and the solar charge input (up to 800 W) — where they are and how they interact.",
  },
  {
    label: "Safety callouts",
    body: "The valve states that matter, the hot surfaces, and the failure modes worth knowing before the unit is left running unattended.",
  },
  {
    label: "Service access",
    body: "How the cover comes off, what the Starlink Mini needs if you relocate it, and where to reach the engine for oil checks.",
  },
];

export default async function FieldGuidePage({
  searchParams,
}: {
  searchParams: Promise<{ expired?: string }>;
}) {
  const [jar, params] = await Promise.all([cookies(), searchParams]);
  const unlocked = readAccessToken(jar.get(GUIDE_COOKIE)?.value) !== null;
  const expired = params.expired === "1";

  return (
    <>
      <Header />

      <section
        id="top"
        className="relative pt-[68px] overflow-hidden border-b"
        style={{ borderColor: "var(--line)" }}
      >
        <div className="absolute inset-0 grid-bg opacity-40" />
        <div
          className="nebula"
          style={{ width: 640, height: 640, right: "-160px", top: "8%", opacity: 0.25 }}
        />
        <div className="relative max-w-[1440px] mx-auto px-8 pt-12 pb-24">
          <div className="mt-4 flex items-center gap-3 mono text-[11px] tracking-[.18em] text-zinc-500 uppercase">
            <span className="pulse-dot" />
            <span>PRINTABLE PDF · KEEP ONE IN THE TRUCK</span>
          </div>

          <h1
            className="display-x mt-8 leading-[.92] max-w-[1100px]"
            style={{ fontSize: "clamp(48px, 8vw, 116px)" }}
          >
            The Sitepulse
            <br />
            <span style={{ color: "var(--hi)" }} className="text-glow">
              field guide.
            </span>
          </h1>

          <p className="mt-10 max-w-[640px] text-[17px] leading-[1.65] text-zinc-400">
            A print-ready walkthrough of the unit — every port, latch, valve,
            and charge input photographed and labeled, with the safety notes
            that matter when the unit runs unattended. Built for the person
            standing in front of it, not for a desk.
          </p>

          {expired && !unlocked && (
            <p
              className="mt-8 inline-block border px-4 py-3 mono text-[11px] tracking-[.14em] uppercase text-zinc-300"
              style={{ borderColor: "var(--line-strong)" }}
            >
              That download link has expired — enter your email to unlock it again.
            </p>
          )}

          <div className="mt-20 grid grid-cols-1 lg:grid-cols-12 gap-16">
            <div className="lg:col-span-7">
              <Eyebrow num="01" label="WHAT'S INSIDE" />
              <div
                className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-px"
                style={{ background: "var(--line-strong)" }}
              >
                {INSIDE.map((i) => (
                  <div key={i.label} className="bg-black p-8 lift">
                    <div className="display text-[18px] tracking-[-.02em] text-[var(--hi)]">
                      {i.label}
                    </div>
                    <p className="mt-3 text-[14px] leading-[1.6] text-zinc-400">
                      {i.body}
                    </p>
                  </div>
                ))}
              </div>

              <div
                className="mt-16 relative aspect-[16/10] overflow-hidden border"
                style={{ borderColor: "var(--line-strong)" }}
              >
                <Image
                  src="/assets/product-prototype-solar.jpg"
                  alt="Sitepulse prototype unit deployed with a solar array"
                  fill
                  sizes="(max-width: 1024px) 100vw, 55vw"
                  className="object-cover"
                />
              </div>
            </div>

            <div className="lg:col-span-5">
              <FieldGuideForm unlocked={unlocked} />

              <div
                className="mt-px bg-black p-8 border-t"
                style={{ borderColor: "var(--line-strong)" }}
              >
                <div className="mono text-[10px] tracking-[.2em] uppercase text-zinc-500">
                  Questions the guide doesn&rsquo;t answer
                </div>
                <p className="mt-4 text-[15px] leading-[1.6] text-zinc-300">
                  A real person reads every message —{" "}
                  <Link href="/contact" className="text-[var(--hi)] hover:underline">
                    talk to the team
                  </Link>{" "}
                  or{" "}
                  <Link href="/#config" className="text-[var(--hi)] hover:underline">
                    configure a unit
                  </Link>
                  .
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
