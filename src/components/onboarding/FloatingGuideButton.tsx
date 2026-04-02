"use client";

import React from "react";
import { HelpCircle } from "lucide-react";

interface FloatingGuideButtonProps {
  hasSheets: boolean;
  onClick: () => void;
}

export default function FloatingGuideButton({
  hasSheets,
  onClick,
}: FloatingGuideButtonProps) {
  if (hasSheets) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 group">
      {/* Tooltip */}
      <div className="absolute bottom-16 right-0 scale-0 bg-bg-elevated border-2 border-black px-3 py-2 text-xs font-mono font-bold uppercase text-text-primary shadow-[2px_2px_0px_#000] transition-all group-hover:scale-100 whitespace-nowrap">
        Sheet Setup Guide
        {/* Tooltip arrow */}
        <div className="absolute -bottom-2 right-6 h-2 w-2 border-r-2 border-b-2 border-black bg-bg-elevated rotate-45" />
      </div>

      <button
        onClick={onClick}
        className="flex h-14 w-14 items-center justify-center rounded-full bg-accent-primary text-black border-2 border-black shadow-[4px_4px_0px_#000] transition-all hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none"
        aria-label="Open Sheet Setup Guide"
      >
        <HelpCircle size={24} />
      </button>
    </div>
  );
}
