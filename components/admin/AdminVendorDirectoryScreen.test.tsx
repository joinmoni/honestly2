import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { AdminVendorDirectoryScreen } from "@/components/admin/AdminVendorDirectoryScreen";
import { getAdminVendorDirectoryData } from "@/lib/services/admin-vendors";

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
    await user.click(screen.getByRole("button", { name: "Unsuspend" }));
    expect(screen.queryByRole("button", { name: "Unsuspend" })).not.toBeInTheDocument();
  });
});
