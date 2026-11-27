# Content-Inventar – alte Website bernds-blockhaus.de

Stand: 2026-11-27 · Quelle: 19 ganzseitige Screenshots (`.architect/sources/alte-website/`), gelesen über Kacheln (`.architect/sources/tiles/<seite>/NN.png`, 1654×1000 px, 80 px Überlappung; Kachel *n* beginnt bei y = (n−1)·920).
Vom Auftraggeber bestätigt: Die Inhalte sind weiterhin aktuell und sollen übernommen werden. Das gilt für die Texte; einzelne zeitgebundene Angaben (Betriebsurlaub, „Stand: März 2021“) sind unten markiert.

**Konventionen:** Texte stehen **wörtlich** in Anführungszeichen oder Blockzitaten (Schreibweise, Tippfehler und Zeichensetzung des Originals bleiben erhalten; `´` ist der Akzent im Original). `[?]` = unsichere Lesung (Kachel angegeben). `[unlesbar]` = nicht lesbar. `[Anm.: …]` = Anmerkung des Analysten, kein Originaltext. Bestätigt = im Screenshot gesehen (Fundstelle = Seite + Kachel).

---

## 0. Seitenübergreifend

### 0.1 Hauptnavigation (weiße Leiste oben, außer Startseite, Impressum, Deckhengste, Stuten, Wallache, Verkaufspferde-Unterseiten)
- Bestätigt (Gaststätte/Rad-Reit/Reservierung/Speisekarte/Ferienwohnungen/Große+Kleine FeWo/Kontakt/Anguszucht, Rindfleisch, Verkaufspferde-Übersicht, Bildergalerie): „Startseite“ · „Gaststätte“ · „Ferienwohnung“ · „Galerie“ · „Eichwieserhof“.
- Abweichung auf der Seite „Isländer vom Eichwieserhof“ (Kachel 01): „Startseite“ · „Gaststätte“ · „Ferienwohnung“ · „Eichwieserhof“ · „Anguszucht“ (kein „Galerie“).
- Linkziele (URLs) sind aus Screenshots **nicht** erkennbar; Dateinamen stammen aus den Screenshot-Dateinamen (z. B. `BerndsBlockhaus.html`, `Gaststatte.html`, `Ferienwohnungen.html`, `Gro-eFerienwohnung.html`, `KleineFerienwohnung.html`, `Speisekarte.html`, `BildergalerieBlockhaus.html`, `Islanderzucht.html`, `Verkaufspferde.html`, `Stuten2007.html`, `Stuten2010.html`, `Wallache2010.html`, `Hengste.html`, `Anguszucht.html`, `Rindfleisch.html`, `Kontaktadresse.html`, `Impressum.html`) – Fundstelle: Dateinamen der Screenshots.

### 0.2 Fußzeile (grün)
- Meist: „Kontakt“ · „Hauptmenü“ · „Impressum“ (Links, weiß unterstrichen).
- Startseite: „Links“ · „Kontakt“ · „Impressum“ (Startseite, Kachel 03). Ziel von „Links“ unbekannt (Screenshot einer Linkseite fehlt).
- Kontaktseite: „Impressum“ · „Hauptmenü“ (kein „Kontakt“-Link, Kachel 02).
- Pferdeseiten (Stuten/Wallache/Verkaufspferde) zusätzlich Fußzeilen-Block (Logo links, Text):
  > Isländer vom Eichwieserhof
  > * Anfragen gerne per E-mail: anna@eichwieserhof.de oder unter 0176-85072834

### 0.3 Sonstige Elemente
- Sprachlink „Englisch“ mit US-Flagge (Startseite, Reservierung, Speisekarte, Ferienwohnungen, Kontakt, Impressum [Flagge ohne Text], Gaststätte/BerndsBlockhaus [nicht sichtbar]). Eine englische Version ist **nicht** im Screenshot-Satz enthalten → offene Frage.
- Unterseiten haben „Zurück“-Links (weiß, in der grünen Kopfzeile); Bildergalerie zusätzlich „back“.
- Kopfzeile fast aller Unterseiten: kleines Foto des Blockhauses (Duplikat).
- Kein Cookie-Banner, keine Karte (Maps), kein Kontaktformular in den Screenshots sichtbar (Bestätigt: nicht sichtbar; Vorhandensein im Code unbekannt).
- Keine Datenschutzerklärung sichtbar/verlinkt (Fußzeilen enthalten nur Kontakt/Hauptmenü/Impressum/Links).

### 0.4 Design (aus Pixeln, Hex per Stichprobe)
- Hintergrund/Kopfzeile: `#346e34` (Grün); Text/Links in Weiß bzw. `#265926` (Dunkelgrün) auf Weiß; Fußzeile Speisekarte: `#265926`; Hinweistext rot `#ff0000` (Betriebsurlaub); Sterne `#00ff00`.
- Schrift: serifenlose Systemschriften (Arial/Helvetica-ähnlich, in Textblöcken Verdana-/Tahoma-ähnlich) – **Vermutung**.
- Layout: zentrierte weiße Spalte (ca. 1125–1250 px breit bei 1654 px Fensterbreite), tabellenartig; kein erkennbares Responsive-Verhalten (nur ein Breakpoint-Screenshot vorhanden).

---

## 1. Startseite (`…2026-startseite.png`, 1654×2312)

Fundstelle: Kacheln 01–03.

