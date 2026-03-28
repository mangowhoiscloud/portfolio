# V1 Review -- 7-Person Team Feedback

> 26 slides reviewed: s01-cover through s25-timeline (including s22a, s22b)
> Reference: CLAUDE.md design rules, sot-master-narrative.md, sot-resume-narratives.md

---

## 1. GEODE 개발자 (류지환 본인 시점 -- 정확성)

### 정확한 점
- AgenticLoop while(tool_use) 패턴, 5가지 종료 경로, 200 turns sliding window, 80%/95% 임계값 -- 모두 정확
- 5-Tier 안전 등급(SAFE/MCP auto/EXPENSIVE/WRITE/DANGEROUS) 분류와 asyncio.gather 병렬/순차 실행 로직 정확
- CircuitBreaker 3-state(CLOSED/OPEN/HALF-OPEN) 상태 머신과 5회 연속 실패 -> 60s OPEN 스펙 정확
- PolicyChain 6-Layer AND-logic, Org priority=5 최우선 -- 정확
- DomainPort Protocol ContextVar DI, @runtime_checkable 구조적 타이핑 -- 정확
- 4096-token guard, MAX_CONCURRENT=5, CoalescingQueue 250ms dedup -- 정확
- Bash 3-Layer 보안(9 regex + setrlimit + HITL), Secret Redaction 8패턴 -- 정확
- REODE 실증 수치(241 소스, 103K LoC, 33 세션, 1,133 라운드, 83/83 빌드) -- 이력서와 일치

### 부정확/불일치 사항
- **s01 커버**: 185 modules vs s09: 185 vs s23: 184 vs s19: 221 -- 숫자 불일치. 이력서 SOT는 "221 모듈". 커버에서 가장 눈에 띄는 지표이므로 통일 필수
- **s01 커버**: 3,219+ Tests vs s23: 3,159 테스트 함수 vs 이력서: 3,181 테스트 -- 3가지 다른 숫자. 어느 것이 최신 SOT인지 명확하지 않음
- **s01 커버**: 38 Releases vs s08: 35 releases vs s23: 25 semver 릴리스 vs s19: 32 릴리스 무회귀 -- 4가지 다른 릴리스 수. 심각한 불일치
- **s01 커버**: 1,118 Commits vs s08: 1,118 커밋 -- 일치하지만, s05: 486 PRs와의 관계가 불명확 (1,118 commits가 486 PRs에서 나온 것인지)
- **s01 커버**: 52 tools + 41 MCP vs s02: 54 tools x 50 rounds vs s03: 52 native + 41 MCP vs s11: 52 native tools / 44 catalog vs s23: 54 Tools / 44 MCP -- tools 수가 52와 54 사이에서 흔들림. MCP도 41과 44 사이에서 불일치
- **s02**: "40-Event Hook Observer" vs s04: "40 events" vs s09: "45 events / 17 handlers" vs s12: "45-Event Bus" / "6 CORE EVENT CATEGORIES" -- Hook 이벤트 수가 40과 45 사이에서 혼재. 이력서는 "36 Event Hooks"라고 기재
- **s04**: CLAUDE.md 425줄 / 17 CANNOT 규칙 -- s05에서도 17 CANNOT으로 일치하지만, 실제 CLAUDE.md 줄 수 검증 필요
- **s08**: Phase 3에서 v0.13.0 / v0.15.0 언급 -- 피봇 타이밍이 s25 타임라인과 정합하는지 검증 필요. s25에서는 "v0.8 PIVOT"으로 피봇 시작점을 표기하여 불일치 가능
- **s09**: 제목 "6-Layer Architecture" + Hook Cross-cutting "45 events" vs SOT N7은 "27->45 Events" -- 현재 값은 맞으나 변천 과정 서술 부재
- **s12**: "6 CORE EVENT CATEGORIES"를 보여주면서 3+4+5+3+3+3=21 events만 표시 -- 45개 이벤트 중 나머지 24개가 어떤 카테고리인지 불명
- **s14**: "gpt-5.4 -> gpt-5.3 -> gpt-4o" -- 미래 모델명. 이력서/SOT에서는 "GPT-5.4->5.3->4o"로 되어 있어 일관성은 있으나, 실제 존재하지 않는 모델을 명시적으로 사용
- **s15**: 4-Tier Memory에서 Session이 "Tier 3 -- 최우선"이고 SOUL이 "Tier 0" -- Tier 번호가 직관과 반대 (높은 Tier가 우선). 혼란 가능
- **s19**: DomainPort "15 메서드, 6 카테고리" vs s09 푸터: "DomainPort Protocol 12 methods" -- 12 vs 15 불일치
- **s23**: 관측 섹션에서 "36-Event Hook Observer" -- s12에서는 45 events라고 했는데 여기서 다시 36으로 돌아감

