import { ArrowUpRight, CalendarDays, Plus } from "lucide-react";
import { Link } from "react-router-dom";
import { StatCard } from "../components/dashboard/StatCard";
import { SpendingChart } from "../components/dashboard/SpendingChart";
import { RecentTransactions } from "../components/dashboard/RecentTransactions";
import { Badge } from "../components/ui/Badge";

const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
};

const getDateLabel = () =>
  new Intl.DateTimeFormat("en-IN", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(new Date());

export function Dashboard() {
  return (
    <div className="mx-auto max-w-[1440px] p-5 sm:p-8">
      <div className="p-0 text-ink">
        <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <div>
            <p className="text-[12px] font-semibold text-muted">
              {getDateLabel()}
            </p>
            <h1 className="mt-1 font-display text-[26px] font-extrabold tracking-[-.04em] text-ink">
              {getGreeting()}, Pragathi <span aria-label="wave">👋</span>
            </h1>
            <p className="mt-2 text-[13px] text-muted">
              Here’s what’s happening with your money today.
            </p>
          </div>
          <div className="flex gap-2">
            <button className="inline-flex items-center gap-2 rounded-xl border border-line bg-white px-3.5 py-2.5 text-[12px] font-bold text-muted shadow-sm">
              <CalendarDays size={15} />
              May 2024
            </button>
            <Link
              to="/expenses"
              className="inline-flex items-center gap-2 rounded-xl bg-forest px-3.5 py-2.5 text-[12px] font-bold text-white shadow-[0_5px_14px_rgba(36,107,74,.18)]"
            >
              <Plus size={15} />
              Add transaction
            </Link>
          </div>
        </div>
      </div>
      <div className="mt-7 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Total balance"
          value={12480.5}
          change="+8.2%"
          kind="balance"
        />
        <StatCard
          label="Total income"
          value={6850}
          change="+12.5%"
          kind="income"
        />
        <StatCard
          label="Total expenses"
          value={3240.75}
          change="-4.8%"
          kind="expense"
        />
        <StatCard
          label="Total savings"
          value={3609.25}
          change="+18.3%"
          kind="savings"
        />
      </div>
      <div className="mt-5 grid gap-5 xl:grid-cols-[1.45fr_1fr]">
        <SpendingChart />
        <div className="income-gradient rounded-2xl border border-white/15 p-5 text-white shadow-[0_8px_24px_rgba(6,95,70,.15)] sm:p-6">
          <div>
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[12px] font-semibold text-white/75">
                  Monthly budget
                </p>
                <p className="mt-2 font-display text-[27px] font-extrabold">
                  ₹2,100{" "}
                  <span className="text-[13px] font-semibold text-white/65">
                    / ₹3,000
                  </span>
                </p>
              </div>
              <Badge tone="green">70% used</Badge>
            </div>
            <div className="mt-6 h-2 rounded-full bg-white/20">
              <div className="h-full w-[70%] rounded-full bg-[#b5edc9]" />
            </div>
            <div className="mt-3 flex justify-between text-[11px] text-white/70">
              <span>₹900 remaining</span>
              <span>12 days left</span>
            </div>
            <Link
              to="/budgets"
              className="mt-6 inline-flex items-center gap-1 text-[12px] font-bold text-white hover:underline"
            >
              Manage budget <ArrowUpRight size={14} />
            </Link>
          </div>

          <div className="my-6 border-t border-white/20" />

          <div className="flex items-start justify-between">
            <div>
              <p className="font-display text-[15px] font-bold text-white">
                Savings goal
              </p>
              <p className="mt-1 text-[11px] text-white/70">Emergency fund</p>
            </div>
            <span className="grid size-9 place-items-center rounded-full bg-white/15 text-base">
              🏖️
            </span>
          </div>
          <p className="mt-5 font-display text-[23px] font-extrabold text-white">
            ₹3,240{" "}
            <span className="text-[12px] font-semibold text-white/70">
              of ₹5,000
            </span>
          </p>
          <div className="mt-4 h-2 rounded-full bg-white/20">
            <div className="h-full w-[65%] rounded-full bg-[#b5edc9]" />
          </div>
          <div className="mt-3 flex justify-between text-[11px] font-semibold text-white/70">
            <span>65% complete</span>
            <span>₹1,760 to go</span>
          </div>
          <Link
            to="/savings-goals"
            className="mt-6 inline-flex items-center text-[12px] font-bold text-white hover:underline"
          >
            View savings goals <ArrowUpRight size={14} className="ml-1" />
          </Link>
        </div>
      </div>
      <div className="mt-5">
        <RecentTransactions />
      </div>
    </div>
  );
}
