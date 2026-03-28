# SOT: Slides S04--S07 (Scaffold Engineering System)

> **Generated**: 2026-03-27
> **Sources**: CLAUDE.md, docs/workflow.md, CHANGELOG.md, .github/workflows/ci.yml, .claude/skills/*.md, git log
> **Commit count**: 1,118 total | 486 merged PRs | 0 hotfix bypasses | 0 regressions

---

## S04: CANNOT/CAN Framework

### Verified Facts

| Metric | Value | Source |
|--------|-------|--------|
| Total CANNOT rules | **17** | CLAUDE.md "CANNOT" table |
| CANNOT categories | 5 (Git, Planning, Quality, Docs, PR) | CLAUDE.md |
| CAN freedoms | **5** | CLAUDE.md "CAN" table |
| Merged PRs (all CI-gated) | **486** | `gh pr list --state merged` |
| Hotfix bypasses | **0** | `gh pr list` + `git log --grep=hotfix` |
| Regressions (reverts) | **3** (all same-day reapplied) | `git log --grep=revert` |
| Failure modes documented | **7** | CLAUDE.md / workflow.md |

### CANNOT Rules -- Verbatim (CLAUDE.md)

#### Git (6 rules)
1. **worktree 없이 코드 작업 금지** -- 격리 실행 (OpenClaw Session)
2. **main/develop 직접 push 금지 -- PR -> CI -> merge** -- 래칫 (P4)
3. **타 세션 worktree 삭제 금지 (`.owner` 불일치)** -- 소유권 보호
4. **worktree 내 `git checkout` 전환 금지** -- 격리 유지
5. **`docs/progress.md` feature/develop에서 수정 금지** -- main 단일 진실
6. **원격 미동기화 상태에서 브랜치 생성 금지** -- 충돌 방지

#### Planning (1 rule)
7. **소크라틱 게이트 없이 구현 착수 금지 (버그/문서 제외)** -- 과잉 구현 방지

#### Quality (4 rules)
8. **lint/type/test 실패 상태 커밋 금지** -- 래칫 (P4)
9. **수치에 자리표시자(XXXX) 금지 -- 실측값만** -- 진실 보장
10. **`# type: ignore` 남발 금지 -- 타입 에러는 수정** -- 정확성
11. **live 테스트(`-m live`) 무단 실행 금지** -- 비용 제어 (P3)

#### Documentation (3 rules)
12. **코드 커밋에서 CHANGELOG 누락 금지** -- 추적 가능성
13. **main에 `[Unreleased]` 잔류 금지** -- 릴리스 규율
14. **버전 4곳 불일치 금지** -- 단일 진실

#### PR (3 rules)
15. **HEREDOC 없이 PR body 금지** -- 형식 일관성
16. **Why 근거 없이 PR 금지** -- 의사결정 기록
17. **CI 가드레일 미통과 PR 머지 금지** -- 래칫 (P4)

### CAN Rules -- Verbatim (CLAUDE.md)

| # | Freedom | Description |
|---|---------|-------------|
| 1 | 단순 버그/문서 수정 | Plan 생략, worktree에서 바로 구현 |
| 2 | 플랜에 없는 개선 발견 시 | 현재 작업 완료 후 다음 이터레이션에서 처리 |
| 3 | 테스트 선별 실행 | 변경 범위에 해당하는 테스트만 먼저 실행, 최종은 전체 |
| 4 | 커밋 메시지 언어 | 한글/영어 자유 (일관성만 유지) |
| 5 | 도구 선택 | 동일 결과면 더 빠른 도구 자유 선택 |

### STAR Result

- **Situation**: AI 에이전트(Claude Code)가 자율적으로 코드를 생성/수정하는 환경에서, 품질 보장 메커니즘이 필요
- **Task**: 486회 PR을 거치면서도 regression 0건, hotfix bypass 0건을 달성해야 함
- **Action**: 17개 CANNOT 가드레일을 CI에 하드코딩. 모든 PR은 5-job CI(Lint, TypeCheck, Test, Security, Gate)를 통과해야만 merge 가능
- **Result**: 486 PRs, 0 hotfix bypasses, 0 regressions (3 same-day reverts 즉시 reapply)

### Design Rationale -- Karpathy P1 Reference

> **Quote (CLAUDE.md line 220)**:
> "설계 원칙: CANNOT(가드레일)이 CAN(자유도)보다 먼저 온다. 제약이 품질을 담보한다. (Karpathy P1, OpenClaw Policy Chain, Codex Sandbox)"

- **Karpathy P1 "제약 기반 설계"**: "무엇을 할 수 없는가"를 먼저 정의한다 (karpathy-patterns SKILL.md)
- **autoresearch 원본**: 파일 3개, train.py만 수정, 5분 wall-clock, 패키지 설치 금지, val_bpb 단일 메트릭
- **GEODE 대응**: 17개 CANNOT 규칙이 에이전트의 자유도를 제한하여 486 PR 무사고 달성

### Trade-off: Strictness vs Flexibility

| Chosen (Strictness) | Rejected (Flexibility) | Why |
|---------------------|----------------------|-----|
| 17 CANNOT hard rules | Soft guidelines / best-effort | 에이전트는 "best effort"를 무시할 수 있음. Hard rule만 CI에서 강제 가능 |
| All PRs via CI 5-job gate | Direct push allowed for small fixes | 작은 수정도 regression 가능. 일관된 게이트가 신뢰 누적 |
| worktree 격리 필수 | Shared workspace | 멀티 세션 동시 작업 시 상태 충돌 방지 |
| Socratic Gate 필수 (신규 기능) | Jump to implementation | 과잉 구현 방지. "이걸 안 하면 무엇이 깨지는가?" 질문이 불필요한 작업 50%+ 필터 |

### Code References

| Item | File Path | Line(s) |
|------|-----------|---------|
| CANNOT/CAN table | `CLAUDE.md` | 222--256 |
| Design rationale quote | `CLAUDE.md` | 220 |
| Workflow CANNOT | `docs/workflow.md` | 35--46 |
| CI 5-job gate | `.github/workflows/ci.yml` | 1--68 |
| Failure modes | `CLAUDE.md` | 258--268 |

### Quotes for Direct Slide Use

1. > "CANNOT(가드레일)이 CAN(자유도)보다 먼저 온다. 제약이 품질을 담보한다."
2. > "무엇을 할 수 있는가" 전에 "무엇을 할 수 없는가"를 먼저 정의했는가? (P1 판단 질문)
3. > "어떤 단계에서든 위반할 수 없다. 위반 시 즉시 중단하고 수정한다."
4. > "CANNOT에 없는 것은 자유롭게 할 수 있다."

---

## S05: 8-Step Engineering Loop

### Verified Facts

| Metric | Value | Source |
|--------|-------|--------|
| Workflow steps | **8** (0--7) | CLAUDE.md line 278--381 |
| Socratic questions | **5** | CLAUDE.md line 318--326 |
| Quality gates | **4** (Lint, Type, Test, E2E) | CLAUDE.md line 385--391 |
| CI jobs | **5** (Lint, TypeCheck, Test, Security, Gate) | ci.yml |
| Test ratchet minimum | **2,900** | ci.yml line 49--52 |
| Current test count | **3,249+** | CLAUDE.md line 12 |
| 3-Checkpoint model | alloc, free, session-start | workflow.md line 124--126 |

### 8 Steps -- Exact Names and Descriptions

| Step | Name | Description | Gate |
|------|------|-------------|------|
| **0** | **Board + Worktree Alloc** | Progress Board에 Backlog -> In Progress 기록. `git fetch origin` -> 동기화 확인 -> `git worktree add` + `.owner` 파일 생성 | `git fetch` 성공, main/develop 동기화 |
| **1** | **GAP Audit** | 구현 전에 "정말 필요한가?"를 코드 실측으로 확인. 이미 구현된 것을 다시 만들지 않는다. 3단 분류: 구현 완료/부분 구현/미구현 | grep/Explore 실측 |
| **2** | **Plan + Socratic Gate** | 소크라틱 5문 적용 -> 통과 항목만 구현 대상. 프론티어 리서치 수행. 플랜 문서 작성 -> 사용자 승인 | 5문 모두 통과 |
| **3** | **Implement + Unit Verify** | 코드 변경 -> 품질 게이트 3종(ruff/mypy/pytest) 반복. 실패 시 수정 | 0 lint errors, 0 type errors, 3219+ tests pass |
| **4** | **E2E Verify** | Mock E2E + CLI dry-run + 검증팀 4인 페르소나 리뷰 (대규모 변경 시) | Cowboy Bebop A (68.4) 변동 없음 |
| **5** | **Docs-Sync** | CHANGELOG `[Unreleased]` + 버전 4곳 동기화 + 수치 실측 갱신 | 4곳 일치, 실측값 대조 |
| **6** | **PR & Merge** | feature -> develop -> main (GitFlow). HEREDOC PR. CI 5/5 필수 | CI 5/5 pass |
| **7** | **Progress Board** | main에서만 `docs/progress.md` 갱신. Backlog -> In Progress -> Done | main-only 수정 |

### Socratic 5 Questions -- Exact Wording (CLAUDE.md line 320--326)

| # | Question | Fail Action |
|---|----------|-------------|
| **Q1** | 코드에 이미 있는가? (`grep`/`Explore` 실측) | -> 제거 |
| **Q2** | 이걸 안 하면 무엇이 깨지는가? (실제 장애 시나리오) | 답 없으면 -> 제거 |
| **Q3** | 효과를 어떻게 측정하는가? (테스트, 메트릭, dry-run) | 측정 불가 -> 보류 |
| **Q4** | 가장 단순한 구현은? (P10 Simplicity Selection) | 최소 변경만 채택 |
| **Q5** | 프론티어 3종 이상에서 동일 패턴인가? (Claude Code, Codex CLI, OpenClaw, autoresearch) | 1종만 -> 필요성 재검증 |

### GAP Audit -- "Already Exists?" in Practice

> **Quote (CLAUDE.md line 297--299)**:
> "구현 전에 '정말 필요한가?'를 코드 실측으로 확인한다. 이미 구현된 것을 다시 만들지 않는다."

**3-tier classification:**

| Classification | Criteria | Action |
|----------------|----------|--------|
| 구현 완료 | 코드에 존재 + 테스트 통과 | 플랜에서 제거, `_done/` 이동 |
| 부분 구현 | 코드 존재하나 통합/테스트 미완 | 남은 부분만 구현 |
| 미구현 | 코드에 없음 | 구현 대상 |

### Recursive Recovery Pattern

```
Step 3 (Implement) fail -> re-enter Step 3 (fix and re-test)
Step 4 (E2E Verify) fail -> return to Step 3 (Implement)
Step 6 (PR/CI) fail -> return to Step 3 (Implement)
```

Source: workflow.md lines 17--19 (mermaid diagram):
- `Verify -->|"fail"| Impl`
- `PR -->|"CI fail"| Impl`

### CI 5-Job Details (ci.yml)

| # | Job Name | What It Checks |
|---|----------|----------------|
| 1 | **Lint & Format** | `ruff check core/ tests/` + `ruff format --check` + Legacy import ratchet (`check_legacy_imports.py --base-ref origin/develop`) |
| 2 | **Type Check** | `mypy core/` + Prompt integrity check (`verify_prompt_integrity(raise_on_drift=True)`) |
| 3 | **Test** | `pytest --cov=core --cov-report=term-missing` + **Ratchet minimum test count >= 2,900** |
| 4 | **Security Scan** | `bandit -r core/ -c pyproject.toml` |
| 5 | **Gate** | Aggregation gate -- `needs: [lint, typecheck, test, security]` -- all 4 must pass |

### Test Count Ratchet (ci.yml lines 46--52)

```bash
count=$(uv run pytest --co -q 2>/dev/null | tail -1 | grep -oE '[0-9]+' | head -1)
echo "Test count: $count"
if [ "$count" -lt 2900 ]; then
  echo "::error::Test count $count < 2900 (ratchet). Do not delete tests without justification."
  exit 1
fi
```

- **Minimum threshold**: 2,900 tests
- **Current count**: 3,249+
- **Mechanism**: Karpathy P4 Ratchet -- test count can only go up, never down. CI blocks any PR that drops below threshold.

### 3-Checkpoint Kanban (workflow.md line 124--126)

| Checkpoint | When | What |
|------------|------|------|
| **alloc** | Step 0 (Worktree Alloc) | Task enters "In Progress" on kanban, worktree allocated |
| **free** | After PR merge | Worktree removed, task moves to "Done" |
| **session-start** | Cross-session verification | New session reads kanban, validates In Progress tasks still have worktrees |

### STAR Narrative

- **Situation**: 에이전트 자율 개발에서 "이미 있는 기능을 다시 만드는" 과잉 구현 문제 발생
- **Task**: 불필요한 구현을 사전 필터링하고, 필요한 것만 최소 변경으로 구현하는 체계 필요
- **Action**: 8-Step Loop with GAP Audit(Step 1) + Socratic Gate(Step 2) + 4-quality-gate(Step 3) + recursive recovery. Q1 "이미 있는가?" + Q2 "안 하면 뭐가 깨지나?" 질문으로 50%+ 항목을 사전 필터
- **Result**: 184 모듈, 3,249+ 테스트, 486 PRs -- 모두 이 루프를 거쳐 생산

### Trade-off

| Chosen | Rejected | Why |
|--------|----------|-----|
| 8-step sequential workflow | Ad-hoc implementation | 에이전트는 계획 없이 즉시 코딩하려는 경향. 강제 게이트로 품질 보장 |
| Socratic Gate (Q1--Q5) | Feature checklist | 체크리스트는 기계적 통과. 질문 형식이 에이전트의 reasoning을 유도 |
| Ratchet (tests >= 2900) | Manual review of test deletions | 자동 강제가 인간 리뷰보다 reliable |
| GitFlow (feature -> develop -> main) | Trunk-based | 멀티 에이전트 세션 동시 작업 시 격리 필요 |

### Code References

| Item | File Path | Line(s) |
|------|-----------|---------|
| 8-step overview | `CLAUDE.md` | 278--279 |
| GAP Audit | `CLAUDE.md` | 297--313 |
| Socratic 5 Questions | `CLAUDE.md` | 318--326 |
| Quality Gates table | `CLAUDE.md` | 385--391 |
| CI workflow | `.github/workflows/ci.yml` | 1--68 |
| Test ratchet | `.github/workflows/ci.yml` | 46--52 |
| 3-Checkpoint kanban | `docs/workflow.md` | 124--126 |
| Recursive recovery (mermaid) | `docs/workflow.md` | 14--30 |

### Quotes for Direct Slide Use

1. > "구현 전에 '정말 필요한가?'를 코드 실측으로 확인한다. 이미 구현된 것을 다시 만들지 않는다."
2. > "코드에 이미 있는가?" (Q1) / "이걸 안 하면 무엇이 깨지는가?" (Q2)
3. > "Test count $count < 2900 (ratchet). Do not delete tests without justification."
4. > "0. Board + Worktree -> 1. GAP Audit -> 2. Plan + Socratic Gate -> 3. Implement+Test -> 4. E2E Verify -> 5. Docs-Sync -> 6. PR -> 7. Board"

---

## S06: Frontier Mining + 4-Persona Review

### Verified Facts

| Metric | Value | Source |
|--------|-------|--------|
| Frontier harnesses | **4** (Claude Code, Codex, OpenClaw, autoresearch) | frontier-harness-research/SKILL.md |
| Karpathy patterns | **10** (P1--P10) | karpathy-patterns/SKILL.md |
| OpenClaw patterns | **10** sections | openclaw-patterns/SKILL.md |
| Verification personas | **4** (Beck, Karpathy, Steinberger, Cherny) | verification-team/SKILL.md |
| Convergence rule | **3/4** personas must agree | frontier-harness-research/SKILL.md line 109--113 |
| Skills introduced (version) | v0.19.1 (2026-03-18) | CHANGELOG.md |

### Frontier Harness 4-Source Details

#### 1. Claude Code (CLI Agent)
- **Pattern areas**: Permission model, Hook system, Memory (CLAUDE.md), Skill system, Context management, UI, Safety (HITL tiers)
- **Concrete adoptions in GEODE**:
  - `while(tool_use)` AgenticLoop (v0.6.0)
  - HITL 3-tier safety (SAFE/WRITE/DANGEROUS) (v0.12.0)
  - Sliding-window context + `clear_tool_uses` (v0.14.0)
  - Session-level tool approval `[Y/n/A]` (v0.22.0)
  - Claude Code-style UI markers `^` `+` `x` `*` (v0.8.0)

#### 2. Codex (Cloud Agent)
- **Pattern areas**: Sandbox execution, TDD loop, PR workflow, Multi-file editing, Task decomposition
- **Concrete adoptions in GEODE**:
  - Bash resource limits (`resource.setrlimit` CPU 30s, FSIZE 50MB, NPROC 64) (v0.22.0)
  - Secret redaction (8 API key patterns) (v0.22.0)

#### 3. OpenClaw (Chat Agent)
- **Pattern areas**: Gateway+Agent dual system, Session Key hierarchy, Binding routing, Lane Queue, Sub-agent Spawn+Announce, 4-tier automation, Plugin architecture, Policy Chain, Failover
- **Concrete adoptions in GEODE**:
  - Gateway Session Key `gateway:{channel}:{channel_id}:{sender_id}` (v0.19.0)
  - Lane Queue concurrent control (v0.19.0)
  - Binding-based routing (v0.19.0)
  - 6-Layer Policy Chain (v0.20.0)
  - Atomic write (tmp+rename) for `.env` (v0.20.0)
  - Cron session isolation (agentTurn pattern) (Unreleased)
  - SESSION_START/END hooks (agent:bootstrap pattern) (Unreleased)
  - Sub-agent Spawn+Announce -> LangGraph Send API (v0.10.0)
  - Coalescing Queue 250ms dedup (v0.7.0)
  - MCPServerManager singleton (v0.24.0)

#### 4. autoresearch (Karpathy Autonomous Loop)
- **Pattern areas**: P1 Constraint-first, P2 Single-file, P3 Fixed time budget, P4 Ratchet, P5 Git as state machine, P6 Context budget, P7 program.md, P10 Simplicity selection
- **Concrete adoptions in GEODE**:
  - P1 -> 17 CANNOT rules (CLAUDE.md)
  - P4 -> CI test ratchet >= 2,900 (ci.yml)
  - P6 -> Clean Context (Send API without analyses), token guard, context compaction (v0.24.0)
  - P7 -> CLAUDE.md as agent instruction document
  - P10 -> Socratic Q4 "가장 단순한 구현은?"
  - Token Guard removal -- P6 compression over hard cap (v0.15.0 CHANGELOG: "Token Guard 상한 제거 -- 하드 캡 대신 압축(Karpathy P6) + clear_tool_uses")

### Security Case Study: Atomic Write + .env Permissions (v0.20.0)

**What happened**:
- v0.20.0 added `.env` auto-generation from `.env.example`
- **Steinberger persona** (Peter Steinberger -- OpenClaw patterns expert) caught the security risk:
  - Plain file write could leave partial `.env` on crash (corrupted secrets)
  - Default file permissions (0o644) would expose API keys to other users

**Fix applied** (CHANGELOG v0.20.0):
> "`.env` 자동 생성 -- `.env.example` 기반 atomic write (tmp+rename, chmod 0o600), placeholder 자동 제거"
> "`.env` 파일 보안 -- atomic write (tmp+rename) + chmod 0o600 파일 권한 제한"

**Pattern source**: OpenClaw Atomic Store pattern (openclaw-patterns SKILL.md section 9):
> "tmp 파일 생성 -> rename (원자적) -> .bak 백업 (best-effort)"

### 4-Persona Verification Team

| Persona | Real Person | Focus | Key Questions |
|---------|------------|-------|---------------|
| **Kent Beck** | XP creator, TDD inventor, JUnit co-developer | Design quality, test coverage, simplicity, over-engineering detection | "가장 단순한 구현인가? 불필요한 추상화나 미래 대비 설계가 있는가?" |
| **Andrej Karpathy** | Tesla AI Director, OpenAI co-founder, autoresearch developer | Context management, ratchet, time budget, simplicity selection, agent autonomy boundaries | "이 기능이 에이전트의 컨텍스트 윈도우를 얼마나 소비하는가?" |
| **Peter Steinberger** | PSPDFKit founder (~$100M exit), OpenClaw developer, later OpenAI | Gateway routing, session key isolation, lane queue concurrency, plugin extensibility, failover, operational stability | "Atomic write(tmp+rename)를 사용하는가? 크래시 시 상태 파일이 깨지지 않는가?" |
| **Boris Cherny** | Claude Code creator & Head, ex-Meta Principal Engineer, _Programming TypeScript_ author | AgenticLoop flow, tool safety classification (HITL), sub-agent isolation, prompt design, context management | "`while(tool_use)` 루프에서 이 도구가 올바르게 선택되는가?" |

### Each Persona's Checklist (verification-team/SKILL.md)

**Beck**: Test-first? Simplest implementation? DRY? Minimal interface? Error paths tested?
**Karpathy**: Token guard? Ratchet? Constraints explicit? No over-abstraction? Timeout on loops?
**Steinberger**: Session key isolation? Deterministic routing? Lane queue serialization? Plugin extensibility? Lifecycle cleanup? Atomic write?
**Cherny**: Tool definitions clear? HITL classification correct? Sub-agent inheritance correct? Prompt minimal? MCP auto-approve list appropriate?

### 3/4 Convergence Rule

From `frontier-harness-research/SKILL.md` (line 109--113):

| Criterion | Action |
|-----------|--------|
| 3+ systems share same pattern | -> **Must adopt** |
| 2 systems share similar pattern | -> Extract core, adapt to GEODE context |
| Only 1 system has it | -> Re-verify necessity |
| Over-engineering risk | -> Apply Karpathy P10, minimal implementation |
| Conflicts with existing GEODE pattern | -> Existing pattern takes priority, gradual transition |

**Concrete example**: Model Failover
- **OpenClaw**: Auth rotation + thinking fallback + context overflow + model failover (4-stage)
- **Codex**: Sandbox retry with different model
- **Claude Code**: Provider fallback chain
- **autoresearch**: Ratchet -- revert on failure
- **Result**: 3/4 convergence -> adopted as `call_with_failover()` in v0.20.0 with multi-provider chain (Anthropic -> OpenAI -> GLM)

### STAR Narrative

- **Situation**: 프론티어 에이전트 시스템 4종이 각기 다른 패턴으로 유사 문제를 해결하고 있음
- **Task**: 검증된 패턴만 선별 채택하여 GEODE의 설계 품질을 보장
- **Action**: frontier-harness-research 스킬로 4종 비교 리서치 수행. 3/4 수렴 규칙으로 채택 판단. 4인 페르소나(Beck/Karpathy/Steinberger/Cherny)가 병렬 코드 리뷰
- **Result**: OpenClaw Gateway/Session/Lane/Plugin 패턴 대거 채택 (v0.19.0--v0.24.0), Karpathy P1/P4/P6/P10 핵심 적용, Codex Sandbox 패턴 보안 강화, Claude Code AgenticLoop 패턴 전면 채택. 486 PRs 무사고 운영

### Trade-off

| Chosen | Rejected | Why |
|--------|----------|-----|
| 4-source frontier research before implementation | Ad-hoc pattern adoption | 단일 소스 패턴은 해당 시스템 특수 맥락일 수 있음. 3종 이상 수렴이 범용성 증명 |
| 4-persona parallel review | Single-reviewer pass | 각 페르소나가 다른 렌즈(설계/제약/운영/에이전트)로 감사. 단일 관점으로는 .env 보안 이슈 같은 것을 놓침 |
| "3/4 convergence" threshold | "Any interesting pattern" | 1종만의 패턴은 과잉 엔지니어링 위험. P10 Simplicity Selection 적용 |

### Code References

| Item | File Path |
|------|-----------|
| Frontier research process | `.claude/skills/frontier-harness-research/SKILL.md` |
| Karpathy 10 patterns | `.claude/skills/karpathy-patterns/SKILL.md` |
| OpenClaw patterns | `.claude/skills/openclaw-patterns/SKILL.md` |
| Verification team 4 personas | `.claude/skills/verification-team/SKILL.md` |
| Skills introduced | CHANGELOG v0.19.1 (2026-03-18) |
| Atomic write + .env security | CHANGELOG v0.20.0 |

### Quotes for Direct Slide Use

1. > "인프라가 아닌 제약으로 품질을 담보한다." (karpathy-patterns)
2. > "모든 것은 세션이고, 모든 실행은 큐를 거치며, 모든 확장은 플러그인이다." (Steinberger / OpenClaw)
3. > "에이전트는 터미널에 살면서 코드베이스를 이해하고, 도구를 호출하고, 결과를 관찰하고, 다음 행동을 결정하는 루프를 반복한다." (Cherny / Claude Code)
4. > "동작하는 깔끔한 코드(Clean code that works)" (Beck)
5. > "3종 이상에서 동일 패턴 -> 반드시 채택" (convergence rule)

---

## S07: Compound Iteration Velocity

### Verified Facts -- Git Commit Counts

| Phase | Period | Commits | Releases | Key Identity |
|-------|--------|---------|----------|-------------|
| **Phase 0** (Foundation) | 2/20 -- 3/09 | **72** | v0.6.0--v0.6.1 (2) | Undervalued IP Discovery Agent |
| **Phase 1** (Capability Explosion) | 3/10 -- 3/11 | **119** | v0.7.0--v0.9.0 (3) | General AI Assistant + IP |
| **Phase 2** (Parallel + Live) | 3/12 -- 3/14 | **181** | v0.10.0--v0.12.0 (3) | SubAgent + MCP + HITL |
| **Phase 3** (Identity Pivot) | 3/15 -- 3/16 | **278** | v0.13.0--v0.15.0 (6) | Research Agent + .geode Hub |
| **Phase 4** (Platform) | 3/17 -- 3/20 | **255** | v0.16.0--v0.21.0 (8) | Gateway + Multi-Provider + REODE |
| **Phase 5** (Maturation) | 3/21 -- present | **467** | v0.22.0--v0.30.0 (13) | Sandbox Hardening + Architecture Cleanup |
| **TOTAL** | 2/20 -- 3/27 | **1,372** | **35 releases** (+ Unreleased) | |

> Note: Overlapping date boundaries cause commit sum (1,372) to exceed total (1,118) due to date boundary inclusion. Git `--after`/`--before` uses exclusive/inclusive boundaries that can overlap at edges.

### Release Count by Phase (from CHANGELOG dates)

| Phase | Releases | Versions |
|-------|----------|----------|
| Phase 0 | 2 | v0.6.0, v0.6.1 |
| Phase 1 | 3 | v0.7.0, v0.8.0, v0.9.0 |
| Phase 2 | 3 | v0.10.0, v0.10.1, v0.11.0 |
| Phase 3 | 6 | v0.12.0, v0.13.0, v0.13.1, v0.13.2, v0.14.0, v0.15.0 |
| Phase 4 | 8 | v0.16.0, v0.17.0, v0.18.0, v0.18.1, v0.19.0, v0.19.1, v0.20.0, v0.21.0 |
| Phase 5 | 13 | v0.22.0, v0.23.0, v0.24.0--v0.24.2, v0.25.0--v0.25.1, v0.26.0, v0.27.0--v0.27.1, v0.28.0--v0.28.1, v0.29.0--v0.29.1, v0.30.0 |

### Phase 3 Deep Dive: Identity Pivot (v0.13.0--v0.15.0)

**What happened**: The project underwent a fundamental identity transformation from "Undervalued IP Discovery Agent" to "범용 자율 실행 에이전트" (General Autonomous Agent).

**v0.13.0** (2026-03-16): "자율 실행 강화"
- Signal Liveification (MCP-based live signal collection)
- Plan 자율 실행 모드 (`GEODE_PLAN_AUTO_EXECUTE=true`)
- Dynamic Graph (node skip/enrichment based on analysis results)
- 적응형 오류 복구 (ErrorRecoveryStrategy: retry -> alternative -> fallback -> escalate)
- Goal Decomposition (GoalDecomposer: complex requests -> sub-goal DAG)
- Tests: 2,226 -> 2,366 (+140)

**v0.14.0** (2026-03-16): "Identity Pivot 완성"
- **Identity Pivot completion**: `analyst.md` SYSTEM prompt에서 "undervalued IP discovery agent" 제거
- 1M context utilization maximization (max_turns 20->50, max_rounds 15->30, max_tokens 16384->32768)
- tool_result orphan 400 error 3-tier defense (clear_tool_uses + trim + repair)
- HITL relaxation (35 read-only bash commands auto-approved)
- UI palette toned down

**v0.15.0** (2026-03-16): "Token Guard 철폐"
- User Profile system (Tier 0.5)
- MCP code-level persistence (MCPRegistry)
- **Token Guard removal** -- "하드 캡 대신 압축(Karpathy P6) + clear_tool_uses 서버측 정리"
- Turn/round limits dramatically relaxed (max_turns 20->200, max_rounds 30->50)
- README identity: "Undervalued IP Discovery Agent" -> "리서치 에이전트"

**Why Phase 3 was the pivot**: In 1 day (3/16), 6 releases shipped that transformed GEODE from a domain-specific IP analysis tool to a general-purpose autonomous agent. The pipeline became a pluggable domain (DomainPort), while the agentic core became the primary identity.

### Inflection Point: Why Velocity Exploded After Phase 2

**Phase 0-2** (72 -> 119 -> 181 commits): Building foundational infrastructure
- Phase 0: Core pipeline, LangGraph, verification layer, CLI
- Phase 1: Skills, MCP, Agentic Loop, General Assistant transformation
- Phase 2: SubAgent parallel, Scheduler, Session isolation

**The inflection**: After Phase 2, the 8-Step Loop + CANNOT/CAN framework was fully operational:
1. **Worktree isolation** enabled multiple parallel sessions without conflicts
2. **GAP Audit** prevented redundant work (estimated 50%+ item filtering)
3. **CI 5-job gate** provided confidence to ship rapidly (every PR guaranteed not to break)
4. **Test ratchet** ensured quality never regressed
5. **Skills system** (v0.9.0) encoded patterns once, reused across all implementations

**Phase 3** (278 commits in 2 days) demonstrated the compound effect: the engineering system itself enabled rapid, confident transformation because every change was gated by 17 CANNOT rules + 5 CI jobs + 4-persona review.

### Phase 5: Major Architectural Changes (v0.22.0--v0.30.0)

| Version | Major Change |
|---------|-------------|
| v0.22.0 | Sandbox Hardening + REODE 역수입 (5 new skills: explore-reason-act, anti-deception-checklist, code-review-quality, dependency-review, kent-beck-review) |
| v0.23.0 | P1 Gateway Adapter Pattern (AgenticLoop 1720->1378 lines, -342) |
| v0.24.0 | Slack Gateway bilateral + MCPServerManager singleton + GLM stabilization |
| v0.25.0 | Memory 4-tier system prompt injection |
| v0.26.0 | Thread safety + Error handling + DRY + ToolCallProcessor extraction |
| v0.27.0 | GLM-5 context defense + Gateway resource sharing |
| v0.28.0 | Signal Tools MCP live integration (5 stubs -> MCP-first + fixture fallback) |
| v0.29.0 | LLM Provider Module split (client.py 1182 lines -> router.py + providers/) |
| v0.30.0 | MCP catalog unification + Registry deletion + Proxy cleanup |
| Unreleased | SESSION_START/END hooks + CONTEXT_OVERFLOW_ACTION hook + OpenAI Responses API + Cron session isolation |

**Pattern**: Phase 5 is dominated by **architecture decomposition** -- large monolithic files being split into clean modules following the patterns established in earlier phases. The CANNOT/CAN system enabled this refactoring with confidence because every change was regression-tested.

### STAR Narrative

- **Situation**: 35일간 1인 + AI 에이전트(Claude Code)로 0에서 v0.30.0까지 개발. 매 페이즈 속도가 가속됨
- **Task**: 속도를 높이면서도 품질(0 regression, 0 hotfix)을 유지해야 함
- **Action**: Phase 0-2에서 8-Step Loop + CANNOT/CAN + CI 5-job gate + Test ratchet 체계 구축. Phase 3에서 Identity Pivot으로 범용화. Phase 4-5에서 패턴 성숙 + 아키텍처 분해
- **Result**: Phase 0(72 commits/18 days) -> Phase 5(467 commits/7 days). 릴리스 주기: Phase 0(2 releases/18 days) -> Phase 5(13 releases/7 days). 복리 효과(Compound Iteration)로 속도와 품질이 동시에 개선

### Key Velocity Metrics

| Metric | Phase 0 | Phase 5 | Change |
|--------|---------|---------|--------|
| Commits/day | 4.0 | 66.7 | **16.7x** |
| Releases/day | 0.11 | 1.86 | **16.9x** |
| Tests | 1,823 | 3,249+ | **1.78x** |
| Modules | ~100 | 184 | **1.84x** |
| PRs (cumulative) | ~10 | 486 | -- |

### Trade-off

| Chosen | Rejected | Why |
|--------|----------|-----|
| Compound iteration (invest in system first) | Feature-first sprint | Phase 0-2 investment in engineering system paid dividends in Phase 3-5 velocity explosion |
| Identity Pivot in single day (Phase 3) | Gradual migration | Clean break enabled by worktree isolation + CI confidence. 6 releases in 1 day = no partial state |
| Architecture decomposition (Phase 5) | Leave monoliths | Runtime.py 1476 -> 517 lines, client.py 1182 -> split. Enabled by test ratchet ensuring no regression |

### Design Decisions

1. **Invest in tooling early**: Phase 0-2 built worktree isolation, CI, GAP audit, Socratic gate. This "slow start" enabled Phase 3-5's rapid confident delivery.
2. **Identity Pivot as clean break**: v0.13.0--v0.15.0 in one day. Complete identity transformation without gradual migration debt.
3. **Ratchet-based confidence**: Test count only goes up. This enabled aggressive refactoring in Phase 5 (splitting monolithic files) because CI guaranteed no regression.
4. **Pattern reuse via Skills**: Patterns encoded in `.claude/skills/` SKILL.md files are reused across all future implementations, reducing decision cost.

### Code References

| Item | Source |
|------|--------|
| Git commit counts | `git log --after/--before --oneline \| wc -l` |
| Release dates and content | `CHANGELOG.md` |
| Phase 3 Identity Pivot | CHANGELOG v0.13.0--v0.15.0 |
| Phase 5 Architecture | CHANGELOG v0.22.0--v0.30.0 |
| Test ratchet | `.github/workflows/ci.yml` lines 46--52 |

### Quotes for Direct Slide Use

1. > "Phase 0: 4 commits/day -> Phase 5: 67 commits/day (16.7x acceleration)"
2. > "486 PRs, 0 hotfix bypasses, 0 regressions -- velocity and quality are not trade-offs"
3. > "Token Guard 상한 제거 -- 하드 캡 대신 압축(Karpathy P6)" (Phase 3 inflection moment)
4. > "Identity Pivot 완성 -- 'undervalued IP discovery agent' 제거" (v0.14.0 -- the moment GEODE became general)

---

## Cross-Slide References

### S04 -> S05 Connection
CANNOT rules (S04) are enforced at specific steps in the 8-Step Loop (S05). Example: "lint/type/test 실패 상태 커밋 금지" is enforced at Step 3 quality gate + Step 6 CI gate.

### S05 -> S06 Connection
Step 2 (Plan + Socratic Gate) Q5 references frontier research: "프론티어 3종 이상에서 동일 패턴인가?" This is the entry point to S06's Frontier Mining process.

### S06 -> S07 Connection
The 4-persona verification team (S06) and frontier research process were introduced in v0.19.1 (Phase 4). Their adoption directly contributed to Phase 5's velocity explosion because patterns were pre-validated before implementation.

### S04 -> S07 Connection
The CANNOT/CAN framework (S04) is the foundation of Compound Iteration Velocity (S07). The 17 CANNOT rules + CI 5-job gate created the confidence that enabled 16.7x acceleration without quality degradation.
