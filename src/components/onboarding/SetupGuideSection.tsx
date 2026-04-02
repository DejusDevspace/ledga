"use client";

import React, { useState } from "react";
import {
  BookOpen,
  FileSpreadsheet,
  Table,
  Columns,
  ListFilter,
  Share2,
  Link as LinkIcon,
} from "lucide-react";
import SetupGuideModal from "./SetupGuideModal";

const STEP_SUMMARY = [
  {
    icon: FileSpreadsheet,
    title: "Create Your Google Sheet",
    color: "var(--color-accent-primary)",
  },
  {
    icon: Table,
    title: "Name the Transactions Tab",
    color: "var(--color-accent-gold)",
  },
  {
    icon: Columns,
    title: "Set Up Your Column Headers",
    color: "var(--color-accent-green)",
  },
  {
    icon: ListFilter,
    title: "Add Data Validation",
    color: "var(--color-accent-primary)",
  },
  {
    icon: Share2,
    title: "Share Your Sheet With Ledga",
    color: "var(--color-accent-gold)",
  },
  {
    icon: LinkIcon,
    title: "Link Your Sheet to Ledga",
    color: "var(--color-accent-green)",
  },
];

export default function SetupGuideSection() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="space-y-12">
      <header className="mb-10 flex items-center gap-6">
        <div className="bg-bg-elevated flex h-16 w-16 items-center justify-center border-2 border-black shadow-[4px_4px_0px_#000]">
          <BookOpen className="text-accent-primary" size={32} />
        </div>
        <div>
          <h2 className="font-display text-text-primary text-4xl font-black tracking-tighter uppercase md:text-5xl">
            Setup Guide
          </h2>
          <p className="text-text-secondary mt-2 font-mono text-sm tracking-widest uppercase">
            6 Steps to connect your Google Sheets correctly
          </p>
        </div>
      </header>

      <div className="space-y-8">
        <button
          onClick={() => setIsOpen(true)}
          className="bg-accent-primary font-display flex items-center gap-3 border-3 border-black p-6 text-xl font-black tracking-widest text-black uppercase shadow-[6px_6px_0px_#000] transition-all hover:-translate-y-1 hover:shadow-[8px_8px_0px_#000] active:translate-y-1 active:shadow-none"
        >
          <BookOpen size={22} />
          Open Setup Wizard
        </button>

        <div className="bg-bg-elevated border-2 border-black p-6 shadow-[inset_4px_4px_0px_rgba(0,0,0,0.5)]">
          <h3 className="text-text-secondary mb-6 font-mono text-[10px] font-bold tracking-[0.2em] uppercase">
            Step Reference Overview
          </h3>
          <div className="grid gap-2">
            {STEP_SUMMARY.map((step, i) => (
              <div
                key={i}
                className="group border-divider/30 flex items-center gap-4 border-b py-3 last:border-0"
              >
                <div
                  className="font-display flex h-6 w-6 shrink-0 items-center justify-center border border-black text-xs font-bold text-black"
                  style={{ backgroundColor: step.color }}
                >
                  {i + 1}
                </div>
                <step.icon
                  size={16}
                  style={{ color: step.color }}
                  className="opacity-70 transition-opacity group-hover:opacity-100"
                />
                <span className="text-text-secondary group-hover:text-text-primary font-mono text-xs font-medium tracking-tight uppercase transition-colors">
                  {step.title}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <SetupGuideModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </div>
  );
}
