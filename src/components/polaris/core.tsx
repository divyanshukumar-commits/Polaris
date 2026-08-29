import {
  useEffect,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
  type ReactNode,
} from "react";
import { Link } from "@tanstack/react-router";
import { Satellite } from "lucide-react";
import { cn } from "@/lib/utils";

export function Logo({ compact = false }: { compact?: boolean }) {
  return (
    <Link to="/" className="flex items-center gap-2.5 group">
      <span className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-primary/15 border border-primary/30 glow-primary">
        <Satellite className="h-4.5 w-4.5 text-primary" size={18} />
      </span>
      {!compact && (
        <span className="font-display text-lg font-bold tracking-[0.18em] text-foreground">
          POLAR<span className="text-primary">IS</span>
        </span>
      )}
    </Link>
  );
}

type CursorPoint = { x: number; y: number; id: number };
type CursorEffect = CursorPoint & { kind: "wave" | "drop" | "scan" | "snow" };

export function WaterSurface({ children, className }: { children: ReactNode; className?: string }) {
  const [ripples, setRipples] = useState<Array<{ id: number; x: number; y: number }>>([]);

  const moveSurface = (event: ReactPointerEvent<HTMLDivElement>) => {
    const bounds = event.currentTarget.getBoundingClientRect();
    event.currentTarget.style.setProperty("--water-x", `${event.clientX - bounds.left}px`);
    event.currentTarget.style.setProperty("--water-y", `${event.clientY - bounds.top}px`);
  };

  const createRipple = (event: ReactPointerEvent<HTMLDivElement>) => {
    const bounds = event.currentTarget.getBoundingClientRect();
    const ripple = {
      id: Date.now() + Math.random(),
      x: event.clientX - bounds.left,
      y: event.clientY - bounds.top,
    };
    setRipples((previous) => [...previous, ripple].slice(-8));
    window.setTimeout(
      () => setRipples((previous) => previous.filter((item) => item.id !== ripple.id)),
      1100,
    );
  };

  return (
    <div
      className={cn("water-surface", className)}
      onPointerMove={moveSurface}
      onPointerDown={createRipple}
    >
      {children}
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
        {ripples.map((ripple) => (
          <span
            key={ripple.id}
            className="water-ripple-group"
            style={{ left: ripple.x, top: ripple.y }}
          >
            <span className="water-ripple water-ripple-primary" />
            <span className="water-ripple water-ripple-secondary" />
            <span className="water-ripple water-ripple-tertiary" />
          </span>
        ))}
      </div>
    </div>
  );
}

type ClickRipple = {
  id: number;
  x: number;
  y: number;
};

export function PolarCursor() {
  const [ripples, setRipples] = useState<ClickRipple[]>([]);

  useEffect(() => {
    const desktop = window.matchMedia("(pointer: fine)");
    if (!desktop.matches) return;

    let nextId = 0;
    const handleClick = (event: MouseEvent) => {
      const ripple: ClickRipple = {
        id: nextId++,
        x: event.clientX,
        y: event.clientY,
      };
      setRipples((prev) => [...prev, ripple].slice(-6));
      window.setTimeout(() => {
        setRipples((prev) => prev.filter((r) => r.id !== ripple.id));
      }, 650);
    };

    document.addEventListener("click", handleClick);
    return () => {
      document.removeEventListener("click", handleClick);
    };
  }, []);

  if (ripples.length === 0) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-[100] overflow-hidden" aria-hidden="true">
      {ripples.map((ripple) => (
        <span
          key={ripple.id}
          className="polar-click-ripple"
          style={{ left: ripple.x, top: ripple.y }}
        />
      ))}
    </div>
  );
}

export function PageHeader({
  eyebrow,
  title,
  description,
  children,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  children?: ReactNode;
}) {
  return (
    <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
      <div className="max-w-2xl">
        {eyebrow && (
          <p className="mb-2 font-mono text-[11px] uppercase tracking-[0.25em] text-primary">
            {eyebrow}
          </p>
        )}
        <h1 className="font-display text-3xl font-bold tracking-tight text-foreground md:text-4xl">
          {title}
        </h1>
        {description && (
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{description}</p>
        )}
      </div>
      {children}
    </div>
  );
}

