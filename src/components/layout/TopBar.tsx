import SheetSwitcher from "./SheetSwitcher";

export default function TopBar() {
  return (
    <header className="bg-bg-surface sticky top-0 z-50 flex w-full items-center justify-between border-b-2 border-(--color-border) px-4 py-3">
      <span className="font-display text-accent-primary inline-block border-2 border-(--color-border) px-2 py-0.5 text-xl font-extrabold shadow-[2px_2px_0px_#000]">
        Ledga
      </span>
      <div className="w-48">
        <SheetSwitcher />
      </div>
    </header>
  );
}