### 추가해야 할 시스템
- **Eco2 Cross-Reference**: 이력서 SOT에 있는 Swiss Cheese LLM Evaluation -> GEODE 5-Layer 진화 스토리, LLMClientPort 추상화 -> Port/Adapter DI 패턴 재사용 증거가 전혀 없음
- **harness-for-real 해커톤 전략**: 이력서에 있는 Socratic Phase, typecheck+lint backpressure hooks, 70% 테스트 비율, LEARNINGS.md, 토큰 예산 하드스톱 -- 별도 슬라이드 또는 기존 슬라이드 보강 필요
- **5-Gate Migration Scorecard (REODE)**: s19에서 간략히 언급하지만, 테스트 삭제/skipTests/JDK 다운그레이드/@SuppressWarnings 주입 차단 등 구체적 Gate 내용 부재
- **macOS Seatbelt 샌드박스**: REODE의 34-패턴 deny-list, 3-Level Permission이 전혀 언급되지 않음
- **OpenRewrite 70% + LLM 30% 분리 전략**: REODE의 핵심 설계 결정인데 빠져 있음

---

## 2. 하네스 채용 담당자 (설득력)

### 강점
- **Opening Thesis 강력**: "확률적 시스템은 제어 없이 발산합니다" -- 한 문장으로 문제와 포지셔닝이 명확
- **4-Axis Framework (s02)**: 복잡한 시스템을 4개 축으로 정리한 프레이밍이 인상적. 채용 담당자가 "이 사람은 전체 아키텍처를 설명할 수 있다"고 판단할 수 있음
- **CANNOT/CAN (s05)**: 제약 기반 품질 관리가 구체적. 486 PRs, 0 regressions는 강력한 proof point
- **Domain Portability (s19)**: "core 코드 변경 0줄"로 GEODE->REODE 전환 -- 아키텍처 설계 능력의 최강 증거
- **REODE 실증 수치**: 241 소스, 103K LoC, 83/83 빌드 통과 -- 구체적이고 검증 가능한 결과
- **숫자가 대담함**: 35일, 1,118 커밋, 185 모듈, 3,219 테스트 -- 생산성을 수치로 증명

### 약점
- **자기소개 부재**: s01에 이름(류지환)과 직함/역할이 없음. 누구의 포트폴리오인지 커버에서 즉시 파악 불가
- **"So What?" 부재**: 기술적으로 인상적이지만 "이 시스템이 실제로 어떤 비즈니스 가치를 만드는가?" 질문에 대한 답이 약함. Game IP 분석이 넥슨에서 어떤 의사결정을 바꿀 수 있었는지, 코드 마이그레이션이 몇 인-월을 절약했는지
- **너무 내부적**: 초반 7슬라이드(s01-s07)가 모두 SCAFFOLDING 섹션. 채용 담당자는 "이 사람이 만든 제품"을 먼저 보고 싶은데, 개발 프로세스부터 7장이나 설명함
- **피봇 스토리 활용 부족**: "면접 탈락 -> 자율 피봇"은 s25 타임라인에 한 줄인데, 이것이야말로 가장 인간적이고 설득력 있는 내러티브. 더 앞에서 강조해야 함
- **차별화 포인트 불명확**: "Harness Engineering"이 이 사람만의 고유한 방법론인지, 업계 일반 용어인지 구분이 안 됨. 다른 후보와 뭐가 다른지 한 문장이 없음

