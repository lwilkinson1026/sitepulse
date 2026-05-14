import { Eyebrow } from "./Eyebrow";

const ROWS: ReadonlyArray<readonly [string, string]> = [
  [
    "Battery",
    "30 Ah · 48 V LFP (1.54 kWh) · 22 lb · active BMS · cell-level protection",
  ],
  [
    "Inverter",
    "5,000 W continuous · 10,000 W surge · hybrid w/ generator input · 120 V pure sine · 60 Hz",
  ],
  [
    "Engine",
    "DLE 170cc twin-cylinder gas · 17.5 HP · 9.1 lb · vibration-isolated mounts",
  ],
  [
    "Starter generator",
    "High-output starter/alternator · up to 10–12 kW peak · VESC controller",
  ],
  [
    "Connectivity",
    "Starlink Mini integrated (3.5 lb kit) · cellular failover · OTA firmware",
  ],
  [
    "Fuel",
    "External quick-disconnect tank · gasoline w/ auto-stabilizer dosing on shutdown",
  ],
  [
    "Sensors",
    "Ultrasonic fuel level · SOC/V/I/temp · CO · enclosure temp · GPS",
  ],
  [
    "Chassis",
    "SendcutSend sheet metal enclosure · IP65 · 8 lb · integrated carry handles",
  ],
  [
    "Environment",
    "−20 °C to +50 °C (heaters optional) · <60 dB(A) enclosed · vibration-isolated",
  ],
  [
    "Safety",
    "CO shutdown · fuel cutoff · BMS protect · GFCI · surge · local + remote E-stop",
  ],
  ["Total weight", "~90 lb dry (no fuel) · realistic 85–92 lb range"],
];

const SCALE_STATS: ReadonlyArray<readonly [string, string]> = [
  ["~90 lb", "Dry weight"],
  ["IP65", "Sealed"],
  ["−20→50°C", "Operating"],
];

export function Specs() {
  return (
    <section
      id="specs"
      className="py-32 border-b"
      style={{ borderColor: "var(--line)" }}
    >
      <div className="max-w-[1440px] mx-auto px-8">
        <Eyebrow num="04" label="INSIDE THE UNIT" />
        <h2
          className="display-x mt-6 leading-[.95] tracking-[-.045em]"
          style={{ fontSize: "clamp(44px, 7vw, 96px)" }}
        >
          Engineered for
          <br />
          unattended duty.
        </h2>

        <div className="mt-20 grid grid-cols-1 lg:grid-cols-12 gap-12">
          <div className="lg:col-span-5">
            <div
              className="aspect-[5/4] relative overflow-hidden border"
              style={{ borderColor: "var(--line-strong)", background: "#000" }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/assets/product-angle-v2.jpg"
                alt="Sitepulse 5000W Hybrid Inverter, 3/4 view"
                className="absolute inset-0 w-full h-full object-contain"
              />
              <div className="absolute bottom-3 right-3 mono text-[10px] tracking-[.18em] uppercase text-zinc-500">
                SCALE 1:6
              </div>
            </div>
            <div
              className="mt-px grid grid-cols-3 gap-px"
              style={{ background: "var(--line-strong)" }}
            >
              {SCALE_STATS.map(([n, l]) => (
                <div key={l} className="bg-black px-5 py-5 text-center">
                  <div className="display text-[26px] tracking-[-.03em]">{n}</div>
                  <div className="mt-1 mono text-[10px] tracking-[.16em] text-zinc-500 uppercase">
                    {l}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-7">
            <table className="w-full">
              <tbody>
                {ROWS.map(([k, v]) => (
                  <tr
                    key={k}
                    className="spec-row border-b"
                    style={{ borderColor: "var(--line)" }}
                  >
                    <th className="text-left align-top py-5 pr-6 mono text-[11px] uppercase tracking-[.16em] text-zinc-500 w-[160px] font-medium">
                      {k}
                    </th>
                    <td className="py-5 text-[15px] leading-[1.55] text-zinc-200">
                      {v}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="mt-10 flex flex-wrap gap-3">
              <a href="#config" className="btn btn-cy">
                CONFIGURE YOUR UNIT <span>→</span>
              </a>
              <a href="#" className="btn btn-ghost">
                DOWNLOAD SPEC PDF
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
