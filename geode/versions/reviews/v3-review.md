# V3 Review (33 Slides) — V4 Action Items

## Q1. S07-S09 "장기 자율 실행 하네스" 어필 효과

**판정: 70% 달성. 구조는 좋지만 설득 불완전.**

- S07 (Long-Running Safety): 3대 위험(비용 폭발, 무한 루프, 탐색 고착) + 자동 브레이크 구조는 명확. Trade-off 바가 하단에 존재. 다만 **실측 데이터 부재** — "budget 상한을 넘은 적이 실제로 몇 번 있었는지", "수렴 감지가 실제 50 rounds 세션에서 평균 몇 라운드에서 발동했는지" 같은 증거가 없다.
- S08 (Plan-first + Compaction): 2개 혁신을 한 장에 넣어 밀도가 높고 잘 읽히지만, Plan-first와 Provider-aware Compaction의 관계가 "둘 다 장기 실행에 필요하다" 수준. **왜 둘이 같은 슬라이드인지** 인과관계가 약하다.
- S09 (Scheduler + Gateway): Cron 격리 + 채널 라우팅 설명은 깔끔하나, **headless daemon으로 사람 없이 돌렸다는 구체적 시나리오**("매일 03시에 IP 리포트 자동 생성, 7일간 무인 실행")가 없어 "장기 자율 실행"의 체감이 부족.

**V4 액션**: S07에 실제 Safety Brake 발동 로그 숫자 추가. S09에 무인 실행 시나리오 1개 명시.

---

## Q2. HE-1 DEEP DIVE (S10-S17) 실행 흐름 순서

**판정: 순서 대체로 정확. 1곳 수정 권장.**

현재 순서:
```
S10 Tool Dispatch → S11 Hook System → S12 SubAgent → S13 LLM Failover
→ S14 Context Compression → S15 Memory+Learning → S16 PromptAssembler → S17 MCP+Cost
```

실제 런타임 실행 흐름:
1. LLM이 tool_use 반환 → **Tool Dispatch** (S10) -- 맞음
2. 도구 실행 중 이벤트 발화 → **Hook System** (S11) -- 맞음
3. delegate_task일 경우 → **SubAgent** (S12) -- 맞음
4. LLM 호출 실패 시 → **LLM Failover** (S13) -- 맞음
5. 컨텍스트 포화 시 → **Context Compression** (S14) -- 맞음
6. 턴 종료 시 → **Memory+Learning** (S15) -- 맞음
7. 다음 턴 준비 → **PromptAssembler** (S16) -- 맞음
8. 외부 도구/비용 → **MCP+Cost** (S17) -- **이것은 실행 흐름 끝이 아니라 S10과 병렬로 발생하는 것.**

**문제점**: MCP 호출은 Tool Dispatch의 4경로 중 하나이므로, S17은 S10 직후(또는 S10의 서브섹션)에 가까워야 한다. 현재 위치는 "마지막"이라 흐름 8단계의 끝처럼 보이지만, 실제로는 1단계의 분기다. TokenTracker/Cost는 전 과정에 걸치므로 분리가 맞다.

**V4 액션**: S17을 MCP와 Cost로 분리하거나, MCP 부분을 S10에 흡수하고 S17을 "Cost Observability" 전용으로 리포지셔닝.

---

## Q3. Trade-off 존재 여부 (슬라이드별)

| # | Trade-off | 의미 있는가 |
|---|-----------|-----------|
| S01 | 없음 | 커버에 불필요 |
| S02 | 없음 | 타임라인에 불필요 |
| S03 | 암묵적 (4축 없으면 발산) | 명시 권장 |
| S04 | 없음 | **누락 — Triple Loop 간 trade-off 필요** |
| S05 | 간접적 ("Port/Adapter → LLM 교체 불변") | 약함 |
| S06 | 없음 | **누락 — 5가지 종료는 trade-off 자체인데 명시 안 됨** |
| S07 | "자율성 vs 안전" | 좋음 |
| S08 | 서버사이드 vs 클라이언트 compaction + plan-first 자율성 제한 | 좋음 |
| S09 | 격리 vs 연계 | 약함 — 구체적 비용 미언급 |
| S10 | 병렬 속도 vs 안전 등급 | 좋음 |
| S11 | Observer 오버헤드 vs 확장성 | 좋음 |
| S12 | full inheritance vs sandbox | 좋음 |
| S13 | 3-Provider 유지 비용 vs SPOF | 좋음 |
| S14 | 정보 손실 vs 크래시 방지 | 좋음 |
| S15 | 자동 학습 오버헤드 vs 지식 휘발 | 좋음 |
| S16 | 조립 복잡도 vs 캐시 안정성 | 좋음 |
| S17 | 제어(Registry) vs 탐색 자유도 | 좋음 |
| S18 | Clean Context (앵커링 차단) | 좋음 |
| S19 | Protocol 구현 부담 vs 피봇 비용 0 | 좋음 |
| S20 | 재사용 vs 재설계 | 좋음 |
| S21 | 없음 | **누락 — Mirror 구조의 비용 미언급** |
| S22 | 암묵적 ("제약이 자유를 넓힌다") | 약함 |
| S23 | 없음 | **누락 — 8-Step Loop의 속도 비용 미언급** |
| S24 | 없음 | **누락 — 4소스 참조와 독자 설계의 경계 미언급** |
| S25 | 없음 | **누락** |
| S26 | 없음 | 타임라인 슬라이드 — 허용 |
| S27 | 없음 | **누락 — 3-Layer 제어의 성능 비용 미언급** |
| S28-29 | 전체가 Trade-off 슬라이드 | 좋음 |
| S30 | 전체가 Constraints→Results | 좋음 |
| S31-33 | 없음 | 클로징에 불필요 |

