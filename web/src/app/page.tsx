import { Configurator } from "./components/Configurator";
import { FieldReports } from "./components/FieldReports";
import { FinalCTA } from "./components/FinalCTA";
import { Footer } from "./components/Footer";
import { Header } from "./components/Header";
import { Hero } from "./components/Hero";
import { INTRO_GATE, Intro } from "./components/Intro";
import { Marquee } from "./components/Marquee";
import { Pillars } from "./components/Pillars";
import { RunCycle } from "./components/RunCycle";
import { Specs } from "./components/Specs";
import { UseCases } from "./components/UseCases";

export default function Page() {
  return (
    <>
      {/* Runs before the intro is parsed, so it never flashes when it's skipped. */}
      <script dangerouslySetInnerHTML={{ __html: INTRO_GATE }} />
      <Intro />
      <Header />
      <Hero />
      <Marquee />
      <Pillars />
      <RunCycle />
      <UseCases />
      <Specs />
      <FieldReports />
      <Configurator />
      <FinalCTA />
      <Footer />
    </>
  );
}
