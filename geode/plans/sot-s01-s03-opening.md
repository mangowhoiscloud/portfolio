# SOT: S01-S03 Opening Slides

> Source of Truth for PPTX slide production.
> Generated: 2026-03-27
> Codebase snapshot: commit e34b17a (2026-03-27)

---

## S01 Cover -- Verified Numbers

| Metric | Value | Source | Verification Command / Line |
|--------|-------|--------|-----------------------------|
| **Version** | 0.30.0 | `pyproject.toml` L3 | `grep version pyproject.toml` |
| **Commits** | 1,118 | git log | `git log --oneline \| wc -l` |
| **Date Range** | 2026-02-21 ~ 2026-03-27 (35 days) | git log | First: `5cabd73 2026-02-21`, Latest: `e34b17a 2026-03-27` |
| **Core Modules** | 185 .py files | `core/` directory | `find core/ -name "*.py" -not -path "*__pycache__*" \| wc -l` |
| **Tests** | 3,219+ pass | `docs/progress.md` L401 | Metrics table, updated 2026-03-26 |
| **Releases** | 38 (CHANGELOG sections) | `CHANGELOG.md` | `grep -c "^## \\[" CHANGELOG.md` |
| **HookEvents** | 40 enum members | `core/hooks/system.py` L20-61 | `grep -c "= \"" core/hooks/system.py` |
| **Tools** | 52 total (47 base + 5 task) | `core/tools/definitions.json` | `python3 -c "import json; print(len(json.load(open(...))))"` |
| **MCP Catalog** | 41 dict entries (catalog.py comment says "44", progress.md says "44", but actual `MCP_CATALOG` dict has 41 keys) | `core/mcp/catalog.py` | `grep -c "MCPCatalogEntry(" catalog.py` = 41. Discrepancy: code comment L39 says "44 entries" but dict has 41. Use **41** (code-verified). |
| **Scaffold Skills** | 21 | `.claude/skills/` | `ls .claude/skills/ \| wc -l` |
| **Runtime Skills** | 1 dir (4 analyst templates) | `.geode/skills/geode-analysts/` | 4 markdown files: analyst-discovery, -game-mechanics, -growth-potential, -player-experience |
| **CLAUDE.md** | 425 lines | `CLAUDE.md` | `wc -l CLAUDE.md` |
| **CLAUDE.md CANNOT rules** | 17 individual rules across 5 domains | `CLAUDE.md` L226-244 | Git, Planning, Quality, Docs, PR domains |
| **GEODE.md** | 71 lines | `GEODE.md` | `wc -l GEODE.md` |
| **GEODE.md CANNOT rules** | 4 rules | `GEODE.md` L28-31 | Evidence, Single-LLM, Confidence, Plugin |
| **Latest PR** | #491 | `docs/progress.md` L4 | "세션 45 -- #491 머지" |
| **PolicyChain Layers** | 6 layers | `core/tools/policy.py` L1-9 | Profile, Organization, Mode-based, Agent-level, Node-scope, Sub-agent |
| **CI Jobs** | 5 (Lint, TypeCheck, Test, Security, Gate) | `.github/workflows/ci.yml` | jobs: lint, typecheck, test, security, gate |
| **Verification Layers** | 5 | `CLAUDE.md` L153-158 | Guardrails, BiasBuster, Cross-LLM, Confidence Gate, Rights Risk |
| **BiasBuster Types** | 6 | `core/state.py` L122-127 | confirmation, recency, anchoring, position, verbosity, self_enhancement |
| **Python** | >= 3.12 | `pyproject.toml` L8 | `requires-python = ">=3.12"` |
| **Architecture** | 6 Layers (L0-L5) | `CLAUDE.md` L38-47 | CLI/Agent, Infrastructure, Memory, Orchestration, Extensibility, Domain |

### Cover Narrative (recommended)

> **GEODE v0.30.0** -- 범용 자율 실행 에이전트
> 1,118 commits, 35 days, 185 modules, 3,219 tests, 52 tools
> One-person project, but built with a production harness

---