**요약**: HE-1 Deep Dive (S10-S17)는 모두 Trade-off 존재. HE-0 Scaffold (S21-S25)에 Trade-off가 빈약. 특히 **S04, S06, S23, S24, S27이 누락**.

**V4 액션**: S04(Triple Loop)에 "META 루프 투자 시간 vs RUNTIME 품질" 트레이드오프 추가. S06에 "5가지 종료 vs 작업 완료율" 명시. S23, S24에 각각 1줄 Trade-off 바 추가.

---

## Q4. Frontier 소스 (S24) 정확성

**판정: 4소스 모두 존재하나 매핑 불완전.**

현재 S24 내용:
- Claude Code: while(tool_use) → AgenticLoop 50 rounds
- autoresearch: Karpathy P1/P4/P6 → CLAUDE.md 규칙
- OpenClaw: Gateway, Session Key, Lane Queue, Plugin → 디스패치 계층
- Codex CLI: Worktree 격리, .owner 보호, Dumb Platform → CANNOT Git 규칙

**문제점**:
1. "OpenClaw"가 맞는 명칭인지 확인 필요 — V2 리뷰에서 "OpenHands"였다가 V3에서 "OpenClaw"로 바뀜. 일관성 필요.
2. autoresearch의 Karpathy 원칙은 S07에서 P3/P4로 참조되는데, S24에서는 P1/P4/P6으로 표기 — **번호 불일치**.
3. Codex CLI 참조가 CANNOT Git 규칙에 한정 — 실제로 Codex의 영향이 더 넓은지 확인 필요.
4. **S24 제목이 "Frontier Mining + 4-Persona Review"이지만 Frontier와 Persona가 합본** — V2 리뷰에서 분리 권장했으나 V3에서 다시 합침. 두 주제가 서로 다른 가치(참조 vs 검증)를 설명하므로 **분리가 나음**.

**V4 액션**: Frontier 소스 슬라이드와 4-Persona 슬라이드를 분리. Karpathy 원칙 번호를 S07과 S24 간 통일. OpenClaw 명칭 확정.

---

## Q5. Master Narrative 대비 누락

sot-master-narrative.md에는 N1-N11의 11개 서술이 있다.

| Narrative | 슬라이드 | 커버리지 |
|-----------|---------|---------|
| N1 AgenticLoop | S06 | 완전 |
| N2 Tool Dispatch | S10 | 완전 |
| N3 SubAgent | S12 | 완전 |
| N4 5-Layer 검증 | S18 | 완전 |
| N5 3-Provider Failover | S13 | 완전 |
| N6 Model Switching + 컨텍스트 압축 | S14 | **Model Switching (에스컬레이션/디에스컬레이션) 누락** — S14가 압축만 다룸 |
| N7 Hook System | S11 | 완전 (단, 이벤트 수 불일치: SOT=27→45, 슬라이드=46) |
| N8 PromptAssembler | S16 | 완전 |
| N9 4-Tier Memory | S15 | 완전 |
| N10 MCP 생태계 | S17 | 완전 |
| N11 비용 관측 | S17 (합본) | 약간 부족 — /cost CLI 대시보드 시각이 텍스트만 |