### 개선 제안
1. s01 커버에 이름과 1줄 포지셔닝 추가: "류지환 -- Harness Engineer"
2. s01-s03 사이에 "이 하네스가 만든 결과물" 데모/스크린샷 1장 삽입
3. s08 Velocity 또는 s19 Domain Portability를 앞으로 이동 -- "결과를 먼저, 과정은 나중에"
4. Eco2->GEODE->REODE 진화 스토리를 1장으로 요약 -- 패턴 재사용 능력 증명
5. 비즈니스 임팩트 숫자 추가: "X 인-월 절약", "Y% 정확도 향상이 의사결정에 미친 영향"

---

## 3. 시니어 하네스 개발자 (기술 깊이)

### Trade-off 분석 평가
- **우수**: s11 Tool Dispatch의 "Tier 0-1 병렬 vs Tier 3-4 순차" trade-off가 명확. 속도와 안전의 양립 근거가 코드 수준에서 제시됨
- **우수**: s13 Sub-Agent의 4096-token guard -- "상속은 완전히 하되 출력만 제어" 전략의 타당성이 명확
- **우수**: s17 MCP 단순화의 "제어 vs 탐색 자유도" -- MCPRegistry 삭제 결정의 근거가 있음
- **우수**: s20 Security의 "safe-first 허용 시 파이프 주입 통과" -- 보안에서 의도적으로 허용하는 취약점과 대응 Layer 명시
- **우수**: s22a/22b의 16가지 설계 결정 -- 각각 [채택] vs [기각]과 1줄 근거 제공
- **부족**: s14 LLM Failover에서 "왜 3 Provider인가?" -- 2개가 아닌 3개인 이유, 특히 ZhipuAI(GLM-5)를 최후 보루로 선택한 근거가 약함. 80K context 제한이 있는 모델이 왜 fallback으로 적합한지
- **부족**: s16 PromptAssembler에서 "6-Phase가 왜 6개인가?" -- 5개(template/override/skill/memory/bootstrap) + SHA-256인데 SHA-256이 Phase인지 후처리인지 애매

### 설계 판단 근거 평가
- **명확**: while(tool_use) 패턴의 Claude Code 참조 출처 명시
- **명확**: BiasBuster의 arXiv:2403.00811 인용
- **명확**: Karpathy P6/P7 패턴 참조
- **불명확**: Krippendorff's alpha >= 0.67 임계값의 근거. 왜 0.67인지 (학술적으로 "fair to good agreement"이지만 0.80이 "reliable"인데 왜 0.67을 선택했는지)
- **불명확**: Confidence Gate >= 0.7 임계값의 튜닝 근거. 어떤 실험으로 0.7이 최적임을 확인했는지
- **불명확**: MAX_ROUNDS=50의 근거. Claude Code가 그렇게 하니까? 실제 작업에서 50라운드가 필요한 적이 있는지, 평균 몇 라운드에서 종료되는지

### 빠진 기술적 디테일
- **비용 효율 분석**: TokenTracker를 만들었다고 하는데, 실제 세션당/월간 비용 데이터가 단 하나도 없음. "$X/session", "캐시로 Y% 절감"의 실측 수치가 필요
- **성능 벤치마크**: 9-Node DAG 실행 시간, 서브에이전트 병렬 실행 시 총 latency, CircuitBreaker 발동 빈도 등 운영 수치 전무
- **테스트 전략**: 3,219개 테스트의 구성 (unit/integration/e2e 비율, fixture vs live 비율)에 대한 설명 부재
- **모델 선택 근거**: 18개 모델 가격 레지스트리를 만들었지만, 어떤 작업에 어떤 모델을 쓰는지의 routing 로직 설명 부재
- **컨텍스트 압축 효과**: "Lossless Selection으로 정보 손실 없이 0.03%"라는 SOT 서술이 슬라이드에 반영되지 않음

---

## 4. OpenClaw 개발자 (Peter Steinberger 시점 -- 운영 안정성)

