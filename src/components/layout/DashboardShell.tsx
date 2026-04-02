"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import FloatingGuideButton from "@/components/onboarding/FloatingGuideButton";
import SetupGuideModal from "@/components/onboarding/SetupGuideModal";
import type { UserSheet } from "@/types";

interface DashboardShellProps {
  children: React.ReactNode;
  hasSheets: boolean;
  initialSheets: UserSheet[];
}

export default function DashboardShell({
  children,
  hasSheets,
}: DashboardShellProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [showGuide, setShowGuide] = useState(false);

  // Auto-show guide if no sheets are linked on mount
  useEffect(() => {
    if (!hasSheets) {
      setShowGuide(true);
    }
  }, [hasSheets]);

  // Handle completion via URL param
  useEffect(() => {
    if (searchParams.get("setup") === "complete") {
      setShowGuide(false);
      // Clear the param and refresh to update server-side hasSheets
      const newParams = new URLSearchParams(searchParams.toString());
      newParams.delete("setup");
      const newQuery = newParams.toString() ? `?${newParams.toString()}` : "";
      router.replace(window.location.pathname + newQuery);
      router.refresh();
    }
  }, [searchParams, router]);

  const onGuideClose = () => {
    setShowGuide(false);
  };

  return (
    <>
      {children}
      <FloatingGuideButton
        hasSheets={hasSheets}
        onClick={() => setShowGuide(true)}
      />
      <SetupGuideModal
        isOpen={showGuide}
        onClose={onGuideClose}
      />
    </>
  );
}
