import { Loader2 } from "lucide-react";

interface LoadingSpinnerProps {
  size?: number;
  className?: string;
}

export default function LoadingSpinner({
  size = 18,
  className = "",
}: LoadingSpinnerProps) {
  return (
    <Loader2
      size={size}
      aria-hidden="true"
      className={`shrink-0 animate-spin ${className}`}
    />
  );
}