### Session Isolation 평가
- **긍정적**: ChannelBinding의 계층형 세션 키(gateway:ch:id:sender:thread) 설계가 견고. 스레드별 독립 컨텍스트 -- 동시 대화 격리의 핵심
- **긍정적**: 서브에이전트의 IsolatedRunner + ThreadPoolExecutor -- 부모 컨텍스트 오염 방지
- **긍정적**: AgentMemoryStore 24h TTL -- 세션 데이터 자동 정리로 메모리 누수 방지
- **우려**: Echo Prevention이 "subtype + _last_ts" 메모리 기반 dedup -- 프로세스 재시작 시 dedup 상태 소실. 짧은 시간 내 재시작하면 중복 메시지 처리 가능
- **우려**: geode serve hitl_level=0 "완전 자율" 모드에서의 격리가 충분한지. 채널 간 세션이 메모리를 공유하지 않는지 명시적 보장이 슬라이드에 없음
- **누락**: Atomic write 패턴 적용 여부. OpenClaw의 핵심인 "tmp+rename" 패턴이 메모리 파일 쓰기(MEMORY.md, LEARNINGS.md)에 적용되는지 언급 없음

### Failover 평가
- **우수**: Provider별 독립 CircuitBreaker -- 하나의 Provider 장애가 다른 Provider에 영향을 주지 않음
- **우수**: Retryable vs Non-retryable 에러 분류와 Exponential Backoff +/-25% Jitter -- Thundering Herd 방지의 정석
- **우수**: "메모리가 모델에 종속되지 않는다" -- Failover 시 세션 학습 유지는 핵심 설계
- **우려**: HALF-OPEN 프로브가 1회인데, 프로브 실패 시 다시 OPEN으로 돌아가는 전체 사이클이 무한 반복될 수 있음. backoff 배수 증가(60s -> 120s -> 240s)가 있는지 불명
- **누락**: Failover 발동 시 사용자에게 알리는 메커니즘. "현재 Anthropic -> OpenAI로 전환됨" 같은 투명성 부재

### Plugin 확장성 평가
- **우수**: DomainPort Protocol @runtime_checkable -- 상속 없이 15개 메서드 구현으로 호환. Go interface 스타일의 구조적 타이핑
- **우수**: ContextVar DI -- 스레드 안전 교체. set_domain() / get_domain_or_none() fallback 패턴
- **우수**: GEODE -> REODE "core 코드 변경 0줄" -- 실증이 가장 강력한 증거
- **우려**: 15 methods가 너무 많을 수 있음. 새 도메인 추가 시 15개 메서드 모두 구현해야 하는 부담. Optional/default 구현 제공 여부 불명
- **우려**: MCP 44개 서버의 auto-discovery가 어떻게 작동하는지 구체적 메커니즘 부재. config.toml 기반이면 "auto"가 아니라 "declarative"에 가까움
- **제안**: Plugin marketplace/registry 개념이 있는지. 새 도메인 어댑터의 테스트 프레임워크/scaffold가 있는지

---

## 5. 디자이너 (시각)

### 일관성
- **색상 체계 일관**: bg-primary #0D1117, bg-card #161B22, accent 색상(Indigo/Cyan/Amber/Emerald/Orange/Red) 전 슬라이드에서 일관 적용
- **섹션 라벨 바 일관**: 좌측 4pt 세로 바 + 섹션 라벨 패턴이 s01(커버 제외) 전체에 걸쳐 통일
- **폰트 크기 체계 일관**: 제목 16pt, 섹션 라벨 9pt, 본문 7-8pt, 캡션 5-6pt -- CLAUDE.md 기준 준수
- **비일관**: 섹션 라벨 표기가 "HE-0: SCAFFOLDING" / "HARNESS ENGINEERING" / "HE-1: AUTONOMOUS CORE" / "HE-1: AUTONOMOUS AGENT" / "HE-1: AUTONOMOUS" 등으로 불통일. 특히 s11/s12/s13/s14/s15의 라벨이 "HE-1: AUTONOMOUS AGENT" vs "HE-1: AUTONOMOUS CORE" vs "HE-1: AUTONOMOUS"로 3가지
- **비일관**: s01 커버의 패딩이 56pt (다른 슬라이드는 36pt). 의도적 차별화일 수 있으나, 시리즈 내 패딩 불일치

