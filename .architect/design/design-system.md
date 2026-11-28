# Designsystem „Hüttenwand“ – Bernd’s Blockhaus

Stand: 2026-11-27 · Autor: creative-director · Branch: `design/redesign-ux-motion` · Status: **Entwurf zur Freigabe durch den Benutzer**

Mockups (nur Vorschau, kein Produktivcode): `.architect/design/mockups/`
- Vorher: `vorher-startseite-1440.png`, `vorher-startseite-375.png`, `vorher-galerie-1440.png`, `vorher-galerie-375.png`
- Nachher: `neu-startseite-1440.png`, `neu-startseite-375.png`, `neu-galerie-1440.png`, `neu-galerie-375.png`, `neu-galerie-lightbox-1440.png`, `neu-galerie-lightbox-375.png`
- Bewegung: `neu-motion-storyboard-hero.png` (4 Phasen des Hero-Einstiegs)
- Quellen: `home.html`, `galerie.html`, `storyboard.html`, `mockup.css` (mit `?p=0..1` friert `home.html` die Hero-Animation ein, mit `?lb=1` öffnet `galerie.html` die Lightbox)

---

## 0. Audit der aktuellen Seite (Screenshots 375/1440 px, alle 6 Routen)

Gemessen per Playwright (Build von `design/redesign-ux-motion`, `vite preview`). „Bildanteil“ = Fläche aller sichtbaren Fotos in `main` geteilt durch die Seitenfläche.

| Route | Höhe 1440 / 375 | Fotos | Bildanteil 1440 / 375 |
|---|---|---|---|
| / | 3 358 / 4 219 px | 4 | 10 % / 19 % |
| /gaststaette | 3 739 / 4 381 px | 5 | 10 % / 16 % |
| /ferienwohnungen | 3 874 / 5 824 px | 12 | 12 % / 17 % |
| /eichwieserhof | 6 418 / 11 240 px | 20 | 18 % / 32 % |
| /galerie | 4 692 / 11 953 px | 39 | 60 % / 76 % |
| /kontakt | 2 165 / 3 200 px | 1 | 4 % / 9 % |

**Befunde (konkret, nach Schwere):**

1. **Die Hausschriften werden gar nicht geladen.** `--font-display: "Cormorant Garamond"` und `--font-body: "DM Sans"` sind deklariert, aber es gibt keine `@font-face`-Regeln und keine Dateien (`public/fonts/` enthält nur eine README). `document.fonts` ist leer – gerendert werden **Georgia und Arial**. Ein großer Teil des „langweiligen“ Eindrucks kommt daher: Standard-Systemschriften ohne Charakter.
2. **Startseite = Text mit Foto-Beilage.** Hero (1440): dunkelgrüner Verlauf, links Headline, rechts **ein** gerahmtes Foto (432 px). Auf 375 px ist im Hero **kein einziges Foto** (`.hero-photo` unter 1024 px ausgeblendet) – der erste Bildkontakt kommt nach ca. 1 900 px Scrollen. Danach: eine Text-Sektion mit 75 % Leerraum (Headline links, zwei Zeilen rechts), eine austauschbare Drei-Karten-Reihe, ein zentriertes Zitat. Das Zitat **wiederholt wörtlich** die Headline der Willkommen-Sektion („Ein Platz zum Bleiben. Ein Moment zum Genießen.“).
3. **Monotoner Rhythmus.** Fast jede Unterseite folgt demselben Muster: Sandstein-Intro (h1 + Absatz, 430–600 px nur Text) → `two-column` (Text | gerahmtes Foto) → grünes Band → `two-column` gespiegelt. Gleiche Abstände (90–130 px), gleiche Komposition, kein Wechsel der Größenordnung. Nichts überlappt, nichts bricht aus dem Raster.
4. **Bild-Text-Verhältnis.** 4–12 % Bildfläche auf Inhaltsseiten. Die Fotos sind klein (300–700 px) und werden einzeln mittig in eine halbe Spalte gesetzt – sie wirken dadurch noch kleiner („Briefmarke im Feld“, siehe /gaststaette Terrasse und /kontakt Wegweiser).
5. **Galerie = Raster mit Stempel.** 39 Bilder in starren 260-px-Kacheln (3 Spalten, mittlere Spalte um 32 px versetzt), alle per `object-fit: cover` beschnitten – Hochformate (Gerichte, Wegweiser, Schilf) verlieren Inhalt. Grüne Caption-Kästen überdecken die Bilder. Kein Filter, keine Zählung, keine Bewegung. Mobil: **eine** Spalte, 11 953 px lang.
6. **Lightbox** öffnet ohne Übergang ein helles Panel mit max. 420 px hohem Bild; kein Bezug zur Kachel, keine Miniaturleiste.
7. **Kaum Motion.** Es gibt nur `Reveal.tsx` (12 px Fade beim Mount, nicht scroll-gebunden). Keine Scroll-Animationen, keine Galerie-Animation, keine Hover-Zustände außer Farbwechseln.
8. **Hierarchie / Kleintext.** Eyebrows 10 px, Captions 10 px, Button-Text 11 px – auf 1440 px kaum lesbar und ohne Gewicht; alle Headlines dieselbe „Wort + *kursives Wort.*“-Formel.
9. **Generische Muster** (laut Auftrag zu vermeiden): Hero mit Verlauf + Headline + Button, Drei-Karten-Reihe, zentriertes Zitatband.
10. **Eichwieserhof**: wichtigster Inhalt (Verkaufspferde) ist eine 4 958 px lange Kartenliste (375 px), die Sprungnavigation ist eine Reihe kleiner Rahmen-Links ohne Sticky-Verhalten.

---

## 1. Konzeptidee

**Die Seite fühlt sich an wie die Holzwand in der Gaststube einer Wanderhütte: ein grüner Wegweiser zeigt die Richtung, daneben hängen Fotos, Speisetafel und Öffnungszeiten – handfest, sonnig, einladend.**

Stimmung in 3 Stichworten: **handfest · sonnig · gastlich**

Begründung:
- Der Betrieb heißt selbst „Rad-, Reit- und Wanderhütte“; das stärkste eigene Motiv im Fotobestand ist der **grüne Wegweiser** vor dem Rapsfeld (`blockhaus/blockhaus-wegweiser.jpg`). Daraus wird das Ordnungsprinzip der Seite: Labels, Links und Navigation als Wegweiser-Schilder (Pfeilform, schmale Groteskschrift).
- Die Fotos sind klein (300–800 px). Statt sie aufzublasen, werden sie **wie echte Abzüge** behandelt: in Originalgröße oder kleiner, mit Papierrand, leicht gedreht, überlappend „angepinnt“. Kleine Bilder wirken dann gewollt und persönlich statt unscharf.
- **Typografie ist das Hauptbild**: sehr große, warme Serifen-Headlines tragen die Fläche, die sonst ein Vollbildfoto füllen würde.
- Farben aus den Fotos: Waldgrün, Wegweiser-Grün, Raps/Löwenzahn/Sonnenblume (Gelb), Blockhaus-Holz (Terrakotta/Braun), Rosen (Rot nur als Platzhalter-/Fehlerfarbe).
- **Höhenlinien** (Wanderkarte) als wiederkehrendes SVG-Ornament – gleichzeitig lesbar als Holzmaserung. Dazu ein **Eichenblatt** als Trenner (Eichwieserhof).

Was bewusst anders ist als vorher: heller statt dunkler Hero, Collage statt Einzelfoto, Wegweiser-Index statt Drei-Karten-Reihe, Zahlen als Bildersatz, horizontaler Bildstreifen, echte Masonry-Galerie mit Filter und FLIP-Lightbox, scroll-gebundene Motion.

---

## 2. Referenzen & Inspiration

