import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
  Zap,
} from "lucide-react";
import { Logo } from "@/components/polaris/core";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

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

type AuthRole = "user" | "researcher" | "admin";

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
    desc: "Explore polar research, timeline milestones, satellite records, and voice AI assistant.",
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
  const [role, setRole] = useState<AuthRole>("user");
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState(ROLE_DATA.user.defaultEmail);
  const [password, setPassword] = useState("••••••••••••");
  const [showPassword, setShowPassword] = useState(false);
  const [agreed, setAgreed] = useState(true);
  const [isFreezing, setIsFreezing] = useState(false);

  const currentRole = ROLE_DATA[role];

  const handleRoleSwitch = (newRole: AuthRole) => {
    if (newRole === role) return;
    setIsFreezing(true);
    setRole(newRole);
    setEmail(ROLE_DATA[newRole].defaultEmail);
    setTimeout(() => setIsFreezing(false), 600);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!agreed) {
      toast.error("Please agree to the terms of service.");
      return;
    }
    toast.success(`Welcome to POLARIS (${currentRole.title})`, {
      description: `Authenticated into ${role.toUpperCase()} workspace.`,
    });
    navigate({ to: currentRole.targetRoute as any });
  };

  return (
    <div className="min-h-screen bg-[#07111e] flex flex-col justify-center items-center p-4 md:p-8 relative overflow-hidden">
      {/* Background radial glow */}
      <div className="absolute -top-40 -left-40 h-96 w-96 rounded-full bg-cyan-500/15 blur-3xl" />
      <div className="absolute -bottom-40 -right-40 h-96 w-96 rounded-full bg-blue-600/15 blur-3xl" />

      {/* Top Header */}
      <div className="w-full max-w-5xl mb-4 flex items-center justify-between z-10">
        <Logo />
        <Link
          to="/"
          className="text-xs font-semibold text-slate-300 hover:text-primary transition-colors flex items-center gap-1"
        >
          ← Back to Homepage
        </Link>
      </div>

      {/* Main Split Mockup Auth Card */}
      <div className="relative grid w-full max-w-5xl overflow-hidden rounded-3xl bg-white shadow-2xl md:grid-cols-12 min-h-[580px] border border-cyan-500/30">
        {/* LEFT SIDE: Clean Auth Form matching User's Mockup */}
        <div className="relative p-8 md:p-12 md:col-span-6 flex flex-col justify-between bg-white text-slate-800">
          {/* Animated Frost Freeze Flash */}
          <AnimatePresence>
            {isFreezing && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="pointer-events-none absolute inset-0 z-30 bg-gradient-to-b from-cyan-300/30 via-blue-200/20 to-cyan-100/40 backdrop-blur-[2px] flex items-center justify-center"
              >
                <FallingSnow />
                <div className="rounded-full bg-white/90 border border-cyan-400 px-4 py-1.5 shadow-lg text-xs font-bold text-cyan-800 flex items-center gap-2">
                  <span className="animate-spin">❄️</span> Freezing & Switching to {currentRole.title}…
                </div>
              </motion.div>
            )}
          </AnimatePresence>

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
            <form onSubmit={handleSubmit} className="space-y-4">
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

              {/* Terms of Service Checkbox */}
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
                  <span className="text-[#18c2ce] font-semibold hover:underline">terms of service</span>.
                </label>
              </div>

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

          {/* BOTTOM ROLE SWITCHER WITH FREEZE/SNOW EFFECTS (From User's Drawing) */}
          <div className="mt-8 pt-5 border-t border-slate-200">
            <div className="flex items-center justify-between mb-2">
              <span className="font-mono text-[10px] uppercase font-bold text-slate-500">
                Current Role: <span className="text-[#139ba5] uppercase">{role}</span>
              </span>
              <span className="text-[10px] text-slate-400 font-mono">USER opens by default · Click to freeze & switch</span>
            </div>

            <div className="grid grid-cols-2 gap-2">
              {/* Admin Button */}
              <button
                type="button"
                onClick={() => handleRoleSwitch("admin")}
                className={cn(
                  "flex items-center justify-center gap-1.5 rounded-full py-2 px-3 text-xs font-bold transition-all border",
                  role === "admin"
                    ? "bg-[#0e2a47] text-white border-[#0e2a47] shadow-md ring-2 ring-slate-300"
                    : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100",
                )}
              >
                <ShieldCheck size={13} />
                <span>ADMIN</span>
              </button>

              {/* Researcher Button */}
              <button
                type="button"
                onClick={() => handleRoleSwitch("researcher")}
                className={cn(
                  "flex items-center justify-center gap-1.5 rounded-full py-2 px-3 text-xs font-bold transition-all border",
                  role === "researcher"
                    ? "bg-[#0284c7] text-white border-[#0284c7] shadow-md ring-2 ring-blue-200"
                    : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100",
                )}
              >
                <FlaskConical size={13} />
                <span>RESEARCHER</span>
              </button>
            </div>
          </div>
        </div>

        {/* RIGHT SIDE: Glacier field visual inspired by the reference layout */}
        <div className="hidden md:block md:col-span-6 relative overflow-hidden">
          {/* A separate polar image keeps the reference composition while fitting POLARIS. */}
          <img
            src="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=85"
            alt="Snow-covered polar mountain and glacier landscape"
            className="absolute inset-0 h-full w-full object-cover"
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
