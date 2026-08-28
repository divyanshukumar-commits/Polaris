export type Role = "user" | "researcher" | "admin";

const SESSION_KEY = "polaris-auth-session";
const ACCOUNTS_KEY = "polaris-auth-accounts";

const isRole = (value: unknown): value is Role =>
  value === "user" || value === "researcher" || value === "admin";

export type RegistrationProfile = {
  firstName: string;
  middleName?: string;
  lastName: string;
  phone: string;
  profileImage?: string;
  organization?: string;
  specialization?: string;
  interests?: string;
  biography?: string;
  country?: string;
};

type StoredAccount = { email: string; password: string; role: Role } & Partial<RegistrationProfile>;

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

export function registerAccount(email: string, password: string, role: Role, profile: RegistrationProfile) {
  const normalizedEmail = email.trim().toLowerCase();
  const accounts = readAccounts();
  if (accounts.some((account) => account.email === normalizedEmail)) return false;
  accounts.push({ email: normalizedEmail, password, role, ...profile });
  window.localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(accounts));
  return true;
}

export function authenticateAccount(email: string, password: string) {
  const normalizedEmail = email.trim().toLowerCase();
  const account = readAccounts().find(
    (candidate) => candidate.email === normalizedEmail && candidate.password === password,
  ) ?? (password.length >= 6 && legacyRoles[normalizedEmail]
    ? { email: normalizedEmail, password, role: legacyRoles[normalizedEmail] }
    : undefined);
  if (!account) return null;
  saveAuthSession(account.role, account.email, account);
  return account.role;
}

export function saveAuthSession(role: Role, email: string, profile?: Partial<RegistrationProfile>) {
  window.localStorage.setItem(
    SESSION_KEY,
    JSON.stringify({ role, email, ...profile, signedInAt: new Date().toISOString() }),
  );
}

export function clearAuthSession() {
  window.localStorage.removeItem(SESSION_KEY);
}

export function getAuthSession(): ({ role: Role; email: string } & Partial<RegistrationProfile>) | null {
  const raw = window.localStorage.getItem(SESSION_KEY);
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as { role?: Role; email?: string } & Partial<RegistrationProfile>;
    if (isRole(parsed.role) && typeof parsed.email === "string") {
      return parsed;
    }
  } catch {
    clearAuthSession();
  }
  return null;
}
