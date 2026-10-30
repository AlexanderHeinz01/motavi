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

/**
 * Start page (DESIGN_BRIEF §5, WEBSITE_PLAN §3). Deviation from the order in
 * §5: the decision section follows the hero directly (decision D0), the
 * problem section comes after it.
 */
export default function StartseitePage() {
  return (
    <>
      <StartHero />
      <EntscheidungSection />
      <ProblemSection />
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
