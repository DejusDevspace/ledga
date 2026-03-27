"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  ArrowLeftRight,
  TrendingUp,
  FileText,
  Settings,
  LogOut,
} from "lucide-react";
import { ROUTES } from "@/constants/routes";
import { signOut } from "@/lib/supabase/actions";
import SheetSwitcher from "./SheetSwitcher";

const NAV_ITEMS = [
  { label: "Dashboard", href: ROUTES.DASHBOARD, icon: LayoutDashboard },
  { label: "Transactions", href: ROUTES.TRANSACTIONS, icon: ArrowLeftRight },
  { label: "Insights", href: ROUTES.INSIGHTS, icon: TrendingUp },
  { label: "Reports", href: ROUTES.REPORTS, icon: FileText },
  { label: "Settings", href: ROUTES.SETTINGS.ROOT, icon: Settings },
];

interface SidebarProps {
  displayName?: string;
  email?: string;
}

export default function Sidebar({ displayName, email }: SidebarProps) {
  const pathname = usePathname();

  const name = displayName || "User";
  const initials = name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <aside className="bg-bg-surface fixed top-0 left-0 z-50 flex h-screen w-60 flex-col border-r-2 border-(--color-border)">
      {/* Wordmark */}
      <div className="border-b-2 border-(--color-border) p-5">
        <span className="font-display text-accent-primary inline-block border-2 border-(--color-border) px-3 py-1 text-2xl font-extrabold shadow-[4px_4px_0px_#000]">
          Ledga
        </span>
      </div>

      {/* Sheet Switcher */}
      <div className="border-b-2 border-(--color-border) px-4 py-3">
        <SheetSwitcher />
      </div>

      {/* Navigation */}
      <nav className="flex flex-1 flex-col gap-1 px-3 py-4">
        {NAV_ITEMS.map(({ label, href, icon: Icon }) => {
          const isActive = pathname === href || pathname.startsWith(href + "/");
          return (
            <Link
              key={href}
              href={href}
              className={isActive ? "nav-item nav-item-active" : "nav-item"}
            >
              <Icon size={18} />
              <span>{label}</span>
            </Link>
          );
        })}
      </nav>

      {/* User block */}
      <div className="border-t-2 border-(--color-border) p-4">
        <div className="mb-3 flex items-center gap-3">
          <div className="font-display bg-accent-primary flex h-9 w-9 items-center justify-center border-2 border-(--color-border) text-sm font-bold text-white shadow-[2px_2px_0px_#000]">
            {initials}
          </div>
          <div>
            <p className="text-text-primary text-sm leading-tight font-medium">
              {name}
            </p>
            <p className="text-text-secondary text-xs leading-tight">
              {email || ""}
            </p>
          </div>
        </div>
        <form action={signOut}>
          <button
            type="submit"
            className="btn-danger w-full justify-center text-sm"
          >
            <LogOut size={14} />
            Log Out
          </button>
        </form>
      </div>
    </aside>
  );
}
