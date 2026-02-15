import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { CartProvider } from "@/contexts/CartContext";
import { Suspense, lazy } from "react";
import PageLoader from "@/components/loading/PageLoader";
import { RoutePrefetcher } from "@/components/loading/LazyRoute";

// Eagerly load critical above-the-fold pages
import Index from "./pages/Index";
import Login from "./pages/Login";

// Lazy load all other pages for code splitting
const Marketplace = lazy(() => import("./pages/Marketplace"));
const Seller = lazy(() => import("./pages/Seller"));
const Signup = lazy(() => import("./pages/Signup"));
const AdminLogin = lazy(() => import("./pages/AdminLogin"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Cart = lazy(() => import("./pages/Cart"));
const Checkout = lazy(() => import("./pages/Checkout"));
const Orders = lazy(() => import("./pages/Orders"));
const OrderConfirmation = lazy(() => import("./pages/OrderConfirmation"));
const About = lazy(() => import("./pages/About"));
const NotFound = lazy(() => import("./pages/NotFound"));
const StorePage = lazy(() => import("./pages/StorePage"));

// Lazy load admin pages (grouped chunk)
const AdminDashboard = lazy(() => import("./pages/admin/AdminDashboard"));
const AdminUsers = lazy(() => import("./pages/admin/AdminUsers"));
const AdminProducts = lazy(() => import("./pages/admin/AdminProducts"));
const AdminOrders = lazy(() => import("./pages/admin/AdminOrders"));
const AdminPayouts = lazy(() => import("./pages/admin/AdminPayouts"));
const AdminSettings = lazy(() => import("./pages/admin/AdminSettings"));
const AdminDisputes = lazy(() => import("./pages/admin/AdminDisputes"));
const AdminRefunds = lazy(() => import("./pages/admin/AdminRefunds"));
const AdminAuditLogs = lazy(() => import("./pages/admin/AdminAuditLogs"));
const AdminWallets = lazy(() => import("./pages/admin/AdminWallets"));

// Configure React Query with caching
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      gcTime: 1000 * 60 * 30, // 30 minutes (formerly cacheTime)
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

// Wrapper for lazy routes
const LazyPage = ({ children }: { children: React.ReactNode }) => (
  <Suspense fallback={<PageLoader message="Loading page..." />}>
    {children}
  </Suspense>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <CartProvider>
            <RoutePrefetcher />
            <Routes>
              {/* Critical routes - eagerly loaded */}
              <Route path="/" element={<Index />} />
              <Route path="/login" element={<Login />} />
              
              {/* Lazy loaded routes */}
              <Route path="/marketplace" element={<LazyPage><Marketplace /></LazyPage>} />
              <Route path="/seller" element={<LazyPage><Seller /></LazyPage>} />
              <Route path="/signup" element={<LazyPage><Signup /></LazyPage>} />
              <Route path="/dashboard" element={<LazyPage><Dashboard /></LazyPage>} />
              <Route path="/cart" element={<LazyPage><Cart /></LazyPage>} />
              <Route path="/checkout" element={<LazyPage><Checkout /></LazyPage>} />
              <Route path="/orders" element={<LazyPage><Orders /></LazyPage>} />
              <Route path="/order-confirmation" element={<LazyPage><OrderConfirmation /></LazyPage>} />
              <Route path="/about" element={<LazyPage><About /></LazyPage>} />
              <Route path="/store/:storeId" element={<LazyPage><StorePage /></LazyPage>} />
              
              {/* Admin Routes - Lazy loaded */}
              <Route path="/admin-login" element={<LazyPage><AdminLogin /></LazyPage>} />
              <Route path="/admin" element={<LazyPage><AdminDashboard /></LazyPage>} />
              <Route path="/admin/users" element={<LazyPage><AdminUsers /></LazyPage>} />
              <Route path="/admin/products" element={<LazyPage><AdminProducts /></LazyPage>} />
              <Route path="/admin/orders" element={<LazyPage><AdminOrders /></LazyPage>} />
              <Route path="/admin/wallets" element={<LazyPage><AdminWallets /></LazyPage>} />
              <Route path="/admin/payouts" element={<LazyPage><AdminPayouts /></LazyPage>} />
              <Route path="/admin/disputes" element={<LazyPage><AdminDisputes /></LazyPage>} />
              <Route path="/admin/refunds" element={<LazyPage><AdminRefunds /></LazyPage>} />
              <Route path="/admin/audit-logs" element={<LazyPage><AdminAuditLogs /></LazyPage>} />
              <Route path="/admin/settings" element={<LazyPage><AdminSettings /></LazyPage>} />
              
              {/* Catch-all */}
              <Route path="*" element={<LazyPage><NotFound /></LazyPage>} />
            </Routes>
          </CartProvider>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
