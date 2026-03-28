# V3 Slide Map — Long-Running Autonomous Harness 어필 전환

## V2→V3 핵심 변경
1. **어필 포인트 전환**: "도메인 분석 에이전트" → **"장기 자율 실행 하네스"**
2. **Unreleased 반영**: Autonomous Safety 3조건, Plan-first, Provider-aware compaction
3. **HE-1 DEEP DIVE 순서 정리**: 실행흐름 순서대로 재배치
4. **Long-Running 전용 슬라이드 추가**

## 구조 (33장)

### Part 0: HOOK — 왜 이것을 만들었나 (4)
| # | 제목 |
|---|------|
| 01 | Cover + 류지환 Harness Engineer |
| 02 | Timeline: 과제→탈락→피봇→하네스→REODE |
| 03 | Thesis: "확률적 시스템은 제어 없이 발산한다" + Harness 4-Axis |
| 04 | Triple Loop: META→DEV→RUNTIME + Hook 신경계 |

### Part 1: WHAT — 장기 자율 실행이란 (5)
| # | 제목 |
|---|------|
| 05 | Architecture 6-Layer + Hook cross-cutting |
| 06 | AgenticLoop: while(tool_use) 50 rounds × 200 turns |
| 07 | ★ Long-Running Safety: 비용 상한 + 수렴 감지 + 다양성 강제 (NEW) |
| 08 | ★ Plan-first + Provider-aware Compaction (NEW) |
| 09 | Scheduler + Cron 세션 격리 + Gateway Serve (NEW combined) |

### Part 2: HOW — 실행 흐름 순서대로 (8, HE-1 DEEP DIVE 정렬)
| # | 제목 | 실행 순서 |
|---|------|---------|
| 10 | Tool Dispatch: 4-Route 분기 + 5-Tier Safety | LLM → Tool 선택 |
| 11 | Hook System: 46-Event 리플 패턴 | Tool 실행 중 이벤트 발화 |
| 12 | Sub-Agent: 병렬 위임 + 4096 guard | Tool이 Sub-Agent spawn |
| 13 | LLM Failover: 3-Provider CircuitBreaker | LLM 호출 실패 시 |
| 14 | Context Compression: 3-Phase + Lossless Selection | 컨텍스트 초과 시 |
| 15 | 4-Tier Memory + Auto-Learning | 턴 종료 시 학습 |
| 16 | PromptAssembler 6-Phase | 다음 턴 준비 |
| 17 | MCP Ecosystem + Cost Tracking | 외부 도구 + 비용 관측 |

### Part 3: DOMAIN — 무엇을 분석하는가 (3)
| # | 제목 |
|---|------|
| 18 | Game IP Pipeline + 5-Layer Verification |
| 19 | Domain Portability: GEODE↔REODE |
| 20 | Eco2→GEODE→REODE 패턴 진화 |

### Part 4: SCAFFOLD — 어떻게 만들었나 (6)
| # | 제목 |
|---|------|
| 21 | Mirror Table: Scaffold ↔ Runtime |
| 22 | CANNOT/CAN 23 rules |
| 23 | 8-Step Loop + Socratic Gate |
| 24 | Frontier Mining + 4-Persona Review |
| 25 | Compound Velocity (Phase 0-5) |
| 26 | CHANGELOG Evolution: v0.6→v0.31 아키텍처 결정 |

### Part 5: SAFETY + CONNECTION (5)
| # | 제목 |
|---|------|
| 27 | Security: Bash 3-Layer + PolicyChain + Dual Trust |
| 28 | Trade-offs (Architecture) |
| 29 | Trade-offs (Agent + Infra) |
| 30 | Constraints → Results |

### Part 6: CLOSING (3)
| # | 제목 |
|---|------|
| 31 | Summary: 숫자 총정리 |
| 32 | Harness Engineering = Discipline |
| 33 | Closing + Contact |
