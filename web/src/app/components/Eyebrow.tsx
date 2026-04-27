export function Eyebrow({ num, label }: { num: string; label: string }) {
  return (
    <div className="flex items-center gap-4 mono text-[11px] uppercase tracking-[.22em]">
      <span className="text-[var(--hi)]">[ {num} ]</span>
      <span className="h-px flex-none w-12 bg-[var(--line-strong)]" />
      <span className="text-zinc-500">{label}</span>
    </div>
  );
}
