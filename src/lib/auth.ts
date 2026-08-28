export type Role = "user" | "researcher" | "admin";

const SESSION_KEY = "polaris-auth-session";
const ACCOUNTS_KEY = "polaris-auth-accounts";

const isRole = (value: unknown): value is Role =>
  value === "user" || value === "researcher" || value === "admin";

type StoredAccount = { email: string; password: string; role: Role };

const legacyRoles: Record<string, Role> = {
  "aarav.sharma@polaris.gov.in": "user",
  "geeta.nair@ncpor.res.in": "researcher",
  "nandini.rao@polaris.gov.in": "admin",
};

function readAccounts(): StoredAccount[] {
  try {
    const parsed = JSON.parse(window.localStorage.getItem(ACCOUNTS_KEY) ?? "[]");
    return Array.isArray(parsed)
      ? parsed.filter((account): account is StoredAccount =>
          typeof account?.email === "string" &&
          typeof account?.password === "string" &&
          isRole(account?.role),
        )
      : [];
  } catch {
    return [];
  }
}

export function registerAccount(email: string, password: string, role: Role) {
  const normalizedEmail = email.trim().toLowerCase();
  const accounts = readAccounts().filter((account) => account.email !== normalizedEmail);
  accounts.push({ email: normalizedEmail, password, role });
  window.localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(accounts));
}

export function authenticateAccount(email: string, password: string) {
  const normalizedEmail = email.trim().toLowerCase();
  const account = readAccounts().find(
    (candidate) => candidate.email === normalizedEmail && candidate.password === password,
  ) ?? (password.length >= 6 && legacyRoles[normalizedEmail]
    ? { email: normalizedEmail, password, role: legacyRoles[normalizedEmail] }
    : undefined);
  if (!account) return null;
  saveAuthSession(account.role, account.email);
  return account.role;
}

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
    if (isRole(parsed.role) && typeof parsed.email === "string") {
      return { role: parsed.role, email: parsed.email };
    }
  } catch {
    clearAuthSession();
  }
  return null;
}
