# GEODE Portfolio PPTX V6 — 5-Person Deep Review

> **Reviewers**: UI/UX Designer, Frontend Developer, 디자이너, GEODE 개발자, 시니어 하네스 개발자
> **Date**: 2026-03-27
> **Slides Reviewed**: 33 slides (S01-S33, including S24b)
> **Reference SOTs**: CLAUDE.md, sot-master-narrative.md, sot-resume-narratives.md, sot-hook-system-deep.md, sot-tool-dispatch.md
> **Codebase Cross-check**: CHANGELOG.md (v0.31.0+v0.32.0), progress.md, core/hooks/system.py (46 HookEvent), core/automation/

---

## 1. Per-Role Feedback

### 1.1 UI/UX Designer

**Overall**: V6 is a significant improvement over earlier versions in terms of information density and narrative coherence. However, several structural patterns produce visual monotony that contributes directly to the "AI로 만든 느낌."

**Positive**:
- S01 cover is well-designed with clear visual hierarchy: mascot, stat cards, tagline badge.
- S02 timeline with PIVOT moment in red is emotionally effective and tells a genuine story.
- S07 long-running safety with 3 columns is one of the best slides -- problem/solution pairs with color-coded risk levels.
- S18 game-ip-pipeline with the actual v028 DAG image breaks the visual monotony effectively.

**Problems**:

1. **Homogeneous 60/40 split (S10-S17)**: Eight consecutive slides use an identical layout: left 57-62% content block + right 38-43% sidebar. This is the single biggest contributor to visual monotony. The human eye recognizes the pattern by S12 and starts skimming.
   - Affected: S10, S11, S12, S13, S14, S15, S16, S17

2. **Card fatigue in closing section (S28-S30)**: S28 and S29 are both 2-column grids of identical "포기/얻음" pairs (7+8 = 15 trade-off cards total). By S29, the format has completely exhausted its visual interest. S30 adds 5 more identical CANNOT-HOW-RESULT rows.

3. **Whitespace starvation**: Many slides cram content to the edges. S11 hook-system in particular has 8 category boxes (4x2 grid) plus a maturity model plus a StuckDetector note plus a trade-off bar. The density is borderline unreadable at presentation scale.

4. **No "breathing room" slides**: There is no section divider, no full-bleed image slide, no quote slide between dense technical sections. S05-S17 is 13 consecutive dense technical slides with zero visual relief. A real human presenter would never do this.

5. **S21 mirror-table**: Three-column layout (Scaffold / Arrow / Runtime / Insight) is cramped. The insight panel at 148pt is too narrow for the text it contains.

**Recommendations**:
- Introduce 2-3 section divider slides (before HE-1 deep dives, before HE-0 SCAFFOLD, before CLOSING).
- Vary the deep dive layouts: S10 could be full-width flow diagram, S12 could use a center-stage diagram with minimal sidebar, S14 could be a vertical stack.
- S28+S29 should be merged into one slide with fewer but deeper trade-offs, or replaced with a visual matrix/radar chart.

---

### 1.2 Frontend Developer

**HTML Quality**: Generally clean, html2pptx-compatible. No CSS gradients, no background-image on divs, text properly wrapped in p/h1/ul/li elements.

**Issues**:

1. **Inline style explosion**: Every slide uses exclusively inline styles. While this is necessary for html2pptx, several slides exceed 160 lines of dense inline CSS. This makes any iteration extremely painful. Consider extracting shared card styles into the `<style>` block where html2pptx supports it.

2. **HTML entity overuse (S10-S17)**: Excessive use of `&#8594;` (arrow), `&#183;` (middot), `&#8595;` (down arrow), `&#215;` (multiply), `&#10132;` (triangle arrow). While correct, mixing HTML entities with actual Unicode characters (used in S01-S09) creates inconsistency.

3. **S04 triple-loop**: The "Hook 신경계" panel lists incorrect event names: `LOOP_START / LOOP_END`, `TOOL_BEFORE / TOOL_AFTER`, `MEMORY_SAVE / LEARN`, `AGENT_SPAWN / RETURN`. **None of these are actual HookEvent enum members.** The real events are `PIPELINE_START`, `NODE_ENTER`, `MEMORY_SAVED`, `SUBAGENT_STARTED`, etc. This is a factual error.

4. **Color with alpha channel in borders**: Multiple slides use patterns like `border: 1pt solid #4ECDC450` (hex with alpha). html2pptx may not support 8-digit hex colors. This could render as opaque or transparent unpredictably.

5. **`margin: 0; padding: 0;` inconsistency**: S01-S09 have `margin: 0; padding: 0;` in body, but S10+ drop the explicit `margin: 0; padding: 0;` in the body style while adding it separately. Minor but inconsistent.

