import type { Accent } from './types'

/**
 * Texts of the skeleton visual (DESIGN_BRIEF §2, phase D2). All numbers are
 * invented example values and are marked as such in the drawing (guideline 5).
 */

export interface SkelettWert {
  label: string
  accent: Accent
  wert: string
  einheit: string
}

export interface SkelettSzeneText {
  ariaLabel: string
  /** Zeit, Kosten, Belastung (in this order) */
  werte: [SkelettWert, SkelettWert, SkelettWert]
}

export const skelettText = {
  beispielwerte: 'Beispielwerte',
  anhalten: 'Animation anhalten',
  fortsetzen: 'Animation fortsetzen',
  zyklus: 'Zyklus',
  rumpf: 'Rumpf',
  grad: (g: number) => `${g}°`,
  greifraum: 'Greifraum',

  /** Hero: grip and place cycle with trunk rotation. Same values as the hero data sheet (startseite.hero.werte). */
  greifen: {
    ariaLabel:
      'Animation: anonymisiertes Bewegungsskelett greift Teile aus einem seitlichen Behälter und legt sie vorne ab. Die Handbahn zeichnet sich nach, nach drei Zyklen erscheinen Zeit, Kosten und Belastung als Beispielwerte.',
    werte: [
      { label: 'Zeit', accent: 'data-ink', wert: '38,4 s', einheit: 'je Zyklus' },
      { label: 'Kosten', accent: 'gain-ink', wert: '15.000 €', einheit: 'pro Jahr' },
      { label: 'Belastung', accent: 'risk-ink', wert: 'Index 5,8', einheit: 'Rumpf bis 45°' },
    ],
  } satisfies SkelettSzeneText,

  /**
   * Health page: bending to a floor bin. 11.700 € per year = 32 min per
   * shift x 2 shifts x 220 days at 50 € per hour (rounded).
   */
  buecken: {
    ariaLabel:
      'Animation: anonymisiertes Bewegungsskelett bückt sich zu einem Behälter am Boden, hebt ein Teil an und legt es seitlich auf einer Werkbank ab. Nach drei Zyklen erscheinen Zeit, Kosten und Belastung als Beispielwerte.',
    werte: [
      { label: 'Zeit', accent: 'data-ink', wert: '16,2 s', einheit: 'je Zyklus' },
      { label: 'Kosten', accent: 'gain-ink', wert: '11.700 €', einheit: 'pro Jahr' },
      { label: 'Belastung', accent: 'risk-ink', wert: 'Index 9,1', einheit: 'Rumpf bis 70°' },
    ],
  } satisfies SkelettSzeneText,

  trennerLabel: 'Hebevorgang in sechs Phasen als Linienzeichnung: bücken, greifen, anheben, drehen, ablegen',
}
