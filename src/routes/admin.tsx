import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { AppLayout } from "@/components/polaris/layout";
import { getAuthSession } from "@/lib/auth";
import { useEffect } from "react";
import { useRouter } from "@tanstack/react-router";

export const Route = createFileRoute("/admin")({
  beforeLoad: () => {
    // Check on both server and client, but handle SSR gracefully
    if (typeof window !== "undefined") {
      const session = getAuthSession();
      if (!session || session.role !== "admin") {
        throw redirect({ to: "/login" });
      }
    }
  },
  component: AdminLayout,
});

function AdminLayout() {
  const router = useRouter();
  
  // Also check auth after hydration to catch any timing issues
  useEffect(() => {
    const session = getAuthSession();
    if (!session || session.role !== "admin") {
      router.navigate({ to: "/login" });
    }
  }, [router]);
  
  return (
    <AppLayout role="admin">
      <Outlet />
    </AppLayout>
  );
}
