import { Link, useLocation } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
} from "@/components/ui/sidebar";
import { 
  LayoutDashboard, 
  Users, 
  Package, 
  ShoppingCart, 
  Wallet, 
  Settings,
  LogOut,
  Crown,
  AlertTriangle,
  RefreshCcw,
  FileText,
  Shield,
  DollarSign
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";

const menuItems = [
  { 
    group: "Overview",
    items: [
      { title: "Dashboard", url: "/admin", icon: LayoutDashboard },
    ]
  },
  {
    group: "User Management",
    items: [
      { title: "Users & Sellers", url: "/admin/users", icon: Users },
    ]
  },
  {
    group: "Marketplace",
    items: [
      { title: "Products", url: "/admin/products", icon: Package },
      { title: "Orders", url: "/admin/orders", icon: ShoppingCart },
    ]
  },
  {
    group: "Financial",
    items: [
      { title: "Wallets", url: "/admin/wallets", icon: Wallet },
      { title: "Payouts", url: "/admin/payouts", icon: DollarSign },
    ]
  },
  {
    group: "Disputes & Refunds",
    items: [
      { title: "Disputes", url: "/admin/disputes", icon: AlertTriangle },
      { title: "Refunds", url: "/admin/refunds", icon: RefreshCcw },
    ]
  },
  {
    group: "System",
    items: [
      { title: "Audit Logs", url: "/admin/audit-logs", icon: FileText },
      { title: "Settings", url: "/admin/settings", icon: Settings },
    ]
  }
];

export const SuperAdminSidebar = () => {
  const location = useLocation();
  const { signOut } = useAuth();

  const isActive = (path: string) => {
    if (path === "/admin") {
      return location.pathname === "/admin";
    }
    return location.pathname.startsWith(path);
  };

  return (
    <Sidebar className="border-r border-border">
      <SidebarHeader className="p-4 border-b border-border bg-gradient-to-r from-primary/10 to-secondary/10">
        <Link to="/admin" className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-lg">
            <Crown className="w-6 h-6 text-primary-foreground" />
          </div>
          <div>
            <span className="font-bold text-lg block">Afrivend</span>
            <span className="text-xs text-muted-foreground flex items-center gap-1">
              <Shield className="w-3 h-3" /> Super Admin
            </span>
          </div>
        </Link>
      </SidebarHeader>

      <SidebarContent className="py-2">
        {menuItems.map((group) => (
          <SidebarGroup key={group.group}>
            <SidebarGroupLabel className="text-xs uppercase tracking-wider text-muted-foreground/70 px-4">
              {group.group}
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <Link
                        to={item.url}
                        className={`flex items-center gap-3 px-4 py-2.5 mx-2 rounded-lg transition-all ${
                          isActive(item.url)
                            ? "bg-primary text-primary-foreground font-medium shadow-md"
                            : "hover:bg-muted"
                        }`}
                      >
                        <item.icon className="w-5 h-5" />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>

      <SidebarFooter className="p-4 border-t border-border">
        <Button 
          variant="ghost" 
          className="w-full justify-start text-muted-foreground hover:text-destructive hover:bg-destructive/10"
          onClick={signOut}
        >
          <LogOut className="w-5 h-5 mr-3" />
          Sign Out
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
};