- Überschrift (Kopfzeile, weiß auf Grün): „Herzlich Willkommen“
- Unterzeile: „bei Familie Schellhaas“ (Kachel 01)
- Wappen rechts oben: Familienwappen mit Beschriftung im Bild „Wappen der Familie“ [?] (Kachel 01, Schrift klein) und „Schellhaas“ (unten im Wappen). Datei: `extracted/logo-wappen-schellhaas.png`.
- Sprachlink: „Englisch“ (US-Flagge)
- Zwei Spalten, Überschriften (unterstrichen, Links): „Bernd´s Blockhaus“ | „Eichwieserhof“
- Linke Spalte (Reihenfolge von oben nach unten; Text/Foto-Zuordnung ist Vermutung): „Gaststätte“ → Foto Blockhaus → „Rad- Reit- & Wanderhütte“ → Foto Festtafel → „Reservierung“ → Foto Schlafzimmer → „Ferienwohnungen“
- Rechte Spalte: „Isländer vom Eichwieserhof“ → Foto Islandpferde → „Islandpferdezucht“ → Foto Gebäude Eichwieserhof → „Rindfleisch bestellen“ → Foto Angus-Rinder → „Anguszucht“
- Fußzeile: „Links“ · „Kontakt“ · „Impressum“
- Keine weiteren Fließtexte.

## 2. Gaststätte (Datei `BerndsBlockhaus.html`; Screenshots „gaststaette“ und „rad-reit-wanderhuette“ sind inhaltsgleich, 1654×1725)

Fundstelle: Kacheln 01–02 (beide Screenshots identisch gelesen).

- Navigation: siehe 0.1
- Kopfzeile: „Bernd´s Blockhaus“
- Unternavigation: „Gaststätte“ · „Ferienwohnung“ · „Speisekarte“ · „Zurück“
- Fließtext (4 Absätze, wörtlich):

  > Idyllisch gelegen zwischen Wiesen und Wald, umgeben von Islandpferden und Angusmutterkuhherden, bietet unser Blockhaus eine Entspannung, die Sie am Wochenende suchen.
  >
  > Auf der sonnigen Terrasse oder am gemütlichen Kachelofen genießen Sie die solide Pfälzer Küche und selbstgebackene Kuchen.
  >
  > Für Gäste die über einen längeren Zeitraum ausspannen wollen stellen wir eine gemütliche Ferienwohnung zur Verfügung, die zu günstigen Preisen gemietet werden kann.
  >
  > Für Feste und Feierlichkeiten bis 60 Personen bieten unsere Räume im Blockhaus ein besonderes Ambiente.

- Fotos: Wegweiserschild vor Rapsfeld (`blockhaus-wegweiser-oeffnungszeiten.png`), Fernansicht Blockhaus (`blockhaus-fernansicht-wiese-baeume.png`).
- Auf dem Schild im Foto (Kachel 02, sehr klein, Lesung unsicher): „Bernd´s Blockhaus Rad-, Reit- u. Wanderhütte“ · „70 Min. Fußweg“ [?] · „geöffnet: Freitag ab 15 Uhr, Samstag ab 11 Uhr, Sonn[-/Feiertag] ab 10 Uhr“ [?]. Deckt sich mit der Öffnungszeiten-Angabe unter 3.
- Fußzeile: „Kontakt“ · „Hauptmenü“ · „Impressum“

## 3. Reservierung / Gaststätte (Datei `Gaststatte.html`, 1654×1637)

Fundstelle: Kachel 01–02. Dies ist die eigentliche Gaststätten-Detailseite mit Öffnungszeiten und Telefon.

- Kopfzeile: „Gaststätte Bernd´s Blockhaus“; Unternavigation: „Speisekarte“ · „Bildergalerie“ · „Zurück“; Sprachlink „Englisch“
- Zwischenüberschrift (unterstrichen): „Rad-; Reit- und Wanderhütte“ [Anm.: Semikolon so im Original]
- „Öffnungszeiten:“
  > Freitag ab 15:00 Uhr
  > Samstag ab 11:00 Uhr
  > Sonn- und Feiertags ab 10:00 Uhr
- Telefon: „06374 - 992911“
- **Roter Hinweis** (Kachel 01):
  > Betriebsurlaub vom 14.09.2026 - 01.10.2026
  > Ab 02.10.2026 sind wir wie gewohnt für Sie da.

  [Anm.: Zeitraum ist zum Erstellungsdatum (2026-11-27) abgelaufen → nicht übernehmen oder aktualisieren lassen; Auftraggeber bestätigte Aktualität allgemein – hier gezielt nachfragen.]
- Fließtext neben Foto Festtafel (Kachel 02; „15“ steht als Artefakt links oben im Foto):

  > Für Familien-, Vereins-, Weihnachtsfeiern oder sonstige Veranstaltungen bietet das Blockhaus bis zu 60 Sitzplätzen im Innenraum.
  > Bei schönem Wetter finden weitere ~ 150 Personen einen Sitzplatz im Außenbereich unter freiem Himmel oder unter der Terrasse.
  > Reservierungen von Terminen sind auch außerhalb der Öffnungszeiten nach Absprache möglich.

- Fotos: `blockhaus-teich-schilf-hochformat.png` (Kopf rechts), `blockhaus-festtafel-innenraum.png`.
- Fußzeile: „Kontakt“ · „Hauptmenü“ · „Impressum“
- Offen: Ruhetage (Montag–Donnerstag nicht genannt; vermutlich geschlossen – **Vermutung**, nicht belegt). Reservierung nur per Telefon (kein Formular sichtbar).

## 4. Speisekarte (`Speisekarte.html`, 1654×3813)

Fundstelle: Kacheln 01–05. **Keine Preise, keine Allergene/Zusatzstoffe, keine Getränke- oder Kuchenkarte, kein Stand-Datum** in den Screenshots. Alle Aufzählungspunkte wörtlich:

- Kopf: „Speisekarte“, „Zurück“, Sprachlink „Englisch“

**Kalte Gerichte**
- Schmalzbrot
- Hausmacherbrot (Leber-, Blut-, Bratwurst oder Schwartenmagen)
- Rohes Schinkenbrot mit Butter & Gurke
- Wildschweinschinkenbrot mit Butter & Gurke
- Käsebrot mit Butter & Zwiebeln

**Platten**
- Hausmacher Platte mit Gurke & Brot
- Kleine Hausmacher Platte mit Gurke & Brot
- Rohe Schinkenplatte mit Butter, Gurke & Brot
- Käse-& rohe Schinkenplatte mit Butter, Gurke & Brot
- Käseplatte  (verschiedene Käsesorten) mit Butter, Zwiebeln & Brot

