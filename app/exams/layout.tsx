import Sidebar from "@/components/layout/Sidebar";

export default function ExamsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative flex min-h-screen bg-aurora-gradient">
      <Sidebar />
      <main className="flex-1 px-6 py-10 md:px-14">{children}</main>
    </div>
  );
}