Nur Muster, **keine Übernahme** von Texten, Bildern, Logos oder Layouts 1:1. Alle Recherche-Angaben stammen aus den Awwwards- bzw. 21st.dev-Seiten (abgerufen 2026-11-27); Live-Seiten wurden nur bei Coquelicots und Mont Rural strukturell angesehen (Text-Abruf, keine Screenshots).

### 2.1 Awwwards (Restaurant & Hotel, Food & Drink, Nature/Hospitality)

| # | Referenz | Auszeichnung | Was als Muster taugt | Passung zu kleinen Fotos | Wo im Konzept |
|---|---|---|---|---|---|
| R1 | **Hotel Jägerhof** (Südtirol) – https://www.awwwards.com/sites/hotel-jagerhof · https://www.jagerhof.net/ | Honorable Mention 26.12.2025; Tags Animation, Parallax, Storytelling, **GSAP** | Alpine Wärme + moderne Typo; Palette Dunkelgrün `#2E4F3E` + Terrakotta `#C66A3C` bestätigt unsere Grün/Holz-Achse; Storytelling-Scroll mit GSAP | Parallax nur leicht und auf kleinen Bildgruppen, nicht auf Vollbildern | Farbsystem (Grün/Terrakotta beibehalten), Motion-Stil „ruhig erzählend“ (Kap. 7) |
| R2 | **Waldhaus Sils** – https://www.awwwards.com/sites/waldhaus-sils · https://www.waldhaus-sils.ch/ | Honorable Mention 12.11.2024; Tags Illustration, Gallery, Microinteractions, Unusual Navigation | Familienbetrieb (5. Generation) mit Illustration als Bildersatz und Galerie; Farbe Waldgrün `#1E5E42` | Illustration/Ornament füllt Fläche, Fotos bleiben klein | Höhenlinien- und Eichenblatt-SVGs, Wegweiser-Navigation |
| R3 | **Vakantiehuis Coquelicots** – https://www.awwwards.com/sites/vakantiehuis-coquelicots · https://coquelicots.nl | Honorable Mention 26.08.2026; Tags Parallax, Scrolling, **Gallery**; GSAP + Nuxt | Ferienhaus einer Familie: große zweizeilige Headlines, Familienfoto neben kurzem Text, Foto-Teaser (3 Kacheln) → Galerie, Direktbuchung im Fokus | Teaser-Reihe statt Vollbild, viel Typo | Ferienwohnungen: Anfrage-Fluss prominent, Galerie-Teaser als Bildstreifen |
| R4 | **Masia Mont Rural** – https://www.awwwards.com/sites/masia-mont-rural · https://mont-rural.emblematica.agency | Honorable Mention 21.09.2026; Tags Typography, Minimal, Footer Design | Landgut: Headline-Wörter versetzt über die Fläche, Eyebrows in Klammern, Fakten-Zeile (Ort, Zimmer, Kapazität) direkt im Hero, Raum-Kacheln | Kommt fast ohne große Fotos aus – Typo + Fakten tragen | Hero mit Öffnungszeiten-Tafel und „bis 60“-Stempel; Fakten-Labels bei Ferienwohnungen (60 qm · bis zu 5 Betten) |
| R5 | **Casa Momo** – https://www.awwwards.com/sites/casa-momo · https://www.casamomo.at/ | Honorable Mention 31.10.2026; Tags Minimal, Parallax, Typography | Ferienapartments, warm-minimalistisch, Creme `#FFF0CA` + Fast-Schwarz | Ruhige Flächen, Bilder als Akzent | Ferienwohnungen-Seite: ruhigere Variante des Systems (weniger Drehung, mehr Weißraum) |
| R6 | **Tengile – MalaMala Collection** – https://www.awwwards.com/sites/tengile-malamala-collection | **Site of the Day** 03.10.2026; Tags Storytelling, Editorial, UI Design | Editoriales Erzählen eines Naturorts; Off-White `#FBF8F6` + Oliv | Basiert auf großen Bildern – nur das **editoriale Raster** (Nummern, Captions, Textspalten) übernehmen, nicht die Vollbilder | Nummerierte Index-Listen („01 Gaststätte“), Bildunterschriften mit Laufnummer |
| R7 | **Pursell Farms** – https://www.awwwards.com/sites/pursell-farms | Honorable Mention 11.12.2023; Tags Gallery, Storytelling | Farm-Resort, „rustikal + gepflegt“ | Setzt große Bilder ein – Muster nur für den Ton (rustikal, aber aufgeräumt) | Tonalität, Kontrast „Holz + Papier“ |
| R8 | **Veluwe** – https://www.awwwards.com/sites/veluwe | Nominee 19.11.2026; Tags Illustration, Storytelling, Microinteractions | Naturunterkünfte, illustriert, Tag/Nacht-Szenen | Illustration statt Foto | Kann-Idee: Höhenlinien-Ornament mit dezenter Tageszeit-Färbung – **nicht** im Muss-Umfang |

Nicht ergiebig: Die Awwwards-Detailseiten nennen meist keine Schriften; konkrete Layoutmuster stammen aus den Tags/Beschreibungen und – bei R3, R4 – aus der Live-Seitenstruktur. Kein Abruf wurde verweigert.

### 2.2 21st.dev (UI-/Motion-Komponenten)

Ergebnis vorweg: Fast alle Komponenten setzen auf `motion`/`framer-motion` und/oder shadcn/Radix und werden über die shadcn-CLI mit **21st-API-Key** installiert. Wir haben GSAP 3.15.1 inkl. **ScrollTrigger, SplitText und Flip** (seit 3.13 frei, liegen in `node_modules/gsap/`). **Empfehlung: alles mit GSAP nachbauen, nichts übernehmen** – kein neuer Dependency-Baum, kein API-Key, Reduced-Motion zentral über `gsap.matchMedia()`.

| # | Komponente | URL | Muster | Lizenz / Abhängigkeiten | Empfehlung |
|---|---|---|---|---|---|
| K1 | Masonry Lightbox (Ayushmaan Singh, Serenity UI) | https://21st.dev/@ayushmxxn/components/masonry-lightbox | Masonry + Hover + animierte Lightbox | MIT; **next** + framer-motion | Nachbauen (Grid-Masonry + GSAP Flip). Next-Abhängigkeit passt nicht zu Vite. |
| K2 | Image Gallery Masonry (Mohammad Shehadeh) | https://21st.dev/@mohammadshehadeh/components/image-gallery-01 | Masonry mit **Tab-Filter**, Hover-Zoom, Leerzustand | MIT; Installation via 21st-Key | Muster für Filterchips + Leerzustand übernehmen, Code nachbauen |
| K3 | Text Reveal (Mohammad Shehadeh) | https://21st.dev/@mohammadshehadeh/components/text-reveal | Wörter/Zeilen gleiten aus Maske, gestaffelt, beim Scrollen; respektiert Reduced Motion | MIT; `motion` | Nachbauen mit GSAP SplitText (`mask: 'lines'`) |
| K4 | Tweenly Scroll Text Reveal | https://21st.dev/@mirukullacode/components/tweenly-scroll-text-reveal | Text-Reveal **mit Pinning** | MIT; GSAP | **Nicht** verwenden – Pinning = Scroll-Jacking-Nähe (siehe Abgrenzung) |
| K5 | Marquee (Magic UI / Dillion Verma) | https://21st.dev/@dillionverma/components/marquee | Endlos-Laufband für Text/Bilder | MIT; CSS-Keyframes | Nachbauen (CSS-Keyframe oder GSAP-Ticker), mit Pause-Button und Reduced-Motion-Stopp |
| K6 | Marquee (Kevin Girelli) | https://21st.dev/@kevingirelli/components/marquee | Pause bei Hover **und Fokus**, ziehbar | MIT | Muster „Pause bei Hover/Fokus“ übernehmen |
| K7 | Stacking Cards (Daniel Petho) | https://21st.dev/@danielpetho/components/stacking-cards | Karten pinnen und skalieren beim Scrollen | MIT; `motion` | Nur als Kann-Idee (Ferienwohnungen); ohne Pinning umsetzen oder weglassen |
| K8 | Animated Tabs (Edu Calvo, SmoothUI) | https://21st.dev/@educalvolpz/components/animated-tabs | Gleitender Tab-Indikator, Tastaturbedienung | MIT; `motion` | Muster für Speisekarten-Tabs; mit GSAP Flip nachbauen (Indikator wandert) |
| — | Shared Element Gallery (easemize) | https://21st.dev/@easemize/components/shared-element-gallery | Shared-Element-Übergang Galerie → Detail | Seite lieferte beim Abruf **HTTP 404** – nicht geprüft | Prinzip (FLIP) mit GSAP Flip umsetzen |