### 정보 계층
- **우수**: s02 4-Axis의 4컬럼 + 하단 연결 흐름 바 -- 계층이 명확하고 시각적 흐름이 자연스러움
- **우수**: s10 AgenticLoop의 다이어그램 + 우측 사이드바(5가지 종료 + 컨텍스트 3단계) -- 좌측 시각/우측 텍스트 분리 효과적
- **우수**: s21 CANNOT->Result의 4쌍 대비 구조 -- 인과관계가 한눈에 보임
- **문제**: s20 Security + Gateway가 정보 과밀. PolicyChain 다이어그램 + Bash 3-Layer + Trade-off + Secret Redaction + Gateway + PolicyChain 원칙 + Dual Trust Model -- 7개 정보 블록이 하나의 슬라이드에 있어 시선 분산
- **문제**: s22a/s22b Trade-off 슬라이드가 텍스트 목록에 가까움 -- 시각적 차별화가 약하고 "카드 나열"에 가까워 CLAUDE.md의 "키워드 나열 금지" 원칙에 위배될 수 있음

### 개선 필요 슬라이드
1. **s20 Security + Gateway** -- 2장으로 분리 필수. Security(Bash + Secret + PolicyChain)와 Gateway(Channel + Session + Serve) 각각 1장
2. **s22a/s22b Trade-offs** -- 카드 나열이 아닌, 2-3개 핵심 결정만 뽑아 before/after 대비 시각화. 나머지는 Appendix
3. **s04 Mirror Table** -- 좌/우 5행 + 중앙 스파인 구조가 조밀. 핵심 3쌍만 남기고 나머지 축소
4. **s17 MCP + TokenTracker** -- 두 주제를 한 슬라이드에 넣어 양쪽 모두 깊이 부족. 분리 권장
5. **s07 Frontier Mining + 4-Persona** -- 8개 카드(4 소스 + 4 페르소나)로 CLAUDE.md "카드 6개 초과 금지" 위반

---

## 6. 프론트엔드 개발자 (기술)

### HTML 구조 이슈
- **`<div>Text</div>` 패턴 위반**: CLAUDE.md는 "div 안에 직접 텍스트 금지 -> p, h1-h6, ul, ol 안에 텍스트"를 규정. 현재 모든 슬라이드에서 이 규칙은 준수되어 있으며, p/h1 태그를 올바르게 사용
- **CSS gradient 금지 준수**: linear-gradient/radial-gradient 미사용 확인
- **background-image 금지 준수**: img 태그로 이미지 사용 확인
- **s01**: bg-cover.png에 opacity 1.0 -- 배경 이미지가 콘텐츠 위에 있을 수 있음. z-index 미지정으로 렌더링 순서 의존. position: relative가 body에 있지만 이미지에는 position: absolute만 있어 html2pptx에서 올바르게 변환되는지 불확실
- **s24**: bg-cover.png opacity 0.08 -- 매우 낮은 불투명도로 거의 보이지 않을 것. 의미 있는 시각적 효과인지 의문
- **s16/s17**: body에 margin/padding 선언이 없음 -- 다른 슬라이드와 달리 body에 `margin: 0; padding: 0;` 누락. html2pptx 파서에 따라 차이 발생 가능

### 레이아웃 이슈
- **s07**: 카드 8개 (4 소스 + 4 페르소나) -- CLAUDE.md "카드 6개 초과 금지" 위반
- **s12**: `flex: 0 0 384pt` 고정 너비 + `flex: 1` 가변 너비 조합 -- 720pt body에서 36pt x 2 패딩 + 10pt gap = 638pt 가용. 384pt + 가변 = 254pt. 비율이 60:40으로 의도적이지만 우측이 좁을 수 있음
- **s11**: `flex: 0 0 418pt` -- 좌측에 58% 할당. 우측이 약 230pt로 상당히 좁음. Error Recovery Chain의 4행이 이 폭에 들어가는지 검증 필요
- **s20**: 좌측 `flex: 1.3` + 우측 `flex: 1` -- 이미지(360pt)와 카드가 함께 있는 레이아웃에서 수직 overflow 위험
- **overflow: hidden**: 모든 슬라이드에 body overflow: hidden이 있어 내용 잘림이 감지되지 않을 수 있음. 특히 s20, s12처럼 정보가 많은 슬라이드에서 하단 내용 잘림 위험
- **s02**: `#161B2280` (16진 알파 채널) -- html2pptx가 8자리 hex color를 지원하는지 불확실. `#161B22` + 별도 opacity가 더 안전
- **s05**: `flex: 11` / `flex: 6` -- 비율 의도(약 65:35)이지만, 일반적으로 flex: 1.1 / flex: 0.6이 더 명확
- **폰트 최소 크기**: 전반적으로 5pt 텍스트가 많이 사용됨 (CLAUDE.md 허용 최소). 프로젝터에서 5pt는 사실상 읽을 수 없음

