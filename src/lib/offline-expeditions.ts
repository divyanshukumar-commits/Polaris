import { useState, useEffect, useCallback } from "react";
import type { Expedition } from "./data/types";
import { expeditions } from "./data/expeditions";
import { toast } from "sonner";

const OFFLINE_CACHE_KEY = "polaris_offline_expeditions_v1";

export interface CachedExpeditionRecord {
  expedition: Expedition;
  cachedAt: string;
}

export function getCachedExpeditions(): Record<string, CachedExpeditionRecord> {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(OFFLINE_CACHE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

export function getCachedExpedition(id: string): CachedExpeditionRecord | null {
  const cache = getCachedExpeditions();
  return cache[id] ?? null;
}

export function isExpeditionCached(id: string): boolean {
  return Boolean(getCachedExpeditions()[id]);
}

export function cacheExpedition(expedition: Expedition): boolean {
  if (typeof window === "undefined") return false;
  try {
    const cache = getCachedExpeditions();
    cache[expedition.id] = {
      expedition,
      cachedAt: new Date().toISOString(),
    };
    localStorage.setItem(OFFLINE_CACHE_KEY, JSON.stringify(cache));
    return true;
  } catch (err) {
    console.error("Failed to cache expedition offline:", err);
    return false;
  }
}

export function removeCachedExpedition(id: string): boolean {
  if (typeof window === "undefined") return false;
  try {
    const cache = getCachedExpeditions();
    if (cache[id]) {
      delete cache[id];
      localStorage.setItem(OFFLINE_CACHE_KEY, JSON.stringify(cache));
    }
    return true;
  } catch {
    return false;
  }
}

export function cacheAllExpeditions(): number {
  if (typeof window === "undefined") return 0;
  try {
    const cache = getCachedExpeditions();
    const now = new Date().toISOString();
    expeditions.forEach((exp) => {
      cache[exp.id] = {
        expedition: exp,
        cachedAt: now,
      };
    });
    localStorage.setItem(OFFLINE_CACHE_KEY, JSON.stringify(cache));
    return expeditions.length;
  } catch {
    return 0;
  }
}

export function clearAllCachedExpeditions() {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(OFFLINE_CACHE_KEY);
  } catch {
    // ignore
  }
}

export function useOfflineStatus() {
  const [isOnline, setIsOnline] = useState<boolean>(() => {
    return typeof navigator !== "undefined" ? navigator.onLine : true;
  });
  const [isSimulatedOffline, setIsSimulatedOffline] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSyncedAt, setLastSyncedAt] = useState<Date>(() => new Date());

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      toast.success("Network connection restored", {
        description: "POLARIS synchronized latest satellite telemetry and expedition logs.",
      });
    };

    const handleOffline = () => {
      setIsOnline(false);
      toast.warning("Network connection lost", {
        description:
          "Operating in offline mode. Accessing cached expedition records and field data.",
      });
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  const syncNow = useCallback(async () => {
    setIsSyncing(true);
    try {
      // Simulate network sync/handshake
      await new Promise((res) => setTimeout(res, 800));
      if (!isOnline && !isSimulatedOffline) {
        toast.error("Network still unavailable", {
          description:
            "Cannot sync with POLARIS cloud servers while offline. Using cached storage.",
        });
      } else {
        setLastSyncedAt(new Date());
        toast.success("Sync complete", {
          description: "All expedition telemetry, coordinates, and team rosters are up to date.",
        });
      }
    } finally {
      setIsSyncing(false);
    }
  }, [isOnline, isSimulatedOffline]);

  const toggleSimulatedOffline = useCallback(() => {
    setIsSimulatedOffline((prev) => {
      const next = !prev;
      if (next) {
        toast.info("Offline mode simulated", {
          description: "Testing offline viewing with locally cached research expeditions.",
        });
      } else {
        toast.success("Offline simulation disabled", {
          description: "Connected to live POLARIS portal feeds.",
        });
      }
      return next;
    });
  }, []);

  const effectiveOnline = isOnline && !isSimulatedOffline;

  return {
    isOnline: effectiveOnline,
    rawOnline: isOnline,
    isSimulatedOffline,
    isSyncing,
    lastSyncedAt,
    syncNow,
    toggleSimulatedOffline,
  };
}
