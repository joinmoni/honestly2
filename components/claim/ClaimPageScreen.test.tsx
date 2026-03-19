import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ClaimPageScreen } from "@/components/claim/ClaimPageScreen";
import { submitVendorClaim } from "@/lib/claims.client";
import { getClaimPageDataByVendorSlug } from "@/lib/services/claim-page";

vi.mock("@/lib/claims.client", () => ({
  submitVendorClaim: vi.fn()
}));

describe("ClaimPageScreen", () => {
  it("requires one contact method before submission", async () => {
    const user = userEvent.setup();
    const data = await getClaimPageDataByVendorSlug("wildflower-archive", "usr-001");

    if (!data) throw new Error("expected claim data");

    render(<ClaimPageScreen data={data} currentUser={{ id: "usr-001", name: "Avery Johnson" }} />);

    expect(screen.getByRole("link", { name: "Back to vendor" })).toHaveAttribute("href", "/vendor/wildflower-archive");

    await user.click(screen.getByRole("button", { name: "Submit Claim Request" }));
    expect(screen.getByText("Add at least one of email, Instagram, or TikTok.")).toBeInTheDocument();
  });

  it("submits to pending once a contact method is provided", async () => {
    const user = userEvent.setup();
    const data = await getClaimPageDataByVendorSlug("wildflower-archive", "usr-001");
    vi.mocked(submitVendorClaim).mockResolvedValue({
      submittedAt: "2026-03-09T10:00:00.000Z"
    });

    if (!data) throw new Error("expected claim data");

    render(<ClaimPageScreen data={data} currentUser={{ id: "usr-001", name: "Avery Johnson" }} />);

    await user.type(screen.getByPlaceholderText("Professional Email"), "owner@wildflowerarchive.com");
    await user.click(screen.getByRole("button", { name: "Submit Claim Request" }));

    expect(submitVendorClaim).toHaveBeenCalledWith(
      expect.objectContaining({
        vendorId: data.vendorId,
        userId: "usr-001",
        claimantName: "Avery Johnson",
        email: "owner@wildflowerarchive.com"
      })
    );
    expect(await screen.findByText("Claim under review")).toBeInTheDocument();
  });
});
