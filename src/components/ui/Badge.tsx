export function Badge({ children, tone = "green" }: { children: React.ReactNode; tone?: "green" | "neutral" | "orange" }) {
  const tones = { green: "bg-[#e0f7e8] text-[#28794d]", neutral: "bg-[#f0f3f1] text-[#738079]", orange: "bg-[#fff1db] text-[#ad7020]" };
  return <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-bold ${tones[tone]}`}>{children}</span>;
}
