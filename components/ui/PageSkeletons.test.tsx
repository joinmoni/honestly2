import React from "react";
import { render, screen } from "@testing-library/react";

import { AdminVendorsPageSkeleton, ListsPageSkeleton, MyReviewsPageSkeleton, VendorDetailPageSkeleton, VendorsPageSkeleton } from "@/components/ui/PageSkeletons";

describe("PageSkeletons", () => {
  it("renders without exposing interactive content placeholders as real copy", () => {
    const { rerender } = render(<VendorsPageSkeleton />);
    expect(screen.queryByRole("button", { name: /try again/i })).not.toBeInTheDocument();

    rerender(<VendorDetailPageSkeleton />);
    expect(screen.queryByText("No client notes yet")).not.toBeInTheDocument();

    rerender(<ListsPageSkeleton />);
    rerender(<MyReviewsPageSkeleton />);
    rerender(<AdminVendorsPageSkeleton />);
  });
});
