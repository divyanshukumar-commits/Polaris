import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { AppLayout } from "@/components/polaris/layout";
import { getAuthSession } from "@/lib/auth";

export const Route = createFileRoute("/admin")({
  beforeLoad: () => {
    if (typeof window !== "undefined" && getAuthSession()?.role !== "admin") {
      throw redirect({ to: "/login" });
    }
  },
  component: AdminLayout,
});

function AdminLayout() {
  return (
    <AppLayout role="admin">
      <Outlet />
    </AppLayout>
  );
}
