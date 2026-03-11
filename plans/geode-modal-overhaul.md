# GEODE Modal Overhaul + Axolotl Concept Plan

> Created: 2026-03-11
> Status: IN PROGRESS

## 1. Axolotl Concept — "재생하는 에이전트"

Axolotl(아홀로틀)은 GEODE의 상징 동물. 핵심 매핑:

| Axolotl 특성 | GEODE 대응 |
|-------------|-----------|
| **재생 능력** (사지 완전 재생) | Self-Correction: confidence < 0.7 → 자율 재분석 |
| **유태성** (유생 상태로 성체) | 항상 학습 중: Feedback Loop, RLAIF 자가 개선 |
| **외부 아가미** (외부 감지) | 21 Tools: 외부 데이터 수집 (Reddit, YouTube, AniList...) |
| **수중 생활** (데이터 흐름 속) | LangGraph StateGraph: 데이터 스트림 속에서 활동 |
| **야행성/은밀** | 저평가 IP "발견" — 숨겨진 가치를 찾는 존재 |
| **다양한 색상 변이** | 6-Layer 컬러 시스템 (Emerald→Blue→Pink→Indigo→Amber→Purple) |

### 시각적 적용
- Hero 영역에 Axolotl SVG 실루엣 (미니멀, 라인아트)
- 색상: #F472B6 (Pink, L3 Agentic Core) — Axolotl의 대표 색상이자 에이전트 핵심 레이어
- 아가미 부분에 데이터 흐름 파티클 효과 (optional, CSS animation)

---

## 2. Timeline Update (CHANGELOG.md 기반)

### Current (Wrong — architecture milestones v1.0-v6.0, fake dates)
8 items: 2025.03-2025.10, v1.0 through v6.0 Polish

### Target (CHANGELOG.md — actual releases)
| Version | Date | Highlights |
|---------|------|-----------|
| v0.6.0 | 2026-03-10 | Initial release — pipeline, agentic loop, 3-tier memory, 1879 tests |
| v0.6.1 | 2026-03-10 | Content/code separation, pre-commit hooks |
| v0.7.0 | 2026-03-11 | C2-C5 flexibility, LangSmith, orchestration, 17-tool audit |
| v0.8.0 | 2026-03-11 | Plan/Sub-agent NL, Claude Code UI, verification tracing, 2000+ tests |
| Next | TBD | Outcome tracking, production deployment |

---

## 3. Modal Quality Audit

### 현재 문제점 (43 modals)

#### A. 구조 불일치
- 일부 모달: explanation + code + metrics (잘 구성)
- 다른 모달: explanation + metrics만 (코드 없음)
- 또 다른 모달: code만 (설명 없음)

#### B. 콘텐츠 품질
- 얕은 설명: "IP 데이터를 수집합니다" 수준의 한 줄 설명
- 코드 예시: 실제 코드와 괴리 (간소화된 pseudo-code)
- 메트릭: "Dict", "O(1)" 같은 의미 없는 값

#### C. 에이전트 프레이밍 부재
- 모달 내용이 파이프라인/인프라 언어로 작성됨
- "자율 에이전트"로서의 역할/행동 설명 부족

#### D. 디자인 DNA 위반
- 일부 모달에 glow 효과 없음
- Fira Code 미적용 영역
- 수치 데이터에 monospace 미적용

### 통일 템플릿 (Target)

```
모달 구조 (모든 43개 통일):
┌─ Modal Title (emoji + bilingual)
├─ Explanation Block (highlight, border-color = layer color)
│   └─ 2-3문장, 에이전트 관점 서술
├─ Key Metrics (3 cards, Fira Code values)
├─ Code/Visualization (실제 코드 or SVG diagram)
│   └─ 실제 codebase 기반, 핵심 로직만
├─ Details Table (optional, bilingual)
└─ Related Links (optional, 연관 모달 참조)
```

### 우선순위

**P0 — 에이전트 정체성 핵심 모달 (8개)**
1. modal-geode-router → "Agent Router: 6-route intelligent path selection"
2. modal-geode-scoring → PSM 공식 + 가중치 설명 보강
3. modal-geode-guardrails → G1-G4 각각 설명 + pass/fail 기준
4. modal-geode-biasbuster → 6-bias 감지 로직 시각화
5. modal-geode-planner → Plan Mode 상태 전이 상세
6. modal-geode-task-system → Sub-Agent DAG + 실행 예시
7. modal-geode-hooks → 23 hook 이벤트 전체 목록 + 실행 순서
8. modal-geode-adaptive-loop → while(tool_use) 상세

**P1 — 분석/평가 모달 (10개)**
9-18. analyst, evaluator, cortex, signals, scoring-overview, synthesizer,
      cross-llm, clean-context, decision-tree, confidence-calc

**P2 — 아키텍처/인프라 모달 (12개)**
19-30. stategraph, send-api, reducer, node-contract, expert-panel,
       feedback, org/project/session-context, settings, bootstrap, factory

**P3 — Tech Stack 모달 (13개)**
31-43. claude-client, structured-output, prompts, cli, rich-display,
       nl-router, di, cusum, drift-monitor, model-registry, triggers,
       verification-flow, rights-risk

---

## 4. 실행 순서

1. [x] Timeline update (CHANGELOG.md → actual versions)
2. [ ] Axolotl SVG + Hero integration
3. [ ] P0 모달 8개 overhaul (에이전트 프레이밍 + 구조 통일)
4. [ ] P1 모달 10개 overhaul
5. [ ] P2/P3 모달 25개 overhaul
6. [ ] 검증 루프 + 커밋
