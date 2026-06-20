"use client";

import type { ButtonHTMLAttributes, ReactNode } from "react";
import { useFormStatus } from "react-dom";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

interface AuthSubmitButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  pendingLabel: string;
}

export default function AuthSubmitButton({
  children,
  pendingLabel,
  className = "",
  disabled,
  ...props
}: AuthSubmitButtonProps) {
  const { pending } = useFormStatus();

  return (
    <button
      {...props}
      type={props.type ?? "submit"}
      aria-busy={pending}
      disabled={disabled || pending}
      className={`${className} disabled:cursor-not-allowed disabled:opacity-70`}
    >
      {pending ? (
        <span className="flex items-center justify-center gap-2">
          <LoadingSpinner />
          {pendingLabel}
        </span>
      ) : (
        children
      )}
    </button>
  );
}