## S02 Triple Loop -- Loop Details

### META Loop (Scaffold Evolution)

**What it is**: The long-lived evolution loop of the development harness itself (CLAUDE.md rules, skills, CI ratchets, workflow). Changes accumulate across multiple PRs.

**CLAUDE.md Rule Evolution Evidence** (source: `CLAUDE.md` 425 lines):
- L38-47: 6-Layer Architecture definition (structural constraint)
- L222-244: 17 CANNOT rules across 5 domains (Git, Planning, Quality, Docs, PR)
- L246-256: 5 CAN freedoms (inverse of constraints)
- L258-268: 7 Failure Mode scenarios with detection + remediation
- L276-381: 8-step implementation workflow (evolved from simpler version)
- L392-416: 21 Custom Skills listed with triggers (accumulated over sessions)
- Evolution evidence: CANNOT rules reference specific origin patterns:
  - "격리 실행 (OpenClaw Session)" -- L228
  - "래칫 (P4)" -- L229, L235, L244 (Karpathy Pattern 4)
  - "비용 제어 (P3)" -- L238
  - "과잉 구현 방지" -- L234

**21 Scaffold Skills** (source: `.claude/skills/`):

| # | Skill | Trigger Keywords | Purpose |
|---|-------|-----------------|---------|
| 1 | `agent-ops-debugging` | debugging, safe default, contextvar | Agent system ops debugging patterns |
| 2 | `anti-deception-checklist` | deception, fake success, regression | Prevent fake success in verification |
| 3 | `architecture-patterns` | Clean Architecture, Hexagonal, DDD | Backend architecture patterns |
| 4 | `code-review-quality` | quality, SOLID, dead code, resource leak | Python code quality 6-lens review |
| 5 | `codebase-audit` | audit, dead code, refactor, god object | Dead code detection + refactoring |
| 6 | `dependency-review` | dependency, import, circular, lazy | 6-Layer dependency health review |
| 7 | `explore-reason-act` | explore, reason, root cause, read before write | Explore-Reason-Act 3-step before code changes |
| 8 | `frontier-harness-research` | research, gap, frontier, harness | Frontier harness 4-way comparison research |
| 9 | `geode-analysis` | analyst, evaluator, clean context | Analyst/Evaluator implementation guide |
| 10 | `geode-changelog` | changelog, release, version | CHANGELOG management rules |
| 11 | `geode-e2e` | e2e, live test, langsmith, tracing | Live E2E + LangSmith observability |
| 12 | `geode-gitflow` | branch, git, pr, merge | GitFlow strategy + PR templates |
| 13 | `geode-pipeline` | pipeline, graph, topology, send api | StateGraph pipeline guide |
| 14 | `geode-scoring` | score, psm, tier, rubric, formula | Scoring formulas + 14-axis rubric |
| 15 | `geode-serve` | serve, gateway, slack, binding | Slack Gateway ops + debugging |
| 16 | `geode-verification` | guardrail, bias, cause, decision tree | Verification system guide |
| 17 | `karpathy-patterns` | autoresearch, ratchet, context budget | 10 autonomous agent design principles |
| 18 | `kent-beck-review` | kent beck, simple design, simplify | Simple Design 4-rules code review |
| 19 | `openclaw-patterns` | gateway, session, binding, lane, plugin | Agent system design patterns (OpenClaw) |
| 20 | `tech-blog-writer` | blog, tech blog | Technical blog writing guide |
| 21 | `verification-team` | verify, review, check | 4-persona verification team |

**Session Hook** (source: `.claude/hooks/check-progress.sh`):
- Triggers on session stop
- Check 1: If commits exist today but `progress.md` lacks today's date -> reminder
- Check 2: If `develop` is ahead of `main` -> merge reminder
- Returns JSON `{"continue": true, "message": "..."}` format

**CI Pipeline -- 5 Jobs** (source: `.github/workflows/ci.yml`):

