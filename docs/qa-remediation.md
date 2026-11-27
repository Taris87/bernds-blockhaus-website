# QA-Korrekturen – Projekt 001

## Kontrast

Die ursprünglichen Markenfarben bleiben als dekorative bzw. nicht-textuelle Markenfarben erhalten. Für Text wird eine separate dunklere Variante verwendet:

- Terracotta Marke: `#A66D45`
- Terracotta Text: `#80502F`
- Muted Stone Marke: `#817F73`
- Muted Stone Text: `#656357`
- Ivory Hintergrund: `#F3EFE6`

WCAG-Kontrastwerte (sRGB relative luminance, Berechnung nach WCAG 2.x):

| Vordergrund | Hintergrund | Kontrast |
|---|---|---:|
| `#A66D45` | `#F3EFE6` | 3.60:1 |
| `#817F73` | `#F3EFE6` | 3.85:1 |
| `#80502F` | `#F3EFE6` | 5.45:1 |
| `#656357` | `#F3EFE6` | 5.77:1 |

Die beiden ursprünglichen Farben erfüllen 4.5:1 für normalen Text nicht. Die Textvarianten erfüllen den Zielwert 4.5:1. Die Originalfarben dürfen weiterhin z. B. für Rahmen und dekorative Markenflächen eingesetzt werden; nicht jedoch als alleinige Farbe für normalen Text oder erforderliche Bedienelemente ohne ausreichenden Kontrast.

## CI

`pull-request-checks.yml` wird ausschließlich durch `pull_request` gegen `main` ausgelöst und führt `npm ci`, TypeScript, ESLint, Vitest, Build sowie Playwright Chromium aus. Der Workflow besitzt nur `contents: read`; er enthält keine Deployment- oder Pages-Berechtigungen.

Der Pages-Workflow bleibt auf `push` zu `main` beschränkt. Bei manueller Ausführung auf einem anderen Ref wird der Build-Job übersprungen. Für manuelle Ausführung auf `main` verlangt der Deployment-Job zusätzlich den Bestätigungstext `deploy-main`.

## Mobile Dialog und Testumgebung

Die manuelle Tab-/Shift+Tab-Schleife wurde entfernt. Sequenzielle Tastaturnavigation wird dem nativen modalen `dialog` überlassen. Initialer Fokus, Escape-Abbruch, Fokuswiederherstellung, Strict-Mode-Schutz und Fokuswache für scriptgesteuerte Fokuswechsel bleiben erhalten.

JSDOM implementiert keine native Modal-Dialog-Semantik. Die Unit-Tests mocken `showModal()`/ `close()` daher ausschließlich für React-Lifecycle- und Fokuslogik; sie behaupten ausdrücklich nicht, native Tab-Reihenfolge zu beweisen. Native Tab-/Shift+Tab-Steuerung wird in Playwright mit echtem Chromium geprüft.

Die Browser-Tests navigieren über den echten GitHub-Pages-Basispfad `/bernds-blockhaus-website/`. Das Anfrageformular befindet sich auf `/ferienwohnungen`, nicht auf `/kontakt`.

## Formularprüfungen

Die Standard-E2E-Konfiguration startet Vite mit leerem `VITE_INQUIRY_ENDPOINT` und prüft den sichtbaren Fallback sowie das Ausbleiben eines POST-Requests.

Eine zweite Playwright-Konfiguration startet die Anwendung separat mit `VITE_INQUIRY_ENDPOINT=https://%`. Der Browser-Test sendet das Formular ab, prüft die sichtbare Fehlermeldung und weist nach, dass kein POST-Request erfolgt.

Offen vor Produktivbetrieb: Backend-Endpunkt und Empfängerlogik, serverseitige Validierung, Spam-/Rate-Limit-Schutz, sichere Speicherung/Weiterleitung, Monitoring, Datenschutzinformation und rechtlich erforderliche Einwilligungs-/Aufbewahrungsprozesse. Es wurde kein Endpunkt und keine Empfängeradresse erfunden oder eingerichtet.

## Testumfang

