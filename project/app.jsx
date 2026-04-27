/* global React, ReactDOM */
const { useState, useEffect, useRef, useMemo } = React;

const TWEAKS_DEFAULTS = /*EDITMODE-BEGIN*/{
  "headline": "connectivity",
  "showCallouts": true,
  "showStarfield": true,
  "showOrbit": true,
  "accent": "#FFFFFF"
}/*EDITMODE-END*/;

const HEADLINES = {
  "connectivity": {
    eyebrow: "REMOTE HYBRID POWER · STARLINK MINI · TRUE HYBRID",
    big: ["Silent for days.", <span key="b" style={{color:'var(--hi)'}} className="text-glow">Online forever.</span>],
    sub: "A 90-lb hybrid power system that keeps Starlink Mini connected for weeks on one tank. Battery runs the radio. The 170 cc engine only kicks in 23 minutes a day."
  },
  "always-on": {
    eyebrow: "TRUE HYBRID · BATTERY-FIRST",
    big: ["Always online.", <span key="b" style={{color:'var(--hi)'}} className="text-glow"> Mostly silent.</span>],
    sub: "1.5 kWh LFP battery powers a Starlink Mini for 48 hours of pure quiet. The 17.5 HP twin auto-starts only when the battery dips. ~13 gallons a month."
  },
  "remote-watch": {
    eyebrow: "MONTHS OF UNATTENDED OPERATION",
    big: ["Set it. Forget it.", <span key="b" style={{color:'var(--hi)'}} className="text-glow"> Watch it from anywhere.</span>],
    sub: "Up to 12 kW on demand. Hours of silent runtime between starts. Live telemetry over Starlink + cellular backup, with manual override from the app."
  }
};

/* =================== HEADER =================== */
function Header(){
  const [open, setOpen] = useState(false);
  const links = [
    ["The Unit","#unit"], ["How it Runs","#runs"],
    ["Specs","#specs"], ["EV Backup","Sitepulse EV Backup.html"], ["Configure","#config"]
  ];
  return (
    <header className="fixed top-0 inset-x-0 z-40 border-b" style={{borderColor:'var(--line)', backdropFilter:'blur(14px)', background:'rgba(0,0,0,.65)'}}>
      <div className="max-w-[1440px] mx-auto px-8 h-[68px] flex items-center justify-between">
        <a href="#top" className="flex items-center">
          <span className="font-bold tracking-[.06em] text-[16px]">SITEPULSE</span>
        </a>
        <nav className="hidden md:flex items-center gap-9">
          {links.map(([t,h]) => (
            <a key={t} href={h} className="ulink text-[13px] text-zinc-400 hover:text-white transition-colors uppercase tracking-[.08em] font-medium">{t}</a>
          ))}
        </nav>
        <div className="flex items-center gap-5">
          <a href="#dealers" className="ulink hidden sm:inline text-[12px] uppercase tracking-[.1em] text-zinc-400 mono">Dealers</a>
          <a href="#config" className="btn btn-cy">RESERVE <span className="opacity-70">→</span></a>
        </div>
      </div>
    </header>
  );
}

function Logo(){ return null; }

