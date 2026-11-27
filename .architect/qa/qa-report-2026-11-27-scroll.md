# QA-Bericht: QA-107 Seitenwechsel startet oben (fix/scroll-top-on-navigation)

_Unabhängige QA durch qa-engineer auf HEAD 20a9a8d, abgelegt durch den Orchestrator._

**Gesamturteil: PASS.**

Auslöser: Benutzer meldete nach Live-Gang „Navbar-Links führen zur richtigen Seite, aber die Seite startet in der Mitte“. Ursache: `SiteLayout` fokussierte bei pathname-Wechsel nur `main`, ohne nach oben zu scrollen.

## Geprüft
- **Gate PASS** auf 20a9a8d.
- **Seitenwechsel:** 9 Routen bei 375, 768 und 1440 px, jeder interne Link (Navbar bzw. Mobile-Menü, Footer, Karten, Buttons), nach weitem Scrollen. **306 Seitenwechsel, 0 Fehler.**
  - Jede neue Seite startet bei scrollY 0, mit Fokus auf `main`.
  - Kein sichtbares Hochscrollen (Frame-Log über rAF).
  - Keine Konsolenmeldungen.
- **Zurück/Vor:** Die Position wird exakt wiederhergestellt (1440 und 375 px).
- **Skip-Link:** korrekt.
- **Weitere Stellen ohne Befund:** Speisekarten-Tabs, Lightbox, Anfrageformular, Same-Page-Links.
- **Code Review:** Listener werden aufgeräumt, StrictMode ist unkritisch, Edge-Cases sind abgefangen, keine Tests gelockert.

## Befunde
| ID | Schwere | Befund | Stand |
|---|---|---|---|
| QA-108 | niedrig | Positions-Map ohne Obergrenze | dokumentiert, optional |
| QA-109 | niedrig | Doku-Aussage zur nativen Wiederherstellung nach Neuladen nicht belegt (headless: 0, wie vor dem Fix) | Doku präzisiert |
| QA-110 | niedrig | Neue E2E-Tests nur auf /eichwieserhof bei 375 und 1440 px | optional, manuelle Messung deckt alle Routen ab |

## Nicht ausgeführt
Firefox/WebKit, Headful-Reload, eigenständiger Reduced-Motion-Lauf (nur über Gate-Tests abgedeckt).
