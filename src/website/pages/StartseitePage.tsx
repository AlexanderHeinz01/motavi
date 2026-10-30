import {
  AblaufSection,
  AbschlussSection,
  BeispielSteckbriefSection,
  BetriebsratSection,
  BeweisSection,
  NeutralSection,
  PaketeSection,
  PerspektivenSection,
  ProblemSection,
  RechnerTeaser,
} from '../sections/startseite/Abschnitte'
import EntscheidungSection from '../sections/startseite/EntscheidungSection'
import StartHero from '../sections/startseite/StartHero'

/** Start page: sections in exactly the order of WEBSITE_PLAN §3 (Phase 2). */
export default function StartseitePage() {
  return (
    <>
      <StartHero />
      <ProblemSection />
      <EntscheidungSection />
      <BeispielSteckbriefSection />
      <BeweisSection />
      <PerspektivenSection />
      <RechnerTeaser />
      <AblaufSection />
      <NeutralSection />
      <BetriebsratSection />
      <PaketeSection />
      <AbschlussSection />
    </>
  )
}