| Job | Ratchets / Checks |
|-----|-------------------|
| **Lint & Format** | `ruff check`, `ruff format --check`, legacy import ratchet (`scripts/check_legacy_imports.py`) |
| **Type Check** | `mypy core/`, prompt integrity check (`verify_prompt_integrity(raise_on_drift=True)`) |
| **Test** | `pytest --cov`, ratchet: minimum test count >= 2900 |
| **Security Scan** | `bandit -r core/` |
| **Gate** | All 4 above must pass (needs: lint, typecheck, test, security) |

**META Feedback Loop**:
- Observation: CI results, PR review findings, runtime incidents
- Encoding: New CANNOT rules added to CLAUDE.md, new skills created, CI ratchets tightened
- Evidence: Test ratchet started at some lower number, now at 2900 minimum. CANNOT rules grew to 17 across 5 domains.

---

### DEV Loop (per-PR)

**What it is**: The per-PR development cycle that every code change goes through. 8 steps from board allocation to board update.

**8-Step Workflow** (source: `CLAUDE.md` L278, `docs/workflow.md`):

| Step | Name | Description |
|------|------|-------------|
| **0** | Board + Worktree | `progress.md` Backlog -> In Progress. `git worktree add` with `.owner` isolation. `git fetch` -> sync check -> branch from `develop`. |
| **1** | GAP Audit | Verify each plan item against codebase with `grep`/`Explore`. 3-way classify: Done / Partial / Missing. Prevents rebuilding existing features. |
| **2** | Plan + Socratic Gate | Socratic 5-Question gate for each implementation item. Plan doc in `docs/plans/`. User approval required. |
| **3** | Implement + Test | Code changes + quality gate trio (ruff, mypy, pytest). Iterative until all pass. |
| **4** | E2E Verify | Mock E2E + CLI dry-run (`Cowboy Bebop --dry-run` = A 68.4). 4-persona verification for large changes. |
| **5** | Docs-Sync | CHANGELOG `[Unreleased]` + version 4-place sync + metric re-measurement. |
| **6** | PR & Merge | `feature -> develop -> main` (GitFlow). HEREDOC PR body. CI 5/5 pass required. |
| **7** | Board Update | `progress.md` kanban update (main only). In Progress -> Done. |

**Socratic Gate -- Q1-Q5** (source: `CLAUDE.md` L319-326):

| # | Question (exact) | Fail Action |
|---|-----------------|-------------|
| Q1 | **코드에 이미 있는가?** (`grep`/`Explore` 실측) | -> 제거 |
| Q2 | **이걸 안 하면 무엇이 깨지는가?** (실제 장애 시나리오) | 답 없으면 -> 제거 |
| Q3 | **효과를 어떻게 측정하는가?** (테스트, 메트릭, dry-run) | 측정 불가 -> 보류 |
| Q4 | **가장 단순한 구현은?** (P10 Simplicity Selection) | 최소 변경만 채택 |
| Q5 | **프론티어 3종 이상에서 동일 패턴인가?** (Claude Code, Codex CLI, OpenClaw, autoresearch) | 1종만 -> 필요성 재검증 |

**GAP Audit** (source: `CLAUDE.md` L297-312):
- Process: Plan TO-BE items -> `grep`/`Explore` each -> 3-way classify
- Classifications: "구현 완료" (Done), "부분 구현" (Partial), "미구현" (Missing)
- Output: GAP classification table per plan item
- Purpose: "정말 필요한가?"를 코드 실측으로 확인. 이미 구현된 것을 다시 만들지 않는다.

**4-Persona Review** (source: `.claude/skills/verification-team/skill.md`):

| Persona | Real Person | Focus Area |
|---------|-------------|------------|
| **Kent Beck** | XP creator, TDD inventor | Test coverage, design simplicity, over-engineering detection |
| **Andrej Karpathy** | AI researcher | Agent constraints, ratchets, context budget |
| **Peter Steinberger** | Gateway/ops expert | Gateway reliability, operational concerns |
| **Boris Cherny** | CLI agent specialist | CLI agent patterns, sub-agent correctness |

