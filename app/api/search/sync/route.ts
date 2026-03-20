import { NextResponse } from "next/server";

import { getMeilisearchAdminEnv } from "@/lib/config/app-env";
import { syncMeilisearchIndexes } from "@/lib/meilisearch-admin";

function unauthorizedResponse(message: string, status = 401) {
  return NextResponse.json({ error: message }, { status });
}

export async function POST(request: Request) {
  const env = getMeilisearchAdminEnv();

  if (!env) {
    return NextResponse.json({ error: "Meilisearch sync is not configured." }, { status: 500 });
  }

  if (!env.syncToken) {
    return NextResponse.json({ error: "HONESTLY_SEARCH_SYNC_TOKEN is not configured." }, { status: 500 });
  }

  const authorization = request.headers.get("authorization");
  if (!authorization?.startsWith("Bearer ")) {
    return unauthorizedResponse("Missing sync token.");
  }

  const token = authorization.replace(/^Bearer\s+/i, "").trim();
  if (token !== env.syncToken) {
    return unauthorizedResponse("Invalid sync token.", 403);
  }

  try {
    const summary = await syncMeilisearchIndexes();
    return NextResponse.json({ ok: true, summary });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Meilisearch sync failed.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
