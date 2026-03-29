# Master Narrative SOT v0.32.1

최상위 서술 기준. 각 슬라이드는 이 내러티브의 인과관계를 시각화한다.

## N1. AgenticLoop: while(tool_use)

LLM이 tool_use를 반환하는 한 최대 50 라운드까지 루프를 계속한다.
자연 종료(end_turn), 수렴 감지(동일 에러 3회), 강제 텍스트(잔여 2라운드),
budget_stop(비용 상한), tool_repeat(5회 반복 감지)까지 5가지 경로로 종료한다.
200-turn sliding window로 컨텍스트를 관리하고, 실측 평균 4.2 라운드.

**v0.32.0 추가**: Autonomous Safety 3조건. budget_stop(TokenTracker), convergence 3회(모델 에스컬레이션), tool_repeat 5회(hint 자동 주입).

→ S10 agentic-loop

## N2. 4-Route Tool Dispatch

단일 진입점 ToolExecutor가 4경로로 분기한다.
Bash(PolicyChain 3-layer 방어), Native(52 tools registry),
MCP(45 catalog auto-discovery), LangGraph(analyze_ip 13-task StateGraph).
5-Tier Safety: T0 SAFE(asyncio.gather 자동 실행) ~ T4 DANGEROUS(패턴 검사 + HITL).

→ S11 tool-dispatch

## N3. Sub-Agent 컨텍스트 폭발 방지

부모 AgenticLoop(200K context)에서 서브에이전트를 스폰하면 결과가 누적되어 컨텍스트가 폭발한다.
독립 200K window + 부모 능력 상속(52 tools, 44 MCP, skills, memory) + 위험 도구 6개 샌드박스 차단.
MAX_CONCURRENT=5, CoalescingQueue 250ms, depth limit=2.

**v0.32.1 추가**: 이중 주입(Double Injection) 제거. delegate_task(동기)에서 tool_result + announce가 같은 정보를 2회 주입하는 문제를 OpenClaw 패턴 참조로 해결. delegate(announce=False)로 동기 호출 시만 announce 비활성화. 비동기 경로는 기본값 True 유지. 2파일 4줄 변경.

→ S13 subagent

## N4. 5-Layer Verification (Pipeline)

분석 결과의 품질을 5겹으로 검증한다.
L1 Guardrails(G1 Schema, G2 Range, G3 Grounding, G4 Consistency, Haiku gate).
L2 Confidence Gate(≥0.7, max 5 iterations, cortex loopback).
L3 Rights Risk(CLEAR/RESTRICTED).
L4 BiasBuster(6종 인지 편향: confirmation, recency, anchoring, position, verbosity, self_enhancement).
L5 Cross-LLM(다중 모델 합의 α≥0.67, Krippendorff α≥0.80).
L6 Calibration(Golden Set, per-axis ±0.5).

→ S20 security-gateway (Dual Trust Model의 Output 축)

## N5. 3-Provider LLM Resilience

Anthropic(Opus, Sonnet, Haiku) Primary → OpenAI(GPT-5.4, 5.3, 4o) Secondary → ZhipuAI(GLM-5 80K) Last Resort.
CircuitBreaker 상태머신: CLOSED(정상) → OPEN(5 fails, 60s 차단) → HALF-OPEN(probe) → CLOSED.
세션 메모리가 모델에 종속되지 않으므로 Failover 시에도 학습 내용 유지.

→ S14 llm-failover

## N6. Context Compression + 4-Tier Memory

장기 세션에서 컨텍스트 80% 도달은 시간 문제. 3-Phase로 대응한다.
Phase 1(80% WARNING): tool_result >5% 블록 요약.
Phase 2(95% CRITICAL): recent-first 70% budget 유지, 첫+마지막 2개 보존.
Phase 3(EMERGENCY): 강제 pruning, bridge 메시지 삽입.

4-Tier Memory: T0 SOUL(GEODE.md, 10%), T1 Organization(CLAUDE.md, 25%), T2 Project(PROJECT.md 자동 축적, 25%), T3 Session(TTL 200 turns, 40%).
Auto-learning: TURN_COMPLETE → P85 memory_write_back → PROJECT.md 자동 기록.

**v0.32.0 추가**: Provider-aware Compaction. Anthropic(서버사이드 compact_20260112) vs OpenAI/GLM(클라이언트사이드 LLM 요약). 프로바이더별 캐시 규칙이 달라서 단일 전략은 캐시 히트율을 붕괴시킨다.

→ S15 context-memory

## N7. Hook System 46 Events

