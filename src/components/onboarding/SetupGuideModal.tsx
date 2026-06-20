"use client";

import React, { useState, useEffect } from "react";
import {
  X,
  Copy,
  Check,
  FileSpreadsheet,
  Table,
  Columns,
  ListFilter,
  Share2,
  Link as LinkIcon,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
} from "lucide-react";
import { useRouter } from "next/navigation";

interface GuideStep {
  title: string;
  icon: React.ElementType;
  accentColor: string;
  content: React.ReactNode;
}

interface CopyChipProps {
  value: string;
  label?: string;
}

function CopyChip({ value, label }: CopyChipProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-bg-elevated flex items-center justify-between gap-3 border-2 border-black px-4 py-3 shadow-[2px_2px_0px_#000]">
      <div className="flex flex-col">
        {label && (
          <span className="mb-0.5 text-[10px] uppercase opacity-50">
            {label}
          </span>
        )}
        <span className="text-accent-primary max-w-50 truncate font-mono text-sm font-bold md:max-w-xs">
          {value}
        </span>
      </div>
      <button
        onClick={handleCopy}
        className="bg-accent-primary group font-display flex shrink-0 items-center gap-2 border-2 border-black px-3 py-1 text-xs font-bold text-black uppercase shadow-[2px_2px_0px_#000] transition-all hover:translate-x-px hover:translate-y-px hover:shadow-none"
      >
        {copied ? (
          <>
            <Check size={14} />
            <span>Copied</span>
          </>
        ) : (
          <>
            <Copy size={14} />
            <span>Copy</span>
          </>
        )}
      </button>
    </div>
  );
}

