export function isDummyClerkKey(key?: string): boolean {
  const pubKey = key || process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY || "";
  if (!pubKey) return true;
  if (pubKey === "pk_test_Y2xlcmsuZXhhbXBsZS5jb20k") return true;
  if (pubKey.includes("example.com") || pubKey.startsWith("pk_test_sample")) return true;

  try {
    const raw = pubKey.replace(/^pk_(test|live)_/, "");
    const decoded = Buffer.from(raw, "base64").toString("utf-8");
    if (decoded.includes("example.com") || decoded.includes("sample")) return true;
  } catch {
    // Ignore error
  }

  return false;
}