Lizenzen laut 21st.dev-Listing; vor einer etwaigen Übernahme müsste die Lizenz im Quell-Repository geprüft werden – wird hier nicht empfohlen.

---

## 3. Design-Tokens

### 3.1 Farben (Bewertung bestehender Tokens)

| Token | Wert | Entscheidung | Rolle |
|---|---|---|---|
| `forest` | `#263C32` | **behalten** | Primärfläche dunkel, Buttons, Text auf Hell |
| `moss` | `#354D40` | behalten | Hover für `forest` |
| `ivory` | `#F3EFE6` | **behalten** | Seitenhintergrund |
| `sandstone` | `#E5DDCE` | behalten | Sektionswechsel, Collage-Fläche |
| `wood` | `#342D27` | **behalten** | Fließtext, Linien |
| `terracotta-text` | `#80502F` | **behalten** | Kursive Akzente, Labels, Nummern |
| `terracotta` | `#A66D45` | **nur Deko** (3,74:1 auf ivory – nicht für Text) | Linien/Ornamente |
| `muted-stone` / `muted-stone-text` | `#817F73` / `#656357` | **ersetzen** durch `ink-soft` | – |
| (hart codiert) `#625f56` | – | **ersetzen** durch `ink-soft` (4,73:1 auf sandstone ist knapp) | – |
| **neu** `ink-soft` | `#57524A` | neu | Sekundärtext |
| **neu** `paper` | `#FBF8F1` | neu | Fotorahmen, Tafeln, helle Bänder |
| **neu** `sign` | `#1E6A43` | neu (Wegweiser-Grün aus dem Foto) | Wegweiser-Labels, Links-als-Schild |
| **neu** `raps` | `#E3B935` | neu (Raps/Löwenzahn/Sonnenblume) | Akzentflächen, Stempel, Akzenttext **nur auf Dunkel** |
| **neu** `bark` | `#2A221C` | neu | Footer, Lightbox-Hintergrund |
| **neu** `terra-light` | `#D9B18C` | aus bestehendem Hardcode übernommen | Akzenttext auf Dunkel |
| **neu** `rose` | `#A8323A` | neu | Platzhalter-/Fehlerkennzeichnung |

**Kontraste (WCAG 2.x, berechnet):**

| Vordergrund / Hintergrund | Kontrast | Nutzung | AA |
|---|---|---|---|
| wood / ivory | 11,80 | Fließtext | ok |
| wood / sandstone | 10,04 | Fließtext | ok |
| wood / paper | 12,77 | Text auf Tafeln | ok |
| ink-soft / ivory | 6,75 | Sekundärtext | ok |
| ink-soft / sandstone | 5,74 | Sekundärtext | ok |
| ink-soft / paper | 7,30 | Captions | ok |
| terracotta-text / ivory | 5,89 | Labels, Kursiv | ok |
| terracotta-text / sandstone | 5,01 | Labels | ok |
| terracotta-text / paper | 6,37 | Nummern | ok |
| forest / ivory | 10,31 | Buttons outline, Zahlen | ok |
| white / forest | 11,83 | Button-Text | ok |
| ivory / forest | 10,31 | Text auf Grün | ok |
| raps / forest | 6,34 | Akzenttext auf Grün | ok |
| terra-light / forest | 5,98 | Akzenttext auf Grün | ok |
| white / sign | 6,57 | Wegweiser-Label | ok |
| ivory / sign | 5,72 | Wegweiser-Label | ok |
| forest / raps | 6,34 | Text auf Raps-Label/Stempel | ok |
| wood / raps | 7,26 | Text auf Raps | ok |
| ivory / bark | 13,62 | Footer, Lightbox | ok |
| rose / ivory | 5,75 | Platzhalter-Kennzeichnung | ok |
| terracotta `#A66D45` / ivory | 3,74 | **nur Deko / ≥ 24 px fett** | nur Großtext |

Nicht-Text-Kontrast (≥ 3:1): Fokusring `terracotta-text` auf ivory 5,89 ✓; Chip-Rahmen `forest` auf ivory 10,31 ✓.

### 3.2 Schriften (alle SIL Open Font License, selbst gehostet über Fontsource)

| Rolle | Schrift | Paket | Schnitte | Begründung |
|---|---|---|---|---|
| Display | **Fraunces** (variabel; Achsen opsz, wght, SOFT) | `@fontsource-variable/fraunces` (inkl. italic) | 300–700, Achse `SOFT 50` | Warm, „weiche“ Serife mit Charakter, sehr gute Kursive – trägt die Fläche statt großer Fotos. Ersetzt Cormorant Garamond (zu zart in großen Größen, wurde ohnehin nie geladen). |
| Schild / Labels / Navigation | **Barlow Condensed** | `@fontsource/barlow-condensed` | 500, 600, 700 | Schmale Grotesk im Geist von Wegweiser-/DIN-Beschriftungen; Uppercase mit Sperrung. Neu. |
| Fließtext | **DM Sans** (variabel) | `@fontsource-variable/dm-sans` | 400, 500, 700 | Bleibt (war geplant, jetzt tatsächlich geladen). |

Nur `latin`-Subset importieren, `font-display: swap`. Fontsource-Pakete sind Build-Zeit-Abhängigkeiten (WOFF2 werden gebündelt, keine Laufzeit-Abhängigkeit, keine Drittanbieter-Requests). Alternative ohne Paket: WOFF2 manuell nach `public/fonts/` + `@font-face`. Fallback-Metrik: `size-adjust` optional, um CLS zu begrenzen.

### 3.3 Größenskala (fluid, `clamp`; Werte 375 → 1440 px)

| Token | 375 | 1440 | clamp | Schrift / Einsatz |
|---|---|---|---|---|
| `display-xl` | 58 px | 136 px | `clamp(58px, 9.2vw, 136px)` | Fraunces 380, lh .9, ls -0.025em – Hero-H1, Galerie-H1 |
| `display-l` | 44 px | 92 px | `clamp(44px, 6.4vw, 92px)` | Fraunces 400, lh .95 – Sektions-H2 |
| `display-m` | 46 px | 96 px | `clamp(46px, 6vw, 96px)` | Fraunces 400 – Index-Titel („Gaststätte“) |
| `number` | 72 px | 132 px | `clamp(72px, 9vw, 132px)` | Fraunces 350, `lining-nums` – Zähler |
| `h3` | 28 px | 40 px | `clamp(28px, 3vw, 40px)` | Fraunces 400 – Karten-/Lightbox-Titel |
| `lead` | 16 px | 18 px | – | DM Sans 400, lh 1.65 |
| `body` | 16 px | 17 px | – | DM Sans 400, lh 1.65, max. 68 ch |
| `sign` | 15 px | 17 px | – | Barlow Condensed 600, Uppercase, ls .08–.14em |
| `caption` | 13 px | 16 px | – | Barlow Condensed 600, Uppercase, ls .08em |
| `small` | 13 px | 14 px | – | DM Sans – Hinweise, Footer-Kleintext |