### html2pptx 특이 사항
- 여러 슬라이드에서 `border: 1pt solid #21262D40` (40 = 25% alpha) 사용 -- html2pptx에서 border alpha 지원 여부 확인 필요
- `align-self: center` 다수 사용 -- html2pptx의 flexbox align-self 지원 확인 필요
- `min-height: 0` 다수 사용 -- flexbox overflow 방지 패턴이지만 html2pptx가 이를 올바르게 처리하는지
- `gap` 속성 전반적 사용 -- html2pptx의 flex gap 지원이 핵심

---

## 7. PPTX 뷰어 (발표 전문가)

### 흐름 평가
- **구조**: HE-0 SCAFFOLDING(s02-s08) -> HE-1 AUTONOMOUS CORE(s09-s17) -> HE-2 DOMAIN(s18-s19) -> Security(s20) -> Connection(s21-s22b) -> Summary+Closing(s23-s24) -> Timeline(s25)
- **문제: 역순 흐름**: 일반적인 발표는 "What(결과) -> How(방법) -> Why(근거)" 순서인데, 이 PPT는 "How(스캐폴딩 방법론) -> How(코어 아키텍처) -> What(도메인 적용)" 순서. 청중은 처음 7장 동안 "이 시스템이 뭘 하는 건데?"라는 질문을 안고 감
- **문제: 클라이맥스 실종**: 가장 인상적인 결과(REODE 83/83, 0줄 코어 변경)가 s19에 있는데, 이는 전체 흐름에서 너무 뒤에 위치
- **문제: s25 Timeline이 마지막**: 피봇 스토리(면접 탈락 -> 자율 전환)가 가장 마지막에 있어 감정적 임팩트가 사라짐. 이것을 s02-s03 부근으로 이동하면 "역경 -> 성장 -> 결과" 내러티브가 됨
- **좋은 점**: s01 Opening Thesis가 강력하고, s24 Closing이 동일 thesis를 콜백하며 원형 구조를 형성
- **좋은 점**: s21 CANNOT->Result가 전반부(규칙)와 후반부(구현)를 연결하는 좋은 브릿지

### 정보 과밀/과소
- **과밀 슬라이드**:
  - s04 Mirror Table: 좌우 5행 + 중앙 스파인 = 11개 정보 블록
  - s07 Frontier + Persona: 8개 카드
  - s20 Security + Gateway: 7개 정보 블록 + 이미지
  - s22a/s22b: 각 8개 trade-off 항목
- **과소 슬라이드**:
  - s08 Velocity: 바 차트 + Phase 3 패널만. 나머지 5개 Phase의 스토리가 없어 바 차트가 맥락 없이 숫자만 나열
  - s10 AgenticLoop: 다이어그램 의존도 높음. 다이어그램 없이는 내용 전달 불가. 다이어그램 이미지가 누락되면 슬라이드 무용
  - s09 Architecture: 동일 -- 다이어그램 의존도 과도
- **적정 슬라이드**: s02, s03, s05, s06, s11, s13, s14, s16, s19, s21, s23, s24

### 청중 인지 부하
- **높음**: s02 -> s03 -> s04 연속 3장이 모두 "전체 구조" 수준의 추상화. 청중이 3장 연속 개요를 보면 "언제 구체적인 걸 보여주나" 피로감 발생
- **높음**: s09 -> s10 -> s11 -> s12 -> s13 연속 5장이 HE-1 AUTONOMOUS CORE 상세. 중간에 숨 쉴 공간(recap이나 데모)이 없음
- **높음**: s22a/s22b의 16가지 trade-off를 연속 발표하면 인지 과부하. "어떤 것이 중요하고 어떤 것이 덜 중요한지" 우선순위 없이 나열
- **제안**: 5-7장마다 "1장 요약 / 브릿지" 슬라이드를 삽입하여 인지 부하 분산. 예: s08 Velocity 후 "여기까지가 스캐폴딩. 이제 이 위에 만든 자율 실행 코어를 봅니다" 한 장

---

