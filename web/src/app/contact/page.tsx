import type { Metadata } from "next";
import Link from "next/link";
import { Eyebrow } from "../components/Eyebrow";
import { Footer } from "../components/Footer";
import { Header } from "../components/Header";
import { ContactForm } from "./ContactForm";

export const metadata: Metadata = {
  title: "Sitepulse — Contact",
  description:
    "Talk to the team behind Sitepulse. Reservations, technical questions, dealers, field service, and press — designed and assembled in Yakima, Washington.",
};

const CHANNELS: ReadonlyArray<{ label: string; value: string; note: string }> = [
  {
    label: "Reservations",
    value: "Configure & reserve",
    note: "Build a unit and place a refundable deposit online.",
  },
  {
    label: "Dealers & distribution",
    value: "Partner with us",
    note: "Carrying Sitepulse or deploying a fleet? Start here.",
  },
  {
    label: "Field service",
    value: "Owner support",
    note: "Manuals, firmware, warranty, and on-site help.",
  },
];

export default function ContactPage() {
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
            <span>YAKIMA, WA · A REAL PERSON READS EVERY MESSAGE</span>
          </div>

          <h1
            className="display-x mt-8 leading-[.92] max-w-[1100px]"
            style={{ fontSize: "clamp(48px, 8vw, 116px)" }}
          >
            Talk to the
            <br />
            <span style={{ color: "var(--hi)" }} className="text-glow">
              people who build it.
            </span>
          </h1>

          <p className="mt-10 max-w-[640px] text-[17px] leading-[1.65] text-zinc-400">
            Questions about specs, a deployment, dealer terms, or your existing
            unit? Send a note and we&rsquo;ll get back to you. If you&rsquo;re
            ready to order, you can{" "}
            <Link href="/#config" className="text-[var(--hi)] hover:underline">
              configure and reserve a unit
            </Link>{" "}
            directly.
          </p>

          <div className="mt-20 grid grid-cols-1 lg:grid-cols-12 gap-16">
            <div className="lg:col-span-7">
              <Eyebrow num="01" label="SEND A MESSAGE" />
              <div className="mt-8">
                <ContactForm />
              </div>
            </div>

            <div className="lg:col-span-5">
              <Eyebrow num="02" label="WHAT WE CAN HELP WITH" />
              <div
                className="mt-8 grid grid-cols-1 gap-px"
                style={{ background: "var(--line-strong)" }}
              >
                {CHANNELS.map((c) => (
                  <div key={c.label} className="bg-black p-8 lift">
                    <div className="mono text-[10px] tracking-[.2em] uppercase text-zinc-500">
                      {c.label}
                    </div>
                    <div className="display mt-4 text-[22px] tracking-[-.02em] text-[var(--hi)]">
                      {c.value}
                    </div>
                    <p className="mt-3 text-[14px] leading-[1.55] text-zinc-400">
                      {c.note}
                    </p>
                  </div>
                ))}
              </div>

              <div
                className="mt-px bg-black p-8 border-t"
                style={{ borderColor: "var(--line-strong)" }}
              >
                <div className="mono text-[10px] tracking-[.2em] uppercase text-zinc-500">
                  Plant
                </div>
                <p className="mt-4 text-[15px] leading-[1.6] text-zinc-300">
                  Sitepulse Power, Inc.
                  <br />
                  Designed &amp; assembled in Yakima, Washington
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
