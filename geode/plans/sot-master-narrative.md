# Master Narrative SOT v0.35.1

최상위 서술 기준. 각 슬라이드는 이 내러티브의 인과관계를 시각화한다.

## N1. AgenticLoop: while(tool_use)

LLM이 tool_use를 반환하는 한 루프를 계속한다.
v0.35.0부터 **time_budget_s**가 유일한 실행 제약이며, max_rounds는 deprecated fallback이다.
자연 종료(end_turn), 수렴 감지(동일 에러 3회), 강제 텍스트(잔여 2라운드),
budget_stop(비용 상한), tool_repeat(5회 반복 감지)까지 5가지 경로로 종료한다.

→ S10 agentic-loop

## N2. 4-Route Tool Dispatch

단일 진입점 ToolExecutor가 4경로로 분기한다.
Bash(PolicyChain 3-layer 방어), Native(**47** tools registry),
MCP(**44** catalog auto-discovery), LangGraph(analyze_ip StateGraph).
5-Tier Safety: T0 SAFE(asyncio.gather 자동 실행) ~ T4 DANGEROUS(패턴 검사 + HITL).

→ S11 tool-dispatch

## N3. Sub-Agent: Subprocess Isolation + 이중 주입 제거

부모 AgenticLoop(200K context)에서 서브에이전트를 스폰하면 결과가 누적되어 컨텍스트가 폭발한다.
독립 200K window + 부모 능력 상속(47 tools, 44 MCP, skills, memory).
MAX_CONCURRENT=5, CoalescingQueue 250ms, **depth limit=1** (재귀 금지).

**v0.34.0**: WorkerRequest/WorkerResult JSON 프로토콜로 subprocess isolation. SIGKILL crash isolation.
**v0.32.1**: 이중 주입 제거. delegate(announce=False).
**v0.35.1**: SubAgent zombie cleanup, announce race fix, env whitelist(10개 안전 변수만).

→ S13 subagent

## N4. 5-Layer Verification (Pipeline)

분석 결과의 품질을 5겹으로 검증한다.
L1 Guardrails(G1 Schema, G2 Range, G3 Grounding, G4 Consistency, Haiku gate).
L2 Confidence Gate(≥0.7, max 5 iterations, cortex loopback).
L3 Rights Risk(CLEAR/RESTRICTED).
L4 BiasBuster(6종 인지 편향).
L5 Cross-LLM(다중 모델 합의 α≥0.67, Krippendorff α≥0.80).
L6 Calibration(Golden Set, per-axis ±0.5).

→ S20 security-gateway (Dual Trust Model의 Output 축)

## N5. 3-Provider LLM Resilience

Anthropic(Opus, Sonnet, Haiku) Primary → OpenAI(GPT-5.4, 5.2, 4.1) Secondary → ZhipuAI(GLM-5) Last Resort.
CircuitBreaker 상태머신: CLOSED(정상) → OPEN(5 fails, 60s 차단) → HALF-OPEN(probe) → CLOSED.

→ S14 llm-failover

## N6. Context Compression + 4-Tier Memory

3-Phase 압축: Phase 1(80%), Phase 2(95%), Phase 3(EMERGENCY).
4-Tier Memory: T0 SOUL(10%), T1 Organization(25%), T2 Project(25%), T3 Session(40%).
Auto-learning: TURN_COMPLETE → P85 memory_write_back → PROJECT.md 자동 기록.
Provider-aware Compaction: Anthropic(서버사이드) vs OpenAI/GLM(클라이언트사이드).

→ S15 context-memory

## N7. Hook System 40 Events

v0.35.1에서 6개 orphan event를 정리하여 **40 events**로 확정.
Pipeline(3), Node(4), Analysis(3), Verification(2), Automation(6), Memory(4), Prompt(2),
SubAgent(3), ToolRecovery(3), Gateway(2), Turn(1), Context(3), Session(2), Model(1), LLM(2).
리플 패턴: PIPELINE_END 발화 → RunLog(P50) → Snapshot(P80) → MemoryWriteback(P85).

