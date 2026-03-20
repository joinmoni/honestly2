import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi } from "vitest";

import { AdminReviewModerationScreen } from "@/components/admin/AdminReviewModerationScreen";
import type { AdminReviewModerationData } from "@/lib/types/admin-dashboard";

const updateAdminReviewStatus = vi.fn();

vi.mock("@/lib/admin-reviews.client", () => ({
  updateAdminReviewStatus: (...args: unknown[]) => updateAdminReviewStatus(...args)
}));

const data: AdminReviewModerationData = {
  brandLabel: "honestly. admin",
  title: "Review Moderation",
  description: "Moderate reviews",
  navLinks: [{ id: "reviews", label: "Reviews", href: "/admin/reviews", active: true }],
  filters: [
    { id: "pending", label: "Pending", count: 1 },
    { id: "approved", label: "Approved", count: 0 },
    { id: "rejected", label: "Rejected", count: 0 }
  ],
  reviews: [
    {
      id: "rev-1",
      vendorId: "ven-1",
      vendorName: "Wildflower Archive",
      reviewerName: "Avery Johnson",
      reviewerEmail: "avery@example.com",
      submittedDate: "March 04, 2026",
      reviewTitle: "Great",
      reviewBody: "Lovely to work with.",
      overallRating: 5,
      status: "pending"
    }
  ],
  pagination: {
    currentPage: 1,
    totalPages: 1,
    pageNumbers: [1]
  }
};

describe("AdminReviewModerationScreen", () => {
  beforeEach(() => {
    updateAdminReviewStatus.mockReset();
    updateAdminReviewStatus.mockResolvedValue([
      {
        ...data.reviews[0],
        status: "approved"
      }
    ]);
  });

  it("calls the provider-aware mutation when approving a review", async () => {
    const user = userEvent.setup();

    render(<AdminReviewModerationScreen data={data} />);

    await user.click(screen.getByRole("button", { name: /approve review/i }));

    expect(updateAdminReviewStatus).toHaveBeenCalledWith(data.reviews, "rev-1", "approved");
  });
});
