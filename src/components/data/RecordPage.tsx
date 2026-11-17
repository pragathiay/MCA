"use client";
import { useEffect, useState } from "react";
import { formatCurrency } from "@/utils/format";

type Kind = "income" | "expenses" | "budgets" | "savings-goals" | "categories" | "bank-accounts";
type RecordItem = {
  _id: string;
  merchant?: string;
  source?: string;
  bankAccountId?: string;
  accountType?: string;
  lastDigits?: string;
  openingBalance?: number;
  balance?: number;
  name?: string;
  category?: string;
  description?: string;
  paymentMethod?: string;
  type?: string;
  amount?: number;
  targetAmount?: number;
  currentAmount?: number;
  date?: string;
  targetDate?: string;
  month?: number;
  year?: number;
};
type Field = {
  key: string;
  label: string;
  type?: "text" | "number" | "date" | "textarea" | "select";
  placeholder?: string;
  hint?: string;
  options?: string[];
  optional?: boolean;
  money?: boolean;
  wide?: boolean;
};
type Config = {
  title: string;
  singular: string;
  intro: string;
  accent: string;
  tint: string;
  sign: string;
  fields: Field[];
};

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];
const PAYMENT = ["Cash", "UPI", "Credit card", "Debit card", "Bank transfer", "Other"];
const today = () => new Date().toISOString().slice(0, 10);

const config: Record<Kind, Config> = {
  income: {
    title: "Income",
    singular: "income",
    intro: "Record money you receive, and note where it came from and why.",
    accent: "#059669",
    tint: "#e7f8ef",
    sign: "+",
    fields: [
      { key: "source", label: "Received from", placeholder: "e.g. Acme Pvt Ltd, Client – Rahul", hint: "Who or what paid you" },
      { key: "amount", label: "Amount received", type: "number", placeholder: "0.00", money: true },
      { key: "bankAccountId", label: "Bank account", type: "select", hint: "Which account received it" },
      { key: "category", label: "Type of income", type: "select", hint: "Salary, freelance, gift…" },
      { key: "date", label: "Date received", type: "date" },
      { key: "paymentMethod", label: "Received via", type: "select", options: PAYMENT, optional: true },
      { key: "description", label: "Description – why did you receive this?", type: "textarea", placeholder: "e.g. October salary, payment for logo design project, birthday gift from uncle", optional: true, wide: true },
    ],
  },
  expenses: {
    title: "Expenses",
    singular: "expense",
    intro: "Record money you spend, and note what it was for and why.",
    accent: "#c75d48",
    tint: "#fdeeea",
    sign: "−",
    fields: [
      { key: "merchant", label: "Paid to", placeholder: "e.g. Swiggy, Landlord, Apollo Pharmacy", hint: "Shop, person or company you paid" },
      { key: "amount", label: "Amount paid", type: "number", placeholder: "0.00", money: true },
      { key: "bankAccountId", label: "Bank account", type: "select", hint: "Which account it was paid from" },
      { key: "category", label: "Spent on", type: "select", hint: "Food, rent, bills…" },
      { key: "date", label: "Date paid", type: "date" },
      { key: "paymentMethod", label: "Paid using", type: "select", options: PAYMENT, optional: true },
      { key: "description", label: "Description – why did you pay this?", type: "textarea", placeholder: "e.g. Dinner with friends, monthly electricity bill, medicine for fever", optional: true, wide: true },
    ],
  },
  budgets: {
    title: "Budgets",
    singular: "budget",
    intro: "Set a spending limit for a month so you know when to slow down.",
    accent: "#059669",
    tint: "#e7f8ef",
    sign: "",
    fields: [
      { key: "name", label: "Budget name", placeholder: "e.g. Groceries for October", hint: "A short label you will recognise" },
      { key: "amount", label: "Spending limit", type: "number", placeholder: "0.00", money: true, hint: "Most you plan to spend" },
      { key: "category", label: "Applies to category", type: "select", optional: true, hint: "Optional" },
      { key: "month", label: "Month", type: "select", options: MONTHS },
      { key: "year", label: "Year", type: "number", placeholder: String(new Date().getFullYear()) },
    ],
  },
  "savings-goals": {
    title: "Savings goals",
    singular: "savings goal",
    intro: "Set a target, like a laptop or trip. Add money to each goal as you save, and track your progress.",
    accent: "#059669",
    tint: "#e7f8ef",
    sign: "",
    fields: [
      { key: "name", label: "What are you saving for?", placeholder: "e.g. New laptop, Goa trip", wide: true },
      { key: "targetAmount", label: "Goal amount", type: "number", placeholder: "0.00", money: true, hint: "Total you want to reach" },
      { key: "currentAmount", label: "Already saved", type: "number", placeholder: "0.00", money: true, optional: true, hint: "Leave empty if you're just starting" },
      { key: "targetDate", label: "Reach it by", type: "date", optional: true },
      { key: "description", label: "Notes", type: "textarea", placeholder: "Why does this goal matter to you?", optional: true, wide: true },
    ],
  },
  "bank-accounts": {
    title: "Bank accounts",
    singular: "bank account",
    intro: "Add the bank accounts you use. Pick one whenever you record income or an expense to see where your money is.",
    accent: "#059669",
    tint: "#e7f8ef",
    sign: "",
    fields: [
      { key: "name", label: "Bank name", placeholder: "e.g. HDFC Bank, SBI", hint: "You can add as many accounts as you need" },
      { key: "accountType", label: "Account type", type: "select", options: ["Savings", "Current", "Salary", "Credit card", "Other"] },
      { key: "lastDigits", label: "Last 4 digits", placeholder: "e.g. 1234", optional: true, hint: "Helps tell similar accounts apart" },
      { key: "openingBalance", label: "Current balance", type: "number", placeholder: "0.00", money: true, optional: true, hint: "Balance when you start tracking" },
    ],
  },
  categories: {
    title: "Categories",
    singular: "category",
    intro: "Group your income and expenses so reports make sense.",
    accent: "#059669",
    tint: "#e7f8ef",
    sign: "",
    fields: [
      { key: "name", label: "Category name", placeholder: "e.g. Pets, Side hustle" },
      { key: "type", label: "Used for", type: "select", options: ["expense", "income"], hint: "Spending or earning" },
    ],
  },
};

