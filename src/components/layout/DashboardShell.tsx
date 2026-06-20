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
  const [guideDismissed, setGuideDismissed] = useState(false);
  const [guideRequested, setGuideRequested] = useState(false);
  const setupComplete = searchParams.get("setup") === "complete";
  const showGuide =
    !setupComplete && (guideRequested || (!guideDismissed && !hasSheets));

  // Handle completion via URL param
  useEffect(() => {
    if (setupComplete) {
      // Clear the param and refresh to update server-side hasSheets
      const newParams = new URLSearchParams(searchParams.toString());
      newParams.delete("setup");
      const newQuery = newParams.toString() ? `?${newParams.toString()}` : "";
      router.replace(window.location.pathname + newQuery);
      router.refresh();
    }
  }, [searchParams, router, setupComplete]);

  const onGuideClose = () => {
    setGuideDismissed(true);
    setGuideRequested(false);
  };

  return (
    <>
      {children}
      <FloatingGuideButton
        hasSheets={hasSheets}
        onClick={() => {
          setGuideDismissed(false);
          setGuideRequested(true);
        }}
      />
      <SetupGuideModal isOpen={showGuide} onClose={onGuideClose} />
    </>
  );
}
