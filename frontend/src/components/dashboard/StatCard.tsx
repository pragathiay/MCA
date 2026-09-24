import {
  ArrowDownLeft,
  ArrowUpRight,
  Landmark,
  WalletCards,
} from "lucide-react";
import { formatCurrency } from "../../utils/format";
export function StatCard({
  label,
  value,
  change,
  kind,
}: {
  label: string;
  value: number;
  change: string;
  kind: "balance" | "income" | "expense" | "savings";
}) {
  const Icon = {
    balance: WalletCards,
    income: ArrowDownLeft,
    expense: ArrowUpRight,
    savings: Landmark,
  }[kind];
  const positive = kind === "income" || kind === "savings";
  const gradient = kind === "income" || kind === "savings" ? "income-gradient text-white" : "bg-white";
  return (
    <div className={`rounded-2xl border border-white/50 p-5 shadow-[0_5px_22px_rgba(31,67,48,.07)] ${gradient}`}>
      <div className="flex items-start justify-between">
        <p className={`text-[12px] font-semibold ${positive ? "text-white/75" : "text-muted"}`}>{label}</p>
        <div
          className={`grid size-8 place-items-center rounded-lg ${kind === "balance" ? "bg-[#e8f3ff] text-[#5c94ca]" : kind === "income" || kind === "savings" ? "bg-white/20 text-white" : "bg-[#fff0ec] text-[#df816d]"}`}
        >
          <Icon size={16} />
        </div>
      </div>
      <p className={`mt-4 font-display text-[24px] font-extrabold tracking-[-.04em] ${positive ? "text-white" : "text-ink"}`}>
        {formatCurrency(value)}
      </p>
      <p className="mt-2 text-[11px] font-semibold">
        <span className={positive ? "text-white" : "text-[#df816d]"}>
          {change}
        </span>{" "}
        <span className={positive ? "text-white/65" : "text-muted"}>vs last month</span>
      </p>
    </div>
  );
}
