"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

import { persistCreateEmptyList } from "@/lib/lists.client";
import type { SavedList } from "@/lib/types/domain";

type CreateListRedirectProps = {
  userId: string;
  initialLists: SavedList[];
};

export function CreateListRedirect({ userId, initialLists }: CreateListRedirectProps) {
  const router = useRouter();

  useEffect(() => {
    let cancelled = false;

    const create = async () => {
      const list = await persistCreateEmptyList(initialLists, { userId, name: "Create new list" });
      if (!cancelled) {
        router.replace(`/lists/${list.id}`);
      }
    };

    void create();

    return () => {
      cancelled = true;
    };
  }, [initialLists, router, userId]);

  return (
    <main className="mx-auto flex min-h-[55vh] max-w-3xl items-center justify-center px-6 py-16">
      <div className="text-center">
        <p className="text-[10px] font-black uppercase tracking-[0.18em] text-stone-400">Creating list</p>
        <h1 className="mt-3 text-4xl">Preparing your new list…</h1>
      </div>
    </main>
  );
}
