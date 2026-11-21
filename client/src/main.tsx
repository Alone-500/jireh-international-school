import { trpc } from "@/lib/trpc";
import { supabase } from "@/lib/supabase";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { httpBatchLink } from "@trpc/client";
import { createRoot } from "react-dom/client";
import superjson from "superjson";
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

// Dismiss the static splash once React is up — always within 2 seconds.
// The progress bar tracks real load milestones (12% paint → 55% DOM ready →
// 90% assets loaded → 100% when React mounts), so it moves as fast as the page.
const splash = document.getElementById("splash");
if (splash) {
  let hidden = false;
  const hide = () => {
    if (hidden) return;
    hidden = true;
    splash.classList.add("hide");
    window.setTimeout(() => splash.remove(), 500);
  };
  (window as unknown as { __splashProgress?: (p: number) => void }).__splashProgress?.(100);
  window.setTimeout(hide, 220); // brief beat so the full bar registers
  window.setTimeout(hide, 2000); // absolute cap — never longer than 2s
}

createRoot(document.getElementById("root")!).render(
  <trpc.Provider client={trpcClient} queryClient={queryClient}>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </trpc.Provider>
);
