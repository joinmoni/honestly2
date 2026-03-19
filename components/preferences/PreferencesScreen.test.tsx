import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { PreferencesScreen } from "@/components/preferences/PreferencesScreen";
import { updatePassword, updateProfileAvatar } from "@/lib/supabase/auth";

vi.mock("@/lib/supabase/auth", () => ({
  updatePassword: vi.fn(),
  updateProfileAvatar: vi.fn()
}));

describe("PreferencesScreen", () => {
  beforeEach(() => {
    window.localStorage.clear();
    process.env.NEXT_PUBLIC_SUPABASE_URL = "https://example.supabase.co";
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY = "pk_test_123";
  });

  it("shows the core profile photo controls", () => {
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
    expect(screen.getByText("Choose the photo you want to use across Honestly.")).toBeInTheDocument();
    expect(screen.getByText("Upload from device")).toBeInTheDocument();
    expect(screen.getByText("Reset Password")).toBeInTheDocument();
    expect(screen.getByText("Delete Account")).toBeInTheDocument();
  });

  it("resets to the account default and clears any saved override", async () => {
    const user = userEvent.setup();
    window.localStorage.setItem("honestly.profile-avatar-override", "data:image/png;base64,override");
    vi.mocked(updateProfileAvatar).mockResolvedValue(undefined);

    render(
      <PreferencesScreen
        session={{
          id: "usr-001",
          name: "Avery Johnson",
          email: "avery@example.com",
          role: "user",
          authProvider: "password",
          avatarUrl: "https://example.com/avatar.jpg"
        }}
      />
    );

    await user.click(screen.getByRole("button", { name: "Reset photo" }));

    expect(screen.getByText("Profile photo reset.")).toBeInTheDocument();
    expect(window.localStorage.getItem("honestly.profile-avatar-override")).toBeNull();
    expect(updateProfileAvatar).toHaveBeenCalledWith(
      expect.objectContaining({
        userId: "usr-001",
        email: "avery@example.com",
        avatarUrl: null
      })
    );
  });

  it("updates the signed-in password from the security card", async () => {
    const user = userEvent.setup();
    vi.mocked(updatePassword).mockResolvedValue(undefined);

    render(
      <PreferencesScreen
        session={{
          id: "usr-001",
          name: "Avery Johnson",
          email: "avery@example.com",
          role: "user",
          authProvider: "password",
          avatarUrl: "https://example.com/avatar.jpg"
        }}
      />
    );

    await user.click(screen.getByRole("button", { name: "Set new password" }));
    await user.type(screen.getByPlaceholderText("New password"), "new-password-123");
    await user.type(screen.getByPlaceholderText("Confirm password"), "new-password-123");
    await user.click(screen.getByRole("button", { name: "Update password" }));

    expect(updatePassword).toHaveBeenCalledWith("new-password-123");
    expect(await screen.findByText("Password updated.")).toBeInTheDocument();
  });

  it("persists an uploaded avatar through the profile helper", async () => {
    const user = userEvent.setup();
    vi.mocked(updateProfileAvatar).mockResolvedValue("data:image/png;base64,persisted");

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

    const input = screen.getByLabelText("Upload from device") as HTMLInputElement;
    const file = new File(["avatar"], "avatar.png", { type: "image/png" });

    await user.upload(input, file);

    expect(updateProfileAvatar).toHaveBeenCalledWith(
      expect.objectContaining({
        userId: "usr-001",
        email: "avery@example.com",
        avatarUrl: expect.stringContaining("data:image/png;base64")
      })
    );
    expect(await screen.findByText("Profile photo updated.")).toBeInTheDocument();
  });

  it("shows a friendly error when password updates are not connected", async () => {
    const user = userEvent.setup();
    delete process.env.NEXT_PUBLIC_SUPABASE_URL;
    delete process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

    render(
      <PreferencesScreen
        session={{
          id: "usr-001",
          name: "Avery Johnson",
          email: "avery@example.com",
          role: "user",
          authProvider: "password",
          avatarUrl: "https://example.com/avatar.jpg"
        }}
      />
    );

    await user.click(screen.getByRole("button", { name: "Set new password" }));
    await user.type(screen.getByPlaceholderText("New password"), "new-password-123");
    await user.type(screen.getByPlaceholderText("Confirm password"), "new-password-123");
    await user.click(screen.getByRole("button", { name: "Update password" }));

    expect(await screen.findByText("Password updates are not connected yet.")).toBeInTheDocument();
  });

  it("opens a confirmed account deletion request flow", async () => {
    const user = userEvent.setup();

    render(
      <PreferencesScreen
        session={{
          id: "usr-001",
          name: "Avery Johnson",
          email: "avery@example.com",
          role: "user",
          authProvider: "password",
          avatarUrl: "https://example.com/avatar.jpg"
        }}
      />
    );

    await user.click(screen.getByRole("button", { name: "Delete account" }));

    const requestLink = screen.getByRole("link", { name: "Open deletion request" });
    expect(requestLink).toHaveAttribute("href", expect.stringContaining("mailto:support@honestly.com"));
    expect(screen.getByText(/Confirm your request/)).toBeInTheDocument();
  });
});
