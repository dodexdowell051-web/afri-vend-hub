import { Suspense, lazy, ComponentType, useEffect } from "react";
import { useLocation } from "react-router-dom";
import PageLoader from "./PageLoader";

// Prefetch utility for important routes
const prefetchComponent = (importFn: () => Promise<{ default: ComponentType }>) => {
  importFn();
};

// Create lazy component with prefetch capability
export function createLazyComponent<T extends ComponentType>(
  importFn: () => Promise<{ default: T }>
) {
  const LazyComponent = lazy(importFn);
  
  return {
    Component: LazyComponent,
    prefetch: () => prefetchComponent(importFn),
  };
}

interface LazyRouteProps {
  component: React.LazyExoticComponent<ComponentType>;
  fallback?: React.ReactNode;
}

export const LazyRoute = ({ component: Component, fallback }: LazyRouteProps) => {
  return (
    <Suspense fallback={fallback || <PageLoader message="Loading..." />}>
      <Component />
    </Suspense>
  );
};

// Hook to prefetch routes on hover/focus
export function usePrefetch(prefetchFns: (() => void)[]) {
  useEffect(() => {
    // Prefetch after initial page load
    const timer = setTimeout(() => {
      prefetchFns.forEach((fn) => fn());
    }, 2000);

    return () => clearTimeout(timer);
  }, []);
}

// Route prefetcher component
export const RoutePrefetcher = () => {
  const location = useLocation();

  useEffect(() => {
    // Prefetch common routes based on current location
    const prefetchMap: Record<string, (() => void)[]> = {
      "/": [
        () => import("@/pages/Marketplace"),
        () => import("@/pages/Login"),
      ],
      "/login": [
        () => import("@/pages/Signup"),
        () => import("@/pages/Marketplace"),
      ],
      "/marketplace": [
        () => import("@/pages/Cart"),
        () => import("@/pages/Checkout"),
      ],
    };

    const routesToPrefetch = prefetchMap[location.pathname];
    if (routesToPrefetch) {
      // Delay prefetch to not block main thread
      const timer = setTimeout(() => {
        routesToPrefetch.forEach((fn) => fn());
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [location.pathname]);

  return null;
};