**Salatvariationen**
- Kleiner Beilagesalat
- Großer Salatteller
- Kleiner oder Großer Salatteller mit Putenstreifen
- Kleiner oder Großer Salatteller mit Kartoffeltaschen

**Burger**
- Hamburger
- Cheeseburger (mit Käse)
- Hüttenburger (mit Käse & Schinken)

**Käse**
- 1 gebackener Camenbert mit Toast & Butter
- Handkäse mit Musik, Butter & Brot

**Pfälzer Gerichte**
- 1 Scheibe Saumagen mit Kraut & Brot
- 1 oder 2 Leberknödel mit Kraut & Brot
- 1 Leberknödel, 1 Bratwurst mit Kraut & Brot
- 1 Bratwurst oder 2 Bratwürste mit Kraut & Brot
- 1 Bratwurst oder 2 Bratwürste mit Pommes
- Portion Pommes incl. 1 Portion Ketchup oder Majo
- Extra Ketchup oder Majo

**Schnitzel & Steaks**
- Kleines oder großes Schnitzel paniert mit Pommes & Salat
- Kleines oder großes Rahmschnitzel mit Pommes & Salat
- Kleines oder großes Jägerschnitzel mit Pommes & Salat
- Kleines oder großes Hüttenschnitzel mit Pommes & Salat
- Eingelegtes Schweinekammsteak mit Pommes
- Schweinerückensteak mit Pommes & Salat
- Hinweis: „*auf Wunsch sind alle Gerichte auch mit Bratkartoffeln oder Kroketten erhältlich“

**Wildgerichte**
- 1 Wildschweinbratwurst mit Kraut oder Pommes
- 2 Wildscheinbratwürste mit Kraut oder Pommes [Anm.: „Wildschein“ so im Original (Tippfehler)]

**Tageskarte** „(Gerichte wechseln wöchentlich! Jede Woche wird mind. ein Rindgericht und ein Wildgericht angeboten.)“
- Rinderbraten mit Spätzle & Salat
- Rindfleisch mit Kartoffeln & Meerrettich
- Rindergulasch mit Nudeln & Salat
- Rinderroulade mit Kartoffeln & Rotkraut
- Rumpsteak mit Zwiebeln & Kroketten
- Paprikaschnitzel mit Pommes & Salat
- Wurstsalat mit Brot oder Pommes oder Bratkartoffel
- Wildschweinbraten mit Knödel & Rotkraut
- Wildschweingulasch mit Knödel & Rotkraut
- 2 Wildschweinleberknödel mit Kraut & Brot
- Rehbraten mit Knödel & Rotkraut
- Rehgulasch mit Knödel & Rotkraut

- Fotos: 15 Gericht-Fotos eingestreut (Duplikate in Bildergalerie, siehe `extracted/manifest.md`).
- Fußzeile (dunkelgrün `#265926`): „Kontakt“ · „Hauptmenü“ · „Impressum“
- Offene Fragen: Preise, Allergene/Zusatzstoffe (rechtlich erforderlich für Gastronomie), Getränke, Kuchen („selbstgebackene Kuchen“ erwähnt, keine Karte), Kinder-/vegetarische Gerichte (keine genannt), Stand der Karte.

## 5. Ferienwohnungen – Übersicht (`Ferienwohnungen.html`, 1654×1562)

Fundstelle: Kachel 01–02.

- Kopf: „Ferienwohnungen“, „Zurück“, Sprachlink „Englisch“
- Auswahl: „Kleine Ferienwohnung“ „oder“ „Große Ferienwohnung“ (Links)
- Fließtext (wörtlich; „Weiler-/bach“ ist Zeilenumbruch im Original):

  > In unserem allein stehenden Blockhaus stehen ihnen zwei rustikale Ferienwohnungen zur Verfügung. In sehr ruhiger Lage (Ortsrand), mit herrlichem Weitblick, Wochenendgastronomie, Wanderreiterstation und Radweganbindung.
  >
  > Auf Anfrage können Sie auch gerne mit Ihren Pferden bei uns Urlaub machen.
  > Dafür stehen Ihnen Koppeln oder Boxen rund ums Haus zur Verfügung.
  >
  > Unternehmungslustige und Gäste mit sportlichen Ambitionen finden in Weilerbach ein vielfältiges Angebot:
  > Kegeln, Tennis, Squash, Fitness-Center, Waldschwimmbad mit Minigolfanlage.
  >
  > Aber besonders die Naturliebhaber kommen hier auf ihre Kosten:
  > Die Landschaft des Pfälzer Berglandes bietet Natur pur - ein Paradies für Wanderer und Radfahrer.

- Fotos: `blockhaus-fernansicht-…` (Wiese), `blockhaus-islaender-am-zaun.png`, `mohnblumen-wiese-himmel.png`.
- Fußzeile: „Kontakt“ · „Hauptmenü“ · „Impressum“

## 6. Große Ferienwohnung (Süd) (`GroßeFerienwohnung.html`, 1654×1687)

Fundstelle: Kachel 01–02.

- Kopf: „Große Ferienwohnung (Süd)“ + 3 grüne Sterne (Klassifizierung; Sterne-Quelle/DTV-Zertifikat **nicht belegt**), „Zurück“
- „60 qm - bis zu 5 Betten“
- Ausstattung (Aufzählung):
  - Schlafzimmer mit Doppel - & Beistellbett
  - Etagenbett in Flurnische
  - Komplett ausgestattete Küche mit Wohn- & Essbereich
  - Dusche/ WC /Fön
  - Balkon
  - Bettwäsche, Hand- & Geschirrtücher werden gestellt
  - Sat-TV, DVD-Player, Radio
  - Nichtraucherwohnung
- „Preise pro Nacht:“
  > 1-2 Personen 85,- € / pro Nacht
  > Jede weitere Person 15,- € / pro Nacht
  > ab Buchung von 3 Tagen

  [Anm.: Bedeutung von „ab Buchung von 3 Tagen“ (Mindestaufenthalt oder Preisgültigkeit) ist im Original nicht erklärt → offene Frage.]
