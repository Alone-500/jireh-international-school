import { trpc } from "@/lib/trpc";
import { supabase } from "@/lib/supabase";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { httpBatchLink } from "@trpc/client";
import { createRoot } from "react-dom/client";
import superjson from "superjson";
import { useEffect } from "react";
import App from "./App";
import "./index.css";

const queryClient = new QueryClient();

const trpcClient = trpc.createClient({
  links: [
    httpBatchLink({
      url: "/api/trpc",
      transformer: superjson,
      headers: async () => {
        // Forward the Supabase access token so the API can authorise admin calls.
        const { data } = await supabase.auth.getSession();
        const token = data.session?.access_token;
        return token ? { Authorization: `Bearer ${token}` } : {};
      },
      fetch(input, init) {
        return globalThis.fetch(input, {
          ...(init ?? {}),
          credentials: "include",
        });
      },
    }),
  ],
});

// The splash ends only when (a) every asset has been retrieved (window "load",
// handled in index.html) and (b) React has mounted and painted (signalled here).
// SplashFinisher fires after React commits its first paint.
function SplashFinisher() {
  useEffect(() => {
    (window as unknown as { __splashMarkReact?: () => void }).__splashMarkReact?.();
  }, []);
  return null;
}

createRoot(document.getElementById("root")!).render(
  <trpc.Provider client={trpcClient} queryClient={queryClient}>
    <QueryClientProvider client={queryClient}>
      <App />
      <SplashFinisher />
    </QueryClientProvider>
  </trpc.Provider>
);
