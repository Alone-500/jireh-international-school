import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const supabasePublishableKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY as string | undefined;

if (!supabaseUrl || !supabasePublishableKey) {
  // Surface a clear error in dev tools instead of a cryptic auth failure later.
  console.warn(
    "[Supabase] VITE_SUPABASE_URL / VITE_SUPABASE_PUBLISHABLE_KEY are not set. Admin sign-in will not work until they are configured.",
  );
}

export const supabase = createClient(supabaseUrl ?? "https://placeholder.supabase.co", supabasePublishableKey ?? "placeholder-key");
