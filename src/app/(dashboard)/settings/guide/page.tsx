import React from "react";
import SetupGuideSection from "@/components/onboarding/SetupGuideSection";

export const metadata = {
  title: "Setup Guide — Ledga",
  description: "Learn how to set up your Google Sheets for Ledga",
};

export default function SetupGuidePage() {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
      <SetupGuideSection />
    </div>
  );
}
