# GEODE Portfolio PPTX — Build Harness

## 프로젝트
GEODE v0.30 포트폴리오 PPTX. HTML → html2pptx.js → PptxGenJS 파이프라인.
작업 디렉토리: `/Users/mango/workspace/portfolio/geode/`

## CAN — 서술 원칙
- **각 슬라이드 = 하나의 내러티브 시각화** — 키워드 나열이 아닌 흐름도/인과 시각화
- 인과관계로 서술: "X 때문에 Y를 선택했고, Z가 나왔다"
- 문제 인식 → 탐색/설계 → 결과 구조 (STAR)
- 구체적 숫자를 강조: "50 rounds", "5가지 종료", "200 turns", "80%/95%"
- Trade-off는 before/after 대비: "X였는데 Y로 바꿨더니 Z"
- 다이어그램은 DAG 수준: 의사결정 분기, 루프백, 상태 전이 포함
- 다이어그램 슬라이드는 v028 PNG 또는 Mermaid→Sharp PNG 재활용
- Result 숫자는 accent color + bold로 강조
- 코드 경로는 Courier New 8pt로 1회만 표기

## 내러티브 품질 기준
**plans/sot-master-narrative.md**가 최상위 서술 SOT.
각 슬라이드는 이 수준의 인과관계 서술을 시각화해야 함.

예시 (N1 AgenticLoop):
> "LLM이 tool_use를 반환하는 한 최대 50 라운드까지 루프를 계속하고,
> 자연 종료(end_turn), 수렴 감지(동일 에러 4회 반복),
> 강제 텍스트(잔여 2라운드)까지 5가지 경로로 종료합니다."

이 수준의 디테일이 시각 요소(화살표, 분기, 숫자 뱃지)로 표현되어야 함.
"AgenticLoop: while(tool_use)" 같은 제목+키워드 박스만으로는 부족함.

## CANNOT — 절대 금지
### 타이포그래피
- **5pt 미만 텍스트 금지**
- 내부 서술 본문은 7-10pt. 캡션/푸터만 5-6pt 허용
- 괄호 안 스펙 3개 이상 나열 금지
- em dash(—) 2개 이상 연속 금지

### 레이아웃
- 한 슬라이드에 카드 6개 초과 금지 — 넘으면 슬라이드 분리
- ul/li 5개 초과 금지 — 넘으면 그룹핑
- padding 6pt 미만 금지
- gap 4pt 미만 금지
- border-radius 4pt 미만 금지

### html2pptx 제약
- CSS gradient (linear-gradient, radial-gradient) 금지
- bullet 기호(•, -, *) in `<p>` 금지 → `<ul><li>` 사용
- `background-image` on `<div>` 금지 → `<img>` 사용
- `<div>Text</div>` 금지 → 반드시 `<p>`, `<h1>`-`<h6>`, `<ul>`, `<ol>` 안에 텍스트

### 다이어그램
- 단순 박스형 배치 전면 금지 — 화살표 흐름, 분기, 루프백, 상태 전이가 있는 DAG로
- 텍스트로만 플로우 표현 금지 — v028 PNG 재활용 또는 Mermaid→Sharp PNG 렌더링
- 박스 안에 키워드만 넣는 카드 그리드 금지 — 각 박스는 인과관계 1문장 이상 포함

### 내러티브
- 키워드 나열 금지 — "AgenticLoop, SubAgent, Tools" 식 나열은 발표가 아님
- 스펙 시트 금지 — "MAX=5, depth=2, timeout=120s" 테이블만으로는 부족
- 반드시 **왜 이 설계인가**를 1문장 이상 포함 (문제→선택→결과)

## 타이포그래피 기준

| 역할 | 크기 | 색상 | 비고 |
|------|------|------|------|
| 슬라이드 제목 | **14-16pt** | #FFFFFF | bold |
| 섹션 라벨 | **8-10pt** | accent color | bold, 좌측 바 옆 |
| 본문/서술 | **7-10pt** | #E2E8F0 | **핵심 기준** |
| 캡션/출처 | **5-6pt** | #8B949E | 허용 최소 |
| 코드/경로 | **7pt** | accent color | Courier New |
| 푸터 | **5pt** | #8B949E | 슬라이드 번호 |
| 숫자 강조 | **18-24pt** | accent color | bold, 카드 중앙 |

**5pt 미만 텍스트 금지. 정보 밀도와 가독성의 균형.**

## 레이아웃 기준

| 요소 | 최소 | 권장 |
|------|------|------|
| body padding (좌우) | 24pt | 36pt |
| 카드 padding | 8pt | 10-12pt |
| 카드 간 gap | 6pt | 8pt |
| border-radius | 4pt | 6pt |
| 섹션 바 (좌측) | 4pt width | accent color |
| 카드 최대 개수 | — | 4-6개/슬라이드 |
| 다이어그램 이미지 | 300pt wide | 450pt wide, 가용 높이에 맞춤 |

## 색상 체계

| 역할 | Hex | 용도 |
|------|-----|------|
| bg-primary | #0D1117 | 슬라이드 배경 |
| bg-card | #161B22 | 카드/컨테이너 |
| bg-elevated | #1E293B | 강조 박스 |
| text-primary | #E2E8F0 | 본문 |
| text-secondary | #8B949E | 보조, 캡션 |
| border | #21262D | 카드 테두리 |