- Fotos: 6 (`fewo-gross-sued-*`).
- Offen: Endreinigung, Kurtaxe, Haustiere, Anreise-/Abreisezeiten, Buchungsweg (nur über Kontakt), Zahlungsarten.

## 7. Kleine Ferienwohnung (Nord) (`KleineFerienwohnung.html`, 1654×1562)

Fundstelle: Kachel 01–02.

- Kopf: „Kleine Ferienwohnung (Nord)“ + 3 grüne Sterne, „Zurück“
- „30 qm - bis zu 2 Betten“
- Ausstattung:
  - Wohnraum mit zwei Einzelbetten
  - Seperate komplett ausgestattete Küche [Anm.: „Seperate“ so im Original]
  - Badewanne / WC / Fön
  - Bettwäsche, Hand- & Geschirrtücher werden gestellt
  - Sat-TV, DVD-Player, Radio
  - Balkon
  - Nichtraucherwohnung
- „Preise pro Nacht:“
  > 1-2 Personen 70,-€ / pro Nacht
  > ab Buchung von 3 Tagen
- Fotos: 5 (`fewo-klein-nord-*`).

## 8. Eichwieserhof

### 8.1 „Isländer vom Eichwieserhof“ (`Islanderzucht.html`, 1654×2312)
Fundstelle: Kachel 01–03.
- Kopf: „Isländer vom Eichwieserhof“ (unterstrichen), Link „Verkaufspferde“, „Zurück“, Pferde-Logo (weiß)
- Zeitungsausschnitt (Foto, 800×514): Titel „Deutschlands erfolgreichstes Distanzpferd“, „Von Anne Emmerich“, seitlich „Rheinland-Pfalz/Saar“; darunter Bildunterschrift (schwarz): „Quelle: „DAS ISLAND Pferd“ - Ausgabe 2/2014 - Seite 87“. Artikeltext im Kleindruck ist fremdes Urheberrecht und wird hier nicht wiedergegeben; sinngemäß [?, Kleintext Kachel 01]: Es geht um ein Islandpferd des Eichwieserhofs, das als erfolgreichstes Distanzpferd Deutschlands (VDD-Statistik) beschrieben wird; Name des Pferdes im Artikel [?] „Karl vom Eichwieserhof“. **Nicht übernehmen ohne Genehmigung.**
- Fotos: Brautpaar mit Pferd, zwei Isländer auf Löwenzahnwiese, Pferdeauge, Pferd mit Sonnenblumen (je Datei in `extracted/`).
- Kein weiterer Fließtext, keine Preise.

### 8.2 Verkaufspferde – Übersicht (`Verkaufspferde.html`, 1654×1250)
Fundstelle: Kachel 01–02.
- Kopf: „Verkaufspferde“ / „vom Eichwieserhof“, „Zurück“, Pferde-Logo
- Gliederung (Links = unterstrichen, ohne Unterstrich = nicht verlinkt):
  - „Jahrgang 2010“: „Stuten 2010“ (Link), „Wallache 2010“ (Link)
  - „Jahrgang 2006“: „Stuten 2006“ (kein Link)
  - „Jahrgang 2007“: „Stuten 2007“ (Link)
  - „Jahrgang 2005“: „Wallach 2005“ (kein Link)
- Fußzeile: Isländer-Block mit E-Mail/Telefon (siehe 0.2).
- [Anm.: Nicht verlinkte Jahrgänge 2005/2006 sind vermutlich verkauft/abgeschlossen – **Vermutung**.]

### 8.3 Stuten 2007 (`Stuten2007.html`, 1687×4750) – Fundstelle Kachel 01–06
- Kopf: „Verkaufspferde - Stuten *2007“; Hinweis „* Bitte beachten Sie, dass all unsere Verkaufspferde nicht eingeritten sind!“ („nicht“ unterstrichen); „Zurück“; „Stand: März 2021“
- Stuten (alle „v. Eichwieserhof“; „V:“ = Vater, jeweils verlinkt auf die Deckhengst-Seite; „M:“ = Mutter):

| Name | Geburtsjahr | Mutter | Vater |
|---|---|---|---|
| Feila v. Eichwieserhof | geb. 2007 | Fenja v. Eichwieserhof | Kan fra Haga |
| Genta v. Eichwieserhof | geb. 2007 | Adda v. Eichwieserhof | Kan fra Haga |
| Bibi v. Eichwieserhof | geb. 2007 | Blesa v. Eichwieserhof | Kan fra Haga |
| Menja v. Eichwieserhof | geb. 2007 | Möri v. Eichwieserhof | Kan fra Haga |
| Bara v. Eichwieserhof | geb. 2007 | Gola v. Eichwieserhof | Kan fra Haga |
| Baga v. Eichwieserhof | geb. 2007 | Brana v. Eichwieserhof | Kan fra Haga |
| Asa v. Eichwieserhof | geb. 2007 | Katla v. Eichwieserhof (Original: „M:Katla v. Eichwieserhof“) | Kan fra Haga |

- Fotos: 44 (je 3–8 pro Stute), siehe Manifest.
- Keine Preise, kein Verkaufsstatus, keine Farbe/Stockmaß/Eignung genannt.

### 8.4 Stuten 2010 (`Stuten2010.html`, 1654×2500) – Fundstelle Kachel 01–03
- Kopf: „Verkaufspferde - Stuten 2010“; gleicher Hinweis „nicht eingeritten“; „Stand: März 2021“

| Name | Geburt | Mutter | Vater |
|---|---|---|---|
| Elfa v. Eichwieserhof | „*geb. 2010“ | Elva v. Eichwieserhof | Flekkur v.d. Sickingerhöhe |
| Bjalla v. Eichwieserhof | „*geb. 2010“ | Bära v. Eichwieserhof | Flekkur v.d. Sickingerhöhe |
| Glora v. Eichwieserhof | „*geb. 2010“ | Gola v. Eichwieserhof | Kan fra Haga |

