import React from "react";
import { render, screen } from "@testing-library/react";

import VendorsError from "@/app/vendors/error";

describe("vendors route error", () => {
  it("renders route-specific vendors error copy", () => {
    render(<VendorsError error={new Error("boom")} reset={vi.fn()} />);

    expect(screen.getByText("We couldn't load vendors right now")).toBeInTheDocument();
  });
});
