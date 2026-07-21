import posthog from "posthog-js";

const token = process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN;
const host = process.env.NEXT_PUBLIC_POSTHOG_HOST;

if (!token || !host) {
  throw new Error("PostHog environment variables are not configured");
}

posthog.init(token, {
  api_host: host,
  person_profiles: "identified_only",
  defaults: "2026-01-30",
  autocapture: false,
  capture_exceptions: true,
  debug: process.env.NODE_ENV === "development",
});