- Fotos: 17.

### 8.5 Wallache 2010 (`Wallache2010.html`, 1654×2250) – Fundstelle Kachel 01–03
- Kopf: „Verkaufspferde - Wallache 2010“; Hinweis „nicht eingeritten“; „Stand: März 2021“

| Name | Geburt | Mutter | Vater |
|---|---|---|---|
| Agi v. Eichwieserhof | „*geb. 25.05.2010“ | Abba v. Eichwieserhof | Flekkur v.d. Sickingerhöhe |
| Draumur v. Eichwieserhof | „*geb. 02.06.2010“ | Düna v. Eichwieserhof | „Flekkur v.D. Sickingerhöhe“ |

- Fotos: 14.

### 8.6 Deckhengste (`Hengste.html`, 1654×1625) – Fundstelle Kachel 01–02
- Kopf: „Deckhengste (Väter unserer Isländer)“, „Zurück“
- Hengste (Fremdgestüte, Fotos mit Quellenangabe im Bild):

| Name | Geboren | Weitere Angaben | Gestüt/Quelle im Bild |
|---|---|---|---|
| Kann fra Haga (in Stuten-Seiten: „Kan fra Haga“) | „* 1996“ | „Stockmaß: 142 cm“ | „Familie Scheffler / Gestüt Sommerberg / www.gestuet-sommerberg.de“; Foto-Quelle: „www.gestuet-sommerberg.de“ |
| Galsi vom Sommerberg | „*2001“ | – | Foto-Quelle: „www.stormhestar.de“ |
| Flekkur v.d. Sickingerhöhe | „*1996“ | – | „Herr Werner Leib / Gestüt Sickingerhöhe / www.isisvonsickingen.de“; Foto-Quelle: „isisvonsickingen.de“ |

- [Anm.: Galsi vom Sommerberg erscheint als Vater keines der aufgeführten Pferde – Bedeutung offen. Alle Fotos außer dem Portrait von Kann fra Haga tragen fremde Quellenangaben → Rechte klären.]

### 8.7 Anguszucht (`Anguszucht.html`, 1654×2312) – Fundstelle Kachel 01–03
- Navigation: siehe 0.1; Kopf: „Anguszucht“, Link „Fleischverkauf“, „Zurück“, Emblem Eichenlaub/Eichel (Holzrelief)
- Fließtext (wörtlich, 6 Absätze):

  > Entstanden ist die Rinderrasse in den 1950-er Jahren durch eine Kombinationskreuzung aus Deutsche Holstein oder Fleckvieh mit dem schottischen Aberdeen Angus. So entstand das Deutsch Angus als Fleischrasse. Merkmale dieser gezüchteten Rasse sind  Robustheit, Leichtkalbigkeit und Hornlosigkeit.
  >
  > Deutsch Angus Rinde sind meist einfarbig schwarz, braun oder rot.
  > Die Tiere sind auch die idealen Landschaftspfleger und werden daher auch oft auf offene Brachflächen oder verwilderte Weideflächen gestellt, sodass diese als optimaler Lebensraum für verschiedenste Tier- und Pflanzenarten erhalten bleibt.
  >
  > Deutsch Angus Rinder besitzen festen Klauen die ihnen eine ganzjährige Weidehaltung im Freien auch bei Wind und Wetter ermöglichen.
  > Selbst schlechte bzw. sehr extreme Weidestandorte machen der Robustrasse wenig aus zumindest leidet ihre Gesundheit und die Fleischqualität nicht darunter.
  >
  > Die hornlose Rinderrasse Deutsch Angus ist weniger krankheitsanfällig als andere Fleischrassen und deutlich robuster, was Tierarztbehandlungen und Medikamenteneinsatz nahezu überflüssig machen.
  >
  > Dank ihres gutmütigen und ruhigen Wesens ist der Umgang mit ihnen relativ leicht und erfordert wenig Arbeitsaufwand für den Halter.

- Link: „Hier geht´s zum Fleischverkauf“ (mit grünem Pfeil)
- Fotos: Emblem, Herde grün, Weide mit Blockhaus.
- [Anm.: Der Text ist ein allgemeiner Rassetext; Herkunft (Eigentext oder übernommen) unbekannt → Urheberschaft klären.]
- Offen: Herdengröße, Haltung (ganzjährig Weide laut Text), Zertifizierung/Bio – nicht genannt.

### 8.8 Rindfleisch bestellen (`Rindfleisch.html`, 1654×1250) – Fundstelle Kachel 01–02
- Kopf: „Rindfleisch aus eigener Anguszucht“, Foto Hof, „Zurück“
- Wörtlich:
  > Rindfleisch nur auf Vorbestellung!
  > Bestellung unter 06374/992911
  >
  > Rindfleisch ab 1/8 Preis auf Anfrage
  > (etwa 20 bis 25 kg Fleisch ohne Knochen)
  >
  > Rindfleisch 10 kg Preis auf Anfrage
  > (Braten-, Suppen-, und Hackfleisch zerlegt)
- Foto: Pusteblume. **Keine** Preise, keine Lieferung/Abholung, keine Termine.

## 9. Bildergalerie (`BildergalerieBlockhaus.html`, 1654×5000) – Fundstelle Kachel 01–06
- Kopf: „Bernd´s Blockhaus“, Links „back“ und „Zurück“, Foto-Thumbnail.
- 31 Fotos in Dreierreihen, **keine Bildunterschriften, keine Alt-Texte erkennbar**: Blockhaus (Sommer/Winter/Abend, ca. 14 Bilder), Festtafel, Landschaft, Schild, ca. 14 Gericht-Fotos.
- Screenshot ist auf 5000 px Höhe begrenzt; die Fußzeile ist sichtbar (Kachel 06) → vermutlich vollständig.