**3-Checkpoint System** (source: `docs/progress.md` L415, `docs/workflow.md`):
1. **alloc** (Step 0): Worktree allocated, `.owner` file created, kanban -> In Progress
2. **free** (PR merge): Worktree removed, PR merged through CI
3. **session-start**: Cross-session verification (check-progress.sh hook validates state)

---

### RUNTIME Loop (GEODE Agent)

**What it is**: The inner execution loop of the GEODE agent itself at runtime. The `while(tool_use)` agentic loop that processes user requests.

**While Loop Condition** (source: `core/agent/agentic_loop.py` L119, L489):
```python
# Docstring (L119): while stop_reason == "tool_use":
# Implementation (L420-504): for round_idx in range(self.max_rounds):
#   ... LLM call ...
#   if response.stop_reason != "tool_use":  (L489)
#       break  # end_turn or max_tokens -> done
#   ... execute tools -> feed results back -> continue
```

**Each Iteration** (source: `core/agent/agentic_loop.py` L420-520):
1. **LLM Call**: Send conversation + system prompt to LLM adapter (Anthropic/OpenAI/GLM)
2. **Stop Check**: If `stop_reason != "tool_use"` -> extract text, finalize, return
3. **Tool Selection**: LLM emits `tool_use` blocks with tool name + parameters
4. **Tool Execution**: `ToolCallProcessor.process(response)` dispatches each tool call
5. **Observation**: Tool results fed back as `tool_result` messages
6. **Loop Continue**: Back to step 1 with updated context
7. **Safety**: Max 50 rounds (DEFAULT_MAX_ROUNDS), convergence detection, backpressure on errors

**Tool Inventory** (source: `core/tools/definitions.json`):
- 52 total tools across 12 categories
- Categories: analysis(8), calendar(3), data(1), discovery(5), external(7), memory(5), model(5), notification(1), planning(6), profile(4), scheduling(2), task(5)

**Permission Levels** (source: `CLAUDE.md` L190-193):
- STANDARD: Read/analysis tools -- Sub-Agent auto_approve
- WRITE: State-changing tools (memory_save, profile_update, manage_rule) -- approval needed
- DANGEROUS: System access tools (run_bash, delegate_task) -- always HITL

**Hook Events During Runtime** (source: `core/hooks/system.py`):

All 40 HookEvent enum members grouped by category:

| Category | Events |
|----------|--------|
| **Pipeline** (3) | PIPELINE_START, PIPELINE_END, PIPELINE_ERROR |
| **Node** (4) | NODE_BOOTSTRAP, NODE_ENTER, NODE_EXIT, NODE_ERROR |
| **Analysis** (3) | ANALYST_COMPLETE, EVALUATOR_COMPLETE, SCORING_COMPLETE |
| **Verification** (2) | VERIFICATION_PASS, VERIFICATION_FAIL |
| **L4.5 Automation** (6) | DRIFT_DETECTED, OUTCOME_COLLECTED, MODEL_PROMOTED, SNAPSHOT_CAPTURED, TRIGGER_FIRED, POST_ANALYSIS |
| **Memory Autonomy** (4) | MEMORY_SAVED, RULE_CREATED, RULE_UPDATED, RULE_DELETED |
| **Prompt Assembly** (2) | PROMPT_ASSEMBLED, PROMPT_DRIFT_DETECTED |
| **SubAgent** (3) | SUBAGENT_STARTED, SUBAGENT_COMPLETED, SUBAGENT_FAILED |
| **Tool Recovery** (3) | TOOL_RECOVERY_ATTEMPTED, TOOL_RECOVERY_SUCCEEDED, TOOL_RECOVERY_FAILED |
| **Gateway** (2) | GATEWAY_MESSAGE_RECEIVED, GATEWAY_RESPONSE_SENT |
| **MCP** (2) | MCP_SERVER_STARTED, MCP_SERVER_STOPPED |
| **Agentic Turn** (1) | TURN_COMPLETE |
| **Context** (3) | CONTEXT_WARNING, CONTEXT_CRITICAL, CONTEXT_OVERFLOW_ACTION |
| **Session** (2) | SESSION_START, SESSION_END |

---

### Hook Connections (How Loops Connect)

