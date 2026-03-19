import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { ProfileMenu } from "@/components/ui/ProfileMenu";
import { isSupabaseConfigured } from "@/lib/config/app-env";
import { signOut } from "@/lib/supabase/auth";
import { routerPushMock, routerRefreshMock } from "@/vitest.setup";

vi.mock("@/lib/config/app-env", () => ({
  isSupabaseConfigured: vi.fn(() => true)
}));

vi.mock("@/lib/supabase/auth", () => ({
  signOut: vi.fn()
}));

describe("ProfileMenu", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("signs the user out and redirects to login", async () => {
    const user = userEvent.setup();
    vi.mocked(signOut).mockResolvedValue(undefined);

    render(<ProfileMenu name="Avery Johnson" email="avery@example.com" />);

    await user.click(screen.getByRole("button", { name: "Open profile menu" }));
    await user.click(screen.getByRole("menuitem", { name: "Logout" }));

    expect(signOut).toHaveBeenCalledTimes(1);
    expect(routerPushMock).toHaveBeenCalledWith("/login");
    expect(routerRefreshMock).toHaveBeenCalledTimes(1);
  });

  it("falls back to a local login redirect when Supabase is not configured", async () => {
    const user = userEvent.setup();
    vi.mocked(isSupabaseConfigured).mockReturnValue(false);

    render(<ProfileMenu name="Avery Johnson" email="avery@example.com" />);

    await user.click(screen.getByRole("button", { name: "Open profile menu" }));
    await user.click(screen.getByRole("menuitem", { name: "Logout" }));

    expect(signOut).not.toHaveBeenCalled();
    expect(routerPushMock).toHaveBeenCalledWith("/login");
    expect(routerRefreshMock).toHaveBeenCalledTimes(1);
  });
});