## 10. Kontakt (`Kontaktadresse.html`, 1654×1750) – Fundstelle Kachel 01–02
- Kopf: „Kontakt“, Sprachlink (Flagge)
- **„Kontakt Bernd´s Blockhaus“**
  > Für Reservierungen und Anfragen bezüglich der Gaststätte oder Ferienwohnung
  >
  > Tanja  Schellhaas
  >
  > Eichwieserhof 10
  > 67685 Weilerbach
  >
  > Telefonnr: 06374-992911
  > E-Mail Adresse:  ts@eichwieserhof.de
- **„Kontakt Eichwieserhof“**
  > Für Anfragen bezüglich der Islandpferde
  >
  > Anna Schellhaas
  > E-Mail Adresse: anna@eichwieserhof.de
  > Telefonnr: 0176-85072834
  >
  > Für Anfragen bezüglich der Anguszucht, des Hofladens
  >
  > Bernd Schellhaas
  > E-Mail Adresse: bs@eichwieserhof.de
  > Eichwieserhof 4
  > 67685 Weilerbach
  > Telefonnr: 0151-15555502
- Fotos: Blockhaus, Pferde-Logo (grün), Hofgebäude.
- [Anm.: Es gibt zwei Adressen: Eichwieserhof 10 (Blockhaus/Gaststätte) und Eichwieserhof 4 (Bernd Schellhaas, Angus/Hofladen). Keine Straße/Anfahrtsbeschreibung, keine Karte, kein GPS, keine Entfernungsangabe. Im Screenshot ist bei „Telefonnr:“ unter Bernd Schellhaas Leerraum/Artefakt vor der Nummer (Kachel 02), Ziffern „0151-15555502“ klar lesbar, bei Wiederholung per Anruf prüfen.]
- Hinweis: „Hofladen“ wird erwähnt, aber nirgends beschrieben (Öffnungszeiten/Sortiment unbekannt).

## 11. Impressum (`Impressum.html`, 1654×1250) – Fundstelle Kachel 01–02
Vollständig, wörtlich:

> Zurück zum Eichwieserhof / Zurück zur Startseite / Zurück zu Bernd´s Blockhaus  [Links in der Kopfzeile]
>
> Impressum
>
> Tanja und Bernd Schellhaas GbR
>
> Eichwieserhof 10
> 67685 Weilerbach
>
> Telefon: 06374-992911
>
> E-Mail: bs@eichwieserhof.de
>
> Umsatzsteuer-Identifikationsnummer:
> DE 25 / 200 / 0508 / 02
>
> **Haftungsausschluss**
> Der Inhalt dieser Webseite wurde mit größter Sorgfalt, nach bestem  Wissen und Gewissen erstellt. Als Anbieter dieser Webseite übernehmen wir keine Haftung für Vollständigkeit, Richtigkeit, Aktualität oder Verlässlichkeit der bereitgestellten Inhalte. Wir stellen die Inhalte auf der Webseite zum Abruf bereit. Für die Brauchbarkeit der Inhalte Übernehmen wir keine Gewähr. Inhalte mit namentlich genannten Autoren sind die Meinung des Autors, aber nicht zwingend die Meinung des Anbieters.

Auffälligkeiten (keine Rechtsberatung, vom Betreiber/fachkundiger Stelle prüfen lassen):
- „DE 25 / 200 / 0508 / 02“ ist als „Umsatzsteuer-Identifikationsnummer“ bezeichnet, hat aber nicht das Format einer USt-IdNr. (DE + 9 Ziffern) und gleicht eher einer Steuernummer. **Nicht ungeprüft übernehmen.**
- Rechtsform „GbR“ ohne Angabe der Vertretungsberechtigten/Gesellschafter-Struktur; keine Berufsaufsicht/Kammer (Gastronomie: ggf. Angaben zur Gewerbeaufsicht/Lebensmittelüberwachung), keine Streitbeilegungshinweise (VSBG), kein „Verantwortlich für den Inhalt“.
- **Keine Datenschutzerklärung** auf der alten Seite sichtbar (nicht verlinkt); keine Urheberrechts-/Haftung-für-Links-Abschnitte.

---

## Abgleich mit der neuen Website

Geprüft: `src/data/{site,contacts,menu,apartments,gallery}.ts`, `src/pages/*.tsx`, `src/components/{layout,forms}`, `PLACEHOLDERS.md`. Struktur der neuen Seite: Start (`/`), Gaststätte (`/gaststaette`), Ferienwohnungen (`/ferienwohnungen`), Galerie (`/galerie`), Eichwieserhof (`/eichwieserhof`), Kontakt (`/kontakt`), Impressum (`/impressum`), Datenschutz (`/datenschutz`).

### A. Welcher alte Inhalt ersetzt welchen Platzhalter

