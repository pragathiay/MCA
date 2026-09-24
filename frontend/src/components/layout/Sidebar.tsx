import {
  BarChart3,
  CircleDollarSign,
  FileChartColumn,
  Goal,
  LayoutDashboard,
  LogOut,
  ReceiptText,
  Settings2,
  Tags,
  UserRound,
  X,
} from "lucide-react";
import { NavLink } from "react-router-dom";
import type { IconName, NavItem } from "../../types";
import { Logo } from "../ui/Logo";
const icons: Record<IconName, React.ElementType> = {
  dashboard: LayoutDashboard,
  income: CircleDollarSign,
  expenses: ReceiptText,
  budgets: BarChart3,
  categories: Tags,
  reports: FileChartColumn,
  goals: Goal,
  profile: UserRound,
};
const primary: NavItem[] = [
  { label: "Overview", path: "/dashboard", icon: "dashboard" },
  { label: "Income", path: "/income", icon: "income" },
  { label: "Expenses", path: "/expenses", icon: "expenses" },
  { label: "Budgets", path: "/budgets", icon: "budgets" },
  { label: "Categories", path: "/categories", icon: "categories" },
  { label: "Reports", path: "/reports", icon: "reports" },
  { label: "Savings goals", path: "/savings-goals", icon: "goals" },
];
export function Sidebar({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  return (
    <>
      <div
        className={`fixed inset-0 z-30 bg-ink/20 backdrop-blur-[2px] transition-opacity lg:hidden ${open ? "opacity-100" : "pointer-events-none opacity-0"}`}
        onClick={onClose}
      />
      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-[248px] flex-col border-r border-line bg-white px-5 py-6 transition-transform duration-300 lg:static lg:translate-x-0 ${open ? "translate-x-0" : "-translate-x-full"}`}
      >
        <div className="flex items-center justify-between">
          <Logo />
          <button
            className="rounded-lg p-1 text-muted lg:hidden"
            onClick={onClose}
            aria-label="Close navigation"
          >
            <X size={20} />
          </button>
        </div>
        <nav className="mt-10 flex-1">
          <p className="mb-3 px-3 text-[10px] font-bold uppercase tracking-[.16em] text-[#a1ada7]">
            Workspace
          </p>
          <div className="space-y-1">
            {primary.map((item) => {
              const Icon = icons[item.icon];
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  end={item.path === "/"}
                  onClick={onClose}
                  className={({ isActive }) =>
                    `group flex items-center gap-3 rounded-xl px-3 py-2.5 text-[13px] font-semibold transition-colors ${isActive ? "bg-mint text-forest" : "text-muted hover:bg-paper hover:text-ink"}`
                  }
                >
                  <Icon size={18} strokeWidth={1.9} />
                  {item.label}
                </NavLink>
              );
            })}
          </div>
        </nav>
        <div className="space-y-1 border-t border-line pt-4">
          <NavLink
            to="/profile"
            className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-[13px] font-semibold text-muted hover:bg-paper hover:text-ink"
          >
            <UserRound size={18} />
            Profile
          </NavLink>
          <button className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-[13px] font-semibold text-muted hover:bg-paper hover:text-ink">
            <Settings2 size={18} />
            Settings
          </button>
          <button className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-[13px] font-semibold text-muted hover:bg-paper hover:text-ink">
            <LogOut size={18} />
            Log out
          </button>
        </div>
      </aside>
    </>
  );
}
