export const MOCK_AUTH_COOKIE_NAME = "honestly-mock-auth";

export type MockAuthState = "user" | "admin" | "anonymous";

export function normalizeMockAuthState(value?: string | null): MockAuthState {
  if (value === "admin") return "admin";
  if (value === "anonymous") return "anonymous";
  return "user";
}
