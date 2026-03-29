import { useUserSheets } from "@/hooks/useUserSheets";
import { useActiveSheet } from "@/hooks/useActiveSheet";
import { ChevronDown, Check } from "lucide-react";
import { useState } from "react";

export default function SheetSwitcher() {
  const { sheets, loading } = useUserSheets();
  const { activeSheet, setActiveSheet } = useActiveSheet();
  const [isOpen, setIsOpen] = useState(false);

  if (loading && sheets.length === 0) {
    return <div className="skeleton h-10 w-full" />;
  }

  if (sheets.length === 0) return null;

  return (
    <div className="relative w-full">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-bg-elevated hover:bg-bg-base flex w-full items-center justify-between border-2 border-black px-3 py-2 shadow-[4px_4px_0px_#000] transition-colors"
      >
        <span className="font-display text-sm font-bold tracking-tight uppercase">
          {activeSheet?.sheetLabel || "Select Sheet"}
        </span>
        <ChevronDown
          size={16}
          className={`text-accent-primary transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {isOpen && (
        <div className="bg-bg-elevated absolute bottom-full left-0 z-50 mb-2 w-full border-2 border-black shadow-[4px_4px_0px_#000]">
          {sheets.map((sheet) => {
            const isSelected = activeSheet?.id === sheet.id;
            return (
              <button
                key={sheet.id}
                onClick={() => {
                  setActiveSheet(sheet);
                  setIsOpen(false);
                }}
                className={`group flex w-full items-center justify-between p-3 text-left font-mono text-xs transition-colors hover:bg-black/20 ${
                  isSelected ? "text-accent-primary bg-black/10" : "text-white"
                }`}
              >
                <span>{sheet.sheetLabel}</span>
                {isSelected && (
                  <Check size={14} className="text-accent-primary" />
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
