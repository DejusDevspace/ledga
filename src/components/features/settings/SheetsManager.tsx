"use client";

import { useState } from "react";
import { ExternalLink, PlusSquare } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import {
  deleteUserSheet,
  insertUserSheet,
  updateUserSheet,
} from "@/lib/supabase/queries";
import type { UserSheet } from "@/types";

interface Props {
  initialSheets: UserSheet[];
}

export default function SheetsManager({ initialSheets }: Props) {
  const [sheets, setSheets] = useState<UserSheet[]>(initialSheets);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingSheet, setEditingSheet] = useState<UserSheet | null>(null);

  const [loading, setLoading] = useState(false);

  // Form state
  const [label, setLabel] = useState("");
  const [sheetId, setSheetId] = useState("");
  const [formUrl, setFormUrl] = useState("");
  const [isPrimary, setIsPrimary] = useState(false);

  const handleEdit = (sheet: UserSheet) => {
    setEditingSheet(sheet);
    setLabel(sheet.sheetLabel);
    setSheetId(sheet.sheetId);
    setFormUrl(sheet.formUrl || "");
    setIsPrimary(sheet.isPrimary);
    setShowAddForm(true);
  };

  const handleAddNew = () => {
    setEditingSheet(null);
    setLabel("");
    setSheetId("");
    setFormUrl("");
    setIsPrimary(sheets.length === 0);
    setShowAddForm(true);
  };

  const handleCancel = () => {
    setShowAddForm(false);
    setEditingSheet(null);
  };

  const handleRemove = async (id: string) => {
    if (!confirm("Are you sure you want to remove this sheet?")) return;
    try {
      const supabase = createClient();
      await deleteUserSheet(supabase, id);
      setSheets((prev) => prev.filter((s) => s.id !== id));
    } catch (err: unknown) {
      alert("Failed to delete sheet: " + (err as Error).message);
    }
  };

  const handleSave = async () => {
    if (!sheetId || !label) {
      alert("Label and Sheet ID are required.");
      return;
    }

    setLoading(true);
    try {
      const supabase = createClient();
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        throw new Error("Not authenticated");
      }

      if (isPrimary) {
        // Unset primary for all others
        const currentPrimary = sheets.filter(
          (s) => s.isPrimary && s.id !== editingSheet?.id
        );
        for (const s of currentPrimary) {
          await updateUserSheet(supabase, s.id, { isPrimary: false });
        }
      }

      let newSheet: UserSheet;
      if (editingSheet) {
        newSheet = await updateUserSheet(supabase, editingSheet.id, {
          sheetLabel: label,
          sheetId: sheetId,
          formUrl: formUrl || undefined,
          isPrimary,
        });
      } else {
        newSheet = await insertUserSheet(supabase, {
          userId: session.user.id,
          sheetLabel: label,
          sheetId: sheetId,
          formUrl: formUrl || undefined,
          isPrimary,
        });
      }

      setSheets((prev) => {
        let next = [...prev];
        if (isPrimary) {
          next = next.map((s) => ({ ...s, isPrimary: false }));
        }
        if (editingSheet) {
          return next.map((s) => (s.id === newSheet.id ? newSheet : s));
        }
        return [newSheet, ...next];
      });

      setShowAddForm(false);
      setEditingSheet(null);
    } catch (err: unknown) {
      alert("Error saving sheet: " + (err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="border-black flex items-end justify-between border-b-4 pb-4">
        <h2 className="font-display text-4xl font-black tracking-tighter uppercase">
          Linked Sheets
        </h2>
        <span className="font-mono text-accent-gold text-sm">
          {sheets.length} Connected Sheet(s)
        </span>
      </div>

      <div className="grid gap-6">
        {sheets.map((sheet) => (
          <div
            key={sheet.id}
            className="bg-bg-surface border-black flex flex-col justify-between gap-6 border-2 p-6 shadow-[6px_6px_0px_#000] md:flex-row md:items-center"
          >
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <h3 className="font-display text-xl font-bold uppercase">
                  {sheet.sheetLabel}
                </h3>
                {sheet.isPrimary && (
                  <span className="bg-accent-green border-black text-black border px-2 py-0.5 text-[10px] font-bold uppercase">
                    Primary
                  </span>
                )}
              </div>
              <p className="font-mono text-text-secondary text-sm tracking-tight">
                ID: {sheet.sheetId.slice(0, 12)}...
              </p>
              {sheet.formUrl && (
                <p className="font-mono text-text-secondary w-48 overflow-hidden text-ellipsis whitespace-nowrap text-xs">
                  {sheet.formUrl}
                </p>
              )}
            </div>

            <div className="flex flex-wrap gap-3">
              <button
                onClick={() =>
                  window.open(
                    `https://docs.google.com/spreadsheets/d/${sheet.sheetId}`,
                    "_blank"
                  )
                }
                className="font-mono hover:bg-bg-elevated border-black flex items-center gap-1 border-2 px-4 py-2 text-xs font-bold uppercase transition-colors"
              >
                <ExternalLink size={14} /> Open Sheet
              </button>
              {sheet.formUrl && (
                <button
                  onClick={() => window.open(sheet.formUrl, "_blank")}
                  className="font-mono hover:bg-bg-elevated border-black flex items-center gap-1 border-2 px-4 py-2 text-xs font-bold uppercase transition-colors"
                >
                  <ExternalLink size={14} /> Open Form
                </button>
              )}
              <button
                onClick={() => handleEdit(sheet)}
                className="font-mono hover:bg-bg-elevated border-black border-2 px-4 py-2 text-xs font-bold uppercase transition-colors"
              >
                Edit
              </button>
              <button
                onClick={() => handleRemove(sheet.id)}
                className="font-mono text-accent-red border-accent-red hover:bg-accent-red/10 border-2 px-4 py-2 text-xs font-bold uppercase transition-colors"
              >
                Remove
              </button>
            </div>
          </div>
        ))}

        {!showAddForm && (
          <button
            onClick={handleAddNew}
            className="bg-accent-gold text-black font-display border-black hover:-translate-y-1 hover:shadow-[8px_8px_0px_#000] active:translate-y-1 active:shadow-none flex w-full items-center justify-center gap-3 border-3 p-6 font-black tracking-widest shadow-[6px_6px_0px_#000] uppercase transition-all"
          >
            <PlusSquare size={22} /> Add New Sheet
          </button>
        )}
      </div>

      {showAddForm && (
        <div className="bg-bg-elevated border-black relative mt-4 overflow-hidden border-2 p-8">
          <h3 className="font-display mb-8 flex items-center gap-2 text-xl font-bold uppercase">
            <span className="bg-accent-primary border-black h-4 w-4 border" />
            {editingSheet ? "Edit Sheet" : "New Sheet Entry"}
          </h3>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <label className="font-mono text-text-secondary text-xs uppercase">
                Sheet Label
              </label>
              <input
                type="text"
                value={label}
                onChange={(e) => setLabel(e.target.value)}
                placeholder="e.g. Main — 2025"
                className="bg-bg-base focus:border-accent-primary w-full border-2 border-black p-3 outline-none"
              />
            </div>

            <div className="space-y-2">
              <label className="font-mono text-text-secondary text-xs uppercase">
                Google Sheet ID
              </label>
              <input
                type="text"
                value={sheetId}
                onChange={(e) => setSheetId(e.target.value)}
                placeholder="Paste Sheet ID from URL"
                disabled={!!editingSheet}
                className="bg-bg-base focus:border-accent-primary w-full border-2 border-black p-3 outline-none disabled:cursor-not-allowed disabled:opacity-50"
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <label className="font-mono text-text-secondary text-xs uppercase">
                Form URL (Optional)
              </label>
              <input
                type="url"
                value={formUrl}
                onChange={(e) => setFormUrl(e.target.value)}
                placeholder="https://docs.google.com/forms/..."
                className="bg-bg-base focus:border-accent-primary w-full border-2 border-black p-3 outline-none"
              />
            </div>

            <div className="bg-bg-base border-black flex items-center justify-between border-2 p-4 md:col-span-2">
              <div className="space-y-1">
                <span className="font-display text-sm font-bold uppercase">
                  Set as Primary
                </span>
                <p className="font-mono text-text-secondary text-[10px]">
                  Will override current default sheet
                </p>
              </div>
              <button
                onClick={() => setIsPrimary(!isPrimary)}
                className="bg-bg-elevated border-black relative h-6 w-12 border-2"
              >
                <div
                  className={`border-black absolute bottom-0 top-0 w-5 border-r-2 transition-all ${
                    isPrimary
                      ? "bg-accent-primary right-0 border-l-2 border-r-0"
                      : "bg-text-secondary left-0"
                  }`}
                />
              </button>
            </div>
          </div>

          <div className="mt-8 flex justify-end gap-3">
            <button
              onClick={handleCancel}
              className="font-display text-text-secondary border-black border-2 px-6 py-3 font-bold uppercase transition-all"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={loading}
              className="bg-accent-primary font-display border-black text-black hover:-translate-y-1 hover:shadow-[6px_6px_0px_#000] active:translate-y-0 active:shadow-none border-2 px-6 py-3 font-bold shadow-[4px_4px_0px_#000] uppercase transition-all disabled:opacity-50"
            >
              {loading ? "Saving..." : "Save Sheet"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
