"use client";
import { useState } from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { Topbar } from "@/components/layout/Topbar";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false); const router = useRouter(); useEffect(() => { fetch("/api/auth/me").then((r) => { if (r.status === 401) router.replace("/login"); }); }, [router]);
  return <div className="flex min-h-screen bg-paper"><Sidebar open={open} onClose={() => setOpen(false)} /><div className="flex min-w-0 flex-1 flex-col"><Topbar onMenu={() => setOpen(true)} /><main className="flex-1 overflow-auto">{children}</main></div></div>;
}
