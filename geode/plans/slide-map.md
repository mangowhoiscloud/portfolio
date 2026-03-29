# Slide Map v0.32.1 (26 Slides)

## 구조 개요

| Part | 슬라이드 | 주제 | Accent |
|------|---------|------|--------|
| **Opening** | S01-S03 | Cover, 4-Axis, Triple Loop | Mixed |
| **Scaffold** | S04-S08 | Mirror, CANNOT, 8-Step, Frontier, Velocity | #818CF8 Indigo |
| **Architecture** | S09-S15 | 6-Layer, Loop, Dispatch, Hooks, SubAgent, Failover, Context+Memory | #4ECDC4 Cyan |
| **Assembly** | S16-S17 | PromptAssembler, MCP+Cost | #818CF8 / #4ECDC4 |
| **Domain** | S18-S19 | Game IP, Domain Portability | #F5C542 Amber |
| **Safety** | S20 | Security + Gateway | #EF4444 Red |
| **Closing** | S21-S25 | Constraints, Tradeoffs(2), Summary, Closing, Timeline | Mixed |

## 슬라이드 상세

### Opening (S01-S03)

| # | 파일 | 제목 | 핵심 내용 |
|---|------|------|----------|
| S01 | s01-cover.html | GEODE v0.32.1 Cover | while(tool_use) { observe→learn→act }. 187 모듈, 3,216 테스트, 46 Hook, 52 Tools, 36일 |
| S02 | s02-harness-4axis.html | Harness Engineering 4-Axis | 축1 Context(PromptAssembler 6-Phase, 90% 절감), 축2 Execution(50R, 5 exit), 축3 Verification(5-Layer, 99.8%), 축4 Observability(46 Hook, TokenTracker) |
| S03 | s03-triple-loop.html | Triple Loop Architecture | META(Scaffold 21 Skills + CANNOT 23) → DEV(8-Step + CI 5-Job) → RUNTIME(52 Tools + while(tool_use)) |

### Scaffold (S04-S08)

| # | 파일 | 제목 | 핵심 내용 |
|---|------|------|----------|
| S04 | s04-mirror-table.html | Harness Builds Harness | SCAFFOLD(CLAUDE.md 425줄, 17 CANNOT, 21 Skills, CI 5-Job) ↔ GEODE Runtime(GEODE.md 71줄, 4 CANNOT, 5-Layer, PolicyChain). 40 Hook 연결 |
| S05 | s05-cannot-can.html | CANNOT 23-Rule | 5카테고리: 타이포(5pt 미만), 레이아웃(카드 6초과), html2pptx(gradient), 다이어그램(박스형), 내러티브(키워드 나열) |
| S06 | s06-8step-loop.html | 8-Step Development Loop | Step 1(이해) ~ Step 8(배포). Socratic Gate(Q1-Q5) |
| S07 | s07-frontier-persona.html | Frontier Mining + 5-Persona | 4소스(autoresearch, OpenClaw, Claude Code, Codex CLI). 5 Persona(Beck/설계, Karpathy/제약, Steinberger/운영, Cherny/격리, GAP Detective/누락·괴리) |
| S08 | s08-velocity.html | Velocity and Iteration | 36일간 40 릴리스. 반복 속도 메트릭 |

### Architecture + Execution Deep Dive (S09-S15)

| # | 파일 | 제목 | 핵심 내용 |
|---|------|------|----------|
| S09 | s09-architecture.html | 6-Layer Architecture | L0 CLI+Agent(34), L1 Infra+Gateway(29), L2 Memory(14), L3 Orchestration(14), L4 Tools+MCP(31), L5 Domain(14). DomainPort Protocol 12 methods |
| S10 | s10-agentic-loop.html | AgenticLoop while(tool_use) | Max 50R, 200-turn window, 5 exit paths. 평균 4.2R. Autonomous Safety 3조건(budget_stop, convergence 3회, tool_repeat 5회) |
| S11 | s11-tool-dispatch.html | Tool Dispatch 4-Route | ToolExecutor → Bash/Native/MCP/LangGraph. 5-Tier Safety(T0 SAFE ~ T4 DANGEROUS). PolicyChain 6-Layer |
| S12 | s12-hook-system.html | Hook System 46 Events | 8카테고리 46이벤트. 리플 패턴: PIPELINE_END → RunLog(P50) → Snapshot(P80) → MemoryWriteback(P85). 4-Tier Maturity(L1 Observe ~ L4 Autonomy) |
| S13 | s13-subagent.html | Sub-Agent 이중 주입 제거 | **v0.32.1 신규**. tool_result + announce 이중 주입 문제. OpenClaw 참조 동기/비동기 분리. delegate(announce=False). 2파일 4줄 |
| S14 | s14-llm-failover.html | LLM Failover 3-Provider | Anthropic(Opus/Sonnet/Haiku) → OpenAI(GPT-5.4/5.3/4o) → ZhipuAI(GLM-5 80K). CircuitBreaker 상태머신 |
| S15 | s15-context-memory.html | Context + Memory 압축 + 4-Tier | 3-Phase 압축(80% SUMMARIZE, 95% PRUNE, EMERGENCY). 4-Tier Memory(T0 SOUL 10%, T1 Org 25%, T2 Project 25%, T3 Session 40%). Auto-learning P85 |

