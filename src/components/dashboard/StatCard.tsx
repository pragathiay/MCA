import { ArrowDownLeft, ArrowUpRight, Landmark, WalletCards } from "lucide-react";
import { formatCurrency } from "@/utils/format";

export function StatCard({ label, value, change, note, kind }: { label: string; value: number; change: number | null; note?: string; kind: "balance" | "income" | "expense" | "savings" }) {
  const Icon = { balance: WalletCards, income: ArrowDownLeft, expense: ArrowUpRight, savings: Landmark }[kind];
  const positive = kind === "income" || kind === "savings";
  const gradient = positive ? "income-gradient text-white" : "bg-white";
  return <div className={`rounded-2xl border border-white/50 p-5 shadow-[0_5px_22px_rgba(31,67,48,.07)] ${gradient}`}><div className="flex items-start justify-between"><p className={`text-[12px] font-semibold ${positive ? "text-white/75" : "text-muted"}`}>{label}</p><div className={`grid size-8 place-items-center rounded-lg ${kind === "balance" ? "bg-[#e8f3ff] text-[#5c94ca]" : positive ? "bg-white/20 text-white" : "bg-[#fff0ec] text-[#df816d]"}`}><Icon size={16} /></div></div><p className={`mt-4 font-display text-[24px] font-extrabold tracking-[-.04em] ${positive ? "text-white" : "text-ink"}`}>{formatCurrency(value)}</p><p className={`mt-2 text-[11px] font-semibold ${positive ? "text-white/70" : "text-muted"}`}>{change === null ? (note ?? "This month so far") : <><span className={change === 0 ? "" : (kind === "expense" ? change > 0 : change < 0) ? (positive ? "text-white" : "text-[#df816d]") : (positive ? "text-white" : "text-forest")}>{change > 0 ? "▲ +" : change < 0 ? "▼ " : ""}{change}%</span> vs last month</>}</p></div>;
}
