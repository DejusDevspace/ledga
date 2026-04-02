"use client";

import { useState } from "react";
import { ExternalLink, PlusSquare } from "lucide-react";
import { useRouter } from "next/navigation";
import { useSupabase } from "@/providers/SupabaseProvider";
import { useUserSheets } from "@/hooks/useUserSheets";
import {
  deleteUserSheet,
  insertUserSheet,
  updateUserSheet,
} from "@/lib/supabase/queries";
import type { UserSheet } from "@/types";

export default function SheetsManager() {
  const router = useRouter();
  const { supabase, user } = useSupabase();
  const { sheets, addSheet, updateSheet, removeSheet } = useUserSheets();

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
      await deleteUserSheet(supabase, id);
      removeSheet(id);
    } catch (err: unknown) {
      alert("Failed to delete sheet: " + (err as Error).message);
    }
  };

  const handleSave = async () => {
    if (!sheetId || !label) {
      alert("Label and Sheet ID are required.");
      return;
    }

    if (!user) {
      alert("You must be logged in.");
      return;
    }

    setLoading(true);
    try {
      let newSheet: UserSheet;
      const isFirstSheet = sheets.length === 0;

      if (editingSheet) {
        newSheet = await updateUserSheet(supabase, editingSheet.id, {
          sheetLabel: label,
          sheetId: sheetId,
          formUrl: formUrl || undefined,
          isPrimary,
        });
        updateSheet(newSheet);
      } else {
        newSheet = await insertUserSheet(supabase, {
          userId: user.id,
          sheetLabel: label,
          sheetId: sheetId,
          formUrl: formUrl || undefined,
          isPrimary,
        });
        addSheet(newSheet);

        // Completion flow for first sheet
        if (isFirstSheet) {
          router.push("/settings/sheets?setup=complete");
        }
      }

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
      <div className="flex items-end justify-between border-b-4 border-black pb-4">
        <h2 className="font-display text-4xl font-black tracking-tighter uppercase">
          Linked Sheets
        </h2>
        <span className="text-accent-gold font-mono text-sm">
          {sheets.length} Connected Sheet(s)
        </span>
      </div>

      <div className="grid gap-6">
        {sheets.map((sheet) => (
          <div
            key={sheet.id}
            className="bg-bg-surface flex flex-col justify-between gap-6 border-2 border-black p-6 shadow-[6px_6px_0px_#000] md:flex-row md:items-center"
          >
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <h3 className="font-display text-xl font-bold uppercase">
                  {sheet.sheetLabel}
                </h3>
                {sheet.isPrimary && (
                  <span className="bg-accent-green border border-black px-2 py-0.5 text-[10px] font-bold text-black uppercase">
                    Primary
                  </span>
                )}
              </div>
              <p className="text-text-secondary font-mono text-sm tracking-tight">
                ID: {sheet.sheetId.slice(0, 12)}...
              </p>
              {sheet.formUrl && (
                <p className="text-text-secondary w-48 overflow-hidden font-mono text-xs text-ellipsis whitespace-nowrap">
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
                className="hover:bg-bg-elevated flex items-center gap-1 border-2 border-black px-4 py-2 font-mono text-xs font-bold uppercase transition-colors"
              >
                <ExternalLink size={14} /> Open Sheet
              </button>
              {sheet.formUrl && (
                <button
                  onClick={() => window.open(sheet.formUrl, "_blank")}
                  className="hover:bg-bg-elevated flex items-center gap-1 border-2 border-black px-4 py-2 font-mono text-xs font-bold uppercase transition-colors"
                >
                  <ExternalLink size={14} /> Open Form
                </button>
              )}
              <button
                onClick={() => handleEdit(sheet)}
                className="hover:bg-bg-elevated border-2 border-black px-4 py-2 font-mono text-xs font-bold uppercase transition-colors"
              >
                Edit
              </button>
              <button
                onClick={() => handleRemove(sheet.id)}
                className="text-accent-red border-accent-red hover:bg-accent-red/10 border-2 px-4 py-2 font-mono text-xs font-bold uppercase transition-colors"
              >
                Remove
              </button>
            </div>
          </div>
        ))}

        {!showAddForm && (
          <button
            onClick={handleAddNew}
            className="bg-accent-gold font-display flex w-full items-center justify-center gap-3 border-3 border-black p-6 font-black tracking-widest text-black uppercase shadow-[6px_6px_0px_#000] transition-all hover:-translate-y-1 hover:shadow-[8px_8px_0px_#000] active:translate-y-1 active:shadow-none"
          >
            <PlusSquare size={22} /> Add New Sheet
          </button>
        )}
      </div>

      {showAddForm && (
        <div className="bg-bg-elevated relative mt-4 overflow-hidden border-2 border-black p-8">
          <h3 className="font-display mb-8 flex items-center gap-2 text-xl font-bold uppercase">
            <span className="bg-accent-primary h-4 w-4 border border-black" />
            {editingSheet ? "Edit Sheet" : "New Sheet Entry"}
          </h3>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <label className="text-text-secondary font-mono text-xs uppercase">
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
              <label className="text-text-secondary font-mono text-xs uppercase">
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
              <label className="text-text-secondary font-mono text-xs uppercase">
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

            <div className="bg-bg-base flex items-center justify-between border-2 border-black p-4 md:col-span-2">
              <div className="space-y-1">
                <span className="font-display text-sm font-bold uppercase">
                  Set as Primary
                </span>
                <p className="text-text-secondary font-mono text-[10px]">
                  Will override current default sheet
                </p>
              </div>
              <button
                onClick={() => setIsPrimary(!isPrimary)}
                className="bg-bg-elevated relative h-6 w-12 border-2 border-black"
              >
                <div
                  className={`absolute top-0 bottom-0 w-5 border-r-2 border-black transition-all ${
                    isPrimary
                      ? "bg-accent-primary right-0 border-r-0 border-l-2"
                      : "bg-text-secondary left-0"
                  }`}
                />
              </button>
            </div>
          </div>

          <div className="mt-8 flex justify-end gap-3">
            <button
              onClick={handleCancel}
              className="font-display text-text-secondary border-2 border-black px-6 py-3 font-bold uppercase transition-all"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={loading}
              className="bg-accent-primary font-display border-2 border-black px-6 py-3 font-bold text-black uppercase shadow-[4px_4px_0px_#000] transition-all hover:-translate-y-1 hover:shadow-[6px_6px_0px_#000] active:translate-y-0 active:shadow-none disabled:opacity-50"
            >
              {loading ? "Saving..." : "Save Sheet"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
