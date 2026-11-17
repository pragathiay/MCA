export type IconName = "dashboard" | "income" | "expenses" | "budgets" | "categories" | "reports" | "goals" | "profile";
export interface Transaction { id: number; merchant: string; category: string; date: string; amount: number; type: "income" | "expense"; icon: string; color: string; }
