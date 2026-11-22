import { FieldReports } from "./components/FieldReports";
import { FinalCTA } from "./components/FinalCTA";
import { Footer } from "./components/Footer";
import { Header } from "./components/Header";
import { Hero } from "./components/Hero";
import { Marquee } from "./components/Marquee";
import { NewsletterSection } from "./components/NewsletterSection";
import { Pillars } from "./components/Pillars";
import { RentalOffer } from "./components/RentalOffer";
import { RunCycle } from "./components/RunCycle";
import { Specs } from "./components/Specs";
import { UseCases } from "./components/UseCases";

export default function Page() {
  return (
    <>
      <Header />
      <Hero />
      <Marquee />
      <Pillars />
      <RunCycle />
      <UseCases />
      <Specs />
      <FieldReports />
      <RentalOffer />
      <FinalCTA />
      <NewsletterSection />
      <Footer />
    </>
  );
}
