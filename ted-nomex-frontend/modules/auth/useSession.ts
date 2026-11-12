"use client";

import { useEffect, useState } from "react";
import { getSession, type SessionUser } from "@/modules/auth/session";

export function useSession() {
  const [user, setUser] = useState<SessionUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;

    (async () => {
      const u = await getSession();
      if (alive) {
        setUser(u);
        setLoading(false);
      }
    })();

    const refresh = async () => {
      const u = await getSession();
      if (alive) setUser(u);
    };

    window.addEventListener("ted-auth-changed", refresh);
    window.addEventListener("storage", refresh);

    return () => {
      alive = false;
      window.removeEventListener("ted-auth-changed", refresh);
      window.removeEventListener("storage", refresh);
    };
  }, []);

  return { user, loading };
}