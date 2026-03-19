import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { AuthScreen } from "@/components/auth/AuthScreen";
import { isSupabaseConfigured } from "@/lib/config/app-env";
import type { AuthPageCopy } from "@/lib/types/auth-page";
import { signInWithEmailOtp, signInWithGoogle } from "@/lib/supabase/auth";

vi.mock("@/lib/config/app-env", () => ({
  isSupabaseConfigured: vi.fn(() => true)
}));

vi.mock("@/lib/supabase/auth", () => ({
  signInWithEmailOtp: vi.fn(),
  signInWithGoogle: vi.fn(),
  getBrowserSupabaseSession: vi.fn()
}));

const authCopy: AuthPageCopy = {
  heading: "Welcome back",
  subheading: "Sign in to your account",
  googleCta: "Continue with Google",
  dividerLabel: "or",
  emailPlaceholder: "Email address",
  continueCta: "Continue",
  termsPrefix: "By continuing you agree to our",
  termsLabel: "Terms",
  privacyLabel: "Privacy Policy",
  professionalPrompt: "Want to list your business?",
  listBusinessLabel: "Apply here",
  quoteText: "Curated with intention.",
  quoteAuthor: "Honestly",
  heroImageUrl: "https://images.example.com/auth.jpg"
};

describe("AuthScreen", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("shows a validation message when email is empty", async () => {
    const user = userEvent.setup();

    render(<AuthScreen copy={authCopy} />);

    await user.click(screen.getByRole("button", { name: "Continue" }));

    expect(screen.getByText("Enter your email address to continue.")).toBeInTheDocument();
    expect(signInWithEmailOtp).not.toHaveBeenCalled();
  });

  it("starts Google sign-in when requested", async () => {
    const user = userEvent.setup();

    render(<AuthScreen copy={authCopy} nextPath="/preferences" />);

    await user.click(screen.getByRole("button", { name: "Continue with Google" }));

    expect(signInWithGoogle).toHaveBeenCalledWith("/preferences");
  });

  it("shows a success message after requesting an email sign-in link", async () => {
    const user = userEvent.setup();
    vi.mocked(signInWithEmailOtp).mockResolvedValue(undefined);

    render(<AuthScreen copy={authCopy} nextPath="/lists" />);

    await user.type(screen.getByLabelText("Email address"), "avery@example.com");
    await user.click(screen.getByRole("button", { name: "Continue" }));

    expect(signInWithEmailOtp).toHaveBeenCalledWith("avery@example.com", "/lists");
    expect(screen.getByText("Check avery@example.com for your sign-in link.")).toBeInTheDocument();
  });

  it("shows auth errors from the provider helpers", async () => {
    const user = userEvent.setup();
    vi.mocked(signInWithGoogle).mockRejectedValue(new Error("Google is unavailable right now."));

    render(<AuthScreen copy={authCopy} />);

    await user.click(screen.getByRole("button", { name: "Continue with Google" }));

    expect(screen.getByText("Google is unavailable right now.")).toBeInTheDocument();
  });

  it("shows a friendly message instead of raw config errors when auth is not connected", async () => {
    const user = userEvent.setup();
    vi.mocked(isSupabaseConfigured).mockReturnValue(false);

    render(<AuthScreen copy={authCopy} />);

    await user.click(screen.getByRole("button", { name: "Continue with Google" }));

    expect(screen.getByText("Sign-in will be available once authentication is connected.")).toBeInTheDocument();
    expect(signInWithGoogle).not.toHaveBeenCalled();
  });
});
