# GEODE Portfolio SOT Fix Plan

> Created: 2026-03-11
> Branch: main
> SOT: `.claude/skills/geode-portfolio/SKILL.md` + `references/slide-content.md`
> Target: `public/geode.html`

## Status Overview

| Priority | Item | Status |
|----------|------|--------|
| P0-1 | Fixture Results SOT sync (score + cause) | DONE |
| P0-2 | Decision Tree → 6 Causes SOT alignment | DONE |
| P1-1 | Hero Stats update (2000+ Tests, 118 Modules) | DONE |
| P1-2 | LLM 5-Model display | DONE |
| P2-1 | Hook Events 11→ explicit | DONE |
| P2-2 | Expert Panel SOT criteria | DONE |

---

## P0-1: Fixture Results SOT Sync

**File**: `public/geode.html` lines 3310-3339

### Current (Wrong)
| IP | Score | Tier | Cause |
|----|-------|------|-------|
| Berserk | 82.2 | S | creator_dependency |
| Cowboy Bebop | 76.2 | A | undermarketed |
| Ghost in the Shell | 58.5 | B | discovery_failure |

### Target (SOT SKILL.md)
| IP | Score | Tier | Cause |
|----|-------|------|-------|
| Berserk | 82.2 | S | conversion_failure |
| Cowboy Bebop | 69.4 | A | undermarketed |
| Ghost in the Shell | 54.0 | B | discovery_failure |

### Changes
1. Berserk cause: `creator_dependency` → `conversion_failure`
2. Cowboy Bebop score: `76.2` → `69.4`
3. Ghost in the Shell score: `58.5` → `54.0`
4. Radar chart center score: `76.2` → `69.4` (Cowboy Bebop example)

---

## P0-2: Decision Tree → 6 Causes SOT

**File**: `public/geode.html` lines 3203-3209

### Current (Wrong — 5 simplified causes, wrong thresholds)
```
if d >= 4 → undermarketed
elif e >= 4 → monetization_failure
elif f >= 4 → discovery_failure
elif d+e+f <= 6 → no_hidden_value
else → mixed
```

### Target (SOT §13.9.2 — 6 causes, threshold >=3)
```
if timing_issue & D>=3 → timing_mismatch
if D>=3 & E>=3 → conversion_failure
if D>=3 & E<3 → undermarketed
if D<=2 & E>=3 → monetization_misfit
if D<=2 & E<=2 & F>=3 → niche_gem
else → discovery_failure
```

---

## P1-1: Hero Stats Update

**File**: `public/geode.html` lines 2451-2466

| Metric | Current | Target |
|--------|---------|--------|
| Tests | 416+ | 2,000+ |
| Modules | 98 | 118 |
| Layers | 6 | 6 (no change) |
| PSM Axes | 14 | 14 (no change) |

---

## P1-2: LLM 5-Model Display

**File**: `public/geode.html` — Section 06 Tech Stack

### Current (3 models)
- Claude Opus, GPT-4o, Gemini Pro

### Target (SOT §2.3.2 — 5 models with roles)
| Model | Role |
|-------|------|
| Claude Opus 4.5 | Analyst×4, Evaluator×3, Synthesizer (×8) |
| Claude Sonnet 4 | LLM Judge, Memory Responder |
| Claude Haiku | Per-Agent Guardrail |
| GPT-5.2 | Cortex Agent (SQL) |
| Gemini 3.0 Flash | Planner (6-Route) |

---

## P2-1: Hook Events

**File**: `public/geode.html` — Section 04

### Current: 4 hooks (PIPELINE_START/END, NODE_ENTER/EXIT)
### Target: 11 hooks (SOT HookEvent enum)
SESSION_START, SESSION_END, PRE_ANALYSIS, POST_ANALYSIS,
PRE_TOOL_USE, POST_TOOL_USE, TASK_START, TASK_COMPLETE,
TASK_FAIL, ON_ERROR, ON_NOTIFICATION

---

## P2-2: Expert Panel SOT Criteria

**File**: `public/geode.html` — Section 05

### Current (Simplified)
- Tier 3: p<=0.50, 30+
- Tier 2: p<=0.75, 10+
- Tier 1: 기사 테스트 통과

### Target (SOT §13.12)
- Tier 3 Verified: Score>=0.85, rho>=0.50, >=30건 (3-5명)
- Tier 2 Provisional: Score>=0.70, rho>=0.40, >=10건 (5-10명)
- Tier 1 Candidate: Score>=0.50, 경력>=3년 (무제한)

---

## Verification Loop (Post-fix)
1. All formulas match SOT §13.8 exactly
2. Tier thresholds: S>=80, A>=60, B>=40, C<40
3. 6 causes complete (including timing_mismatch)
4. D-axis excluded from recovery_potential
5. 11 hook events (not 10) — includes ON_NOTIFICATION
6. Cross-LLM metric: Krippendorff's alpha (not Cohen's kappa)
7. Feedback phases include T+180d
8. 5 models (not 3) — Claude×3 + GPT + Gemini
9. PSM: 14 covariates, not 12 or 15
10. Clean Context: analyses field removed (not other fields)
