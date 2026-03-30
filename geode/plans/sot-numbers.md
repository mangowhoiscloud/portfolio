# SOT-NUMBERS v0.38.0 (2026-03-30)

단일 정합성 기준. 모든 슬라이드와 문서는 이 파일의 숫자를 참조한다.

## 정량 메트릭

| 항목 | 값 | 소스 | 비고 |
|------|-----|------|------|
| Version | **v0.38.0** | pyproject.toml | LLM Resilience Hardening |
| Modules | **192** | find core/ | v0.35.1(202) 대비 -10 (의도적 단순화, 6L→4L) |
| Tests | **3,377** | pytest | v0.35.1(3,344) 대비 +33 |
| Hook Events | **42** | system.py HookEvent enum | v0.38.0에서 +2 (FALLBACK_CROSS_PROVIDER, PIPELINE_TIMEOUT) |
| IPC Events | **30** | EventRenderer | 신규 카테고리 (v0.37.2) |
| Tools | **47** | definitions.json | 변동 없음 |
| MCP Catalog | **44** | catalog.py | 8 DEFAULT + 22 AUTO_DISCOVER |
| Skills | **42** | .geode/skills/ + .claude/skills/ | 19 + 22 + 1 builtin |
| Releases | **44+** | CHANGELOG.md | v0.35.1(42) +2 |
| Duration | **38일+** | Feb 21 ~ Mar 30, 2026 | 계속 진행 중 |
| PPTX Slides | **29** | slides/*.html | v9(26) +3 |
| Architecture Layers | **4** | Model/Runtime/Harness/Agent | v0.37.0에서 6→4 단순화 |
| Entry Points | **1** | geode serve (unified daemon) | CLI=thin IPC client |
| SessionMode | **4** | REPL/IPC/DAEMON/SCHEDULER | v0.37.0에서 +IPC |
| Safety Tiers | **5** | T0-T4 | 변동 없음 |
| CI Jobs | **5** | Lint, TypeCheck, Test, Security, Gate | 변동 없음 |
| Test Ratchet | **2,900** | CI Gate 최소 기준 | 변동 없음 |
| SubAgent Depth | **1** | 재귀 금지 | 변동 없음 |
| MAX_CONCURRENT | **5** | 동시 서브에이전트 | 변동 없음 |
| Concurrency | **SessionLane** | per-key Sem(1) + Lane("global", 8) | CoalescingQueue 삭제 |
| Context Window | **200K** | per agent | 변동 없음 |
| Compression Trigger | **80% / 95%** | WARNING / CRITICAL | 변동 없음 |
| Cross-LLM alpha | **≥ 0.67** | Krippendorff alpha | 변동 없음 |
| Confidence Gate | **≥ 0.7** | max 5 iterations | 변동 없음 |
| CANNOT Rules | **17** | GEODE CLAUDE.md | 변동 없음 |
| Persona Review | **5인** | Beck/Karpathy/Steinberger/Cherny/GAP Detective | 변동 없음 |
| Memory Tiers | **5** | SOUL/User/Org/Project/Session | v0.37.0에서 4→5 |
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

## v0.37.x 변경 이력

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

| 항목 | 과거 혼동 | 확정값 (v0.37.2) | 근거 |
|------|----------|-----------------|------|
| Hook Events | 40, 45, 46 혼재 | **40** | v0.35.1 orphan 정리 후 안정 |
| Tools | 47, 52, 54 혼재 | **47** | definitions.json 실측 |
| Modules | 187-202 혼재 | **192** | find core/ v0.37.2 실측. 의도적 감소 |
| MCP | 41, 44 혼재 | **44** | catalog.py 실측 |
| Skills | 21-25 혼재 | **42** | .geode + .claude skills 합산 |
| Architecture | 6-Layer | **4-Layer** | v0.37.0 단순화 |
| IPC Events | 없음 | **30** | EventRenderer 실측 |
