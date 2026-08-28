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
  User, Phone,
  Zap,
} from "lucide-react";
import { Logo } from "@/components/polaris/core";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { authenticateAccount, registerAccount, type RegistrationProfile, type Role } from "@/lib/auth";

export const Route = createFileRoute("/login")({
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
    targetRoute: string;
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
            opacity: 0.4 + ((i % 5) * 0.12),
            animationDuration: `${2.5 + (i % 4)}s`,
          }}
        />
      ))}
    </div>
  );
}

function LoginPage() {
  const navigate = useNavigate();
  const roleFromUrl = new URLSearchParams(window.location.search).get("role");
  const [role, setRole] = useState<AuthRole>(() => {
    const requested = roleFromUrl;
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
    const phoneIsValid = /^\+?[0-9()\s.-]{7,20}$/.test(phone.trim()) && phone.replace(/\D/g, "").length >= 7;
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
      const profile: RegistrationProfile = { firstName: firstName.trim(), middleName: middleName.trim() || undefined, lastName: lastName.trim(), phone: phone.trim() };
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
        toast.error("Account not found", { description: "Sign up first or check your credentials." });
        return;
      }
      const authenticatedRoleData = ROLE_DATA[authenticatedRole];
      toast.success(`Welcome to POLARIS (${authenticatedRoleData.title})`, {
        description: `Authenticated into ${authenticatedRole.toUpperCase()} workspace.`,
      });
      navigate({ to: authenticatedRoleData.targetRoute as any });
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
        <span className="text-xs font-semibold text-slate-300">
          Secure portal access
        </span>
      </div>

      {/* Main Split Mockup Auth Card */}
      <div className="relative grid w-full max-w-5xl overflow-hidden rounded-3xl bg-white shadow-2xl md:grid-cols-12 min-h-[580px] border border-cyan-500/30">
        {/* LEFT SIDE: Clean Auth Form matching User's Mockup */}
        <div className="relative p-8 md:p-12 md:col-span-6 flex flex-col justify-between bg-white text-slate-800">
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
                    !isSignUp ? "bg-[#18c2ce] text-white shadow-sm" : "text-slate-500 hover:text-slate-800",
                  )}
                >
                  Sign In
                </button>
                <button
                  type="button"
                  onClick={() => setIsSignUp(true)}
                  className={cn(
                    "rounded-full px-3 py-1 transition-all",
                    isSignUp ? "bg-[#18c2ce] text-white shadow-sm" : "text-slate-500 hover:text-slate-800",
                  )}
                >
                  Sign Up
                </button>
              </div>
            </div>

            {/* Form matching the Cyan Pill Mockup */}
            {isSignUp && (
              <fieldset className="space-y-2">
                <legend className="text-xs font-bold uppercase tracking-wider text-slate-500">Choose your role</legend>
                <div className="grid gap-2 sm:grid-cols-3">
                  {(Object.keys(ROLE_DATA) as AuthRole[]).map((candidate) => {
                    const data = ROLE_DATA[candidate];
                    const Icon = data.icon;
                    return (
                      <button
                        key={candidate}
                        type="button"
                        onClick={() => setRole(candidate)}
                        className={cn(
                          "rounded-xl border p-3 text-left transition-all",
                          role === candidate ? "border-[#18c2ce] bg-[#c7f2f4]" : "border-slate-200 bg-slate-50 hover:border-[#18c2ce]",
                        )}
                      >
                        <span className="flex items-center gap-1.5 text-xs font-bold text-[#0e2a47]"><Icon size={14} /> {data.title}</span>
                        <span className="sr-only">{data.desc}</span>
                      </button>
                    );
                  })}
                </div>
              </fieldset>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {signupComplete && !isSignUp && (
                <div className="rounded-xl border border-emerald-500/30 bg-emerald-50 px-4 py-3 text-sm text-emerald-800" role="status">
                  <p className="font-bold">Account Created Successfully</p>
                  <p className="mt-1 text-xs">Your Polaris account has been created. Please sign in to continue.</p>
                </div>
              )}
              {formError && <p className="rounded-lg bg-red-50 px-3 py-2 text-xs font-semibold text-red-700" role="alert">{formError}</p>}
              {isSignUp && (
                <div className="grid gap-3 sm:grid-cols-3">
                  <input required value={firstName} onChange={(e) => setFirstName(e.target.value)} placeholder="First name" className="rounded-full bg-[#c7f2f4] px-4 py-3 text-sm text-slate-900 outline-none placeholder:text-slate-500" />
                  <input value={middleName} onChange={(e) => setMiddleName(e.target.value)} placeholder="Middle name (optional)" className="rounded-full bg-[#c7f2f4] px-4 py-3 text-sm text-slate-900 outline-none placeholder:text-slate-500" />
                  <input required value={lastName} onChange={(e) => setLastName(e.target.value)} placeholder="Last name" className="rounded-full bg-[#c7f2f4] px-4 py-3 text-sm text-slate-900 outline-none placeholder:text-slate-500" />
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
                <input required value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Phone number" inputMode="tel" className="w-full rounded-full bg-[#c7f2f4] px-4 py-3 text-sm text-slate-900 outline-none placeholder:text-slate-500" />
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
                    className="text-[#139ba5] hover:text-[#0b6b72]"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {isSignUp && (
                <div className="relative flex items-center rounded-full bg-[#c7f2f4] px-4 py-3 text-slate-800 shadow-inner">
                  <Lock size={18} className="mr-3 shrink-0 text-[#139ba5]" />
                  <input type={showPassword ? "text" : "password"} required value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="confirm password" className="w-full bg-transparent text-sm text-slate-900 outline-none placeholder:text-slate-500" />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} aria-label={showPassword ? "Hide confirm password" : "Show confirm password"} className="text-[#139ba5] hover:text-[#0b6b72]">
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              )}

              {/* Terms of Service Checkbox */}
              {isSignUp && <div className="flex items-center gap-2 text-xs text-slate-600 pt-1">
                <input
                  type="checkbox"
                  id="terms"
                  checked={agreed}
                  onChange={(e) => setAgreed(e.target.checked)}
                  className="h-4 w-4 rounded accent-[#18c2ce] cursor-pointer"
                />
                <label htmlFor="terms" className="cursor-pointer">
                  I agree all statements in{" "}
                  <span className="text-[#18c2ce] font-semibold hover:underline">terms of service</span>.
                </label>
              </div>}

              {/* Primary Cyan Submit Pill Button */}
              <button
                type="submit"
                className="w-full rounded-full bg-[#18c2ce] hover:bg-[#139ba5] py-3 text-sm font-bold text-white uppercase tracking-wider shadow-md transition-all hover:shadow-lg glow-primary"
              >
                {isSignUp ? "SIGN UP" : "SIGN IN"}
              </button>

              {/* Social Login Icons */}
              <div className="flex items-center justify-start gap-3 pt-3">
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

        {/* RIGHT SIDE: Glacier field visual inspired by the reference layout */}
        <div className="hidden md:block md:col-span-6 relative overflow-hidden">
          {/* A separate polar image keeps the reference composition while fitting POLARIS. */}
          <img
            src="https://images.unsplash.com/photo-1517411032315-54ef2cb783bb?auto=format&fit=crop&w=1200&q=85"
            alt="Glacier and snow-covered polar landscape"
            className="absolute inset-0 h-full w-full object-cover"
          />
  <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/40"
  aria-hidden="true"
/>
          {/* Jagged Iceberg White Border Overlay dividing Left and Right */}
          <svg
            className="absolute -left-1 top-0 bottom-0 h-full w-14 text-white fill-current z-10"
            viewBox="0 0 100 1000"
            preserveAspectRatio="none"
          >
            <path d="M0,0 L70,0 C40,120 90,240 50,380 C10,500 85,620 40,760 C80,880 30,950 80,1000 L0,1000 Z" />
          </svg>

          {/* Snow Animation on Right Visual */}
          <FallingSnow />

          {/* Bold Visual Title Overlay matching User's Mockup */}
          <div className="relative z-20 flex h-full flex-col justify-end p-8 text-white bg-gradient-to-t from-black/70 via-black/20 to-transparent">
            <h1 className="font-display text-4xl font-black tracking-tight text-white drop-shadow-lg uppercase leading-none">
              POLARIS
            </h1>
            <p className="mt-1 font-mono text-sm font-bold uppercase tracking-widest text-cyan-300 drop-shadow">
              DISCOVER POLAR SCIENCE
            </p>
            <p className="mt-2 text-xs leading-relaxed text-slate-200 max-w-xs drop-shadow">
              One unified digital gateway bridging Arctic and Antarctic field research, satellite
              cryosphere telemetry, and scientific discovery.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