Mindestgröße für Text: 13 px (vorher 8–10 px).

### 3.4 Abstände, Radien, Schatten, Formen

- **Abstandsskala** (4-px-Basis): 4, 8, 12, 16, 24, 32, 48, 64, 96, 128. Sektionsabstand `--space-section`: `clamp(72px, 9vw, 130px)`.
- **Gutter**: `clamp(16px, 5vw, 72px)`; Container max. 1 296 px.
- **Radien**: 0 (kantig wie Holz/Papier). Einzige Rundungen: Brand-Mark und Stempel (Kreis).
- **Schatten**: `--shadow-photo: 0 1px 0 rgb(0 0 0 / 6%), 0 18px 40px -12px rgb(42 34 28 / 38%)` (Fotoabzug); `--shadow-stamp: 0 10px 24px -10px rgb(0 0 0 / 40%)`. Keine weichen „Card“-Schatten.
- **Form „Wegweiser“**: `clip-path: polygon(0 0, calc(100% - 14px) 0, 100% 50%, calc(100% - 14px) 100%, 0 100%)` (Pfeil rechts), gespiegelt für „zurück“.
- **Fotoabzug**: Rand 10 px (mobil 8 px), unten 34 px für Caption, Hintergrund `paper`, Drehung −5° … +4° (nur Desktop/Tablet stark, mobil max. ±4°).
- **Ornamente (SVG, inline, `aria-hidden`)**: Höhenlinien (Stroke 1.4 px, Deckkraft 12–55 %), Eichenblatt 24–32 px als Trenner, Klebeband-Streifen (`raps` 55 %, `mix-blend-mode: multiply`).

### 3.5 Tailwind-4-`@theme`

```css
@theme {
  /* Farben */
  --color-forest: #263C32;
  --color-moss: #354D40;
  --color-sign: #1E6A43;
  --color-ivory: #F3EFE6;
  --color-paper: #FBF8F1;
  --color-sandstone: #E5DDCE;
  --color-wood: #342D27;
  --color-bark: #2A221C;
  --color-ink-soft: #57524A;
  --color-terracotta: #A66D45;      /* nur Deko */
  --color-terracotta-text: #80502F;
  --color-terra-light: #D9B18C;     /* nur auf Dunkel */
  --color-raps: #E3B935;            /* Fläche; Text nur auf Dunkel */
  --color-rose: #A8323A;            /* Platzhalter/Fehler */

  /* Schriften */
  --font-display: "Fraunces Variable", "Fraunces", Georgia, serif;
  --font-sign: "Barlow Condensed", "Arial Narrow", sans-serif;
  --font-body: "DM Sans Variable", "DM Sans", Arial, sans-serif;

  /* Größen */
  --text-display-xl: clamp(58px, 9.2vw, 136px);
  --text-display-xl--line-height: .9;
  --text-display-l: clamp(44px, 6.4vw, 92px);
  --text-display-l--line-height: .95;
  --text-display-m: clamp(46px, 6vw, 96px);
  --text-display-m--line-height: .95;
  --text-number: clamp(72px, 9vw, 132px);
  --text-number--line-height: .9;
  --text-h3: clamp(28px, 3vw, 40px);
  --text-lead: 1.125rem;
  --text-sign: 1.0625rem;
  --text-caption: 1rem;

  /* Abstände */
  --spacing-gutter: clamp(16px, 5vw, 72px);
  --spacing-section: clamp(72px, 9vw, 130px);
  --container-site: 1296px;

  /* Schatten */
  --shadow-photo: 0 1px 0 rgb(0 0 0 / 6%), 0 18px 40px -12px rgb(42 34 28 / 38%);
  --shadow-stamp: 0 10px 24px -10px rgb(0 0 0 / 40%);

  /* Motion */
  --ease-out-soft: cubic-bezier(.22, 1, .36, 1);
  --ease-out-strong: cubic-bezier(.16, 1, .3, 1);
  --duration-fast: 180ms;
  --duration-base: 320ms;
  --duration-reveal: 900ms;
}
```

---

## 4. Raster und Breakpoints

- **Mobile first, 375 px**: 1 Spalte, Gutter 16–19 px, Collagen als feste Kompositionen mit absolut positionierten Fotos (Höhe 250–430 px), Fotos 110–290 px breit.
- **768 px (Tablet)**: 6-Spalten-Raster, Gutter 32 px; Index-Zeilen 2-spaltig (Nummer | Inhalt, Fotos darunter rechts), Galerie 3 Spalten.
- **1100 px**: Umschaltpunkt auf 2-spaltige Kompositionen (Hero, Feiern, Hof).
- **1440 px (Desktop)**: 12-Spalten-Raster, Container 1 296 px, Spaltenabstand 24–40 px; Galerie 4 Spalten (je ca. 300 px).
- Asymmetrie-Regel: Text-Bild-Splits nie 6/6, sondern 7/5 oder 5/7; Fotogruppen ragen bis an den Viewport-Rand (Collage-Fläche läuft rechts aus).
- **Kein horizontales Overflow bei 320 px** (Bildstreifen scrollt *innerhalb* des Containers; Collage-Fläche mit `overflow: hidden` am Sektionscontainer, nicht am `body`).

### Umgang mit kleinen Fotos – verbindliche Muster

Grundregel (E2E-Test `content.spec.ts`): angezeigte Breite/Höhe ≤ 1,5 × natürliche Größe – **Zielwert ≤ 1,15**. Gedrehte Elemente vergrößern die `getBoundingClientRect`-Box (bei 4° ca. +4–7 %) – das ist im Zielwert einkalkuliert. Mockups gemessen: max. 1,11 (Galerie 1440), 1,03 (Startseite 1440), ≤ 0,77 mobil.

| Muster | Maße 1440 / 375 | Regeln | Einsatz |
|---|---|---|---|
| **M1 Collage „Hüttenwand“** | Fläche ca. 620 × 640 / 340 × 430 px; Hauptfoto 400–420 / 290 px, Nebenfotos 170–200 / 110–125 px | 3–4 Abzüge, ±2–5° gedreht, max. 30 % Überlappung, ein Klebeband, ein Stempel, Höhenlinien-Fläche dahinter | Hero Start, Gaststätte-Intro |
| **M2 Index-Zeile mit Foto-Paar** | Zeile 300 px hoch; Fotos 300 + 210 / 232 + 150 px | Abwechselnd links/rechts überlappend; Nummer + großer Titel + Wegweiser-Link | „Drei Seiten“, Eichwieserhof-Abschnitte |
| **M3 Bildstreifen** | Bildhöhe 280 / 210 px, Breite nach Seitenverhältnis | horizontal scrollbar (Scroll-Snap), jedes 3. Bild um 48 / 28 px versetzt, Laufnummer + Titel darunter | Start (Jahreszeiten), Gaststätte (Gerichte) |
| **M4 Abzug + Zahl** | Foto 343 / 260 px + Zähler `number` | Zahl ersetzt das Großbild; Linie oben, Trennlinie zwischen Zahlen | Feiern, Ferienwohnungen (60 qm / 30 qm) |
| **M5 Panorama-Band** | `angus-herde-weide.jpg` 660 / 100 % (≤ 698 px) | Einziges Querformat > 600 px; auf dunkler Fläche mit 2 überlappenden Abzügen | Hof-Teaser, Anguszucht |
| **M6 Masonry** | Spalte 300 / 165 px | Natürliches Seitenverhältnis, kein Beschnitt, Caption unter dem Bild | Galerie |
| **M7 Kontaktbogen** | Miniaturen 96–120 px | 4er-Reihe unter dem Hauptfoto, öffnet Lightbox | Ferienwohnungen |
| **M8 Typo-Fläche** | – | Wo kein Foto passt: `display-xl`-Typo + Höhenlinien statt Platzhalterbild | Kontakt, Seitenintros |

