import SettingsNav from "@/components/features/settings/SettingsNav";

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="mx-auto min-h-screen max-w-7xl p-6 md:ml-0 md:p-12">
      <header className="relative mb-12">
        <h1 className="font-display text-text-primary text-6xl leading-none font-black tracking-tighter uppercase md:text-8xl">
          Settings
        </h1>
        <div className="bg-accent-gold mt-4 h-1 w-24 shadow-[4px_4px_0px_#000]" />
      </header>

      <div className="grid grid-cols-1 items-start gap-12 lg:grid-cols-12">
        <SettingsNav />
        <div className="lg:col-span-9">{children}</div>
      </div>
    </div>
  );
}
