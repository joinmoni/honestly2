import React from "react";
import { render, screen } from "@testing-library/react";

import { ReviewList } from "@/components/vendor/ReviewList";

describe("ReviewList empty state", () => {
  it("renders an explicit empty state when there are no reviews", () => {
    render(<ReviewList reviews={[]} />);

    expect(screen.getByText("No reviews yet")).toBeInTheDocument();
    expect(screen.getByText("This profile has not received any published feedback yet.")).toBeInTheDocument();
  });
});
