import { ArrowLeft, Construction } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
const names: Record<string, string> = {
  "/income": "Income",
  "/expenses": "Expenses",
  "/budgets": "Budgets",
  "/categories": "Categories",
  "/reports": "Reports",
  "/savings-goals": "Savings Goals",
  "/profile": "Profile",
};
export function PlaceholderPage() {
  const { pathname } = useLocation();
  const name = names[pathname] ?? "Page";
  return (
    <div className="mx-auto grid min-h-[calc(100vh-76px)] max-w-4xl place-items-center p-6">
      <div className="max-w-md text-center">
        <div className="mx-auto grid size-16 place-items-center rounded-2xl bg-mint text-forest">
          <Construction size={28} />
        </div>
        <h1 className="mt-6 font-display text-2xl font-extrabold text-ink">
          {name}
        </h1>
        <p className="mt-3 text-sm leading-6 text-muted">
          This workspace is ready for your {name.toLowerCase()} data. Connect
          the backend API here when you’re ready to make this section fully
          interactive.
        </p>
        <Link
          to="/"
          className="mt-6 inline-flex items-center gap-2 rounded-xl bg-forest px-4 py-2.5 text-xs font-bold text-white"
        >
          <ArrowLeft size={14} />
          Back to overview
        </Link>
      </div>
    </div>
  );
}
