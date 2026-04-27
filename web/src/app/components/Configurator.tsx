"use client";

import { useState } from "react";
import {
  ADDONS,
  computeTotal,
  MOUNTS,
  TIERS,
  type Mount,
  type Tier,
} from "@/lib/build";
import { Eyebrow } from "./Eyebrow";

export function Configurator() {
  const [tier, setTier] = useState<Tier>("BASE");
  const [mount, setMount] = useState<Mount>("CART");
  const [selected, setSelected] = useState<Record<string, boolean>>({});
  const [reserving, setReserving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const toggle = (id: string) =>
    setSelected((prev) => ({ ...prev, [id]: !prev[id] }));

  const selectedAddonIds = ADDONS.filter((a) => selected[a.id]).map((a) => a.id);
  const total = computeTotal(tier, selectedAddonIds);

  const reserve = async () => {
    setError(null);
    setReserving(true);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tier, mount, addonIds: selectedAddonIds }),
      });
      const data: { url?: string; error?: string } = await res.json();
      if (!res.ok || !data.url) {
        throw new Error(data.error || `Reservation failed (${res.status})`);
      }
      window.location.href = data.url;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Reservation failed");
      setReserving(false);
    }
  };

  return (
    <section
      id="config"
      className="relative py-32 border-b overflow-hidden"
      style={{ borderColor: "var(--line)" }}
    >
      <div className="absolute inset-0 grid-bg opacity-50" />
      <div
        className="nebula"
        style={{
          width: 520,
          height: 520,
          right: "-150px",
          top: "10%",
          opacity: 0.25,
        }}
      />
      <div className="relative max-w-[1440px] mx-auto px-8">
        <Eyebrow num="07" label="BUILD & RESERVE" />
        <h2
          className="display-x mt-6 leading-[.95] tracking-[-.045em]"
          style={{ fontSize: "clamp(44px, 7vw, 96px)" }}
        >
          Configure yours.
        </h2>
        <p className="mt-8 max-w-[640px] text-[17px] leading-[1.65] text-zinc-400">
          Reserve with $100 today. Build slot locks in. Balance due before Q3
          ship date. Refundable until 30 days before fulfillment.
        </p>

        <div className="mt-20 grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* options */}
          <div className="lg:col-span-7 space-y-12">
            {/* tier */}
            <div>
              <div className="mono text-[11px] tracking-[.18em] uppercase text-zinc-500">
                01 — Pick a tier
              </div>
              <div className="mt-5 space-y-3">
                {(Object.entries(TIERS) as Array<[Tier, (typeof TIERS)[Tier]]>).map(
                  ([k, v]) => (
                    <button
                      key={k}
                      onClick={() => setTier(k)}
                      data-on={tier === k}
                      className="opt w-full text-left p-6 flex items-start justify-between"
                      aria-pressed={tier === k}
                    >
                      <div>
                        <div className="display text-[22px] tracking-[-.02em]">
                          {v.label}
                        </div>
                        <div className="mt-2 text-[14px] text-zinc-400">
                          {v.desc}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="display text-[22px] tracking-[-.02em]">
                          ${v.price.toLocaleString()}
                        </div>
                        <div className="mono text-[10px] tracking-[.18em] uppercase text-zinc-500 mt-1">
                          {tier === k ? "SELECTED" : "SELECT"}
                        </div>
                      </div>
                    </button>
                  ),
                )}
              </div>
            </div>

            {/* addons */}
            <div>
              <div className="mono text-[11px] tracking-[.18em] uppercase text-zinc-500">
                02 — Add modules
              </div>
              <div className="mt-5 space-y-3">
                {ADDONS.map((a) => {
                  const on = !!selected[a.id];
                  return (
                    <button
                      key={a.id}
                      onClick={() => toggle(a.id)}
                      data-on={on}
                      aria-pressed={on}
                      className="opt w-full text-left p-5 flex items-center justify-between gap-6"
                    >
                      <div className="flex items-center gap-5 min-w-0">
                        <div
                          className="w-6 h-6 border flex-none flex items-center justify-center"
                          style={{
                            borderColor: on
                              ? "var(--hi)"
                              : "rgba(255,255,255,.2)",
                            background: on ? "var(--hi)" : "transparent",
                          }}
                        >
                          {on && (
                            <span style={{ color: "#000", fontSize: 14 }}>
                              ✓
                            </span>
                          )}
                        </div>
                        <div className="min-w-0">
                          <div className="text-[16px] font-semibold">
                            {a.label}
                          </div>
                          <div className="mt-1 text-[13px] text-zinc-500">
                            {a.desc}
                          </div>
                        </div>
                      </div>
                      <div className="display text-[20px] tracking-[-.02em] flex-none">
                        +${a.price}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* mount */}
            <div>
              <div className="mono text-[11px] tracking-[.18em] uppercase text-zinc-500">
                03 — Mounting
              </div>
              <div className="mt-5 seg">
                {MOUNTS.map((o) => (
                  <button
                    key={o}
                    onClick={() => setMount(o)}
                    aria-pressed={mount === o}
                  >
                    {o}
                  </button>
                ))}
              </div>
              <div className="mt-3 mono text-[11px] tracking-[.16em] text-zinc-500 uppercase">
                Selected: <span className="text-zinc-300">{mount}</span> —
                included with build
              </div>
            </div>
          </div>

          {/* summary */}
          <div className="lg:col-span-5">
            <div
              className="border p-8 sticky top-[88px] bg-black/60 backdrop-blur"
              style={{ borderColor: "var(--line-strong)" }}
            >
              <div className="mono text-[11px] tracking-[.18em] uppercase text-zinc-500">
                YOUR BUILD
              </div>
              <h3 className="display mt-3 text-[26px] tracking-[-.025em]">
                {TIERS[tier].label}
              </h3>
              <ul className="mt-6 space-y-3 text-[14px] text-zinc-400 mono">
                <li
                  className="flex justify-between border-b pb-3"
                  style={{ borderColor: "var(--line)" }}
                >
                  <span>Base unit</span>
                  <span className="text-zinc-200">
                    ${TIERS[tier].price.toLocaleString()}
                  </span>
                </li>
                {ADDONS.filter((a) => selected[a.id]).map((a) => (
                  <li
                    key={a.id}
                    className="flex justify-between border-b pb-3"
                    style={{ borderColor: "var(--line)" }}
                  >
                    <span>{a.label}</span>
                    <span className="text-zinc-200">
                      ${a.price.toLocaleString()}
                    </span>
                  </li>
                ))}
                <li
                  className="flex justify-between border-b pb-3"
                  style={{ borderColor: "var(--line)" }}
                >
                  <span>Mount</span>
                  <span className="text-zinc-200">{mount}</span>
                </li>
                <li className="flex justify-between">
                  <span>Freight</span>
                  <span className="text-[var(--run)]">FREE</span>
                </li>
              </ul>
              <div
                className="mt-8 pt-6 border-t"
                style={{ borderColor: "var(--line-strong)" }}
              >
                <div className="flex items-end justify-between">
                  <div className="mono text-[11px] tracking-[.16em] uppercase text-zinc-500">
                    Total
                  </div>
                  <div className="display-x text-[44px] tracking-[-.04em] leading-none">
                    ${total.toLocaleString()}
                  </div>
                </div>
                <div className="mt-3 flex items-end justify-between">
                  <div className="mono text-[11px] tracking-[.16em] uppercase text-zinc-500">
                    Reserve today
                  </div>
                  <div className="display text-[22px] tracking-[-.02em] text-[var(--hi)]">
                    $100
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={reserve}
                disabled={reserving}
                className="btn btn-cy w-full justify-center mt-8 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {reserving ? "REDIRECTING…" : "RESERVE THIS BUILD"}{" "}
                {!reserving && <span>→</span>}
              </button>
              {error && (
                <div className="mt-4 mono text-[10px] tracking-[.12em] uppercase text-red-400 text-center">
                  {error}
                </div>
              )}
              <div className="mt-4 mono text-[10px] tracking-[.16em] text-zinc-500 uppercase text-center">
                Refundable · No build slot held without reservation
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
