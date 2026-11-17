"use client";
import { Menu } from "lucide-react";
import Link from "next/link";

export function Topbar({ onMenu }: { onMenu: () => void }) {
  return <header className="flex h-[76px] shrink-0 items-center justify-between border-b border-line bg-white px-5 sm:px-8"><div className="flex items-center gap-3"><button type="button" onClick={(event) => { event.preventDefault(); event.stopPropagation(); onMenu(); }} className="rounded-xl p-2 text-muted hover:bg-paper lg:hidden" aria-label="Open navigation" aria-expanded="false"><Menu size={21} /></button><p className="font-display text-[14px] font-bold text-ink">Overview</p></div><Link href="/profile" className="flex items-center gap-2.5"><div className="grid size-9 place-items-center rounded-full bg-[#f8d9c5] text-[12px] font-bold text-[#9b6045]">PR</div><div className="hidden text-left sm:block"><p className="text-[12px] font-bold text-ink">Pragathi</p><p className="text-[10px] text-muted">Personal account</p></div></Link></header>;
}
