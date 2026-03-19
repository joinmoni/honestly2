import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { AdminVendorDirectoryScreen } from "@/components/admin/AdminVendorDirectoryScreen";
import { updateAdminVendorStatus } from "@/lib/admin-vendors.client";
import { getAdminVendorDirectoryData } from "@/lib/services/admin-vendors";

vi.mock("@/lib/admin-vendors.client", async () => {
  const actual = await vi.importActual<typeof import("@/lib/admin-vendors.client")>("@/lib/admin-vendors.client");
  return {
    ...actual,
    updateAdminVendorStatus: vi.fn(actual.updateAdminVendorStatus)
  };
});

describe("AdminVendorDirectoryScreen", () => {
  it("filters vendors and toggles suspend state", async () => {
    const user = userEvent.setup();
    const data = await getAdminVendorDirectoryData();

    render(<AdminVendorDirectoryScreen data={data} />);

    expect(screen.getByText("Wildflower Archive")).toBeInTheDocument();
    expect(screen.getByText("Vintage Archive Co.")).toBeInTheDocument();

    await user.type(screen.getByPlaceholderText("Search by vendor name..."), "Wildflower");
    expect(screen.getByText("Wildflower Archive")).toBeInTheDocument();
    expect(screen.queryByText("Vintage Archive Co.")).not.toBeInTheDocument();

    await user.clear(screen.getByPlaceholderText("Search by vendor name..."));
    expect(screen.getByRole("button", { name: "Edit Wildflower Archive" })).toHaveAttribute("title", "Edit Wildflower Archive");
    expect(screen.getByRole("button", { name: "Suspend Wildflower Archive" })).toHaveAttribute("title", "Suspend Wildflower Archive");
    await user.click(screen.getByRole("button", { name: "Unsuspend" }));
    expect(updateAdminVendorStatus).toHaveBeenCalled();
    expect(screen.queryByRole("button", { name: "Unsuspend" })).not.toBeInTheDocument();
  });
});
