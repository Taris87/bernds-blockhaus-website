# Lessons: Bernd's Blockhaus

- [2026-11-27] Push/Merge auf `main` startet sofort das GitHub-Pages-Deployment (`deploy.yml`). Merge = Live-Gang. – Anlass: Workflow geprüft.
- [2026-11-27] Die CI prüft kein Prettier. Auf `main` sind 38 Dateien nicht formatiert; Neuformatierung nur als eigener PR, nie in Feature-PRs mischen. – Anlass: `prettier --check` nach LF-Umstellung.
- [2026-11-27] Keine Betreiberdaten (Adresse, Telefon, Preise, Speisekarte, Ferienwohnungen, Impressum) erfinden – Liste der fehlenden Angaben steht in Issue #6 und `PLACEHOLDERS.md`. – Anlass: Issue #6.
- [2026-11-27] PR #1 (`fix/mobile-menu-and-inquiry`) wurde geschlossen, nicht gemergt. Nicht auf diesem Branch weiterarbeiten. – Anlass: `gh pr list`.
