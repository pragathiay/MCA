import { ArrowDownLeft, Coffee, ShoppingBag, Smartphone } from "lucide-react";
import { formatCurrency } from "../../utils/format";
import type { Transaction } from "../../types";
const transactions: Transaction[] = [
  {
    id: 1,
    merchant: "Whole Foods Market",
    category: "Groceries",
    date: "Today, 10:42 AM",
    amount: 86.24,
    type: "expense",
    icon: "shopping",
    color: "#e9f4ff",
  },
  {
    id: 2,
    merchant: "Acme Corporation",
    category: "Salary",
    date: "Yesterday, 9:00 AM",
    amount: 3850,
    type: "income",
    icon: "income",
    color: "#e3f8ea",
  },
  {
    id: 3,
    merchant: "The Daily Grind",
    category: "Food & Dining",
    date: "May 24, 8:15 AM",
    amount: 5.75,
    type: "expense",
    icon: "coffee",
    color: "#fff2df",
  },
  {
    id: 4,
    merchant: "Uber",
    category: "Transport",
    date: "May 23, 6:30 PM",
    amount: 24.5,
    type: "expense",
    icon: "phone",
    color: "#f1edff",
  },
];
const transactionIcons = {
  shopping: ShoppingBag,
  income: ArrowDownLeft,
  coffee: Coffee,
  phone: Smartphone,
};
export function RecentTransactions() {
  return (
    <div className="rounded-2xl border border-line bg-white p-5 sm:p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="font-display text-[15px] font-bold text-ink">
            Recent transactions
          </p>
          <p className="mt-1 text-[11px] text-muted">
            Keep an eye on your latest activity
          </p>
        </div>
        <button className="text-[11px] font-bold text-forest hover:underline">
          View all
        </button>
      </div>
      <div className="mt-5 divide-y divide-line">
        {transactions.map((transaction) => {
          const Icon =
            transactionIcons[transaction.icon as keyof typeof transactionIcons];
          return (
            <div
              className="flex items-center justify-between gap-3 py-3 first:pt-0 last:pb-0"
              key={transaction.id}
            >
              <div className="flex min-w-0 items-center gap-3">
                <div
                  className="grid size-9 shrink-0 place-items-center rounded-xl"
                  style={{ backgroundColor: transaction.color }}
                >
                  <Icon size={16} className="text-ink/65" />
                </div>
                <div className="min-w-0">
                  <p className="truncate text-[12px] font-bold text-ink">
                    {transaction.merchant}
                  </p>
                  <p className="mt-0.5 text-[10px] text-muted">
                    {transaction.category} · {transaction.date}
                  </p>
                </div>
              </div>
              <p
                className={`whitespace-nowrap text-[12px] font-bold ${transaction.type === "income" ? "text-[#46a66f]" : "text-ink"}`}
              >
                {transaction.type === "income" ? "+" : "-"}
                {formatCurrency(transaction.amount)}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