export function SectionTitle({ title, action }: { title: string; action?: ReactNode }) {
  return (
    <div className="mb-4 flex items-center justify-between">
      <h2 className="font-display text-lg font-semibold text-foreground">{title}</h2>
      {action}
    </div>
  );
}

export function AnimatedNumber({
  value,
  suffix = "",
}: {
  value: number;
  suffix?: string | undefined;
}) {
  const [display, setDisplay] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let frame = 0;
    const obs = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry?.isIntersecting && !started.current) {
          started.current = true;
          const start = performance.now();
          const dur = 1400;
          const tick = (now: number) => {
            const p = Math.min((now - start) / dur, 1);
            const eased = 1 - Math.pow(1 - p, 3);
            if (p < 1) {
              const noise = Math.round((Math.random() - 0.5) * Math.max(3, value * 0.04));
              setDisplay(Math.max(0, Math.min(value, Math.round(value * eased) + noise)));
              frame = requestAnimationFrame(tick);
            } else {
              setDisplay(value);
            }
          };
          frame = requestAnimationFrame(tick);
        }
      },
      { threshold: 0.4 },
    );
    obs.observe(el);
    return () => {
      obs.disconnect();
      if (frame) cancelAnimationFrame(frame);
    };
  }, [value]);

  return (
    <span ref={ref}>
      {display.toLocaleString()}
      {suffix}
    </span>
  );
}

export function StatCard({
  icon,
  label,
  value,
  suffix,
  hint,
}: {
  icon: ReactNode;
  label: string;
  value: number;
  suffix?: string | undefined;
  hint?: string | undefined;
}) {
  return (
    <div className="glass card-hover-lift rounded-2xl p-5 glow-soft">
      <div className="flex items-center justify-between">
        <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/12 text-primary border border-primary/20">
          {icon}
        </span>
        {hint && (
          <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
            {hint}
          </span>
        )}
      </div>
      <p className="mt-4 font-display text-3xl font-bold text-foreground">
        <AnimatedNumber value={value} suffix={suffix} />
      </p>
      <p className="mt-1 text-xs font-medium text-muted-foreground">{label}</p>
    </div>
  );
}

const statusStyles: Record<string, string> = {
  Published: "bg-success/15 text-success border-success/30",
  Active: "bg-success/15 text-success border-success/30",
  Completed: "bg-secondary text-secondary-foreground border-border",
  Upcoming: "bg-warning/15 text-warning border-warning/30",
  "Pending Review": "bg-warning/15 text-warning border-warning/30",
  Draft: "bg-secondary text-secondary-foreground border-border",
  Rejected: "bg-destructive/15 text-destructive border-destructive/30",
  Disabled: "bg-destructive/15 text-destructive border-destructive/30",
};

export function StatusBadge({ status, className }: { status: string; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[11px] font-semibold",
        statusStyles[status] ?? "bg-secondary text-secondary-foreground border-border",
        className,
      )}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {status}
    </span>
  );
}

export function EmptyState({
  icon,
  title,
  description,
}: {
  icon: ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="glass flex flex-col items-center justify-center rounded-2xl border-dashed px-6 py-16 text-center">
      <span className="flex h-12 w-12 items-center justify-center rounded-full bg-secondary text-muted-foreground">
        {icon}
      </span>
      <h3 className="mt-4 font-display text-base font-semibold text-foreground">{title}</h3>
      <p className="mt-1 max-w-sm text-sm text-muted-foreground">{description}</p>
    </div>
  );
}

export function RegionTag({ region }: { region: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider",
        region === "Arctic"
          ? "border-chart-2/40 bg-chart-2/10 text-chart-2"
          : "border-primary/40 bg-primary/10 text-primary",
      )}
    >
      {region}
    </span>
  );
}