/* =================== HERO =================== */
function Hero({tweaks}){
  const h = HEADLINES[tweaks.headline] || HEADLINES["connectivity"];
  return (
    <section id="top" className="relative pt-[68px] overflow-hidden" style={{minHeight:'100vh'}}>
      {/* backgrounds */}
      <div className="absolute inset-0 grid-bg" />
      {tweaks.showStarfield && <div className="stars" />}
      <div className="nebula" style={{width:780, height:780, left:'-200px', top:'15%'}} />
      <div className="nebula" style={{width:520, height:520, right:'-100px', top:'45%', opacity:.25}} />

      {/* orbit decoration */}
      {tweaks.showOrbit && (
        <>
          <div className="orbit" style={{width:1600,height:1600,left:'50%',top:'18%',transform:'translateX(-50%)',opacity:.25}} />
          <div className="orbit" style={{width:1100,height:1100,left:'50%',top:'30%',transform:'translateX(-50%)',opacity:.2}} />
        </>
      )}

      <div className="relative max-w-[1440px] mx-auto px-8">
        {/* status strip */}
        <div className="mt-12 flex items-center gap-3 mono text-[11px] tracking-[.18em] text-zinc-500 uppercase">
          <span className="pulse-dot" />
          <span>SHIPPING Q3 · MADE IN BOZEMAN, MT · 5-YEAR WARRANTY</span>
        </div>

        {/* eyebrow */}
        <div className="mt-10 mono text-[12px] tracking-[.22em] text-[var(--hi)] uppercase">
          {h.eyebrow}
        </div>

        {/* big head */}
        <h1 className="display-x mt-6 leading-[.92] text-[120px] max-w-[1100px]" style={{fontSize:'clamp(64px, 10vw, 144px)'}}>
          {h.big[0]}<br/>{h.big[1]}
        </h1>

        <p className="mt-10 max-w-[640px] text-[17px] leading-[1.65] text-zinc-400">
          {h.sub}
        </p>

        <div className="mt-10 flex flex-wrap items-center gap-4">
          <a href="#config" className="btn btn-cy">RESERVE FROM $499 <span>→</span></a>
          <a href="#runs" className="btn btn-ghost">SEE IT RUN</a>
          <span className="mono text-[11px] uppercase tracking-[.18em] text-zinc-500 ml-3">Refundable · Ships Q3 ·  Free freight</span>
        </div>

        {/* hero image */}
        <div className="mt-20 relative">
          <HeroProductImage />
          {/* corner ticks */}
          <CornerTicks />
        </div>

        {/* stats strip */}
        <div className="mt-12 mb-24 grid grid-cols-2 md:grid-cols-4 border-t border-b" style={{borderColor:'var(--line-strong)'}}>
          {[
            ["1.54", "kWh LFP battery", ""],
            ["48 hr", "Silent, Starlink only", ""],
            ["12 kW", "Peak, engine running", ""],
            ["~13 gal", "Fuel per month", ""],
          ].map(([n,l]) => (
            <div key={l} className="px-6 py-7 border-r last:border-r-0" style={{borderColor:'var(--line-strong)'}}>
              <div className="display text-[44px] tracking-[-.04em] leading-none">{n}</div>
              <div className="mt-2 mono text-[11px] uppercase tracking-[.16em] text-zinc-500">{l}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function HeroProductImage(){
  return (
    <div className="relative">
      {/* outer frame, shorter and wider — feels like a product spec card */}
      <div className="aspect-[21/9] relative overflow-hidden border" style={{borderColor:'var(--line-strong)', background:'#000'}}>
        {/* faint grid */}
        <div className="absolute inset-0 grid-bg opacity-30" />
        {/* Two-column inside frame: telemetry left | product right */}
        <div className="absolute inset-0 grid grid-cols-12">
          {/* LEFT: telemetry rail */}
          <div className="col-span-4 p-8 border-r flex flex-col justify-between" style={{borderColor:'var(--line)'}}>
            <div>
              <div className="mono text-[10px] tracking-[.22em] text-zinc-500 uppercase">UNIT-001 · BOZEMAN PLANT</div>
              <div className="mt-2 mono text-[10px] tracking-[.22em] uppercase flex items-center gap-2"><span className="pulse-dot"/><span className="text-[var(--hi)]">LIVE TELEMETRY</span></div>
            </div>
            <div className="space-y-5">
              <div>
                <div className="mono text-[10px] tracking-[.18em] text-zinc-400 uppercase flex justify-between">
                  <span>Battery SOC</span><span className="text-[var(--hi)]">87%</span>
                </div>
                <div className="mt-1.5 h-[3px] bg-white/10">
                  <div className="h-full bg-[var(--hi)] meter-fill" style={{width:'87%'}} />
                </div>
              </div>
              <div>
                <div className="mono text-[10px] tracking-[.18em] text-zinc-400 uppercase flex justify-between">
                  <span>Load</span><span className="text-[var(--run)]">26 W</span>
                </div>
                <div className="mt-1.5 h-[3px] bg-white/10">
                  <div className="h-full meter-fill" style={{width:'18%', background:'var(--run)', animationDelay:'-1s'}} />
                </div>
              </div>
              <div>
                <div className="mono text-[10px] tracking-[.18em] text-zinc-400 uppercase flex justify-between">
                  <span>Engine</span><span>STANDBY</span>
                </div>
                <div className="mt-1.5 h-[3px] bg-white/10">
                  <div className="h-full" style={{width:'2%', background:'rgba(255,255,255,.4)'}} />
                </div>
              </div>
            </div>
            <div className="mono text-[10px] tracking-[.18em] text-zinc-500 uppercase grid grid-cols-2 gap-y-1.5">
              <span>Cycle</span><span className="text-zinc-300 text-right">2,418 / 6,000</span>
              <span>Next svc</span><span className="text-right">2,082 H</span>
              <span>Uplink</span><span className="text-[var(--hi)] text-right">STARLINK</span>
              <span>Env</span><span className="text-right">14°C</span>
            </div>
          </div>
          {/* RIGHT: product card */}
          <div className="col-span-8 relative">
            {/* product surface — soft white panel, contained inside the bezel with margin */}
            <div className="absolute" style={{left:'6%', right:'6%', top:'8%', bottom:'8%', background:'linear-gradient(180deg, #f5f5f5 0%, #dcdcdc 70%, #c8c8c8 100%)', boxShadow:'inset 0 1px 0 rgba(255,255,255,.6), 0 2px 24px rgba(0,0,0,.5)'}}>
              <img src="assets/product-hero.jpg" alt="Sitepulse hybrid power unit"
                   className="absolute inset-0 w-full h-full object-contain"
                   onError={(e)=>{e.target.style.display='none'}} />
            </div>
            {/* corner ticks inside the right pane */}
            <span className="absolute top-3 left-3 w-4 h-4 border-l border-t" style={{borderColor:'var(--line-strong)'}}/>
            <span className="absolute top-3 right-3 w-4 h-4 border-r border-t" style={{borderColor:'var(--line-strong)'}}/>
            <span className="absolute bottom-3 left-3 w-4 h-4 border-l border-b" style={{borderColor:'var(--line-strong)'}}/>
            <span className="absolute bottom-3 right-3 w-4 h-4 border-r border-b" style={{borderColor:'var(--line-strong)'}}/>
            {/* fig label */}
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 mono text-[10px] tracking-[.22em] text-zinc-500 uppercase whitespace-nowrap">
              FIG. 01 · SITEPULSE V1 · 90 LB DRY · IP65
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Hud(){
  return (
    <>
      {/* top-left cluster */}
      <div className="absolute top-6 left-6 mono text-[10px] tracking-[.2em] text-zinc-500 uppercase">
        <div>UNIT-001 · BOZEMAN PLANT</div>
        <div className="mt-1 text-[var(--hi)]">● LIVE TELEMETRY</div>
      </div>
      {/* top-right meter */}
      <div className="absolute top-6 right-6 w-[220px]">
        <div className="mono text-[10px] tracking-[.18em] text-zinc-400 uppercase flex justify-between">
          <span>Battery SOC</span><span className="text-[var(--hi)]">87%</span>
        </div>
        <div className="mt-1.5 h-[3px] bg-white/10">
          <div className="h-full bg-[var(--hi)] meter-fill" style={{width:'87%'}} />
        </div>
        <div className="mt-3 mono text-[10px] tracking-[.18em] text-zinc-400 uppercase flex justify-between">
          <span>Load</span><span className="text-[var(--run)]">26 W</span>
        </div>
        <div className="mt-1.5 h-[3px] bg-white/10">
          <div className="h-full meter-fill" style={{width:'18%', background:'var(--run)', animationDelay:'-1s'}} />
        </div>
      </div>
      {/* bottom-left scale */}
      <div className="absolute bottom-6 left-6 mono text-[10px] tracking-[.18em] text-zinc-500 uppercase">
        <div>~90 LB DRY</div>
        <div>IP65 · −20°C TO +50°C</div>
      </div>
      {/* bottom-right reading */}
      <div className="absolute bottom-6 right-6 mono text-[10px] tracking-[.18em] text-zinc-500 uppercase text-right">
        <div className="text-zinc-300">CYCLE 2,418 / 6,000</div>
        <div>NEXT SVC: 2,082 H</div>
      </div>
    </>
  );
}

function CornerTicks(){
  const T = ({pos}) => (<div className="absolute w-3 h-3" style={{...pos, borderColor:'var(--hi)'}}>
    {pos.top !== undefined && pos.left !== undefined && <><div className="absolute left-0 top-0 h-full w-px bg-[var(--hi)]"/><div className="absolute left-0 top-0 w-full h-px bg-[var(--hi)]"/></>}
    {pos.top !== undefined && pos.right !== undefined && <><div className="absolute right-0 top-0 h-full w-px bg-[var(--hi)]"/><div className="absolute right-0 top-0 w-full h-px bg-[var(--hi)]"/></>}
    {pos.bottom !== undefined && pos.left !== undefined && <><div className="absolute left-0 bottom-0 h-full w-px bg-[var(--hi)]"/><div className="absolute left-0 bottom-0 w-full h-px bg-[var(--hi)]"/></>}
    {pos.bottom !== undefined && pos.right !== undefined && <><div className="absolute right-0 bottom-0 h-full w-px bg-[var(--hi)]"/><div className="absolute right-0 bottom-0 w-full h-px bg-[var(--hi)]"/></>}
  </div>);
  return (
    <>
      <T pos={{top:-1, left:-1}} />
      <T pos={{top:-1, right:-1}} />
      <T pos={{bottom:-1, left:-1}} />
      <T pos={{bottom:-1, right:-1}} />
    </>
  );
}

/* =================== MARQUEE =================== */
function Marquee(){
  const items = [
    "1.54 kWh LFP", "30 Ah · 48 V", "Starlink Mini", "DLE 170cc · 17.5 HP",
    "10–12 kW peak", "48 hr silent", "IP65 sealed", "−20 °C to +50 °C",
    "~90 lb dry", "External fuel tank", "Cellular failover", "App + OTA updates"
  ];
  const row = [...items, ...items];
  return (
    <section className="border-y overflow-hidden py-7" style={{borderColor:'var(--line)'}}>
      <div className="marquee-track flex gap-12 nowrap">
        {row.map((t,i)=>(
          <div key={i} className="flex items-center gap-12">
            <span className="display text-[28px] tracking-[-.02em] text-zinc-300">{t}</span>
            <Diamond />
          </div>
        ))}
      </div>
    </section>
  );
}
const Diamond = () => <span className="inline-block w-1.5 h-1.5 rotate-45 bg-[var(--hi)]" />;

/* =================== THREE PILLARS =================== */
function Pillars(){
  const items = [
    {
      tag:"01 / BATTERY",
      title:"1.54 kWh LFP pack.",
      copy:"30 Ah lithium iron phosphate at 48 V nominal, 22 lb with active BMS. Cell-level protection, optional sub-zero heaters. Runs Starlink Mini for 40–48 hours of pure silence between starts.",
      stats:[["48 V","Nominal"],["30 Ah","Capacity"],["22 lb","Weight"],["BMS","Cell-level protect"]],
      icon:<BatteryIcon/>
    },
    {
      tag:"02 / CONNECTIVITY",
      title:"Starlink Mini, integrated.",
      copy:"Dish, router, and cable all inside. Powered on a dedicated circuit (or optional direct DC for max efficiency). Cellular failover keeps telemetry alive if Starlink ever drops.",
      stats:[["~25 W","Avg draw"],["3.5 lb","Mini kit"],["DC OPT","Direct feed"],["LTE","Failover"]],
      icon:<DishIcon/>
    },
    {
      tag:"03 / ENGINE",
      title:"DLE 170cc · 17.5 HP twin.",
      copy:"Gas twin paired with a high-output starter generator delivers up to 10–12 kW on demand. Auto-starts when load exceeds the inverter for 45 s; otherwise idle. External quick-disconnect fuel tank — no built-in tank, no spillage.",
      stats:[["17.5 HP","Twin cyl"],["10–12 kW","Peak"],["~1.1","gal/hr running"],["<60 dB","Enclosed"]],
      icon:<GenIcon/>
    },
  ];
  return (
    <section id="unit" className="relative py-32 border-b" style={{borderColor:'var(--line)'}}>
      <div className="max-w-[1440px] mx-auto px-8">
        <Eyebrow num="01" label="THE UNIT" />
        <h2 className="display-x mt-6 leading-[.95] text-[88px] tracking-[-.045em] max-w-[1100px]" style={{fontSize:'clamp(44px, 7vw, 96px)'}}>
          Three systems.<br/>One quiet box.
        </h2>
        <p className="mt-8 max-w-[640px] text-[17px] leading-[1.65] text-zinc-400">
          The hybrid stack swaps power source automatically — silent battery first, Starlink always connected, the engine only when load truly demands it. No switches. No downtime.
        </p>

        <div className="mt-20 grid grid-cols-1 lg:grid-cols-3 gap-px" style={{background:'var(--line-strong)'}}>
          {items.map(it => <Pillar key={it.tag} {...it} />)}
        </div>
      </div>
    </section>
  );
}

function Eyebrow({num, label}){
  return (
    <div className="flex items-center gap-4 mono text-[11px] uppercase tracking-[.22em]">
      <span className="text-[var(--hi)]">[ {num} ]</span>
      <span className="h-px flex-none w-12 bg-[var(--line-strong)]" />
      <span className="text-zinc-500">{label}</span>
    </div>
  );
}

function Pillar({tag,title,copy,stats,icon}){
  return (
    <div className="bg-black p-10 lift">
      <div className="flex items-start justify-between">
        <div className="mono text-[11px] tracking-[.2em] text-[var(--hi)]">{tag}</div>
        <div>{icon}</div>
      </div>
      <h3 className="display mt-12 text-[34px] tracking-[-.03em] leading-[1.1]">{title}</h3>
      <p className="mt-5 text-[15px] leading-[1.6] text-zinc-400">{copy}</p>
      <div className="mt-10 grid grid-cols-2 gap-y-6 gap-x-4 pt-8 border-t" style={{borderColor:'var(--line)'}}>
        {stats.map(([n,l]) => (
          <div key={l}>
            <div className="display text-[28px] tracking-[-.03em] leading-none">{n}</div>
            <div className="mt-2 mono text-[10px] uppercase tracking-[.16em] text-zinc-500">{l}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

const ICON_PROPS = {width:40, height:40, viewBox:"0 0 40 40", fill:"none", stroke:"#FFFFFF", strokeWidth:1.5};
const BatteryIcon = () => <svg {...ICON_PROPS}><rect x="6" y="11" width="26" height="20" /><rect x="32" y="17" width="3" height="8" fill="#FFFFFF"/><rect x="9" y="14" width="6" height="14" fill="#FFFFFF" opacity=".3"/><rect x="16" y="14" width="6" height="14" fill="#FFFFFF" opacity=".3"/><rect x="23" y="14" width="6" height="14" fill="#FFFFFF" opacity=".3"/></svg>;
const DishIcon = () => <svg {...ICON_PROPS}><circle cx="20" cy="20" r="14"/><circle cx="20" cy="20" r="9"/><circle cx="20" cy="20" r="3" fill="#FFFFFF"/><path d="M20 6 L20 2 M20 38 L20 34 M6 20 L2 20 M38 20 L34 20"/></svg>;
const GenIcon = () => <svg {...ICON_PROPS}><rect x="6" y="9" width="28" height="22" rx="1"/><circle cx="14" cy="20" r="4"/><circle cx="14" cy="20" r="1.5" fill="#FFFFFF"/><path d="M22 16 L30 16 M22 20 L28 20 M22 24 L30 24"/></svg>;

/* =================== 24H CYCLE =================== */
function RunCycle(){
  const phases = [
    {h:"00:00 — IDLE", title:"Battery carries the radio", body:"Starlink Mini pulls ~25 W. Engine off. Pack drains roughly 1% per hour. Site at zero decibels.", source:"BATTERY", color:"var(--hi)"},
    {h:"+24 HOURS", title:"Still silent", body:"Day-one finishes at ~60% SOC. The control board is happy. Telemetry beats home every minute.", source:"BATTERY", color:"var(--hi)"},
    {h:"+48 HOURS", title:"Threshold reached", body:"Pack hits ~25%. Engine warm-start, idles up, generator picks up the load while the pack tops off.", source:"ENGINE", color:"var(--hi)", ring:true},
    {h:"+48:23", title:"Engine shuts down", body:"Pack back to ~90% in 23 minutes. Cooldown sequence runs. Stabilizer doses on shutdown. System silent again.", source:"BATTERY", color:"var(--hi)"},
    {h:"REPEAT", title:"~2.4 days per cycle", body:"~13 gallons consumed per month. ~12 hours of total engine runtime. The other 97% of the time: silence.", source:"BATTERY", color:"var(--hi)"},
  ];
  return (
    <section id="runs" className="py-32 border-b" style={{borderColor:'var(--line)'}}>
      <div className="max-w-[1440px] mx-auto px-8">
        <Eyebrow num="02" label="HOW IT RUNS" />
        <h2 className="display-x mt-6 leading-[.95] tracking-[-.045em]" style={{fontSize:'clamp(44px, 7vw, 96px)'}}>
          Silent for days.<br/>23 minutes to recharge.
        </h2>
        <p className="mt-8 max-w-[640px] text-[17px] leading-[1.65] text-zinc-400">
          Connectivity-only mode: a Starlink Mini at ~25 W average. The control board tracks load, state-of-charge, and fuel — and starts the engine only when it has to.
        </p>

        {/* timeline rail */}
        <div className="mt-24 relative">
          <div className="absolute left-0 right-0 top-[calc(50%-1px)] h-px" style={{background:'var(--line-strong)'}}/>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-px relative">
            {phases.map((p,i) => (
              <div key={i} className="relative pt-12 pb-12 px-6">
                <div className={`absolute left-1/2 top-[calc(50%-6px)] -translate-x-1/2 w-3 h-3 rounded-full`}
                     style={p.ring
                       ? {border:'1.5px solid #fff', background:'#000'}
                       : {background:'#fff', boxShadow:'0 0 16px rgba(255,255,255,.4)'}} />
                <div className="text-center">
                  <div className="mono text-[11px] tracking-[.18em] text-zinc-500">{p.h}</div>
                </div>
                <div className={`mt-${i % 2 === 0 ? 8 : 0} ${i % 2 === 0 ? 'order-1' : 'order-2'}`} style={{minHeight:'120px'}}>
                  {/* alternate above/below */}
                </div>
              </div>
            ))}
          </div>

          {/* phase cards alternating above/below */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-6 -mt-4">
            {phases.map((p,i) => (
              <div key={i} className={`p-5 border lift bg-black ${i % 2 === 0 ? 'mt-0' : 'mt-24'}`} style={{borderColor:'var(--line-strong)'}}>
                <div className="mono text-[10px] tracking-[.16em] uppercase" style={{color:p.ring ? 'rgba(255,255,255,.55)' : '#fff'}}>{p.source}</div>
                <div className="display text-[20px] tracking-[-.02em] leading-tight mt-3">{p.title}</div>
                <p className="mt-3 text-[13px] leading-[1.55] text-zinc-400">{p.body}</p>
              </div>
            ))}
          </div>
        </div>

        {/* totals */}
        <div className="mt-32 grid grid-cols-2 md:grid-cols-4 border-t border-b" style={{borderColor:'var(--line-strong)'}}>
          {[
            ["12 hr","Engine runtime / mo"],
            ["13 gal","Fuel / mo @ 25 W avg"],
            ["1.6%","Engine duty cycle"],
            ["~12","Battery cycles / mo"],
          ].map(([n,l])=>(
            <div key={l} className="px-6 py-8 border-r last:border-r-0" style={{borderColor:'var(--line-strong)'}}>
              <div className="display text-[44px] tracking-[-.04em] leading-none">{n}</div>
              <div className="mt-2 mono text-[11px] tracking-[.16em] uppercase text-zinc-500">{l}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* =================== USE CASES =================== */
function UseCases(){
  const cases = [
    {tag:"REMOTE MONITORING", title:"Pipeline sensor backhaul", body:"Months of unattended uptime on a single fuel tank. Engine runs ~12 hr/month. Every reading hits the cloud over Starlink, with cellular failover for telemetry."},
    {tag:"BACKCOUNTRY RESEARCH", title:"Field station that stays online", body:"Powers Starlink Mini, a logger, and a couple of cameras 24/7. Silent enough to live next to a tent. Refuel cadence: weeks, not days."},
    {tag:"WILDFIRE LOOKOUT", title:"Camera tower with live link", body:"PTZ camera + AI box + Starlink. Runs through a smoke event without intervention. Manual override available from the app if the duty cycle needs forcing."},
    {tag:"DISASTER RESPONSE", title:"Comms node, deployed in minutes", body:"Lift it off the truck, plug in the external tank, raise the dish. Internet and a 120 V outlet within 90 seconds. Up to 12 kW available when crews arrive."},
    {tag:"OIL & GAS PAD", title:"SCADA where the grid isn't", body:"Drives flow meters and a Starlink uplink for an entire well pad. Engine duty stays under 2%. Stabilizer auto-doses on shutdown for long sits between visits."},
    {tag:"REMOTE OFFICE", title:"Cabin or jobsite trailer", body:"~25 W of Starlink lasts 40-plus hours on battery alone. Plug in tools or a fridge and the engine joins in automatically. No switches to flip."},
  ];
  return (
    <section className="py-32 border-b" style={{borderColor:'var(--line)'}}>
      <div className="max-w-[1440px] mx-auto px-8">
        <div className="flex items-end justify-between flex-wrap gap-8">
          <div>
            <Eyebrow num="03" label="WHO IT'S FOR" />
            <h2 className="display-x mt-6 leading-[.95] tracking-[-.045em]" style={{fontSize:'clamp(44px, 7vw, 96px)'}}>
              Built to stay,<br/>not to babysit.
            </h2>
          </div>
          <div className="text-zinc-500 mono text-[11px] uppercase tracking-[.18em]">06 SCENARIOS</div>
        </div>

        <div className="mt-20 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px" style={{background:'var(--line-strong)'}}>
          {cases.map((c,i) => (
            <div key={c.tag} className="bg-black p-10 lift">
              <div className="flex items-center justify-between">
                <div className="mono text-[11px] tracking-[.18em] text-[var(--hi)]">{c.tag}</div>
                <div className="mono text-[10px] tracking-[.16em] text-zinc-600">/0{i+1}</div>
              </div>
              <h3 className="display mt-10 text-[26px] tracking-[-.025em] leading-[1.15]">{c.title}</h3>
              <p className="mt-4 text-[14px] leading-[1.6] text-zinc-400">{c.body}</p>
              <div className="mt-10 pt-5 border-t flex items-center justify-between" style={{borderColor:'var(--line)'}}>
                <span className="mono text-[10px] tracking-[.16em] uppercase text-zinc-500">Read the field report</span>
                <span className="text-[var(--hi)]">→</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* =================== INSIDE THE UNIT (specs) =================== */
function Specs(){
  const rows = [
    ["Battery",          "30 Ah · 48 V LFP (1.54 kWh) · 22 lb · active BMS · cell-level protection"],
    ["Inverter",         "1,500–2,000 W continuous · hybrid w/ generator input · 120 V pure sine · 60 Hz"],
    ["Engine",           "DLE 170cc twin-cylinder gas · 17.5 HP · 9.1 lb · vibration-isolated mounts"],
    ["Starter generator","High-output starter/alternator · up to 10–12 kW peak · VESC controller"],
    ["Connectivity",     "Starlink Mini integrated (3.5 lb kit) · cellular failover · OTA firmware"],
    ["Fuel",             "External quick-disconnect tank · gasoline w/ auto-stabilizer dosing on shutdown"],
    ["Sensors",          "Ultrasonic fuel level · SOC/V/I/temp · CO · enclosure temp · GPS"],
    ["Chassis",          "SendcutSend sheet metal enclosure · IP65 · 8 lb · skid or trailer mount"],
    ["Environment",      "−20 °C to +50 °C (heaters optional) · <60 dB(A) enclosed · vibration-isolated"],
    ["Safety",           "CO shutdown · fuel cutoff · BMS protect · GFCI · surge · local + remote E-stop"],
    ["Total weight",     "~90 lb dry (no fuel) · realistic 85–92 lb range"],
  ];
  return (
    <section id="specs" className="py-32 border-b" style={{borderColor:'var(--line)'}}>
      <div className="max-w-[1440px] mx-auto px-8">
        <Eyebrow num="04" label="INSIDE THE UNIT" />
        <h2 className="display-x mt-6 leading-[.95] tracking-[-.045em]" style={{fontSize:'clamp(44px, 7vw, 96px)'}}>
          Engineered for<br/>unattended duty.
        </h2>

        <div className="mt-20 grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Image column */}
          <div className="lg:col-span-5">
            <div className="aspect-[5/4] relative overflow-hidden border" style={{borderColor:'var(--line-strong)', background:'#000'}}>
              <img src="assets/product-angle.jpg" alt="Sitepulse 3/4 view" className="absolute inset-0 w-full h-full object-contain" onError={(e)=>{e.target.style.display='none'}} />
              <div className="absolute bottom-3 right-3 mono text-[10px] tracking-[.18em] uppercase text-zinc-500">SCALE 1:6</div>
            </div>
            <div className="mt-px grid grid-cols-3 gap-px" style={{background:'var(--line-strong)'}}>
              {[["~90 lb","Dry weight"],["IP65","Sealed"],["−20→50°C","Operating"]].map(([n,l])=>(
                <div key={l} className="bg-black px-5 py-5 text-center">
                  <div className="display text-[26px] tracking-[-.03em]">{n}</div>
                  <div className="mt-1 mono text-[10px] tracking-[.16em] text-zinc-500 uppercase">{l}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Spec table */}
          <div className="lg:col-span-7">
            <table className="w-full">
              <tbody>
                {rows.map(([k,v]) => (
                  <tr key={k} className="spec-row border-b" style={{borderColor:'var(--line)'}}>
                    <th className="text-left align-top py-5 pr-6 mono text-[11px] uppercase tracking-[.16em] text-zinc-500 w-[160px] font-medium">{k}</th>
                    <td className="py-5 text-[15px] leading-[1.55] text-zinc-200">{v}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="mt-10 flex flex-wrap gap-3">
              <a href="#config" className="btn btn-cy">CONFIGURE YOUR UNIT <span>→</span></a>
              <a href="#" className="btn btn-ghost">DOWNLOAD SPEC PDF</a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* =================== FIELD REPORTS =================== */
function FieldReports(){
  const quotes = [
    {q:"It just sits there and stays online. We checked the dashboard, not the unit, for a full month.", a:"Wes Halverson", t:"Field ops, remote pipeline — Big Sky, MT"},
    {q:"~13 gallons a month for a Starlink uplink and a logger. The math finally works for our pads.", a:"Mira Okafor", t:"SCADA lead, basin operator — Williston, ND"},
    {q:"Engine started when it said it would, ran for 23 minutes, and went quiet again. Boring. Good.", a:"David Cho", t:"Research engineer, hydrology station — Big Bend, TX"},
  ];
  return (
    <section className="py-32 border-b" style={{borderColor:'var(--line)'}}>
      <div className="max-w-[1440px] mx-auto px-8">
        <Eyebrow num="05" label="FIELD REPORTS" />
        <h2 className="display-x mt-6 leading-[.95] tracking-[-.045em]" style={{fontSize:'clamp(44px, 7vw, 96px)'}}>
          From the people<br/>actually using it.
        </h2>

        <div className="mt-20 grid grid-cols-1 lg:grid-cols-3 gap-px" style={{background:'var(--line-strong)'}}>
          {quotes.map((Q,i)=>(
            <div key={i} className="bg-black p-10 lift">
              <div className="text-[var(--hi)] text-[80px] leading-none display-x">"</div>
              <p className="-mt-6 text-[20px] leading-[1.4] tracking-[-.01em] text-zinc-100">{Q.q}</p>
              <div className="mt-12 pt-5 border-t" style={{borderColor:'var(--line)'}}>
                <div className="text-[15px] font-semibold">{Q.a}</div>
                <div className="mt-1 mono text-[11px] tracking-[.16em] uppercase text-zinc-500">{Q.t}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* =================== EV TEASER =================== */
function EVTeaser(){
  const stats = [
    {n:"9 kW", l:"Net to vehicle"},
    {n:"30 mi/hr", l:"Range delivered"},
    {n:"~Level 2", l:"Equivalent class"},
  ];
  return (
    <section className="relative py-32 border-b overflow-hidden" style={{borderColor:'var(--line)'}}>
      <div className="absolute inset-0 grid-bg opacity-40"/>
      <div className="nebula" style={{width:600, height:600, left:'-120px', bottom:'-200px', opacity:.22}} />
      <div className="relative max-w-[1440px] mx-auto px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-end">
          <div className="lg:col-span-7">
            <Eyebrow num="06" label="BEYOND CONNECTIVITY · SECONDARY USE-CASE" />
            <h2 className="display-x mt-6 leading-[.95] tracking-[-.045em]" style={{fontSize:'clamp(40px, 6.5vw, 88px)'}}>
              Also: an<br/>emergency EV charger.
            </h2>
            <p className="mt-8 max-w-[600px] text-[17px] leading-[1.65] text-zinc-400">
              The DLE 170 + high-output starter generator can deliver up to 10–12 kW on demand — Level 2 charging speeds in a 90-lb box. Stranded twenty miles from town? Plug in. Be moving in under an hour.
            </p>
            <div className="mt-10 flex flex-wrap gap-3">
              <a href="Sitepulse EV Backup.html" className="btn btn-cy">EXPLORE EV BACKUP <span>→</span></a>
              <a href="#config" className="btn btn-ghost">ADD THE KIT TO YOUR BUILD</a>
            </div>
          </div>

          <div className="lg:col-span-5">
            <div className="border" style={{borderColor:'var(--line-strong)'}}>
              <div className="grid grid-cols-3 gap-px" style={{background:'var(--line-strong)'}}>
                {stats.map(s => (
                  <div key={s.l} className="bg-black p-6">
                    <div className="display-x text-[36px] tracking-[-.04em] leading-none">{s.n}</div>
                    <div className="mt-3 mono text-[10px] uppercase tracking-[.16em] text-zinc-500">{s.l}</div>
                  </div>
                ))}
              </div>
              <div className="border-t p-6 flex items-center justify-between" style={{borderColor:'var(--line-strong)'}}>
                <div className="mono text-[11px] uppercase tracking-[.18em] text-zinc-400">EV-BACKUP KIT · ADD-ON</div>
                <div className="display text-[18px] tracking-[-.02em]">+$680</div>
              </div>
            </div>
            <div className="mt-4 mono text-[10px] uppercase tracking-[.18em] text-zinc-600">
              32 A PORTABLE EVSE · J1772 + NACS · GROUNDING ROD INCLUDED
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* =================== CONFIGURATOR =================== */
function Configurator(){
  const [tier, setTier] = useState("BASE");
  const [solar, setSolar] = useState(false);
  const [trailer, setTrailer] = useState(false);
  const [extra, setExtra] = useState(false);
  const [mount, setMount] = useState("CART");

  const tiers = {
    BASE: {price: 4990, label:"Sitepulse — Base", desc:"1.54 kWh LFP · Starlink Mini · DLE 170 hybrid"},
    PRO:  {price: 5790, label:"Sitepulse — Pro",  desc:"+ direct DC Starlink feed + redundant cellular failover + extended telemetry"},
  };
  const [evkit, setEvkit] = useState(false);
  const addons = [
    {id:"solar", label:"600 W folding solar array", price:880, on:solar, set:setSolar, desc:"Two 300 W bifacial panels + MPPT cabling — cuts engine duty further"},
    {id:"trailer", label:"Heated battery jacket", price:240, on:trailer, set:setTrailer, desc:"Active heaters for sub-zero starts down to −20 °C"},
    {id:"extra", label:"Extended fuel kit", price:1240, on:extra, set:setExtra, desc:"Larger external tank + dual quick-disconnect for months between fills"},
    {id:"evkit", label:"EV-Backup Kit", price:680, on:evkit, set:setEvkit, desc:"32 A portable Level 2 EVSE (J1772 + NACS adapter) + grounding rod — turns the unit into an emergency EV charger. Learn more →", link:"Sitepulse EV Backup.html"},
  ];
  const total = tiers[tier].price + (solar?880:0) + (trailer?240:0) + (extra?1240:0) + (evkit?680:0);

  return (
    <section id="config" className="relative py-32 border-b overflow-hidden" style={{borderColor:'var(--line)'}}>
      <div className="absolute inset-0 grid-bg opacity-50"/>
      <div className="nebula" style={{width:520, height:520, right:'-150px', top:'10%', opacity:.25}} />
      <div className="relative max-w-[1440px] mx-auto px-8">
        <Eyebrow num="07" label="BUILD & RESERVE" />
        <h2 className="display-x mt-6 leading-[.95] tracking-[-.045em]" style={{fontSize:'clamp(44px, 7vw, 96px)'}}>
          Configure yours.
        </h2>
        <p className="mt-8 max-w-[640px] text-[17px] leading-[1.65] text-zinc-400">
          Reserve with $499 today. Build slot locks in. Balance due before Q3 ship date. Refundable until 30 days before fulfillment.
        </p>

        <div className="mt-20 grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* options */}
          <div className="lg:col-span-7 space-y-12">
            {/* tier */}
            <div>
              <div className="mono text-[11px] tracking-[.18em] uppercase text-zinc-500">01 — Pick a tier</div>
              <div className="mt-5 space-y-3">
                {Object.entries(tiers).map(([k,v])=>(
                  <button key={k} onClick={()=>setTier(k)}
                    data-on={tier===k}
                    className="opt w-full text-left p-6 flex items-start justify-between"
                    aria-pressed={tier===k}>
                    <div>
                      <div className="display text-[22px] tracking-[-.02em]">{v.label}</div>
                      <div className="mt-2 text-[14px] text-zinc-400">{v.desc}</div>
                    </div>
                    <div className="text-right">
                      <div className="display text-[22px] tracking-[-.02em]">${v.price.toLocaleString()}</div>
                      <div className="mono text-[10px] tracking-[.18em] uppercase text-zinc-500 mt-1">{tier===k?"SELECTED":"SELECT"}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* addons */}
            <div>
              <div className="mono text-[11px] tracking-[.18em] uppercase text-zinc-500">02 — Add modules</div>
              <div className="mt-5 space-y-3">
                {addons.map(a=>(
                  <button key={a.id} onClick={()=>a.set(!a.on)}
                    data-on={a.on}
                    aria-pressed={a.on}
                    className="opt w-full text-left p-5 flex items-center justify-between gap-6">
                    <div className="flex items-center gap-5 min-w-0">
                      <div className="w-6 h-6 border flex-none flex items-center justify-center" style={{borderColor: a.on?'var(--hi)':'rgba(255,255,255,.2)', background: a.on?'var(--hi)':'transparent'}}>
                        {a.on && <span style={{color:'#000', fontSize:14}}>✓</span>}
                      </div>
                      <div className="min-w-0">
                        <div className="text-[16px] font-semibold">{a.label}</div>
                        <div className="mt-1 text-[13px] text-zinc-500">
                          {a.link ? (
                            <>
                              {a.desc.replace(' Learn more →','')} <a href={a.link} className="underline decoration-dotted underline-offset-4 text-[var(--hi)] hover:opacity-80" onClick={e=>e.stopPropagation()}>Learn more →</a>
                            </>
                          ) : a.desc}
                        </div>
                      </div>
                    </div>
                    <div className="display text-[20px] tracking-[-.02em] flex-none">+${a.price}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* mount */}
            <div>
              <div className="mono text-[11px] tracking-[.18em] uppercase text-zinc-500">03 — Mounting</div>
              <div className="mt-5 seg">
                {["CART","TRAILER","STATIONARY","PELICAN CASE"].map(o=>(
                  <button key={o} onClick={()=>setMount(o)} aria-pressed={mount===o}>{o}</button>
                ))}
              </div>
              <div className="mt-3 mono text-[11px] tracking-[.16em] text-zinc-500 uppercase">Selected: <span className="text-zinc-300">{mount}</span> — included with build</div>
            </div>
          </div>

          {/* summary */}
          <div className="lg:col-span-5">
            <div className="border p-8 sticky top-[88px] bg-black/60 backdrop-blur" style={{borderColor:'var(--line-strong)'}}>
              <div className="mono text-[11px] tracking-[.18em] uppercase text-zinc-500">YOUR BUILD</div>
              <h3 className="display mt-3 text-[26px] tracking-[-.025em]">{tiers[tier].label}</h3>
              <ul className="mt-6 space-y-3 text-[14px] text-zinc-400 mono">
                <li className="flex justify-between border-b pb-3" style={{borderColor:'var(--line)'}}><span>Base unit</span><span className="text-zinc-200">${tiers[tier].price.toLocaleString()}</span></li>
                {solar && <li className="flex justify-between border-b pb-3" style={{borderColor:'var(--line)'}}><span>Solar array (600 W)</span><span className="text-zinc-200">$880</span></li>}
                {trailer && <li className="flex justify-between border-b pb-3" style={{borderColor:'var(--line)'}}><span>Heated battery jacket</span><span className="text-zinc-200">$240</span></li>}
                {extra && <li className="flex justify-between border-b pb-3" style={{borderColor:'var(--line)'}}><span>Extended fuel kit</span><span className="text-zinc-200">$1,240</span></li>}
                <li className="flex justify-between border-b pb-3" style={{borderColor:'var(--line)'}}><span>Mount</span><span className="text-zinc-200">{mount}</span></li>
                <li className="flex justify-between"><span>Freight</span><span className="text-[var(--run)]">FREE</span></li>
              </ul>
              <div className="mt-8 pt-6 border-t" style={{borderColor:'var(--line-strong)'}}>
                <div className="flex items-end justify-between">
                  <div className="mono text-[11px] tracking-[.16em] uppercase text-zinc-500">Total</div>
                  <div className="display-x text-[44px] tracking-[-.04em] leading-none">${total.toLocaleString()}</div>
                </div>
                <div className="mt-3 flex items-end justify-between">
                  <div className="mono text-[11px] tracking-[.16em] uppercase text-zinc-500">Reserve today</div>
                  <div className="display text-[22px] tracking-[-.02em] text-[var(--hi)]">$499</div>
                </div>
              </div>

              <a href="#" className="btn btn-cy w-full justify-center mt-8">RESERVE THIS BUILD <span>→</span></a>
              <div className="mt-4 mono text-[10px] tracking-[.16em] text-zinc-500 uppercase text-center">Refundable · No build slot held without reservation</div>
            </div>
          </div>
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
      <div className="stars opacity-50"/>
      <div className="nebula" style={{width:900, height:900, left:'50%', top:'50%', transform:'translate(-50%,-50%)', opacity:.35}} />
      <div className="relative max-w-[1440px] mx-auto px-8 text-center">
        <div className="mono text-[12px] tracking-[.22em] uppercase text-[var(--hi)]">SHIPPING Q3 · V1 PROTOTYPE BUILDS</div>
        <h2 className="display-x mt-8 leading-[.92] tracking-[-.05em]" style={{fontSize:'clamp(56px, 11vw, 180px)'}}>
          Silent.<br/>Online.<br/>Unattended.
        </h2>
        <div className="mt-14 flex flex-wrap justify-center items-center gap-4">
          <a href="#config" className="btn btn-cy">RESERVE FROM $499 <span>→</span></a>
          <a href="#" className="btn btn-ghost">TALK TO AN ENGINEER</a>
        </div>
      </div>
    </section>
  );
}

/* =================== FOOTER =================== */
function Footer(){
  const cols = [
    ["Product",["The Unit","Specs","Configure","Compare","Reviews"]],
    ["Use Cases",["Remote Monitoring","Backcountry Research","Disaster Response","Oil & Gas","Off-Grid Sites"]],
    ["Support",["Owner's Manual","Field Service","Firmware","Warranty","Contact"]],
    ["Company",["Bozeman Plant","Careers","Press","Investors","Privacy"]],
  ];
  return (
    <footer id="support" className="py-24">
      <div className="max-w-[1440px] mx-auto px-8">
        <div className="flex flex-wrap items-end justify-between gap-12">
          <div className="max-w-[400px]">
            <div className="flex items-center">
              <span className="display text-[22px] tracking-[.04em] font-bold">SITEPULSE</span>
            </div>
            <p className="mt-6 text-[14px] leading-[1.6] text-zinc-400">Designed and assembled in Bozeman, Montana. A 90-lb true hybrid built for months of unattended remote operation — silent on battery, engine only when it has to.</p>
            <div className="mt-8 mono text-[10px] tracking-[.18em] uppercase text-zinc-500">
              <span className="pulse-dot mr-2"/> V1 prototype · reservations open
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-12 flex-1 max-w-[800px]">
            {cols.map(([t,l])=>(
              <div key={t}>
                <div className="mono text-[10px] tracking-[.18em] text-zinc-500 uppercase">{t}</div>
                <ul className="mt-5 space-y-3">
                  {l.map(x=><li key={x}><a href="#" className="text-[13px] text-zinc-300 hover:text-[var(--hi)] transition-colors">{x}</a></li>)}
                </ul>
              </div>
            ))}
          </div>
        </div>
        <div className="mt-20 pt-8 border-t flex flex-wrap items-center justify-between gap-4 mono text-[10px] tracking-[.18em] uppercase text-zinc-500" style={{borderColor:'var(--line)'}}>
          <div>© 2026 Sitepulse Power, Inc. · Bozeman, Montana</div>
          <div>External fuel · Cellular failover · OTA · IP65</div>
          <div>Made in USA · Patents pending</div>
        </div>
      </div>
    </footer>
  );
}

/* =================== TWEAKS =================== */
function Tweaks({tweaks, setTweak}){
  return (
    <TweaksPanel>
      <TweakSection title="Headline">
        <TweakSelect
          label="Variant"
          value={tweaks.headline}
          onChange={v=>setTweak('headline', v)}
          options={[
            {value:"connectivity", label:"Silent for days. Online forever."},
            {value:"always-on",    label:"Always online. Mostly silent."},
            {value:"remote-watch", label:"Set it. Forget it."},
          ]}
        />
      </TweakSection>
      <TweakSection title="Hero overlays">
        <TweakToggle label="HUD callouts" value={tweaks.showCallouts} onChange={v=>setTweak('showCallouts', v)} />
        <TweakToggle label="Starfield" value={tweaks.showStarfield} onChange={v=>setTweak('showStarfield', v)} />
        <TweakToggle label="Orbital rings" value={tweaks.showOrbit} onChange={v=>setTweak('showOrbit', v)} />
      </TweakSection>
      <TweakSection title="Accent color">
        <TweakRadio
          label="Tone"
          value={tweaks.accent}
          onChange={v=>setTweak('accent', v)}
          options={[
            {value:"#FFFFFF", label:"White"},
            {value:"#00D4FF", label:"Cyan"},
            {value:"#A78BFA", label:"Violet"},
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

  // apply accent
  useEffect(()=>{
    document.documentElement.style.setProperty('--hi', tweaks.accent);
  },[tweaks.accent]);

  return (
    <div data-screen-label="Sitepulse Landing">
      <Header />
      <Hero tweaks={tweaks} />
      <Marquee />
      <Pillars />
      <RunCycle />
      <UseCases />
      <Specs />
      <FieldReports />
      <EVTeaser />
      <Configurator />
      <FinalCTA />
      <Footer />
      <Tweaks tweaks={tweaks} setTweak={setTweak} />
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App/>);
