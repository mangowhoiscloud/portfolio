# GEODE Design Concept v2 — "Deep Sea Discovery"

> Created: 2026-03-11
> Status: CONCEPT
> Previous DNA: plans/geode-design-dna.md (v1: "Crystal from Chaos", void black)

---

## 1. Core Narrative Shift

### v1: "Crystal from Chaos" (현재)
어두운 void 속 결정체. 차갑고 기술적. 추상적 시스템 시각화.

### v2: "Deep Sea Discovery"
**심해 탐험가 아홀로틀이 해저에 묻힌 보석(저평가 IP)을 발굴하는 여정.**

캐릭터가 있으면 시스템이 아닌 *이야기*가 된다.
탐험가가 돋보기로 IP를 조사하고, 도구 벨트에서 분석 도구를 꺼내고,
발견한 보석을 수면 위로 올려보내는 — 그 과정이 곧 GEODE의 파이프라인이다.

---

## 2. Mascot — "Geodi" (게오디)

이미지 분석 (GEODE.png):

| 요소 | 설명 | 시스템 매핑 |
|------|------|-----------|
| **핑크 아홀로틀** | 부드러운 분홍/흰색 몸체, 큰 검은 눈 | 에이전트 본체 (L3 Agentic Core) |
| **탐험 헬멧 + 헤드램프** | 채굴 헬멧, 황금빛 램프 | Router — 경로를 비추는 존재 |
| **돋보기** | IP 콘텐츠를 조사 중 | Analyst ×4 — 상세 분석 |
| **도구 벨트 "GEODE"** | 연필, 서류, 다양한 도구 | 21 Tools (ToolRegistry) |
| **외부 아가미 (깃털형)** | 핑크빛 부채형 아가미 6쌍 | 6-Layer 외부 센서 (Signal 수집) |
| **분홍 볼** | 귀여운 볼터치 | 친근한 에이전트 페르소나 |
| **펼쳐진 책/포트폴리오** | IP 일러스트, 차트, 게임 아이콘 | 분석 리포트 (Report Generation) |
| **떠다니는 버블 속 아이콘** | 게임패드, 퍼즐, 보물상자, 해골 | 다양한 IP 장르 (게임, 만화, 애니) |
| **해저 보석 결정** | 황금빛 발광 결정체 | Geode 메타포 — 숨겨진 가치 |
| **산호/해초** | 핑크 산호, 녹색 해초 | 데이터 생태계, 시그널 소스 |
| **모래 바닥** | 따뜻한 샌드톤 | Foundation Layer (L1) |
| **깊은 바다 배경** | 짙은 남색 → 중앙 밝은 청색 그라디언트 | 탐험의 깊이, 분석의 심도 |

---

## 3. Color System v2 — "Ocean Gem Palette"

### Background Depth (v1 → v2)
```
v1 (Void Black)           v2 (Deep Ocean)
#0A0A10 (void)        →   #0B1628 (abyss)
#0E0E18 (primary bg)  →   #0F1F3A (deep sea)
#141422 (secondary)    →   #162D50 (mid ocean)
#181828 (card bg)      →   #1A3352 (card depth)
#1E1E32 (card hover)   →   #1F3D5E (card surface)
```

### Mascot-Derived Accents
| Token | Hex | Source | Usage |
|-------|-----|--------|-------|
| mascot-pink | #F4B8C8 | 아홀로틀 몸체 | 마스코트 관련, 에이전트 행동 |
| mascot-pink-soft | #FFD6E0 | 아가미, 볼 | 호버, 글로우, 소프트 강조 |
| gem-gold | #F5C542 | 해저 보석 결정 | 발견/성과, 핵심 수치, 헤드램프 |
| gem-amber | #FBBF24 | 보석 글로우 | 경고, 드리프트, L5 유지 |
| ocean-deep | #0F1F3A | 배경 최심부 | primary background |
| ocean-mid | #1A3D6E | 배경 중간층 | cards, panels |
| coral-pink | #E87080 | 산호 | Error, critical alerts |
| sand-warm | #D4A574 | 모래 바닥 | 도구 벨트, 보더, 서브텍스트 |
| bubble-teal | #4ECDC4 | 버블 하이라이트 | CLI, Router, 인터랙션 |
| kelp-green | #34D399 | 해초 (L1 유지) | Success, pass, foundation |

