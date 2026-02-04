import { useEffect, useState } from "react";
import posthog from "posthog-js";
import { PostHogProvider } from "posthog-js/react";

export function PHProvider({ children }: { children: React.ReactNode }) {
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    posthog.init("phc_2lrYCRtF5n8ZsXwU5jqGy7642SOu7aXFwV72mQ2VMTa", {
      api_host: "https://us.i.posthog.com",
      defaults: "2025-11-30",
      person_profiles: "identified_only", // or 'always' to create profiles for anonymous users as well
    });

    setHydrated(true);
  }, []);

  if (!hydrated) return <>{children}</>;
  return <PostHogProvider client={posthog}>{children}</PostHogProvider>;
}