### Assembly (S16-S17)

| # | 파일 | 제목 | 핵심 내용 |
|---|------|------|----------|
| S16 | s16-prompt-assembler.html | PromptAssembler 6-Phase | P1 template → P2 override → P3 skill(21) → P4 memory(4-Tier) → P5 bootstrap → P6 assemble. SHA-256 cache, 90% 절감 |
| S17 | s17-mcp-cost.html | MCP + Cost 관측 | 3계층→2계층 단순화(MCPRegistry 삭제). 45 catalog. TokenTracker /cost CLI |

### Domain (S18-S19)

| # | 파일 | 제목 | 핵심 내용 |
|---|------|------|----------|
| S18 | s18-game-ip.html | Game IP Pipeline | 9-Node DAG + 5-Layer 검증. PSM 6-Weight Scoring. Tier S≥80, A≥60, B≥40, C<40. Clean Context(analyses:[]) 앵커링 차단 |
| S19 | s19-domain-portability.html | Domain Portability | GEODE(Game IP) ↔ REODE(Java Migration). DomainPort Protocol 2-Protocol 직교. core 수정 0줄 |

### Safety (S20)

| # | 파일 | 제목 | 핵심 내용 |
|---|------|------|----------|
| S20 | s20-security-gateway.html | Security + Gateway | Bash 3-Layer(9패턴 + 자원 한도 + HITL 4-Tier). Secret Redaction 8패턴. Gateway ChannelBinding + Session Key. PolicyChain AND-Logic. Dual Trust Model |

### Closing (S21-S25)

| # | 파일 | 제목 | 핵심 내용 |
|---|------|------|----------|
| S21 | s21-constraints-results.html | 제약과 결과 | 36일 제약 속 정량 결과 |
| S22a | s22a-tradeoffs.html | 설계 결정: Pipeline/Security | Pipeline 4결정 + Security 4결정. 채택 vs 대안 |
| S22b | s22b-tradeoffs.html | 설계 결정: Gateway/Infra | Gateway 4결정 + Infra 4결정. REODE 증명(core 0줄) |
| S23 | s23-summary.html | 종합 요약 | 핵심 통찰 정리 |
| S24 | s24-closing.html | 클로징 | 향후 로드맵 |
| S25 | s25-timeline.html | Timeline | Phase 1(Task Qualification) → Phase 2(Autonomous Pivot) → Phase 3(Harness Completion) → Fork(REODE Proof) |

## v9(36) → v10(26) 구조 변경 요약

| 변경 | 상세 |
|------|------|
| **삭제** | s07(Long-Running Safety), s08(Plan Compaction), s20(ECO²), s26(Changelog), s32(Harness Discipline) |
| **병합** | s14+s15→S15(Context+Memory), s24+s24b→S07(Frontier+Persona), s27+s09→S20(Security+Gateway) |
| **분할** | s28→S22a+S22b(Tradeoffs 2슬라이드) |
| **이동** | Timeline: s02→S25(맨 뒤). Scaffold: Part 2→Opening 직후 |
| **신규** | S13 이중 주입 제거(v0.32.1) |
| **Divider 제거** | s09b, s20b |

## Appendix (32 Boxes)

Box 1-18: 기존 (v9). 슬라이드 번호 재매핑 필요.
Box 19-23: v9 삭제 슬라이드 보존.
Box 24-28: Next.js 전용 섹션(Reasoning, Automation, Feedback, Scoring, Verification).
Box 29-32: v13-v56 미반영 콘텐츠(CUSUM, BiasBuster, Hook Matrix, ConfigWatcher).
