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

## Mobile Dialog

Die manuelle Tab-/Shift+Tab-Schleife wurde entfernt. Sequenzielle Tastaturnavigation wird dem nativen modalen `dialog` überlassen. Initialer Fokus, Escape-Abbruch, Fokuswiederherstellung, Strict-Mode-Schutz und Fokuswache für scriptgesteuerte Fokuswechsel bleiben erhalten.

## Formularkonfiguration

Das Frontend erfordert weiterhin einen gültigen HTTPS-Endpunkt in `VITE_INQUIRY_ENDPOINT`. Ohne Endpoint, bei ungültiger URL, HTTP-Fehler oder Netzwerkfehler wird kein Erfolg angezeigt. Das Formular wird ausschließlich nach erfolgreicher HTTP-Antwort zurückgesetzt.

Offen vor Produktivbetrieb: Backend-Endpunkt und Empfängerlogik, serverseitige Validierung, Spam-/Rate-Limit-Schutz, sichere Speicherung/Weiterleitung, Monitoring, Datenschutzinformation und rechtlich erforderliche Einwilligungs-/Aufbewahrungsprozesse. Es wurde kein Endpunkt und keine Empfängeradresse erfunden oder eingerichtet.

## Testumfang

Die Playwright-Spezifikationen enthalten derzeit 8 deklarierte Tests (6 in `mobile-navigation.spec.ts` inklusive vier Viewport-Durchläufen und 2 in `navigation.spec.ts`). Das ist die statische deklarierte Testzahl, kein Nachweis eines erfolgreichen Laufs. Tatsächlich ausgeführte Ergebnisse müssen dem zugehörigen CI-Run entnommen werden.
