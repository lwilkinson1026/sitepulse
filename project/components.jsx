// components.jsx — Sitepulse landing page components
const { useState, useEffect, useRef, useMemo } = React;

// ─── Atoms ────────────────────────────────────────────────────────────
const Tag = ({ children, accent }) => (
  <span className="mono uppercase tracking-[.18em] text-[10.5px]" style={{ color: accent ? 'var(--hi)' : 'var(--mute)' }}>{children}</span>
);

const TickCorner = ({ children, className = '' }) => (
  <div className={`relative corner-tl corner-tr corner-bl corner-br ${className}`}>{children}</div>
);

const PulseDot = ({ label = 'LIVE' }) => (
  <span className="inline-flex items-center gap-2 mono uppercase text-[10.5px] tracking-[.18em]">
    <span className="pulse-dot" /> {label}
  </span>
);

const ChevronStrip = ({ height = 8 }) => (
  <div className="chevron w-full" style={{ height }} aria-hidden />
);

const Btn = ({ children, variant = 'amber', as = 'a', href = '#', ...rest }) => {
  const Cmp = as;
  const cls = variant === 'amber' ? 'btn-amber' : 'btn-ghost text-white';
  return (
    <Cmp href={href} {...rest} className={`inline-flex items-center gap-2 px-5 h-11 narrow font-semibold uppercase tracking-[.08em] text-[12.5px] ${cls}`}>
      {children}
    </Cmp>
  );
};