## 합의 -- V2 액션 아이템 (우선순위 순)

1. **[CRITICAL] 숫자 불일치 전면 통일** -- modules(185/184/221), tests(3,219/3,181/3,159), releases(38/35/32/25), tools(52/54), MCP(41/44), hook events(36/40/45), DomainPort methods(12/15) 모두 하나의 SOT로 통일. 커버(s01), 요약(s23), 이력서(sot-resume-narratives.md) 세 곳이 일치해야 함

2. **[CRITICAL] 슬라이드 순서 재구성** -- 현재: Scaffolding 7장 -> Core 9장 -> Domain 2장 -> Closing 4장. 제안: Cover -> Thesis + Timeline(피봇 스토리) -> 4-Axis Overview -> Architecture + Loop(결과 먼저) -> REODE 실증 -> Scaffolding(어떻게) -> Domain Detail -> Security -> Trade-off -> Closing

3. **[CRITICAL] s01 커버에 발표자 이름/역할 추가** -- 누구의 포트폴리오인지 즉시 식별 가능해야 함

4. **[HIGH] s20 Security+Gateway를 2장으로 분리** -- 정보 과밀. Security(Bash+Secret+PolicyChain) 1장 + Gateway(Channel+Session+Serve) 1장

5. **[HIGH] s17 MCP+TokenTracker를 2장으로 분리** -- 두 주제가 각각 충분한 깊이를 가짐

6. **[HIGH] s07 카드 8개 -> 6개 이하로 축소** -- CLAUDE.md "카드 6개 초과 금지" 준수. Frontier 4소스를 2개로 합치거나, Persona를 별도 슬라이드로

7. **[HIGH] 섹션 라벨 통일** -- "HE-1: AUTONOMOUS CORE" vs "HE-1: AUTONOMOUS AGENT" vs "HE-1: AUTONOMOUS" -> 하나로 통일

8. **[HIGH] Eco2/REODE Cross-Reference 슬라이드 추가** -- 패턴 재사용 증거(Swiss Cheese -> 5-Layer, LLMClientPort -> Port/Adapter, Event Bus -> HookSystem)를 1장에 정리

9. **[HIGH] 비즈니스 가치/임팩트 수치 보강** -- "이 시스템이 실제로 무엇을 바꾸었는가"를 숫자로. TokenTracker 실측 비용, 캐시 절감률, 분석 정확도 개선율 등

