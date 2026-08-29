export type Role = "user" | "researcher" | "admin";

const SESSION_KEY = "polaris-auth-session";
const ACCOUNTS_KEY = "polaris-auth-accounts";

const isRole = (value: unknown): value is Role =>
  value === "user" || value === "researcher" || value === "admin";

export type RegistrationProfile = {
  firstName: string;
  middleName?: string | undefined;
  lastName: string;
  phone: string;
  profileImage?: string | undefined;
  organization?: string | undefined;
  specialization?: string | undefined;
  interests?: string | undefined;
  biography?: string | undefined;
  country?: string | undefined;
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
      ? parsed.filter(
          (account): account is StoredAccount =>
            typeof account?.email === "string" &&
            typeof account?.password === "string" &&
            isRole(account?.role),
        )
      : [];
  } catch {
    return [];
  }
}

export function registerAccount(
  email: string,
  password: string,
  role: Role,
  profile: RegistrationProfile,
) {
  if (typeof window === "undefined") return false;
  const normalizedEmail = email.trim().toLowerCase();
  const accounts = readAccounts();
  if (accounts.some((account) => account.email === normalizedEmail)) return false;
  accounts.push({ email: normalizedEmail, password, role, ...profile });
  window.localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(accounts));
  return true;
}

export function authenticateAccount(email: string, password: string) {
  const normalizedEmail = email.trim().toLowerCase();
  const account =
    readAccounts().find(
      (candidate) => candidate.email === normalizedEmail && candidate.password === password,
    ) ??
    (password.length >= 6 && legacyRoles[normalizedEmail]
      ? { email: normalizedEmail, password, role: legacyRoles[normalizedEmail] }
      : undefined);
  if (!account) return null;
  saveAuthSession(account.role, account.email, account);
  return account.role;
}

export function saveAuthSession(role: Role, email: string, profile?: Partial<RegistrationProfile>) {
  if (typeof window === "undefined") return;
  const sessionData = JSON.stringify({ role, email, ...profile, signedInAt: new Date().toISOString() });
  
  // Store in localStorage
  window.localStorage.setItem(SESSION_KEY, sessionData);
  
  // Also store in cookie for cross-tab and server-side persistence
  // Cookie expires in 7 days
  const expirationDate = new Date();
  expirationDate.setTime(expirationDate.getTime() + 7 * 24 * 60 * 60 * 1000);
  const expires = `expires=${expirationDate.toUTCString()}`;
  document.cookie = `${SESSION_KEY}=${encodeURIComponent(sessionData)}; ${expires}; path=/; SameSite=Lax`;
}

export function clearAuthSession() {
  if (typeof window === "undefined") return;
  // Clear from localStorage
  window.localStorage.removeItem(SESSION_KEY);
  
  // Clear from cookie by setting expiration to past date
  document.cookie = `${SESSION_KEY}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
}

export type AuthSession = { role: Role; email: string } & Partial<RegistrationProfile>;

export function getAuthSession(): AuthSession | null {
  if (typeof window === "undefined") return null;
  try {
    // First try localStorage
    let raw = window.localStorage.getItem(SESSION_KEY);
    
    // If not in localStorage, try to read from cookies
    if (!raw) {
      const cookies = document.cookie.split('; ');
      const sessionCookie = cookies.find(c => c.startsWith(`${SESSION_KEY}=`));
      if (sessionCookie) {
        raw = decodeURIComponent(sessionCookie.substring(SESSION_KEY.length + 1));
      }
    }
    
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<RegistrationProfile> & {
      role?: unknown;
      email?: unknown;
    };
    if (isRole(parsed?.role) && typeof parsed?.email === "string") {
      return {
        ...parsed,
        role: parsed.role,
        email: parsed.email,
      };
    }
  } catch {
    clearAuthSession();
  }
  return null;
}
