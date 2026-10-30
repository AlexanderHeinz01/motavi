/**
 * Statement on where the video goes (app, README).
 *
 * 'server' may only be switched on when both are true:
 * 1. The deletion concept of the backend is live: raw video deleted right
 *    after the analysis, lifecycle rules applied
 *    (motavi-backend: docs/LOESCHKONZEPT.md, infra/gcs_lifecycle.json).
 * 2. This app actually sends the video to the backend. Until then it
 *    analyses in the browser (src/app/api/motavi.ts), and only the
 *    'browser' statement is true.
 *
 * When switching, also change README.md (section "Funktionen", second item).
 */
export type Datenweg = 'browser' | 'server'

export const DATENWEG: Datenweg = 'browser'

export const datenwegText: Record<Datenweg, string> = {
  browser:
    'Die Analyse läuft vollständig in Ihrem Browser, das Video verlässt Ihren Rechner nicht. Bitte lassen Sie diese Seite bis zum Ende geöffnet und im Vordergrund.',
  server:
    'Ihr Video wird verschlüsselt auf einen Server in Deutschland (Frankfurt) übertragen. Unmittelbar nach der Auswertung wird das Originalvideo automatisch gelöscht. Weiterverarbeitet werden nur anonymisierte Daten.',
}
