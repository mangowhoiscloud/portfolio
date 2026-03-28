# V7 Self-Review: 5-Person Team Honest Evaluation

**Date:** 2026-03-27
**Scope:** 35 slides (`s01-cover` ~ `s33-closing`)
**Baseline:** V6 deep-review + V6 final-audit

---

## 1. 과거형 서술 감사

### 수치
| 어미 | 건수 | 분포 파일 수 |
|------|------|-------------|
| 했다 | 40 | 21 |
| 됐다 | 7 | 3 |
| 했고 | 5 | 5 |
| 됐고 | 2 | 2 |
| 였다 | 1 | 1 |
| 왔다 | 1 | 1 |
| **합계** | **56** | **23/35 슬라이드** |

### Worst 5 Slides
| 슬라이드 | 건수 | 심각도 |
|----------|------|--------|
| s21-mirror-table | 7 | 모든 설명란이 과거형 |
| s24-frontier-mining | 5 | "읽었고", "됐다" 반복 |
| s32-harness-discipline | 4 | 4축 각각 "~했다" 종결 |
| s28-tradeoffs-arch | 4 | 8선 전부 "~됐다" 패턴 |
| s09-scheduler-gateway | 3 | 서브타이틀+Trade-off 모두 과거형 |

### 문제 유형 분류
1. **"~했기 때문에 Y를 도입했다"** (30건) -- 인과관계 서술의 결론부가 과거형
2. **"~됐다/됐고"** (9건) -- 결과 기술이 과거 완료형
3. **"~였다"** (1건) -- 단순 과거 상태

### 교체 방안
| Before | After | 패턴 |
|--------|-------|------|
| `~했기 때문에 Y를 도입했다` | `~하므로 Y를 도입한다` | 인과 현재형 |
| `~가 됐다` | `~를 달성한다` / `~로 전환된다` | 결과 능동형 |
| `~됐고` | `~되며` / `~하고` | 접속 현재형 |
| `~했고` | `~하며` / `~하고` | 접속 현재형 |
| `~였다` | `~이다` | 상태 현재형 |
| `~제거했다` | `~제거한다` | 행위 현재형 |

**적용 범위:** 35개 파일 전체. sed one-liner로 1차 일괄 교체 후, 문맥별 수동 검수 필요.

---

## 2. 박스 패딩 감사

### 수치
- **`padding: 4pt`, `5pt`, `6pt` 포함 선언:** 277건 (35 파일 전체에 분포)
- **0건인 파일:** 없음. 모든 슬라이드에 4-6pt 패딩 존재

### Worst 10 Files
| 파일 | 건수 |
|------|------|
| s09-scheduler-gateway | 23 |
| s15-memory-learning | 17 |
| s11-hook-system | 17 |
| s17-mcp-cost | 16 |
| s31-summary | 13 |
| s10-tool-dispatch | 13 |
| s08-plan-compaction | 13 |
| s14-context-compression | 12 |
| s16-prompt-assembler | 11 |
| s07-long-running-safety | 11 |

### 교체 범위
- `padding: 4pt` -> `padding: 7pt`
- `padding: 5pt` -> `padding: 8pt`
- `padding: 6pt` -> `padding: 9pt`
- 축약형 `padding: 4pt 8pt` -> `padding: 7pt 9pt` (좌우는 유지, 상하만 조정 가능)
- **주의:** 푸터 영역 `padding: 4pt 36pt 7pt`은 상단만 4pt인 경우가 많으므로, body 하단 여백과의 관계를 고려해 일률 교체 불가. 파일별 검수 필요.

---

## 3. 역할별 자기 평가

### UI/UX Designer

**레이아웃 다양성: B+**

