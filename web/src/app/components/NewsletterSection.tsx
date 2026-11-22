import { Eyebrow } from "./Eyebrow";
import { NewsletterSignup } from "./NewsletterSignup";
import { newsletterOffer } from "@/lib/newsletter";

export function NewsletterSection() {
  const offer = newsletterOffer();

  return (
    <section
      id="updates"
      className="relative py-24 sm:py-32 border-b overflow-hidden"
      style={{ borderColor: "var(--line)" }}
    >
      <div className="absolute inset-0 grid-bg opacity-40" />
      <div
        className="nebula"
        style={{
          width: 640,
          height: 640,
          left: "-160px",
          bottom: "-20%",
          opacity: 0.22,
        }}
      />
      <div className="relative max-w-[1440px] mx-auto px-6 sm:px-8">
        <Eyebrow num="08" label="UPDATES" />
        <div className="mt-10 max-w-[640px]">
          <div
            className="border p-6 sm:p-10 bg-black/60 backdrop-blur"
            style={{ borderColor: "var(--line-strong)" }}
          >
            <NewsletterSignup offer={offer} source="homepage" variant="section" />
          </div>
        </div>
      </div>
    </section>
  );
}
