# Master Narrative SOT — GEODE Portfolio

> 이 문서는 슬라이드 제작의 최상위 SOT. 각 주제의 인과관계 서술 원본이며,
> 슬라이드는 이 서술을 **시각화**하는 것이지 키워드를 박스에 채우는 것이 아님.

---

## N1. while(tool_use) 자율 실행 루프

Claude Code의 while(tool_use) 패턴을 참고해 AgenticLoop를 설계했습니다. LLM이 tool_use를 반환하는 한 최대 50 라운드까지 루프를 계속하고, 자연 종료(end_turn), 수렴 감지(동일 에러 4회 반복), 강제 텍스트(잔여 2라운드)까지 5가지 경로로 종료합니다. 대화 컨텍스트는 200 turns sliding window로 관리하며, 30개 메시지 초과 시 최초 사용자 메시지를 보존한 채 중간을 잘라내고 bridge 메시지를 삽입합니다. 컨텍스트 윈도우 80%에서 compact, 95%에서 emergency prune을 발동하고, LLM 연속 2회 실패 시 Provider 내 모델 체인 → Cross-Provider Fallback으로 자동 에스컬레이션합니다.

**핵심 시각화**: 루프 흐름 + 5가지 종료 경로 + 컨텍스트 관리 3단계

---

## N2. 4계층 도구 디스패치

ToolExecutor가 단일 진입점에서 모든 도구를 디스패치합니다. 웹 검색이 필요하면 Native Tool Calling, 파일 작업이 필요하면 Bash, 외부 플랫폼 서비스가 필요하면 MCP를 트리거하고, LLM이 analyze_ip을 선택하면 LangGraph StateGraph DAG가 실행됩니다. LLM이 2개 이상 tool_use 블록을 반환하면 ToolCallProcessor가 5-Tier 안전 등급(SAFE, MCP auto-approved, EXPENSIVE, WRITE, DANGEROUS)으로 분류하여 TIER 0-1은 asyncio.gather로 병렬 실행, TIER 2는 비용 일괄 승인 후 병렬, TIER 3-4는 개별 승인 후 순차 실행합니다. 도구별 연속 2회 실패 시 Error Recovery Chain이 자동 복구를 시도합니다.

**핵심 시각화**: 단일 진입점 → 4경로 분기 + 5-Tier 안전 등급 매트릭스

---

## N3. 서브에이전트 컨텍스트 폭발 방지

병렬 서브에이전트가 부모 컨텍스트에 결과를 반환할 때 토큰이 기하급수적으로 증가하는 문제가 발생했습니다. 부모의 tools/MCP/skills/memory를 전체 상속하되, 4096-token guard로 자식 출력을 구조화 요약으로 압축합니다. MAX_CONCURRENT=5 DAG scheduling과 CoalescingQueue 250ms dedup으로 동시성을 제어합니다.

**핵심 시각화**: 부모-자식 토큰 흐름 + guard 압축 + 동시성 제어

---

## N4. 단일 평가자 편향에서 5-Layer 검증으로

