import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState } from "react";
import {
  ArrowRight,
  Check,
  Compass,
  Eye,
  EyeOff,
  Flame,
  FlaskConical,
  Globe2,
  Lock,
  Mail,
  ShieldCheck,
  Ship,
  Sparkles,
  User,
  Phone,
  Zap,
} from "lucide-react";
import { Logo } from "@/components/polaris/core";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import {
  authenticateAccount,
  registerAccount,
  type RegistrationProfile,
  type Role,
} from "@/lib/auth";

export const Route = createFileRoute("/login")({
  validateSearch: (search: Record<string, unknown>): { role?: string | undefined } => ({
    role: typeof search["role"] === "string" ? search["role"] : undefined,
  }),
  head: () => ({
    meta: [
      { title: "Sign In & Access Workspace — POLARIS" },
      {
        name: "description",
        content:
          "Sign in to the POLARIS Polar Science Portal as Explorer, Scientific Researcher, or System Administrator.",
      },
      { property: "og:title", content: "Sign In — POLARIS" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: LoginPage,
});

type AuthRole = Role;

const ROLE_DATA: Record<
  AuthRole,
  {
    title: string;
    badge: string;
    desc: string;
    defaultEmail: string;
    targetRoute: "/user" | "/researcher" | "/admin";
    icon: typeof User;
  }
> = {
  user: {
    title: "User / Explorer",
    badge: "Public Access",
    desc: "Create an account or sign in to explore polar research, timeline milestones, satellite records, and the voice AI assistant.",
    defaultEmail: "aarav.sharma@polaris.gov.in",
    targetRoute: "/user",
    icon: User,
  },
  researcher: {
    title: "Polar Researcher",
    badge: "NCPOR Verified",
    desc: "Submit scientific papers, download open datasets, and analyze sensor telemetry.",
    defaultEmail: "geeta.nair@ncpor.res.in",
    targetRoute: "/researcher",
    icon: FlaskConical,
  },
  admin: {
    title: "Administrator",
    badge: "Gov Command",
    desc: "Moderate submitted research, manage accounts, and verify institutional data pipelines.",
    defaultEmail: "nandini.rao@polaris.gov.in",
    targetRoute: "/admin",
    icon: ShieldCheck,
  },
};

/* Floating Snow Simulation */
function FallingSnow() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden z-20">
      {Array.from({ length: 30 }).map((_, i) => (
        <span
          key={i}
          className="absolute rounded-full bg-white animate-pulse"
          style={{
            width: `${(i % 3) * 2 + 2}px`,
            height: `${(i % 3) * 2 + 2}px`,
            left: `${(i * 13) % 100}%`,
            top: `${(i * 19) % 100}%`,
            opacity: 0.4 + (i % 5) * 0.12,
            animationDuration: `${2.5 + (i % 4)}s`,
          }}
        />
      ))}
    </div>
  );
}

interface GlacierRoleSelectorProps {
  currentRole: AuthRole;
  onSelectRole: (role: AuthRole) => void;
  isSignUp: boolean;
}

const GLACIER_ROLES: {
  id: AuthRole;
  title: string;
  tag: string;
  icon: typeof User;
  tilt: { rotateX: number; rotateY: number };
}[] = [
  {
    id: "user",
    title: "User / Explorer",
    tag: "Public Access",
    icon: User,
    tilt: { rotateX: 6, rotateY: 5 },
  },
  {
    id: "researcher",
    title: "Polar Researcher",
    tag: "NCPOR Verified",
    icon: FlaskConical,
    tilt: { rotateX: 7, rotateY: 0 },
  },
  {
    id: "admin",
    title: "Administrator",
    tag: "Gov Command",
    icon: ShieldCheck,
    tilt: { rotateX: 6, rotateY: -5 },
  },
];

function GlacierRoleSelector({ currentRole, onSelectRole }: GlacierRoleSelectorProps) {
  const [hoveredRole, setHoveredRole] = useState<AuthRole | null>(null);

  return (
    <div className="w-full">
      {/* Role Selection Header */}
      <div className="flex items-center justify-between mb-3 px-0.5">
        <div className="flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-400"></span>
          </span>
          <span className="font-mono text-[11px] font-bold uppercase tracking-widest text-cyan-200">
            CHOOSE YOUR ROLE
          </span>
        </div>
      </div>

      {/* 3 Horizontal Glacier Ice Cards */}
      <div
        className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-3"
        style={{ perspective: "1000px" }}
      >
        {GLACIER_ROLES.map((item) => {
          const isSelected = currentRole === item.id;
          const isHovered = hoveredRole === item.id && !isSelected;
          const Icon = item.icon;

          let transformStyle = "perspective(1000px) translateZ(0px) rotateX(0deg) rotateY(0deg)";
          if (isSelected) {
            transformStyle = `perspective(1000px) translateZ(14px) translateY(-5px) rotateX(${item.tilt.rotateX}deg) rotateY(${item.tilt.rotateY}deg)`;
          } else if (isHovered) {
            transformStyle = "perspective(1000px) translateY(-2px)";
          }

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onSelectRole(item.id)}
              onMouseEnter={() => setHoveredRole(item.id)}
              onMouseLeave={() => setHoveredRole(null)}
              aria-pressed={isSelected}
              className={cn(
                "group relative flex flex-col justify-between rounded-2xl p-3.5 text-left select-none outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 cursor-pointer overflow-hidden min-h-[110px]",
                "transition-all duration-400 ease-[cubic-bezier(0.16,1,0.3,1)]",
              )}
              style={{
                transform: transformStyle,
                transformStyle: "preserve-3d",
                background: isSelected
                  ? "linear-gradient(140deg, rgba(255, 255, 255, 0.32) 0%, rgba(34, 211, 238, 0.22) 35%, rgba(8, 51, 88, 0.75) 100%)"
                  : isHovered
                    ? "linear-gradient(140deg, rgba(255, 255, 255, 0.12) 0%, rgba(24, 194, 206, 0.08) 45%, rgba(6, 28, 50, 0.75) 100%)"
                    : "linear-gradient(140deg, rgba(255, 255, 255, 0.08) 0%, rgba(12, 38, 64, 0.5) 50%, rgba(5, 18, 32, 0.75) 100%)",
                backdropFilter: "blur(16px)",
                WebkitBackdropFilter: "blur(16px)",
                borderColor: isSelected
                  ? "rgba(56, 189, 248, 0.85)"
                  : isHovered
                    ? "rgba(186, 230, 253, 0.35)"
                    : "rgba(255, 255, 255, 0.14)",
                borderWidth: "1.5px",
                borderStyle: "solid",
                boxShadow: isSelected
                  ? "0 0 0 1px rgba(255, 255, 255, 0.4) inset, 0 3px 12px 0 rgba(255, 255, 255, 0.3) inset, 0 6px 0 0 rgba(14, 116, 144, 0.7), 0 12px 28px -4px rgba(6, 182, 212, 0.55), 0 20px 40px -8px rgba(3, 105, 161, 0.65)"
                  : isHovered
                    ? "0 6px 18px -3px rgba(0, 0, 0, 0.45), 0 0 10px rgba(24, 194, 206, 0.12)"
                    : "0 4px 16px -2px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.15)",
              }}
            >
              {/* Top Ice Specular Highlight Bar */}
              <div
                className={cn(
                  "pointer-events-none absolute top-0 left-0 right-0 h-[2px] transition-opacity duration-500",
                  isSelected
                    ? "bg-gradient-to-r from-transparent via-white to-transparent opacity-95"
                    : isHovered
                      ? "bg-gradient-to-r from-transparent via-cyan-200 to-transparent opacity-70"
                      : "bg-gradient-to-r from-transparent via-white/40 to-transparent opacity-40",
                )}
              />

              {/* Crystalline Prism Sheen Overlay */}
              <div
                className={cn(
                  "pointer-events-none absolute inset-0 transition-opacity duration-500",
                  isSelected
                    ? "bg-[linear-gradient(115deg,transparent_25%,rgba(255,255,255,0.2)_40%,rgba(165,243,252,0.35)_48%,transparent_60%)] opacity-100"
                    : isHovered
                      ? "bg-[linear-gradient(115deg,transparent_30%,rgba(255,255,255,0.12)_45%,rgba(165,243,252,0.2)_50%,transparent_65%)] opacity-80"
                      : "opacity-0",
                )}
              />

              {/* Card Inner Content with 3D Float Depth */}
              <div
                className="relative z-10 flex flex-col justify-between h-full w-full"
                style={{ transform: isSelected ? "translateZ(18px)" : "translateZ(6px)" }}
              >
                {/* Top Row: Icon + Active Status */}
                <div className="flex items-center justify-between mb-2">
                  <div
                    className={cn(
                      "flex h-7 w-7 items-center justify-center rounded-xl transition-all duration-300",
                      isSelected
                        ? "bg-cyan-400 text-[#07192d] shadow-[0_0_12px_rgba(34,211,238,0.8)] font-bold scale-105"
                        : isHovered
                          ? "bg-cyan-500/25 text-cyan-200 border border-cyan-400/40"
                          : "bg-white/10 text-slate-300 border border-white/10",
                    )}
                  >
                    <Icon size={14} strokeWidth={isSelected ? 2.5 : 2} />
                  </div>

                  {isSelected && (
                    <span className="flex items-center gap-1 rounded-full bg-cyan-400/20 px-2 py-0.5 text-[9px] font-mono font-bold uppercase tracking-wider text-cyan-300 border border-cyan-400/50 shadow-[0_0_8px_rgba(34,211,238,0.3)] animate-pulse">
                      <Check size={10} className="text-cyan-300 stroke-[3]" />
                      <span>ACTIVE</span>
                    </span>
                  )}
                </div>

                {/* Role Title */}
                <div>
                  <h3
                    className={cn(
                      "font-display text-[12px] sm:text-[13px] font-extrabold tracking-tight leading-snug transition-colors duration-300 uppercase",
                      isSelected
                        ? "text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]"
                        : isHovered
                          ? "text-cyan-100"
                          : "text-slate-200",
                    )}
                  >
                    {item.title}
                  </h3>

                  {/* Subtitle / Access Tag */}
                  <p
                    className={cn(
                      "mt-0.5 font-mono text-[9px] font-semibold uppercase tracking-wider transition-colors duration-300",
                      isSelected ? "text-cyan-300 drop-shadow" : "text-cyan-400/70",
                    )}
                  >
                    {item.tag}
                  </p>
                </div>
              </div>

              {/* Bottom 3D Bevel Ledge */}
              {isSelected && (
                <div className="pointer-events-none absolute -bottom-[1px] left-2 right-2 h-[3px] bg-cyan-400/70 rounded-full blur-[1px]" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function LoginPage() {
  const navigate = useNavigate();
  const search = Route.useSearch();
  const [role, setRole] = useState<AuthRole>(() => {
    const requested =
      search.role ??
      (typeof window !== "undefined"
        ? new URLSearchParams(window.location.search).get("role")
        : null);
    return requested === "researcher" || requested === "admin" ? requested : "user";
  });
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [middleName, setMiddleName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [agreed, setAgreed] = useState(true);
  const [signupComplete, setSignupComplete] = useState(false);
  const [formError, setFormError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");
    const emailIsValid = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i.test(email.trim());
    const phoneIsValid =
      /^\+?[0-9()\s.-]{7,20}$/.test(phone.trim()) && phone.replace(/\D/g, "").length >= 7;
    if (isSignUp && (!firstName.trim() || !lastName.trim())) {
      setFormError("First name and last name are required.");
      return;
    }
    if (!emailIsValid) {
      setFormError("Enter a valid email address.");
      return;
    }
    if (isSignUp && !phoneIsValid) {
      setFormError("Enter a valid phone number.");
      return;
    }
    if (password.length < 6) {
      setFormError("Password must be at least 6 characters.");
      return;
    }
    if (isSignUp && password !== confirmPassword) {
      setFormError("Password and confirmation must match.");
      return;
    }
    if (isSignUp && !agreed) {
      toast.error("Please agree to the terms of service.");
      return;
    }
    if (isSignUp) {
      const trimmedMiddle = middleName.trim();
      const profile: RegistrationProfile = {
        firstName: firstName.trim(),
        middleName: trimmedMiddle || undefined,
        lastName: lastName.trim(),
        phone: phone.trim(),
      };
      if (!registerAccount(email, password, role, profile)) {
        setFormError("An account with this email already exists. Please sign in.");
        return;
      }
      setIsSignUp(false);
      setEmail("");
      setPassword("");
      setConfirmPassword("");
      setSignupComplete(true);
      toast.success("Signed up successfully", {
        description: "Your account was created. Sign in to continue.",
      });
      return;
    } else {
      const authenticatedRole = authenticateAccount(email, password);
      if (!authenticatedRole) {
        toast.error("Account not found", {
          description: "Sign up first or check your credentials.",
        });
        return;
      }
      const authenticatedRoleData = ROLE_DATA[authenticatedRole];
      toast.success(`Welcome to POLARIS (${authenticatedRoleData.title})`, {
        description: `Authenticated into ${authenticatedRole.toUpperCase()} workspace.`,
      });
      navigate({ to: authenticatedRoleData.targetRoute });
      return;
    }
  };

  return (
    <div className="min-h-screen bg-[#07111e] flex flex-col justify-center items-center p-4 md:p-8 relative overflow-hidden">
      {/* Background radial glow */}
      <div className="absolute -top-40 -left-40 h-96 w-96 rounded-full bg-cyan-500/15 blur-3xl" />
      <div className="absolute -bottom-40 -right-40 h-96 w-96 rounded-full bg-blue-600/15 blur-3xl" />

      {/* Top Header */}
      <div className="w-full max-w-5xl mb-4 flex items-center justify-between z-10">
        <Logo />
        <span className="text-xs font-semibold text-slate-300">Secure portal access</span>
      </div>

      {/* Main Split Mockup Auth Card */}
      <div className="relative grid w-full max-w-5xl overflow-hidden rounded-3xl bg-white shadow-2xl md:grid-cols-12 min-h-[640px] border border-cyan-500/30">
        {/* LEFT SIDE: Clean Auth Form matching User's Mockup */}
        <div className="relative p-7 sm:p-9 md:p-11 md:col-span-6 flex flex-col justify-between bg-white text-slate-800">
          <div>
            {/* Header / Title */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl md:text-3xl font-extrabold text-[#0e2a47] tracking-tight uppercase">
                {isSignUp ? "SIGN UP" : "SIGN IN"}
              </h2>
              <div className="flex rounded-full bg-slate-100 p-1 text-[11px] font-bold">
                <button
                  type="button"
                  onClick={() => setIsSignUp(false)}
                  className={cn(
                    "rounded-full px-3 py-1 transition-all",
                    !isSignUp
                      ? "bg-[#18c2ce] text-white shadow-sm"
                      : "text-slate-500 hover:text-slate-800",
                  )}
                >
                  Sign In
                </button>
                <button
                  type="button"
                  onClick={() => setIsSignUp(true)}
                  className={cn(
                    "rounded-full px-3 py-1 transition-all",
                    isSignUp
                      ? "bg-[#18c2ce] text-white shadow-sm"
                      : "text-slate-500 hover:text-slate-800",
                  )}
                >
                  Sign Up
                </button>
              </div>
            </div>

            {/* Mobile-only Glacier Role Selector */}
            {isSignUp && (
              <div className="block md:hidden mb-5 p-3.5 rounded-2xl bg-[#061424] border border-cyan-500/30 text-white shadow-lg">
                <GlacierRoleSelector
                  currentRole={role}
                  onSelectRole={setRole}
                  isSignUp={isSignUp}
                />
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {signupComplete && !isSignUp && (
                <div
                  className="rounded-xl border border-emerald-500/30 bg-emerald-50 px-4 py-3 text-sm text-emerald-800"
                  role="status"
                >
                  <p className="font-bold">Account Created Successfully</p>
                  <p className="mt-1 text-xs">
                    Your Polaris account has been created. Please sign in to continue.
                  </p>
                </div>
              )}
              {formError && (
                <p
                  className="rounded-lg bg-red-50 px-3 py-2 text-xs font-semibold text-red-700"
                  role="alert"
                >
                  {formError}
                </p>
              )}
              {isSignUp && (
                <div className="grid gap-3 sm:grid-cols-3">
                  <input
                    required
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="First name"
                    className="rounded-full bg-[#c7f2f4] px-4 py-3 text-sm text-slate-900 outline-none placeholder:text-slate-500 font-medium"
                  />
                  <input
                    value={middleName}
                    onChange={(e) => setMiddleName(e.target.value)}
                    placeholder="Middle name (opt)"
                    className="rounded-full bg-[#c7f2f4] px-4 py-3 text-sm text-slate-900 outline-none placeholder:text-slate-500 font-medium"
                  />
                  <input
                    required
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="Last name"
                    className="rounded-full bg-[#c7f2f4] px-4 py-3 text-sm text-slate-900 outline-none placeholder:text-slate-500 font-medium"
                  />
                </div>
              )}
              {/* E-mail Input */}
              <div className="relative">
                <div className="flex items-center rounded-full bg-[#c7f2f4] px-4 py-3 text-slate-800 shadow-inner">
                  <User size={18} className="text-[#139ba5] shrink-0 mr-3" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e-mail"
                    className="w-full bg-transparent text-sm text-slate-900 outline-none placeholder:text-slate-500 font-medium"
                  />
                </div>
              </div>

              {isSignUp && (
                <div className="relative flex items-center rounded-full bg-[#c7f2f4] px-4 py-3 text-slate-800 shadow-inner">
                  <Phone size={18} className="text-[#139ba5] shrink-0 mr-3" />
                  <input
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="Phone number"
                    inputMode="tel"
                    className="w-full bg-transparent text-sm text-slate-900 outline-none placeholder:text-slate-500 font-medium"
                  />
                </div>
              )}

              {/* Password Input */}
              <div className="relative">
                <div className="flex items-center rounded-full bg-[#c7f2f4] px-4 py-3 text-slate-800 shadow-inner">
                  <Lock size={18} className="text-[#139ba5] shrink-0 mr-3" />
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="password"
                    className="w-full bg-transparent text-sm text-slate-900 outline-none placeholder:text-slate-500 font-medium"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    className="text-[#139ba5] hover:text-[#0b6b72]"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {isSignUp && (
                <div className="relative flex items-center rounded-full bg-[#c7f2f4] px-4 py-3 text-slate-800 shadow-inner">
                  <Lock size={18} className="mr-3 shrink-0 text-[#139ba5]" />
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="confirm password"
                    className="w-full bg-transparent text-sm text-slate-900 outline-none placeholder:text-slate-500 font-medium"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? "Hide confirm password" : "Show confirm password"}
                    className="text-[#139ba5] hover:text-[#0b6b72]"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              )}

              {/* Terms of Service Checkbox */}
              {isSignUp && (
                <div className="flex items-center gap-2 text-xs text-slate-600 pt-1">
                  <input
                    type="checkbox"
                    id="terms"
                    checked={agreed}
                    onChange={(e) => setAgreed(e.target.checked)}
                    className="h-4 w-4 rounded accent-[#18c2ce] cursor-pointer"
                  />
                  <label htmlFor="terms" className="cursor-pointer">
                    I agree all statements in{" "}
                    <span className="text-[#18c2ce] font-semibold hover:underline">
                      terms of service
                    </span>
                    .
                  </label>
                </div>
              )}

              {/* Primary Cyan Submit Pill Button */}
              <button
                type="submit"
                className="w-full rounded-full bg-[#18c2ce] hover:bg-[#139ba5] py-3 text-sm font-bold text-white uppercase tracking-wider shadow-md transition-all hover:shadow-lg glow-primary cursor-pointer"
              >
                {isSignUp ? "SIGN UP" : "SIGN IN"}
              </button>

              {/* Social Login Icons */}
              <div className="flex items-center justify-start gap-3 pt-2">
                <button
                  type="button"
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-[#3b5998] text-white hover:opacity-90 transition-opacity"
                  title="Sign in with Facebook"
                >
                  <span className="font-bold text-sm">f</span>
                </button>
                <button
                  type="button"
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-[#ea4335] text-white hover:opacity-90 transition-opacity"
                  title="Sign in with Google"
                >
                  <span className="font-bold text-sm">G</span>
                </button>
                <button
                  type="button"
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-[#1da1f2] text-white hover:opacity-90 transition-opacity"
                  title="Sign in with Twitter / MoES SSO"
                >
                  <span className="font-bold text-xs">𝕏</span>
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* RIGHT SIDE: Polar Aurora Visual + 3D Glacier Role Selector directly below image */}
        <div className="hidden md:flex md:col-span-6 flex-col justify-between relative overflow-hidden bg-[#061424]">
          {/* Jagged Iceberg White Border Overlay dividing Left and Right across full height */}
          <svg
            className="absolute -left-1 top-0 bottom-0 h-full w-12 text-white fill-current z-20 pointer-events-none"
            viewBox="0 0 100 1000"
            preserveAspectRatio="none"
          >
            <path d="M0,0 L70,0 C40,120 90,240 50,380 C10,500 85,620 40,760 C80,880 30,950 80,1000 L0,1000 Z" />
          </svg>

          {/* TOP: Polar Aurora Visual Hero */}
          <div className="relative flex-1 min-h-[340px] overflow-hidden flex flex-col justify-end">
            {/* Aurora / Polar Image */}
            <img
              src="https://images.unsplash.com/photo-1517411032315-54ef2cb783bb?auto=format&fit=crop&w=1200&q=85"
              alt="Glacier and snow-covered polar landscape"
              className="absolute inset-0 h-full w-full object-cover object-center"
            />
            <div
              className="absolute inset-0 bg-gradient-to-t from-[#061424] via-black/25 to-black/20"
              aria-hidden="true"
            />

            {/* Snow Animation on Right Visual */}
            <FallingSnow />

            {/* Bold Visual Title Overlay with ample left padding */}
            <div className="relative z-10 pl-16 pr-8 pb-5 pt-8 text-white">
              <h1 className="font-display text-3xl font-black tracking-tight text-white drop-shadow-lg uppercase leading-none">
                POLARIS
              </h1>
              <p className="mt-1.5 font-mono text-xs font-bold uppercase tracking-widest text-cyan-300 drop-shadow">
                DISCOVER POLAR SCIENCE
              </p>
              <p className="mt-2 text-xs leading-relaxed text-slate-200/90 max-w-sm drop-shadow">
                One unified digital gateway bridging Arctic and Antarctic field research, satellite
                cryosphere telemetry, and scientific discovery.
              </p>
            </div>
          </div>

          {/* BOTTOM: Glacier Ice Role Selector Shelf with comfortable spacing */}
          <div className="relative z-10 pl-14 pr-6 py-5 bg-[#061424] border-t border-cyan-500/25">
            <GlacierRoleSelector currentRole={role} onSelectRole={setRole} isSignUp={isSignUp} />
          </div>
        </div>
      </div>
    </div>
  );
}
