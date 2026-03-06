import type { VendorProfile } from "@/lib/types/vendor-profile";

type VendorDetailAboutProps = {
  profile: VendorProfile;
};

export function VendorDetailAbout({ profile }: VendorDetailAboutProps) {
  return (
    <section className="rounded-[2.25rem] border border-stone-200/80 bg-white px-7 py-8 shadow-sm shadow-stone-200/30 md:px-10 md:py-10">
      <p className="mb-3 text-[10px] font-black uppercase tracking-[0.22em] text-stone-400">Editorial Notes</p>
      <h2 className="mb-5 text-3xl md:text-4xl">{profile.aboutTitle}</h2>
      <div className="space-y-4">
        {profile.aboutParagraphs.map((paragraph, index) => (
          <p key={`${profile.vendorId}-about-${index}`} className="max-w-3xl text-lg leading-relaxed text-stone-600">
            {paragraph}
          </p>
        ))}
      </div>
    </section>
  );
}
