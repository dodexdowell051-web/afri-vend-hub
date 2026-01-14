import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import { useSuperAdminDashboard } from "@/hooks/useSuperAdminDashboard";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { SuperAdminSidebar } from "@/components/admin/SuperAdminSidebar";
import { AuditLogsTable } from "@/components/admin/AuditLogsTable";
import { Loader2 } from "lucide-react";

const AdminAuditLogs = () => {
  const navigate = useNavigate();
  const { isAdmin, loading: authLoading } = useAdminAuth();
  const { auditLogs, loading } = useSuperAdminDashboard();

  useEffect(() => {
    if (!authLoading && !isAdmin) navigate("/login");
  }, [authLoading, isAdmin, navigate]);

  if (authLoading || loading) {
    return <div className="min-h-screen flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;
  }

  if (!isAdmin) return null;

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <SuperAdminSidebar />
        <main className="flex-1 overflow-auto">
          <header className="h-16 border-b border-border flex items-center px-6 bg-card">
            <SidebarTrigger className="mr-4" />
            <h1 className="text-xl font-semibold">Audit Logs</h1>
          </header>
          <div className="p-6">
            <AuditLogsTable logs={auditLogs} />
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default AdminAuditLogs;
