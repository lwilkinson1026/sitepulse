import type { Metadata } from "next";
import { Addons } from "../components/field-unit/Addons";
import { Comparison } from "../components/field-unit/Comparison";
import { Coverage } from "../components/field-unit/Coverage";
import { Faq } from "../components/field-unit/Faq";
import { FieldUnitFooter } from "../components/field-unit/FieldUnitFooter";
import { FieldUnitHero } from "../components/field-unit/FieldUnitHero";
import { FieldUnitNav } from "../components/field-unit/FieldUnitNav";
import { HowItWorks } from "../components/field-unit/HowItWorks";
import { LoadMarquee } from "../components/field-unit/LoadMarquee";
import { PowerCalculator } from "../components/field-unit/PowerCalculator";
import { ReserveForm } from "../components/field-unit/ReserveForm";
import { SizingProvider } from "../components/field-unit/SizingContext";

export const metadata: Metadata = {
  title: "Sitepulse Field Unit — Power where there isn't any",
  description:
    "Delivered, monitored and refuelled off-grid power for unattended remote sites. Size your load in ten seconds. Idaho · Eastern Washington · Western Montana.",
};

export default function FieldUnitPage() {
  return (
    // The calculator and the reserve summary share one sizing state; every
    // section between them stays a server component.
    <SizingProvider>
      <div className="min-h-screen">
        <FieldUnitNav />
        <FieldUnitHero />
        <LoadMarquee />
        <Comparison />
        <PowerCalculator />
        <Addons />
        <Coverage />
        <HowItWorks />
        <Faq />
        <ReserveForm />
        <FieldUnitFooter />
      </div>
    </SizingProvider>
  );
}
