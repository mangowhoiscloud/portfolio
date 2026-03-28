# SOT: Resume Narratives for PPTX Integration

> Source: http://localhost:8767/resumes/common/index.html
> 이력서에 있지만 PPTX에 빠진 핵심 내러티브

## Opening Thesis
"확률적 시스템(LLM)은 제어 없이 발산합니다. 발산을 루프와 가치로 수렴시키는 하네스를 만듭니다."

## Harness Engineering 4-Axis Framework
| 축 | 역할 | 실천 |
|---|------|------|
| 컨텍스트 제어 | 정보 주입 설계 | PromptAssembler 6-Phase, SHA-256 prompt caching (90% 비용 절감) |
| 실행 루프 | 오케스트레이션 | AgenticLoop while(tool_use), 54 tools × 50 rounds 자율 실행 |
| 검증 | 비결정론 → 신뢰 | Swiss Cheese 3-Layer (69.4→99.8), GEODE 5-Layer + Cross-LLM |
| 관측 | 작동 증명 | 36-Event Hook Observer, LangSmith/OTEL, CUSUM 드리프트 |

## REODE 실증 수치 (PPTX에 보강 필요)
- GEODE v0.13.0 기반 REODE 코딩 에이전트 제품화
- 결정론/확률론 분리: OpenRewrite(70% 기계적) + LLM(30% 비즈니스 로직)
- 5-Gate Migration Scorecard: 테스트 삭제, skipTests, JDK 다운그레이드, @SuppressWarnings 주입 차단
- 프로토콜 재설계: DomainPort → 2-Protocol 직교 (PipelineTemplate L1 + LanguageAdapter L2)
- macOS Seatbelt 샌드박스 (34-패턴 deny-list, 3-Level Permission)
- **실증**: 241 소스, 103K LoC → 33 세션 / 1,133 LLM 라운드 / 5h 48m → **83/83 mvn compile+test 패스**

## Eco² Cross-Reference (패턴 재사용 증거)
- Swiss Cheese LLM Evaluation → GEODE 5-Layer Verification으로 진화
- LLMClientPort 추상화 → GEODE Port/Adapter DI
- Event Bus 3-Tier → GEODE HookSystem 영감
- Circuit Breaker + Jitter Backoff → GEODE 3-Provider Failover에 동일 패턴

## harness-for-real 해커톤 전략
"키보드에 손이 닿는 순간 하네스의 실패다"
- Socratic Phase 요구사항 정제
- typecheck+lint backpressure hooks
- 70% 테스트 비율
- LEARNINGS.md 패턴 축적
- 토큰 예산 하드 스톱 (80%/100%)

## Key Metrics (이력서 기준)
- 221 모듈 · 3,181 테스트 · 32 릴리스 무회귀
- 54 Tools + 44 MCP · 25 Skills · 36 Event Hooks
- Coverage 80%, mypy strict
