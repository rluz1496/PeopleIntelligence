import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="flex flex-col md:flex-row min-h-screen">
      <Sidebar />
      <main className="flex-1 p-6">
        <Header />
        {children}
      </main>
    </div>
  );
}
