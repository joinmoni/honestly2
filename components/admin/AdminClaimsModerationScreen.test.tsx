import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { AdminClaimsModerationScreen } from "@/components/admin/AdminClaimsModerationScreen";
import { getAdminClaimsModerationData } from "@/lib/services/admin-claims";

describe("AdminClaimsModerationScreen", () => {
  it("filters claims and allows moderation actions", async () => {
    const user = userEvent.setup();
    const data = await getAdminClaimsModerationData();

    render(<AdminClaimsModerationScreen data={data} />);

    expect(screen.getByText("Vendor Claims")).toBeInTheDocument();
    expect(screen.getByText("Golden Hour Stills")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Approved" }));
    expect(screen.getByText("Estate at Silver Lake")).toBeInTheDocument();
    expect(screen.queryByText("Golden Hour Stills")).not.toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /Pending \(1\)/ }));
    await user.click(screen.getByRole("button", { name: "Approve Ownership" }));
    expect(screen.queryByText("Golden Hour Stills")).not.toBeInTheDocument();
  });
});
