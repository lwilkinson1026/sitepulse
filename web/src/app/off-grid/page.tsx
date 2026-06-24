import type { Metadata } from "next";
import Link from "next/link";
import { Eyebrow } from "../components/Eyebrow";
import { Footer } from "../components/Footer";
import { Header } from "../components/Header";
import { SizingTool } from "./SizingTool";

export const metadata: Metadata = {
  title: "Sitepulse — Off-Grid System Sizing Tool",
  description:
    "Estimate your daily load, solar array size, number of SitePulse units, fuel use, and upfront cost for an off-grid home. Live, interactive, with city-level solar search.",
};

const HYBRID_POINTS: ReadonlyArray<{ title: string; body: string }> = [
  {
    title: "Battery carries the day",
    body: "Your home runs silently off the 1.54 kWh LFP pack (3.08 kWh with two units). Most hours of most days, nothing is burning fuel at all.",
  },
  {
    title: "Engine only in optimal bursts",
    body: "When state-of-charge drops or load spikes past the inverter, the 79cc engine runs in its 600–800 W sweet spot, tops the pack, and shuts down — far better fuel economy than a generator idling all day.",
  },
  {
    title: "Solar does the heavy lifting",
    body: "Sized for the coverage you pick, the array carries most of your annual energy. The engine simply fills the winter gap when production drops to 35–45% of summer.",
  },
];

const FAQ_ITEMS: ReadonlyArray<{ q: string; a: string }> = [
  {
    q: "How does this compare to a traditional off-grid system?",
    a: "A whole-home off-grid setup usually means a custom battery bank, a separate inverter, a standalone generator, and a solar array — all engineered, permitted, and installed by a contractor. That typically runs $30,000–$50,000+ and takes weeks of design and site visits. SitePulse packages the battery, inverter, hybrid engine, and Starlink into one finished unit. Most homes size out well under $10,000 here for the same grid-like reliability.",
  },
  {
    q: "Do I need a custom installation or a contractor?",
    a: "No. SitePulse is built to deploy like Starlink or a Tesla Powerwall — a complete product, not a construction project. There's no rack of separate components to wire together and no custom engineering for a standard setup. Connect your panels, connect your loads, and the unit manages charging, switching, and engine top-ups automatically.",
  },
  {
    q: "Why do you recommend two units instead of one larger one?",
    a: "Three reasons. Redundancy: if one unit ever needs service, the other keeps your home powered — you're never fully down. Storage: two packs double your battery to ~3.08 kWh, so you ride longer on solar alone before the engine ever starts. Efficiency: two right-sized hybrid engines run in short, optimal bursts instead of one oversized generator idling to cover a load you don't actually have. You only burn fuel for the energy you genuinely need.",
  },
  {
    q: "Will it really keep my whole home running reliably?",
    a: "Yes — it's battery-first. Your home runs silently off the LFP battery the vast majority of the time, solar refills it through the day, and the engine only kicks in for short top-ups when state-of-charge drops or a large load hits, then shuts back off. The result is grid-like reliability without the grid, and without a generator running around the clock.",
  },
  {
    q: "What happens in winter?",
    a: "North Idaho winter solar production falls to roughly 35–45% of summer. That's expected and already built into the estimate — the hybrid engine simply does more of the work December through February. You won't be left without power; you'll just see somewhat higher fuel use during the darkest months.",
  },
  {
    q: "Is the estimate on this page a real quote?",
    a: "It's a solid planning estimate based on typical usage. Your real numbers depend on your exact appliances, daily habits, panel placement, shading, and local weather. When you're ready, our team will confirm the configuration and give you a firm quote — reach out any time.",
  },
];