const ILLUSTRATIONS = {
  Step1: () => (
    <svg viewBox="0 0 400 200" className="h-full max-h-35 w-full">
      <rect
        x="50"
        y="40"
        width="300"
        height="120"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeDasharray="4 4"
      />
      <rect
        x="50"
        y="40"
        width="300"
        height="20"
        fill="var(--color-bg-elevated)"
        stroke="currentColor"
        strokeWidth="2"
      />
      <line
        x1="100"
        y1="60"
        x2="100"
        y2="160"
        stroke="currentColor"
        strokeWidth="1"
        strokeOpacity="0.3"
      />
      <line
        x1="200"
        y1="60"
        x2="200"
        y2="160"
        stroke="currentColor"
        strokeWidth="1"
        strokeOpacity="0.3"
      />
      <line
        x1="300"
        y1="60"
        x2="300"
        y2="160"
        stroke="currentColor"
        strokeWidth="1"
        strokeOpacity="0.3"
      />
      <line
        x1="50"
        y1="90"
        x2="350"
        y2="90"
        stroke="currentColor"
        strokeWidth="1"
        strokeOpacity="0.3"
      />
      <circle
        cx="200"
        cy="100"
        r="25"
        fill="var(--color-accent-primary)"
        stroke="black"
        strokeWidth="2"
      />
      <line
        x1="190"
        y1="100"
        x2="210"
        y2="100"
        stroke="black"
        strokeWidth="4"
      />
      <line x1="200" y1="90" x2="200" y2="110" stroke="black" strokeWidth="4" />
      <path
        d="M220 125 L210 115 L230 110 Z"
        fill="white"
        stroke="black"
        strokeWidth="1"
      />
    </svg>
  ),
  Step2: () => (
    <svg viewBox="0 0 400 200" className="h-full max-h-35 w-full">
      <rect
        x="50"
        y="40"
        width="300"
        height="120"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      />
      <rect
        x="50"
        y="140"
        width="300"
        height="20"
        fill="var(--color-bg-elevated)"
        stroke="currentColor"
        strokeWidth="2"
      />
      <path
        d="M50 140 L150 140 L150 160 L50 160 Z"
        fill="var(--color-accent-gold)"
        stroke="black"
        strokeWidth="2"
      />
      <text
        x="60"
        y="154"
        fontFamily="monospace"
        fontSize="10"
        fontWeight="bold"
        fill="black"
      >
        Transactions
      </text>
      <line
        x1="150"
        y1="140"
        x2="170"
        y2="140"
        stroke="currentColor"
        strokeWidth="2"
      />
      <rect
        x="130"
        y="100"
        width="80"
        height="50"
        fill="var(--color-bg-surface)"
        stroke="black"
        strokeWidth="2"
      />
      <text
        x="138"
        y="115"
        fontFamily="sans-serif"
        fontSize="8"
        fill="var(--color-text-primary)"
      >
        Rename
      </text>
      <line
        x1="130"
        y1="120"
        x2="210"
        y2="120"
        stroke="black"
        strokeWidth="1"
      />
      <rect
        x="135"
        y="125"
        width="70"
        height="15"
        fill="var(--color-accent-gold)"
        stroke="black"
        strokeWidth="1"
      />
    </svg>
  ),
  Step3: () => (
    <svg viewBox="0 0 400 200" className="h-full max-h-35 w-full">
      <rect
        x="50"
        y="40"
        width="300"
        height="30"
        fill="var(--color-bg-elevated)"
        stroke="black"
        strokeWidth="2"
      />
      <g
        fontFamily="monospace"
        fontSize="8"
        fontWeight="bold"
        textAnchor="middle"
      >
        <text x="80" y="60" fill="var(--color-accent-primary)">
          DATE
        </text>
        <text x="140" y="60" fill="var(--color-accent-gold)">
          TYPE
        </text>
        <text x="200" y="60" fill="var(--color-accent-green)">
          CATEGORY
        </text>
        <text x="260" y="60" fill="var(--color-accent-primary)">
          DESCRIPTION
        </text>
        <text x="320" y="60" fill="var(--color-accent-gold)">
          AMOUNT
        </text>
      </g>
      <rect
        x="50"
        y="70"
        width="300"
        height="30"
        fill="none"
        stroke="black"
        strokeWidth="1"
        strokeOpacity="0.5"
      />
      <g fontFamily="monospace" fontSize="7" opacity="0.4" textAnchor="middle">
        <text x="80" y="88">
          2025-01-01
        </text>
        <text x="140" y="88">
          expense
        </text>
        <text x="200" y="88">
          Food
        </text>
        <text x="260" y="88">
          Lunch
        </text>
        <text x="320" y="88">
          5000
        </text>
      </g>
    </svg>
  ),
  Step4: () => (
    <svg viewBox="0 0 400 200" className="h-full max-h-35 w-full">
      <rect
        x="120"
        y="40"
        width="60"
        height="120"
        fill="var(--color-bg-elevated)"
        stroke="black"
        strokeWidth="2"
        opacity="0.3"
      />
      <rect
        x="120"
        y="70"
        width="60"
        height="20"
        fill="var(--color-accent-primary)"
        stroke="black"
        strokeWidth="2"
      />
      <text
        x="125"
        y="83"
        fontFamily="monospace"
        fontSize="9"
        fontWeight="bold"
        fill="black"
      >
        income
      </text>
      <path d="M170 78 L175 83 L170 88 Z" fill="black" />
      <rect
        x="120"
        y="90"
        width="60"
        height="40"
        fill="var(--color-bg-surface)"
        stroke="black"
        strokeWidth="2"
      />
      <text
        x="125"
        y="105"
        fontFamily="monospace"
        fontSize="8"
        fill="var(--color-text-primary)"
      >
        income
      </text>
      <text
        x="125"
        y="122"
        fontFamily="monospace"
        fontSize="8"
        fill="var(--color-text-primary)"
      >
        expense
      </text>
      <rect
        x="122"
        y="95"
        width="56"
        height="12"
        fill="var(--color-accent-primary)"
        opacity="0.2"
      />
    </svg>
  ),
  Step5: () => (
    <svg viewBox="0 0 400 200" className="h-full max-h-35 w-full">
      <rect
        x="80"
        y="40"
        width="240"
        height="120"
        fill="var(--color-bg-surface)"
        stroke="black"
        strokeWidth="2"
      />
      <text
        x="90"
        y="55"
        fontFamily="sans-serif"
        fontSize="8"
        fontWeight="bold"
        fill="var(--color-text-primary)"
      >
        Share with people
      </text>
      <rect
        x="90"
        y="65"
        width="220"
        height="25"
        fill="var(--color-bg-elevated)"
        stroke="black"
        strokeWidth="1"
      />
      <line
        x1="95"
        y1="77"
        x2="105"
        y2="77"
        stroke="var(--color-accent-primary)"
        strokeWidth="8"
      />
      <rect
        x="230"
        y="100"
        width="80"
        height="20"
        fill="var(--color-bg-elevated)"
        stroke="black"
        strokeWidth="1"
      />
      <text
        x="235"
        y="113"
        fontFamily="sans-serif"
        fontSize="7"
        fill="var(--color-text-primary)"
      >
        Viewer
      </text>
      <path
        d="M300 108 L305 113 L300 118 Z"
        fill="currentColor"
        transform="rotate(90, 302.5, 113)"
      />
      <rect
        x="250"
        y="135"
        width="60"
        height="18"
        fill="var(--color-accent-gold)"
        stroke="black"
        strokeWidth="1"
      />
      <text
        x="268"
        y="147"
        fontFamily="sans-serif"
        fontSize="8"
        fontWeight="bold"
        fill="black"
      >
        Share
      </text>
    </svg>
  ),
  Step6: () => (
    <svg viewBox="0 0 400 200" className="h-full max-h-35 w-full">
      <rect
        x="40"
        y="70"
        width="320"
        height="30"
        fill="var(--color-bg-elevated)"
        stroke="black"
        strokeWidth="2"
      />
      <text
        x="50"
        y="89"
        fontFamily="monospace"
        fontSize="8"
        fill="var(--color-text-primary)"
      >
        docs.google.com/spreadsheets/d/
      </text>
      <rect
        x="235"
        y="75"
        width="80"
        height="20"
        fill="none"
        stroke="var(--color-accent-primary)"
        strokeWidth="2"
      />
      <text
        x="240"
        y="89"
        fontFamily="monospace"
        fontSize="8"
        fill="var(--color-accent-primary)"
        fontWeight="bold"
      >
        1T-SHEETID
      </text>
      <text
        x="320"
        y="89"
        fontFamily="monospace"
        fontSize="8"
        fill="var(--color-text-primary)"
      >
        /edit
      </text>
      <path
        d="M275 110 L275 140"
        stroke="var(--color-accent-primary)"
        strokeWidth="2"
        strokeDasharray="4 2"
      />
      <path
        d="M275 140 L270 135 L280 135 Z"
        fill="var(--color-accent-primary)"
      />
    </svg>
  ),
};