| 패턴 | 슬라이드 | 건수 |
|------|---------|------|
| 수직 흐름 (vertical stack) | s10, s14, s30 | 3 |
| 센터 히어로 (center-hero + side stats) | s12 | 1 |
| 3단 스택 (3-column equal) | s07, s03 | 2 |
| 수평 파이프라인 (horizontal chain) | s16 | 1 |
| 2-column text + sidebar | s11, s21, s22, s25, s26 | 5 |
| 타임라인 | s02, s26 | 2 |
| CANNOT->HOW->RESULT 수평 트리플 | s30 | 1 |
| 디바이더 (center text) | s09b, s20b | 2 |
| 커버/클로징 | s01, s33 | 2 |

- S10 수직 흐름, S12 센터 히어로, S14 3단 스택, S16 수평 파이프라인은 실제로 4가지 구분이 가능하다.
- 다만 **나머지 20+ 슬라이드가 "2-column + sidebar" 변형에 편중**. 레이아웃 코드를 바꿔도 시각적으로 비슷해 보인다.
- 디바이더 2장은 호흡을 준다. 다만 s09b(10/35)와 s20b(22/35)만 존재. 후반부(S28~S33)에 디바이더가 없어서 마감이 급박한 느낌.

**V8 개선:**
- 후반부(S27 혹은 S29 부근)에 디바이더 1장 추가
- "좌-우 대칭" 변형(좌 diagram + 우 sidebar)이 아닌, 풀폭 수직 흐름 슬라이드 2~3장 추가로 리듬 깨기

### Frontend Developer