- Unit Tests: 15 deklarierte Tests (7 Header, 8 Formular).
- Playwright: 15 deklarierte Tests insgesamt. Der reguläre Chromium-Lauf umfasst 14 Tests: 11 Mobile-Dialog-/Viewport-Tests und 3 Navigation-/Fallback-Tests. Der separate Lauf mit `playwright.invalid-endpoint.config.ts` umfasst 1 Test mit ungültigem HTTPS-Endpunkt.
- Run #14 führte `npm run test:e2e` aus: 14/14 Tests im regulären Chromium-Lauf und 1/1 Test im separaten Lauf mit ungültigem HTTPS-Endpunkt bestanden (15/15 insgesamt). Die Anzahl deklarierter Tests ist nicht gleichbedeutend mit bestandenen Tests; maßgeblich sind die tatsächlich abgeschlossenen CI-Läufe für den jeweiligen Commit.

## QA-043 Navigation auf derselben Route

Festgelegtes Verhalten (`SiteLayout`): Der Fokus wird nur bei einem Wechsel des `pathname` auf `main` gesetzt. Reine Query- oder Hash-Änderungen auf derselben Route lösen keinen Fokus-Sprung und kein Scrollen durch die App aus; Fokus und Scrollposition bleiben erhalten. Die bestehende Logik entsprach diesem Verhalten bereits, es war keine Code-Korrektur nötig.

Hash-Ziele bleiben über die native Fragment-Navigation des Browsers erreichbar: Der Browser scrollt (wegen `scroll-behavior: smooth` weich) zum Ziel und fokussiert es, wenn es fokussierbar ist (z. B. `main` mit `tabindex="-1"` über den Skip-Link). Die App ergänzt dafür keine eigene Logik. Für Hash-Links über React Router (`<Link to="#id">`) gibt es derzeit keine Nutzung; das Scrollverhalten solcher Links ist nicht abgedeckt und müsste bei Einführung eigens geprüft werden.

Abdeckung:

- Unit (`src/components/layout/SiteLayout.test.tsx`, 6 Tests): erster Render, Query, Hash, Query + Hash, pathname-Wechsel, Query gefolgt von pathname-Wechsel.
- Playwright (`tests/e2e/same-route-navigation.spec.ts`, 6 Tests, Chromium): Query-Änderung über den Router (Fokus und Scrollposition bleiben, kein Reload), native Hash-Navigation (Scroll zum Ziel und Fokus aufs Ziel, kein Reload), Query + Hash über den Router, Skip-Link per Tastatur, pathname-Wechsel über die Hauptnavigation und nach vorheriger Query-Änderung.

Nachtrag (QA-107): Das hier festgehaltene Fokusverhalten bleibt gültig. Die frühere Aussage, dass bei einem `pathname`-Wechsel nicht gescrollt wird, ist überholt; sie war ein Fehler (siehe QA-107). Für reine Query- oder Hash-Änderungen auf derselben Route gilt weiterhin: kein Scrollen und kein Fokus-Sprung durch die App.

## QA-107 Seitenwechsel startet oben

Benutzermeldung nach dem Live-Gang: Navbar-Links führen zur richtigen Seite, die neue Seite startet aber in der Mitte. Ursache: `SiteLayout` setzte bei einem `pathname`-Wechsel nur den Fokus auf `main` (ohne `preventScroll`) und übernahm die Scrollposition der vorherigen Seite.

Festgelegtes Verhalten (`src/hooks/useRouteScroll.ts`, eingebunden in `SiteLayout`):

- Neuer `pathname` per PUSH oder REPLACE (Navbar, Mobile-Menü, Footer, Buttons, Karten-Links): Die Seite steht sofort ganz oben (`window.scrollTo({ top: 0, left: 0, behavior: 'instant' })`). `behavior: 'instant'` umgeht das globale `scroll-behavior: smooth`, es ist kein Hochscrollen sichtbar. Das läuft in einem Layout-Effekt, die neue Seite wird also nie an der alten Position gezeichnet.
- Neuer `pathname` mit Hash (z. B. `/eichwieserhof#anguszucht`): Sprung zum Hash-Ziel (`scrollIntoView({ behavior: 'instant', block: 'start' })`, `scroll-margin-top` wird beachtet). Gibt es das Ziel nicht, geht es nach oben. Derzeit gibt es keine solchen Links in der App; das Verhalten ist vorsorglich festgelegt und per Unit-Test abgedeckt.
- Browser-Zurück/Vor (POP) auf einen anderen `pathname`: Die Position, die der Verlaufseintrag beim Verlassen hatte, wird sofort wiederhergestellt. Ohne gespeicherte Position (z. B. Eintrag aus einer früheren Sitzung) gilt das Verhalten wie bei PUSH.
- Reine Query- oder Hash-Änderung auf demselben `pathname`: kein Scrollen und kein Fokus-Sprung durch die App (QA-043). Native Fragment-Navigation (Skip-Link `#main`) bleibt beim Browser.
- Nach jedem `pathname`-Wechsel erhält `main` den Fokus mit `{ preventScroll: true }`. Der Fokus wird als passiver Effekt gesetzt, damit er nach dem Schließen des Mobile-Menü-Dialogs kommt, der den Fokus sonst auf den Menü-Button zurückgibt.
- Reduced Motion: Alle App-Sprünge sind ohnehin sofort; `prefers-reduced-motion` schaltet zusätzlich das globale Smooth-Scrolling ab.

