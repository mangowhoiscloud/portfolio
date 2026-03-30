# Slide Map v10 — GEODE v0.38.0 (29 Slides)

## 구조 개요

| Part | 슬라이드 | 주제 | Accent |
|------|---------|------|--------|
| **Opening** | S01-S03 | Cover, 4-Axis, Triple Loop | Mixed |
| **Scaffold** | S04-S08 | Mirror, CANNOT, 8-Step, Frontier, Velocity | #818CF8 Indigo |
| **Architecture** | S09-S15 | 4-Layer, Thin-only Daemon, IPC Events, Loop, Dispatch, Hooks, SubAgent+SessionLane | #4ECDC4 Cyan |
| **Intelligence** | S16-S18 | LLM Failover, Context+Memory 5-Tier, PromptAssembler | #4ECDC4 Cyan |
| **Ecosystem** | S19-S20 | MCP+Cost, Game IP | #F5C542 Amber |
| **Domain+Safety** | S21-S22 | Domain Portability, Security+Gateway | Mixed |
| **Evolution** | S23-S24 | "이거 필요해?" Simple Design, Gateway 3-Phase+Sync Loop | #34D399 Emerald |
| **Closing** | S25-S29 | Verification 5-Layer, Tradeoffs(2), Summary, Timeline | Mixed |

## 슬라이드 상세

| # | 파일 | 제목 | v10 작업 |
|---|------|------|---------|
| S01 | s01-cover.html | GEODE v0.38.0 Cover | REWRITE |
| S02 | s02-harness-4axis.html | 4-Axis Framework | MINOR |
| S03 | s03-triple-loop.html | Triple Loop | MINOR |
| S04 | s04-mirror-table.html | Harness Builds Harness | AS-IS |
| S05 | s05-cannot-can.html | CANNOT 23-Rule | AS-IS |
| S06 | s06-8step-loop.html | 8-Step Loop | AS-IS |
| S07 | s07-frontier-persona.html | Frontier + 5-Persona | AS-IS |
| S08 | s08-velocity.html | Compound Velocity | MINOR |
| S09 | s09-architecture.html | 4-Layer Architecture | FULL REWRITE |
| S10 | s10-thin-daemon.html | Thin-only + Unified Daemon | NEW |
| S11 | s11-ipc-events.html | IPC Event Protocol (30 Events) | NEW |
| S12 | s12-agentic-loop.html | AgenticLoop while(tool_use) | MINOR |
| S13 | s13-tool-dispatch.html | Tool Dispatch 4-Route | MINOR |
| S14 | s14-hook-system.html | Hook System 42 Events | MINOR |
| S15 | s15-subagent.html | Sub-Agent: SessionLane | REWRITE |
| S16 | s16-llm-failover.html | LLM Failover 3-Provider | AS-IS |
| S17 | s17-context-memory.html | Context + Memory: 5-Tier | REWRITE |
| S18 | s18-prompt-assembler.html | PromptAssembler 6-Phase | MINOR |
| S19 | s19-mcp-cost.html | MCP + TokenTracker | AS-IS |
| S20 | s20-game-ip.html | Game IP Pipeline | AS-IS |
| S21 | s21-domain-portability.html | Domain Portability | MINOR |
| S22 | s22-security-gateway.html | Security + Gateway | MINOR |
| S23 | s23-simple-design.html | "이거 필요해?" Kent Beck | NEW |
| S24 | s24-gateway-evolution.html | Gateway 3-Phase + Sync Loop | NEW |
| S25 | s25-verification-5layer.html | Verification 5-Layer Swiss Cheese | NEW |
| S26 | s26-tradeoffs-arch.html | Design Decisions: Architecture | REWRITE |
| S27 | s27-tradeoffs-exec.html | Design Decisions: Execution | REWRITE |
| S28 | s28-summary.html | Summary 전체 지표 | REWRITE |
| S29 | s29-timeline.html | Timeline Phase 1-5 + REODE | REWRITE |

## SOT 수치 (v0.38.0)

| 항목 | 값 |
|------|-----|
| Version | v0.38.0 |
| Modules | 192 |
| Tests | 3,377 |
| Hook Events | 42 |
| IPC Events | 30 |
| Tools | 47 |
| MCP Catalog | 44 |
| Skills | 42 |
| Architecture | 4-Layer |
| SessionMode | 4 (REPL/IPC/DAEMON/SCHEDULER) |
| Entry Point | 1 (serve only) |
| Memory Tiers | 5 |
| Releases | 44+ |
| Regressions | 0 |