---

## 5. Seitenaufbau je Seite

Texte ausschließlich aus `src/data/*.ts` bzw. bestehenden Seiten-Headlines. **Hinweis Slogans:** „Ankommen. Wohlfühlen. Genießen.“, „Drei Seiten eines besonderen Ortes.“, „Ein Ort voller Geschichten.“, „Zeit zum Durchatmen.“, „Naturverbunden. Authentisch.“ sind laut `content-inventory.md` **nicht aus der alten Website** und brauchen weiterhin die Freigabe des Betreibers. Das Konzept erfindet keine neuen Slogans; neue UI-Mikrotexte sind mit **[NEU]** markiert.

### 5.1 Startseite `/` (Mockup: `neu-startseite-1440.png`, `neu-startseite-375.png`)

| # | Sektion | Komposition | Inhalt / Fotos | Neu |
|---|---|---|---|---|
| 1 | **Hero „Hüttenwand“** | Hell (ivory). 1440: links 6 Sp. Typo, rechts M1-Collage auf Höhenlinien-Fläche, die rechts ausläuft. 375: Label → H1 → **Collage direkt unter der H1** (Foto im ersten Viewport) → Lead → Buttons → Öffnungszeiten | Label „Rad-, Reit- und Wanderhütte“; Eyebrow `site.heroEyebrow`; H1 `site.heroTitle` (Freigabe offen); Lead `site.heroDescription`; Buttons „Kontakt aufnehmen“, „Zur Speisekarte“ [NEU-Mikrotext]; **Öffnungszeiten-Tafel** aus `openingHours`; Stempel „bis 60 / Plätze für Ihre Feier“ (Fakt aus `gastronomyText.celebrations`, Formulierung [NEU]). Fotos: `blockhausRosen`, `gerichtHausmacher`, `blockhausWegweiser`, `islaenderSonnenblume` | Collage, Öffnungszeiten im Hero, heller Hero |
| 2 | **Laufband** | Volle Breite, forest mit `bark`-Kanten, Fraunces-Kursiv im Wechsel mit Barlow-Uppercase in Raps, Eichenblatt als Trenner | Nur Fakten: Pfälzer Küche, Selbstgebackene Kuchen, Am gemütlichen Kachelofen, Sonnige Terrasse, Islandpferde, Wanderreiterstation, Deutsch Angus, Radweganbindung | ganz neu |
| 3 | **Drei Seiten (Wegweiser-Index)** | M2: drei Zeilen mit Linien, Nummer 01–03, Titel `display-m`, Text, Wegweiser-Link, Foto-Paar wechselnd gespiegelt | Texte: `gastronomyText.kitchen`, `apartmentsTeaser`, `eichwieserhofSummary`. Fotos: `blockhausTerrasse`+`gerichtSchnitzel`, `fewoGrossSchlafzimmer`+`fewoKleinBalkon`, `islaenderWiese`+`angusBlockhaus` | ersetzt Drei-Karten-Reihe |
| 4 | **Bildstreifen „Ein Ort voller Geschichten.“** | M3 auf `paper`, Fortschrittslinie, Pfeil-Buttons (Desktop), Link „Alle 39 Fotos“ | 8 Fotos mit Galerie-Titeln: Teich Sommer, Teich Schilf, Abendlicht, Getreide, Winter nah, Festtafel, Winter fern, Weitblick | ganz neu |
| 5 | **Feste im Blockhaus** | M4 auf sandstone: Abzug Festtafel + Braten links, rechts Raps-Label, H2, Zähler „60 / Sitzplätze im Innenraum“ und „~150 / Plätze im Außenbereich“, Text, Telefon-Button | `gastronomyText.events` (gekürzt zusammengeführt – **Kürzung vom Betreiber bestätigen** oder Originalsätze verwenden), Telefon aus `contacts` | Zähler, ersetzt doppeltes Zitat |
| 6 | **Hof-Teaser** | M5 auf forest mit Höhenlinien (Raps, 12 %), rechts Text + drei gestaffelte Wegweiser (ivory) zu Abschnitts-Ankern | H2 „Isländer vom Eichwieserhof.“, `eichwieserhofSummary`. Fotos: `angusHerde`, `islaenderSonnenblumenfeld`, `islaenderAuge` | neu |
| 7 | Footer | bark, Höhenlinien 14 %, große Wortmarke, Spalten Entdecken/Kontakt | wie bisher; Footer-Slogan „Ein Ort zum Ankommen und Genießen.“ entfällt (unbestätigt) | neu gestaltet |

Entfällt: Willkommen-Sektion mit doppeltem Slogan, zentriertes Zitatband.

### 5.2 Gaststätte `/gaststaette` (kein Mockup – folgt denselben Mustern)

1. **Intro als M1-Collage (klein)**: Label „Gaststätte · Rad-, Reit- und Wanderhütte“, H1 (bestehend, Freigabe offen), `gastronomyText.kitchen`; Collage `blockhausTerrasse`, `blockhausLavendel`, `gerichtHausmacher`. Öffnungszeiten-Tafel + Telefon direkt daneben (Desktop) bzw. darunter (mobil).
2. **Teller-Streifen** (M3, Höhe 260/200 px): 15 Gerichte-Fotos mit Galerie-Titeln – ersetzt die 3 kleinen Fotos unter der Karte.
3. **Speisekarte als „Tafel“**: links Kategorie-Tabs (Wegweiser-Stil, gleitender Indikator), rechts Liste auf `paper` mit gestrichelten Trennlinien; Desktop: daneben **ein** passendes Gerichte-Foto je Kategorie (z. B. Platten → `gerichtHausmacher`, Salatvariationen → `gerichtSalatPute`), das beim Tabwechsel per Clip-Reveal wechselt. `[[PLATZHALTER: Preise, Allergene und Zusatzstoffe]]` sichtbar in `rose`-Rahmen.
4. **Feste im Blockhaus** (M4): Festtafel-Abzug, Zähler 60 / ~150, alle drei `events`-Sätze, Reservieren-Button.
5. **Herzlich willkommen** (Text `site.heroDescription` + `celebrations`) als schmale Textspalte mit Eichenblatt-Trenner – nicht mehr als eigene Split-Sektion.

### 5.3 Ferienwohnungen `/ferienwohnungen`

1. **Intro M8**: H1 (bestehend, Freigabe offen) + `apartmentsIntro`; Fakten-Wegweiser „Sehr ruhige Lage · Weitblick · Wanderreiterstation · Radweganbindung“ (aus `apartmentsIntro`).
2. **Je Wohnung eine Vollbreiten-Sektion** (statt zwei schmaler Karten): links Hauptfoto (M7, 437/457 px max.) + Kontaktbogen der 4 Miniaturen, rechts Name `display-m`, Zahlenzeile „60 qm · bis zu 5 Betten“ als Zähler (M4), Ausstattung als zweispaltige Liste mit Eichenblatt-Bullets, Preistabelle auf `paper` (Preise aus `apartments.ts`), Button „Anfrage für diese Wohnung“ [NEU] → scrollt zum Formular und setzt die Wohnung vor. Zweite Wohnung gespiegelt. Ruhigere Variante (Drehung max. ±2°, inspiriert R5 Casa Momo).
3. **Mit Ihren Pferden** (M2-Zeile): `horseHolidayText`, Fotos `islaenderZaun` + `islaenderWiese`.
4. **Umgebung**: `surroundingsText` als zwei Spalten, darüber Bildstreifen M3 kurz (`mohnblumen`, `blockhausWeitblick`, `pusteblume`, `blockhausGetreide`).
5. **Anfrageformular** auf sandstone, Formular auf `paper`; Schritt-Anmutung ohne echten Mehrschritt (inspiriert R3 Direktbuchung).

