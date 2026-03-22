import { describe, expect, it } from "vitest";

import { getAdminNavDisplayName } from "./session-admin-display";

describe("getAdminNavDisplayName", () => {
  it("uses first token of name for Google", () => {
    expect(getAdminNavDisplayName({ name: "Jane Doe", authProvider: "google" })).toBe("Jane");
  });

  it("returns Admin user for email / password auth regardless of name", () => {
    expect(getAdminNavDisplayName({ name: "Jane Doe", authProvider: "password" })).toBe("Admin user");
  });

  it("returns Admin user when Google name is empty after trim", () => {
    expect(getAdminNavDisplayName({ name: "   ", authProvider: "google" })).toBe("Admin user");
  });
});
