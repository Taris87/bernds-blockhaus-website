# Schriften

Die Website verwendet drei Schriften, alle unter der SIL Open Font License 1.1:

- **Fraunces** (variabel, Achsen opsz + wght, normal und kursiv) – Überschriften, Display
- **Barlow Condensed** 600 – Wegweiser-Labels, Navigation, Buttons
- **DM Sans** (variabel, wght) – Fließtext

Sie kommen nicht aus diesem Ordner, sondern aus den npm-Paketen von Fontsource
(`@fontsource-variable/fraunces`, `@fontsource/barlow-condensed`,
`@fontsource-variable/dm-sans`). Die `@font-face`-Regeln stehen in
`src/styles/fonts.css`; Vite kopiert die WOFF2-Dateien (nur Subset latin) mit
Hash-Namen in den Build. Es gibt keine Anfrage an fremde Server.

`index.html` lädt Fraunces (normal) und DM Sans per `<link rel="preload">` vor,
weil beide im ersten Viewport (Hero) gebraucht werden. Vite ersetzt die Pfade
beim Build durch die gehashten Dateinamen.

Lizenztexte und Copyright-Angaben: [`LICENSES.md`](./LICENSES.md).