const STEPS: GuideStep[] = [
  {
    title: "Create Your Google Sheet",
    icon: FileSpreadsheet,
    accentColor: "var(--color-accent-primary)",
    content: (
      <div className="space-y-6">
        <ul className="space-y-4">
          <li className="flex items-start gap-4">
            <span className="bg-accent-primary font-display flex h-6 w-6 shrink-0 items-center justify-center border border-black text-xs font-bold text-black">
              1
            </span>
            <p className="font-body text-text-primary text-sm leading-relaxed">
              Go to{" "}
              <a
                href="https://sheets.google.com"
                target="_blank"
                className="text-accent-primary hover:underline"
              >
                sheets.google.com
              </a>{" "}
              and sign in
            </p>
          </li>
          <li className="flex items-start gap-4">
            <span className="bg-accent-primary font-display flex h-6 w-6 shrink-0 items-center justify-center border border-black text-xs font-bold text-black">
              2
            </span>
            <p className="font-body text-text-primary text-sm leading-relaxed">
              Click the large{" "}
              <strong className="text-accent-primary">&quot;+&quot;</strong>{" "}
              button to create a blank spreadsheet
            </p>
          </li>
          <li className="flex items-start gap-4">
            <span className="bg-accent-primary font-display flex h-6 w-6 shrink-0 items-center justify-center border border-black text-xs font-bold text-black">
              3
            </span>
            <p className="font-body text-text-primary text-sm leading-relaxed">
              Rename it by clicking{" "}
              <strong className="text-accent-primary">
                &quot;Untitled spreadsheet&quot;
              </strong>{" "}
              at the top
            </p>
          </li>
          <li className="flex items-start gap-4">
            <span className="bg-accent-primary font-display flex h-6 w-6 shrink-0 items-center justify-center border border-black text-xs font-bold text-black">
              4
            </span>
            <p className="font-body text-text-primary text-sm leading-relaxed">
              Name it anything you like (e.g. &quot;Ledga &mdash; 2026&quot;)
            </p>
          </li>
        </ul>
        <div className="bg-bg-elevated flex min-h-35 items-center justify-center border-2 border-black p-4">
          <ILLUSTRATIONS.Step1 />
        </div>
        <div className="border-accent-gold bg-bg-elevated border-l-4 px-4 py-3">
          <p className="text-text-secondary font-mono text-xs leading-relaxed">
            💡 You can create separate sheets for different years or purposes
            and link them all to your Ledga account from Settings.
          </p>
        </div>
      </div>
    ),
  },
  {
    title: "Name the Transactions Tab",
    icon: Table,
    accentColor: "var(--color-accent-gold)",
    content: (
      <div className="space-y-6">
        <ul className="space-y-4">
          <li className="flex items-start gap-4">
            <span className="bg-accent-gold font-display flex h-6 w-6 shrink-0 items-center justify-center border border-black text-xs font-bold text-black">
              1
            </span>
            <p className="font-body text-text-primary text-sm leading-relaxed">
              At the bottom of the sheet, locate the tab labelled{" "}
              <strong className="text-accent-gold">&quot;Sheet1&quot;</strong>
            </p>
          </li>
          <li className="flex items-start gap-4">
            <span className="bg-accent-gold font-display flex h-6 w-6 shrink-0 items-center justify-center border border-black text-xs font-bold text-black">
              2
            </span>
            <p className="font-body text-text-primary text-sm leading-relaxed">
              Right-click it and select{" "}
              <strong className="text-accent-gold">&quot;Rename&quot;</strong>
            </p>
          </li>
          <li className="flex items-start gap-4">
            <span className="bg-accent-gold font-display flex h-6 w-6 shrink-0 items-center justify-center border border-black text-xs font-bold text-black">
              3
            </span>
            <p className="font-body text-text-primary text-sm leading-relaxed">
              Type exactly:{" "}
              <strong className="text-accent-gold uppercase">
                Transactions
              </strong>
            </p>
          </li>
        </ul>
        <CopyChip value="Transactions" label="Tab Name" />
        <div className="bg-bg-elevated flex min-h-35 items-center justify-center border-2 border-black p-4">
          <ILLUSTRATIONS.Step2 />
        </div>
        <div className="border-accent-red bg-accent-red/10 border-l-4 px-4 py-3">
          <p className="text-text-secondary font-mono text-xs leading-relaxed">
            ⚠️ The tab name must be exactly{" "}
            <strong className="text-accent-red">
              &quot;Transactions&quot;
            </strong>{" "}
            with a capital T. Ledga uses this name to find your data.
          </p>
        </div>
      </div>
    ),
  },
  {
    title: "Set Up Your Column Headers",
    icon: Columns,
    accentColor: "var(--color-accent-green)",
    content: (
      <div className="space-y-6">
        <ul className="space-y-4">
          <li className="flex items-start gap-4">
            <span className="bg-accent-green font-display flex h-6 w-6 shrink-0 items-center justify-center border border-black text-xs font-bold text-black">
              1
            </span>
            <p className="font-body text-text-primary text-sm leading-relaxed">
              Click on cell <strong className="text-accent-green">A1</strong>{" "}
              (top-left cell)
            </p>
          </li>
          <li className="flex items-start gap-4">
            <span className="bg-accent-green font-display flex h-6 w-6 shrink-0 items-center justify-center border border-black text-xs font-bold text-black">
              2
            </span>
            <p className="font-body text-text-primary text-sm leading-relaxed">
              Type the headers exactly as shown below in row 1
            </p>
          </li>
        </ul>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          <CopyChip value="DATE" label="A1" />
          <CopyChip value="TYPE" label="B1" />
          <CopyChip value="CATEGORY" label="C1" />
          <CopyChip value="DESCRIPTION" label="D1" />
          <CopyChip value="AMOUNT" label="E1" />
        </div>
        <div className="bg-bg-elevated flex min-h-35 items-center justify-center border-2 border-black p-4">
          <ILLUSTRATIONS.Step3 />
        </div>
        <div className="border-accent-gold bg-bg-elevated border-l-4 px-4 py-3">
          <p className="text-text-secondary font-mono text-xs leading-relaxed">
            💡 You can bold row 1 and freeze it (View → Freeze → 1 row) so the
            headers stay visible as you scroll down.
          </p>
        </div>
      </div>
    ),
  },
  {
    title: "Add Data Validation",
    icon: ListFilter,
    accentColor: "var(--color-accent-primary)",
    content: (
      <div className="space-y-6">
        <div className="space-y-4">
          <h4 className="font-display text-accent-primary text-xs font-bold tracking-widest uppercase">
            Section A: DATE COLUMN
          </h4>
          <p className="font-body text-text-primary text-sm leading-relaxed">
            1. Select range <span className="font-bold">A2:A</span> (all cells
            in column A except the header). <br />
            2. Data → Data validation → Add rule. <br />
            3. Criteria: <span className="font-bold">is valid date</span>.
          </p>
        </div>

        <div className="space-y-4">
          <h4 className="font-display text-accent-primary text-xs font-bold tracking-widest uppercase">
            Section B: TYPE COLUMN
          </h4>
          <p className="font-body text-text-primary text-sm leading-relaxed">
            1. Select range <span className="font-bold">B2:B</span>. <br />
            2. Data → Data validation → Add rule. <br />
            3. Criteria: <span className="font-bold">Dropdown</span> (add these
            options):
          </p>
          <div className="flex gap-3">
            <CopyChip value="Income" />
            <CopyChip value="Expense" />
          </div>
        </div>

        <div className="space-y-4">
          <h4 className="font-display text-accent-primary text-xs font-bold tracking-widest uppercase">
            Section C: CATEGORY COLUMN
          </h4>
          <p className="font-body text-text-primary text-sm leading-relaxed">
            1. Select range <span className="font-bold">C2:C</span>. <br />
            2. Data → Data validation → Add rule with these starting categories:
          </p>
          <div className="flex flex-wrap gap-3">
            <CopyChip value="Transport" />
            <CopyChip value="Salary" />
            <CopyChip value="Health" />
            <CopyChip value="Network/Internet" />
            <CopyChip value="Food & Groceries" />
            <CopyChip value="Utilities" />
            <CopyChip value="Education" />
            <CopyChip value="Other" />
          </div>
        </div>

        <div className="bg-bg-elevated flex min-h-35 items-center justify-center border-2 border-black p-4">
          <ILLUSTRATIONS.Step4 />
        </div>
        <div className="border-accent-gold bg-bg-elevated border-l-4 px-4 py-3">
          <p className="text-text-secondary font-mono text-xs leading-relaxed">
            💡 Using range <span className="font-bold">2:1000</span> (e.g. A2:A)
            ensures your headers stay clean while all new entries are
            automatically validated.
          </p>
        </div>
      </div>
    ),
  },
  {
    title: "Share Your Sheet With Ledga",
    icon: Share2,
    accentColor: "var(--color-accent-gold)",
    content: (
      <div className="space-y-6">
        <ul className="space-y-4">
          <li className="flex items-start gap-4">
            <span className="bg-accent-gold font-display flex h-6 w-6 shrink-0 items-center justify-center border border-black text-xs font-bold text-black">
              1
            </span>
            <p className="font-body text-text-primary text-sm leading-relaxed">
              Click the green{" "}
              <strong className="text-accent-gold">&quot;Share&quot;</strong>{" "}
              button in the top-right
            </p>
          </li>
          <li className="flex items-start gap-4">
            <span className="bg-accent-gold font-display flex h-6 w-6 shrink-0 items-center justify-center border border-black text-xs font-bold text-black">
              2
            </span>
            <p className="font-body text-text-primary text-sm leading-relaxed">
              Paste this email in the &quot;Add people&quot; field:
            </p>
          </li>
        </ul>
        <CopyChip
          value={
            process.env.NEXT_PUBLIC_SERVICE_ACCOUNT_DISPLAY_EMAIL ||
            "Email not set"
          }
          label="Ledga Service Account"
        />
        <ul className="space-y-4">
          <li className="flex items-start gap-4">
            <span className="bg-accent-gold font-display flex h-6 w-6 shrink-0 items-center justify-center border border-black text-xs font-bold text-black">
              3
            </span>
            <p className="font-body text-text-primary text-sm leading-relaxed">
              Set role to{" "}
              <strong className="text-accent-gold">&quot;Viewer&quot;</strong>,
              uncheck &quot;Notify&quot;, and click &quot;Share&quot;
            </p>
          </li>
        </ul>
        <div className="bg-bg-elevated flex min-h-35 items-center justify-center border-2 border-black p-4">
          <ILLUSTRATIONS.Step5 />
        </div>
        <div className="border-accent-red bg-accent-red/10 border-l-4 px-4 py-3">
          <p className="text-text-secondary font-mono text-xs leading-relaxed">
            ⚠️ Without this step, Ledga cannot read your data. The role must be
            at least 'Viewer'.
          </p>
        </div>
      </div>
    ),
  },
  {
    title: "Link Your Sheet to Ledga",
    icon: LinkIcon,
    accentColor: "var(--color-accent-green)",
    content: (
      <div className="space-y-6">
        <ul className="space-y-4">
          <li className="flex items-start gap-4">
            <span className="bg-accent-green font-display flex h-6 w-6 shrink-0 items-center justify-center border border-black text-xs font-bold text-black">
              1
            </span>
            <p className="font-body text-text-primary text-sm leading-relaxed">
              Copy your <strong className="text-accent-green">Sheet ID</strong>{" "}
              from the browser URL bar:
            </p>
          </li>
        </ul>
        <div className="bg-bg-elevated flex min-h-35 flex-col items-center justify-center border-2 border-black p-6">
          <ILLUSTRATIONS.Step6 />
          <p className="mt-4 font-mono text-[10px] uppercase opacity-50">
            Docs.google.com/spreadsheets/d/
            <span className="bg-accent-primary px-1 text-black">
              [SHEET_ID]
            </span>
            /edit
          </p>
        </div>
        <ul className="space-y-4">
          <li className="flex items-start gap-4">
            <span className="bg-accent-green font-display flex h-6 w-6 shrink-0 items-center justify-center border border-black text-xs font-bold text-black">
              2
            </span>
            <p className="font-body text-text-primary text-sm leading-relaxed">
              Go to{" "}
              <strong className="text-accent-green">
                Settings &rarr; Sheets
              </strong>{" "}
              and click &quot;Add New Sheet&quot;
            </p>
          </li>
          <li className="flex items-start gap-4">
            <span className="bg-accent-green font-display flex h-6 w-6 shrink-0 items-center justify-center border border-black text-xs font-bold text-black">
              3
            </span>
            <p className="font-body text-text-primary text-sm leading-relaxed">
              Paste the ID, give it a label, and toggle{" "}
              <strong className="text-accent-green">
                &quot;Set as Primary&quot;
              </strong>{" "}
              ON
            </p>
          </li>
        </ul>
        <div className="border-accent-gold bg-bg-elevated border-l-4 px-4 py-3">
          <p className="text-text-secondary font-mono text-xs leading-relaxed">
            💡 You can link multiple sheets to your account. Use the sheet
            switcher in the sidebar to toggle between them.
          </p>
        </div>
      </div>
    ),
  },
];