6. **Missing `margin: 0`**: S10-S17 body style has `margin: 0; padding: 0;` but some earlier slides only have it in the reset rule. Not a rendering issue but inconsistent.

7. **S22 CANNOT slide**: Lists "CSS gradient 금지" and "단순 박스형 배치 금지" as CANNOT rules. These are PPTX authoring rules, not GEODE runtime CANNOT rules. The slide conflates Scaffold CANNOT rules (for LLM code development) with PPTX build rules. This creates confusion about what "23 CANNOT" actually means.

---

### 1.3 디자이너 — "AI로 만든 느낌" 전문 진단

#### 가장 "AI로 만든 느낌"이 강한 슬라이드 TOP 5

| 순위 | 슬라이드 | 이유 |
|------|----------|------|
| 1 | **S28 Architecture Trade-offs** | 7개 동일 카드가 2열로 나열. 모든 카드가 동일한 구조(제목→포기→얻음). 사람이 만들면 핵심 3개만 깊게, 나머지는 축약. |
| 2 | **S29 Agent Trade-offs** | S28과 완전 동일한 구조로 8개 카드 추가. 청중은 이미 패턴을 인식하고 관심을 잃음. |
| 3 | **S30 Constraints→Results** | 5개 CANNOT→HOW→RESULT 행이 완전 동일한 3-box 구조. 기계적 반복의 극단. |
| 4 | **S11 Hook System** | 8개 카테고리 박스(4x2)가 완전히 균등한 크기와 구조. 실제 중요도 차이가 없어 보임. |
| 5 | **S20 Eco2 Evolution** | 4개 패턴 행이 동일 구조(좌→화살표→중→화살표→우). 기계적 테이블 느낌. |

#### "AI로 만든 느낌"을 주는 구체적 패턴 7가지

1. **균일한 카드 그리드**: 모든 카드가 정확히 같은 높이, 같은 padding, 같은 구조. 사람이 만들면 핵심 카드는 크고 부수적 카드는 작다. AI는 "공평하게" 배치한다.

2. **반복적 "포기/얻음" 프레이밍**: S28-S29에서 15개 trade-off 모두 동일한 문장 구조 사용. 사람이라면 가장 중요한 trade-off는 스토리텔링으로, 나머지는 간략 표로 처리.

3. **매 슬라이드 마다 있는 Trade-off 바**: 좋은 의도지만, 33장 중 약 25장에 동일한 형태의 trade-off 바가 있다. 이것은 템플릿을 채운 느낌을 준다.

4. **텍스트 톤의 균일성**: "X였기 때문에 Y를 설계했고, Z를 달성했다" 구조가 거의 모든 서술에서 반복. 인과관계 서술이 있지만 문장 리듬이 단조롭다.

5. **숫자 뱃지의 과잉**: 큰 폰트(18-24pt) 숫자 뱃지가 슬라이드당 3-5개씩 반복 출현. S12는 5/4096/600K, S13은 3/0, S14는 0.03% 등. 청중이 숫자에 둔감해진다.

6. **색상 사용의 기계적 일관성**: 모든 슬라이드에서 accent color가 동일한 패턴으로 적용. 사람이 만들면 특정 슬라이드에서 색상을 의도적으로 깨뜨려 강조를 만든다.

7. **"NEW SLIDE" 뱃지 (S07, S08)**: 이것은 작업 과정의 내부 마커가 최종 결과물에 남은 것. 청중 입장에서 의미 없음. 즉시 제거 필요.

#### "사람이 고민해서 만든" 느낌을 내는 방법

1. **정보 비대칭**: 핵심 슬라이드(S06, S07, S11, S19)는 풀 블리드 다이어그램 + 최소 텍스트. 부수적 슬라이드는 현재보다 더 축약.

2. **레이아웃 변형**: 33장에 최소 5가지 이상의 서로 다른 레이아웃 패턴이 필요하다.
   - 풀 블리드 다이어그램 (S05, S06, S18에만 존재)
   - 중앙 집중형 (하나의 큰 개념)
   - 좌우 비대칭 (현재 대부분)
   - 수직 타임라인 (S02, S25, S26에만 존재)
   - 비교 대조형 (S19만)

3. **의도적 여백**: S05 architecture 다이어그램 주변에 더 많은 여백. 다이어그램이 "숨 쉴 공간"을 가져야 한다.

4. **텍스트 리듬 깨기**: 모든 문장이 인과관계 구조일 필요 없다. 때로는 짧은 선언문, 때로는 질문, 때로는 인용구로 리듬을 변화시킨다.

