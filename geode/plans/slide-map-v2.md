# Slide Map v2 — Narrative-Driven

Master Narrative(N1-N11) → 슬라이드 매핑. 각 슬라이드는 하나의 내러티브를 시각화.

## Part 0: OPENING (3)
| # | 제목 | Narrative | 시각화 방법 |
|---|------|-----------|------------|
| 01 | Cover | — | 숫자 카드 + while(tool_use) tagline |
| 02 | Triple Loop | 전체 구조 | META→DEV→RUNTIME 3루프 + Hook 연결 |
| 03 | Mirror Table | Scaffold ↔ Runtime | 좌우 대칭 테이블 + while(tool_use) 중심축 |

## Part 1: HE-0 SCAFFOLDING (4)
| # | 제목 | Narrative | 시각화 방법 |
|---|------|-----------|------------|
| 04 | CANNOT/CAN | Scaffold 제약 | CANNOT 17규칙 (Red) vs CAN 자유 (Green) + STAR Result |
| 05 | 8-Step Loop | Dev Loop 상세 | 8단계 파이프라인 + Socratic 5Q + 재귀 화살표 |
| 06 | Frontier + Persona | 패턴 소싱 | 4소스 카드 + 3/4 수렴 규칙 + 4페르소나 + 보안 사례 |
| 07 | Velocity | 복리 가속 | Phase 0-5 바 차트 + Phase 3 스토리 패널 |

## Part 2: HE-1 AUTONOMOUS (9)
| # | 제목 | Narrative | 시각화 방법 |
|---|------|-----------|------------|
| 08 | Architecture | 6-Layer + Hook | **v028 PNG** (3-Tier) + 레이어별 모듈 수 사이드바 |
| 09 | AgenticLoop | **N1** while(tool_use) | **v028 PNG** (Loop) + 5종료경로 + 200-turn window |
| 10 | Tool Dispatch | **N2** 4계층 디스패치 | **v028 PNG 또는 신규 DAG**: ToolExecutor 단일진입→4분기 + 5-Tier 매트릭스 |
| 11 | Hook System | **N7** Hook 개편 | 8카테고리 이벤트맵 + Priority 핸들러 체인 + StuckDetector |
| 12 | Sub-Agent | **N3** 컨텍스트 폭발 방지 | 부모-자식 토큰 흐름 + 4096 guard + DAG scheduling |
| 13 | LLM Failover | **N5** 3-Provider 복원력 | 3-Provider 체인 + CircuitBreaker 상태머신 |
| 14 | Context + Memory | **N6+N9** 압축 + 4-Tier | 에스컬레이션/디에스컬레이션 + 4계층 피라미드 + 자동학습 |
| 15 | PromptAssembler | **N8** 6-Phase 조립 | 6단계 파이프라인 + SHA-256 + 캐시 절감률 |
| 16 | MCP + Tools | **N10+N11** 생태계 + 비용 | 3→2계층 단순화 + TokenTracker + 비용 대시보드 |

## Part 3: HE-2 DOMAIN (2)
| # | 제목 | Narrative | 시각화 방법 |
|---|------|-----------|------------|
| 17 | Game IP Pipeline | **N4** 5-Layer 검증 포함 | **v028 PNG** (Pipeline DAG) + 실행 결과 + 검증 스택 |
| 18 | Domain Portability | DomainPort + REODE | GEODE vs REODE 대칭 + DomainPort Protocol 중심 |

## Part 4: HE-1.5 SAFETY (2)
| # | 제목 | Narrative | 시각화 방법 |
|---|------|-----------|------------|
| 19 | Security | Bash + PolicyChain | **v028 PNG** (PolicyChain) + Bash 3-Layer + Redaction |
| 20 | Gateway + Serve | Headless daemon | ChannelBinding 라우팅 + Serve vs REPL 대비 |

## Part 5: CONNECTION (4)
| # | 제목 | Narrative | 시각화 방법 |
|---|------|-----------|------------|
| 21 | Constraints→Results | CANNOT→Result 6쌍 | Red→Green 화살표 매핑 |
| 22 | Trade-offs | 21건 설계 판단 | 3컬럼 (Arch/Agent/LLM) |
| 23 | Summary | 숫자 총정리 | 대형 숫자 그리드 + 테크 스택 |
| 24 | Closing | 가치 제안 | Triple Loop 미니 + 3가지 역량 |

## 변경점 vs v1
- S10: Tool+MCP+Skill 통합 → **Tool Dispatch 전용** (N2, 신규 핵심 슬라이드)
- S13: Compression → **LLM Failover** (N5, 독립 슬라이드로 승격)
- S14: Sub-Agent 유지 (N3 강화)
- S15: Tools → **PromptAssembler** (N8, 신규)
- S16: Gateway → **MCP+Tools+Cost** (N10+N11 통합)
- S17-S18: Domain 2장 유지
- S19-S20: Security+Gateway (위치 이동)
- Hook System: N7 기반 대폭 강화, 45→실측 반영
