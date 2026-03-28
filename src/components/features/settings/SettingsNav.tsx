"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function SettingsNav() {
  const pathname = usePathname();

  const links = [
    { label: "Profile", href: "/settings/profile" },
    { label: "Linked Sheets", href: "/settings/sheets" },
    { label: "Preferences", href: "/settings/preferences" },
  ];

  return (
    <nav className="sticky top-12 flex flex-col gap-4 lg:col-span-3">
      {links.map((link) => {
        const isActive = pathname === link.href;
        return (
          <Link
            key={link.href}
            href={link.href}
            className={`font-display w-full border-2 border-black p-4 text-left font-bold tracking-tight uppercase transition-all ${
              isActive
                ? "bg-accent-primary text-black shadow-[6px_6px_0px_#000] active:translate-x-1 active:translate-y-1 active:shadow-none"
                : "bg-bg-surface text-text-primary hover:-translate-y-1 hover:shadow-[4px_4px_0px_#000]"
            }`}
          >
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
}
