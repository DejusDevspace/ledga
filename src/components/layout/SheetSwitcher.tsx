"use client";

import { ChevronDown } from "lucide-react";

export default function SheetSwitcher() {
  return (
    <button className="bg-bg-elevated hover:bg-bg-base flex w-full items-center justify-between rounded-none border-2 border-(--color-border) px-3 py-2 shadow-[4px_4px_0px_#000] transition-colors">
      <span className="font-body text-text-primary text-sm font-medium">
        Main — 2025
      </span>
      <ChevronDown size={16} className="text-text-secondary" />
    </button>
  );
}