export default function OffGridPage() {
  return (
    <>
      <Header />

      {/* HERO */}
      <section className="relative pt-[68px] overflow-hidden border-b" style={{ borderColor: "var(--line)" }}>
        <div className="absolute inset-0 grid-bg" />
        <div className="stars" />
        <div className="nebula" style={{ width: 720, height: 720, left: "-200px", top: "18%" }} />
        <div
          className="nebula"
          style={{ width: 480, height: 480, right: "-120px", top: "45%", opacity: 0.22 }}
        />

        <div className="relative max-w-[1440px] mx-auto px-8 pb-12">
          <div className="mt-12 flex items-center gap-3 mono text-[11px] tracking-[.18em] text-zinc-500 uppercase">
            <span className="pulse-dot" />
            <span>OFF-GRID PLANNING · INTERACTIVE SIZING</span>
          </div>

          <div className="mt-10 mono text-[12px] tracking-[.22em] text-[var(--hi)] uppercase">
            SOLAR · BATTERY · HYBRID TOP-UP
          </div>

          <h1
            className="display-x mt-6 leading-[.92] max-w-[1100px]"
            style={{ fontSize: "clamp(48px, 8vw, 116px)" }}
          >
            Size your
            <br />
            <span style={{ color: "var(--hi)" }} className="text-glow">
              off-grid system.
            </span>
          </h1>

          <p className="mt-10 max-w-[680px] text-[17px] leading-[1.65] text-zinc-400">
            Tell us about your home and we&apos;ll estimate your daily load, the
            solar array and number of SitePulse units you need, your annual fuel
            cost, and the total upfront price — updating live as you adjust.
            Defaults are tuned for North Idaho.
          </p>

          <div className="mt-10 flex flex-wrap items-center gap-4">
            <Link href="#tool" className="btn btn-cy">
              START SIZING <span>→</span>
            </Link>
            <Link href="/" className="btn btn-ghost">
              ← BACK TO SITEPULSE
            </Link>
          </div>
        </div>
      </section>

      {/* TOOL */}
      <section
        id="tool"
        className="relative py-32 border-b overflow-hidden"
        style={{ borderColor: "var(--line)" }}
      >
        <div className="absolute inset-0 grid-bg opacity-30" />
        <div className="relative max-w-[1440px] mx-auto px-8">
          <Eyebrow num="01" label="SYSTEM SIZING TOOL" />
          <h2
            className="display-x mt-6 leading-[.95] tracking-[-.045em]"
            style={{ fontSize: "clamp(40px, 6vw, 88px)" }}
          >
            Build your estimate.
          </h2>
          <p className="mt-8 max-w-[640px] text-[17px] leading-[1.65] text-zinc-400">
            Everything recalculates instantly. Search your city to localize
            solar production, then open Advanced settings to tune load, solar,
            fuel, and pricing assumptions to your exact situation.
          </p>

          <SizingTool />
        </div>
      </section>

      {/* HYBRID ADVANTAGE */}
      <section className="relative py-32 border-b" style={{ borderColor: "var(--line)" }}>
        <div className="max-w-[1440px] mx-auto px-8">
          <Eyebrow num="02" label="WHY THE HYBRID WINS" />
          <h2
            className="display-x mt-6 leading-[.95] tracking-[-.045em] max-w-[1100px]"
            style={{ fontSize: "clamp(40px, 6vw, 88px)" }}
          >
            Short, optimal bursts —
            <br />
            not a generator idling.
          </h2>

          <div
            className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-px"
            style={{ background: "var(--line-strong)" }}
          >
            {HYBRID_POINTS.map((p, i) => (
              <div key={p.title} className="bg-black p-10 lift">
                <div className="mono text-[11px] tracking-[.2em] text-[var(--hi)]">/0{i + 1}</div>
                <h3 className="display mt-10 text-[24px] tracking-[-.025em] leading-[1.15]">
                  {p.title}
                </h3>
                <p className="mt-4 text-[14px] leading-[1.6] text-zinc-400">{p.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="relative py-32 border-b" style={{ borderColor: "var(--line)" }}>
        <div
          className="nebula"
          style={{ width: 560, height: 560, left: "-160px", top: "30%", opacity: 0.2 }}
        />
        <div className="relative max-w-[1440px] mx-auto px-8">
          <Eyebrow num="03" label="QUESTIONS, ANSWERED" />
          <h2
            className="display-x mt-6 leading-[.95] tracking-[-.045em] max-w-[1100px]"
            style={{ fontSize: "clamp(40px, 6vw, 88px)" }}
          >
            New to off-grid?
            <br />
            Start here.
          </h2>
          <p className="mt-8 max-w-[700px] text-[17px] leading-[1.65] text-zinc-400">
            A whole-home off-grid system has always meant $30,000–$50,000+ of
            custom battery banks, inverters, a standalone generator, and an
            engineered install. SitePulse delivers the same reliability as a
            finished product — sized, ordered, and set down like Starlink or a
            Powerwall.
          </p>

          <div className="mt-16 max-w-[920px]">
            {FAQ_ITEMS.map((f, i) => (
              <details
                key={f.q}
                className="faq border-t py-7"
                style={{ borderColor: "var(--line)" }}
                open={i === 0}
              >
                <summary className="flex items-start justify-between gap-8">
                  <span className="faq-q display text-[20px] md:text-[24px] tracking-[-.02em] leading-[1.2]">
                    {f.q}
                  </span>
                  <span className="faq-sign mono text-[var(--hi)] text-[24px] leading-none flex-none mt-1">
                    +
                  </span>
                </summary>
                <p className="mt-5 max-w-[780px] text-[15px] leading-[1.7] text-zinc-400">
                  {f.a}
                </p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="relative py-32 border-b overflow-hidden" style={{ borderColor: "var(--line)" }}>
        <div className="absolute inset-0 grid-bg opacity-50" />
        <div className="stars opacity-40" />
        <div
          className="nebula"
          style={{ width: 800, height: 800, left: "50%", top: "50%", transform: "translate(-50%,-50%)", opacity: 0.3 }}
        />
        <div className="relative max-w-[1440px] mx-auto px-8 text-center">
          <div className="mono text-[12px] tracking-[.22em] uppercase text-[var(--hi)]">
            CUSTOM QUOTES · SHIPPING Q3
          </div>
          <h2
            className="display-x mt-8 leading-[.92] tracking-[-.05em]"
            style={{ fontSize: "clamp(44px, 8vw, 120px)" }}
          >
            Ready to go
            <br />
            off-grid?
          </h2>
          <div className="mt-14 flex flex-wrap justify-center items-center gap-4">
            <Link href="/contact" className="btn btn-cy">
              TALK TO OUR TEAM <span>→</span>
            </Link>
            <Link href="/#config" className="btn btn-ghost">
              RESERVE A SITEPULSE
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
