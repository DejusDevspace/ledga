"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  ArrowLeftRight,
  TrendingUp,
  FileText,
  Settings,
} from "lucide-react";
import { ROUTES } from "@/constants/routes";

const NAV_ITEMS = [
  { href: ROUTES.DASHBOARD, icon: LayoutDashboard },
  { href: ROUTES.TRANSACTIONS, icon: ArrowLeftRight },
  { href: ROUTES.INSIGHTS, icon: TrendingUp },
  { href: ROUTES.REPORTS, icon: FileText },
  { href: ROUTES.SETTINGS.ROOT, icon: Settings },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="bg-bg-surface fixed bottom-0 left-0 z-50 flex w-full items-center justify-around border-t-2 border-(--color-border) p-2">
      {NAV_ITEMS.map(({ href, icon: Icon }) => {
        const isActive = pathname === href || pathname.startsWith(href + "/");
        return (
          <Link
            key={href}
            href={href}
            className={`rounded-none p-3 transition-colors ${
              isActive
                ? "bg-accent-primary border-2 border-(--color-border) text-white shadow-[2px_2px_0px_#000]"
                : "text-text-secondary hover:text-text-primary border-2 border-transparent"
            }`}
          >
            <Icon size={20} />
          </Link>
        );
      })}
    </nav>
  );
}
