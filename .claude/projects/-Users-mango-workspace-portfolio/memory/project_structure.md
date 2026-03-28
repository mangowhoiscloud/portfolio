---
name: project-structure
description: Portfolio rebuilt as Next.js with 3 project routes (geode/reode/eco2). GEODE at v0.30. Build passes.
type: project
---

Portfolio restructured 2026-03-27.
- Routes: `/` (hub) → `/geode` · `/reode` · `/eco2`
- GEODE is at v0.30 (not v0.28.1 as geode.html says)
- `public/geode.html` is legacy, to be deleted after migration
- Old pptx-*, backups, preview files all cleaned up
- Build: Next.js 16.1.2, static export, GitHub Pages `/portfolio`

**Why:** Full rebuild from 13,700-line single HTML to proper Next.js components.
**How to apply:** All new GEODE work goes in `src/app/geode/` and `src/components/geode/`. Content needs updating to v0.30.
