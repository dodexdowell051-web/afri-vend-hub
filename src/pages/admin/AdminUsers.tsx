import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { UsersTable } from "@/components/admin/UsersTable";
import { Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface User {
  id: string;
  email: string | null;
  first_name: string | null;
  last_name: string | null;
  role: string | null;
  seller_status: string | null;
  created_at: string | null;
}

const AdminUsers = () => {
  const navigate = useNavigate();
  const { isAdmin, loading: authLoading } = useAdminAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      toast.error("Failed to fetch users");
      return;
    }

    setUsers(data as User[] || []);
    setLoading(false);
  };

  useEffect(() => {
    if (!authLoading && !isAdmin) {
      navigate("/login");
    } else if (isAdmin) {
      fetchUsers();
    }
  }, [authLoading, isAdmin, navigate]);

  const handleApprove = async (userId: string) => {
    const { error } = await supabase
      .from("profiles")
      .update({ seller_status: "approved" })
      .eq("id", userId);

    if (error) {
      toast.error("Failed to approve seller");
      return;
    }

    toast.success("Seller approved successfully");
    fetchUsers();
  };

  const handleSuspend = async (userId: string) => {
    const { error: profileError } = await supabase
      .from("profiles")
      .update({ seller_status: "suspended" })
      .eq("id", userId);

    if (profileError) {
      toast.error("Failed to suspend seller");
      return;
    }

    // Also suspend their store
    const { error: storeError } = await supabase
      .from("stores")
      .update({ is_suspended: true })
      .eq("user_id", userId);

    if (storeError) {
      console.error("Failed to suspend store:", storeError);
    }

    toast.success("Seller suspended successfully");
    fetchUsers();
  };

  const handleReactivate = async (userId: string) => {
    const { error: profileError } = await supabase
      .from("profiles")
      .update({ seller_status: "approved" })
      .eq("id", userId);

    if (profileError) {
      toast.error("Failed to reactivate seller");
      return;
    }

    // Also reactivate their store
    const { error: storeError } = await supabase
      .from("stores")
      .update({ is_suspended: false })
      .eq("user_id", userId);

    if (storeError) {
      console.error("Failed to reactivate store:", storeError);
    }

    toast.success("Seller reactivated successfully");
    fetchUsers();
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAdmin) {
    return null;
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <AdminSidebar />
        <main className="flex-1 overflow-auto">
          <header className="h-16 border-b border-border flex items-center px-6 bg-card">
            <SidebarTrigger className="mr-4" />
            <h1 className="text-xl font-semibold">User Management</h1>
          </header>
          <div className="p-6">
            <UsersTable 
              users={users} 
              onApprove={handleApprove}
              onSuspend={handleSuspend}
              onReactivate={handleReactivate}
            />
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default AdminUsers;