interface SetupGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SetupGuideModal({
  isOpen,
  onClose,
}: SetupGuideModalProps) {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const step = STEPS[currentStep - 1];
  const StepIcon = step.icon;

  // Prevent scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center bg-black/85 p-4 backdrop-blur-sm md:p-6">
      <div
        className="bg-bg-surface relative flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden border-2 border-black shadow-[8px_8px_0px_#000]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <header className="bg-bg-surface sticky top-0 z-10 border-b-2 border-black p-6">
          <div className="flex items-center justify-between">
            <div className="bg-bg-elevated flex items-center border-2 border-black px-3 py-1 font-mono text-xs font-bold uppercase shadow-[2px_2px_0px_#000]">
              Step {currentStep} of 6
            </div>
            <button
              onClick={onClose}
              className="text-text-secondary hover:text-text-primary transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          <div className="bg-bg-elevated mt-4 h-2 w-full border border-black">
            <div
              className="h-full transition-all duration-300"
              style={{
                width: `${(currentStep / 6) * 100}%`,
                backgroundColor: step.accentColor,
              }}
            />
          </div>

          <div className="mt-4 flex items-center gap-3">
            <StepIcon size={24} style={{ color: step.accentColor }} />
            <h3 className="font-display text-text-primary text-xl font-bold tracking-tighter uppercase">
              {step.title}
            </h3>
          </div>
        </header>

        {/* Body */}
        <div className="scrollbar-thin scrollbar-thumb-black scrollbar-track-transparent flex-1 overflow-y-auto p-6">
          {step.content}
        </div>

        {/* Footer */}
        <footer className="bg-bg-surface sticky bottom-0 z-10 border-t-2 border-black p-6">
          <div className="flex items-center justify-between">
            <div>
              {currentStep < 6 && (
                <button
                  onClick={onClose}
                  className="text-text-secondary hover:text-text-primary font-mono text-xs uppercase underline transition-colors"
                >
                  Skip for now
                </button>
              )}
            </div>

            <div className="flex gap-2">
              {STEPS.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentStep(i + 1)}
                  className={`h-2.5 w-2.5 border border-black transition-colors ${
                    currentStep === i + 1 ? "" : "bg-bg-elevated"
                  }`}
                  style={
                    currentStep === i + 1
                      ? { backgroundColor: STEPS[i].accentColor }
                      : {}
                  }
                />
              ))}
            </div>

            <div className="flex gap-3">
              {currentStep > 1 && (
                <button
                  onClick={() => setCurrentStep((prev) => prev - 1)}
                  className="font-display text-text-primary flex items-center gap-1 border-2 border-black bg-transparent px-4 py-2 text-sm font-bold uppercase shadow-[2px_2px_0px_#000] transition-all hover:translate-x-px hover:translate-y-px hover:shadow-none"
                >
                  <ChevronLeft size={16} />
                  Back
                </button>
              )}

              {currentStep < 6 ? (
                <button
                  onClick={() => setCurrentStep((prev) => prev + 1)}
                  className="bg-accent-primary font-display flex items-center gap-1 border-2 border-black px-4 py-2 text-sm font-bold text-black uppercase shadow-[2px_2px_0px_#000] transition-all hover:translate-x-px hover:translate-y-px hover:shadow-none"
                >
                  Next
                  <ChevronRight size={16} />
                </button>
              ) : (
                <button
                  onClick={() => {
                    onClose();
                    router.push("/settings/sheets");
                  }}
                  className="bg-accent-primary font-display flex items-center gap-2 border-2 border-black px-4 py-2 text-sm font-bold text-black uppercase shadow-[2px_2px_0px_#000] transition-all hover:translate-x-px hover:translate-y-px hover:shadow-none"
                >
                  Go to Settings → Sheets
                </button>
              )}
            </div>
          </div>
          {currentStep === 6 && (
            <p className="text-text-secondary mt-4 text-center font-mono text-[10px] font-bold uppercase">
              Once you save your first sheet, this guide will mark itself as
              complete.
            </p>
          )}
        </footer>
      </div>
    </div>
  );
}
