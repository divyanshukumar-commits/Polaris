import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { AppLayout } from "@/components/polaris/layout";
import { getAuthSession } from "@/lib/auth";

export const Route = createFileRoute("/researcher")({
  beforeLoad: () => {
    if (typeof window !== "undefined" && getAuthSession()?.role !== "researcher") {
      throw redirect({ to: "/login" });
    }
  },
  component: ResearcherLayout,
});

function ResearcherLayout() {
  return (
    <AppLayout role="researcher">
      <Outlet />
    </AppLayout>
  );
}
