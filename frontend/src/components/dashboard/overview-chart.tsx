"use client";

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts";

const data = [
  { name: "Jan", total: 3200 },
  { name: "Feb", total: 2800 },
  { name: "Mar", total: 3800 },
  { name: "Apr", total: 5100 },
  { name: "May", total: 4600 },
  { name: "Jun", total: 6200 },
  { name: "Jul", total: 5800 },
  { name: "Aug", total: 4300 },
  { name: "Sep", total: 5600 },
  { name: "Oct", total: 3900 },
  { name: "Nov", total: 4100 },
  { name: "Dec", total: 6100 },
];

function CustomTooltip({ active, payload, label }: { active?: boolean; payload?: { value: number }[]; label?: string }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border border-white/[0.08] bg-black/80 px-3 py-2 backdrop-blur-sm">
      <p className="text-[11px] text-white/40 mb-0.5">{label}</p>
      <p className="text-sm font-semibold text-white">{payload[0].value.toLocaleString()} XLM</p>
    </div>
  );
}

export function OverviewChart() {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data} barSize={18}>
        <XAxis
          dataKey="name"
          tick={{ fill: "rgba(255,255,255,0.25)", fontSize: 11 }}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          tick={{ fill: "rgba(255,255,255,0.25)", fontSize: 11 }}
          tickLine={false}
          axisLine={false}
          tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`}
          width={32}
        />
        <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(255,255,255,0.03)" }} />
        <Bar dataKey="total" fill="rgba(139, 92, 246, 0.7)" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
