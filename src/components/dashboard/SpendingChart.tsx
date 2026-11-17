"use client";
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { useEffect, useState } from "react";
import { formatCurrency } from "@/utils/format";

type Month = { month: string; income: number; expenses: number; budget: number; savings: number };

const label = (m: string) =>
  new Date(`${m}-01T00:00:00Z`).toLocaleDateString("en-IN", { month: "short", year: "numeric", timeZone: "UTC" });
const compact = (n: number) => (n >= 1000 ? `₹${+(n / 1000).toFixed(1)}k` : `₹${n}`);

export function SpendingChart() {
  const [data, setData] = useState<Month[]>([]);
  useEffect(() => {
    fetch("/api/reports", { cache: "no-store" })
      .then((r) => r.json())
      .then((body) =>
        setData((body.data?.chart || []).map((m: Month) => ({ ...m, name: label(m.month) }))),
      )
      .catch(() => {});
  }, []);

  return (
    <div className="rounded-2xl border border-line bg-white p-5 sm:p-6">
      <p className="font-display text-[15px] font-bold text-ink">Money overview</p>
      <p className="mt-1 text-[11px] text-muted">
        Each month: what you earned, spent, planned to spend (budget) and left over (income − expenses).
      </p>
      {data.length ? (
        <div className="mt-6 h-[240px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 5, right: 5, left: 0, bottom: 0 }} barGap={6}>
              <CartesianGrid vertical={false} stroke="#edf1ef" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: "#7c8984", fontSize: 11 }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fill: "#7c8984", fontSize: 11 }} tickFormatter={compact} width={50} />
              <Tooltip
                cursor={{ fill: "#f3f7f5" }}
                formatter={(v) => formatCurrency(Number(v))}
                contentStyle={{ border: "1px solid #e8eeeb", borderRadius: 10, fontSize: 12 }}
              />
              <Legend iconType="circle" wrapperStyle={{ fontSize: 12, paddingTop: 8 }} />
              <Bar dataKey="income" name="Income" fill="#059669" radius={[6, 6, 0, 0]} maxBarSize={48} />
              <Bar dataKey="expenses" name="Expenses" fill="#c75d48" radius={[6, 6, 0, 0]} maxBarSize={48} />
              <Bar dataKey="budget" name="Budget" fill="#a7b4ae" radius={[6, 6, 0, 0]} maxBarSize={48} />
              <Bar dataKey="savings" name="Left over" fill="#064e3b" radius={[6, 6, 0, 0]} maxBarSize={48} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <p className="mt-10 pb-10 text-center text-sm text-muted">Add income or expenses to see your chart.</p>
      )}
    </div>
  );
}
