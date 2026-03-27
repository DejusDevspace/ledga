import Sidebar from "@/components/layout/Sidebar";
import BottomNav from "@/components/layout/BottomNav";
import TopBar from "@/components/layout/TopBar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="bg-bg-base flex min-h-screen flex-col md:flex-row">
      <div className="hidden md:block">
        <Sidebar />
      </div>

      <main className="flex-1 pb-16 md:ml-60 md:pb-0">
        <div className="md:hidden">
          <TopBar />
        </div>
        <div className="mx-auto max-w-6xl p-4 md:p-8">{children}</div>
      </main>

      <div className="md:hidden">
        <BottomNav />
      </div>
    </div>
  );
}