**RUNTIME -> DEV** (observation feeds development):
- `PIPELINE_END` -> analysis results -> `.geode/LEARNING.md` updates (patterns, corrections)
- `RULE_CREATED` / `RULE_UPDATED` -> new rules in `.geode/rules/` (4 rules currently: anime-ip.md, dark-fantasy.md, indie-steam.md, schedule-date-aware.md)
- `VERIFICATION_FAIL` -> investigation -> bug fix PR (triggers DEV loop)
- `TURN_COMPLETE` -> aggregated in session transcript -> informs next development priorities
- `CONTEXT_OVERFLOW_ACTION` -> informs prompt engineering improvements

**DEV -> META** (PR outcomes feed scaffold evolution):
- CI failure patterns -> new CANNOT rules (e.g., "lint/type/test 실패 상태 커밋 금지")
- Repeated review findings -> new scaffold skills (21 skills accumulated)
- CI ratchet adjustments -> test count minimum raised (now >= 2900)
- Workflow pain points -> new workflow steps (GAP Audit was added to prevent duplicate work)
- Session hook evolved -> check-progress.sh monitors develop->main gap

**META -> RUNTIME** (scaffold improvements flow to agent):
- CLAUDE.md CANNOT rules -> internalized as development constraints
- New skills -> better agent behaviors (e.g., `explore-reason-act` prevents blind changes)
- CI ratchets -> cannot ship regressions -> more robust agent runtime code

**Specific Bridge Events**:
- `PROMPT_DRIFT_DETECTED` -> CI `verify_prompt_integrity(raise_on_drift=True)` -> fail PR -> fix
- `SESSION_START` -> loads GEODE.md (agent identity), MEMORY.md, LEARNING.md into prompt
- `SESSION_END` -> check-progress.sh hook triggers -> board/merge reminders
- `DRIFT_DETECTED` -> L4.5 automation -> triggers investigation cycle

---

## S03 Mirror Table -- Structural Correspondences

### Full Mirror Table

| # | Scaffold Component | Scaffold Details | Runtime Component | Runtime Details |
|---|-------------------|------------------|-------------------|-----------------|
| 1 | **CLAUDE.md** | 425 lines, 17 CANNOT rules across 5 domains. Path: `/CLAUDE.md`. Defines architecture, workflow, conventions for the *developer agent* (Claude Code). | **GEODE.md** | 71 lines, 4 CANNOT rules, 5 Core Principles. Path: `/GEODE.md`. Defines identity, mission, constraints for the *runtime agent*. Loaded at `SESSION_START` via `core/memory/organization.py` L21 `DEFAULT_SOUL_PATH`. |
| 2 | **Scaffold Skills** (`.claude/skills/`) | 21 skills. Development-time skills: gitflow, changelog, verification-team, kent-beck-review, etc. Guide the *developer agent* through implementation workflow. | **Runtime Skills** (`.geode/skills/`) | 1 skill dir (`geode-analysts/`) with 4 analyst templates. Plus `core/skills/templates/` with 3 report templates (HTML, detailed MD, summary MD). Runtime skill system for *agent execution*. |
| 3 | **CI Ratchet** (`.github/workflows/ci.yml`) | 5 jobs: Lint (ruff + legacy import ratchet), Type (mypy + prompt integrity), Test (pytest + min 2900 count ratchet), Security (bandit), Gate (all-pass). Blocks PR merge on failure. | **5-Layer Verification** (`core/verification/`) | 5 layers: G1-G4 Guardrails (`guardrails.py`), BiasBuster (`biasbuster.py`), Cross-LLM (`cross_llm.py`), Confidence Gate (threshold 0.7 in `core/graph.py` L74), Rights Risk (`rights_risk.py`). Blocks pipeline progression on failure. |
| 4 | **Session Hook** (`.claude/hooks/check-progress.sh`) | Bash script, runs on session stop. Checks: (1) progress.md freshness, (2) develop->main gap. Returns JSON continue/message. Enforces housekeeping discipline. | **HookSystem** (`core/hooks/system.py`) | Python class, 40 events. Register/trigger pattern with priority ordering, thread-safe. Fires at pipeline/node/agent/session lifecycle points. Extensible via `hooks.register()`. |
| 5 | **Socratic Gate** (CLAUDE.md L319-326) | 5 questions (Q1-Q5) applied *before implementation*. Tests necessity, impact, measurability, simplicity, frontier consensus. Manual gate -- developer agent must answer before proceeding. | **Confidence Gate** (`core/graph.py` L74) | Threshold = 0.7 (70%). Applied *during pipeline execution*. If analyst confidence < 0.7, loopback to signals node (max 5 iterations). Automated gate -- code enforces threshold. |
| 6 | **CANNOT / CAN** (CLAUDE.md L222-256) | 17 CANNOT rules + 5 CAN freedoms. Natural-language constraints read by Claude Code. Domains: Git, Planning, Quality, Docs, PR. Enforcement: social contract (LLM reads rules). | **PolicyChain** (`core/tools/policy.py` L1-9) | 6-layer policy chain: Profile(priority=10), Organization(priority=5), Mode-based, Agent-level(STANDARD/WRITE/DANGEROUS), Node-scope, Sub-agent. Enforcement: code-level `filter_tools()` blocks disallowed calls. |
| 7 | **4-Persona Review** (`.claude/skills/verification-team/`) | 4 personas: Kent Beck (TDD/design), Karpathy (agent/constraints), Steinberger (Gateway/ops), Cherny (CLI/sub-agent). Applied to large implementation PRs. Simulated review. | **BiasBuster** (`core/verification/biasbuster.py`) | 6 bias types: confirmation, recency, anchoring (CV<0.05), position, verbosity, self-enhancement. 4-step process: RECOGNIZE -> EXPLAIN -> ALTER -> EVALUATE. Statistical + LLM detection. |

