import React from "react";
import { render, screen } from "@testing-library/react";

import VendorDetailError from "@/app/vendor/[slug]/error";

describe("vendor detail route error", () => {
  it("renders route-specific vendor detail error copy", () => {
    render(<VendorDetailError error={new Error("boom")} reset={vi.fn()} />);

    expect(screen.getByText("This vendor profile isn't available right now")).toBeInTheDocument();
  });
});