### 6-Layer Color Mapping (보존 + 조화)
| Layer | v1 Color | v2 Color | 변경 |
|-------|----------|----------|------|
| L1 Foundation | #34D399 (Emerald) | #34D399 | 유지 (해초/모래) |
| L2 Memory | #60A5FA (Blue) | #60A5FA | 유지 (바다 자체) |
| L3 Agentic Core | #F472B6 (Pink) | #F4B8C8 | **마스코트 핑크로 시프트** |
| L4 Orchestration | #818CF8 (Indigo) | #818CF8 | 유지 (심해 보라) |
| L5 Automation | #FBBF24 (Amber) | #F5C542 | **보석 골드로 시프트** |
| L6 Extensibility | #C084FC (Purple) | #C084FC | 유지 (버블 보라) |

---

## 4. Typography (변경 최소화)

기존 시스템 유지. 변경점:
- **Hero title**: 약간의 text-shadow 추가 (수중 발광 효과)
- **Badge/Label**: sand-warm 배경 → 도구 벨트 질감 느낌
- **Code blocks**: ocean-deep 배경 + bubble-teal syntax 강조

```
Hero Title:    기존 유지 + text-shadow: 0 0 40px rgba(244,184,200,0.3)
Code Badge:    bg: ocean-deep, border: bubble-teal
Stats Value:   color: gem-gold (발견된 보석 느낌)
```

---

## 5. Background Treatment

### Hero Area
```css
background:
  /* 수면 코스틱 패턴 (subtle) */
  radial-gradient(ellipse at 30% 20%, rgba(78,205,196,0.04) 0%, transparent 60%),
  radial-gradient(ellipse at 70% 40%, rgba(244,184,200,0.03) 0%, transparent 50%),
  /* 깊이 그라디언트 */
  linear-gradient(180deg, #0B1628 0%, #0F1F3A 40%, #162D50 100%);
```

### Floating Elements (CSS Animation)
```css
/* 떠다니는 보석 파티클 */
@keyframes float-gem {
  0%, 100% { transform: translateY(0) rotate(0deg); opacity: 0.3; }
  50% { transform: translateY(-20px) rotate(15deg); opacity: 0.6; }
}

/* 버블 상승 */
@keyframes bubble-rise {
  0% { transform: translateY(100vh) scale(0.5); opacity: 0; }
  10% { opacity: 0.4; }
  90% { opacity: 0.2; }
  100% { transform: translateY(-10vh) scale(1); opacity: 0; }
}
```

### Section Depth Zones
```
Hero (수면 근처):     #0B1628 — 가장 밝은 심해
Agentic Engineering: #0F1F3A — 탐험 시작
Section 00-02:       #0F1F3A — 중간 심도
Section 03-05:       #122A48 — 깊은 곳
Section 06-07:       #162D50 — 해저 바닥 (보석 발견 영역)
```

---

## 6. Card & Component Design

### v1 → v2 변경
```
v1 Card:
  bg: #181828
  border: 1px solid rgba(255,255,255,0.06)
  glow: rgba(accent, 0.2)

v2 Card:
  bg: rgba(26,61,110,0.4)          ← 반투명 ocean
  border: 1px solid rgba(78,205,196,0.1) ← bubble-teal hint
  backdrop-filter: blur(8px)        ← 유리질 수중 효과
  glow: rgba(accent, 0.15)
  hover:
    border-color: rgba(244,184,200,0.25) ← mascot-pink
    box-shadow: 0 8px 32px rgba(245,197,66,0.08) ← gem-gold 글로우
    transform: translateY(-4px)
```

