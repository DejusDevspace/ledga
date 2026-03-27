export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="bg-bg-basebg flex min-h-screen items-center justify-center px-4">
      {children}
    </main>
  );
}
