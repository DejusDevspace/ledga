import LoadingSpinner from "@/components/ui/LoadingSpinner";

interface PageLoadingProps {
  label?: string;
}

export default function PageLoading({
  label = "Loading page",
}: PageLoadingProps) {
  return (
    <div
      role="status"
      aria-live="polite"
      className="flex min-h-[calc(100vh-3rem)] items-center justify-center p-6"
    >
      <div className="bg-bg-surface w-full max-w-md border-[3px] border-black p-8 text-center shadow-[8px_8px_0px_#000]">
        <div className="bg-accent-primary mx-auto mb-5 flex h-14 w-14 items-center justify-center border-2 border-black text-black shadow-[4px_4px_0px_#000]">
          <LoadingSpinner size={28} />
        </div>
        <p className="font-display text-text-primary text-lg font-black tracking-tight uppercase">
          {label}
        </p>
        <div className="mt-6 space-y-3" aria-hidden="true">
          <div className="skeleton h-4 w-full" />
          <div className="skeleton mx-auto h-4 w-4/5" />
          <div className="skeleton mx-auto h-4 w-3/5" />
        </div>
      </div>
    </div>
  );
}
