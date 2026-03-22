import { NextResponse } from "next/server";
import { getHomepageLocationSuggestions, getHomepageSearchSuggestions } from "@/lib/services/search";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("query")?.trim() ?? "";

  try {
    const [suggestions, locations] = await Promise.all([getHomepageSearchSuggestions(query), getHomepageLocationSuggestions(query)]);

    return NextResponse.json({
      query,
      categories: suggestions.categories,
      vendors: suggestions.vendors,
      locations
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Search could not be completed.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