5. **카드 크기 차등**: 가장 중요한 trade-off는 슬라이드 1/2 크기 카드, 나머지는 1줄 리스트로.

---

### 1.4 GEODE 개발자 — 시스템 정확성 점검

#### Hook 시스템 개편 반영 점검

**현재 HookEvent enum 실제 멤버 수: 46개** (system.py 실측)

실제 멤버 목록 (15개 카테고리):
1. Pipeline Lifecycle: PIPELINE_START, PIPELINE_END, PIPELINE_ERROR (3)
2. Node Execution: NODE_BOOTSTRAP, NODE_ENTER, NODE_EXIT, NODE_ERROR (4)
3. Analysis: ANALYST_COMPLETE, EVALUATOR_COMPLETE, SCORING_COMPLETE (3)
4. Verification: VERIFICATION_PASS, VERIFICATION_FAIL (2)
5. Automation: DRIFT_DETECTED, OUTCOME_COLLECTED, MODEL_PROMOTED, SNAPSHOT_CAPTURED, TRIGGER_FIRED, POST_ANALYSIS (6)
6. Memory: MEMORY_SAVED, RULE_CREATED, RULE_UPDATED, RULE_DELETED (4)
7. Prompt: PROMPT_ASSEMBLED, PROMPT_DRIFT_DETECTED (2)
8. SubAgent: SUBAGENT_STARTED, SUBAGENT_COMPLETED, SUBAGENT_FAILED (3)
9. Tool Recovery: TOOL_RECOVERY_ATTEMPTED, TOOL_RECOVERY_SUCCEEDED, TOOL_RECOVERY_FAILED (3)
10. Gateway/MCP: GATEWAY_MESSAGE_RECEIVED, GATEWAY_RESPONSE_SENT, MCP_SERVER_STARTED, MCP_SERVER_STOPPED (4)
11. Agentic Turn: TURN_COMPLETE (1)
12. Context Overflow: CONTEXT_WARNING, CONTEXT_CRITICAL, CONTEXT_OVERFLOW_ACTION (3)
13. Session: SESSION_START, SESSION_END (2)
14. Model: MODEL_SWITCHED (1)
15. LLM Call: LLM_CALL_START, LLM_CALL_END (2)
16. Tool Approval: TOOL_APPROVAL_REQUESTED, TOOL_APPROVAL_GRANTED, TOOL_APPROVAL_DENIED (3)

**Total: 46 events** (docstring says 46, slide says 46 -- CORRECT)

**v0.31.0 Added Hooks**:
- TOOL_APPROVAL_REQUESTED, TOOL_APPROVAL_GRANTED, TOOL_APPROVAL_DENIED (3 new, 42->45)
- LLM_CALL_START, LLM_CALL_END (fixed/enabled)
- SESSION_START, SESSION_END (new)
- CONTEXT_OVERFLOW_ACTION (new)
- TURN_COMPLETE (new in wiring)

