import type { Metadata } from "next";
import { Comparison } from "../components/field-unit/Comparison";
import { Coverage } from "../components/field-unit/Coverage";
import { Faq } from "../components/field-unit/Faq";
import { FieldUnitFooter } from "../components/field-unit/FieldUnitFooter";
import { FieldUnitHero } from "../components/field-unit/FieldUnitHero";
import { FieldUnitNav } from "../components/field-unit/FieldUnitNav";
import { HowItWorks } from "../components/field-unit/HowItWorks";
import { LoadMarquee } from "../components/field-unit/LoadMarquee";
import { PowerCalculator } from "../components/field-unit/PowerCalculator";
import { RentCta } from "../components/field-unit/RentCta";
import { SizingProvider } from "../components/field-unit/SizingContext";

export const metadata: Metadata = {
  title: "Sitepulse Field Unit — Power where there isn't any",
  description:
    "Off-grid power and Starlink for unattended remote sites — $299/month, delivered and online in 48–72 hours. Size your load in ten seconds. Idaho · Oregon · Washington · Montana.",
};

export default function FieldUnitPage() {
  return (
    // The calculator keeps its sizing state in a context, so every other
    // section stays a server component.
    <SizingProvider>
      <div className="min-h-screen">
        <FieldUnitNav />
        <FieldUnitHero />
        <LoadMarquee />
        <Comparison />
        <PowerCalculator />
        <Coverage />
        <HowItWorks />
        <Faq />
        <RentCta />
        <FieldUnitFooter />
      </div>
    </SizingProvider>
  );
}