**주요 누락**:
1. **N6의 Model Switching (Confidence < 0.7 → 에스컬레이션, 단순 작업 → 디에스컬레이션)** — 어디에서도 전용 슬라이드가 없음. S13이 Failover(장애 대응)만 다루고, 비용 최적화를 위한 능동적 모델 전환은 빠져 있음.
2. **N7의 이벤트 수**: SOT는 "27→45"로 개편 스토리인데, 슬라이드는 46으로 표기. SOT 업데이트 또는 슬라이드 수정 필요.

**V4 액션**: S13과 S14 사이에 "Model Switching: Confidence 기반 에스컬레이션/디에스컬레이션" 슬라이드 추가 (또는 S13 확장). Hook 이벤트 수를 SOT와 통일.

---

## Q6. 슬라이드별 점수 (1-10)

| # | 슬라이드 | 점수 | 핵심 평가 |
|---|--------|------|---------|
| S01 | Cover | 8 | 태그라인 + 4대 숫자 명확. 마스코트 적절. |
| S02 | Timeline | 9 | 피봇 스토리가 감정적으로 작동. REODE 포크까지 연결. |
| S03 | Thesis 4-Axis | 8 | 핵심 주장 + 4축 카드 정보 밀도 좋음. 열화 문제 언급. |
| S04 | Triple Loop | 7 | 3-Loop 구조는 좋지만 화살표만으로 DAG 표현 부족. Trade-off 누락. |
| S05 | Architecture | 7 | v028 PNG 재활용. 좌측 다이어그램이 텍스트 없이 이미지만이라 설명 의존. |
| S06 | AgenticLoop | 8 | 50/200/5 숫자 카드 + 5가지 종료 경로 명확. Trade-off 누락. |
| S07 | Long-Running Safety | 9 | V3 핵심 신규. 3대 위험 + 브레이크 대응 + Karpathy 참조. 실측 데이터만 추가하면 10점. |
| S08 | Plan-first + Compaction | 8 | 2개 혁신 깔끔. Provider 분기 시각화 좋음. 둘의 관계 서술이 약함. |
| S09 | Scheduler + Gateway | 7 | 구조 명확하나 "장기 자율"의 체감 부족. 구체적 시나리오 없음. |
| S10 | Tool Dispatch | 9 | 4-Route + 5-Tier Safety + Error Recovery 완전. 정보 밀도와 가독성 균형. |
| S11 | Hook System | 9 | 8카테고리 46이벤트 + Maturity Model + StuckDetector. Trade-off 존재. |
| S12 | SubAgent | 9 | 문제→설계→수치 구조 완벽. full inheritance vs sandbox Trade-off. |
| S13 | LLM Failover | 8 | 3-Provider + CircuitBreaker 상태 머신. ZhipuAI 근거 설명. Model Switching 누락. |
| S14 | Context Compression | 9 | 3-Phase + 임계값 래더 + 0.03% 비용. Lossless vs Lossy Trade-off. |
| S15 | Memory+Learning | 8 | Auto-learning loop + 4-Tier. Failover 후 메모리 보존 설명. |
| S16 | PromptAssembler | 8 | 6-Phase + SHA-256 + cache 10%. Before/After 대비 좋음. |
| S17 | MCP+Cost | 8 | Registry 삭제 스토리 + TokenTracker. MCP+Cost 합본이 과밀한 느낌. |
| S18 | Game IP Pipeline | 8 | DAG 이미지 + Scoring Formula + Fixture Results. Clean Context Trade-off. |
| S19 | Domain Portability | 9 | 0줄 수정 숫자가 강력. REODE 실증 수치 완전. |
| S20 | Eco2 Evolution | 7 | 4패턴 진화 스토리. 3열 비교가 빠르게 읽히나 깊이 부족. |
| S21 | Mirror Table | 6 | 컨셉은 좋지만 Scaffold/Runtime 대응이 "단순 나열"에 가까움. Trade-off 누락. |
| S22 | CANNOT/CAN | 7 | 23규칙 나열은 V2 리뷰 지적 그대로. 핵심 5-6개로 압축 필요. |
| S23 | 8-Step Loop | 7 | 8-Step 흐름도 좋음. Socratic Gate 상세. 루프 비용 Trade-off 누락. |
| S24 | Frontier+Persona | 6 | 4소스 존재하나 합본으로 인해 각 소스의 GAP→설계 인과가 희석됨. |
| S25 | Velocity | 8 | 16.7x 복리 구조 시각화 좋음. Phase 0-5 타임라인 명확. |
| S26 | CHANGELOG | 8 | 6 피봇 + 39 릴리스. 각 결정에 "왜" 포함. |
| S27 | Security | 7 | 3-Layer + Dual Trust. PolicyChain 이미지 사용. Trade-off 누락. |
| S28 | Trade-offs Arch | 7 | 7개 아키텍처 Trade-off 나열. 읽히지만 "나열"에 가까움. |
| S29 | Trade-offs Agent | 7 | 8개 에이전트 Trade-off 나열. S28과 동일 구조로 단조로움. |
| S30 | Constraints→Results | 8 | CANNOT→RESULT 5쌍. 시각적 대비 효과 좋음. |
| S31 | Summary | 7 | 숫자 총정리. 정보량은 충분하나 새로운 인사이트 없음. |
| S32 | Harness=Discipline | 7 | 4축 장기 진화. 방향은 좋지만 구체성 부족. |
| S33 | Closing | 8 | Thesis 콜백 + Triple Loop 미니 + 3 Value Props. 마무리 깔끔. |