### 5.4 Eichwieserhof `/eichwieserhof`

1. **Intro**: H1 (bestehend, Freigabe offen), `eichwieserhofSummary`, Foto `eichwieserhof` als Abzug, Höhenlinien.
2. **Sticky Wegweiser-Leiste** (Abschnitte Islandpferde, Deckhengste, Verkaufspferde, Anguszucht, Rindfleisch) unter dem Header, aktiver Abschnitt markiert (ScrollTrigger `onToggle`). Ersetzt die kleinen Rahmen-Links.
3. **Islandpferde**: M1-Collage aus 4 Pferdefotos + Kontakt Anna Schellhaas als „Visitenkarte“.
4. **Deckhengste**: nummerierte Index-Liste (M2 ohne Fotos) – Name `h3`, Geburtsjahr als Zahl, Details.
5. **Verkaufspferde**: Stand-Datum als Raps-Stempel, Hinweis „nicht eingeritten“ als Tafel; Pferde als Abzug-Raster (2/3/4 Spalten), Name auf Klebeband, M/V als Kleintext. Mobil 2 Spalten statt 1 (halbiert die Länge von ~5 000 px).
6. **Anguszucht**: M5 Panorama `angusHerde` auf forest, `angusText` in zwei Spalten, `angusBlockhaus` als Abzug.
7. **Rindfleisch bestellen**: Angebote als „Hoftafel“ (bark-Fläche, Preise aus `beefOffers` groß in Fraunces), Bestelltelefon als großer Button, `pusteblume` als Abzug.

### 5.5 Galerie `/galerie` (Mockups: `neu-galerie-1440.png`, `neu-galerie-375.png`, `neu-galerie-lightbox-*.png`)

1. **Intro**: Label „Einblicke“, H1 `display-xl` (bestehend, Freigabe offen), bestehender Absatz, Zähler „39 Fotos“ (live je Filter).
2. **Sticky Filterleiste**: Chips „Alle 39 · Blockhaus & Landschaft 13 · Küche & Feiern 16 · Ferienwohnungen 3 · Hof & Tiere 7“. **Vorschlag**: feinere Kategorien statt der bisherigen 3 (bisher steckt Landschaft unter „gaststaette“ und Mohnblumen unter „eichwieserhof“) – reine Neu-Zuordnung vorhandener Einträge in `gallery.ts`, kein neuer Inhalt. Aktiver Chip als Wegweiser-Form, `aria-pressed`. Filter als Query-Parameter (`?kategorie=`) – **QA-043/QA-107 beachten**: Query-Änderung darf nicht nach oben springen (Hook `useRouteScroll` prüft das bereits für gleiche Route).
3. **Masonry (M6)** in **Lesereihenfolge**: CSS-Grid mit `grid-auto-rows: 4px` und berechnetem `grid-row-end: span n` (aus Seitenverhältnis + Caption-Höhe, kein Layout-Lesen nötig, da `width`/`height` bekannt). Nicht CSS-`columns` (würde DOM-/Tab-Reihenfolge spaltenweise ordnen). Kein Beschnitt, Caption unter dem Bild: Laufnummer, Titel, Kategorie. Kuratierte, gemischte Reihenfolge (Vorschlag im Mockup). Nach dem 9. Bild eine Info-Kachel mit Öffnungszeiten.
4. **Lightbox**: dunkel (bark 96 %), Foto ≤ 1,4 × (Abendlicht 423 → 592 px), Papierrand, Titel in Fraunces, Kategorie, Zähler „03 / 39“, Pfeile, Miniaturleiste (Höhe 62 px, aktuelles Bild mit Raps-Rahmen), Tastatur ← → Esc, Wischgesten mobil (Pointer Events, kein Paket).

### 5.6 Kontakt `/kontakt`

1. **Intro M8 mit Wegweiser-Foto als großer Abzug** (`blockhausWegweiser` 273 px, das Schild „zeigt“ auf die Kontaktdaten).
2. **Drei Visitenkarten** (paper, leichter Schatten, je ±1° gedreht) aus `contactPersons`; Telefon/E-Mail als große Links.
3. **Besuchen Sie uns**: Adresse groß, Öffnungszeiten-Tafel, `[[PLATZHALTER: Anfahrtsbeschreibung]]`, `[[PLATZHALTER: Karte/Lageplan – erst nach Datenschutz-Entscheidung]]`.

### 5.7 Rechtliches / 404

Ruhige Textseiten, gleiche Typo, keine Motion außer Seiteneinstieg.

---

## 6. Komponentenliste

| Komponente | Status | Zustände |
|---|---|---|
| `SignLabel` (Wegweiser-Schild, Link oder Span) | neu | default; hover: Pfeilspitze +6 px (`translateX`, 180 ms); focus-visible: 3 px Outline `terracotta-text`, Offset 3 px; active: `moss`; Variante `raps`, `ivory`, Richtung links/rechts |
| `Button` (primary / ghost / light) | geändert (Barlow, 52 px hoch) | hover: Hintergrund `moss`, Pfeil +4 px; focus-visible: Outline; active: `translateY(1px)`; disabled: Deckkraft .55, `cursor: not-allowed` |
| `PhotoPrint` (Fotoabzug mit Caption, Drehung, optional Klebeband) | neu | default; hover (nur wenn Link/Button): Drehung → 0°, `y -4px`, Schatten stärker; focus-visible: Outline um den Rahmen |
| `Collage` (Komposition aus `PhotoPrint`, Layout-Preset je Breakpoint) | neu | – (Motion siehe Kap. 7) |
| `ContourLines` / `OakLeaf` (SVG-Ornamente) | neu | dekorativ, `aria-hidden` |
| `OpeningHoursBoard` | geändert (aus `OpeningHours`) | statisch; optional „Heute“-Zeile hervorgehoben [Kann] |
| `Marquee` | neu | läuft; pausiert bei hover/focus-within; **Pause-Button** (WCAG 2.2.2, da > 5 s Bewegung); reduced motion: statisch, umbrechende Zeile |
| `IndexRow` (Nummer, Titel, Text, Link, Foto-Paar) | neu (ersetzt `pillar-card`) | hover: Foto-Paar dreht sich auf 0°, Titel-Unterstreichung wächst von links (scaleX); focus-within wie hover |
| `ImageStrip` (horizontaler Streifen) | neu | Pfeil-Buttons disabled am Anfang/Ende; Fokus auf Figuren per Tab; Fortschrittslinie; Scroll-Snap |
| `Counter` (Zahl + Label) | neu | Zählt einmalig hoch; Zahl ist im DOM immer der Endwert (`aria-label`/Text = Endwert), Animation nur visuell |
| `MenuBoard` (Tabs + Liste + Foto) | geändert (`MenuTabs`) | Tab: default / hover (Unterstreichung) / selected (Wegweiser-Form, `aria-selected`) / focus-visible; Pfeiltasten-Navigation bleibt |
| `GalleryFilter` (Chips) | neu | default / hover (Hintergrund sandstone) / pressed (forest, Wegweiser-Form) / focus-visible; leerer Filter: Hinweis + „Alle anzeigen“ |
| `GalleryMasonry` | geändert (`GalleryGrid`) | Kachel hover: Bild `scale(1.04)` + Label „Vergrößern +“; focus-visible: Outline; active: `scale(.99)` |
| `Lightbox` | geändert | Öffnen/Schließen mit Flip; Pfeile disabled nie (Endlos); Miniatur aktiv; Fokus-Falle (`<dialog>`), Rückgabe an auslösende Kachel |
| `SectionSignNav` (Eichwieserhof, sticky) | neu (ersetzt `section-nav`) | aktiv (Wegweiser-Form), hover, focus-visible; horizontal scrollbar mobil |
| `ContactCard` | geändert | Links mit Unterstreichung; hover leicht gerade drehen |
| `Header` | geändert | Navigation in Barlow; aktiver Link `terracotta-text` + Unterstrich; CTA als Wegweiser; beim Runterscrollen Höhe 76 → 64 px [Soll] |
| `MobileMenu` | geändert | Vollfläche forest + Höhenlinien, Links in Fraunces 44 px, gestaffeltes Einblenden |
| `Footer` | geändert | Wortmarke groß, Höhenlinien |

