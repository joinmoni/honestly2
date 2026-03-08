import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { ReviewList } from "@/components/vendor/ReviewList";
import { mockReviews } from "@/lib/mock-data/reviews";

describe("ReviewList", () => {
  it("renders rubric summaries and allows editing the current user's review", async () => {
    const user = userEvent.setup();
    const onEditOwnReview = vi.fn();

    render(
      <ReviewList
        reviews={[mockReviews[0]!]}
        currentUserId="usr-001"
        onEditOwnReview={onEditOwnReview}
        showRubricSummary
      />
    );

    expect(screen.getAllByText("Communication")).toHaveLength(2);
    expect(screen.getAllByText("Quality")).toHaveLength(2);
    expect(screen.getAllByText("Value")).toHaveLength(2);
    expect(screen.getByText("The highlight of our wedding day")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Edit your review" }));
    expect(onEditOwnReview).toHaveBeenCalledTimes(1);
  });
});
