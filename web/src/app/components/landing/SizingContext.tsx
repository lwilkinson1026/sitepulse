"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  computeSitePower,
  DEFAULT_LOADS,
  LOAD_CATALOG,
  type CustomLoad,
  type LoadState,
  type Season,
  type SitePowerResult,
} from "@/lib/site-power";

/**
 * The calculator and the reserve form are separated by four static sections,
 * so the sizing state lives in a context rather than in a common ancestor
 * component. That keeps every section between them a server component.
 */
type SizingValue = {
  loads: Record<string, LoadState>;
  customLoads: CustomLoad[];
  season: Season;
  zip: string;
  tank: number;
  visitDays: number;
  result: SitePowerResult;
  toggleLoad: (id: string) => void;
  setQty: (id: string, delta: number) => void;
  setHoursFor: (id: string, hours: number) => void;
  addCustomLoad: (name: string, watts: number, hours: number) => boolean;
  setSeason: (s: Season) => void;
  setZip: (z: string) => void;
  setTank: (gal: number) => void;
  setVisitDays: (days: number) => void;
};

const SizingCtx = createContext<SizingValue | null>(null);

export function SizingProvider({ children }: { children: ReactNode }) {
  const [loads, setLoads] = useState<Record<string, LoadState>>(DEFAULT_LOADS);
  const [customLoads, setCustomLoads] = useState<CustomLoad[]>([]);
  const [season, setSeason] = useState<Season>("winter");
  const [zip, setZip] = useState("");
  const [tank, setTank] = useState(15);
  const [visitDays, setVisitDays] = useState(14);

  const toggleLoad = useCallback((id: string) => {
    setLoads((prev) => {
      const cur = prev[id] ?? { on: false, qty: 1, hoursPerDay: 24 };
      const catalog = LOAD_CATALOG.find((l) => l.id === id);
      const hoursPerDay = cur.hoursPerDay || catalog?.defaultHours || 24;
      return {
        ...prev,
        [id]: { on: !cur.on, qty: cur.qty || 1, hoursPerDay },
      };
    });
  }, []);

  const setQty = useCallback((id: string, delta: number) => {
    setLoads((prev) => {
      const cur = prev[id] ?? { on: false, qty: 0, hoursPerDay: 24 };
      const qty = Math.max(0, (cur.qty || 0) + delta);
      return { ...prev, [id]: { ...cur, qty, on: qty > 0 ? true : cur.on } };
    });
  }, []);

  const setHoursFor = useCallback((id: string, hours: number) => {
    setLoads((prev) => {
      const cur = prev[id] ?? { on: true, qty: 1, hoursPerDay: hours };
      return { ...prev, [id]: { ...cur, hoursPerDay: hours } };
    });
  }, []);

  const addCustomLoad = useCallback(
    (name: string, watts: number, hours: number) => {
      if (!Number.isFinite(watts) || watts <= 0) return false;
      setCustomLoads((prev) => [
        ...prev,
        {
          id: `c${prev.length}-${name || "custom"}`,
          name: name.trim() || `Custom ${prev.length + 1}`,
          w: watts,
          hoursPerDay: Math.min(24, Number.isFinite(hours) && hours > 0 ? hours : 24),
          qty: 1,
        },
      ]);
      return true;
    },
    [],
  );

  const result = useMemo(
    () => computeSitePower({ loads, customLoads, season, tank }),
    [loads, customLoads, season, tank],
  );

  const value = useMemo<SizingValue>(
    () => ({
      loads,
      customLoads,
      season,
      zip,
      tank,
      visitDays,
      result,
      toggleLoad,
      setQty,
      setHoursFor,
      addCustomLoad,
      setSeason,
      setZip,
      setTank,
      setVisitDays,
    }),
    [
      loads,
      customLoads,
      season,
      zip,
      tank,
      visitDays,
      result,
      toggleLoad,
      setQty,
      setHoursFor,
      addCustomLoad,
    ],
  );

  return <SizingCtx.Provider value={value}>{children}</SizingCtx.Provider>;
}

export function useSizing(): SizingValue {
  const ctx = useContext(SizingCtx);
  if (!ctx) throw new Error("useSizing must be used inside <SizingProvider>");
  return ctx;
}