10. **[MEDIUM] 8자리 hex color (#RRGGBBAA) -> 6자리 + 별도 opacity** -- html2pptx 호환성 보장

11. **[MEDIUM] s22a/s22b Trade-off 슬라이드 시각화 개선** -- 텍스트 나열 -> before/after 대비 또는 의사결정 트리 형태로

12. **[MEDIUM] 다이어그램 의존 슬라이드(s09, s10, s18, s20) 대체 콘텐츠** -- 이미지 로드 실패 시 내용 전달 가능하도록 텍스트 서술 보강

13. **[MEDIUM] s04 Mirror Table 정보량 축소** -- 5쌍 -> 3쌍 핵심만 + 나머지는 하위 텍스트

14. **[MEDIUM] 5장마다 브릿지/리캡 슬라이드 삽입** -- 인지 부하 분산. s08 후, s13 후에 각 1장

15. **[LOW] s15 Memory Tier 번호 직관 정렬** -- Tier 0(SOUL)이 가장 기본인데 가장 아래 -> 숫자와 시각적 위치의 불일치 해소

16. **[LOW] s25 Timeline 슬라이드 번호 "25 / 25"** -- 다른 슬라이드는 "NN / 24"인데 혼자 "25 / 25". 총 페이지 수 통일

17. **[LOW] s14 미래 모델명(gpt-5.4, gpt-5.3) 재검토** -- 실존 모델명 사용 또는 "Next-Gen Model A/B" 같은 추상화 고려

---

## 슬라이드별 점수 (1-10)

| # | 제목 | 점수 | 주요 피드백 |
|---|------|------|-----------|
| 01 | Cover | 6/10 | 숫자 불일치 심각(4곳), 발표자 이름 없음, thesis는 강력 |
| 02 | Harness 4-Axis | 8/10 | 프레이밍 우수, 하단 흐름 바 효과적, hook 이벤트 수 불일치(40) |
| 03 | Triple Loop | 8/10 | META/DEV/RUNTIME 구조 명확, Hook 연결자가 관계를 잘 보여줌 |
| 04 | Mirror Table | 6/10 | 개념 좋으나 정보 과밀(5+5=10 항목), 핵심 3쌍으로 축소 필요 |
| 05 | CANNOT/CAN | 8/10 | 486 PRs / 0 regressions 강력, STAR Result 카드 효과적 |
| 06 | 8-Step Loop | 7/10 | 8단계 흐름 시각화 좋음, Socratic 5Q 내용 충실, 하단 약간 조밀 |
| 07 | Frontier + Persona | 6/10 | 카드 8개 = CLAUDE.md 위반, 2개 주제 분리 필요 |
| 08 | Velocity | 7/10 | 바 차트 효과적, Phase 3 피봇 하이라이트 좋음, 다른 Phase 스토리 부족 |
| 09 | Architecture | 7/10 | 다이어그램 + 사이드바 레이아웃 효과적, 다이어그램 의존도 과도 |
| 10 | AgenticLoop | 8/10 | 5가지 종료 경로 + 컨텍스트 3단계 명확, SOT N1과 잘 대응 |
| 11 | Tool Dispatch | 8/10 | Decision Tree + 5-Tier + Error Recovery Chain -- 내러티브 완성도 높음 |
| 12 | Hook System | 7/10 | Maturity Model 좋은 프레이밍, 6 카테고리가 21/45 events 차이 불명 |
| 13 | Sub-Agent | 8/10 | PROBLEM-SOLUTION 구조 명확, SPAWN+ANNOUNCE 패턴 잘 시각화 |
| 14 | LLM Failover | 8/10 | CircuitBreaker 상태 머신 + 에러 분류 우수, ZhipuAI 선택 근거 약함 |
| 15 | Context + Memory | 7/10 | 압축 3-Phase + 4-Tier 피라미드 구조적, SOUL Tier 0 번호 혼동 |
| 16 | PromptAssembler | 8/10 | PROBLEM-SOLUTION-RESULT 구조 모범적, 10% 비용 강조 효과적 |
| 17 | MCP + TokenTracker | 6/10 | 두 주제 합침으로 깊이 부족, Before/After 시각화 좋으나 각각 1장 필요 |
| 18 | Game IP Pipeline | 8/10 | DAG 이미지 + Scoring Formula + Fixture Results 삼위일체, 5-Layer 요약 충실 |
| 19 | Domain Portability | 9/10 | 최고 슬라이드. GEODE-DomainPort-REODE 삼분 구조, "0줄" 강조, REODE 실증 수치 |
| 20 | Security + Gateway | 5/10 | 정보 과밀 최악. 7개 정보 블록, 반드시 2장 분리 필요 |
| 21 | CANNOT -> Result | 8/10 | 4쌍 인과관계 대비가 매우 효과적, CONNECTION 파트의 핵심 |
| 22a | Trade-offs (1/2) | 6/10 | 내용은 좋으나 텍스트 나열에 가까움, 시각적 차별화 부족 |
| 22b | Trade-offs (2/2) | 6/10 | 동일 -- 카드 나열이 CLAUDE.md "키워드 나열 금지" 경계 |
| 23 | Summary | 7/10 | 전체 지표 정리 유용, 숫자 불일치(184 vs 185), REODE 요약 적절 |
| 24 | Closing | 8/10 | Opening thesis 콜백 좋음, 3가지 가치 명제 명확, 연락처 포함 |
| 25 | Timeline | 7/10 | 4-Phase 진화 스토리 효과적, 위치(마지막)가 아쉬움 -- 앞으로 이동 권장 |

### 전체 평균: 7.1 / 10

### 핵심 요약
- **강점**: 기술적 깊이, 구체적 숫자, PROBLEM-SOLUTION-RESULT 구조, 색상 체계 일관성
- **최대 약점**: 숫자 불일치(7곳 이상), 슬라이드 순서(결과가 너무 뒤에), 정보 과밀 슬라이드(s20, s07)
- **V2 최우선**: 숫자 SOT 통일 -> 순서 재구성 -> 과밀 슬라이드 분리 -> 발표자 정보 추가