### 섹션 accent
| 파트 | Hex | 이름 |
|------|-----|------|
| HE-0 SCAFFOLDING | #818CF8 | Indigo |
| HE-1 AUTONOMOUS | #4ECDC4 | Cyan |
| HE-2 DOMAIN | #F5C542 | Amber |
| CONNECTION | #34D399 | Emerald |
| Hook System | #F97316 | Orange |
| Error/Security | #EF4444 | Red |

## 슬라이드 HTML 템플릿

```html
<!DOCTYPE html>
<html lang="ko">
<head>
<meta charset="UTF-8">
<style>
* { margin: 0; padding: 0; box-sizing: border-box; }
body {
  width: 720pt; height: 405pt;
  margin: 0; padding: 0;
  font-family: Arial, Helvetica, sans-serif;
  background: #0D1117; color: #E2E8F0;
  display: flex; flex-direction: column;
  overflow: hidden;
}
</style>
</head>
<body>
  <!-- Header: 섹션 바 + 라벨 -->
  <div style="display: flex; align-items: center; padding: 10pt 36pt 6pt; gap: 6pt;">
    <div style="width: 4pt; height: 16pt; background: {ACCENT}; border-radius: 2pt;"></div>
    <p style="font-size: 10pt; font-weight: bold; color: {ACCENT};">{SECTION}</p>
  </div>

  <!-- Title -->
  <div style="padding: 0 36pt 8pt;">
    <h1 style="font-size: 20pt; font-weight: bold; color: #FFFFFF;">{TITLE}</h1>
    <p style="font-size: 9pt; color: #8B949E; margin-top: 4pt;">{SUBTITLE}</p>
  </div>

  <!-- Content -->
  <div style="flex: 1; padding: 0 36pt; display: flex; gap: 8pt;">
    <!-- 카드/다이어그램 배치 -->
  </div>

  <!-- Footer -->
  <div style="padding: 6pt 36pt 8pt; display: flex; justify-content: space-between;">
    <p style="font-size: 7pt; color: #8B949E;">{FOOTER_TEXT}</p>
    <p style="font-size: 7pt; color: #8B949E;">{NN} / 24</p>
  </div>
</body>
</html>
```

## 다이어그램 제작 방법 (v028 역추적 결과)

### 방법 1: v028 PNG 재활용 (권장, 빠름)
```
slides/assets/v028-diagram-3tier.png      → S08 Architecture
slides/assets/v028-diagram-agentic-loop.png → S09 Agentic Loop
slides/assets/v028-diagram-pipeline-dag.png → S19 Game IP Pipeline
slides/assets/v028-diagram-policy-chain.png → S17 PolicyChain
```
이미지 비율: 2580×1200 (2.15:1). HTML에서:
```html
<img src="assets/v028-diagram-3tier.png"
     style="width: 450pt; height: 209pt; border-radius: 4pt;">
```

### 방법 2: React XyFlow → Playwright → Sharp 3× (고품질)
v028 원본 방법. `src/components/geode/*-diagram.tsx` 컴포넌트를 Playwright로 스크린샷, Sharp 3× 업스케일.
```bash
# 1. Next.js dev 서버에서 다이어그램 페이지 열기
# 2. Playwright screenshot (860×400 viewport)
# 3. Sharp 3× upscale → 2580×1200 PNG
```

### 방법 3: Mermaid CLI → Sharp (중간 품질)
```bash
mmdc -i diagram.mmd -o diagram.svg -t dark -b '#0D1117'
node -e "sharp('diagram.svg').png().toFile('diagram.png')"
```

## 빌드 파이프라인

```bash
# 빌드
rm -rf slides/tmp
NODE_PATH=/opt/homebrew/lib/node_modules node build.js

# 썸네일 검증
python3 /Users/mango/.claude/skills/pptx/scripts/thumbnail.py \
  GEODE-Portfolio-v030.pptx slides/check --cols 4

# 고해상도 특정 슬라이드 확인
soffice --headless --convert-to pdf GEODE-Portfolio-v030.pptx
pdftoppm -jpeg -r 200 -f N -l N GEODE-Portfolio-v030.pdf slide
```

## SOT 참조 (plans/)

| 파일 | 대상 슬라이드 | 크기 |
|------|-------------|------|
| sot-s01-s03-opening.md | Cover, Triple Loop, Mirror | 25KB |
| sot-s04-s07-scaffold.md | CANNOT, 8-Step, Frontier, Velocity | 31KB |
| sot-s08-s10-core.md | Architecture, Loop, Hook | 35KB |
| sot-s11-s15-agent-detail.md | Orch, Memory, Compress, SubAgent, Tools | 46KB |
| sot-s16-s24-remaining.md | Gateway~Closing | 46KB |
| **sot-hook-system-deep.md** | Hook System 전용 (45 events) | **36KB** |
| **sot-tool-dispatch.md** | Tool Dispatch 전용 (5-tier safety) | **55KB** |
| dag-method-analysis.md | 다이어그램 제작 방법론 | 14KB |

## 참조 스킬
- `pptx`: PPTX 생성/편집 전체 워크플로우
- `pptx-html-authoring`: HTML→PPTX 변환 규칙, 금지사항, placeholder
- `portfolio-pptx-pipeline`: Sharp 3× SVG → HTML → PPTX 빌드
- `svg-diagram-pptx`: SVG 비율 계산, 교차 검증
- `codebase-slide-accuracy`: 코드 실측 기반 정합성
- `mermaid-diagrams`: LangGraph 스타일 Mermaid 다이어그램 생성
