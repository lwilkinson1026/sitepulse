import { Addons } from "./components/landing/Addons";
import { Comparison } from "./components/landing/Comparison";
import { Coverage } from "./components/landing/Coverage";
import { Faq } from "./components/landing/Faq";
import { HowItWorks } from "./components/landing/HowItWorks";
import { LandingFooter } from "./components/landing/LandingFooter";
import { LandingHero } from "./components/landing/LandingHero";
import { LandingNav } from "./components/landing/LandingNav";
import { LoadMarquee } from "./components/landing/LoadMarquee";
import { PowerCalculator } from "./components/landing/PowerCalculator";
import { ReserveForm } from "./components/landing/ReserveForm";
import { SizingProvider } from "./components/landing/SizingContext";

export default function Page() {
  return (
    // The calculator and the reserve summary share one sizing state; every
    // section between them stays a server component.
    <SizingProvider>
      <div className="min-h-screen">
        <LandingNav />
        <LandingHero />
        <LoadMarquee />
        <Comparison />
        <PowerCalculator />
        <Addons />
        <Coverage />
        <HowItWorks />
        <Faq />
        <ReserveForm />
        <LandingFooter />
      </div>
    </SizingProvider>
  );
}
