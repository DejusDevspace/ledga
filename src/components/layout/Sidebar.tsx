"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  ArrowLeftRight,
  TrendingUp,
  FileText,
  Settings,
  Layers,
  LogOut,
} from "lucide-react";
import { ROUTES } from "@/constants/routes";
import { signOut } from "@/lib/supabase/actions";

const NAV_ITEMS = [
  { label: "Dashboard", href: ROUTES.DASHBOARD, icon: LayoutDashboard },
  { label: "Transactions", href: ROUTES.TRANSACTIONS, icon: ArrowLeftRight },
  { label: "Insights", href: ROUTES.INSIGHTS, icon: TrendingUp },
  { label: "Reports", href: ROUTES.REPORTS, icon: FileText },
  { label: "Settings", href: ROUTES.SETTINGS.ROOT, icon: Settings },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="bg-bg-base fixed top-0 left-0 z-50 hidden h-screen w-60 flex-col gap-4 border-r-2 border-black p-4 shadow-[4px_0px_0px_#000] md:flex">
      {/* SECTION 1 — Wordmark */}
      <div className="mb-8">
        <div className="font-display text-accent-primary border-2 border-black p-1 text-xl font-black tracking-tighter uppercase shadow-[2px_2px_0px_#000]">
          Ledga
        </div>
        <p className="text-accent-primary mt-2 font-mono text-[10px] tracking-widest uppercase opacity-70">
          Family Ledger
        </p>
      </div>

      {/* SECTION 2 — Navigation */}
      <nav className="flex flex-1 flex-col gap-2">
        {NAV_ITEMS.map(({ label, href, icon: Icon }) => {
          const isActive = pathname === href || pathname.startsWith(href + "/");

          return (
            <Link
              key={href}
              href={href}
              className={
                isActive
                  ? "bg-accent-primary font-display flex items-center gap-3 border-2 border-black p-3 font-bold tracking-tighter text-black uppercase shadow-[2px_2px_0px_#000]"
                  : "font-display hover:bg-bg-surface flex items-center gap-3 p-3 font-bold tracking-tighter text-white uppercase transition-transform hover:translate-x-1"
              }
            >
              <Icon size={20} />
              <span>{label}</span>
            </Link>
          );
        })}
      </nav>

      {/* SECTION 3 — Bottom block */}
      <div className="mt-auto flex flex-col gap-2 border-t-2 border-black pt-4">
        {/* Sheet Switcher trigger — TODO: replace with <SheetSwitcher /> in Phase 5C */}
        <button className="font-display hover:bg-bg-elevated hover:text-accent-primary flex w-full items-center gap-3 p-3 font-bold tracking-tighter text-white uppercase transition-all">
          <Layers size={20} />
          <span>Sheet Switcher</span>
        </button>

        {/* Logout */}
        <form action={signOut}>
          <button
            type="submit"
            className="font-display text-accent-red hover:bg-bg-elevated flex w-full items-center gap-3 p-3 text-left font-bold tracking-tighter uppercase transition-colors"
          >
            <LogOut size={20} />
            <span>Logout</span>
          </button>
        </form>
      </div>
    </aside>
  );
}
