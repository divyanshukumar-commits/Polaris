import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";
import { researchItems } from "./data/research";
import { initialUsers } from "./data/users";
import type { ManagedUser, ResearchItem, ResearchStatus } from "./data/types";

interface AppState {
  allResearch: ResearchItem[];
  savedIds: string[];
  toggleSaved: (id: string) => boolean;
  isSaved: (id: string) => boolean;
  submitResearch: (item: ResearchItem) => void;
  setResearchStatus: (id: string, status: ResearchStatus) => void;
  deleteResearch: (id: string) => void;
  users: ManagedUser[];
  addUser: (user: ManagedUser) => void;
  toggleUserStatus: (id: string) => void;
  deleteUser: (id: string) => void;
}

const AppContext = createContext<AppState | null>(null);
const EXTRA_RESEARCH_KEY = "polaris-research-submissions";

function readExtraResearch() {
  if (typeof window === "undefined") return [] as ResearchItem[];
  try {
    const parsed = JSON.parse(window.localStorage.getItem(EXTRA_RESEARCH_KEY) ?? "[]");
    return Array.isArray(parsed) ? parsed as ResearchItem[] : [];
  } catch {
    return [] as ResearchItem[];
  }
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [extra, setExtra] = useState<ResearchItem[]>(readExtraResearch);
  const [overrides, setOverrides] = useState<Record<string, ResearchStatus>>({});
  const [deleted, setDeleted] = useState<string[]>([]);
  const [savedIds, setSavedIds] = useState<string[]>([]);
  const [users, setUsers] = useState<ManagedUser[]>(initialUsers);

  const allResearch = useMemo(
    () =>
      [...extra, ...researchItems]
        .filter((r) => !deleted.includes(r.id))
        .map((r) => (overrides[r.id] ? { ...r, status: overrides[r.id] } : r)),
    [extra, overrides, deleted],
  );

  const toggleSaved = useCallback((id: string) => {
    let added = false;
    setSavedIds((prev) => {
      if (prev.includes(id)) return prev.filter((s) => s !== id);
      added = true;
      return [...prev, id];
    });
    return added;
  }, []);

  const isSaved = useCallback((id: string) => savedIds.includes(id), [savedIds]);

  const submitResearch = useCallback((item: ResearchItem) => {
    setExtra((prev) => {
      const next = [item, ...prev];
      window.localStorage.setItem(EXTRA_RESEARCH_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  const setResearchStatus = useCallback((id: string, status: ResearchStatus) => {
    setOverrides((prev) => ({ ...prev, [id]: status }));
  }, []);

  const deleteResearch = useCallback((id: string) => {
    setDeleted((prev) => [...prev, id]);
  }, []);

  const toggleUserStatus = useCallback((id: string) => {
    setUsers((prev) =>
      prev.map((u) =>
        u.id === id ? { ...u, status: u.status === "Active" ? "Disabled" : "Active" } : u,
      ),
    );
  }, []);

  const deleteUser = useCallback((id: string) => {
    setUsers((prev) => prev.filter((u) => u.id !== id));
  }, []);

  const addUser = useCallback((user: ManagedUser) => {
    setUsers((prev) => [user, ...prev]);
  }, []);

  const value = useMemo(
    () => ({
      allResearch,
      savedIds,
      toggleSaved,
      isSaved,
      submitResearch,
      setResearchStatus,
      deleteResearch,
      users,
      addUser,
      toggleUserStatus,
      deleteUser,
    }),
    [allResearch, savedIds, toggleSaved, isSaved, submitResearch, setResearchStatus, deleteResearch, users, addUser, toggleUserStatus, deleteUser],
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}