---

## 7. Motion-Konzept

**Prinzipien**
- Bewegung erzählt „Fotos werden an die Wand gepinnt“ und „Wegweiser zeigen den Weg“ – sonst Ruhe.
- Nur `transform`, `opacity`, `clip-path` (Clip nur auf kleinen Flächen). Keine Layout-Eigenschaften.
- Alles **einmalig** beim ersten Erscheinen (`once: true`), außer leichtem Parallax (scrub).
- **Inhalt ist ohne JS und bei reduzierter Bewegung vollständig sichtbar**: Ausgangszustände werden **nur in JS** gesetzt (`gsap.from` innerhalb `gsap.matchMedia('(prefers-reduced-motion: no-preference)')`), nie per CSS `opacity: 0`.
- Zentral: ein Hook `useMotion(scope, setup)` = `useGSAP` + `gsap.matchMedia()` (Breakpoints `(min-width: 768px)` / `(max-width: 767px)` × Reduced Motion). Plugins: ScrollTrigger, SplitText, Flip – **alle in `gsap` 3.15.1 enthalten**, keine neue Abhängigkeit.
- Nach Routenwechsel: `ScrollTrigger.refresh()` erst nach dem Scroll-Reset von `useRouteScroll` (Layout-Effekt) – im passiven Effekt bzw. `requestAnimationFrame`. Beim Verlassen: `context.revert()`.

**Easing & Dauer (Tokens)**
- `expo-ähnlich` → GSAP `power4.out` (= `--ease-out-strong`) für Reveals, 0,8–1,0 s
- `power3.out` für Einblenden/Versatz, 0,5–0,7 s
- `back.out(1.4)` nur auf Rotation der Abzüge
- Mikro-Interaktionen: CSS `--ease-out-soft`, 180–320 ms
- Stagger: Zeilen 0,12 s, Fotos 0,14 s, Kacheln 0,05 s (max. 0,6 s gesamt pro Gruppe)

### 7.1 Animationen nach Priorität

| Prio | Bereich | Animation | Dauer / Easing / Trigger | Mobil (< 768 px) | Reduced Motion |
|---|---|---|---|---|---|
| **Muss** | Hero Start | Storyboard `neu-motion-storyboard-hero.png`: Wegweiser-Label `clip-path inset(0 100% 0 0) → 0` (0,35 s); Höhenlinien-Fläche von unten; H1 per **SplitText `type: 'lines', mask: 'lines'`** `yPercent 110 → 0`, Stagger 0,12 s, 0,9 s `power4.out`; Abzüge `y 70 → 0`, `rotation ±8° → Endwinkel`, `autoAlpha`, Stagger 0,14 s; Stempel `scale .6 → 1` | Gesamt ≤ 1,6 s, beim Mount (kein ScrollTrigger) | gleiche Abfolge, Abzüge nur `y 40`, Drehung ±4°, Gesamt ≤ 1,2 s | Endzustand sofort, keine Tweens |
| **Muss** | Alle H2 (`display-l/m`) | Zeilen-Reveal aus Maske (SplitText lines) | 0,8 s `power4.out`, Stagger 0,1 s, ScrollTrigger `start: 'top 85%'`, once | identisch | statisch |
| **Muss** | Fotoabzüge in Sektionen (M1, M2, M4, M5) | „Anpinnen“: `y 40 → 0`, `rotation 0 → Endwinkel` bzw. von ±6°, `autoAlpha 0 → 1` | 0,7 s `power3.out` + Rotation `back.out(1.4)`, Stagger 0,14 s, `top 80%`, once | `y 24`, Stagger 0,1 s | statisch |
| **Muss** | Einzelbilder ohne Rahmen (Bildstreifen, Panorama) | Clip-Reveal `clip-path: inset(0 0 100% 0) → inset(0)` + Bild innen `scale 1.12 → 1` | 1,0 s `power4.out`, `top 85%`, once (Batch für Streifen) | gleiche Animation, 0,8 s | statisch |
| **Muss** | Galerie: Einblenden | `ScrollTrigger.batch('.tile')`: `y 30 → 0`, `autoAlpha` | 0,6 s `power3.out`, Stagger 0,05 s, `top 92%`, once | Stagger 0,04 s | statisch |
| **Muss** | Galerie: Filterwechsel | **GSAP Flip**: `Flip.getState(tiles)` → Filter anwenden → `Flip.from(state, { duration: .6, ease: 'power3.inOut', stagger: .02, absolute: true, onEnter: fadeIn, onLeave: fadeOut })`; Zähler zählt auf neue Anzahl | 0,6 s | 0,45 s | Sofortwechsel, Zähler ohne Animation |
| **Muss** | Lightbox öffnen/schließen | **FLIP**: Kachelbild → Lightbox-Bild (`Flip.fit` / `Flip.from` mit gemeinsamem `data-flip-id`), Hintergrund `autoAlpha 0 → 1` (0,3 s), Caption/Miniaturen versetzt; Schließen umgekehrt zur Kachel | 0,55 s `power3.inOut` | Fade + `scale .96 → 1` (0,3 s), kein FLIP (Performance, kleine Kacheln) | Sofort ein/aus |
| **Muss** | Lightbox Weiterblättern | aktuelles Bild `x 0 → ∓40`, `autoAlpha → 0`; neues von `±40` | 0,35 s `power2.out` | Wischgeste folgt Finger (Pointer Events), Snap 0,25 s | Sofortwechsel |
| **Muss** | Speisekarten-Tabs | Indikator gleitet (Flip auf `.indicator`), Liste: alte Einträge `autoAlpha → 0` (0,15 s), neue `y 12 → 0` Stagger 0,03 s; Foto-Clip-Reveal | gesamt ≤ 0,5 s | ohne Foto | Sofortwechsel, Fokusführung unverändert |
| **Soll** | Zähler (60, ~150, 60 qm, 30 qm, 39 Fotos) | Zahl zählt von 0 hoch (`gsap.to(obj, { val, snap: 1 })`), Text im DOM ist von Anfang an der Endwert, animiert wird ein `aria-hidden`-Duplikat | 1,2 s `power2.out`, `top 85%`, once | identisch | Endwert statisch |
| **Soll** | Bildstreifen | native horizontale Scroll-Leiste + zusätzlich leichte vertikal-scrollgebundene Verschiebung `x: 0 → -8 %` (scrub 0,6), Fortschrittslinie `scaleX` an `scrollLeft` | scrub | **keine** Scrub-Verschiebung, nur Wischen | keine Verschiebung |
| **Soll** | Parallax Collagen | Abzüge `yPercent ±6` gegeneinander (scrub 0,8) | scrub, nur ≥ 1024 px | aus | aus |
| **Soll** | Wegweiser-Links | Hover/Fokus: Pfeil +6 px; beim Erscheinen „ausklappen“ `rotation -4 → 0`, `transformOrigin: left center` | 0,5 s `back.out(1.6)`, once | nur Fade | statisch |
| **Soll** | Laufband | CSS-Keyframe `translateX(-50%)` 40 s linear, pausiert bei hover/focus und per Button; `IntersectionObserver` pausiert außerhalb des Viewports | 40 s | 30 s | statisch umgebrochen |
| **Soll** | Eichwieserhof Sticky-Leiste | aktiver Abschnitt: Wegweiser-Form gleitet (Flip) | 0,3 s | identisch | Sofortwechsel |
| **Kann** | Index-Zeilen hover | Foto-Paar richtet sich auf (rotation → 0), Titel-Unterstrich `scaleX 0 → 1` | 0,32 s CSS | – (kein Hover) | ohne Transition |
| **Kann** | Header | schrumpft beim Scrollen (Höhe via `scaleY` des Hintergrunds, Inhalt `y`) | 0,25 s | aus | aus |
| **Kann** | Seitenwechsel | kurzer Vorhang: `main` `autoAlpha 0 → 1`, `y 12 → 0` (ersetzt `Reveal.tsx`) | 0,4 s | identisch | aus |
| **Kann** | Höhenlinien | Linien zeichnen sich (`stroke-dashoffset`) beim ersten Erscheinen | 1,6 s, once | aus | aus |

