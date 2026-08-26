import { createFileRoute, Outlet } from "@tanstack/react-router";
import { AppLayout } from "@/components/polaris/layout";

export const Route = createFileRoute("/user")({
  component: UserLayout,
});

function UserLayout() {
  return (
    <AppLayout role="user">
      <Outlet />
    </AppLayout>
  );
}
