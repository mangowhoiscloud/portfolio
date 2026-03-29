# SOT-NUMBERS v0.32.1 (2026-03-29)

단일 정합성 기준. 모든 슬라이드와 문서는 이 파일의 숫자를 참조한다.

## 정량 메트릭

| 항목 | 값 | 소스 | 비고 |
|------|-----|------|------|
| Version | **v0.32.1** | pyproject.toml | v0.32.0 + SubAgent 이중 주입 수정 |
| Commits | **1,174+** | git log | v0.32.0 기준, v0.32.1에서 소폭 증가 |
| PRs | **500+** | progress.md | |
| Releases | **40** | CHANGELOG.md | |
| Modules | **187** | find core/ | |
| Tests | **3,216** | grep def test_ | |
| Hook Events | **46** | system.py HookEvent enum | v0.31에서 45→46 |
| Tools | **52** | definitions.json | native tools (task tools 2개 별도 시 54) |
| MCP Catalog | **45** | catalog.py | auto-discovery |
| Skills | **21** | .claude/skills/ | |
| CANNOT Rules | **23** | CLAUDE.md (GEODE 프로젝트) | 5카테고리: 타이포/레이아웃/html2pptx/다이어그램/내러티브 |
| Duration | **36일** | Feb 21 ~ Mar 28, 2026 | |
| PPTX Slides | **26** | slides/*.html | v9 36슬라이드에서 구조 개편 |
| Appendix Boxes | **32** | appendix-boxes.html | 기존 18 + 신규 14 |
| Architecture Layers | **6** | L0-L5 | |
| Safety Tiers | **5** | T0-T4 | |
| CI Jobs | **5** | Lint, TypeCheck, Test, Security, Gate |
| Test Ratchet | **2,900** | CI Gate 최소 기준 | |
| AgenticLoop Max | **50 rounds** | max_rounds | 평균 4.2R |
| SubAgent Max | **10 rounds** | sub-agent max_rounds | |
| SubAgent Depth | **2** | 재귀 깊이 제한 | |
| MAX_CONCURRENT | **5** | 동시 서브에이전트 | |
| CoalescingQueue | **250ms** | dedup 윈도우 | |
| Context Window | **200K** | per agent | |
| Compression Trigger | **80% / 95%** | WARNING / CRITICAL | |
| Cross-LLM α | **≥ 0.67** | Krippendorff alpha | |
| Confidence Gate | **≥ 0.7** | max 5 iterations | |

## v0.32.1 변경사항 (v0.32.0 대비)

1. **SubAgent 이중 주입 제거**: delegate_task 동기 호출에서 tool_result + announce 이중 주입 수정. `delegate(announce=False)`. 2파일 4줄 변경.
2. **동기/비동기 분리**: OpenClaw 패턴 채택. 동기 시 announce 비활성화, 비동기는 기본값 True 유지.

## v0.32.0 주요 기능 (v0.31 대비)

1. Autonomous Safety 3조건 (budget_stop, convergence 3회, tool_repeat 5회)
2. Plan-first + plan_id HITL UI
3. Provider-aware Context Compaction (Anthropic 서버사이드 vs OpenAI/GLM 클라이언트사이드)

## 숫자 불일치 해결 이력

| 항목 | 과거 혼동 | 확정값 | 근거 |
|------|----------|--------|------|
| Hook Events | 40, 45, 46 혼재 | **46** | system.py enum 실측 |
| CANNOT Rules | 17, 23 혼재 | **23** | CLAUDE.md 실측 (5카테고리) |
| Tools | 52, 54 혼재 | **52** (definitions.json), **54** (+ task tools 2) | README 기준 54 |
| MCP | 41, 44, 45 혼재 | **45** | catalog.py 실측 |
| Duration | 35일, 36일 혼재 | **36일** | Feb 21 ~ Mar 28 |
