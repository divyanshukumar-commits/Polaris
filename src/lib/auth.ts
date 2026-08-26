import type { Role } from "@/components/polaris/layout";

const SESSION_KEY = "polaris-auth-session";

export function saveAuthSession(role: Role, email: string) {
  window.localStorage.setItem(
    SESSION_KEY,
    JSON.stringify({ role, email, signedInAt: new Date().toISOString() }),
  );
}

export function clearAuthSession() {
  window.localStorage.removeItem(SESSION_KEY);
}

export function getAuthSession(): { role: Role; email: string } | null {
  const raw = window.localStorage.getItem(SESSION_KEY);
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as { role?: Role; email?: string };
    if (
      (parsed.role === "user" || parsed.role === "researcher" || parsed.role === "admin") &&
      typeof parsed.email === "string"
    ) {
      return { role: parsed.role, email: parsed.email };
    }
  } catch {
    clearAuthSession();
  }
  return null;
}