**8자리 hex color (#RRGGBBAA): CRITICAL**

- **126건**, 21개 파일에 분포
- 예: `#4ECDC420`, `#EF444440`, `#818CF860`, `#34D39915` 등
- 이것은 CSS rgba 축약으로, 브라우저는 렌더링하지만 **html2pptx가 정확히 해석하는지 보장 불가**
- PptxGenJS는 6자리 hex만 안전하게 지원

**html2pptx 호환성 문제:**
1. 8자리 hex -> PPTX 변환 시 투명도 무시 또는 검은색으로 렌더링 가능
2. `border-radius: 50%` (원형 뱃지) -> PPTX에서 직사각형으로 변환될 수 있음
3. `flex-direction: column` 중첩 3단계 -> html2pptx의 레이아웃 엔진 정밀도에 의존

**V8 교체 방안:**
```
#4ECDC420 -> 별도 background color + opacity style 분리
또는 -> rgba(78, 205, 196, 0.125)로 명시
또는 -> 6자리 hex 근사색 (#1A3B38 등)으로 대체
```
126건 전부 교체 필요. 자동화 스크립트로 처리 가능.

### Designer (디자이너)

**"AI로 만든 느낌" 평가: B-**

V6 대비 개선점:
- 인과관계 서술이 각 카드에 들어가 "키워드 나열" 감소
- Trade-off 바가 매 슬라이드에 포함되어 구조적 깊이 표현
- 숫자 강조(18-30pt)가 시각적 앵커 역할

**아직 AI 느낌이 남는 지점:**
1. **색상 사용의 기계적 규칙성:** 모든 accent color가 정확히 같은 패턴(border-left 3pt + 10% tint 배경)으로 적용. 사람이라면 가끔 다른 강조 방법(밑줄, 볼드만, 이탤릭)을 섞는다.
2. **문장 구조의 반복성:** "X했기 때문에 Y를 도입했다"가 28개 슬라이드에 등장. 인간 작성이면 "X라서 Y", "X 문제가 있어 Y로 전환", "X를 계기로 Y" 등 변형이 자연스럽다.
3. **Trade-off 바의 위치 고정:** 30/35 슬라이드가 하단에 Trade-off 바를 두는데, 인간이라면 때때로 인라인으로 넣거나 생략한다.
4. **모든 슬라이드가 동일한 header 패턴:** 좌측 바 4pt + 라벨이 너무 규칙적. 1~2장에서 변형하면 자연스러워진다.
5. **S30 Constraints->Results:** 5줄이 완벽히 같은 구조로 반복. 인간이면 3~4개로 줄이거나 시각적 변주를 넣는다.

### GEODE Developer (GEODE 개발자)

**v0.32.0 기능 반영 정확도: A-**

v0.32.0 핵심 기능 체크:
| 기능 | 반영 슬라이드 | 정확도 |
|------|-------------|--------|
| Long-Running Safety 3 Brake | s07 | O |
| Plan-first + create_plan | s08 | O |
| Provider-aware Compaction | s08 | O |
| budget_stop -> PIPELINE_END | s07 | O |
| 수렴 감지 3회 에스컬레이션 | s07 | O |
| Action Summary | s10 | O |
| Gateway Webhook | s09 | O |
| ConfigWatcher hot-reload | s26 (언급) | 약함 |
| TOOL_APPROVAL 3종 Hook | s11 (6 events로 통합) | O |
| Deferred Tool Loading | s10 | O |

**Hook 46개 이벤트명 검증:**

s11에 나열된 이벤트 합계:
- Pipeline+Node: 7
- Analysis+Verification: 5
- Automation: 6
- Memory+Prompt: 6
- SubAgent: 3
- Context+Session+LLM: 7
- Tool Recovery+Approval: 6
- Gateway+MCP: 4
- **합계: 44 (2개 부족)**

**누락 의심:** TOOL_EXECUTION_START / TOOL_EXECUTION_END가 그룹에 명시되지 않음. 또는 44개를 나열하고 "46"이라 표기하는 불일치. V8에서 정확한 enum 대조 필요.

**누락 시스템:**
- **ConfigWatcher hot-reload**: s26에서 한 줄 언급만. 별도 슬라이드 또는 s09 Gateway 슬라이드에 통합 필요.
- **REODE 이식 상세**: s19에서 다루지만, "코어 수정 0줄"의 구체적 메커니즘(어떤 Port가 어떻게 바뀌는지)은 부족.

### Senior Harness Developer (시니어 하네스 개발자)

**Trade-off 표면성 진단:**

| 슬라이드 | Trade-off | 깊이 평가 |
|----------|-----------|-----------|
| s07 Long-Running Safety | 자율성 vs 안전 | **표면적.** "임계값은 조정 가능"만 말하고, 실제 조정 시 어떤 일이 벌어지는지 미서술 |
| s09 Scheduler-Gateway | 격리 vs 학습 공유 | 양호. systemEvent 주입이라는 구체 메커니즘 제시 |
| s11 Hook System | Observer 오버헤드 vs 확장성 | **표면적.** "오버헤드가 있지만 확장된다"는 정량 없는 선언 |
| s12 Sub-Agent | 완전 출력 vs guard 압축 | 양호. 75% 절감이라는 숫자 제시 |
| s28 Trade-offs 8선 | 전체 | **가장 표면적.** 8개를 나열만 하고 각각의 정량 비용/수익이 없음. "됐다"로 끝나는 결론형 |
| s32 Discipline | 디시플린 비용 | 양호. "40/40 무회귀가 수익"으로 정량 연결 |

**"장기 자율 실행" 어필 충분성: B**

- s07이 3 Brake를 잘 설명하지만, **"36일 무중단 실행"이 실제로 어떤 시나리오인지** 구체적이지 않다
- "하룻밤 무인 실행"은 언급하지만, 36일 연속이 아니라 세션 단위 자율 실행임을 명확히 해야 오해를 줄인다
- **Scheduler 기반 주기적 자율 실행** (s09)과 **단일 세션 50R 자율 실행** (s06, s07)의 구분이 청중 입장에서 불명확
- s33 Closing에서 "36일 무중단 실행이 수익"이라는 문장이 있으나, 이것이 "Scheduler가 36일간 매일 자동 실행"인지 "36일 개발 기간 동안 장애 0"인지 모호

---

## 4. V8 Action Items (우선순위)

### P0 -- MUST FIX (빌드 정합성)

| # | 항목 | 범위 | 방법 |
|---|------|------|------|
| 1 | 8자리 hex color 전면 교체 | 126건 / 21파일 | 6자리 hex 근사색으로 변환. 투명도 필요 시 별도 opacity 속성 분리 |
| 2 | Hook 46 이벤트 수 불일치 | s11 | enum 소스 대조 후 44->46 정확히 나열 |

### P1 -- HIGH (서술 품질)

| # | 항목 | 범위 | 방법 |
|---|------|------|------|
| 3 | 과거형 서술 전면 교체 | 56건 / 23파일 | sed 1차 교체 + 문맥 검수. "했다->한다", "됐다->된다", "됐고->되며", "했고->하며" |
| 4 | 문장 구조 변형 | 28개 슬라이드의 "X 때문에 Y" 패턴 | 5가지 이상의 인과 표현으로 분산: "X라서", "X를 계기로", "X 문제 해결을 위해", "X 조건에서" |
| 5 | Trade-off 정량화 (s11, s28) | 2 슬라이드 | Hook Observer 오버헤드 ms 측정치 추가. s28은 각 Trade-off에 비용/수익 숫자 1개씩 |

### P2 -- MEDIUM (레이아웃/디자인)

| # | 항목 | 범위 | 방법 |
|---|------|------|------|
| 6 | padding 4-6pt -> 7-9pt | 277건 / 35파일 | 상하 패딩만 +3pt 일괄 적용. 푸터 제외한 콘텐츠 영역 대상. overflow 발생 시 font-size 0.5pt 축소로 보상 |
| 7 | 후반부 디바이더 추가 | S29 부근 | "CONNECTION -> CLOSING" 전환 디바이더 1장 |
| 8 | 풀폭 수직 슬라이드 추가 | 2-3장 | "2-column + sidebar" 편중 해소 |
| 9 | AI 반복 패턴 깨기 | 전체 | header 패턴 1-2장 변형, Trade-off 바 인라인 배치 2-3장 |

### P3 -- LOW (콘텐츠 보완)

| # | 항목 | 범위 | 방법 |
|---|------|------|------|
| 10 | ConfigWatcher hot-reload 상세 | s09 또는 별도 | Gateway 슬라이드에 2줄 추가 또는 s26 Changelog에서 강화 |
| 11 | "36일 무중단" 표현 명확화 | s07, s33 | "36일 개발 기간 중 Scheduler 기반 일일 자율 실행, 장애 0" 등 구체화 |
| 12 | REODE 이식 메커니즘 | s19 | 어떤 Port 인터페이스가 교체되는지 1-2줄 구체화 |
| 13 | s30 Constraints 반복 구조 | s30 | 5줄 -> 4줄로 축소하고, 1줄은 시각적 변주(아이콘 또는 강조색 변경) |

---

## 5. 종합 점수

| 평가 항목 | V6 | V7 | 비고 |
|-----------|-----|-----|------|
| 내러티브 깊이 | C+ | B+ | 인과 서술 대폭 개선, 과거형이 발목 |
| 레이아웃 다양성 | C | B | 4종 신규 패턴, 여전히 sidebar 편중 |
| 기술 정합성 | B | A- | v0.32 거의 정확, Hook 2개 불일치 |
| html2pptx 호환 | B+ | C+ | 8자리 hex 126건 퇴보 |
| AI 느낌 탈피 | D | C+ | 구조적 개선은 있으나 패턴 반복 잔존 |
| Trade-off 깊이 | C | B- | 정량 부족 2곳, 나머지는 양호 |
| **종합** | **C+** | **B** | |

V7은 V6 대비 확실히 진보했으나, 8자리 hex와 과거형 서술이라는 두 가지 체계적 결함이 전체 품질을 끌어내린다. V8에서 P0 2건 + P1 3건을 해결하면 B+ 이상 도달 가능.
