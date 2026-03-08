export type DataProvider = "mock" | "supabase";

export type SupabasePublicEnv = {
  url: string;
  publishableKey: string;
};

export type SupabaseServerEnv = SupabasePublicEnv & {
  serviceRoleKey: string;
};

function readEnv(name: string): string | undefined {
  const value = process.env[name];
  if (!value) return undefined;
  const trimmed = value.trim();
  return trimmed.length ? trimmed : undefined;
}

export function getDataProvider(): DataProvider {
  const raw = readEnv("HONESTLY_DATA_PROVIDER");
  if (raw === "supabase") return "supabase";
  return "mock";
}

export function getSupabasePublicEnv(): SupabasePublicEnv | null {
  const url = readEnv("NEXT_PUBLIC_SUPABASE_URL");
  const publishableKey = readEnv("NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY");

  if (!url || !publishableKey) return null;

  return { url, publishableKey };
}

export function getSupabaseServerEnv(): SupabaseServerEnv | null {
  const publicEnv = getSupabasePublicEnv();
  const serviceRoleKey = readEnv("SUPABASE_SERVICE_ROLE_KEY");

  if (!publicEnv || !serviceRoleKey) return null;

  return {
    ...publicEnv,
    serviceRoleKey
  };
}

export function isSupabaseConfigured(): boolean {
  return getSupabasePublicEnv() !== null;
}
