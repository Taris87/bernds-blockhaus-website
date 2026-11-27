# QA-Bericht: Inhalte der alten Website (feat/inhalte-alte-website)

_Unabhängige QA durch qa-engineer auf HEAD 3d06f63, abgelegt durch den Orchestrator. Nachbesserungen QA-104 bis QA-106 in daf13cd, 2d0aa3a und bb2f866._

**Gesamturteil: CONDITIONAL PASS.** Es gibt keine kritischen oder hohen Befunde.

## Geprüft
- **Gate PASS:** auf 3d06f63, nach den Nachbesserungen erneut auf bb2f866 (vom frontend-architect, Orchestrator verifiziert).
- **Inhaltstreue:** Zeichenvergleich gegen `content-inventory.md` und die Screenshot-Kacheln.
  - Telefon, E-Mail, Adressen, Namen und Öffnungszeiten stimmen.
  - Ferienwohnungen (Größen, Betten, Preise) stimmen.
  - Speisekarte (9 Kategorien, 5/5/4/3/2/7/6/2/12 Gerichte) stimmt.
  - 12 Pferde mit Abstammung und Daten stimmen, ebenso die Deckhengste und die Rindfleisch-Mengen.
  - Das Impressum stimmt. **Erfunden wurde nichts.**
- **Bilder:**
  - Keine Fotos mit fremder Quellenangabe, keine Personenfotos.
  - Alt-Texte sind deutsch, alle Bilder haben feste Maße.
  - Höchste Hochskalierung 1,07× (gemessen bei 320, 768 und 1440 px sowie in der Lightbox).
- **Browser:** 9 Routen bei 320, 375, 768 und 1440 px. Kein Overflow, keine Konsolen- oder Netzwerkfehler, je Seite genau ein h1.
- **Speisekarten-Tabs:** Bedienung per Pfeiltasten, Home und End funktioniert, ebenso roving tabindex und aria-selected.
- **Links:** Alle tel:-Links sind korrekt nach +49 umgewandelt, alle mailto:-Links stimmen.
- **Accessibility (manuell):**
  - Landmarks und `lang="de"` vorhanden, Skip-Link vorhanden.
  - Kontrast der neuen Komponenten ≥ 4,6:1.

## Befunde
| ID | Schwere | Befund | Stand |
|---|---|---|---|
| QA-100 | mittel | Sprachliche Glättungen über die Tippfehler-Liste hinaus (Anguszucht-Grammatik, Typografie, Impressum „übernehmen“) | im PR-Text vollständig ausgewiesen |
| QA-101 | niedrig | „Kan/Kann fra Haga“ vereinheitlicht | PLACEHOLDERS.md Frage 13, im PR ausgewiesen |
| QA-102 | mittel | Release-Blocker: Datenschutz fehlt; sichtbare Platzhalter (Preise/Allergene, Datenschutzhinweis im Formular, Hofgeschichte, Anfahrt); USt-IdNr.-Format | offen, nur Betreiber |
| QA-103 | niedrig | canonical, OG-Tags, sitemap.xml und robots.txt fehlen (vorbestehend) | Folgeaufgabe |
| QA-104 | niedrig | Überschriftenhierarchie h1→h3 (Ferienwohnungen), kein h2 (Galerie) | behoben in bb2f866, E2E-Test |
| QA-105 | niedrig | Hero-Foto lud mobil, obwohl ausgeblendet | behoben in 2d0aa3a, E2E-Test |
| QA-106 | niedrig | ungenutzte Bilddatei | behoben in daf13cd |

## Nicht ausgeführt
Lighthouse, automatisiertes axe, Screenreader, Firefox/WebKit, Reduced-Motion-Lauf (keine Motion-Änderung im Diff), Einzelvergleich aller Pferdefotos (nur Stichprobe).

## Risiken
- Die Tests prüfen die Daten gegen sich selbst. Abweichungen vom Original fallen künftig nicht automatisch auf.
- Die Verkaufspferde haben den Stand März 2021, das ist sichtbar ausgewiesen.
- Merge = Live-Gang. Danach sind die echten Kontaktdaten öffentlich, ohne Datenschutzerklärung.
