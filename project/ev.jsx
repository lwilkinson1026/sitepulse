// ev.jsx — EV Backup Charging page
// Reuses the same design language as the main landing.
// Hosted in "Sitepulse — EV Backup.html" alongside the main file.

const { useState, useMemo, useEffect } = React;

const TWEAKS_DEFAULTS = /*EDITMODE-BEGIN*/{
  "evRange": 40,
  "efficiency": 3.7,
  "showHud": true,
  "accent": "#FFFFFF"
}/*EDITMODE-END*/;

/* =================== HEADER =================== */
function Header(){
  const links = [
    ["Overview","./Sitepulse Landing.html"], ["EV Backup","#top"],
    ["The Math","#math"], ["Scenarios","#scenarios"], ["What You Need","#kit"]
  ];
  return (
    <header className="fixed top-0 inset-x-0 z-40 border-b" style={{borderColor:'var(--line)', backdropFilter:'blur(14px)', background:'rgba(0,0,0,.65)'}}>
      <div className="max-w-[1440px] mx-auto px-8 h-[68px] flex items-center justify-between">
        <a href="./Sitepulse Landing.html" className="flex items-center gap-3">
          <span className="font-bold tracking-[.06em] text-[16px]">SITEPULSE</span>
          <span className="mono text-[10px] tracking-[.2em] uppercase text-zinc-500 hidden md:inline">/ EV BACKUP</span>
        </a>
        <nav className="hidden md:flex items-center gap-9">
          {links.map(([t,h]) => (
            <a key={t} href={h} className={`text-[13px] hover:text-white transition-colors uppercase tracking-[.08em] font-medium ${h==="#top"?"text-white":"text-zinc-400"}`}>{t}</a>
          ))}
        </nav>
        <a href="./Sitepulse Landing.html#config" className="btn btn-cy">RESERVE <span className="opacity-70">→</span></a>
      </div>
    </header>
  );
}

/* =================== HERO =================== */
function Eyebrow({num,label}){
  return (
    <div className="flex items-center gap-3 mono text-[11px] uppercase tracking-[.22em] text-zinc-500">
      <span className="text-[var(--hi)]">{num}</span>
      <span className="w-8 h-px bg-[var(--line-strong)]"/>
      <span>{label}</span>
    </div>
  );
}