LLM 한 모델이 평가하면 Confirmation Bias와 Anchoring이 결과를 왜곡합니다. L1 Guardrails(스키마/범위/근거/일관성)로 형식을 잡고, L2 BiasBuster(arXiv:2403.00811)로 6종 편향을 탐지하며, L3에서 Claude×GPT 교차 검증(Krippendorff's α≥0.67)으로 합의도를 측정합니다. L4 Rights Risk와 L5 Ground Truth Calibration이 최종 신뢰도를 보정합니다.

**핵심 시각화**: 5-Layer 스택 (각 레이어가 어떤 문제를 차단하는지 명시)

---

## N5. 3-Provider LLM 장애 복원력

단일 Provider에 의존하면 Rate Limit이나 장애 시 파이프라인 전체가 중단됩니다. Anthropic(Opus→Sonnet→Haiku), OpenAI(GPT-5.4→5.3→4o), GLM-5 세 Provider를 Port/Adapter로 추상화하고, Provider별 독립 Circuit Breaker(5회 연속 실패→60s OPEN→Half-Open 프로브)를 배치했습니다. Retryable 에러(Timeout, RateLimit, Connection)는 Exponential Backoff(±25% Jitter)로 재시도하고, 비복구 에러(잔액 부족)는 즉시 차단합니다. 메모리가 모델에 종속되지 않아 Failover 시에도 세션 학습 내용이 유지됩니다.

**핵심 시각화**: 3-Provider 체인 + CircuitBreaker 상태 머신

---

## N6. Model Switching & 컨텍스트 압축

Confidence < 0.7이거나 Cross-LLM agreement가 낮으면 상위 모델로 에스컬레이션하고, 단순 작업에는 하위 모델로 디에스컬레이션하여 비용을 제어합니다. 서브에이전트는 부모와 독립된 200K 컨텍스트 윈도우를 갖기 때문에 깊이 3이면 유효 컨텍스트가 600K로 선형 확장됩니다. Lossy 요약 대신 LLM이 코드로 관련 청크만 선별하는 Lossless Selection을 적용해 정보 손실 없이 컨텍스트 비용을 0.03%로 절감했습니다.

**핵심 시각화**: 에스컬레이션/디에스컬레이션 흐름 + 깊이별 컨텍스트 선형 확장

---

## N7. Hook System 개편 (27→45 Events)

재귀 개선 루프와 자기 증강, 사용자 맞춤 개인화를 위해서는 DAG 내 노드 상태, 검증 결과, 드리프트는 물론 에이전틱 루프 계층의 MEMORY.md와 LEARNINGS.md를 증강하기 위한 실시간 추적이 필요했지만, 하드코딩된 콜백으로는 확장이 불가능했습니다. 이미 이벤트 기반 Hook 시스템을 갖추고 있었기에 Claude Code, Devin, OpenHands 등 프론티어 하네스를 리서치하고 GAP을 줄이는 방식으로 개편했습니다. 파이프라인 생명주기부터 노드 실행, 분석/검증 완료, 메모리 저장, 프롬프트 변경, 서브에이전트까지 8개 카테고리 27개 이벤트로 분류하고, Priority 기반 핸들러 실행으로 순서를 보장합니다. 핸들러 간 에러 격리를 적용했고, NODE_ENTER 후 120s 내 NODE_EXIT이 없으면 StuckDetector가 파이프라인을 중단합니다.

**핵심 시각화**: 카테고리별 이벤트 맵 + 핸들러 우선순위 체인 + StuckDetector 흐름

---

## N8. PromptAssembler 6-Phase 조립

프롬프트를 수동으로 편집하면 변경 추적이 불가능하고, 캐시 히트율이 떨어집니다. template→override→skill→memory→bootstrap 5단계로 동적 조립한 뒤 SHA-256 해시로 변경을 추적합니다. 7개 노드가 동일 시스템 프롬프트를 공유할 때 cache_control: ephemeral로 2회차부터 입력 비용이 10%로 감소합니다.

**핵심 시각화**: 6-Phase 파이프라인 + SHA-256 변경 추적 + 캐시 절감률

---

## N9. 4-Tier Memory와 자동 학습

분석 세션이 끝나면 인사이트가 휘발되는 문제를 해결하기 위해 Session(TTL) → Project(분석 이력) → Organization(불변 가이드라인) → Hybrid(Redis L1 + File L2) 4계층 메모리를 설계했습니다. PIPELINE_END 이벤트가 MEMORY.md에 인사이트를 자동 축적하여 다음 세션에 반영합니다.

**핵심 시각화**: 4계층 피라미드 + 자동 학습 피드백 루프

---

## N10. MCP 생태계와 안전성

초기에는 MCPRegistry, Catalog, Config 3계층으로 MCP 카탈로그를 구축했으나, 자율 수행 에이전트를 운영하면서 Registry가 LLM의 도구 탐색과 확장성을 막는 병목임을 인지했습니다. MCPRegistry(257줄)를 삭제하고 Catalog을 검색 전용으로 축소, config.toml [mcp.servers]로 설정을 통합하여 Proxy stub 9개를 제거했습니다. 현재 44개 MCP catalog 서버를 auto-discovery로 관리하고, 5개 signal 도구를 MCP-first + fixture fallback으로 전환해 라이브 데이터 수집과 오프라인 테스트를 양립합니다. 4-Tier HITL 권한 모델로 자율 실행 경계를 제어하며, API key 부재 시 dry-run 자동 전환을 적용했습니다.

**핵심 시각화**: 3계층→2계층 단순화 스토리 + MCP-first/fixture fallback 흐름

---

## N11. LLM API 비용 관측과 자체 트레이싱

자율 수행 하네스는 while(tool_use) 루프 특성상 LLM API 턴이 많고, 스캐폴딩이 루프로 수렴한 이후에는 PR 단위 개발과 E2E 검증이 잦아 비용 소모가 컸습니다. LangSmith 트레이싱만으로는 모델별 비용 내역과 캐시 히트율을 추적하기 어려워 자체 TokenTracker를 구축했습니다. ContextVar 싱글톤으로 호출마다 모델, 입출력 토큰, cache_creation/cache_read를 기록하고 18개 모델의 가격 레지스트리로 실시간 비용을 산출합니다. UsageStore가 월별 JSONL로 영속 저장하고, ProjectJournal이 프로젝트별 실행 이력과 비용을 추적합니다. /cost CLI 대시보드로 세션/월간/일간 비용과 예산 소진율을 확인하며, 컨텍스트 윈도우 사용률 80% 경고, 95% 위험 시 adaptive pruning이 자동 발동합니다.

**핵심 시각화**: TokenTracker 흐름 + 비용 대시보드 모의 + 자동 발동 임계값

---

## 슬라이드 재설계 원칙

1. **각 슬라이드 = 하나의 내러티브 시각화** — 문제→설계→결과를 시각 흐름으로
2. **박스에 키워드 채우기 금지** — 화살표, 분기, 루프백이 있는 흐름도
3. **구체적 숫자는 강조** — 50 rounds, 5가지 종료, 200 turns, 80%/95% 등
4. **Trade-off는 before/after 대비** — "X였는데 Y로 바꿨더니 Z"
5. **다이어그램은 DAG 수준** — 단순 박스 나열 아닌 의사결정 분기 포함
