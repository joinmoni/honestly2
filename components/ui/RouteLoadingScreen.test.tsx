import React from "react";
import { render, screen } from "@testing-library/react";

import { RouteLoadingScreen } from "@/components/ui/RouteLoadingScreen";

describe("RouteLoadingScreen", () => {
  it("renders the loading heading and supporting copy", () => {
    render(<RouteLoadingScreen />);

    expect(screen.getByText("Loading the next view")).toBeInTheDocument();
    expect(screen.getByText("Fetching content, layout blocks, and navigation context.")).toBeInTheDocument();
  });
});
