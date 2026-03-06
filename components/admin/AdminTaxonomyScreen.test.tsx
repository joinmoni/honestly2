import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { AdminTaxonomyScreen } from "@/components/admin/AdminTaxonomyScreen";
import { getAdminTaxonomyData } from "@/lib/services/admin-categories";

describe("AdminTaxonomyScreen", () => {
  it("creates categories and mutates subcategories locally", async () => {
    const user = userEvent.setup();
    const data = await getAdminTaxonomyData();

    render(<AdminTaxonomyScreen data={data} />);

    expect(screen.getByText("Photography")).toBeInTheDocument();

    await user.click(screen.getAllByRole("button", { name: "Add Sub" })[0]!);
    expect(screen.getByText("New Sub 6")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /New Primary Category/i }));
    await user.type(screen.getByPlaceholderText("e.g., Event Planning"), "Catering");
    await user.click(screen.getByRole("button", { name: "Create Category" }));

    expect(screen.getByText("Catering")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Delete Venues" }));
    expect(screen.queryByText("Venues")).not.toBeInTheDocument();
  });
});
