import Image from "next/image";

export function Logo({ showSubtitle = true }: { showSubtitle?: boolean }) {
  return <div className="flex items-center gap-2.5"><Image src="/logo22.png" alt="BudgetPulse logo" width={813} height={309} priority unoptimized className="h-7 w-auto object-contain" /><div><span className="block font-display text-[17px] font-extrabold leading-tight tracking-[-.03em] text-ink">BudgetPulse</span>{showSubtitle && <span className="block text-[8px] font-semibold leading-tight text-muted">Smart Expense &amp; Budget Management</span>}</div></div>;
}
