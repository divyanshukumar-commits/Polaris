import { useEffect, useState, type ReactNode } from "react";
import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import {
  Bell, Bookmark, Compass, Globe2, LayoutDashboard, Library, LogOut,
  Menu, MessageSquareText, Rocket, Search, Settings, ShieldCheck, Upload, Users, X,
} from "lucide-react";
import { Logo } from "./core";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { clearAuthSession, getAuthSession } from "@/lib/auth";

export type Role = "user" | "researcher" | "admin";

interface NavItem {
  to: string;
  label: string;
  icon: ReactNode;
}

const navConfig: Record<Role, NavItem[]> = {
  user: [
    { to: "/user", label: "Dashboard", icon: <LayoutDashboard size={17} /> },
    { to: "/user/repository", label: "Knowledge Repository", icon: <Library size={17} /> },
    { to: "/user/expeditions", label: "Expeditions", icon: <Compass size={17} /> },
    { to: "/user/media", label: "Media Gallery", icon: <Globe2 size={17} /> },
    { to: "/user/timeline", label: "Timeline", icon: <Rocket size={17} /> },
    { to: "/user/assistant", label: "Polar Assistant", icon: <MessageSquareText size={17} /> },
    { to: "/user/saved", label: "Saved", icon: <Bookmark size={17} /> },
  ],
  researcher: [
    { to: "/researcher", label: "Dashboard", icon: <LayoutDashboard size={17} /> },
    { to: "/researcher/research", label: "My Research", icon: <Library size={17} /> },
    { to: "/researcher/discover", label: "Discover Research", icon: <Search size={17} /> },
    { to: "/researcher/expeditions", label: "Expeditions", icon: <Compass size={17} /> },
    { to: "/researcher/saved", label: "Saved", icon: <Bookmark size={17} /> },
  ],
  admin: [
    { to: "/admin", label: "Dashboard", icon: <LayoutDashboard size={17} /> },
    { to: "/admin/content", label: "Content Management", icon: <ShieldCheck size={17} /> },
    { to: "/admin/users", label: "User Management", icon: <Users size={17} /> },
    { to: "/admin/analytics", label: "Analytics", icon: <Upload size={17} /> },
  ],
};

const roleMeta: Record<Role, { name: string; title: string; initials: string }> = {
  user: { name: "Aarav Sharma", title: "Explorer · Student", initials: "AS" },
  researcher: { name: "Dr. Geeta Nair", title: "Researcher · NCPOR", initials: "GN" },
  admin: { name: "Dr. Nandini Rao", title: "Administrator", initials: "NR" },
};

export function AppLayout({ role, children }: { role: Role; children: ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const navigate = useNavigate();
  const nav = navConfig[role];
  const meta = roleMeta[role];

  useEffect(() => {
    const session = getAuthSession();
    if (!session || session.role !== role) {
      navigate({ to: "/login" });
    }
  }, [navigate, role]);

  const isActive = (to: string) =>
    to === `/${role}` ? pathname === to : pathname.startsWith(to);

  const sidebar = (
    <div className="flex h-full flex-col">
      <div className="border-b border-sidebar-border px-5 py-5">
        <Logo />
        <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
          {role} portal
        </p>
      </div>
      <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
        {nav.map((item) => (
          <Link
            key={item.to}
            to={item.to}
            onClick={() => setMobileOpen(false)}
            className={cn(
              "flex items-center gap-3 rounded-xl px-3 py-2.5 text-[13px] font-medium transition-all",
              isActive(item.to)
                ? "bg-sidebar-accent text-primary border border-primary/25 glow-primary"
                : "text-sidebar-foreground/70 hover:bg-sidebar-accent/60 hover:text-sidebar-foreground border border-transparent",
            )}
          >
            <span className={cn(isActive(item.to) ? "text-primary" : "text-muted-foreground")}>{item.icon}</span>
            {item.label}
          </Link>
        ))}
      </nav>
      <div className="border-t border-sidebar-border p-3">
        <button
          onClick={() => {
            clearAuthSession();
            toast.info("Signed out of the demo session");
            navigate({ to: "/login" });
          }}
          className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-[13px] font-medium text-sidebar-foreground/70 transition-colors hover:bg-sidebar-accent/60 hover:text-foreground"
        >
          <LogOut size={17} className="text-muted-foreground" /> Switch role / Logout
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-background">
      {/* desktop sidebar */}
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 border-r border-sidebar-border bg-sidebar lg:block">
        {sidebar}
      </aside>
      {/* mobile sidebar */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-background/70 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
          <aside className="absolute inset-y-0 left-0 w-72 border-r border-sidebar-border bg-sidebar">{sidebar}</aside>
        </div>
      )}

      <div className="flex min-h-screen flex-1 flex-col lg:pl-64">
        {/* topbar */}
        <header className="sticky top-0 z-30 flex items-center gap-3 border-b border-border bg-background/80 px-4 py-3 backdrop-blur-md md:px-8">
          <button
            className="rounded-lg p-2 text-muted-foreground hover:bg-secondary lg:hidden"
            onClick={() => setMobileOpen(true)}
            aria-label="Open navigation"
          >
            <Menu size={18} />
          </button>
          <div className="hidden items-center gap-2 rounded-xl border border-input bg-secondary/50 px-3 py-2 md:flex md:w-80">
            <Search size={15} className="text-muted-foreground" />
            <input
              placeholder="Search polar knowledge…"
              className="w-full bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  const target = role === "admin" ? "/admin/content" : role === "researcher" ? "/researcher/discover" : "/user/repository";
                  navigate({ to: target });
                }
              }}
            />
          </div>
          <div className="ml-auto flex items-center gap-2">
            <button
              aria-label="Notifications"
              onClick={() =>
                toast.info("3 new updates", {
                  description: "44th ISEA mooring data is live · 2 submissions awaiting review",
                })
              }
              className="relative rounded-lg border border-border bg-secondary/50 p-2 text-muted-foreground transition-colors hover:text-primary"
            >
              <Bell size={16} />
              <span className="absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full bg-primary" />
            </button>
            <button
              aria-label="Settings"
              onClick={() => toast.info("Settings", { description: "Demo build — preferences are illustrative." })}
              className="rounded-lg border border-border bg-secondary/50 p-2 text-muted-foreground transition-colors hover:text-primary"
            >
              <Settings size={16} />
            </button>
            <div className="ml-1 flex items-center gap-2.5 rounded-xl border border-border bg-secondary/50 py-1.5 pl-1.5 pr-3">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/20 font-mono text-[11px] font-bold text-primary border border-primary/30">
                {meta.initials}
              </span>
              <div className="hidden text-left sm:block">
                <p className="text-xs font-semibold leading-tight text-foreground">{meta.name}</p>
                <p className="text-[10px] leading-tight text-muted-foreground">{meta.title}</p>
              </div>
            </div>
          </div>
        </header>
        <main className="flex-1 px-4 py-8 md:px-8">{children}</main>
        <footer className="border-t border-border px-4 py-6 md:px-8">
          <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-muted-foreground">
            <p>POLARIS · Integrated Polar Science Outreach & Knowledge Platform</p>
            <p className="font-mono text-[10px] uppercase tracking-wider">Integrated Polar Science Outreach & Knowledge Platform</p>
          </div>
        </footer>
      </div>
    </div>
  );
}

export { X as CloseIcon };
