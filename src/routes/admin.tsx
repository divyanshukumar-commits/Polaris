import { createFileRoute, Outlet } from "@tanstack/react-router";
import { AppLayout } from "@/components/polaris/layout";

export const Route = createFileRoute("/admin")({
  component: AdminLayout,
});

function AdminLayout() {
  return (
    <AppLayout role="admin">
      <Outlet />
    </AppLayout>
  );
}
