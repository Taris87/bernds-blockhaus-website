# QA-Bericht: Redesign „Hüttenwand“ (design/redesign-ux-motion)

_Unabhängige QA durch qa-engineer, drei Durchgänge. Abgelegt durch den Orchestrator._

**Gesamturteil: PASS** (nach 2 Korrekturschleifen). Offen ist nur QA-116 (niedrig, Textfreigabe).

## Verlauf
| Durchgang | HEAD | Ergebnis | Kern |
|---|---|---|---|
| 1 | 84ce1e7 | FAIL | QA-111 (hoch): Überschriften mit weichem Trennzeichen nach Breakpoint-Wechsel dauerhaft unsichtbar; QA-112 bis QA-118 |
| 2 | 1ac1d04 | FAIL | QA-111 bis QA-118 bestätigt behoben; **QA-119 (hoch, Regression):** Inhalt im ersten Viewport bis zum ersten Scroll unsichtbar (`clamp()`-Startlinie = 0); QA-120 |
| 3 | 66d4371 | **PASS** | QA-119 und QA-120 bestätigt behoben, QA-111 nicht wieder aufgebrochen |

## Befunde
| ID | Schwere | Befund | Stand |
|---|---|---|---|
| QA-111 | hoch | Reveal-Elemente nach matchMedia-Revert unsichtbar | behoben ec6a484, Test `motion-resize.spec.ts` (36 Fälle) |
| QA-112 | mittel | `lightbox.spec.ts:6` nahe am Timeout | behoben c12fc98 (je Breite ein Test, ~2 s) |
| QA-113 | niedrig | Miniaturleiste 39 Tab-Stopps | behoben ef4612f (roving tabindex) |
| QA-114 | niedrig | Pause-Button bei Reduced Motion | behoben ffb3f20 |
| QA-115 | niedrig | Abweichungen Mockup / abgeschnittene Bildunterschriften | behoben 1ac1d04, Test `captions.spec.ts` |
| QA-116 | niedrig | Neue UI-Texte ohne Beleg | **offen**: Freigabe durch Benutzer/Betreiber (Liste im PR) |
| QA-117 | niedrig | Footer-Links < 24 px | behoben fb84db9 |
| QA-118 | niedrig | kein Font-Preload, README/Lizenzen | behoben 35196d3; CLS `/` 0,078 → 0,0025, `/eichwieserhof` 0,042 → 0,0056 |
| QA-119 | hoch | erster Viewport bis zum Scroll unsichtbar (Regression aus ec6a484) | behoben a0b271b (`reachableStart`), Test `motion-initial.spec.ts` (30 Fälle) |
| QA-120 | niedrig | Konsolenwarnung „GSAP target not found“ | behoben 66d4371 |

## Geprüft (letzter Durchgang)
- Gate PASS auf 66d4371 (allein gelaufen).
- **Laden ohne Scroll:** 10 Routen × 4 Größen = 40 Fälle, alle sauber. Zusätzlich langsames Laden (300 ms Latenz, 200 KB/s, CPU 4×).
- **Resize-Matrix:** 1440↔700/1000, 375↔900, 1100→1440 auf 6 Routen, nichts verborgen, kein Aufblitzen.
- **Reveal-Charakter erhalten:** Elemente unterhalb des Folds bleiben beim Laden verborgen und blenden beim Scrollen weich ein, nur einmal.
- **Weiter korrekt:** QA-107 (neue Seite oben, Zurück/Vor stellen die Position wieder her) und QA-043 (Galerie-Filter ohne Scroll-Sprung). Lightbox (Tastatur, Swipe), Laufband, Reduced Motion.
- **Layout-Matrix** 9 Routen × 5 Breiten:
  - 0 Overflow, 0 Konsolenfehler, kein Text < 12 px.
  - Kontraste der Tokens erfüllen alle AA.
- **Inhaltstreue gegenüber `main`:**
  - Alle Fakten vorhanden: Öffnungszeiten, Kontakte, Preise, Speisekarte, Pferde, Impressum.
  - Entfallen sind nur Strukturtexte, wie im Konzept vorgesehen.

## Nicht ausgeführt
Safari, Firefox, Lighthouse, axe-core, Screenreader, Echtgerät-Touch.

## Bekannt / Folgeaufgaben
- Bundle JS 181 kB gzip (+34 kB durch GSAP-Plugins) → Code-Splitting pro Route.
- Nicht umgesetzt (Soll/Kann): Glide der Eichwieserhof-Leiste, Header-Schrumpfen, Höhenlinien zeichnen.
- Lightbox-Schließen 0,35 s statt 0,55 s (vom Konzept abweichend, vertretbar).
- Bestand auf `main`: Deep-Link mit Hash/Reload startet oben; keine Canonical/OG/sitemap/robots.
