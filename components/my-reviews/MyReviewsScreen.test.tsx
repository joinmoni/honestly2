import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MyReviewsScreen } from "@/components/my-reviews/MyReviewsScreen";
import { getMyReviewsPageData } from "@/lib/services/my-reviews";
import { getRatingCriteria } from "@/lib/services/reviews";
import { mockUserSession } from "@/lib/mock-data/session";

describe("MyReviewsScreen", () => {
  it("filters review history and opens the edit flow", async () => {
    const user = userEvent.setup();
    const [data, criteria] = await Promise.all([
      getMyReviewsPageData("usr-001"),
      getRatingCriteria()
    ]);

    render(<MyReviewsScreen data={data} criteria={criteria} session={mockUserSession} />);

    expect(screen.getByText("My Feedback")).toBeInTheDocument();
    expect(screen.getByText("Wildflower Archive")).toBeInTheDocument();
    expect(screen.getByText("Golden Hour Stills")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Published" }));
    expect(screen.getByText("Wildflower Archive")).toBeInTheDocument();
    expect(screen.queryByText("Golden Hour Stills")).not.toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /All \(3\)/ }));
    await user.click(screen.getByRole("button", { name: "Edit" }));

    expect(screen.getByText("Edit your review")).toBeInTheDocument();
    expect(screen.getByDisplayValue("The highlight of our wedding day")).toBeInTheDocument();
  });
});