### Modal
```
v2 Modal:
  bg: rgba(15,31,58,0.95)           ← ocean-deep, 거의 불투명
  backdrop-filter: blur(20px)
  border: 1px solid rgba(78,205,196,0.15)
  box-shadow: 0 25px 80px rgba(0,0,0,0.5),
              0 0 60px rgba(244,184,200,0.05) ← 마스코트 핑크 글로우
```

---

## 7. Mascot Integration Points

| 위치 | 적용 | 형태 |
|------|------|------|
| **Hero** | 마스코트 이미지 or SVG | 중앙, GEODE 타이틀 위 |
| **Section 구분선** | 마스코트 미니 실루엣 | 돋보기 든 작은 아이콘 |
| **Empty States** | 로딩/탐색 중 | 헤엄치는 아홀로틀 애니메이션 |
| **Footer** | "Discovered by Geodi" | 작은 마스코트 + 텍스트 |
| **모달 헤더** | 각 모달 주제에 맞는 포즈 | Optional, 과도하지 않게 |
| **404/Error** | 길 잃은 아홀로틀 | 어두운 해역에서 헤드램프 켜는 모습 |

---

## 8. Key Visual Metaphors

| GEODE 개념 | 수중 메타포 | 시각화 |
|-----------|-----------|--------|
| 저평가 IP | 해저에 묻힌 geode 결정 | 모래 속 발광 보석 |
| 분석 파이프라인 | 해류 (current flow) | 물결 화살표, 버블 트레일 |
| 도구 사용 | 도구 벨트에서 꺼내기 | 도구 아이콘이 벨트에서 팝업 |
| 점수/등급 | 보석의 빛나는 정도 | S=다이아(강한 발광), C=돌(무광) |
| 재분석 루프 | 해류 역류 (loop current) | 원형 물결 애니메이션 |
| 메모리 | 산호 성장 (축적) | 산호 위에 기록이 새겨지는 모습 |
| Cross-LLM | 두 해류의 합류 | 두 색의 물줄기가 만나는 지점 |
| Guardrails | 산호초 방벽 | 보호 산호가 위험 요소 차단 |
| 신뢰도 게이트 | 수심 측정 (depth gauge) | 게이지가 임계값 넘으면 통과 |

---

## 9. Implementation Strategy

### Phase 1: 배경 전환 (CSS only)
1. body background: void black → ocean gradient
2. Card bg: solid dark → semi-transparent ocean + backdrop-filter
3. 떠다니는 보석/버블 CSS 파티클 추가 (::before/::after)

### Phase 2: 마스코트 통합
1. Hero에 GEODE.png 이미지 배치 (SVG 실루엣 → 실제 이미지)
2. Footer에 마스코트 크레딧
3. Section divider에 미니 아이콘

### Phase 3: 색상 마이그레이션
1. 배경 계열: #0A0A10 → #0B1628 계열로 전환
2. L3 pink: #F472B6 → #F4B8C8 (마스코트 핑크)
3. L5 amber: #FBBF24 → #F5C542 (보석 골드)
4. border-subtle: 기존 → rgba(78,205,196,0.1)

### Phase 4: 인터랙션 강화
1. 카드 호버 시 gem-gold 글로우
2. 모달 오픈 시 수중 블러 효과
3. 스크롤 시 수심 증가 느낌 (배경 색 점진적 변화)

---

## 10. Do / Don't

### Do
- 캐릭터를 보조 역할로 활용 (시스템이 주인공, 캐릭터는 가이드)
- 수중 분위기를 *은은하게* — 과도한 버블/물결 금지
- 기술적 정보의 가독성 최우선
- 기존 6-Layer 컬러 시스템과의 조화
- 보석 메타포로 "발견"의 가치 강조

### Don't
- 유치하게 만들지 않기 — 프로페셔널 포트폴리오
- 캐릭터가 콘텐츠를 가리지 않기
- 배경 애니메이션이 성능 저하 유발하지 않기
- 색상 완전 교체하지 않기 (점진적 시프트)
- 수중 테마를 너무 리터럴하게 해석하지 않기 (물방울 과다 등)
