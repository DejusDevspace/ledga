import Sidebar from "@/components/layout/Sidebar";
import BottomNav from "@/components/layout/BottomNav";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="bg-bg-base relative flex min-h-screen">
      {/* Subtle dot-grid background — decorative only */}
      <div
        className="pointer-events-none fixed inset-0 z-0 opacity-[0.04]"
        style={{
          backgroundImage: "radial-gradient(#A4C9FF 1px, transparent 1px)",
          backgroundSize: "24px 24px",
        }}
      />

      <Sidebar />
      <BottomNav />

      {/* Main content */}
      <main className="relative z-10 mb-16 min-h-screen flex-1 p-6 md:mb-0 md:ml-60">
        {children}
      </main>
    </div>
  );
}