### Key Isomorphism Insight

The structural mirror is not accidental. The scaffold (CLAUDE.md / skills / CI) evolved *from* the runtime patterns, and vice versa. This is the Triple Loop in action:

- **GEODE.md** (runtime identity) is a compressed version of **CLAUDE.md** (scaffold identity) -- same "CANNOT" pattern, fewer rules because the runtime is more constrained by code.
- **PolicyChain** (runtime code enforcement) is the machine-readable version of **CANNOT/CAN** (scaffold natural-language enforcement).
- **5-Layer Verification** (runtime quality) mirrors **CI Ratchet** (scaffold quality) -- both block progression on failure, both have multiple independent checks.
- **Confidence Gate** (runtime 0.7 threshold) mirrors **Socratic Gate** (scaffold 5-question test) -- both prevent premature commitment.
- **BiasBuster** (runtime statistical bias detection) mirrors **4-Persona Review** (scaffold multi-perspective review) -- both introduce diversity to catch blind spots.

---

## Key Narratives (STAR format)

### Narrative 1: "Constraints Before Freedom" (for S01)

- **Situation**: Solo developer building a complex autonomous agent system with 185 modules over 35 days.
- **Task**: Maintain production-quality codebase without a team, while iterating rapidly (38 releases in 35 days).
- **Action**: Designed CANNOT-first development philosophy. 17 explicit prohibition rules in CLAUDE.md. CI ratchets that only go up (test count >= 2900). Socratic Gate that forces justification before implementation. 21 accumulated skills that encode institutional knowledge.
- **Result**: 1,118 commits with consistent quality. 3,219 tests. Zero regression releases. The scaffold itself evolved alongside the product -- a self-improving development harness.

### Narrative 2: "Mirror Architecture" (for S03)

- **Situation**: The development harness (Claude Code + CLAUDE.md) and the runtime agent (GEODE + GEODE.md) needed separate but coherent quality systems.
- **Task**: Ensure both the "developer" and the "product" maintain high quality through analogous mechanisms.
- **Action**: Established structural isomorphism: CLAUDE.md mirrors GEODE.md, CI Ratchet mirrors 5-Layer Verification, Socratic Gate mirrors Confidence Gate, CANNOT/CAN mirrors PolicyChain, 4-Persona Review mirrors BiasBuster. Each scaffold concept has a runtime counterpart.
- **Result**: Changes in one loop naturally inform the other. Runtime incidents (VERIFICATION_FAIL) become development tasks. Development patterns (CANNOT rules) inspire runtime constraints (PolicyChain layers). This bidirectional feedback is the essence of the Triple Loop.

