"use client";

import { useEffect } from "react";
import type { Session } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/client";
import { useAppDispatch } from "@/store/hooks";
import { setSession, setHasProfile } from "@/store/slices/userSlice";

export default function AuthListener() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    const supabase = createClient();

    async function syncSession(session: Session | null) {
      dispatch(
        setSession({
          isLoggedIn: !!session,
          email: session?.user.email ?? null,
        })
      );

      if (!session) return;

      const { data: profile } = await supabase
        .from("profiles")
        .select("id")
        .eq("id", session.user.id)
        .maybeSingle();

      dispatch(setHasProfile(!!profile));
    }

    supabase.auth.getSession().then(({ data }) => syncSession(data.session));

    const { data: subscription } = supabase.auth.onAuthStateChange((_event, session) => {
      syncSession(session);
    });

    return () => subscription.subscription.unsubscribe();
  }, [dispatch]);

  return null;
}