"use client";

import { MOCK_AUTH_COOKIE_NAME, type MockAuthState } from "@/lib/mock-auth-state.shared";

function writeCookie(value: MockAuthState) {
  document.cookie = `${MOCK_AUTH_COOKIE_NAME}=${value}; path=/; max-age=31536000; samesite=lax`;
}

export function setMockUserSession(): void {
  writeCookie("user");
}

export function setMockAnonymousSession(): void {
  writeCookie("anonymous");
}

export function setMockAdminSession(): void {
  writeCookie("admin");
}
