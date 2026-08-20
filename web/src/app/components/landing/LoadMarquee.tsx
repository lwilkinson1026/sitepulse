const LOAD_TYPES = [
  "DUST MONITORS",
  "RTK BASE STATIONS",
  "WATER QUALITY SONDES",
  "SCADA",
  "REPEATERS",
  "DRONE DOCKS",
  "SITE CAMERAS",
  "PLC CABINETS",
  "PRIVATE LTE",
  "WEATHER STATIONS",
];

export function LoadMarquee() {
  // Doubled so the -50% keyframe loops seamlessly.
  const row = [...LOAD_TYPES, ...LOAD_TYPES];
  return (
    <div className="marquee">
      <div className="marquee-inner">
        {row.map((item, i) => (
          <span key={i} className="flex items-center gap-12">
            {item}
            <span aria-hidden>·</span>
          </span>
        ))}
      </div>
    </div>
  );
}