| Platzhalter (Datei) | Ersatz aus alter Seite | Quelle (Abschnitt) | Hinweis |
|---|---|---|---|
| `site.heroEyebrow` „[PLATZHALTER: Willkommenstext]“ | „Herzlich Willkommen bei Familie Schellhaas“ | 1 | Wörtlich übernehmbar |
| `site.heroDescription`, HomePage `intro-copy` „[PLATZHALTER: Bestätigte Beschreibung des Betriebs]“ | „Idyllisch gelegen zwischen Wiesen und Wald, umgeben von Islandpferden und Angusmutterkuhherden, bietet unser Blockhaus eine Entspannung, die Sie am Wochenende suchen.“ | 2 | Wörtlich; „Wochenende“ passt zu den Öffnungszeiten Fr–So |
| HomePage Karte Gaststätte „[PLATZHALTER: Kurzbeschreibung der Gaststätte.]“ | „Auf der sonnigen Terrasse oder am gemütlichen Kachelofen genießen Sie die solide Pfälzer Küche und selbstgebackene Kuchen.“ | 2 | Wörtlich |
| HomePage Karte Ferienwohnungen „[PLATZHALTER: Kurzbeschreibung…]“ | „… zwei rustikale Ferienwohnungen … In sehr ruhiger Lage (Ortsrand), mit herrlichem Weitblick …“ | 5 | Kürzen nur mit Freigabe |
| HomePage Karte Eichwieserhof „[PLATZHALTER: Kurzbeschreibung des Hofes.]“ | Fakten: Islandpferdezucht, Anguszucht, Rindfleisch auf Vorbestellung | 8 | Kurztext muss neu formuliert werden → nur auf Faktenbasis, vom Betreiber freigeben |
| HomePage Fotos (Hero, 3 Karten) | `blockhaus-*`, `fewo-gross-sued-schlafzimmer-doppelbett`, `islaender-fohlen-loewenzahnwiese-gross`, `eichwieserhof-wohnhaus-hortensien` | Manifest | Auflösung beachten |
| `contacts.address` | „Tanja und Bernd Schellhaas GbR · Eichwieserhof 10 · 67685 Weilerbach“ (Blockhaus); „Eichwieserhof 4 · 67685 Weilerbach“ (Bernd Schellhaas, Angus/Hofladen) | 10, 11 | Zwei Adressen → Datenmodell ggf. erweitern |
| `contacts.phone` | „06374-992911“ (Blockhaus/Gaststätte/Rindfleisch-Bestellung); „0176-85072834“ (Anna Schellhaas, Islandpferde); „0151-15555502“ (Bernd Schellhaas, Anguszucht) | 3, 8.2, 8.8, 10 | Mehrere Ansprechpartner |
| `contacts.email` | `ts@eichwieserhof.de` (Gaststätte/FeWo, Tanja); `anna@eichwieserhof.de` (Islandpferde); `bs@eichwieserhof.de` (Angus/Hofladen; Impressum) | 10, 11 | Impressum nennt nur bs@ |
| `contacts.openingHours` | „Freitag ab 15:00 Uhr · Samstag ab 11:00 Uhr · Sonn- und Feiertags ab 10:00 Uhr“ | 3 | Betriebsurlaub 14.09.–01.10.2026 ist abgelaufen → nicht übernehmen; Ruhetage nicht genannt; Schlusszeiten fehlen |
| `contacts.directions` | Fotos Wegweiser (nur Bild); Text nur Adresse. „Wegbeschreibung“ fehlt im Original | 2, 10 | **Keine** Anfahrtsbeschreibung vorhanden – offen |
| `menu.ts` „Speisen“ | komplette Speisekarte (Kategorien: Kalte Gerichte, Platten, Salatvariationen, Burger, Käse, Pfälzer Gerichte, Schnitzel & Steaks, Wildgerichte, Tageskarte) | 4 | Preise `[PLATZHALTER: Preis]` bleiben **offen** (Original ohne Preise) |
| `menu.ts` „Getränke“ | – | – | Nicht in der alten Seite → Platzhalter bleibt/Kategorie streichen bis Betreiberangabe |
| GastronomyPage Einleitung „[PLATZHALTER: Bestätigte Beschreibung der Gaststätte.]“ | Gaststätten-Absätze (Terrasse/Kachelofen/Pfälzer Küche; Feste bis 60 Personen) | 2, 3 | Wörtlich |
| GastronomyPage „Informationen zum Gastraum, Angebot und Reservierungen“ | „… bis zu 60 Sitzplätzen im Innenraum … weitere ~ 150 Personen … Außenbereich … Reservierungen … nach Absprache möglich.“ | 3 | Wörtlich; Reservierung nur telefonisch |
| GastronomyPage Foto | `blockhaus-vorderansicht-startseite`, `blockhaus-festtafel-innenraum` | Manifest | |
| `apartments.ts` Name/Kapazität/Ausstattung | **Große Ferienwohnung (Süd)** – 60 qm, bis zu 5 Betten, Ausstattung (6) ; **Kleine Ferienwohnung (Nord)** – 30 qm, bis zu 2 Betten, Ausstattung (7) | 6, 7 | `capacity`: „bis zu 5 Betten“/„bis zu 2 Betten“ (nicht Personen!) |
| `apartments.ts` Preise (Feld fehlt im Datenmodell `Apartment`) | 85,- € (1–2 Pers.) + 15,- € je weitere Person; 70,-€ (1–2 Pers.); „ab Buchung von 3 Tagen“ | 6, 7 | Typ `Apartment` hat kein Preisfeld → Erweiterung nötig; „3 Tage“ klären |
| ApartmentsPage `copy` / PageIntro | Übersichtstext 5 | 5 | Wörtlich |
| ApartmentsPage Fotos | `fewo-gross-sued-*`, `fewo-klein-nord-*` | Manifest | |
| ApartmentInquiryForm „[PLATZHALTER: Hinweise zu Buchung und Kontakt ergänzen.]“ | Kontakt Tanja Schellhaas (Tel./E-Mail) | 10 | Original hat keinen Buchungsablauf |
| `gallery.ts` (6 Platzhalter-Einträge) | 31 echte Fotos der Bildergalerie + Fewo/Hof-Fotos | 9, Manifest | Kategorien: gaststaette (Blockhaus, Gerichte), ferienwohnungen, eichwieserhof (Pferde, Angus, Hof) |
| EichwieserhofPage `copy` „[PLATZHALTER: Bestätigte Informationen zu Pferden, Angus und Hofangeboten.]“ | Islandpferdezucht „Isländer vom Eichwieserhof“, Verkaufspferde (nicht eingeritten), Deckhengste; Anguszucht (Deutsch Angus), Rindfleisch aus eigener Anguszucht | 8 | Fakten vorhanden, Fließtexte nur Anguszucht-Rassetext (Urheberschaft klären) |
| EichwieserhofPage „Hofgeschichte und Angebot beschreiben“ | **Keine Hofgeschichte vorhanden** | – | Offen |
| EichwieserhofPage „Angaben zu Tieren, Haltung und Besuchsmöglichkeiten“ | Anguszucht-Text (Haltung ganzjährig Weide, Landschaftspflege); Verkaufspferde-Listen mit Abstammung | 8.3–8.7 | Besuchsmöglichkeiten nicht genannt |
| `ImprintPage` „§ 5 DDG“-Platzhalter | Impressum wörtlich (Abschnitt 11) | 11 | USt-IdNr.-Format prüfen; Rechtstexte fachkundig prüfen; „Haftungsausschluss“ nicht unbesehen übernehmen |
| `PrivacyPage` | – | – | Alte Seite hat **keine** Datenschutzerklärung → muss neu erstellt/geprüft werden (neue Seite nutzt Formular + ggf. Fonts) |
| Header „[PLATZHALTER: Region]“ | „Weilerbach“ / „Pfälzer Bergland“ (Region) | 5, 10 | „Pfälzer Bergland“ im Fließtext Abschnitt 5 belegt |
| Footer-Text „Ein Ort zum Ankommen und Genießen.“ (kein Platzhalter, eigener neuer Text) | – | – | Eigenerfundener Slogan der neuen Seite; Betreiber bestätigen lassen |
| `site.heroTitle` „Ankommen. Wohlfühlen. Genießen.“ und HomePage-Zitat | – | – | Neuer Text, nicht aus alter Seite belegt; Betreiber freigeben |
| PLACEHOLDERS.md „Nutzungsrechte und Originaldateien für Logo und Fotos“ | Logo-Kandidaten `logo-wappen-schellhaas`, `logo-islandpferd-*`, `logo-eichenlaub-emblem-holz` | Manifest | Betreiber bestätigt: Fotos gehören ihm; 4 Drittquellen-Dateien ausgenommen |