→ S12 hook-system

## N8. PromptAssembler 6-Phase

P1 template → P2 override → P3 skill(**25**개) → P4 memory(4-Tier) → P5 bootstrap → P6 assemble.
SHA-256 해시가 동일하면 재조립 스킵, cache_control ephemeral로 90% 절감.

→ S16 prompt-assembler

## N9. MCP Ecosystem + Cost Tracking

2계층(Catalog + config.toml). **44** catalog servers. 8 DEFAULT + 22 AUTO_DISCOVER.
TokenTracker /cost CLI. 18-model price registry.

→ S17 mcp-cost

## N10. Game IP Pipeline + Domain Portability

9-Node DAG + 5-Layer 검증. PSM 6-Weight Scoring.
Clean Context: analyses:[] 앵커링 차단. Confidence Gate ≥0.7.
DomainPort Protocol: GEODE(Game IP) → REODE(Java Migration) core 수정 0줄.

→ S18 game-ip, S19 domain-portability

## N11. Agentic Safety (Input Gating)

Bash 3-Layer + Secret Redaction 8 patterns + PolicyChain AND-Logic.
Gateway: ChannelBinding + session key + geode serve(hitl_level=0).
Dual Trust Model: Input Gating(N11) + Output Validation(N4).

→ S20 security-gateway

## N12. 4-Axis Harness Engineering

4축: Context(90% 절감), Execution(time_budget_s), Verification(99.8%), Observability(**40** Hook).
순환: Context → Loop → Observability → Verification → Context.

→ S02 harness-4axis

## N13. Triple Loop + Scaffold

META: CLAUDE.md, **25** Skills, CANNOT 23-Rule.
DEV: 8-Step + CI 5-Job + **3,344** Tests + Socratic Gate.
RUNTIME: **47** Tools + while(tool_use) + Safety Brake.
**40** Hook이 세 루프를 횡단하는 신경계 역할.

→ S03 triple-loop, S04 mirror-table

## N14. SharedServices Gateway (v0.35.0 신규)

REPL, serve(데몬), scheduler 세 진입점이 동일한 AgenticLoop를 사용하지만 부트스트랩 경로가 달랐다.
**SessionMode(REPL/DAEMON/SCHEDULER/FORK)** 단일 팩토리로 통합.
ContextVar 마이그레이션으로 thread-safe 보장. time_budget_s가 유일한 실행 제약.

5 GAP 식별 및 해결(v0.35.1):
- HookSystem 미연결 → 전 모드 wiring
- 모듈 전역변수 thread-safety → threading.Lock
- ContextVar 미전파 → propagate_to_thread()
- readiness 경합 → atomic CAS
- result_cache 충돌 → 통합 eviction

→ 신규 슬라이드 후보 (Entry Point Architecture)

## N15. Skill 2.0 (v0.33.0 신규)

Progressive Disclosure 3-tier: metadata → body → resources(lazy loading).
Multi-scope discovery: project → user → scaffold → bundled.
context:fork 서브에이전트 격리 실행. $ARGUMENTS 치환. user_invocable flag.
**25** skills (9개 runtime: deep-researcher, daily-briefing, job-hunter 등).

→ 신규 슬라이드 또는 Appendix Box 후보

## N16. Subprocess Isolation (v0.34.0 신규)

WorkerRequest/WorkerResult JSON 프로토콜. `python -m core.agent.worker`로 스폰.
IsolatedRunner가 callable(thread)과 WorkerRequest(subprocess) 자동 라우팅.
SIGKILL timeout + crash isolation. max_depth 2→**1** (재귀 금지).

→ S13 subagent 업데이트 또는 Appendix Box

## N17. System Hardening (v0.35.1 신규)

20개 설계 결함 수정. 4-system audit(REPL, serve, scheduler, sub-agent).
C-series(동시성 4건), H-series(SubAgent 안전 8건), M-series(모델 1건).
**6개 orphan hook event 제거** (46→40).

→ Appendix Box 후보