function Hero({tweaks, setTweak}){
  // Live calculator
  const miles = tweaks.evRange;
  const eff = tweaks.efficiency; // mi / kWh
  const NET_KW = 9.0; // net to vehicle
  const FUEL_GPH = 1.75; // avg high-load

  const kWhNeeded = miles / eff;
  const hours = kWhNeeded / NET_KW;
  const minutes = Math.round(hours * 60);
  const fuelGal = (hours * FUEL_GPH);

  return (
    <section id="top" className="relative pt-[68px] overflow-hidden" style={{minHeight:'100vh'}}>
      <div className="absolute inset-0 grid-bg opacity-50"/>
      <div className="stars opacity-40"/>
      <div className="nebula" style={{width:780, height:780, right:'-200px', top:'-100px', opacity:.3}} />
      <div className="relative max-w-[1440px] mx-auto px-8 pt-16 pb-24">
        <Eyebrow num="00" label="EV BACKUP CHARGING · SECONDARY USE-CASE" />
        <h1 className="display-x mt-6 leading-[.92] tracking-[-.05em]" style={{fontSize:'clamp(56px, 9.5vw, 132px)'}}>
          Get-home power<br/>for an EV.
        </h1>
        <p className="mt-10 max-w-[680px] text-[17px] leading-[1.65] text-zinc-400">
          The DLE 170 paired with a high-output starter generator delivers up to <span className="text-white">10–12&nbsp;kW</span> on demand — Level 2 charging speeds, in a 90-lb box on the back of your truck. Run out of charge twenty miles from town? Plug in. Be moving in under an hour.
        </p>

        {/* CALCULATOR */}
        <div className="mt-16 border" style={{borderColor:'var(--line-strong)'}}>
          <div className="grid grid-cols-1 lg:grid-cols-12">
            {/* Left: input */}
            <div className="lg:col-span-5 p-10 border-b lg:border-b-0 lg:border-r" style={{borderColor:'var(--line-strong)'}}>
              <div className="mono text-[11px] uppercase tracking-[.22em] text-zinc-500">RESCUE CALCULATOR</div>
              <div className="mt-6">
                <div className="flex items-baseline justify-between">
                  <label className="mono text-[12px] uppercase tracking-[.18em] text-zinc-300">Miles needed</label>
                  <div className="display-x text-[44px] tracking-[-.04em] leading-none">{miles}<span className="text-[18px] text-zinc-500 ml-2 mono tracking-[.1em]">MI</span></div>
                </div>
                <input type="range" min="5" max="120" step="5" value={miles}
                  onChange={e => setTweak('evRange', parseInt(e.target.value))}
                  className="mt-5 w-full ev-slider" />
                <div className="mt-3 mono text-[10px] uppercase tracking-[.18em] text-zinc-500 flex justify-between">
                  <span>5</span><span>nearest town</span><span>full buffer</span><span>120</span>
                </div>
              </div>
              <div className="mt-10">
                <div className="flex items-baseline justify-between">
                  <label className="mono text-[12px] uppercase tracking-[.18em] text-zinc-300">EV efficiency</label>
                  <div className="display text-[24px] tracking-[-.02em]">{eff.toFixed(1)}<span className="text-[14px] text-zinc-500 ml-2 mono tracking-[.1em]">MI/KWH</span></div>
                </div>
                <div className="mt-5 seg">
                  {[
                    {v:3.5, l:"Truck / SUV"},
                    {v:3.7, l:"Crossover"},
                    {v:4.0, l:"Sedan"},
                    {v:4.3, l:"Efficient"},
                  ].map(o => (
                    <button key={o.v} onClick={()=>setTweak('efficiency', o.v)}
                      aria-pressed={Math.abs(eff-o.v)<.05}>{o.l}</button>
                  ))}
                </div>
              </div>
            </div>
            {/* Right: output */}
            <div className="lg:col-span-7 p-10 relative">
              <div className="mono text-[11px] uppercase tracking-[.22em] text-zinc-500">RESULT</div>
              <div className="mt-6 grid grid-cols-2 gap-8">
                <div>
                  <div className="display-x leading-none tracking-[-.05em]" style={{fontSize:'clamp(56px,9vw,108px)'}}>
                    {minutes}
                    <span className="text-[20px] text-zinc-500 mono tracking-[.1em] ml-2">MIN</span>
                  </div>
                  <div className="mt-4 mono text-[11px] uppercase tracking-[.18em] text-zinc-500">Charge time at 9 kW net</div>
                </div>
                <div>
                  <div className="display-x leading-none tracking-[-.05em]" style={{fontSize:'clamp(56px,9vw,108px)'}}>
                    {fuelGal.toFixed(1)}
                    <span className="text-[20px] text-zinc-500 mono tracking-[.1em] ml-2">GAL</span>
                  </div>
                  <div className="mt-4 mono text-[11px] uppercase tracking-[.18em] text-zinc-500">Gasoline consumed</div>
                </div>
              </div>

              {/* Bar visualization */}
              <div className="mt-12">
                <div className="mono text-[10px] uppercase tracking-[.18em] text-zinc-500 flex justify-between">
                  <span>kWh delivered</span>
                  <span className="text-zinc-300">{kWhNeeded.toFixed(1)} kWh</span>
                </div>
                <div className="mt-2 h-[6px] bg-white/10">
                  <div className="h-full bg-white" style={{width: `${Math.min(100, (kWhNeeded/30)*100)}%`}} />
                </div>
                <div className="mt-3 mono text-[10px] uppercase tracking-[.18em] text-zinc-600">
                  Tank capacity reference: 30 kWh ≈ a typical EV's full top-up
                </div>
              </div>

              <div className="mt-10 flex flex-wrap gap-3">
                <a href="#scenarios" className="btn btn-cy">SEE RESCUE SCENARIOS <span>→</span></a>
                <a href="#kit" className="btn btn-ghost">WHAT YOU NEED</a>
              </div>
            </div>
          </div>
        </div>

        {/* tagline strip */}
        <div className="mt-10 mono text-[11px] uppercase tracking-[.22em] text-zinc-500">
          ASSUMPTIONS · 9 KW NET TO VEHICLE · 1.75 GAL/HR AVG · 10–15% CHARGING LOSSES INCLUDED
        </div>
      </div>
    </section>
  );
}