### B. Alte Inhalte ohne Platz in der neuen Struktur

| Alter Inhalt | Warum kein Platz | Vorschlag (Entscheidung beim Orchestrator/Betreiber) |
|---|---|---|
| Verkaufspferde (Jahrgänge 2005–2010, Stuten/Wallache mit Abstammung, 75 Fotos, „nicht eingeritten“, Stand März 2021) | Neue Seite hat nur eine Seite „Eichwieserhof“ (Platzhalter für Hofangebot), keine Pferdelisten | Unterbereich/Sektion „Islandpferde“ mit Verkaufsliste; Stand veraltet (2021) → Betreiber um aktuellen Bestand bitten |
| Deckhengste („Väter unserer Isländer“) inkl. fremder Fotos/Gestüt-Links | Kein Platz; Fremdfotos | Textliste ohne Fremdfotos; Links nur nach Freigabe |
| Anguszucht-Rassetext (6 Absätze) | Eichwieserhof-Seite sieht nur kurzen Platzhalter vor | Eigene Sektion/Unterseite „Anguszucht“ |
| Rindfleisch-Vorbestellung (1/8 ab etwa 20–25 kg; 10 kg; Preis auf Anfrage; Tel. 06374/992911) | Kein „Hofladen/Rindfleisch“ in der Navigation | Sektion auf Eichwieserhof-Seite mit Telefon-CTA |
| Speisekarte als eigene Unterseite (alt: eigene Seite) | Neu: Tabs auf `/gaststaette` – kompatibel; aber Kategorien Speisen/Getränke zu grob | Neun alte Kategorien statt „Speisen“ einsetzen |
| Zeitungsartikel Distanzpferd (DAS ISLAND Pferd 2/2014) | Fremdinhalt | nicht übernehmen oder Genehmigung; ggf. als Hinweistext „Auszeichnung/Distanzerfolg“ nur nach Freigabe |
| Rad-/Reit-/Wanderhütte-Positionierung („Wanderreiterstation“, „Radweganbindung“) | Kein dedizierter Bereich; Titel „Rad-, Reit- und Wanderhütte“ fehlt in neuer Seite | Als Untertitel/Eyebrow der Gaststätte; Bestätigung durch Betreiber |
| Ferienwohnungen mit Pferden („Koppeln oder Boxen“) | Kein Feld im Datenmodell | Als Hinweis auf der Ferienwohnungen-Seite |
| Freizeitangebote Weilerbach (Kegeln, Tennis, Squash, Fitness-Center, Waldschwimmbad mit Minigolf) | Kein Platz | Abschnitt „Umgebung“ auf Ferienwohnungen-Seite |
| Mehrere Ansprechpartner (Tanja/Anna/Bernd Schellhaas) mit eigenen Adressen, Telefonen, E-Mails | `contacts` kennt eine Adresse/Telefon/E-Mail | Datenmodell auf Rollen erweitern (Gaststätte/Ferienwohnung, Islandpferde, Anguszucht/Hofladen) |
| Wappen „Schellhaas“, Pferde-Logo, Eichenlaub-Emblem | Kein Logo vorgesehen (Marke = Textlogo „Bernd’s Blockhaus“) | Entscheidung zum Logo (Creative Director) |
| „Englisch“-Version | Neue Seite deutsch-only; englische Seite nicht im Screenshot-Satz | Betreiber fragen, ob Englisch gewünscht |
| Links-Seite („Links“ in Startseiten-Fußzeile) | Nicht im Screenshot-Satz | Offen |
| Sterne-Klassifizierung (3 Sterne) | Kein Feld; Nachweis fehlt | nur mit Nachweis (z. B. Zertifikat/DTV) |
| Betriebsurlaub-Hinweis (rot) | abgelaufen | Optionales „Hinweis-Banner“-Konzept für künftige Zeiträume |

### C. Neue Seite enthält Inhalte, die in der alten nicht vorkommen (Beleg fehlt – nicht ungeprüft lassen)
- Slogan „Ankommen. Wohlfühlen. Genießen.“, „Ein Platz zum Bleiben. Ein Moment zum Genießen.“, Footer-„Ein Ort zum Ankommen und Genießen.“, Seitenüberschriften („Zeit zum Durchatmen.“, „Naturverbunden. Authentisch.“ u. a.) sind **nicht aus der alten Seite**; sie sind keine Fakten, brauchen aber Freigabe des Betreibers.
- Anfrageformular für Ferienwohnungen: alte Seite hatte keines (Kontakt nur per Telefon/E-Mail).
- Datenschutz-Seite: alt nicht vorhanden.
