import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { RouteErrorScreen } from "@/components/ui/RouteErrorScreen";

describe("RouteErrorScreen", () => {
  it("renders error copy and retries when requested", async () => {
    const user = userEvent.setup();
    const onRetry = vi.fn();

    render(<RouteErrorScreen onRetry={onRetry} />);

    expect(screen.getByText("We couldn't load this page")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Go home" })).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Try again" }));
    expect(onRetry).toHaveBeenCalledTimes(1);
  });
});