Entscheidung zu `<ScrollRestoration />`: Die App nutzt zwar einen Data-Router (`createBrowserRouter`), React Routers `<ScrollRestoration />` wird aber bewusst nicht eingesetzt. Sie scrollt bei jeder Navigation ohne `preventScrollReset` nach oben, also auch bei reinen Query-Änderungen (Widerspruch zu QA-043), und ruft `window.scrollTo(0, y)` ohne `behavior` auf, wodurch das globale `scroll-behavior: smooth` greift und das Hochscrollen sichtbar würde. Stattdessen merkt sich der Hook die Scrollposition je Verlaufseintrag (Schlüssel: `location.key` plus `pathname`, über passive `scroll`-Events) und setzt `history.scrollRestoration = 'manual'`, solange die App läuft. Beim Verlassen der Seite (`pagehide`) wird wieder `'auto'` gesetzt, damit der Browser bei Neuladen und Back-Forward-Cache selbst wiederherstellen *kann*; bei `pageshow` übernimmt die App wieder. Die gespeicherten Positionen leben nur im Speicher der laufenden Seite. **Nicht belegt:** In der QA (headless Chromium) startete eine neu geladene Seite oben (0) – identisch zum Stand vor diesem Fix (`origin/main`), also keine Regression. Ob ein normaler Browser nach Neuladen die Position wiederherstellt, wurde nicht geprüft (QA-109).

Bekannte Grenzen: nur in Chromium getestet; die Positionsliste hat keine Obergrenze (QA-108, in realen Sitzungen vernachlässigbar); werden später Routen asynchron geladen, muss die Wiederherstellung bei Zurück/Vor neu bewertet werden.

Abdeckung:

- Unit (`src/components/layout/SiteLayout.test.tsx`, 9 neue Tests, insgesamt 15): kein Scroll beim ersten Render; PUSH und REPLACE auf neuen `pathname` → `scrollTo({ top: 0, left: 0, behavior: 'instant' })` und Fokus auf `main` mit `preventScroll`; neuer `pathname` mit Hash → `scrollIntoView` auf dem Ziel, ohne Ziel → oben; Query- und Hash-Änderung → kein Scroll; Zurück und Vor → gespeicherte Position.
- Playwright (`tests/e2e/scroll-on-navigation.spec.ts`, 8 Tests, Chromium) auf `/eichwieserhof` bei 375 px und 1440 px nach weitem Scrollen: Navbar-Link (Desktop) bzw. Mobile-Menü-Link (375 px) und Footer-Link → `scrollY === 0` (per `expect.poll`), Fokus auf `main`, kein Reload, keine Zwischenpositionen eines Smooth-Scrolls; Zurück → alte Position, Vor → oben; Skip-Link nach Seitenwechsel; Reduced Motion.
- `tests/e2e/same-route-navigation.spec.ts`: Die beiden pathname-Tests prüfen jetzt nach weitem Scrollen zusätzlich `scrollY === 0`; die Query-, Hash- und Skip-Link-Tests sind unverändert.
- Gegenprobe: Ohne Scroll-Logik (und mit `focus()` ohne `preventScroll`) wurden 6 der 9 neuen Unit-Tests und 10 von 14 E2E-Tests (beide Dateien) rot; mit `scrollTo` ohne `behavior: 'instant'` wurden die 4 Navbar-/Footer-Tests rot (Smooth-Scroll-Zwischenpositionen erkannt).
