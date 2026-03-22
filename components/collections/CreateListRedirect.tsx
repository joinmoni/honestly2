"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

type CreateListRedirectProps = {
  userId: string;
};

export function CreateListRedirect({ userId }: CreateListRedirectProps) {
  const router = useRouter();

  useEffect(() => {
    router.replace(`/lists/new?draft=1&userId=${encodeURIComponent(userId)}`);
  }, [router, userId]);

  return (
    <main className="mx-auto flex min-h-[55vh] max-w-3xl items-center justify-center px-6 py-16">
      <div className="text-center">
        <p className="text-[10px] font-black uppercase tracking-[0.18em] text-stone-400">Creating list</p>
        <h1 className="mt-3 text-4xl">Preparing your new list…</h1>
      </div>
    </main>
  );
}
