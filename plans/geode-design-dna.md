# GEODE Design DNA Analysis

> 2026-03-11 | Source: geode.html CSS + GitHub README mermaid diagrams

## 1. Core Identity — "Crystal from Chaos"

GEODE의 이름 자체가 메타포: **거칠어 보이는 돌(저평가 IP) 안에 숨겨진 결정(잠재 가치)을 발견하는 시스템**.
모든 디자인 결정이 이 메타포에서 출발한다.

### Personality Keywords
- **Crystalline** — 어두운 void 속에서 빛나는 결정체 (bg: #0A0A10, accent: #818CF8)
- **Scientific** — 수식, 통계 임계값, Fira Code 모노스페이스
- **Layered** — 6개 레이어가 각자의 색과 glow를 가짐
- **Agent-native** — 파이프라인 플로우, 루프 다이어그램, 상태 머신
- **Confidence-driven** — 모든 것에 수치, 임계값, KPI가 붙어있음

---

## 2. Typography System

### Font Stack
| Role | Font | Weight | Usage |
|------|------|--------|-------|
| Heading | Inter | 700-800 | 타이틀, 통계, 네비게이션 |
| Body | Inter + Noto Sans KR | 400-500 | 본문, 설명 |
| Code | Fira Code | 400-600 | 수식, 뱃지, 코드블록, 파이프라인 라벨 |

### Typographic Scale
```
Hero Title:    clamp(3rem, 8vw, 6rem) / 800 / -0.03em  ← 극한 타이트닝
Stat Value:    2.5rem / 800 / -0.02em
Section Title: 2.5rem / 700 / -0.02em
Category:      1.5rem / 700 / -0.01em
Body:          0.85-0.9rem / 400-500
Code Badge:    0.65-0.75rem / Fira Code
Micro Label:   0.65rem / Fira Code / uppercase + 0.1em tracking
```

### Key Feature
- `font-feature-settings: 'ss01' on, 'ss02' on` — Inter의 대체 글리프 활성화
- Negative letter-spacing이 핵심 (-0.03em ~ -0.01em) — 밀도감과 기술적 긴장감
- line-height 1.7 (body) — 한/영 혼합 가독성 확보

---

## 3. Color System — "Geode Crystal Palette"

### Primary Accents
| Token | Hex | Role |
|-------|-----|------|
| accent-primary | #818CF8 | Indigo-400, 핵심 강조 |
| accent-light | #A5B4FC | Indigo-300, 라이트 배리언트 |
| accent-dark | #6366F1 | Indigo-500, 다크 배리언트 |
| accent-secondary | #C084FC | Purple-400, 보조 강조 |

### 6-Layer Color System (1:1 매핑)
| Layer | Color | Hex | Glow |
|-------|-------|-----|------|
| L1 Foundation | Emerald | #34D399 | rgba(52,211,153,0.2) |
| L2 Memory | Blue | #60A5FA | rgba(96,165,250,0.2) |
| L3 Agentic Core | Pink | #F472B6 | rgba(244,114,182,0.2) |
| L4 Orchestration | Indigo | #818CF8 | rgba(129,140,248,0.2) |
| L5 Automation | Amber | #FBBF24 | rgba(251,191,36,0.2) |
| L6 Extensibility | Purple | #C084FC | rgba(192,132,252,0.2) |

### Background Depth Gradient
```
#0A0A10  (void, deepest)
  ↓
#0E0E18  (primary bg)
  ↓
#141422  (secondary bg)
  ↓
#181828  (card bg)
  ↓
#1E1E32  (card hover)
```

### Semantic Colors
- Success/Pass: #34D399 (Emerald)
- Warning: #FBBF24 (Amber)
- Error/Critical: #EF4444 (Red)
- Info: #60A5FA (Blue)
- Teal accent: #2DD4BF (for CLI/Router)

---

## 4. Mermaid → Portfolio Visual Mapping

README에 12개 mermaid 다이어그램이 있으며, 포트폴리오에서 다음과 같이 매핑:

| # | Mermaid Diagram | Portfolio Section | 현재 구현 | 개선 기회 |
|---|----------------|-------------------|-----------|-----------|
| 1 | 6-Layer Architecture | Section 01 | Layer cards | SVG 계층도 추가 가능 |
| 2 | Pipeline Flow | Section 00 | CSS div+arrow | 이미 우수 |
| 3 | Agentic Loop | Section 00 | CSS 3-phase | 이미 우수 |
| 4 | Cross-LLM Ensemble | Section 06 | Multi-LLM 카드 | **SVG 추가 가치 높음** |
| 5 | Sub-Agent Orchestration | Section 04 | TaskSystem 카드 | SVG DAG 추가 가능 |
| 6 | MCP & Tools | 없음 | 없음 | **신규 시각화 가치** |
| 7 | LangSmith Observability | 없음 | 없음 | 선택적 |
| 8 | 14-Axis Rubric | Section 02 | Radar + Table | 이미 우수 |
| 9 | Multi-turn Context | 없음 | 없음 | 선택적 |
| 10 | HITL Bash | 없음 | 없음 | v0.8.0 feature |
| 11 | Feedback Loop | Section 05 | 5-Phase timeline | 이미 우수 |
| 12 | Dynamic Tools | 없음 | 없음 | 선택적 |

### 우선 추가 대상
1. **6-Layer Architecture SVG** — 전체 시스템 한눈에 보기 (Section 01 상단)
2. **Cross-LLM Ensemble SVG** — Claude + GPT 이중 평가 합의 시각화 (Section 06)

---

## 5. 디자인 원칙 (추출)

1. **Dark-first**: 모든 요소가 #0A0A10 void 위에 떠 있는 결정체
2. **Glow over border**: border 대신 glow(rgba + 0.2 opacity)로 구분
3. **Layer-coded**: 모든 컴포넌트가 6-Layer 컬러 중 하나에 귀속
4. **Monospace for data**: 수치, 수식, 코드는 반드시 Fira Code
5. **Bilingual parallel**: 모든 텍스트에 `lang-ko` + `lang-en` 병렬 배치
6. **Click-to-deepen**: 표면은 간결, 모달에서 상세 — 계층적 정보 공개
7. **Hover-float**: `translateY(-3px/-5px)` + box-shadow로 부유감