### 7.2 Lenis – Bewertung: **Nein (vorerst)**

- Nutzen: weicheres Scrollen, synchroner Parallax. Für diese Seite gering – keine Pinning-/Scrub-Strecken, Parallax nur ±6 %.
- Risiko: Lenis übernimmt das Scrollen per JS und kollidiert mit `html { scroll-behavior: smooth }`, mit dem Sofort-Scroll nach Routenwechsel (QA-107, `behavior: 'instant'`), mit Anker-Sprüngen (Eichwieserhof) und `scroll-margin-top`, mit Fokus-Scrollen bei Tastaturbedienung und mit dem `<dialog>`-Scroll-Lock der Lightbox. E2E-Tests, die `scroll`-Events zählen, würden instabil.
- Entscheidung: kein Lenis. Falls später gewünscht: nur ≥ 1024 px, ohne `prefers-reduced-motion`, mit `lenis.scrollTo(0, { immediate: true })` im Route-Hook – als eigener PR mit QA-107-Regressionstests.

### 7.3 Was animiert wird und was nicht

Animiert: Typo-Reveals, Fotoabzüge, Clip-Reveals, Zähler, Filter/Lightbox (Flip), Tabs, Laufband, leichtes Parallax.
Nicht animiert: Fließtext-Absätze (nur gemeinsamer Fade der Sektion), Formulare, Preise, Öffnungszeiten-Werte, Kontaktdaten, rechtliche Seiten, Fokus-Indikatoren (sofort sichtbar).

---

## 8. Abgrenzung – bewusst NICHT

- **Kein Scroll-Jacking**, kein Pinning von Sektionen, keine horizontale Scroll-Übersetzung der ganzen Seite, kein Lenis (siehe 7.2).
- **Kein Autoplay-Video**, keine Hintergrundmusik, kein Sound.
- **Keine Vollbild-Hero-Fotos**, keine hochskalierten Bilder > 1,5 × (Ziel ≤ 1,15 ×), keine KI-erzeugten oder Stock-Fotos.
- Kein 3D/WebGL (kein Mehrwert, Performance-Risiko).
- Kein Custom-Cursor, keine Partikel, kein Text-Scramble.
- Keine Lila-Blau-Verläufe, keine Emoji-Icons, keine Drei-Karten-Reihe mit Icons, kein zentrierter Standard-Hero mit Verlauf.
- Keine Infinite-Scroll-Galerie (39 Fotos passen auf eine Seite; Lazy Loading reicht).
- Keine Komponenten-Übernahme aus 21st.dev, keine neuen Animations-Pakete (`motion`, `framer-motion`).
- Keine erfundenen Inhalte (Preise, Bewertungen, Testimonials, Auszeichnungen, Slogans).

---

## 9. Bildsprache und Asset-Bedarf

- **Bestand**: 61 Fotos (300–800 px, aus Screenshots), alle Motive nutzbar. Behandlung: als Abzug mit Papierrand, Drehung, Klebeband; Panorama `angus-herde-weide.jpg` als einziges breites Bild.
- **Keine Bildbearbeitung im Browser** (kein Duotone auf Fotos – die Fotos sind bunt und sommerlich, das ist die Stärke). Duotone/Grain nur auf Ornament-Flächen.
- **Fehlt / vom Betreiber benötigt** (würde das Konzept deutlich stärken, ist aber nicht Voraussetzung):
  - `[[PLATZHALTER: Originalfotos in höherer Auflösung (≥ 1600 px) – besonders Blockhaus außen, Gastraum mit Kachelofen, Terrasse]]`
  - `[[PLATZHALTER: Foto Kachelofen]]` (wird im Text genannt, kein Foto vorhanden)
  - `[[PLATZHALTER: Foto Familie Schellhaas / Gastgeber]]` (persönlicher Einstieg, inspiriert R3)
  - `[[PLATZHALTER: Fotos Bad/Balkon große Ferienwohnung]]`
  - `[[PLATZHALTER: Logo/Wortmarke, falls vorhanden – sonst bleibt „BB“-Monogramm]]`
- Bildrechte: `DRITTQUELLE-`-markierte Fotos (Analyse) nicht in Collagen verwenden.

---

## 10. Umsetzungshinweise für den Entwickler

- Fonts: `npm i @fontsource-variable/fraunces @fontsource/barlow-condensed @fontsource-variable/dm-sans`; Importe in `main.tsx` nur `latin`. Größe prüfen (Ziel < 120 kB WOFF2 gesamt).
- Neue Tokens in `src/styles/index.css` `@theme`; hart codierte `#625f56` durch `ink-soft` ersetzen.
- `Reveal.tsx` durch `useMotion`-Hook ersetzen; GSAP-Plugins einmalig registrieren (`gsap.registerPlugin(ScrollTrigger, SplitText, Flip, useGSAP)`).
- SplitText: nach `document.fonts.ready` splitten (sonst falsche Zeilen), bei Resize `autoSplit: true` + `onSplit` verwenden; Original-Text bleibt für Screenreader erhalten (SplitText setzt `aria-label`/`aria-hidden` – prüfen).
- Galerie-Masonry: Span aus `photo.width/height` berechnen (kein Messen nötig), Caption-Höhe als Konstante pro Breakpoint.
- E2E anpassen: Upscale-Test bleibt gültig (Ziel ≤ 1,15); neue Overflow-Prüfungen für Collage-Sektionen bei 320 px; Reduced-Motion-Test (`page.emulateMedia({ reducedMotion: 'reduce' })` → alle `main img` und Headlines sofort sichtbar, `opacity` 1).
- Reihenfolge der Umsetzung (Vorschlag): (1) Tokens + Fonts + SignLabel/Button, (2) Startseite, (3) Galerie + Lightbox, (4) Gaststätte inkl. MenuBoard, (5) Eichwieserhof, (6) Ferienwohnungen, (7) Kontakt; Motion je Seite direkt mitliefern.

---

## 11. Offene Inhaltsfragen (an Betreiber/Benutzer)

1. Freigabe der nicht belegten Headlines/Slogans (siehe Hinweis in Kap. 5) – oder Ersatz durch Originalformulierungen.
2. Darf die Kurzfassung der Feier-Texte auf der Startseite (Zusammenführung aus `gastronomyText.events`) so stehen, oder nur Originalsätze?
3. Neue Galerie-Kategorien (Blockhaus & Landschaft / Küche & Feiern / Ferienwohnungen / Hof & Tiere) in Ordnung?
4. Mikrotexte [NEU]: „Zur Speisekarte“, „Anfrage für diese Wohnung“, Stempel „bis 60 – Plätze für Ihre Feier“, „Alle 39 Fotos“, „Vergrößern +“.
5. Gibt es höher aufgelöste Originalfotos (siehe Kap. 9)? Dann könnten einzelne Bilder größer gesetzt werden.
6. Bleiben Preise/Allergene der Speisekarte Platzhalter (Issue #6)?
7. Soll eine Karte (Anfahrt) eingebunden werden – mit welcher Datenschutzlösung?