**v0.32.0 (Unreleased) Added**:
- Autonomous safety 3 conditions (budget_stop, runtime ratchet, diversity forcing)
- Plan-first prompt guide
- Provider-aware context compaction
- MODEL_SWITCHED hook (from v0.31 PR #503)

#### S11 Hook System 슬라이드 정합성 검사

| 항목 | S11 내용 | 실제 | 판정 |
|------|----------|------|------|
| 총 이벤트 수 | 46 | 46 | CORRECT |
| 카테고리 수 | "8 categories" | 15-16 categories (enum comments) | **WRONG** -- S11 says 8 but actual enum has 15+ groupings |
| Node Execution events | "ENTER, EXIT, RETRY, ERROR" | BOOTSTRAP, ENTER, EXIT, ERROR (no RETRY) | **WRONG** -- NODE_RETRY does not exist |
| Analysis/Verify events | "6 events: COMPLETE, FAIL, ESCALATE" | 5 events (3 analysis + 2 verify), no ESCALATE | **WRONG** -- ESCALATE is not a HookEvent |
| Memory events | "SAVE, LOAD, UPDATE, PURGE" | MEMORY_SAVED, RULE_CREATED, RULE_UPDATED, RULE_DELETED | **WRONG** -- LOAD and PURGE do not exist |
| Prompt events | "ASSEMBLE, CACHE, UPDATE" | PROMPT_ASSEMBLED, PROMPT_DRIFT_DETECTED | **WRONG** -- CACHE and UPDATE not real events |
| Sub-Agent events | "SPAWN, COMPLETE, FAIL, TIMEOUT" | STARTED, COMPLETED, FAILED (no TIMEOUT) | **WRONG** -- 4 listed but 3 actual, TIMEOUT nonexistent |
| Context events | "80%, 95%, OVERFLOW_ACTION" | CONTEXT_WARNING, CONTEXT_CRITICAL, CONTEXT_OVERFLOW_ACTION | CORRECT |
| Tool HITL events | "REQUESTED, GRANTED, DENIED" | Correct | CORRECT |
| Maturity model | L1 Observe → L2 React → L3 Decide → L4 Autonomy | Correct per sot-hook-system-deep.md | CORRECT |
| StuckDetector 120s | Yes | Correct per SOT | CORRECT |

**CRITICAL: S11 has 5 factual errors in the 8-category grid.** The category names are correct at high level, but individual event names within each category are fabricated placeholders, not actual HookEvent enum values. This is the most serious accuracy issue in the entire deck.

#### S04 Triple-Loop Hook Panel

Lists: `LOOP_START / LOOP_END`, `TOOL_BEFORE / TOOL_AFTER`, `MEMORY_SAVE / LEARN`, `CONTEXT_COMPACT`, `AGENT_SPAWN / RETURN`

**NONE of these are real HookEvent names.** All fabricated. Should be: PIPELINE_START/END, NODE_ENTER/EXIT, MEMORY_SAVED, CONTEXT_WARNING, SUBAGENT_STARTED/COMPLETED, etc.

#### Scheduler/Automation 점검

**S09 Scheduler + Gateway**:

| 항목 | S09 내용 | 실제 | 판정 |
|------|----------|------|------|
| AT/EVERY/CRON types | Yes, listed | SchedulerService supports AT, EVERY, CRON | CORRECT |
| Cron session isolation | isolated=True default | Correct per v0.31.0 CHANGELOG | CORRECT |
| action_queue → AgenticLoop | Yes | Correct per v0.31.0 CHANGELOG | CORRECT |
| systemEvent injection | Mentioned | isolated=False option for systemEvent | CORRECT |
| NL Parser | Mentioned | NL regex removed, LLM framing in v0.31.0 | PARTIALLY OUTDATED -- slide still says "NL Parser" but v0.31.0 removed NL regex |
| Predefined Automations 10개 | NOT MENTIONED | core/automation/predefined.py has 10 templates | **MISSING** |
| TriggerManager F1-F4 feedback loop | NOT MENTIONED | core/automation/triggers.py exists | **MISSING** |
| SchedulerService action field | NOT DETAILED | v0.31.0 added action field | Present but not detailed |

**S09 is missing TriggerManager and Predefined Automations entirely.** The feedback loop (DRIFT_DETECTED → TriggerManager → re-analyze) is a key differentiator but absent.

---

### 1.5 시니어 하네스 개발자 — 기술적 밀도 + Trade-off 깊이

**Overall Assessment**: V6 demonstrates genuine depth in several areas (AgenticLoop termination, Provider-aware compaction, DomainPort portability). However, the "포기/얻음" formula has become a crutch that prevents deeper engagement with actual design tensions.

#### Strengths

1. **S07 Long-Running Safety**: This is the best slide in the deck. Three concrete dangers with actual cost calculations ($7.50/session, $500+ overnight). The Karpathy P3/P4 attribution adds credibility. This is what "사람이 고민해서 만든" looks like.

2. **S08 Plan-first + Provider-aware Compaction**: Genuinely interesting content. The Provider-aware insight (Anthropic server-side vs OpenAI/GLM client-side) shows real operational experience. This is a trade-off that only someone who ran the system would know.

3. **S19 Domain Portability**: The REODE proof (83/83 mvn pass, 0 core lines changed) is the single strongest evidence in the entire deck. The "코어 수정 0줄" badge is powerful.

#### Weaknesses

1. **Trade-off depth is shallow despite prevalence**: Almost every slide has a trade-off bar, but most are surface-level. Example: S13 "3-Provider 유지 비용이 있지만, 단일 Provider 장애로 파이프라인 전체가 중단되는 비용이 훨씬 크다" -- this is obvious. A deeper trade-off would discuss: what happens when Anthropic releases a model that ZhipuAI cannot match in capability? How do you handle model-specific prompt tuning across 3 providers?

2. **Missing "what went wrong" stories**: S02 mentions the interview rejection, but the rest of the deck is pure success narrative. Real engineering portfolios benefit from "I tried X, it failed because Y, so I pivoted to Z" stories embedded in individual slides. The Token Guard removal (v0.14) mentioned in S26 is a perfect candidate but gets only 1 line.

3. **Velocity claims need calibration**: S25 claims 16.7x velocity improvement but provides no baseline definition. What does "1x" mean in Week 1? Lines of code? Features? PRs? Without a measurable baseline, the multiplier is meaningless.

4. **Security slide (S27) is underdeveloped**: For a system that runs bash commands autonomously, S27 is surprisingly thin. The Bash 3-Layer description is abstract. Where is the actual blocked-patterns list? How many bash commands were blocked vs. allowed in practice? What is the false positive rate?

5. **Missing: Autonomous Safety 3 conditions (v0.32.0)**: The CHANGELOG shows v0.32.0 added budget_stop, runtime ratchet, and diversity forcing. S07 partially covers these but does not reference them as a cohesive "3 conditions" feature. Given this was added Mar 28, it may be the absolute latest work.

6. **Deferred tool loading (ToolSearch 2-hop) missing from S10**: The sot-tool-dispatch.md describes a sophisticated deferred loading mechanism with `to_anthropic_tools_with_defer()` and ALWAYS_LOADED_TOOLS. This is a genuine innovation for context budget management (85% token reduction) but S10 does not mention it at all.

7. **No latency/performance data anywhere**: 33 slides of architecture but zero mention of actual latency. How long does a typical AgenticLoop turn take? What is the P95 latency for tool execution? This is critical for "장기 자율 실행" credibility.

---

## 2. "AI로 만든 느낌" Specific Diagnosis with Fix Proposals

### Root Cause Analysis

The "AI로 만든 느낌" comes from three reinforcing patterns:

1. **Template Rigidity**: Every slide follows the same template: header → title → subtitle → content (60/40 split) → trade-off bar → footer. There are exactly TWO template variants in 33 slides.

2. **Exhaustive Enumeration**: AI tends to list everything. S11 lists all 8 categories. S28-S29 list all trade-offs. S31 lists all stats. A human curator would ruthlessly cut to 3-4 items per slide and say "the rest are in the appendix."

3. **Uniform Emotional Tone**: Every slide maintains the same "confident engineer explaining" tone. There is no vulnerability (except S02), no humor, no surprise, no frustration. Real presentations have emotional arc: tension → insight → relief.

### Fix Proposals (Priority Order)

| # | Fix | Slides Affected | Effort | Impact |
|---|-----|-----------------|--------|--------|
| 1 | **Break the 60/40 layout**: Introduce 3+ new layouts (full-bleed diagram, center-hero, vertical stack, asymmetric 75/25) | S10-S17 | Medium | **HIGH** -- immediately kills monotony |
| 2 | **Section dividers**: Add 3 full-bleed or minimal slides before HE-1, HE-0, CLOSING sections | +3 new slides | Low | **HIGH** -- creates breathing rhythm |
| 3 | **Merge S28+S29**: Combine into 1 slide with top 5 trade-offs, not 15 | S28-S29 → S28 | Low | **HIGH** -- removes most AI-like section |
| 4 | **Fix S11 event names**: Replace fabricated names with actual HookEvent enum values | S11 | Low | **CRITICAL** -- factual accuracy |
| 5 | **Fix S04 hook names**: Replace fabricated names | S04 | Low | **CRITICAL** -- factual accuracy |
| 6 | **Remove "NEW SLIDE" badges**: S07, S08 have internal work markers | S07, S08 | Trivial | Medium |
| 7 | **Add 1-2 failure stories**: Token Guard removal, MCPRegistry deletion as "what we tried and undid" narrative | S17, S26 | Medium | HIGH -- humanizes the deck |
| 8 | **Vary trade-off bar placement**: Not every slide needs one. Reserve for slides where the trade-off is genuinely non-obvious | 15+ slides | Low | Medium |
| 9 | **Card size differentiation**: In S28-S30, make the #1 trade-off 2x larger | S28, S29, S30 | Low | Medium |
| 10 | **Add latency/performance data**: Real operational numbers on at least 2-3 slides | S06, S10, S17 | Medium | HIGH -- proves operational maturity |

---

## 3. Hook / Scheduler / Automation Gap Analysis

### Hook System

| Check | Status | Detail |
|-------|--------|--------|
| HookEvent count | CORRECT | 46 in enum, 46 on slides |
| v0.31.0 new hooks reflected | PARTIAL | TOOL_APPROVAL 3 mentioned in S11. SESSION_START/END, LLM_CALL_START/END, CONTEXT_OVERFLOW_ACTION, MODEL_SWITCHED not individually called out |
| v0.32.0 autonomous safety | MISSING | budget_stop, runtime ratchet, diversity forcing are in S07 but not connected to v0.32.0 |
| Individual event name accuracy | **FAIL** | S11 8-category grid has fabricated event names. S04 hook panel is entirely fabricated |
| Category count accuracy | **FAIL** | S11 says "8 categories" but actual enum has 15+ groupings |
| Handler registry (17 handlers) | NOT SHOWN | sot-hook-system-deep.md documents 17 registered handlers but slide only mentions pattern |
| Plugin system (YAML + class-based) | NOT SHOWN | Important extensibility story missing |
| Hook extraction story (L0→L3 violation) | NOT SHOWN | This is a strong architecture narrative per CHANGELOG v0.31.0 |

### Scheduler / Automation

| Check | Status | Detail |
|-------|--------|--------|
| AT/EVERY/CRON | CORRECT | S09 lists all three |
| Cron session isolation | CORRECT | S09 shows isolated=True flow |
| NL Parser | OUTDATED | S09 says "NL Parser" but v0.31.0 removed regex, uses LLM framing |
| TriggerManager | **MISSING** | Not mentioned anywhere in 33 slides |
| Predefined Automations (10) | **MISSING** | Not mentioned anywhere |
| FeedbackLoop (CUSUM → DRIFT → re-analyze) | **MISSING** | Only briefly mentioned as "CUSUM" in S03 thesis |
| SnapshotManager | MISSING | Referenced in SOT but not in any slide |
| OutcomeTracker | MISSING | Referenced in SOT but not in any slide |
| ModelRegistry.promote() | MISSING | Referenced in SOT but not in any slide |
| action_queue mechanism | PARTIAL | Mentioned in S09 but flow not visualized |

**The entire L4.5 Automation subsystem (9 components) is essentially absent from the deck.** This includes FeedbackLoop, CUSUMDetector, TriggerManager, SnapshotManager, OutcomeTracker, ModelRegistry, CorrelationAnalyzer, ExpertPanel, and PredefinedAutomations. Only the SchedulerService is covered.

---

## 4. Fullstack Coverage Checklist

| System | Slide | Present | Accurate | Depth |
|--------|-------|---------|----------|-------|
| AgenticLoop while(tool_use) | S06 | YES | YES | Good -- 5 termination paths, context management |
| Tool Dispatch 4-Route | S10 | YES | YES | Good -- dispatch flow + 5-tier safety |
| Hook System 46+ events | S11 | YES | **INACCURATE** | Layout good but event names fabricated |
| Sub-Agent | S12 | YES | YES | Good -- context explosion problem + guard |
| LLM Failover | S13 | YES | YES | Good -- 3-provider chain + circuit breaker |
| Context Compression | S14 | YES | YES | Good -- 3-phase with lossless selection |
| 4-Tier Memory | S15 | YES | YES | Good -- auto-learning feedback loop |
| PromptAssembler | S16 | YES | YES | Good -- 6-phase + SHA-256 + cache |
| MCP Ecosystem | S17 | YES | YES | Good -- Registry deletion story |
| Cost Tracking (TokenTracker) | S17 | YES | YES | Adequate -- combined with MCP |
| Game IP Pipeline | S18 | YES | YES | Good -- DAG image + 5-layer + scoring |
| Domain Portability | S19 | YES | YES | Excellent -- REODE proof numbers |
| Eco2 Evolution | S20 | YES | YES | Good -- 4 pattern evolution arrows |
| Scaffold CANNOT/CAN | S22 | YES | PARTIAL | 6 of 23 rules shown; some are PPTX rules not runtime |
| 8-Step Loop | S23 | YES | YES | Good -- clear flow with loop-back |
| Frontier Mining | S24 | YES | YES | Good -- 4 sources + 3/4 rule |
| 4-Persona Review | S24b | YES | YES | Good -- .env case study |
| Velocity | S25 | YES | PARTIAL | 16.7x claim lacks baseline definition |
| CHANGELOG | S26 | YES | YES | Good -- 6 milestones |
| Security (Bash+PolicyChain) | S27 | YES | PARTIAL | PolicyChain image present but Bash 3-layer is abstract |
| Gateway + Serve | S09 | YES | YES | Good -- channel routing + serve |
| Scheduler + Automation | S09 | PARTIAL | OUTDATED | AT/EVERY/CRON present; TriggerManager/Predefined MISSING |
| Long-Running Safety | S07 | YES | YES | Excellent slide |
| Plan-first + Compaction | S08 | YES | YES | Good -- provider-aware insight |
| Autonomous Safety 3 conditions | S07 | YES | YES | 3 brakes cover v0.32.0 content |
| Provider-aware Compaction | S08 | YES | YES | Anthropic vs OpenAI/GLM split |
| Dual Trust Model | S27 | YES | YES | Input Gating + Output Validation |
| REODE 5-Gate Scorecard | S19 | PARTIAL | PARTIAL | "5-Gate Migration Scorecard" mentioned but gates not listed |
| TokenTracker | S17 | YES | YES | ContextVar singleton + 18 model prices |
| Verification 5-Layer | S18 | YES | YES | L1-L5 listed with specific checks |

### Missing Systems (not covered anywhere in 33 slides)

1. **L4.5 Automation subsystem**: FeedbackLoop, CUSUMDetector, TriggerManager, SnapshotManager, OutcomeTracker, ModelRegistry, CorrelationAnalyzer, ExpertPanel
2. **Predefined Automations (10 templates)**: discovery scans, pending workers, calibration drift, data quality, etc.
3. **Deferred Tool Loading**: to_anthropic_tools_with_defer(), ALWAYS_LOADED_TOOLS, 85% token reduction
4. **Hook Plugin System**: YAML + class-based discovery, notification_hook plugin
5. **Hook Extraction Story**: core/orchestration → core/hooks/ migration, L0→L3 dependency violation fix
6. **Action Summary**: v0.31.0 AgenticResult.summary -- deterministic per-tool summary
7. **Gateway webhook endpoint**: v0.31.0 `geode serve` POST /webhook
8. **ConfigWatcher hot-reload**: v0.31.0 binding hot-reload

---

## 5. Prioritized V7 Action Items

### P0 — Must Fix (Accuracy)

| # | Action | Slides | Impact |
|---|--------|--------|--------|
| 1 | Fix S11 8-category event names to match actual HookEvent enum | S11 | Prevents embarrassment if interviewer checks code |
| 2 | Fix S04 hook panel event names | S04 | Same |
| 3 | Remove "NEW SLIDE" badges | S07, S08 | Professional polish |
| 4 | Fix S22 CANNOT rules to be only runtime CANNOT (not PPTX rules) | S22 | Prevents confusion about what "23 CANNOT" means |
| 5 | Update S09 NL Parser reference (regex removed in v0.31.0) | S09 | Accuracy |

### P1 — Should Fix (AI Feel Removal)

| # | Action | Slides | Impact |
|---|--------|--------|--------|
| 6 | Add 3 section divider slides (before HE-1 S10, before HE-0 S21, before CLOSING S31) | +3 new | Breaks visual monotony, adds +3 to slide count |
| 7 | Vary layout for S10-S17: at least 3 different layouts instead of uniform 60/40 | S10-S17 | Biggest single "AI feel" killer |
| 8 | Merge S28+S29 into single "Top 5 Trade-offs" slide with depth variation | S28-S29 → S28 | Removes most AI-like section, -1 slide |
| 9 | Add S09b for TriggerManager + Predefined Automations (10 templates) | +1 new | Covers missing L4.5 automation |
| 10 | Add deferred tool loading to S10 or new S10b | S10 or +1 new | Covers missing innovation |

### P2 — Nice to Have (Depth)

| # | Action | Slides | Impact |
|---|--------|--------|--------|
| 11 | Add operational data (latency, blocked bash commands, actual cost per session) | S06, S10, S17 | Proves operational maturity |
| 12 | Expand S27 security with actual blocked patterns list and stats | S27 | Security credibility |
| 13 | Add "failure story" to S26 timeline (Token Guard removal detail) | S26 | Humanizes the narrative |
| 14 | Define velocity baseline in S25 (what is "1x"?) | S25 | Credibility of 16.7x claim |
| 15 | Detail REODE 5-Gate Scorecard gates in S19 | S19 | Completeness |
| 16 | Add Hook Plugin system + extraction story to S11 | S11 | Shows architectural judgment |

### Estimated Slide Count Impact
- Current: 33 slides
- After P0: 33 slides (fixes only)
- After P1: 36 slides (+3 dividers, +1 automation, -1 merged trade-off = +3 net)
- After P2: 36 slides (depth changes within existing slides)

---

## 6. Per-Slide Score (1-10) with 1-Line Feedback

| Slide | Score | Feedback |
|-------|-------|----------|
| S01 Cover | 8/10 | Strong visual hierarchy; version should be v0.32.0 per latest CHANGELOG |
| S02 Timeline | 9/10 | Best storytelling slide; PIVOT moment in red is emotionally effective |
| S03 Thesis 4-Axis | 7/10 | Good thesis but 4-axis cards are uniform; left thesis block is strong |
| S04 Triple Loop | 6/10 | Good concept but **hook event names are all fabricated** -- must fix |
| S05 Architecture | 7/10 | v028 diagram is good; right-side stat cards feel like filler |
| S06 Agentic Loop | 8/10 | Diagram + 5 termination conditions + "why 50 rounds" -- well balanced |
| S07 Long-Running Safety | 9/10 | Best technical slide; real cost calculations; remove "NEW SLIDE" badge |
| S08 Plan+Compaction | 8/10 | Provider-aware insight is genuine; remove "NEW SLIDE" badge |
| S09 Scheduler+Gateway | 7/10 | Good dual coverage; missing TriggerManager and Predefined Automations |
| S10 Tool Dispatch | 8/10 | 4-route dispatch + 5-tier safety is clear; missing deferred loading |
| S11 Hook System | 5/10 | **5 factual errors in event names**; layout and maturity model are good |
| S12 Sub-Agent | 8/10 | Context explosion problem statement with real numbers; good solution flow |
| S13 LLM Failover | 7/10 | Circuit breaker state machine is clear; trade-off is obvious/shallow |
| S14 Context Compression | 7/10 | 3-phase ladder is clear; depth expansion bar chart is effective |
| S15 Memory+Learning | 7/10 | Auto-learning loop is clear; 4-tier horizontal layout wastes vertical space |
| S16 PromptAssembler | 7/10 | 6-phase pipeline is clear; SHA-256 tracking well explained |
| S17 MCP+Cost | 7/10 | Registry deletion story is good; TokenTracker section feels rushed |
| S18 Game IP Pipeline | 8/10 | v028 DAG image + scoring formula + fixture results -- dense but effective |
| S19 Domain Portability | 9/10 | "0줄 코어 수정" is the strongest proof in the deck; REODE numbers compelling |
| S20 Eco2 Evolution | 6/10 | Mechanically uniform 4-row structure; "AI feel" strong |
| S21 Mirror Table | 6/10 | 3-column layout is cramped; insight panel text too small for its importance |
| S22 CANNOT/CAN | 7/10 | 3x2 grid is visually effective; some rules are PPTX rules not runtime |
| S23 8-Step Loop | 7/10 | Clear flow with loop-back; Socratic Gate detail is good |
| S24 Frontier Mining | 7/10 | 4 sources with specific takeaways; 3/4 convergence rule is memorable |
| S24b 4-Persona Review | 7/10 | .env case study adds credibility; could use one more real case |
| S25 Velocity | 6/10 | 16.7x claim needs baseline definition; Phase timeline is visually monotonous |
| S26 CHANGELOG | 7/10 | 6 milestones well chosen; vertical timeline is clean |
| S27 Security | 6/10 | PolicyChain image is good but Bash 3-Layer is abstract; needs real stats |
| S28 Arch Trade-offs | 4/10 | **Most "AI-generated" slide**: 7 identical cards in 2 columns |
| S29 Agent Trade-offs | 4/10 | **Second most "AI-generated"**: 8 more identical cards |
| S30 Constraints→Results | 5/10 | 5 identical CANNOT→HOW→RESULT rows; mechanical repetition |
| S31 Summary | 7/10 | Stat grid is clean; REODE panel is effective recap |
| S32 Harness Discipline | 7/10 | 4-axis evolution direction is forward-looking; thesis callback is strong |
| S33 Closing | 8/10 | Good bookend with thesis callback; Triple Loop mini is effective recap |

**Average Score: 6.8/10**

### Score Distribution
- 9/10 (Excellent): S02, S07, S19 (3 slides)
- 8/10 (Good): S01, S06, S08, S10, S12, S18, S33 (7 slides)
- 7/10 (Adequate): S03, S05, S09, S13, S14, S15, S16, S17, S22, S23, S24, S24b, S26, S31, S32 (15 slides)
- 6/10 (Needs Work): S04, S20, S21, S25, S27 (5 slides)
- 5/10 (Significant Issues): S11, S30 (2 slides)
- 4/10 (Major Rework): S28, S29 (2 slides)

---

## Summary

V6 is a substantial body of work with genuine technical depth, particularly in S07 (Long-Running Safety), S19 (Domain Portability), and S08 (Provider-aware Compaction). These slides demonstrate real operational experience that cannot be faked.

The "AI로 만든 느낌" stems not from lack of content but from **uniform packaging**: identical layouts, identical trade-off bars, identical card structures repeated 33 times. The fix is not adding more content -- it is **varying the presentation** and **cutting ruthlessly**.

The two critical accuracy issues (S04 and S11 fabricated HookEvent names) must be fixed before any presentation, as they would be instantly caught by anyone who reads the codebase.

The biggest content gap is the L4.5 Automation subsystem (TriggerManager, Predefined Automations, FeedbackLoop) which represents substantial engineering work that is completely invisible in the current deck.
