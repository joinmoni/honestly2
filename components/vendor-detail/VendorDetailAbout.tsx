import { BodyText, Eyebrow, SectionTitle } from "@/components/ui/Typography";
import type { VendorProfile } from "@/lib/types/vendor-profile";

type VendorDetailAboutProps = {
  profile: VendorProfile;
};

export function VendorDetailAbout({ profile }: VendorDetailAboutProps) {
  return (
    <section className="rounded-[2.25rem] border border-stone-200/80 bg-white px-7 py-8 shadow-sm shadow-stone-200/30 md:px-10 md:py-10">
      <Eyebrow className="mb-3">Editorial Notes</Eyebrow>
      <SectionTitle className="mb-5 text-[2rem] md:text-[2.45rem]">{profile.aboutTitle}</SectionTitle>
      <div className="space-y-4">
        {profile.aboutParagraphs.map((paragraph, index) => (
          <BodyText key={`${profile.vendorId}-about-${index}`} className="max-w-3xl text-base leading-relaxed md:text-lg">
            {paragraph}
          </BodyText>
        ))}
      </div>
    </section>
  );
}
