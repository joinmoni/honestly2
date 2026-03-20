import { cookies } from "next/headers";

import { MOCK_AUTH_COOKIE_NAME, normalizeMockAuthState, type MockAuthState } from "@/lib/mock-auth-state.shared";

export async function getServerMockAuthState(): Promise<MockAuthState> {
  const cookieStore = await cookies();
  return normalizeMockAuthState(cookieStore.get(MOCK_AUTH_COOKIE_NAME)?.value);
}
