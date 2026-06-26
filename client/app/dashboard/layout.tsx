import ProtectedRoute from "@/components/ProtectedRoute";
import DashboardNavbar from "./navbar";
import DashboardSidebar from "./sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedRoute>
      <div className="h-screen overflow-hidden bg-background">

        <div className="fixed left-0 top-0 hidden h-screen w-72 md:block">
          <DashboardSidebar />
        </div>


        <div className="flex h-screen flex-col md:ml-72">
          <DashboardNavbar />

          <main className="flex-1 overflow-y-auto p-4 md:p-6">
            {children}
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
}