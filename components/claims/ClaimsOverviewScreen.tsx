import Link from "next/link";

import { BodyText, CardTitle, Eyebrow, MetaText, PageTitle, PillText } from "@/components/ui/Typography";

type ClaimsOverviewItem = {
  id: string;
  vendorName: string;
  vendorSlug: string;
  status: "pending" | "approved" | "rejected";
  submittedAt: string;
  verificationLine: string;
};

type ClaimsOverviewScreenProps = {
  claims: ClaimsOverviewItem[];
};

export function ClaimsOverviewScreen({ claims }: ClaimsOverviewScreenProps) {
  return (
    <main className="mx-auto max-w-6xl px-6 py-8 md:py-12">
      <Eyebrow className="mb-4">Claims</Eyebrow>
      <PageTitle className="mb-4 text-[2.85rem] leading-[0.95] md:text-6xl">Your business claims</PageTitle>
      <BodyText className="max-w-2xl">Track the businesses you have claimed, their review status, and the details you submitted.</BodyText>

      <div className="mt-8 grid gap-4">
        {claims.length ? (
          claims.map((claim) => (
            <article key={claim.id} className="rounded-[1.75rem] border border-stone-200 bg-white p-5 shadow-sm">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <CardTitle className="text-[1.9rem] leading-tight md:text-[2.1rem]">{claim.vendorName}</CardTitle>
                  <MetaText className="mt-1 normal-case tracking-normal text-stone-500">{claim.verificationLine}</MetaText>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                  <span className="rounded-full bg-stone-100 px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.18em] text-stone-600">
                    <PillText className="text-stone-600">{claim.status}</PillText>
                  </span>
                  <MetaText>{claim.submittedAt}</MetaText>
                </div>
              </div>
              <div className="mt-4">
                <Link href={`/vendor/${claim.vendorSlug}`} className="text-sm font-semibold text-amber-700 underline underline-offset-4">
                  View vendor page
                </Link>
              </div>
            </article>
          ))
        ) : (
          <div className="rounded-[1.75rem] border border-stone-200 bg-white p-6 shadow-sm">
            <CardTitle className="text-[1.8rem] leading-tight md:text-[2rem]">No claims yet</CardTitle>
            <BodyText className="mt-2">Claim a business from its vendor page and its status will appear here.</BodyText>
          </div>
        )}
      </div>
    </main>
  );
}