/* =================== THE MATH =================== */
function TheMath(){
  const stats = [
    {n:"9 kW", l:"Net to vehicle", sub:"After 10–15% conversion losses"},
    {n:"28–36", l:"Miles per hour", sub:"Real-world EV efficiency"},
    {n:"1.6–1.9", l:"Gal / hour", sub:"At high-load operation"},
    {n:"Level 2", l:"Equivalent class", sub:"Matches most home chargers"},
  ];
  return (
    <section id="math" className="py-32 border-t border-b" style={{borderColor:'var(--line)'}}>
      <div className="max-w-[1440px] mx-auto px-8">
        <Eyebrow num="01" label="THE MATH" />
        <h2 className="display-x mt-6 leading-[.95] tracking-[-.045em]" style={{fontSize:'clamp(44px, 7vw, 96px)'}}>
          A real Level&nbsp;2<br/>charger, in 90&nbsp;lb.
        </h2>
        <p className="mt-8 max-w-[680px] text-[17px] leading-[1.65] text-zinc-400">
          Most portable generators in this weight class push 2–5 kW. The DLE 170 + high-output starter generator delivers <span className="text-white">three to five times that</span> — the difference between trickle-charging an EV and actually getting somewhere.
        </p>

        <div className="mt-20 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-px" style={{background:'var(--line-strong)'}}>
          {stats.map(s => (
            <div key={s.l} className="bg-black p-10">
              <div className="display-x text-[64px] tracking-[-.045em] leading-none">{s.n}</div>
              <div className="mt-4 text-[15px] text-zinc-200">{s.l}</div>
              <div className="mt-2 mono text-[11px] uppercase tracking-[.16em] text-zinc-500">{s.sub}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* =================== SCENARIOS =================== */
function Scenarios(){
  const cards = [
    {
      tag:"01 / TO TOWN",
      title:"Twenty miles to the gas station.",
      miles:"20–25 mi",
      time:"35–45 min",
      fuel:"0.8–1.1 gal",
      body:"Battery hit zero on a Forest Service road. One 3-gallon jerry can in the truck bed gets you to a coffee shop, fast charger, or the next campground."
    },
    {
      tag:"02 / TO A CHARGER",
      title:"Forty miles to the next DC fast charger.",
      miles:"40–45 mi",
      time:"70–85 min",
      fuel:"1.6–2.0 gal",
      body:"You misjudged the route. Pull over, hook up, eat lunch. By the time you finish, you've got the buffer to make a real charger and resume normal speed."
    },
    {
      tag:"03 / FULL BUFFER",
      title:"Sixty miles of comfortable margin.",
      miles:"60–70 mi",
      time:"1 hr 45 min – 2 hrs",
      fuel:"2.4–3.0 gal",
      body:"Storm response, expedition, or a remote build site where the closest plug is ninety minutes away. Top up overnight on a single tank."
    },
  ];
  return (
    <section id="scenarios" className="py-32 border-b" style={{borderColor:'var(--line)'}}>
      <div className="max-w-[1440px] mx-auto px-8">
        <div className="flex items-end justify-between flex-wrap gap-8">
          <div>
            <Eyebrow num="02" label="THREE RESCUE SCENARIOS" />
            <h2 className="display-x mt-6 leading-[.95] tracking-[-.045em]" style={{fontSize:'clamp(44px, 7vw, 96px)'}}>
              Get to where<br/>you're charging.
            </h2>
          </div>
          <div className="text-zinc-500 mono text-[11px] uppercase tracking-[.18em]">9 KW NET · 3.7 MI/KWH</div>
        </div>

        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-px" style={{background:'var(--line-strong)'}}>
          {cards.map((c,i) => (
            <div key={c.tag} className="bg-black p-10 lift relative">
              <div className="mono text-[11px] tracking-[.18em] text-[var(--hi)]">{c.tag}</div>
              <h3 className="display mt-10 text-[28px] tracking-[-.025em] leading-[1.15]">{c.title}</h3>
              <p className="mt-5 text-[14px] leading-[1.6] text-zinc-400">{c.body}</p>

              <div className="mt-10 grid grid-cols-3 gap-px" style={{background:'var(--line)'}}>
                {[["RANGE", c.miles],["TIME", c.time],["FUEL", c.fuel]].map(([k,v])=>(
                  <div key={k} className="bg-black px-4 py-4">
                    <div className="mono text-[10px] uppercase tracking-[.16em] text-zinc-500">{k}</div>
                    <div className="display text-[18px] tracking-[-.02em] mt-2">{v}</div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <p className="mt-12 mono text-[11px] uppercase tracking-[.2em] text-zinc-500 max-w-[800px]">
          Trade 1–3 gallons of gasoline for 30–70 miles of EV range. Effectively a portable Level 2 charger that fits in the bed of a truck.
        </p>
      </div>
    </section>
  );
}

/* =================== COMPARISON =================== */
function Comparison(){
  const cols = [
    {n:"Sitepulse", a:true, vals:["9 kW", "28–36 mi/hr", "~90 lb", "External tank", "Yes — Level 2 EVSE", "Stays connected"]},
    {n:"2 kW inverter generator", vals:["1.6–1.8 kW", "5–7 mi/hr", "45–60 lb", "Built-in 1 gal", "Trickle only", "No telemetry"]},
    {n:"AAA / tow truck", vals:["—", "0 mi/hr", "—", "Diesel", "Tow to charger", "—"]},
    {n:"Tow with portable charger", vals:["7–11 kW", "25–30 mi/hr", "Vehicle", "Diesel", "Yes", "Variable wait"]},
  ];
  const rows = ["Output", "Range / hr", "Weight", "Fuel", "EV charging", "Other capability"];

  return (
    <section className="py-32 border-b" style={{borderColor:'var(--line)'}}>
      <div className="max-w-[1440px] mx-auto px-8">
        <Eyebrow num="03" label="COMPARED TO THE ALTERNATIVES" />
        <h2 className="display-x mt-6 leading-[.95] tracking-[-.045em]" style={{fontSize:'clamp(44px, 7vw, 96px)'}}>
          The only one of<br/>its weight class.
        </h2>

        <div className="mt-20 border overflow-hidden" style={{borderColor:'var(--line-strong)'}}>
          <div className="grid grid-cols-5">
            {/* header row */}
            <div className="p-5 border-b border-r mono text-[11px] uppercase tracking-[.18em] text-zinc-500" style={{borderColor:'var(--line-strong)'}}>&nbsp;</div>
            {cols.map(c => (
              <div key={c.n} className={`p-5 border-b border-r last:border-r-0 ${c.a ? 'bg-white text-black' : ''}`} style={{borderColor:'var(--line-strong)'}}>
                <div className={`display text-[16px] tracking-[-.015em] leading-[1.2] ${c.a ? '' : 'text-zinc-200'}`}>{c.n}</div>
                {c.a && <div className="mt-1 mono text-[10px] uppercase tracking-[.18em] text-black/60">SUBJECT</div>}
              </div>
            ))}
            {/* body rows */}
            {rows.map((r, i) => (
              <React.Fragment key={r}>
                <div className="p-5 border-b border-r mono text-[11px] uppercase tracking-[.18em] text-zinc-500" style={{borderColor:'var(--line)'}}>{r}</div>
                {cols.map(c => (
                  <div key={c.n+r} className="p-5 border-b border-r last:border-r-0 text-[14px] text-zinc-200" style={{borderColor:'var(--line)', background: c.a ? 'rgba(255,255,255,.04)' : 'transparent'}}>
                    {c.vals[i]}
                  </div>
                ))}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* =================== WHAT YOU NEED =================== */
function Kit(){
  const items = [
    {
      n:"01",
      tag:"EVSE",
      title:"A portable Level 2 charger.",
      body:"Most modern J1772 or NACS portable EVSEs accept generator power without complaint. We recommend a 32 A unit (the natural pairing for a 9 kW source).",
      meta:"INCLUDED IN EV-BACKUP KIT"
    },
    {
      n:"02",
      tag:"GROUNDING",
      title:"A grounding rod, properly driven.",
      body:"Critical for safety. The unit ships with a 4-foot copper rod and clamp, plus a step-by-step in the field manual. Two minutes on arrival.",
      meta:"INCLUDED IN ALL UNITS"
    },
    {
      n:"03",
      tag:"OUTPUT",
      title:"A high-power outlet on the unit.",
      body:"The hybrid inverter passes generator output through to a dedicated EV-rated outlet. No transfer-switch surgery required — it's wired in at the factory.",
      meta:"V1 PROTOTYPE — STANDARD"
    },
    {
      n:"04",
      tag:"FUEL",
      title:"A spare jerry can in the truck.",
      body:"The external quick-disconnect tank is the perfect interface for a long rescue session. Bring a 3- or 5-gal can; swap it in 30 seconds without spilling.",
      meta:"BYO FUEL"
    },
  ];

  return (
    <section id="kit" className="py-32 border-b" style={{borderColor:'var(--line)'}}>
      <div className="max-w-[1440px] mx-auto px-8">
        <Eyebrow num="04" label="WHAT YOU NEED" />
        <h2 className="display-x mt-6 leading-[.95] tracking-[-.045em]" style={{fontSize:'clamp(44px, 7vw, 96px)'}}>
          Four things,<br/>and you're charging.
        </h2>

        <div className="mt-20 grid grid-cols-1 md:grid-cols-2 gap-px" style={{background:'var(--line-strong)'}}>
          {items.map(it => (
            <div key={it.n} className="bg-black p-10 lift">
              <div className="flex items-baseline justify-between">
                <div className="mono text-[11px] tracking-[.18em] text-[var(--hi)]">{it.tag}</div>
                <div className="mono text-[10px] tracking-[.16em] text-zinc-600">/{it.n}</div>
              </div>
              <h3 className="display mt-10 text-[28px] tracking-[-.025em] leading-[1.15]">{it.title}</h3>
              <p className="mt-5 text-[14px] leading-[1.6] text-zinc-400">{it.body}</p>
              <div className="mt-10 pt-5 border-t mono text-[10px] uppercase tracking-[.18em] text-zinc-500" style={{borderColor:'var(--line)'}}>
                {it.meta}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* =================== MODE COMPARISON =================== */
function ModeCompare(){
  const rows = [
    ["Power output",       "1.5–2 kW",       "9–10 kW"],
    ["Typical session",    "20–40 min",      "30–120 min"],
    ["Fuel per session",   "0.4–0.8 gal",    "1.2–3.0 gal"],
    ["Engine duty",        "~1.6%",          "On for the duration"],
    ["Noise profile",      "Briefly running","Higher, sustained"],
    ["Primary mission",    "Stays online",   "Recharge an EV"],
  ];
  return (
    <section className="py-32 border-b" style={{borderColor:'var(--line)'}}>
      <div className="max-w-[1440px] mx-auto px-8">
        <Eyebrow num="05" label="TWO MODES, ONE BOX" />
        <h2 className="display-x mt-6 leading-[.95] tracking-[-.045em]" style={{fontSize:'clamp(44px, 7vw, 96px)'}}>
          Connectivity by default.<br/>Rescue when you ask.
        </h2>
        <p className="mt-8 max-w-[680px] text-[17px] leading-[1.65] text-zinc-400">
          The primary mission stays the same: weeks of unattended remote operation, silent on battery. EV-backup mode is an explicit override — you choose it, the engine commits to it, the system warns you about fuel.
        </p>

        <div className="mt-20 grid grid-cols-3 gap-px" style={{background:'var(--line-strong)'}}>
          <div className="bg-black p-6 mono text-[11px] uppercase tracking-[.18em] text-zinc-500">METRIC</div>
          <div className="bg-black p-6">
            <div className="mono text-[11px] uppercase tracking-[.18em] text-zinc-300">CONNECTIVITY MODE</div>
            <div className="mono text-[10px] uppercase tracking-[.18em] text-zinc-500 mt-1">Default · automatic</div>
          </div>
          <div className="bg-white text-black p-6">
            <div className="mono text-[11px] uppercase tracking-[.18em]">EV BACKUP MODE</div>
            <div className="mono text-[10px] uppercase tracking-[.18em] text-black/60 mt-1">Explicit override</div>
          </div>
          {rows.map(([k,a,b])=>(
            <React.Fragment key={k}>
              <div className="bg-black p-6 mono text-[11px] uppercase tracking-[.18em] text-zinc-500">{k}</div>
              <div className="bg-black p-6 text-[15px] text-zinc-200">{a}</div>
              <div className="p-6 text-[15px]" style={{background:'rgba(255,255,255,.04)'}}>{b}</div>
            </React.Fragment>
          ))}
        </div>
      </div>
    </section>
  );
}

/* =================== HONEST CAVEATS =================== */
function Caveats(){
  const items = [
    {h:"Not a DC fast charger", b:"You'll lose 10–15% in conversions versus a wall plug. This is a get-home tool, not a daily charging plan."},
    {h:"Noisy at high load", b:"The engine works harder than in remote-power mode. Expect closer to 60 dB than 0. Don't run it next to a tent."},
    {h:"Heat under load", b:"Sustained 9 kW puts more thermal load on the enclosure. The IP65 chassis is designed for it; don't bury it in a cargo box."},
    {h:"Range-limited by fuel", b:"A 3-gallon jerry can is roughly 90 minutes of EV charging. Plan accordingly for longer expeditions."},
  ];
  return (
    <section className="py-32 border-b" style={{borderColor:'var(--line)'}}>
      <div className="max-w-[1440px] mx-auto px-8">
        <Eyebrow num="06" label="HONEST LIMITATIONS" />
        <h2 className="display-x mt-6 leading-[.95] tracking-[-.045em]" style={{fontSize:'clamp(44px, 7vw, 96px)'}}>
          Things to know.
        </h2>
        <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-px max-w-[1100px]" style={{background:'var(--line-strong)'}}>
          {items.map(it=>(
            <div key={it.h} className="bg-black p-8">
              <div className="display text-[20px] tracking-[-.02em]">{it.h}</div>
              <p className="mt-3 text-[14px] leading-[1.6] text-zinc-400">{it.b}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* =================== FINAL CTA =================== */
function FinalCTA(){
  return (
    <section className="relative py-40 border-b overflow-hidden" style={{borderColor:'var(--line)'}}>
      <div className="absolute inset-0 grid-bg opacity-60"/>
      <div className="stars opacity-40"/>
      <div className="nebula" style={{width:900, height:900, left:'50%', top:'50%', transform:'translate(-50%,-50%)', opacity:.3}} />
      <div className="relative max-w-[1440px] mx-auto px-8 text-center">
        <div className="mono text-[12px] tracking-[.22em] uppercase text-[var(--hi)]">DUAL-USE · V1 PROTOTYPE BUILDS</div>
        <h2 className="display-x mt-8 leading-[.92] tracking-[-.05em]" style={{fontSize:'clamp(56px, 11vw, 180px)'}}>
          Stay online.<br/>Get home.
        </h2>
        <div className="mt-14 flex flex-wrap justify-center items-center gap-4">
          <a href="./Sitepulse Landing.html#config" className="btn btn-cy">RESERVE A UNIT <span>→</span></a>
          <a href="./Sitepulse Landing.html" className="btn btn-ghost">BACK TO OVERVIEW</a>
        </div>
      </div>
    </section>
  );
}

/* =================== FOOTER =================== */
function Footer(){
  return (
    <footer className="py-20">
      <div className="max-w-[1440px] mx-auto px-8">
        <div className="flex flex-wrap items-center justify-between gap-6 mono text-[10px] tracking-[.18em] uppercase text-zinc-500">
          <div className="display text-[16px] text-white tracking-[.04em] font-bold">SITEPULSE</div>
          <div>© 2026 Sitepulse Power, Inc.</div>
          <div>EV-Backup figures · 9 kW net · ~1.75 gal/hr · 3.7 mi/kWh baseline</div>
        </div>
      </div>
    </footer>
  );
}

/* =================== TWEAKS =================== */
function Tweaks({tweaks, setTweak}){
  return (
    <TweaksPanel>
      <TweakSection title="Calculator defaults">
        <TweakSlider label="Miles needed" min={5} max={120} step={5}
          value={tweaks.evRange} onChange={v=>setTweak('evRange', v)} />
        <TweakSelect label="EV efficiency"
          value={String(tweaks.efficiency)}
          onChange={v=>setTweak('efficiency', parseFloat(v))}
          options={[
            {value:"3.5", label:"3.5 mi/kWh — truck"},
            {value:"3.7", label:"3.7 mi/kWh — crossover"},
            {value:"4.0", label:"4.0 mi/kWh — sedan"},
            {value:"4.3", label:"4.3 mi/kWh — efficient"},
          ]}
        />
      </TweakSection>
      <TweakSection title="Accent">
        <TweakRadio
          label="Tone"
          value={tweaks.accent}
          onChange={v=>setTweak('accent', v)}
          options={[
            {value:"#FFFFFF", label:"White"},
            {value:"#00D4FF", label:"Cyan"},
            {value:"#FFB02E", label:"Amber"},
          ]}
        />
      </TweakSection>
    </TweaksPanel>
  );
}

/* =================== APP =================== */
function App(){
  const [tweaks, setTweak] = useTweaks(TWEAKS_DEFAULTS);
  useEffect(()=>{
    document.documentElement.style.setProperty('--hi', tweaks.accent);
  }, [tweaks.accent]);
  return (
    <div className="min-h-screen bg-black">
      <Header />
      <Hero tweaks={tweaks} setTweak={setTweak} />
      <TheMath />
      <Scenarios />
      <Comparison />
      <Kit />
      <ModeCompare />
      <Caveats />
      <FinalCTA />
      <Footer />
      <Tweaks tweaks={tweaks} setTweak={setTweak} />
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App/>);
