import { supabase } from "@/lib/supabase";
import { trpc } from "@/lib/trpc";
import { useCallback, useEffect, useState } from "react";

/**
 * Session state for the admin area, backed by Supabase Auth.
 * `user` is null until Supabase has a session AND the server has validated it
 * (server also applies the ADMIN_EMAILS allowlist to grant role="admin").
 */
export function useAuth() {
  const utils = trpc.useUtils();
  const [sessionReady, setSessionReady] = useState(false);
  const [hasSession, setHasSession] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setHasSession(Boolean(data.session));
      setSessionReady(true);
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setHasSession(Boolean(session));
      utils.auth.me.invalidate();
    });

    return () => listener.subscription.unsubscribe();
  }, [utils]);

  const meQuery = trpc.auth.me.useQuery(undefined, {
    retry: false,
    refetchOnWindowFocus: false,
    enabled: hasSession,
  });

  const logout = useCallback(async () => {
    try {
      await supabase.auth.signOut();
    } finally {
      await utils.auth.me.invalidate();
    }
  }, [utils]);

  const loading = !sessionReady || (hasSession && meQuery.isLoading);

  return {
    user: hasSession ? meQuery.data ?? null : null,
    loading,
    error: meQuery.error ?? null,
    isAuthenticated: hasSession,
    logout,
    refresh: () => meQuery.refetch(),
  };
}