8카테고리 46이벤트가 모든 계층을 횡단한다.
Pipeline, Node, Analysis, Automation, Memory, SubAgent, Context, Tool Recovery, Gateway.
리플 패턴: PIPELINE_END 발화 → RunLog(P50) → Snapshot(P80) → MemoryWriteback(P85) 순차 실행.
17 registered handlers, Priority P30-P90.
4-Tier Maturity: L1 Observe(runs.jsonl, 46/46), L2 React(자동 대응, 28/46), L3 Decide(의사결정, 1/46), L4 Autonomy(자율 학습, 0/46).

→ S12 hook-system

## N8. PromptAssembler 6-Phase

P1 template → P2 override → P3 skill(21개) → P4 memory(4-Tier) → P5 bootstrap → P6 assemble.
SHA-256 해시가 동일하면 재조립 스킵, cache_control ephemeral로 2회차부터 입력 비용 90% 절감.

→ S16 prompt-assembler

## N9. MCP Ecosystem + Cost Tracking

3계층(MCPRegistry 257줄 병목) → 2계층(Catalog 검색 + config.toml)으로 단순화. Proxy stub 9개 제거.
45 catalog servers auto-discovery. 도구 추가 비용 대폭 감소.
자체 TokenTracker로 /cost CLI 실시간 관측. 18-model price registry. budget 초과 시 자동 정지.

→ S17 mcp-cost

## N10. Game IP Pipeline + Domain Portability

9-Node DAG(Scraper → Analyzer → Scorer parallel) + 5-Layer 검증.
PSM 6-Weight Scoring: Exposure 25%, Quality 20%, Momentum 20%, Recovery 18%, Growth 12%, Developer 5%.
Clean Context: analyses:[] 전달로 앵커링 차단. Confidence Gate ≥0.7 loopback.

DomainPort Protocol: 2-Protocol 직교(PipelineTemplate L1 + LanguageAdapter L2).
GEODE(Game IP) → REODE(Java 8→22, Spring 4.3→6.1, 241 source, 103K LoC) 피봇 시 core 수정 0줄.

→ S18 game-ip, S19 domain-portability

## N11. Agentic Safety (Input Gating)

Bash 3-Layer: 9 blocking patterns + 자원 한도(CPU 30s, FSIZE 50MB, NPROC 64) + HITL 4-Tier.
Secret Redaction 8 patterns(sk-ant, sk-proj, ghp_, gho_, xoxb, xoxp).
PolicyChain AND-Logic: 모든 정책이 통과해야 실행. Org policy(priority=5) 최상위.
Gateway: ChannelBinding(Slack/Discord/Telegram), session key format, geode serve(hitl_level=0).

Dual Trust Model: Input Gating(N11) + Output Validation(N4)가 독립적으로 동작.

→ S20 security-gateway

## N12. 4-Axis Harness Engineering (v0.32.0 신규)

확률적 시스템(LLM)은 제어 없이 발산한다. 4축으로 수렴시킨다.
축1 Context Control(PromptAssembler, SHA-256, 90% 절감).
축2 Execution Loop(while(tool_use), 3-Brake Safety, 50R).
축3 Verification(5-Layer, 69.4→99.8%).
축4 Observability(46 Hook, TokenTracker, 18-model price).
순환: Context → Loop → Observability → Verification → Context.

→ S02 harness-4axis

## N13. Triple Loop + Scaffold (v0.32.0 신규)

META(Scaffold 진화): CLAUDE.md 425줄, 21 Skills, CANNOT 23-Rule.
DEV(PR 단위): 8-Step + CI 5-Job + 3,216 Tests + Socratic Gate.
RUNTIME(자동 실행): 52 Tools + while(tool_use) 50R + Safety Brake.
46 Hook이 세 루프를 횡단하는 신경계 역할.

→ S03 triple-loop, S04 mirror-table

## N14. Plan-first (v0.32.0 신규)

복잡도 판별(3+ steps) → create_plan 자발 호출 → plan_id → HITL 승인 게이트.
잘못된 방향으로 50R을 소모하기 전에 사람이 개입.
plan_id로 수정, 재승인 가능. 거부 시 CREATE로 루프백.

→ Appendix Box 20 (S10/S15 삽입 후보)

## N15. Automation + Feedback (v0.32.0 신규)

3종 스케줄(AT/EVERY/CRON) + 4종 트리거(MANUAL/SCHEDULED/EVENT/WEBHOOK).
CUSUM Drift Detection: NONE(<2.5), WARNING(2.5-4.0), CRITICAL(≥4.0).
DRIFT_DETECTED → P70 DriftTrigger → 자동 재분석.
5-Phase Self-Improvement: Collection → Analysis → Improvement → Validation → RLAIF.

→ Appendix Box 25(Automation), Box 26(Feedback), Box 29(CUSUM)