const Arrow = ({ size = 14 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden>
    <path d="M5 12h14M13 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="square" />
  </svg>
);

// ─── Top Nav ──────────────────────────────────────────────────────────
const Nav = () => (
  <header className="sticky top-0 z-40 border-b hr backdrop-blur-md" style={{ background: 'rgba(14,15,17,.78)' }}>
    <div className="max-w-[1440px] mx-auto px-6 lg:px-10 h-14 flex items-center justify-between">
      <a href="#" className="flex items-center gap-3">
        <Logo />
      </a>
      <nav className="hidden md:flex items-center gap-8 narrow text-[13px] uppercase tracking-[.06em] text-white/85">
        <a href="#unit" className="ulink">The Unit</a>
        <a href="#how" className="ulink">How It Runs</a>
        <a href="#built" className="ulink">Built For</a>
        <a href="#specs" className="ulink">Specs</a>
        <a href="#configure" className="ulink">Configure</a>
        <a href="#support" className="ulink">Support</a>
      </nav>
      <div className="flex items-center gap-3">
        <a href="#" className="hidden sm:inline mono text-[11px] uppercase tracking-[.18em] text-white/70 hover:text-white">Dealers</a>
        <Btn variant="amber" href="#configure">Reserve <Arrow /></Btn>
      </div>
    </div>
  </header>
);

const Logo = () => (
  <div className="flex items-center gap-2">
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <rect x="2.5" y="2.5" width="19" height="19" stroke="currentColor" strokeWidth="1.5" />
      <path d="M3 12h4l2-5 3 10 2-7 2 4h5" stroke="var(--hi)" strokeWidth="1.6" strokeLinecap="square" strokeLinejoin="miter" fill="none" />
    </svg>
    <span className="display font-black tracking-[-.01em] text-[18px]">SITEPULSE</span>
  </div>
);

// ─── Hero ─────────────────────────────────────────────────────────────
const Hero = ({ heroVariant }) => {
  const headlines = {
    quiet:   ['Quiet power.', 'On demand.'],
    five:    ['One tank of gas.', 'A month of uptime.'],
    orbit:   ['Power and a signal,', 'wherever you set down.'],
  };
  const [a, b] = headlines[heroVariant] || headlines.quiet;
  return (
    <section className="relative overflow-hidden border-b hr">
      <div className="absolute inset-0 grid-bg opacity-60 pointer-events-none" />
      <div className="absolute inset-x-0 top-0 h-px bg-white/10" />
      {/* spec dock — top corner */}
      <div className="hidden lg:flex absolute top-6 right-10 items-center gap-6 mono text-[10.5px] uppercase tracking-[.18em] text-white/55 z-10">
        <span>MDL · SP-2400H</span>
        <span>BUILD 04/26</span>
        <PulseDot label="UNITS SHIPPING" />
      </div>

      <div className="max-w-[1440px] mx-auto px-6 lg:px-10 pt-16 lg:pt-24 pb-10 lg:pb-16 grid lg:grid-cols-12 gap-10 items-end relative">
        {/* Left: copy */}
        <div className="lg:col-span-6 z-10">
          <div className="flex items-center gap-3 mb-6">
            <Tag accent>SP·2400H · HYBRID INVERTER</Tag>
            <span className="hr border-t flex-1 max-w-[120px]" />
            <Tag>EST. 2024 · MADE IN OH</Tag>
          </div>
          <h1 className="display font-black text-[14vw] lg:text-[7.6rem] leading-[.86] tracking-[-.035em] text-white">
            {a}<br/><span className="text-white/55">{b}</span>
          </h1>
          <p className="mt-7 max-w-[44ch] text-[16.5px] text-white/70 leading-[1.55]">
            Sitepulse is a single, ruggedized cube that fuses a 2,400 Wh battery, a 2.4 kW inverter, a Starlink terminal, and a propane‑or‑gas top‑up generator. Set it down. Walk away. Your crew has wifi and 110V outlets for the next 30 days.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Btn href="#configure">Configure your unit <Arrow /></Btn>
            <Btn variant="ghost" href="#how">Watch the 90‑sec field test</Btn>
          </div>
          {/* mini metric strip */}
          <div className="mt-10 grid grid-cols-3 max-w-[520px] divide-x" style={{ borderColor: 'rgba(255,255,255,.08)' }}>
            {[
              ['2,400', 'W INVERTER'],
              ['5 GAL', 'GAS / MONTH'],
              ['44 dB', 'AT 10 FT'],
            ].map(([k, v]) => (
              <div key={k} className="px-4 first:pl-0">
                <div className="display font-bold text-[28px] leading-none tracking-tight">{k}</div>
                <div className="mono text-[10px] uppercase tracking-[.18em] text-white/50 mt-1.5">{v}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: product hero with overlay HUD */}
        <div className="lg:col-span-6 relative z-0">
          <div className="relative">
            <img src="assets/unit-front.png" alt="Sitepulse SP-2400H Hybrid Inverter" className="w-full select-none pointer-events-none" />
            {/* HUD callouts */}
            <Callout x="6%"  y="34%" align="left"  label="2.4 kW PURE‑SINE" sub="6× 20A · 1× 30A" />
            <Callout x="62%" y="22%" align="right" label="STARLINK GEN 3"  sub="DISH + ROUTER · INTERNAL" />
            <Callout x="70%" y="68%" align="right" label="PROPANE TOP‑UP"  sub="0.4 GAL/HR @ 50% LOAD" />
          </div>
        </div>
      </div>

      {/* live status bar bottom */}
      <div className="border-t hr">
        <div className="max-w-[1440px] mx-auto px-6 lg:px-10 h-12 flex items-center justify-between mono text-[11px] uppercase tracking-[.18em] text-white/55">
          <span className="flex items-center gap-3"><PulseDot label="FLEET TELEMETRY" /> 1,284 UNITS ONLINE WORLDWIDE</span>
          <div className="hidden md:flex items-center gap-6">
            <span>AVG. LOAD <span className="text-white/85 ml-1">42%</span></span>
            <span>UPTIME 99.97%</span>
            <span>HQ 41.4°N · 81.7°W</span>
          </div>
        </div>
      </div>
    </section>
  );
};

const Callout = ({ x, y, align, label, sub }) => (
  <div className="absolute hidden md:block" style={{ left: align === 'left' ? x : 'auto', right: align === 'right' ? `calc(100% - ${x} - 240px)` : 'auto', top: y, width: 240 }}>
    <div className="flex items-start gap-2">
      <div className={`flex-1 ${align === 'right' ? 'text-right' : ''}`}>
        <div className="mono text-[10.5px] uppercase tracking-[.18em]" style={{ color: 'var(--hi)' }}>{label}</div>
        <div className="mono text-[10.5px] uppercase tracking-[.14em] text-white/55 mt-1">{sub}</div>
      </div>
    </div>
    <div className={`mt-1 h-px w-full bg-white/30 ${align === 'right' ? 'ml-auto' : ''}`} />
  </div>
);

// ─── Trusted by / spec strip ─────────────────────────────────────────
const SpecStrip = () => {
  const items = [
    'BATTERY · 2,400 Wh LFP',
    'INVERTER · 2.4 kW PURE‑SINE',
    'GENERATOR · 1.8 kW PROPANE/GAS',
    'STARLINK · GEN 3 INTEGRATED',
    'OUTLETS · 6× 120V · 1× L5‑30',
    'COOLING · DUCTED · 44 dB',
    'CHASSIS · 16ga POWDER STEEL',
    'IP RATING · IP54 · −20°C → 50°C',
    'CONNECTIVITY · LTE BACKUP',
    'WEIGHT · 78 LB · CARRY HANDLES',
  ];
  return (
    <section className="border-b hr overflow-hidden">
      <div className="flex marquee-track py-4">
        {[...items, ...items].map((t, i) => (
          <span key={i} className="mono text-[11.5px] uppercase tracking-[.22em] text-white/70 px-8 nowrap">
            <span style={{ color: 'var(--hi)' }}>▍</span> {t}
          </span>
        ))}
      </div>
    </section>
  );
};

// ─── Three pillars ────────────────────────────────────────────────────
const Pillars = () => {
  const cards = [
    {
      n: '01', tag: 'BATTERY', title: 'Lithium iron phosphate, built to abuse.',
      body: '2,400 Wh of LFP cells with a 6,000‑cycle floor. Cold‑weather heaters down to −20°C, active balancing, ground‑fault aware.',
      stats: [['2,400', 'WATT‑HOURS'], ['6,000', 'CYCLES'], ['−20°C', 'COLD START']],
    },
    {
      n: '02', tag: 'STARLINK', title: 'A dish, hidden under the lid.',
      body: 'Gen‑3 phased array integrated into the top deck. Auto‑aim on power‑up, mesh wifi for crews of 12, LTE failover when trees win.',
      stats: [['220 Mbps', 'DOWN MEDIAN'], ['12', 'DEVICES MESH'], ['LTE', 'FAILOVER']],
    },
    {
      n: '03', tag: 'GENERATOR', title: 'Top‑up only. Quiet by design.',
      body: 'A 1.8 kW propane‑or‑gas generator wakes only when the battery dips below 30%. Most months it runs about an hour a day. Five gallons covers it.',
      stats: [['44 dB', 'AT 10 FT'], ['0.4 gal', 'PER HOUR'], ['LP / 87', 'FUEL']],
    },
  ];
  return (
    <section id="unit" className="border-b hr">
      <div className="max-w-[1440px] mx-auto px-6 lg:px-10 py-20">
        <div className="flex items-end justify-between mb-12">
          <div>
            <Tag accent>THE UNIT · 03 SYSTEMS · 01 BOX</Tag>
            <h2 className="display mt-3 text-[clamp(2.2rem,5vw,4.4rem)] font-black leading-[.92] tracking-[-.025em] max-w-[18ch]">
              Three machines, welded into one chassis.
            </h2>
          </div>
          <p className="hidden md:block max-w-[36ch] text-white/65 text-[15px] leading-[1.5]">
            Most jobsite power kits force you to choose between runtime, signal, and silence. Sitepulse stops asking.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-px hr border-t border-l">
          {cards.map((c) => (
            <article key={c.n} className="p-7 lg:p-9 border-r border-b hr lift" style={{ background: 'rgba(255,255,255,.01)' }}>
              <div className="flex items-center justify-between mb-6">
                <span className="display font-black text-[44px] leading-none text-white/15">{c.n}</span>
                <Tag accent>{c.tag}</Tag>
              </div>
              <h3 className="display font-bold text-[26px] leading-[1.05] tracking-tight max-w-[14ch]">{c.title}</h3>
              <p className="mt-4 text-white/65 text-[14.5px] leading-[1.55]">{c.body}</p>
              <dl className="mt-7 grid grid-cols-3 gap-4 pt-5 border-t hr">
                {c.stats.map(([k, v]) => (
                  <div key={k}>
                    <dt className="display font-bold text-[18px] leading-none">{k}</dt>
                    <dd className="mono text-[9.5px] uppercase tracking-[.18em] text-white/45 mt-1.5">{v}</dd>
                  </div>
                ))}
              </dl>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

// ─── How it runs (loop diagram) ──────────────────────────────────────
const HowItRuns = () => {
  return (
    <section id="how" className="border-b hr relative" style={{ background: '#0B0C0E' }}>
      <ChevronStrip height={6} />
      <div className="max-w-[1440px] mx-auto px-6 lg:px-10 py-20">
        <div className="grid lg:grid-cols-12 gap-10">
          <div className="lg:col-span-4">
            <Tag accent>OPERATION · CYCLE</Tag>
            <h2 className="display mt-3 text-[clamp(2rem,4.4vw,3.6rem)] font-black leading-[.95] tracking-[-.025em]">
              How a single tank<br/>lasts a month.
            </h2>
            <p className="mt-5 text-white/65 text-[15px] leading-[1.55] max-w-[40ch]">
              Sitepulse runs on battery the vast majority of the day. The generator only blips on to top up — like a furnace, not a roar. Solar input is optional but recommended.
            </p>
            <div className="mt-6 flex items-center gap-3 text-white/70 text-[12px] mono uppercase tracking-[.18em]">
              <span className="pulse-dot" /> CURRENTLY DRAWING 312W · 14% LOAD
            </div>
          </div>

          <div className="lg:col-span-8">
            <DayMeter />
            <div className="grid grid-cols-3 mt-8 gap-px border hr">
              {[
                ['BATTERY', 'PRIMARY · 22h/DAY', 'var(--run)'],
                ['GENERATOR', 'TOP‑UP · ~1h/DAY', 'var(--hi)'],
                ['SOLAR / SHORE', 'OPTIONAL · 0–6h', '#7A8290'],
              ].map(([k, v, c], i) => (
                <div key={k} className="p-5 border hr" style={{ background: 'rgba(255,255,255,.015)' }}>
                  <div className="flex items-center gap-2 mb-2"><span className="w-2 h-2 inline-block" style={{ background: c }} /><span className="mono text-[10.5px] uppercase tracking-[.18em] text-white/85">{k}</span></div>
                  <div className="mono text-[10.5px] uppercase tracking-[.14em] text-white/45">{v}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const DayMeter = () => {
  // 24h timeline: gray = idle, green = battery, amber = generator, blue = solar
  const segments = useMemo(() => {
    const arr = Array(24).fill('battery');
    [3, 11, 17].forEach(h => arr[h] = 'generator');
    [8, 9, 10, 13, 14, 15].forEach(h => arr[h] = 'solar');
    return arr;
  }, []);
  const COLOR = { battery: 'var(--run)', generator: 'var(--hi)', solar: '#7A8290', idle: '#1F2125' };
  return (
    <div>
      <div className="flex items-center justify-between mono text-[10.5px] uppercase tracking-[.18em] text-white/55 mb-3">
        <span>24‑HOUR TIMELINE · TYPICAL JOBSITE</span>
        <span>5 GAL / 30 DAYS</span>
      </div>
      <div className="grid grid-cols-24 gap-[2px] h-14" style={{ gridTemplateColumns: 'repeat(24, 1fr)' }}>
        {segments.map((s, i) => (
          <div key={i} className="relative" style={{ background: COLOR[s] }}>
            {(i === 0 || i === 6 || i === 12 || i === 18) && (
              <span className="absolute -bottom-5 left-0 mono text-[9.5px] tracking-[.16em] text-white/45">{String(i).padStart(2, '0')}:00</span>
            )}
          </div>
        ))}
      </div>
      <div className="mt-8 h-px bg-white/10" />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-3 mt-5">
        {[
          ['00:00–06:00', 'Crew off site. Battery holds idle draw (router, cameras).'],
          ['06:00–12:00', 'Tools spin up. Solar offsets ~30%. Battery carries the rest.'],
          ['12:00–18:00', 'Peak load. Two short generator pulses if needed.'],
          ['18:00–24:00', 'Wind‑down. Battery rebalances. Generator silent.'],
        ].map(([t, d]) => (
          <div key={t} className="text-[13px]">
            <div className="mono text-[10.5px] tracking-[.16em] text-white/55 uppercase">{t}</div>
            <div className="text-white/80 mt-1 leading-snug">{d}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

// ─── Built for ─────────────────────────────────────────────────────────
const BuiltFor = () => {
  const cases = [
    { t: 'Construction sites', d: 'Tools, trailers, security cameras, crew wifi — without trenching for shore power.', m: '78 lb · 2 person carry' },
    { t: 'Film & broadcast',   d: 'Silent enough for an interview mic at 10 ft. Pure sine for cameras and monitors.', m: '44 dB · pure sine' },
    { t: 'Disaster response',  d: 'Drop it, plug in twelve devices, get a signal. Designed with FEMA‑grade ruggedness.', m: 'IP54 · −20°C' },
    { t: 'Remote research',    d: 'Months unattended on a propane drum. Telemetry over Starlink for fuel & state of charge.', m: 'LP · 30+ days' },
    { t: 'Overlanding / RV',   d: 'Quiet camp power and real internet. Mesh covers the whole site.', m: 'Mesh · 12 devices' },
    { t: 'Events & pop‑ups',   d: 'POS, lighting, printers, livestream — all from one cube. No fuel runs mid‑show.', m: 'Plug‑and‑run' },
  ];
  return (
    <section id="built" className="border-b hr">
      <div className="max-w-[1440px] mx-auto px-6 lg:px-10 py-20">
        <div className="flex items-end justify-between mb-12">
          <div>
            <Tag accent>BUILT FOR · ANYWHERE THE GRID ISN'T</Tag>
            <h2 className="display mt-3 text-[clamp(2.2rem,5vw,4.4rem)] font-black leading-[.92] tracking-[-.025em] max-w-[20ch]">
              If you can drive to it,<br/>you can power it.
            </h2>
          </div>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-px border-t border-l hr">
          {cases.map((c, i) => (
            <article key={c.t} className="p-7 border-r border-b hr lift">
              <div className="flex items-center justify-between mb-8">
                <span className="mono text-[10.5px] tracking-[.18em] uppercase text-white/45">USE · {String(i + 1).padStart(2, '0')}</span>
                <span className="mono text-[10.5px] tracking-[.18em] uppercase" style={{ color: 'var(--hi)' }}>{c.m}</span>
              </div>
              <h3 className="display font-bold text-[22px] leading-tight">{c.t}</h3>
              <p className="mt-3 text-white/65 text-[14px] leading-[1.55] max-w-[36ch]">{c.d}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

// ─── Inside the unit (cutaway-ish spec table) ─────────────────────────
const Inside = () => {
  const rows = [
    ['BATTERY', '2,400 Wh · 51.2V LFP · 6,000 cycles · −20°C heaters'],
    ['INVERTER', '2,400W continuous · 4,800W surge · pure sine · <3% THD'],
    ['GENERATOR', '1,800W EFI · LP/87 octane · 0.4 gal/hr @ 50% load · 44 dB @ 10ft'],
    ['STARLINK', 'Gen 3 phased array, internal · auto‑stow lid · LTE failover · mesh wifi'],
    ['OUTLETS', '6× 20A 120V GFCI · 1× L5‑30 · 4× USB‑C 100W PD · 2× USB‑A · 2× 12V'],
    ['CHARGE INPUTS', '600W solar MPPT · L5‑30 shore · DC vehicle pass‑through · LP regulator'],
    ['CONTROL', '5" sunlight LCD · physical Versa‑Switch · Sitepulse iOS/Android · webhooks'],
    ['CHASSIS', '16ga powder‑coat steel · cast aluminum corners · IP54 · 78 lb · 22×16×14"'],
    ['SAFETY', 'UL 9540 · CSA · FCC pt 15 · CO sensor · ground fault · auto shutoff'],
  ];
  return (
    <section id="specs" className="border-b hr" style={{ background: '#0B0C0E' }}>
      <div className="max-w-[1440px] mx-auto px-6 lg:px-10 py-20 grid lg:grid-cols-12 gap-12">
        {/* photo */}
        <div className="lg:col-span-5">
          <div className="relative border hr">
            <img src="assets/unit-angle.png" alt="Sitepulse, three‑quarter view" className="w-full" style={{ background: '#fff' }} />
            <div className="absolute top-3 left-3 mono text-[10.5px] uppercase tracking-[.2em] text-black/70 bg-white/85 px-2 py-1">REF · 3/4 ANGLE · LID OPEN</div>
            <div className="absolute bottom-3 right-3 mono text-[10.5px] uppercase tracking-[.2em] text-black/70 bg-white/85 px-2 py-1">SCALE 1:6</div>
          </div>
          <div className="mt-4 grid grid-cols-3 gap-px border-t border-l hr">
            {[
              ['22"', 'WIDE'],
              ['16"', 'DEEP'],
              ['14"', 'TALL'],
            ].map(([k, v]) => (
              <div key={k} className="p-4 border-r border-b hr">
                <div className="display font-bold text-[20px]">{k}</div>
                <div className="mono text-[10px] uppercase tracking-[.18em] text-white/45 mt-1">{v}</div>
              </div>
            ))}
          </div>
        </div>

        {/* spec table */}
        <div className="lg:col-span-7">
          <Tag accent>INSIDE · SP‑2400H</Tag>
          <h2 className="display mt-3 text-[clamp(1.9rem,4vw,3.2rem)] font-black leading-[.95] tracking-[-.025em] max-w-[18ch]">
            Engineered like a piece of jobsite hardware,<br/>not a gadget.
          </h2>
          <table className="mt-9 w-full text-left">
            <tbody>
              {rows.map(([k, v]) => (
                <tr key={k} className="border-t hr">
                  <th className="py-3.5 pr-4 align-top w-[34%] mono text-[11px] uppercase tracking-[.18em] text-white/50 font-medium">{k}</th>
                  <td className="py-3.5 text-white/85 text-[14.5px]">{v}</td>
                </tr>
              ))}
              <tr className="border-t border-b hr">
                <th className="py-3.5 pr-4 align-top mono text-[11px] uppercase tracking-[.18em] text-white/50 font-medium">WARRANTY</th>
                <td className="py-3.5 text-white/85 text-[14.5px]">5 years on the unit · 10 years on the LFP pack · field‑replaceable modules</td>
              </tr>
            </tbody>
          </table>
          <div className="mt-7 flex flex-wrap items-center gap-3">
            <Btn href="#configure">Configure your unit <Arrow /></Btn>
            <Btn variant="ghost" href="#">Download spec PDF</Btn>
          </div>
        </div>
      </div>
    </section>
  );
};

// ─── Field reports (testimonials) ──────────────────────────────────────
const FieldReports = () => {
  const reports = [
    {
      q: 'We trenched 800 feet of conduit on our last build just to get tower power. With Sitepulse, we’d skip that and go straight to framing.',
      who: 'Marisol R.', role: 'Site superintendent · Bayfield Builders', tag: 'CONSTRUCTION · 14 MONTHS',
    },
    {
      q: 'Forty‑four decibels is real. Our boom op didn’t flag it on a quiet dialogue scene. That alone paid for the unit.',
      who: 'Dev P.', role: 'Production sound mixer · IATSE 695', tag: 'FILM · 9 MONTHS',
    },
    {
      q: 'We shipped twelve to a hurricane response in October. Every one came back working. None had been refueled more than twice.',
      who: 'Cole H.', role: 'Logistics lead · Field Ready Coalition', tag: 'DISASTER · 6 MONTHS',
    },
    {
      q: 'I run a remote weather station on the Gunnison. Sitepulse replaced two generators, three batteries, and a cellular booster.',
      who: 'Anya T.', role: 'Field hydrologist · independent', tag: 'RESEARCH · 11 MONTHS',
    },
  ];
  return (
    <section className="border-b hr">
      <div className="max-w-[1440px] mx-auto px-6 lg:px-10 py-20">
        <div className="flex items-end justify-between mb-12">
          <div>
            <Tag accent>FIELD REPORTS</Tag>
            <h2 className="display mt-3 text-[clamp(2rem,4.4vw,3.6rem)] font-black leading-[.92] tracking-[-.025em] max-w-[22ch]">
              From people who carry one in the back of a truck.
            </h2>
          </div>
        </div>
        <div className="grid md:grid-cols-2 gap-px border-t border-l hr">
          {reports.map((r) => (
            <figure key={r.who} className="p-8 lg:p-10 border-r border-b hr">
              <div className="mono text-[10.5px] uppercase tracking-[.18em] text-white/45 mb-5">{r.tag}</div>
              <blockquote className="display font-medium text-[clamp(1.25rem,1.8vw,1.55rem)] leading-[1.25] tracking-[-.005em] text-white/95">
                “{r.q}”
              </blockquote>
              <figcaption className="mt-7 flex items-center gap-3">
                <div className="w-9 h-9 placeholder-img" />
                <div>
                  <div className="text-[14px] text-white">{r.who}</div>
                  <div className="mono text-[10.5px] uppercase tracking-[.16em] text-white/50 mt-0.5">{r.role}</div>
                </div>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
};

// ─── Configurator (interactive) ────────────────────────────────────────
const Configurator = () => {
  const [tier, setTier] = useState('pro');         // base | pro | fleet
  const [solar, setSolar] = useState(true);
  const [lp, setLp] = useState(true);
  const [extra, setExtra] = useState(false);
  const [mount, setMount] = useState('rolling');   // rolling | rack | static

  const TIERS = {
    base:  { name: 'Sitepulse SP‑2400H', sub: 'Single unit. Crew of 4–6.',  price: 4990 },
    pro:   { name: 'Sitepulse SP‑2400H Pro', sub: 'With telemetry & extended warranty.', price: 5790, badge: 'MOST CONFIGURED' },
    fleet: { name: 'Sitepulse Fleet (×4)', sub: 'Four linked units. Per‑unit pricing.', price: 5290 },
  };
  const t = TIERS[tier];

  const total = useMemo(() => {
    let p = t.price;
    if (solar) p += 480;
    if (lp)    p += 240;
    if (extra) p += 690;
    if (mount === 'rolling') p += 180;
    if (mount === 'rack')    p += 320;
    return p;
  }, [t.price, solar, lp, extra, mount]);

  return (
    <section id="configure" className="border-b hr">
      <div className="max-w-[1440px] mx-auto px-6 lg:px-10 py-20 grid lg:grid-cols-12 gap-10">
        <div className="lg:col-span-5">
          <Tag accent>CONFIGURE · BUILD &amp; RESERVE</Tag>
          <h2 className="display mt-3 text-[clamp(2rem,4.4vw,3.6rem)] font-black leading-[.92] tracking-[-.025em] max-w-[16ch]">
            Pick a unit.<br/>Pick its job.
          </h2>
          <p className="mt-5 text-white/65 text-[15px] leading-[1.55] max-w-[40ch]">
            Reserve with $200. Ships in 6–8 weeks from Cleveland, OH. Pricing in USD; freight quoted at checkout.
          </p>

          <div className="mt-8 space-y-3">
            {Object.entries(TIERS).map(([k, v]) => (
              <button key={k} onClick={() => setTier(k)} data-on={tier === k} className="opt w-full text-left p-5 flex items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-3">
                    <div className="display font-bold text-[18px]">{v.name}</div>
                    {v.badge && <span className="mono text-[9.5px] uppercase tracking-[.18em] px-1.5 py-0.5" style={{ color: 'var(--hi)', border: '1px solid rgba(255,176,0,.4)' }}>{v.badge}</span>}
                  </div>
                  <div className="text-white/55 text-[13px] mt-1">{v.sub}</div>
                </div>
                <div className="text-right">
                  <div className="display font-bold text-[20px] tracking-tight">${v.price.toLocaleString()}</div>
                  <div className="mono text-[10px] uppercase tracking-[.18em] text-white/40 mt-1">FROM</div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Right column: options + total */}
        <div className="lg:col-span-7">
          <div className="border hr p-6 lg:p-8" style={{ background: 'rgba(255,255,255,.015)' }}>
            <div className="flex items-center justify-between mb-5">
              <Tag>STEP 02 · ADD‑ONS</Tag>
              <PulseDot label="LIVE INVENTORY" />
            </div>
            <div className="grid md:grid-cols-2 gap-3">
              <Option title="Foldable 400W solar panel" sub="Pairs to MPPT. 21 lb folded." price={480} on={solar} onClick={() => setSolar(!solar)} />
              <Option title="LP regulator + 20 lb tank kit" sub="Quick‑connect hose. Tank refillable anywhere." price={240} on={lp} onClick={() => setLp(!lp)} />
              <Option title="Spare LFP pack (+2,400 Wh)" sub="Hot‑swappable. Doubles runtime." price={690} on={extra} onClick={() => setExtra(!extra)} />
              <div className="border hr p-5">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <div className="display font-bold text-[15px]">Mount &amp; carry</div>
                    <div className="text-white/55 text-[12.5px] mt-0.5">How it moves on site.</div>
                  </div>
                </div>
                <div className="seg">
                  {['rolling', 'rack', 'static'].map((m) => (
                    <button key={m} aria-pressed={mount === m} onClick={() => setMount(m)}>{m.toUpperCase()}</button>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-7 pt-5 border-t hr grid md:grid-cols-2 gap-6 items-end">
              <div>
                <div className="mono text-[10.5px] uppercase tracking-[.18em] text-white/50">YOUR BUILD</div>
                <div className="display font-bold text-[22px] mt-1.5">{t.name}</div>
                <ul className="mt-3 mono text-[11.5px] uppercase tracking-[.14em] text-white/55 space-y-1">
                  {solar && <li>+ 400W SOLAR PANEL</li>}
                  {lp && <li>+ LP REGULATOR + TANK</li>}
                  {extra && <li>+ SPARE 2,400 Wh PACK</li>}
                  <li>+ {mount.toUpperCase()} MOUNT</li>
                </ul>
              </div>
              <div className="md:text-right">
                <div className="mono text-[10.5px] uppercase tracking-[.18em] text-white/50">TOTAL</div>
                <div className="display font-black text-[44px] tracking-[-.02em] leading-none mt-1.5">${total.toLocaleString()}</div>
                <div className="mono text-[10.5px] uppercase tracking-[.16em] text-white/45 mt-1">OR $200 TO RESERVE</div>
                <div className="mt-4 flex md:justify-end gap-3">
                  <Btn href="#">Reserve for $200 <Arrow /></Btn>
                  <Btn variant="ghost" href="#">Talk to sales</Btn>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const Option = ({ title, sub, price, on, onClick }) => (
  <button onClick={onClick} data-on={on} className="opt p-5 text-left">
    <div className="flex items-start justify-between gap-4">
      <div>
        <div className="display font-bold text-[15px]">{title}</div>
        <div className="text-white/55 text-[12.5px] mt-0.5">{sub}</div>
      </div>
      <div className="text-right">
        <div className="mono text-[12.5px]" style={{ color: on ? 'var(--hi)' : 'rgba(255,255,255,.7)' }}>+ ${price}</div>
        <div className="mono text-[9.5px] uppercase tracking-[.18em] text-white/45 mt-1">{on ? 'ADDED' : 'ADD'}</div>
      </div>
    </div>
  </button>
);

// ─── Final CTA ─────────────────────────────────────────────────────────
const FinalCta = () => (
  <section className="relative overflow-hidden border-b hr" style={{ background: '#0B0C0E' }}>
    <ChevronStrip height={6} />
    <div className="max-w-[1440px] mx-auto px-6 lg:px-10 py-24 lg:py-32 text-center">
      <Tag accent>SHIPPING NOW · 6–8 WEEK LEAD</Tag>
      <h2 className="display mt-4 font-black tracking-[-.035em] leading-[.86] text-[clamp(2.5rem,8vw,7.5rem)]">
        Quiet power.<br/><span className="text-white/55">On demand.</span>
      </h2>
      <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
        <Btn href="#configure">Reserve a unit for $200 <Arrow /></Btn>
        <Btn variant="ghost" href="#">Find a dealer</Btn>
      </div>
      <div className="mt-10 mx-auto max-w-[680px] grid grid-cols-3 mono text-[10.5px] uppercase tracking-[.18em] text-white/45 divide-x" style={{ borderColor: 'rgba(255,255,255,.08)' }}>
        <span className="px-3">5 YEAR WARRANTY</span>
        <span className="px-3">SHIPS FROM CLEVELAND, OH</span>
        <span className="px-3">CARBON‑NEUTRAL FREIGHT</span>
      </div>
    </div>
    <ChevronStrip height={6} />
  </section>
);

// ─── Footer ────────────────────────────────────────────────────────────
const Footer = () => (
  <footer id="support" className="text-white/70" style={{ background: '#0A0B0D' }}>
    <div className="max-w-[1440px] mx-auto px-6 lg:px-10 py-16 grid md:grid-cols-12 gap-10">
      <div className="md:col-span-4">
        <Logo />
        <p className="mt-5 text-white/55 text-[13.5px] leading-[1.55] max-w-[34ch]">
          Sitepulse builds rugged, hybrid power systems for crews working where the grid isn’t. Designed and assembled in Cleveland, Ohio.
        </p>
        <div className="mt-6 flex items-center gap-2">
          <PulseDot label="STATUS · ALL SYSTEMS GO" />
        </div>
      </div>
      {[
        { h: 'PRODUCT', l: ['SP‑2400H Pro', 'Fleet (×4)', 'Solar 400W', 'Spare LFP pack', 'Roadmap'] },
        { h: 'SUPPORT', l: ['Owner manual', 'Field service', 'Warranty', 'Firmware', 'Dealers'] },
        { h: 'COMPANY', l: ['About', 'Press', 'Careers', 'Sustainability', 'Contact'] },
      ].map((c) => (
        <div key={c.h} className="md:col-span-2">
          <div className="mono text-[10.5px] uppercase tracking-[.22em] text-white/45">{c.h}</div>
          <ul className="mt-4 space-y-2.5 text-[13.5px]">
            {c.l.map((x) => <li key={x}><a href="#" className="ulink">{x}</a></li>)}
          </ul>
        </div>
      ))}
      <div className="md:col-span-2">
        <div className="mono text-[10.5px] uppercase tracking-[.22em] text-white/45">FIELD UPDATES</div>
        <p className="mt-4 text-[13px] text-white/65 leading-snug">Quarterly notes from the field. No marketing.</p>
        <form className="mt-3 flex">
          <input type="email" placeholder="you@crew.com" className="flex-1 bg-transparent border hr px-3 h-10 text-[13px] outline-none focus:border-white/40" />
          <button className="px-4 h-10 btn-amber narrow uppercase text-[12px] tracking-[.08em] font-semibold">Sign up</button>
        </form>
      </div>
    </div>
    <div className="border-t hr">
      <div className="max-w-[1440px] mx-auto px-6 lg:px-10 py-5 flex flex-wrap items-center justify-between gap-3 mono text-[10.5px] uppercase tracking-[.18em] text-white/45">
        <span>© 2026 SITEPULSE INC. · UL 9540 · CSA · FCC PT 15</span>
        <span className="flex items-center gap-5">
          <a href="#" className="ulink">PRIVACY</a>
          <a href="#" className="ulink">TERMS</a>
          <a href="#" className="ulink">SECURITY</a>
          <a href="#" className="ulink">VPAT</a>
        </span>
      </div>
    </div>
  </footer>
);

// Export
Object.assign(window, {
  Nav, Hero, SpecStrip, Pillars, HowItRuns, BuiltFor, Inside, FieldReports, Configurator, FinalCta, Footer,
  Tag, Btn, Arrow, PulseDot, Logo,
});
