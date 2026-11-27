# Lessons: Bernd's Blockhaus

- [2026-11-27] Push/Merge auf `main` startet sofort das GitHub-Pages-Deployment (`deploy.yml`). Merge = Live-Gang. – Anlass: Workflow geprüft.
- [2026-11-27] Die CI prüft kein Prettier. Auf `main` sind 38 Dateien nicht formatiert; Neuformatierung nur als eigener PR, nie in Feature-PRs mischen. – Anlass: `prettier --check` nach LF-Umstellung.
- [2026-11-27] Keine Betreiberdaten (Adresse, Telefon, Preise, Speisekarte, Ferienwohnungen, Impressum) erfinden – Liste der fehlenden Angaben steht in Issue #6 und `PLACEHOLDERS.md`. – Anlass: Issue #6.
- [2026-11-27] Lokal (Windows) und CI (Linux) haben andere Schriftmetriken. Overflow-Tests bei 320px können lokal rot und in der CI grün sein – lokalen Befund ernst nehmen, nicht mit „CI grün“ abtun. – Anlass: h3 „Ferienwohnungen“ in `.pillar-card` sprengte das 1fr-Grid (behoben in 4735a55).
- [2026-11-27] `npm run test:e2e` verkettet zwei Playwright-Configs mit `&&`; ist die erste rot, läuft die invalid-endpoint-Config nicht. Bei rotem E2E die zweite separat ausführen. – Anlass: Gate-Lauf auf 8392d60.
- [2026-11-27] PR #1 (`fix/mobile-menu-and-inquiry`) wurde geschlossen, nicht gemergt. Nicht auf diesem Branch weiterarbeiten. – Anlass: `gh pr list`.
