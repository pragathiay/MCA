"use client";
import { useCallback, useEffect, useState } from "react";
import { formatCurrency } from "@/utils/format";

type Month = { month: string; income: number; expenses: number };

const monthName = (m: string) =>
  new Date(`${m}-01T00:00:00Z`).toLocaleDateString("en-IN", {
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });

export default function ReportsPage() {
  const year = new Date().getFullYear();
  const [from, setFrom] = useState(`${year}-01-01`);
  const [to, setTo] = useState(`${year}-12-31`);
  const [monthly, setMonthly] = useState<Month[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    try {
      const r = await fetch(`/api/reports?from=${from}&to=${to}`, { cache: "no-store" });
      const b = await r.json();
      if (!r.ok) throw new Error(b.message || "Unable to load reports.");
      setMonthly(b.data?.monthly || []);
      setError("");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unable to load reports.");
    } finally {
      setLoading(false);
    }
  }, [from, to]);

  // Reload on filter change, and whenever the tab regains focus so new entries show up.
  useEffect(() => {
    void load();
    const refresh = () => document.visibilityState === "visible" && void load();
    document.addEventListener("visibilitychange", refresh);
    window.addEventListener("focus", refresh);
    return () => {
      document.removeEventListener("visibilitychange", refresh);
      window.removeEventListener("focus", refresh);
    };
  }, [load]);

  const income = monthly.reduce((s, m) => s + m.income, 0);
  const expenses = monthly.reduce((s, m) => s + m.expenses, 0);
  const net = income - expenses;

  const input =
    "mt-1 h-10 rounded-xl border border-line bg-white px-3 text-sm font-normal text-ink outline-none focus:border-forest focus:ring-2 focus:ring-mint";

  return (
    <div className="mx-auto max-w-[1000px] p-5 sm:p-8">
      <p className="text-xs font-semibold text-muted">Insights</p>
      <div className="mt-1 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-extrabold text-ink">Reports</h1>
          <p className="mt-2 text-sm text-muted">
            A summary of the income and expenses you have added, grouped by month.
          </p>
        </div>
        <div className="flex gap-3 text-xs font-bold text-ink">
          <label>
            From
            <input type="date" value={from} onChange={(e) => setFrom(e.target.value)} className={`${input} block`} />
          </label>
          <label>
            To
            <input type="date" value={to} onChange={(e) => setTo(e.target.value)} className={`${input} block`} />
          </label>
          <button onClick={() => void load()} className="h-10 self-end rounded-xl bg-forest px-4 text-xs font-bold text-white">
            Refresh
          </button>
        </div>
      </div>

      {error && <p className="mt-4 text-sm text-[#c75d48]">{error}</p>}

      <div className="mt-6 grid gap-3 sm:grid-cols-3">
        <Card label="Total income" value={formatCurrency(income)} color="#059669" tint="#e7f8ef" />
        <Card label="Total expenses" value={formatCurrency(expenses)} color="#c75d48" tint="#fdeeea" />
        <Card
          label={net >= 0 ? "Saved (income − expenses)" : "Overspent (income − expenses)"}
          value={formatCurrency(Math.abs(net))}
          color={net >= 0 ? "#059669" : "#c75d48"}
          tint={net >= 0 ? "#e7f8ef" : "#fdeeea"}
        />
      </div>

      <h2 className="mt-8 text-sm font-extrabold text-ink">Month by month</h2>
      <div className="mt-3 overflow-x-auto rounded-2xl border border-line bg-white">
        {monthly.length ? (
          <table className="w-full min-w-[520px] text-left text-sm">
            <thead>
              <tr className="border-b border-line bg-paper text-[11px] font-bold uppercase tracking-wide text-muted">
                <th className="px-4 py-3">Month</th>
                <th className="px-4 py-3 text-right">Income</th>
                <th className="px-4 py-3 text-right">Expenses</th>
                <th className="px-4 py-3 text-right">Balance</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {monthly.map((m) => {
                const bal = m.income - m.expenses;
                return (
                  <tr key={m.month}>
                    <td className="px-4 py-3.5 font-bold text-ink">{monthName(m.month)}</td>
                    <td className="px-4 py-3.5 text-right font-bold text-[#059669]">+{formatCurrency(m.income)}</td>
                    <td className="px-4 py-3.5 text-right font-bold text-[#c75d48]">−{formatCurrency(m.expenses)}</td>
                    <td className="px-4 py-3.5 text-right font-bold" style={{ color: bal >= 0 ? "#059669" : "#c75d48" }}>
                      {bal < 0 ? "−" : ""}
                      {formatCurrency(Math.abs(bal))}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        ) : (
          <p className="p-8 text-center text-sm text-muted">
            {loading ? "Loading…" : "No income or expenses in this date range."}
          </p>
        )}
      </div>
    </div>
  );
}

function Card({ label, value, color, tint }: { label: string; value: string; color: string; tint: string }) {
  return (
    <div className="rounded-2xl px-5 py-4" style={{ background: tint }}>
      <p className="text-xs font-semibold text-muted">{label}</p>
      <p className="mt-1 text-xl font-extrabold" style={{ color }}>{value}</p>
    </div>
  );
}