**평균: 7.7/10**

---

## Top 5 V4 Improvements (우선순위)

### 1. S07에 실측 Safety Brake 데이터 추가 (Impact: HIGH)
S07은 V3의 핵심 차별화 슬라이드이지만, 3대 브레이크가 "있다"는 설명만 있고 "실제로 작동했다"는 증거가 없다. REODE 33세션 1,133라운드 데이터에서 budget_stop/convergence/diversity_hint 발동 횟수를 추출하여 숫자로 증명해야 한다. 이것이 없으면 "설계했다"에 불과하고 "운용했다"가 아니다.

### 2. Frontier Mining과 4-Persona Review를 분리 (S24 split) (Impact: HIGH)
현재 S24가 2개의 서로 다른 가치(외부 참조 기반 설계 vs 내부 다중 시각 검증)를 합본하고 있어 둘 다 희석된다. Frontier Mining은 "왜 이 설계인가"의 근거이고, 4-Persona는 "어떻게 검증했는가"의 프로세스. 별도 슬라이드로 분리하여 각각 깊이를 확보해야 한다. Karpathy 원칙 번호(P1/P3/P4/P6)를 S07과 S24 간에 통일.

### 3. Model Switching 전용 슬라이드 추가 (N6 누락 해소) (Impact: MEDIUM-HIGH)
SOT N6의 "Confidence < 0.7 → 상위 모델 에스컬레이션 / 단순 작업 → 하위 모델 디에스컬레이션"이 33장 어디에도 전용 슬라이드가 없다. S13이 장애 Failover만 다루므로, 비용 최적화를 위한 능동적 모델 전환을 S13 확장 또는 별도 S13.5로 추가. 이것이 빠지면 "장기 자율 실행"의 비용 측면이 불완전하다.

### 4. S22 (CANNOT/CAN) 23규칙 나열을 핵심 5-6개로 압축 (Impact: MEDIUM)
V2 리뷰에서 이미 지적된 사항. 23개 전부를 나열하면 발표 중 청중이 읽을 수 없다. 핵심 효과가 큰 5-6개 규칙만 시각화하고, 나머지는 "23 rules — 전문은 CLAUDE.md 참조" 뱃지로 처리. 대신 1개 규칙의 "위반 → 실패 → 규칙 추가" 인과 스토리를 강화.

### 5. S28-S29 Trade-off 슬라이드를 "포기 vs 얻음" 테이블에서 인과 DAG로 전환 (Impact: MEDIUM)
현재 S28(7개)과 S29(8개)가 동일한 "포기/얻음" 2열 구조를 반복하여 단조롭다. 2장을 합치거나, 최고 임팩트 3-4개만 선별하여 "설계 A 선택 → B 포기 → C가 가능해짐 → D에서 재활용" 같은 인과 체인 DAG로 전환하면 서술적 설득력이 올라간다.

---

## 기타 V4 작업 메모

- Hook 이벤트 수: SOT는 "27→45"인데 슬라이드는 "46"으로 일관 표기 — SOT를 46으로 업데이트하거나 슬라이드를 45로 수정
- S04 (Triple Loop): Hook 이벤트 전파 화살표만 있고 3-Loop 간 피드백 루프백이 시각적으로 없음 — DAG 수준으로 업그레이드
- S09 (Scheduler): headless daemon 무인 실행 시나리오 1개 구체화 (e.g., "Cron 03:00 IP 리포트 → 7일 무인 → Slack 자동 배달")
- S21 (Mirror): "동형 구조"를 시각적으로 증명 — 동일 코드 패턴 1쌍(예: CANNOT rule vs PolicyChain hook)의 코드 스니펫 병렬 배치
- 33장 → 35-36장 예상 (Frontier 분리 + Model Switching 추가) — 발표 시간 50-65분
