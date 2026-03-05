"use client";

import { memo, useMemo, useState } from "react";
import { ComposableMap, Geographies, Geography } from "react-simple-maps";
import Flag from "react-world-flags";
import countries from "world-countries";
import { cn } from "@/utils";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Input } from "@/components/ui/input";

type WorldGeoPickerProps = {
  /** Stored as numeric ISO country codes (ccn3), e.g. "356" for India. */
  value: string[];
  onChange: (next: string[]) => void;
};

const geoUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

type CountryMeta = {
  name: string;
  code2: string;
  code3: string;
  numeric: string | null;
};

const COUNTRY_LIST: CountryMeta[] = countries.map((c) => ({
  name: c.name.common,
  code2: c.cca2,
  code3: c.cca3,
  numeric: c.ccn3 || null,
}));

const NUMERIC_LOOKUP: Record<string, CountryMeta> = COUNTRY_LIST.reduce((acc, c) => {
  if (c.numeric) acc[c.numeric] = c;
  return acc;
}, {} as Record<string, CountryMeta>);

function toggleInList(list: string[], code: string): string[] {
  return list.includes(code) ? list.filter((c) => c !== code) : [...list, code];
}

function normalizeNumeric(raw: unknown): string | null {
  if (!raw) return null;
  const s = String(raw).trim();
  if (!s) return null;
  // world-countries uses zero-padded 3-digit strings for ccn3
  const n = Number.parseInt(s, 10);
  if (!Number.isFinite(n)) return null;
  return n.toString().padStart(3, "0");
}

function WorldGeoPickerInner({ value, onChange }: WorldGeoPickerProps) {
  const [query, setQuery] = useState("");

  const selectedCountries = useMemo(
    () =>
      value
        .map((code) => NUMERIC_LOOKUP[code])
        .filter(Boolean) as CountryMeta[],
    [value]
  );

  const availableCountries = useMemo(() => {
    const base = COUNTRY_LIST.filter((c) => c.numeric && !value.includes(c.numeric));
    if (!query.trim()) return base;
    const q = query.trim().toLowerCase();
    return base.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.code2.toLowerCase().includes(q) ||
        c.code3.toLowerCase().includes(q)
    );
  }, [value, query]);

  return (
    <div className="relative overflow-hidden rounded-2xl border border-slate-800/80 bg-gradient-to-br from-slate-950 via-slate-900/80 to-slate-950">
      <div className="pointer-events-none absolute inset-0 opacity-70">
        <div className="absolute -left-40 -top-40 h-80 w-80 rounded-full bg-cyan-500/15 blur-3xl" />
        <div className="absolute -right-32 bottom-0 h-72 w-72 rounded-full bg-indigo-500/20 blur-3xl" />
      </div>
      <div className="relative z-10 flex flex-col gap-4 p-4 md:p-5 lg:p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex min-w-0 flex-col gap-1">
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-sky-300/80">
              Geographies
            </p>
            <p className="text-xs text-slate-300/90">
              Tap on the globe or pick from the dropdown to select the countries where you operate.
            </p>
          </div>
          <Popover>
            <PopoverTrigger asChild>
              <button
                type="button"
                className="inline-flex items-center gap-1 rounded-full border border-sky-500/40 bg-slate-900/40 px-3 py-1.5 text-[11px] font-medium text-slate-100 shadow-[0_0_0_1px_rgba(8,47,73,0.6)] backdrop-blur-md hover:border-sky-400/60 hover:bg-slate-900/60"
              >
                <span className="h-1.5 w-1.5 rounded-full bg-sky-400" />
                Add country
              </button>
            </PopoverTrigger>
            <PopoverContent className="max-h-80 w-72 overflow-y-auto border-slate-700 bg-slate-950/95 text-xs text-slate-100 backdrop-blur-xl">
              <div className="mb-2 space-y-1">
                <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-slate-500">
                  All countries
                </p>
                <Input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search by name or code"
                  className="h-8 border-slate-700 bg-slate-900/80 px-2 text-[11px] placeholder:text-slate-500"
                />
              </div>
              <div className="space-y-1">
                {availableCountries.map((c) => (
                  <button
                    key={c.numeric ?? c.code3}
                    type="button"
                    onClick={() => c.numeric && onChange(toggleInList(value, c.numeric))}
                    className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left hover:bg-slate-900"
                  >
                    <span className="flex-1 truncate text-[11px]">{c.name}</span>
                    <span className="text-[10px] text-slate-400">{c.code3}</span>
                  </button>
                ))}
              </div>
            </PopoverContent>
          </Popover>
        </div>

        <div className="mt-1 h-[260px] w-full rounded-xl border border-slate-800/80 bg-slate-950/50 p-2 md:h-[300px]">
          <ComposableMap projectionConfig={{ scale: 165 }} className="h-full w-full">
            <Geographies geography={geoUrl}>
              {({ geographies }) =>
                geographies.map((geo) => {
                  const g: any = geo;
                  const props = g.properties || {};
                  const numeric = normalizeNumeric(
                    props.ISO_N3 || props.ISO_NUM || props.UN_A3 || props.ISO_A3 || g.id
                  );
                  if (!numeric) return null;
                  const selected = value.includes(numeric);
                  return (
                    <Geography
                      key={g.rsmKey}
                      geography={geo}
                      onClick={() => onChange(toggleInList(value, numeric))}
                      style={{
                        default: {
                          fill: selected ? "#22c55e" : "#020617",
                          stroke: "#020617",
                          strokeWidth: 0.35,
                          outline: "none",
                        },
                        hover: {
                          fill: "#22c55e",
                          stroke: "#020617",
                          strokeWidth: 0.35,
                          outline: "none",
                        },
                        pressed: {
                          fill: "#16a34a",
                          stroke: "#020617",
                          strokeWidth: 0.4,
                          outline: "none",
                        },
                      }}
                    />
                  );
                })
              }
            </Geographies>
          </ComposableMap>
        </div>

        <div className="mt-2 flex flex-col gap-2">
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-slate-400">
            Selected regions
          </p>
          {value.length === 0 ? (
            <p className="text-xs text-slate-400/80">
              Use the globe or dropdown above to add your operating geographies. Each selection appears
              as a compact token with its flag and 3-letter code.
            </p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {selectedCountries.map((c) => {
                const numeric = c.numeric as string;
                return (
                  <button
                    key={numeric}
                    type="button"
                    onClick={() => onChange(toggleInList(value, numeric))}
                    className={cn(
                      "group inline-flex items-center gap-1.5 rounded-2xl px-1.5 py-1 text-[11px] font-medium text-emerald-100 transition-colors",
                      "hover:bg-emerald-500/10"
                    )}
                  >
                    <div className="flex flex-col items-center gap-0.5 rounded-[6px] bg-emerald-500/15 p-[2px]">
                      {c.code2 && (
                        <Flag
                          code={c.code2}
                          height="10"
                          className="rounded-[3px] shadow-sm"
                        />
                      )}
                      <span className="leading-none text-[10px]">{c.code3}</span>
                    </div>
                    <span className="text-emerald-300/70 group-hover:text-emerald-200">x</span>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export const WorldGeoPicker = memo(WorldGeoPickerInner);

