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
  { label: "Dashboard", href: ROUTES.DASHBOARD, icon: LayoutDashboard },
  { label: "Trans.", href: ROUTES.TRANSACTIONS, icon: ArrowLeftRight },
  { label: "Insights", href: ROUTES.INSIGHTS, icon: TrendingUp },
  { label: "Reports", href: ROUTES.REPORTS, icon: FileText },
  { label: "Settings", href: ROUTES.SETTINGS.ROOT, icon: Settings },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="bg-bg-base fixed bottom-0 left-0 z-50 flex h-16 w-full items-center justify-around border-t-2 border-black px-2 shadow-[0px_-4px_0px_#000] md:hidden">
      {NAV_ITEMS.map(({ label, href, icon: Icon }) => {
        const isActive = pathname === href || pathname.startsWith(href + "/");

        return (
          <Link
            key={href}
            href={href}
            className={
              isActive
                ? "bg-accent-primary flex h-12 flex-col items-center justify-center border-2 border-black px-3 font-mono text-[10px] text-black transition-transform active:scale-95"
                : "hover:text-accent-primary flex flex-col items-center justify-center font-mono text-[10px] text-white opacity-70 transition-colors"
            }
          >
            <Icon size={22} />
            <span>{label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
