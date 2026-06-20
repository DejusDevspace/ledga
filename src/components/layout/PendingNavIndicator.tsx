"use client";

import { useLinkStatus } from "next/link";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

export default function PendingNavIndicator() {
  const { pending } = useLinkStatus();

  if (!pending) {
    return null;
  }

  return (
    <span className="ml-auto" aria-label="Loading">
      <LoadingSpinner size={14} />
    </span>
  );
}
