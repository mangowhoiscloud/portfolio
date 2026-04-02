# SOT-NUMBERS v0.45.0 (2026-04-03)

단일 정합성 기준. 모든 슬라이드와 문서는 이 파일의 숫자를 참조한다.

## 정량 메트릭

| 항목 | 값 | 소스 | 비고 |
|------|-----|------|------|
| Version | **v0.45.0** | pyproject.toml | LLM Failure Resilience |
| Modules | **195** | find core/ | v0.41.0(192) 대비 +3 |
| Tests | **3,500+** | pytest | 169 test 파일, 3,500+ cases |
| Hook Events | **48** | system.py HookEvent enum | v0.42(46) +2. LLM resilience observability |
| IPC Events | **30** | EventRenderer | 변동 없음 |
| Tools (definitions) | **56** | definitions.json | v0.41(47) +9. task/plan/profile 확장 |
| Tool Classes | **43** | core/tools/*.py | 11개 파일, 43 클래스 (BaseTool 포함) |
| MCP Registry | **동적 API** | core/mcp/registry.py | v0.44에서 catalog.py 제거. Anthropic API 기반, 24h 캐시 |
| Skills | **18** | .geode/skills/ SKILL.md 실측 | v0.41(42)에서 .claude/skills 분리 후 감소 |
| Releases | **51+** | CHANGELOG.md | v0.41(47) +4 (v0.42~v0.45) |
| Duration | **42일+** | Feb 21 ~ Apr 3, 2026 | 계속 진행 중 |
| PPTX Slides | **29** | slides/*.html | 변동 없음 |
| Architecture Layers | **4** | Model/Runtime/Harness/Agent | 변동 없음 |
| Entry Points | **1** | geode serve (unified daemon) | CLI=thin IPC client |
| SessionMode | **4** | REPL/IPC/DAEMON/SCHEDULER | 변동 없음 |
| Safety Tiers | **5** | T0-T4 | 변동 없음 |
| CI Jobs | **5** | Lint, TypeCheck, Test, Security, Gate | 변동 없음 |
| Test Ratchet | **2,900** | CI Gate 최소 기준 | 변동 없음 |
| SubAgent Depth | **1** | 재귀 금지 | 변동 없음 |
| MAX_CONCURRENT | **5** | 동시 서브에이전트 | 변동 없음 |
| Concurrency | **SessionLane** | per-key Sem(1) + Lane("global", 8) | 변동 없음 |
| Context Window | **200K** | per agent | 변동 없음 |
| Compression Trigger | **80% / 95%** | WARNING / CRITICAL | 변동 없음 |
| Cross-LLM alpha | **≥ 0.67** | Krippendorff alpha | 변동 없음 |
| Confidence Gate | **≥ 0.7** | max 5 iterations | 변동 없음 |
| CANNOT Rules | **17** | GEODE CLAUDE.md | 변동 없음 |
| Persona Review | **5인** | Beck/Karpathy/Steinberger/Cherny/GAP Detective | 변동 없음 |
| Memory Tiers | **5** | SOUL/User/Org/Project/Session | 변동 없음 |
| Structural Defects Resolved | **11** | C1-C4, H1-H8, M1 | v0.35.1+v0.36.0 |

## 실행 제약

| 항목 | v0.35.1 | v0.37.2 | 비고 |
|------|---------|---------|------|
| 주 실행 제약 | time_budget_s | **time_budget_s** | 변동 없음 |
| max_rounds | deprecated | deprecated | fallback만 |
| 부트스트랩 | SessionMode 팩토리 | **GeodeRuntime.create()** | 70줄 (243→70) |
| CLI 실행 | standalone REPL | **thin IPC client** | Unix socket |
| Serve | Gateway daemon | **unified daemon** | 모든 상태 소유 |
| 큐잉 | CoalescingQueue | **SessionLane** | per-key Sem(1) + global Lane(8) |

## v0.42~v0.45 변경 이력

### v0.45.0 LLM Failure Resilience
- **Backoff retry + context-first recovery**: LLM 호출 실패 시 지수 백오프 + 컨텍스트 우선 복구
- **Model switch breadcrumb**: 대화에 모델 전환 마커 주입
- **SessionMetrics**: Hook 기반 p50/p95 latency, error rate, tool success rate 추적
- **User preferences**: preferences.json 시스템 프롬프트 주입
- **Scoring weights 외부화**: YAML 설정 + 프로젝트 override
- Hook Events: 46→48 (+2 observability)

### v0.44.0 MCP Dynamic Registry
- **MCP catalog.py 제거**: 44개 하드코딩 → Anthropic API 동적 페칭
- **24h 로컬 캐시**: stale cache fallback 지원
- **per-tool dedup**: registry + MCP 병합 시 중복 제거

### v0.43.0 GLM Cost Tracking
- **GLM-5 비용 추적 연결**: 전 provider 비용 통합 추적 완료

### v0.42.0 Operational Events
- Hook Events 42→46 (+4: SHUTDOWN_STARTED, CONFIG_RELOADED, MCP_SERVER_CONNECTED/FAILED)
- Haiku 400 에러 수정: allowed_callers=["direct"] 추가
- HITL IPC approval 5-bug fix

## v0.39~v0.41 변경 이력

### v0.41.0 Model Switch Stability
- /model mid-call crash 수정: round boundary deferred sync
- config_watcher가 settings.model을 되돌리는 문제 수정
- switch_model tool SAFE→WRITE tier 승격

### v0.40.0 Token Guard + Error Classification + Graceful Drain
- **200K Absolute Token Ceiling**: 1M context 모델에서 rate limit pool 분리 방지
- **LLM-Friendly Tool Error**: 8종 에러 분류 (validation/not_found/permission/connection/timeout/dependency/internal/unknown) + recovery hint
- **Graceful Serve Drain**: SIGTERM 3-phase shutdown (stop_accepting → drain active sessions 30s → component shutdown)
- Tests: 3,377 → 3,547+ (+170)

### v0.39.0 IPC Parity + CJK + Context Overflow
- **IPC Pipeline Event 확장**: signals(YouTube/Reddit/FanArt) + PSM(ATT%/Z-value/Rosenbaum) payload
- **ToolCallTracker.suspend()**: spinner 명시적 중단 + cursor reset
- **CJK-aware truncation**: unicodedata.east_asian_width 기반 문자열 폭 계산
- **Gateway Context Overflow Recovery**: pre-call 토큰 검사 + i18n exhaustion 메시지
- Stub insight generator 제거 (broken tier=?/score=0.00)

## v0.37.x~v0.38.x 변경 이력

### v0.38.0 LLM Resilience Hardening
- 14-item 3-Phase resilience framework
- Hook Events 40→42 (+FALLBACK_CROSS_PROVIDER, PIPELINE_TIMEOUT)
- Error Classification (6종) + Degraded Fallback + Cost Budget
- Aggressive Context Recovery + Checkpoint Resume

### v0.37.2 Event Schema V2 + IPC UX
- Event Schema V2: 12→30 structured IPC event types
- EventRenderer V2: 30개 client-side handler
- /model hot-swap (AgenticLoop 즉시 반영)
- --continue/--resume IPC resume protocol
- Persistent activity spinner + pipeline client-side rendering

### v0.37.1 Thin-only Hotfixes
- serve auto-start cwd/timeout 30s
- SessionMode.IPC quiet=True
- thin client UX: spinner, status line

### v0.37.0 Thin-only + SessionLane + 4-Layer Stack
- **Thin-only architecture**: standalone REPL 제거 (~487 lines)
- **SessionLane**: per-key serialization (OpenClaw pattern)
- **4-Layer Stack**: L0-L5 → Model/Runtime/Harness/Agent
- CoalescingQueue 삭제 (dead code, 148 lines)
- SessionMode +IPC (thin CLI용)
- Unix domain socket IPC 프로토콜

### v0.36.0 Gateway Runtime
- Scheduler daemon in serve mode
- Unified bootstrap: GeodeRuntime only
- CLIChannel IPC 도입
- 11개 구조적 결함 전수 해소

### v0.35.1 System Hardening
- C1-C4: 스레드 안전성 4건
- H1-H8: SubAgent/Hook 안전성 8건
- HookEvent 46→40 (6 orphan 제거)

### v0.35.0 SharedServices Gateway
- SessionMode enum (REPL/DAEMON/SCHEDULER/FORK)
- ContextVar 마이그레이션
- time_budget_s 도입

## 숫자 불일치 해결 이력

| 항목 | 과거 혼동 | 확정값 (v0.45.0) | 근거 |
|------|----------|-----------------|------|
| Hook Events | 40, 44, 46 혼재 | **48** | system.py enum 실측 |
| Tools (definitions) | 47, 52, 54 혼재 | **56** | definitions.json 실측 |
| Tool Classes | 39, 43 혼재 | **43** | core/tools/*.py grep 실측 |
| Modules | 187-202 혼재 | **195** | find core/ v0.45.0 실측 |
| MCP | 41, 44 혼재 | **동적 API** | catalog.py 제거, registry.py 전환 |
| Skills | 18-42 혼재 | **18** | .geode/skills/ SKILL.md 실측 (분리 후) |
| Architecture | 6-Layer | **4-Layer** | v0.37.0 단순화 이후 안정 |
| IPC Events | 없음 | **30** | EventRenderer 실측 |
