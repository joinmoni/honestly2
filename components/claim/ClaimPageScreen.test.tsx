import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ClaimPageScreen } from "@/components/claim/ClaimPageScreen";
import { getClaimPageDataByVendorSlug } from "@/lib/services/claim-page";

describe("ClaimPageScreen", () => {
  it("requires one contact method before submission", async () => {
    const user = userEvent.setup();
    const data = await getClaimPageDataByVendorSlug("wildflower-archive", "usr-001");

    if (!data) throw new Error("expected claim data");

    render(<ClaimPageScreen data={data} />);

    await user.click(screen.getByRole("button", { name: "Submit Claim Request" }));
    expect(screen.getByText("Add at least one of email, Instagram, or TikTok.")).toBeInTheDocument();
  });

  it("submits to pending once a contact method is provided", async () => {
    const user = userEvent.setup();
    const data = await getClaimPageDataByVendorSlug("wildflower-archive", "usr-001");

    if (!data) throw new Error("expected claim data");

    render(<ClaimPageScreen data={data} />);

    await user.type(screen.getByPlaceholderText("Professional Email"), "owner@wildflowerarchive.com");
    await user.click(screen.getByRole("button", { name: "Submit Claim Request" }));

    expect(screen.getByText("Claim under review")).toBeInTheDocument();
  });
});
