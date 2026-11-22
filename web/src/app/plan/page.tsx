import type { Metadata } from "next";
import { Footer } from "../components/Footer";
import { Header } from "../components/Header";
import { newsletterOffer } from "@/lib/newsletter";
import {
  DELIVERY_FEE_USD,
  ONLINE_WINDOW_LABEL,
  RENT_MONTHLY_USD,
  SERVICE_AREA_CODES,
  SERVICE_AREA_LABEL,
} from "@/lib/rental";
import { RentFlow } from "./RentFlow";

export const metadata: Metadata = {
  title: `SitePulse — Power + Wi-Fi anywhere. $${RENT_MONTHLY_USD}/mo.`,
  description: `Portable power and Starlink Wi-Fi, anywhere. $${RENT_MONTHLY_USD}/mo + $${DELIVERY_FEE_USD} one-time setup. Drop a pin and your unit is online in ${ONLINE_WINDOW_LABEL}. ${SERVICE_AREA_LABEL}.`,
};

export default function PlanPage() {
  return (
    <>
      <Header />
      <main className="relative pt-[68px] overflow-hidden">
        <div className="absolute inset-0 grid-bg opacity-40 pointer-events-none" />
        <div
          className="nebula"
          style={{ width: 640, height: 640, right: "-180px", top: "4%", opacity: 0.22 }}
        />

        <div className="relative max-w-[1440px] mx-auto px-5 sm:px-8 pt-8 pb-24">
          <div className="flex items-center gap-3 mono text-[11px] tracking-[.18em] text-zinc-500 uppercase">
            <span className="pulse-dot" />
            <span>NOW SHIPPING · FIRST 5 V1 UNITS · {SERVICE_AREA_CODES}</span>
          </div>

          <h1
            className="display-x mt-5 leading-[.95] max-w-[1000px]"
            style={{ fontSize: "clamp(34px, 5vw, 64px)" }}
          >
            Drop a pin.
            <br />
            <span style={{ color: "var(--hi)" }} className="text-glow">
              Online in {ONLINE_WINDOW_LABEL}.
            </span>
          </h1>

          <p className="mt-5 max-w-[640px] text-[16px] leading-[1.65] text-zinc-400">
            Tell us where the unit goes and pay the first month. We deliver it, set it up
            and bring Starlink online — power and internet on a site that has neither.
          </p>

          <div className="mt-9">
            <RentFlow offer={newsletterOffer()} />
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