const inputCls =
  "mt-1.5 w-full rounded-xl border border-line bg-[#fbfdfc] px-3 text-sm font-normal text-ink outline-none transition placeholder:text-[#b3bdb9] focus:border-forest focus:bg-white focus:ring-2 focus:ring-mint";

function defaults(kind: Kind): Record<string, string> {
  const d = new Date();
  if (kind === "income" || kind === "expenses") return { date: today() };
  if (kind === "budgets")
    return { month: MONTHS[d.getMonth()], year: String(d.getFullYear()) };
  if (kind === "categories") return { type: "expense" };
  if (kind === "bank-accounts") return { accountType: "Savings" };
  return {};
}

export function RecordPage({ kind }: { kind: Kind }) {
  const cfg = config[kind];
  const { title, fields } = cfg;
  const [items, setItems] = useState<RecordItem[]>([]);
  const [accounts, setAccounts] = useState<RecordItem[]>([]);
  const [categories, setCategories] = useState<{ name: string; type: string }[]>([]);
  const [form, setForm] = useState<Record<string, string>>(() => defaults(kind));
  const [message, setMessage] = useState("");
  const [saving, setSaving] = useState(false);
  const [addingId, setAddingId] = useState<string | null>(null);
  const [addError, setAddError] = useState("");
  const [editId, setEditId] = useState<string | null>(null);
  const [amountInput, setAmountInput] = useState("");

  async function load() {
    const response = await fetch(`/api/${kind}`);
    const body = await response.json();
    if (response.ok) setItems(body.data.items || []);
    else setMessage(body.message || "Unable to load data.");
  }
  useEffect(() => {
    let cancelled = false;
    setForm(defaults(kind));
    setMessage("");
    void fetch(`/api/${kind}`)
      .then(async (response) => {
        const body = await response.json();
        if (cancelled) return;
        if (response.ok) setItems(body.data.items || []);
        else setMessage(body.message || "Unable to load data.");
      })
      .catch(() => {
        if (!cancelled) setMessage("Unable to load data.");
      });
    if (fields.some((f) => f.key === "category"))
      void fetch("/api/categories")
        .then((r) => r.json())
        .then((b) => !cancelled && setCategories(b?.data?.items || []))
        .catch(() => {});
    if (fields.some((f) => f.key === "bankAccountId") || kind === "bank-accounts")
      void fetch("/api/bank-accounts")
        .then((r) => r.json())
        .then((b) => !cancelled && setAccounts(b?.data?.items || []))
        .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [kind, fields]);

  const accountLabel = (a: RecordItem) => `${a.name}${a.lastDigits ? ` ••${a.lastDigits}` : ""}`;
  const accountName = (id?: string) => {
    const a = accounts.find((x) => x._id === id);
    return a ? accountLabel(a) : "";
  };

  function optionsFor(field: Field): { value: string; label: string }[] {
    if (field.options) return field.options.map((o) => ({ value: o, label: o }));
    if (field.key === "bankAccountId")
      return accounts.map((a) => ({ value: a._id, label: accountLabel(a) }));
    if (field.key === "category") {
      const type = kind === "income" ? "income" : kind === "expenses" ? "expense" : null;
      return categories
        .filter((c) => !type || c.type === type)
        .map((c) => ({ value: c.name, label: c.name }));
    }
    return [];
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setMessage("");
    setSaving(true);
    const body: Record<string, unknown> = {
      ...form,
      amount: form.amount ? Number(form.amount) : undefined,
      targetAmount: form.targetAmount ? Number(form.targetAmount) : undefined,
      currentAmount: form.currentAmount ? Number(form.currentAmount) : 0,
      year: form.year ? Number(form.year) : undefined,
    };
    if (kind === "budgets") body.month = MONTHS.indexOf(form.month) + 1;
    if (!form.targetDate) delete body.targetDate;
    const response = await fetch(editId ? `/api/${kind}/${editId}` : `/api/${kind}`, {
      method: editId ? "PATCH" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const result = await response.json();
    setSaving(false);
    if (!response.ok) setMessage(result.message || "Unable to save record.");
    else {
      setForm(defaults(kind));
      setEditId(null);
      load();
    }
  }
  function startEdit(item: RecordItem) {
    const f: Record<string, string> = {};
    for (const field of fields) {
      const v = item[field.key as keyof RecordItem];
      f[field.key] = v == null ? "" : field.key === "month" ? MONTHS[Number(v) - 1] : field.type === "date" ? String(v).slice(0, 10) : String(v);
    }
    setForm(f);
    setEditId(item._id);
    setAddingId(null);
    setMessage("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
  function cancelEdit() {
    setEditId(null);
    setForm(defaults(kind));
    setMessage("");
  }
  async function saveAmount(item: RecordItem) {
    const n = Number(amountInput);
    if (!amountInput || Number.isNaN(n) || n <= 0) return setAddError("Enter a valid amount.");
    const next = (item.currentAmount ?? 0) + n;
    const response = await fetch(`/api/${kind}/${item._id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ currentAmount: next }),
    });
    if (!response.ok) return setAddError((await response.json()).message || "Unable to update.");
    setAddError("");
    setAddingId(null);
    setAmountInput("");
    load();
  }
  async function remove(id: string) {
    const response = await fetch(`/api/${kind}/${id}`, { method: "DELETE" });
    if (!response.ok) {
      const body = await response.json().catch(() => null);
      window.alert(body?.message || "Unable to delete this record.");
      return;
    }
    load();
  }

  const isTx = kind === "income" || kind === "expenses";
  const total = isTx ? items.reduce((s, i) => s + (i.amount || 0), 0) : 0;

  return (
    <div className="mx-auto max-w-[1100px] p-5 sm:p-8">
      <p className="text-xs font-semibold text-muted">Workspace</p>
      <div className="mt-1 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-extrabold text-ink">{title}</h1>
          <p className="mt-2 text-sm text-muted">{cfg.intro}</p>
        </div>
        {isTx && (
          <div className="rounded-2xl px-4 py-2.5" style={{ background: cfg.tint }}>
            <p className="text-[11px] font-semibold text-muted">Total {cfg.singular}</p>
            <p className="text-lg font-extrabold" style={{ color: cfg.accent }}>
              {formatCurrency(total)}
            </p>
          </div>
        )}
      </div>

      <form
        onSubmit={submit}
        className="mt-7 overflow-hidden rounded-2xl border border-line bg-white"
      >
        <div
          className="flex items-center gap-3 border-b border-line px-5 py-3.5"
          style={{ background: cfg.tint }}
        >
          <span
            className="grid h-8 w-8 place-items-center rounded-lg text-lg font-extrabold text-white"
            style={{ background: cfg.accent }}
          >
            {editId ? "✎" : "+"}
          </span>
          <h2 className="text-sm font-extrabold text-ink">
            {editId ? `Edit ${cfg.singular}` : `Add new ${cfg.singular}`}
          </h2>
        </div>
        <div className="grid gap-x-4 gap-y-4 p-5 sm:grid-cols-2 lg:grid-cols-3">
          {fields.map((field) => {
            const type = field.type || "text";
            const common = {
              required: !field.optional,
              value: form[field.key] || "",
              onChange: (
                e: React.ChangeEvent<
                  HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
                >,
              ) => setForm({ ...form, [field.key]: e.target.value }),
            };
            return (
              <label
                key={field.key}
                className={`text-xs font-bold text-ink ${field.wide || type === "textarea" ? "sm:col-span-2 lg:col-span-3" : ""}`}
              >
                <span>
                  {field.label}
                  {field.optional && (
                    <span className="ml-1 font-medium text-muted">(optional)</span>
                  )}
                </span>
                {type === "textarea" ? (
                  <textarea
                    {...common}
                    rows={3}
                    maxLength={300}
                    placeholder={field.placeholder}
                    className={`${inputCls} resize-none py-2.5`}
                  />
                ) : type === "select" ? (
                  <select {...common} className={`${inputCls} h-11`}>
                    <option value="" disabled={!field.optional}>
                      {field.optional ? "None" : "Select…"}
                    </option>
                    {optionsFor(field).map((o) => (
                      <option key={o.value} value={o.value}>
                        {o.label}
                      </option>
                    ))}
                  </select>
                ) : (
                  <div className="relative">
                    {field.money && (
                      <span className="pointer-events-none absolute left-3 top-[1.1rem] text-sm font-semibold text-muted">
                        ₹
                      </span>
                    )}
                    <input
                      {...common}
                      type={type}
                      min={type === "number" ? 0 : undefined}
                      step={field.money ? "0.01" : undefined}
                      placeholder={field.placeholder}
                      className={`${inputCls} h-11 ${field.money ? "pl-7" : ""}`}
                    />
                  </div>
                )}
                {field.key === "bankAccountId" && !accounts.length ? (
                  <span className="mt-1 block text-[11px] font-medium text-[#c75d48]">
                    No bank accounts yet – add one on the Bank accounts page first.
                  </span>
                ) : field.hint && (
                  <span className="mt-1 block text-[11px] font-medium text-muted">
                    {field.hint}
                  </span>
                )}
              </label>
            );
          })}
        </div>
        <div className="flex items-center justify-between gap-3 border-t border-line bg-paper px-5 py-3.5">
          <p className="text-xs text-[#c75d48]">{message}</p>
          <div className="flex items-center gap-2">
          {editId && (
            <button type="button" onClick={cancelEdit} className="h-10 rounded-xl border border-line px-5 text-xs font-bold text-ink">
              Cancel
            </button>
          )}
          <button
            disabled={saving}
            className="h-10 rounded-xl px-5 text-xs font-bold text-white disabled:opacity-60"
            style={{ background: cfg.accent }}
          >
            {saving ? "Saving…" : editId ? `Update ${cfg.singular}` : `Save ${cfg.singular}`}
          </button>
          </div>
        </div>
      </form>

      <h2 className="mt-8 text-sm font-extrabold text-ink">
        Your {title.toLowerCase()} <span className="text-muted">({items.length})</span>
      </h2>
      <div className="mt-3 overflow-x-auto rounded-2xl border border-line bg-white">
        {items.length ? (
          <table className="w-full min-w-[760px] text-left text-sm">
            <thead>
              <tr className="border-b border-line bg-paper text-[11px] font-bold uppercase tracking-wide text-muted">
                {columns(kind, accountName).map((c) => (
                  <th key={c.label} className={`px-4 py-3 ${c.right ? "text-right" : ""}`}>
                    {c.label}
                  </th>
                ))}
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {items.map((item) => (
                <tr key={item._id} className="align-top hover:bg-paper">
                  {columns(kind, accountName).map((c) => (
                    <td
                      key={c.label}
                      className={`px-4 py-3.5 ${c.right ? "text-right font-bold" : "text-ink"} ${c.wrap ? "w-[300px] min-w-[220px] max-w-[300px] whitespace-normal [overflow-wrap:anywhere] text-xs text-ink/80" : ""}`}
                      style={c.right ? { color: cfg.accent } : undefined}
                    >
                      {c.render(item, cfg) || <span className="text-muted">—</span>}
                    </td>
                  ))}
                  <td className="whitespace-nowrap px-4 py-3.5 text-right">
                    {kind === "savings-goals" &&
                      (addingId === item._id ? (
                        <span className="mr-3 inline-flex flex-col items-end align-middle">
                          <span className="inline-flex items-center gap-1 rounded-xl border border-line bg-white py-1 pl-2.5 pr-1 focus-within:border-forest">
                            <span className="text-xs font-semibold text-muted">₹</span>
                            <input
                              autoFocus
                              type="number"
                              min={0}
                              step="0.01"
                              value={amountInput}
                              onChange={(e) => { setAmountInput(e.target.value); setAddError(""); }}
                              onKeyDown={(e) => {
                                if (e.key === "Enter") void saveAmount(item);
                                if (e.key === "Escape") { setAddingId(null); setAddError(""); }
                              }}
                              placeholder="Amount"
                              className="h-6 w-20 bg-transparent text-xs outline-none"
                            />
                            <button
                              onClick={() => void saveAmount(item)}
                              aria-label="Add"
                              title="Add"
                              className="grid h-6 w-6 place-items-center rounded-lg bg-forest text-white hover:opacity-90"
                            >
                              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5" /></svg>
                            </button>
                            <button
                              onClick={() => { setAddingId(null); setAddError(""); }}
                              aria-label="Cancel"
                              title="Cancel"
                              className="grid h-6 w-6 place-items-center rounded-lg text-muted hover:bg-line"
                            >
                              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round"><path d="M18 6 6 18M6 6l12 12" /></svg>
                            </button>
                          </span>
                          {addError && <span className="mt-1 text-[11px] text-[#c75d48]">{addError}</span>}
                        </span>
                      ) : (
                        <span className="mr-2 inline-flex items-center gap-2">
                          <button
                            onClick={() => { setAddingId(item._id); setAmountInput(""); setAddError(""); }}
                            className="rounded-lg bg-mint px-2 py-1 text-xs font-bold text-forest hover:opacity-80"
                            title="Add money"
                          >
                            + Money
                          </button>
                        </span>
                      ))}
                    {kind !== "categories" && (
                    <button
                      onClick={() => startEdit(item)}
                      aria-label="Edit"
                      title="Edit"
                      className="mr-2 inline-grid h-7 w-7 place-items-center rounded-lg align-middle text-ink hover:bg-line"
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9" /><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z" /></svg>
                    </button>
                    )}
                    <button
                      onClick={() => remove(item._id)}
                      className="text-xs font-bold text-[#c75d48] hover:underline"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="p-8 text-center text-sm text-muted">
            No {title.toLowerCase()} yet. Fill in the form above to add your first one.
          </p>
        )}
      </div>
    </div>
  );
}

type Column = {
  label: string;
  right?: boolean;
  wrap?: boolean;
  render: (i: RecordItem, cfg: Config) => React.ReactNode;
};
const fmtDate = (d?: string) => (d ? new Date(d).toLocaleDateString("en-IN") : "");
const money = (n?: number) => (n != null ? formatCurrency(n) : "");

function Progress({ i, cfg }: { i: RecordItem; cfg: Config }) {
  const target = i.targetAmount ?? 0;
  const saved = i.currentAmount ?? 0;
  const pct = target ? Math.min(100, (saved / target) * 100) : 0;
  return (
    <div className="min-w-[120px]">
      <div className="h-1.5 overflow-hidden rounded-full bg-line">
        <div className="h-full rounded-full" style={{ width: `${pct}%`, background: cfg.accent }} />
      </div>
      <p className="mt-1 text-[11px] text-muted">{Math.round(pct)}% reached</p>
    </div>
  );
}

function columns(kind: Kind, bank: (id?: string) => string): Column[] {
  const desc = (label: string): Column => ({ label, wrap: true, render: (i) => i.description });
  switch (kind) {
    case "income":
      return [
        { label: "Date", render: (i) => fmtDate(i.date) },
        { label: "Received from", render: (i) => <b>{i.source}</b> },
        { label: "Bank", render: (i) => bank(i.bankAccountId) },
        { label: "Type", render: (i) => i.category },
        { label: "Received via", render: (i) => i.paymentMethod },
        desc("Description"),
        { label: "Amount", right: true, render: (i, c) => `${c.sign}${money(i.amount)}` },
      ];
    case "expenses":
      return [
        { label: "Date", render: (i) => fmtDate(i.date) },
        { label: "Paid to", render: (i) => <b>{i.merchant}</b> },
        { label: "Bank", render: (i) => bank(i.bankAccountId) },
        { label: "Spent on", render: (i) => i.category },
        { label: "Paid using", render: (i) => i.paymentMethod },
        desc("Description"),
        { label: "Amount", right: true, render: (i, c) => `${c.sign}${money(i.amount)}` },
      ];
    case "budgets":
      return [
        { label: "Budget", render: (i) => <b>{i.name}</b> },
        { label: "Category", render: (i) => i.category },
        { label: "Month", render: (i) => (i.month ? `${MONTHS[i.month - 1]} ${i.year}` : "") },
        { label: "Limit", right: true, render: (i) => money(i.amount) },
      ];
    case "savings-goals":
      return [
        { label: "Goal", render: (i) => <b>{i.name}</b> },
        { label: "Reach by", render: (i) => fmtDate(i.targetDate) },
        { label: "Saved so far", render: (i) => money(i.currentAmount ?? 0) },
        { label: "Progress", render: (i, c) => <Progress i={i} cfg={c} /> },
        { label: "Goal amount", right: true, render: (i) => money(i.targetAmount) },
      ];
    case "bank-accounts":
      return [
        { label: "Bank", render: (i) => <b>{i.name}</b> },
        { label: "Type", render: (i) => i.accountType },
        { label: "Account no.", render: (i) => (i.lastDigits ? `•••• ${i.lastDigits}` : "") },
        { label: "Balance", right: true, render: (i) => money(i.balance ?? i.openingBalance ?? 0) },
      ];
    case "categories":
      return [
        { label: "Name", render: (i) => <b>{i.name}</b> },
        { label: "Used for", render: (i) => (i.type ? i.type[0].toUpperCase() + i.type.slice(1) : "") },
      ];
  }
}
