# Bernd’s Blockhaus – Website

Eigenständiger Neuaufbau mit React, TypeScript, Vite, Tailwind CSS 4, React Router und GSAP.

## Voraussetzungen

- Node.js `>=22.12.0`
- npm 10+
- Für E2E-Tests: installierter Playwright Chromium-Browser

## Installation und Start

```bash
npm install
npm run dev
```

Vite zeigt die lokale URL im Terminal an.

## Qualitätssicherung

```bash
npm run typecheck
npm run lint
npm run test
npm run build
npx playwright install chromium
npm run test:e2e
```

## Umgebungsvariablen

`.env.example` dokumentiert `VITE_INQUIRY_ENDPOINT`. Ohne konfigurierten Backend-Endpunkt wird eine Anfrage ausdrücklich nicht versendet. Keine geheimen Zugangsdaten in `VITE_*`-Variablen ablegen, da diese im Browser verfügbar sind.

## Inhalte und Platzhalter

Alle redaktionell zu pflegenden Daten liegen zentral in `src/data/`:

- `site.ts`: Markenname, Navigation, allgemeine Kontakt-/Hero-Platzhalter
- `menu.ts`: Speisekartenkategorien und Preise
- `gallery.ts`: Galerieeinträge und Bildbeschreibungen
- `contacts.ts`: Anschrift, Telefon, E-Mail, Öffnungszeiten
- `apartments.ts`: Ferienwohnungen, Anzahl, Ausstattung

Sichtbare `[PLATZHALTER: …]`-Texte müssen vor Veröffentlichung vollständig durch vom Betreiber bestätigte Angaben ersetzt werden. Sie sind absichtlich nicht als echte Geschäftsinformationen formuliert.

### Betreiber-Checkliste

- [ ] Original-Logo und Favicon bereitstellen
- [ ] Hero- und Bereichsfotografien samt Nutzungsrechten bereitstellen
- [ ] Anschrift und Anfahrtsbeschreibung bestätigen
- [ ] Telefonnummer und korrekte E-Mail-Adresse bestätigen
- [ ] Öffnungszeiten bestätigen
- [ ] Vollständige Speisekarte, Preise, Allergene und Zusatzstoffe liefern
- [ ] Anzahl und Namen der Ferienwohnungen bestätigen
- [ ] Ausstattung, Kapazität, Konditionen und Fotos der Ferienwohnungen liefern
- [ ] Eichwieserhof-Inhalte (Pferde, Angus, Hofangebot) bestätigen
- [ ] Anfrage-Backend, Empfänger, Datenschutz und Spam-Schutz einrichten
- [ ] Impressum vollständig und rechtlich korrekt ergänzen
- [ ] Datenschutzerklärung anhand der tatsächlich eingesetzten Dienste und Verarbeitungen erstellen
- [ ] Hosting und Domain konfigurieren
- [ ] Cookie-/Tracking-Technologien nur nach Datenschutzprüfung integrieren

## Projektstruktur

```text
src/
  app/                 Router
  components/
    forms/             Anfrageformular
    gallery/           Galerie und Lightbox
    layout/            Header, Footer, SiteLayout
    motion/            GSAP-Reveals
    ui/                wiederverwendbare UI-Bausteine
  data/                zentrale Inhalte
  hooks/               Page-Meta und Reduced Motion
  lib/                 Hilfsfunktionen
  pages/               acht Seiten
  styles/              Tailwind und globale Gestaltung
  types/               Datenmodelle
tests/e2e/             Playwright-End-to-End-Tests
```

## Deployment

### GitHub Pages (Repository-Hosting)

Das Projekt ist für `https://taris87.github.io/bernds-blockhaus-website/` konfiguriert. Vite verwendet `base: '/bernds-blockhaus-website/'`; React Router übernimmt denselben Präfix automatisch über `import.meta.env.BASE_URL`.

1. In GitHub das Repository `Taris87/bernds-blockhaus-website` öffnen.
2. Unter **Settings → Pages → Build and deployment** als Source **GitHub Actions** auswählen.
3. Änderungen auf `main` pushen oder den Workflow **Actions → Deploy to GitHub Pages → Run workflow** manuell starten.
4. Der Workflow `.github/workflows/deploy.yml` installiert mit `npm ci`, erstellt `dist/` und veröffentlicht dieses Verzeichnis über GitHub Pages.

Die Datei `public/404.html` stellt einen SPA-Fallback bereit, damit direkte Aufrufe und Neuladen von React-Router-Unterseiten auf GitHub Pages funktionieren. Nach erfolgreichem Deployment ist die Website unter `https://taris87.github.io/bernds-blockhaus-website/` erreichbar.

**Wichtig:** Unter **Settings → Pages** muss GitHub Actions als Deployment-Quelle aktiviert sein. Die Veröffentlichung kann erst erfolgen, wenn alle Betreiber-Platzhalter und insbesondere Impressum/Datenschutz geprüft und ersetzt wurden.

## Hinweise

- Bilder sind derzeit bewusst gekennzeichnete Platzhalter; es wurden keine fremden oder erfundenen Betriebsfotos eingebunden.
- Impressum und Datenschutz sind nicht veröffentlichungsfähig, bis die Platzhalter geprüft und ergänzt wurden.
- Ein erfolgreicher Formularversand ist erst nach Konfiguration und Test eines echten Endpoints möglich.
- Vor einem produktiven Release sind Installation, Build, Typprüfung, Linting, Unit- und E2E-Tests in der Zielumgebung auszuführen.
