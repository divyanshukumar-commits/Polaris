import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { AppLayout } from "@/components/polaris/layout";
import { getAuthSession } from "@/lib/auth";

export const Route = createFileRoute("/user")({
  beforeLoad: () => {
    if (typeof window !== "undefined" && getAuthSession()?.role !== "user") {
      throw redirect({ to: "/login" });
    }
  },
  component: UserLayout,
});

function UserLayout() {
  return (
    <AppLayout role="user">
      <Outlet />
    </AppLayout>
  );
}