### Narrative 3: "Triple Loop Learning" (for S02)

- **Situation**: Need to explain how a solo-built agent system achieves organizational-level quality and self-improvement.
- **Task**: Articulate the three nested feedback loops that drive continuous improvement.
- **Action**: META loop (scaffold evolution): CLAUDE.md rules + skills + CI ratchets evolve across sessions. DEV loop (per-PR): 8-step workflow with GAP Audit + Socratic Gate + 4-persona review. RUNTIME loop (agent execution): while(tool_use) with 52 tools + 40 hook events + 5-layer verification. Hooks bridge the loops: SESSION_START loads learned context, TURN_COMPLETE captures observations, PIPELINE_END feeds LEARNING.md.
- **Result**: Each loop operates at a different timescale (session / PR / turn) but they are connected through hooks and shared artifacts. The system gets smarter at every timescale simultaneously.

---

## Appendix: Raw Data References

### Tool List (52 tools, `core/tools/definitions.json`)

**Analysis (8)**: list_ips, analyze_ip, search_ips, compare_ips, batch_analyze, generate_report, check_status, generate_data
**Discovery (5)**: show_help, youtube_search, reddit_sentiment, steam_info, google_trends
**External (7)**: web_fetch, general_web_search, read_document, run_bash, delegate_task, install_mcp_server, manage_context
**Memory (5)**: memory_search, memory_save, manage_rule, note_save, note_read
**Model (5)**: switch_model, set_api_key, manage_auth, rate_result, rerun_node
**Planning (6)**: create_plan, approve_plan, reject_plan, modify_plan, list_plans, accept_result
**Profile (4)**: profile_show, profile_update, profile_preference, profile_learn
**Scheduling (2)**: schedule_job, trigger_event
**Notification (1)**: send_notification
**Calendar (3)**: calendar_list_events, calendar_create_event, calendar_sync_scheduler
**Task (5)**: task_create, task_update, task_get, task_list, task_stop
**Data (1)**: reject_result

### MCP Catalog Categories (44 catalog entries, `core/mcp/catalog.py`)

Official (6): memory, filesystem, git, sequential-thinking, puppeteer, github
Gaming (3): steam, steam-reviews, igdb
Social (5): discord, linkedin-reader, reddit, youtube, arxiv
Search (3): tavily-search, firecrawl, omnisearch
Knowledge Graph (1): wikidata
Database/Vector (3): qdrant, pinecone, sqlite
Memory (2): mcp-memory-service, zep
Messaging (3): gmail, slack, telegram
Calendar (2): google-calendar, caldav
Productivity (3): notion, google-drive, google-maps
Agent Infra (3): e2b, playwright, playwriter
Financial (1): financial-datasets
Development (3): sentry, postgres, docker
AI/LLM (2): langsmith, exa
Media (1): youtube-transcript
**Total verified: 41 dict entries** (code comment says "44" -- discrepancy of 3)

### `.geode/` Runtime Directory Structure

```
.geode/
  LEARNING.md          -- Agent learning records (patterns, corrections, domain knowledge)
  MEMORY.md            -- Project meta-index
  config.toml          -- Runtime configuration (gateway bindings, etc.)
  config.toml.example
  journal/             -- Session journals
  memory/              -- Runtime memory files
  models/              -- Model configs
  reports/             -- Generated reports
  result_cache/        -- Analysis result cache
  rules/               -- 4 learned rules (anime-ip.md, dark-fantasy.md, indie-steam.md, schedule-date-aware.md)
  session/             -- Session state
  skills/              -- Runtime skills (geode-analysts/ with 4 analyst templates)
  snapshots/           -- State snapshots
  vault/               -- Secure storage
```
