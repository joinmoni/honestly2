import React from "react";
import { render, screen } from "@testing-library/react";

import LoginError from "@/app/login/error";

describe("login route error", () => {
  it("renders route-specific login error copy", () => {
    render(<LoginError error={new Error("boom")} reset={vi.fn()} />);

    expect(screen.getByText("We couldn't open sign in")).toBeInTheDocument();
  });
});
