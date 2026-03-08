import React from "react";
import { render, screen } from "@testing-library/react";

import { PreferencesScreen } from "@/components/preferences/PreferencesScreen";

describe("PreferencesScreen", () => {
  it("shows provider-linked avatar guidance for Google accounts", () => {
    render(
      <PreferencesScreen
        session={{
          id: "usr-001",
          name: "Avery Johnson",
          email: "avery@example.com",
          role: "user",
          authProvider: "google",
          avatarUrl: "https://example.com/avatar.jpg"
        }}
      />
    );

    expect(screen.getByText("Profile & Photo")).toBeInTheDocument();
    expect(screen.getByText("Google")).toBeInTheDocument();
    expect(screen.getByText(/synced from Google/i)).toBeInTheDocument();
    expect(screen.getByText("Upload from device")).toBeInTheDocument();
  });
});
