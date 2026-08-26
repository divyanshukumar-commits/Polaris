import { createFileRoute } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FlaskConical,
  Plus,
  Search,
  ShieldCheck,
  Trash2,
  User,
  UserCheck,
  UserX,
  Users,
  X,
} from "lucide-react";
import { PageHeader } from "@/components/polaris/core";
import { useApp } from "@/lib/store";
import type { ManagedUser, UserRole, UserStatus } from "@/lib/data/types";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/users")({
  head: () => ({
    meta: [
      { title: "User Management — POLARIS Admin" },
      {
        name: "description",
        content: "Manage user accounts, researcher verification, and administrative roles.",
      },
      { property: "og:title", content: "User Management — POLARIS" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: UserManagementPage,
});

function UserManagementPage() {
  const { users, addUser, toggleUserStatus, deleteUser } = useApp();
  const [roleFilter, setRoleFilter] = useState<string>("All");
  const [statusFilter, setStatusFilter] = useState<string>("All");
  const [query, setQuery] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // New user form
  const [newName, setNewName] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newRole, setNewRole] = useState<UserRole>("Researcher");

  const filteredUsers = useMemo(() => {
    const q = query.toLowerCase().trim();
    return users.filter((u) => {
      if (roleFilter !== "All" && u.role !== roleFilter) return false;
      if (statusFilter !== "All" && u.status !== statusFilter) return false;
      if (q) {
        return u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q);
      }
      return true;
    });
  }, [users, roleFilter, statusFilter, query]);

  const handleToggle = (id: string, name: string) => {
    toggleUserStatus(id);
    toast.success(`Toggled status for ${name}`);
  };

  const handleDelete = (id: string, name: string) => {
    deleteUser(id);
    toast.success(`Removed account for ${name}`);
  };

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Admin Portal · Access Governance"
        title="User & Identity Management"
        description="Verify researcher credentials, govern user permissions, and manage account statuses across the POLARIS portal."
      >
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-bold text-primary-foreground shadow-md transition-opacity hover:opacity-90 glow-primary"
        >
          <Plus size={16} /> Add New User
        </button>
      </PageHeader>

      {/* Filter and Search Bar */}
      <div className="glass flex flex-wrap items-center justify-between gap-4 rounded-2xl p-4 glow-soft">
        <div className="flex flex-1 min-w-[240px] items-center gap-2 rounded-xl border border-input bg-background/60 px-3 py-2">
          <Search size={16} className="text-muted-foreground shrink-0" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by name, email, or institutional domain…"
            className="w-full bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {["All", "Researcher", "User", "Admin"].map((r) => (
            <button
              key={r}
              onClick={() => setRoleFilter(r)}
              className={cn(
                "rounded-lg px-3 py-1.5 text-xs font-semibold transition-all",
                roleFilter === r
                  ? "bg-primary text-primary-foreground glow-primary"
                  : "bg-secondary/60 text-muted-foreground hover:text-foreground",
              )}
            >
              {r}
            </button>
          ))}
          <span className="mx-1 h-5 w-px bg-border" aria-hidden="true" />
          {["All", "Active", "Disabled"].map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={cn(
                "rounded-lg px-3 py-1.5 text-xs font-semibold transition-all",
                statusFilter === status
                  ? "bg-primary text-primary-foreground glow-primary"
                  : "bg-secondary/60 text-muted-foreground hover:text-foreground",
              )}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Users Table */}
      <div className="glass overflow-hidden rounded-2xl border border-border/80 glow-soft">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-border bg-secondary/40 font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="px-6 py-4">User</th>
                <th className="px-6 py-4">Role</th>
                <th className="px-6 py-4">Joined Date</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredUsers.map((u) => {
                const initials = u.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                  .slice(0, 2)
                  .toUpperCase();

                return (
                  <tr key={u.id} className="transition-colors hover:bg-secondary/20">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary/15 font-mono text-xs font-bold text-primary border border-primary/25">
                          {initials}
                        </span>
                        <div>
                          <span className="font-display font-bold text-foreground block">
                            {u.name}
                          </span>
                          <span className="font-mono text-xs text-muted-foreground">{u.email}</span>
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <span
                        className={cn(
                          "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold",
                          u.role === "Admin"
                            ? "bg-purple-500/10 text-purple-400 border border-purple-500/30"
                            : u.role === "Researcher"
                              ? "bg-primary/15 text-primary border border-primary/30"
                              : "bg-secondary text-secondary-foreground",
                        )}
                      >
                        {u.role === "Admin" && <ShieldCheck size={12} />}
                        {u.role === "Researcher" && <FlaskConical size={12} />}
                        {u.role === "User" && <User size={12} />}
                        {u.role}
                      </span>
                    </td>

                    <td className="px-6 py-4 font-mono text-xs text-muted-foreground">{u.joined}</td>

                    <td className="px-6 py-4">
                      <span
                        className={cn(
                          "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 font-mono text-[11px] font-bold",
                          u.status === "Active"
                            ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30"
                            : "bg-rose-500/10 text-rose-400 border border-rose-500/30",
                        )}
                      >
                        <span
                          className={cn(
                            "h-1.5 w-1.5 rounded-full",
                            u.status === "Active" ? "bg-emerald-400" : "bg-rose-400",
                          )}
                        />
                        {u.status}
                      </span>
                    </td>

                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleToggle(u.id, u.name)}
                          className={cn(
                            "rounded-lg border px-3 py-1 text-xs font-medium transition-colors",
                            u.status === "Active"
                              ? "border-rose-500/40 bg-rose-500/10 text-rose-400 hover:bg-rose-500/20"
                              : "border-emerald-500/40 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20",
                          )}
                        >
                          {u.status === "Active" ? "Disable" : "Activate"}
                        </button>
                        <button
                          onClick={() => handleDelete(u.id, u.name)}
                          className="rounded-lg p-1.5 text-muted-foreground hover:bg-rose-500/10 hover:text-rose-400 transition-colors"
                          title="Delete user"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add User Modal */}
      <AnimatePresence>
        {isAddModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="glass-strong relative w-full max-w-md rounded-3xl p-6 md:p-8 glow-primary border border-primary/30"
            >
              <div className="flex items-center justify-between pb-3 border-b border-border">
                <div className="flex items-center gap-2">
                  <UserCheck size={18} className="text-primary" />
                  <h3 className="font-display text-base font-bold text-foreground">
                    Register New Account
                  </h3>
                </div>
                <button
                  onClick={() => setIsAddModalOpen(false)}
                  className="rounded-lg p-1.5 text-muted-foreground hover:text-foreground"
                >
                  <X size={18} />
                </button>
              </div>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (!newName.trim() || !newEmail.trim()) {
                    toast.error("Name and email are required.");
                    return;
                  }
                  addUser({
                    id: `user-${Date.now()}`,
                    name: newName.trim(),
                    email: newEmail.trim(),
                    role: newRole,
                    status: "Active",
                    joined: new Date().toISOString().slice(0, 10),
                  });
                  toast.success(`Account registered for ${newName} (${newRole})`);
                  setNewName("");
                  setNewEmail("");
                  setIsAddModalOpen(false);
                }}
                className="mt-5 space-y-4"
              >
                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1">
                    Full Name *
                  </label>
                  <input
                    required
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    placeholder="e.g. Dr. Rajesh Sharma"
                    className="w-full rounded-xl border border-input bg-background/80 px-3.5 py-2 text-xs text-foreground outline-none focus:border-primary/60"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1">
                    Email Address *
                  </label>
                  <input
                    required
                    type="email"
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    placeholder="e.g. r.sharma@ncpor.res.in"
                    className="w-full rounded-xl border border-input bg-background/80 px-3.5 py-2 text-xs text-foreground outline-none focus:border-primary/60 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1">Role</label>
                  <select
                    value={newRole}
                    onChange={(e) => setNewRole(e.target.value as UserRole)}
                    className="w-full rounded-xl border border-input bg-background/80 px-3 py-2 text-xs text-foreground outline-none focus:border-primary/60"
                  >
                    <option value="Researcher">Researcher</option>
                    <option value="User">Explorer / Student</option>
                    <option value="Admin">Administrator</option>
                  </select>
                </div>

                <div className="flex justify-end gap-3 pt-3 border-t border-border">
                  <button
                    type="button"
                    onClick={() => setIsAddModalOpen(false)}
                    className="rounded-xl border border-border px-4 py-2 text-xs font-semibold text-muted-foreground hover:text-foreground"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="rounded-xl bg-primary px-5 py-2 text-xs font-bold text-primary-foreground shadow-md hover:opacity-90 glow-primary"
                  >
                    Save User
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
