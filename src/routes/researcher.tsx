import { createFileRoute, Outlet } from "@tanstack/react-router";
import { AppLayout } from "@/components/polaris/layout";

export const Route = createFileRoute("/researcher")({
  component: ResearcherLayout,
});

function ResearcherLayout() {
  return (
    <AppLayout role="researcher">
      <Outlet />
    </AppLayout>
  );
}
