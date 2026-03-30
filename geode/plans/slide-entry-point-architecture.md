# Slide Plan: Entry Point Architecture

## 메타

- **슬라이드 번호**: 미정 (S09 뒤 또는 S20 교체 후보)
- **섹션**: HE-1 AUTONOMOUS CORE
- **Accent**: #4ECDC4 Cyan
- **전제 조건**: Unified Daemon 리팩토링 완료 후 제작

## 내러티브 (STAR)

### PROBLEM (실제 장애 2건)

**장애 1: REPL Stuck**
REPL에서 스케줄러를 호출하면 스케줄러가 REPL의 리소스와 UI/UX를 침범한다.
같은 프로세스 안에서 두 실행 흐름이 터미널(stdout/stdin)을 공유하기 때문에,
스케줄러의 출력이 REPL 프롬프트를 덮어쓰고 입력 대기 상태가 교착된다.

**장애 2: 리소스 불일치**
Slack poller, REPL, Scheduler가 각각 독립적으로 부트스트랩하여 서로 다른 리소스 인스턴스를 사용한다.
- HookSystem 2개: serve에서 발화한 이벤트를 REPL 핸들러가 수신 못함
- Scheduler 2개: jobs.json에 동시 쓰기 경합
- ContextVar 미전파: serve의 daemon thread에서 project_memory, user_profile 접근 불가

### ROOT CAUSE (소유권 없는 공유)

```
현재: REPL = fat process (자체 bootstrap + 자체 AgenticLoop)
      serve = fat process (별도 bootstrap + 별도 AgenticLoop)
      → 2개 독립 프로세스, 리소스 각각 생성, 상태 불일치
```

Bootstrap 경로가 2개(bootstrap_geode vs GeodeRuntime.create)이고,
각 진입점이 HookSystem, Scheduler, MCP Manager를 독자적으로 생성한다.
싱글턴이어야 할 리소스가 실제로는 복수 인스턴스.

### SOLUTION (GeodeRuntime 단일 소유자 + 채널 분리)

```
목표: geode serve = unified daemon (모든 상태 소유)
      geode CLI  = thin client (IPC로 daemon에 연결)

GeodeRuntime (ONE instance, 모든 상태 소유)
├── HookSystem        (1) ─ 전 모드 wiring
├── SchedulerService  (1) ─ jobs.json 단일 접근
├── SharedServices    (1 factory)
├── MCP Manager       (1) ─ zombie 방지
├── SessionStore      (1) ─ SQLite WAL
├── LaneQueue         (1) ─ 전 실행 경로 통과
└── PolicyChain       (1) ─ 전 도구 호출 적용
         │
  create_session(mode)
         │
  ┌──────┼──────┐
  CLI    GW   Scheduler
 (IPC) (Slack) (60s tick)
```

각 채널은 GeodeRuntime의 싱글턴 리소스를 참조만 한다. 소유하지 않는다.
REPL은 thin client로 IPC를 통해 daemon의 CLI Channel에 연결된다.

### TRADE-OFF

| 선택 | 채택 | 대안 | 근거 |
|------|------|------|------|
| REPL 모델 | thin client (IPC) | fat process (현재) | 상태 일관성 보장. IPC 레이턴시(~ms)는 LLM 호출(~s) 대비 무시 가능 |
| Bootstrap | GeodeRuntime 1개 | 진입점별 bootstrap (현재) | 리소스 소유권 명확화. 싱글턴 보장 |
| Scheduler 위치 | serve 내부 (daemon) | REPL 내부 (현재) | UI/UX 침범 원천 차단. 터미널 공유 제거 |
| HookSystem | GeodeRuntime 소유 1개 | 진입점별 생성 (현재) | 이벤트 발화→수신 경로 단일화 |

### RESULT (정량 목표)

| 지표 | Before | After |
|------|--------|-------|
| Bootstrap 경로 | 2 (bootstrap_geode + GeodeRuntime) | 1 (GeodeRuntime) |
| HookSystem 인스턴스 | 2 (REPL + serve 각각) | 1 |
| Scheduler 인스턴스 | 2 가능 (경합) | 1 |
| REPL Stuck | 재현 가능 (스케줄러 호출 시) | 원천 차단 (채널 분리) |
| ContextVar 전파 | 부분적 (daemon thread 누락) | 전체 (GeodeRuntime 소유) |
| 프로세스 모델 | 2 fat (독립) | 1 daemon + 1 thin client |

## 슬라이드 레이아웃 (초안)

### 좌측 (60%): Before/After 구조 대비

**Before 블록** (border-left: #EF4444):
- REPL = fat, serve = fat (2개 독립 프로세스)
- bootstrap 2개, HookSystem 2개, Scheduler 2개
- REPL Stuck, 이벤트 미수신, jobs.json 경합

**After 블록** (border-left: #34D399):
- serve = unified daemon (GeodeRuntime 1개)
- REPL = thin client (IPC)
- 3 channels: CLI(IPC), Gateway(Slack/Discord/Telegram), Scheduler(60s tick)

### 우측 (40%): GeodeRuntime 소유 리소스

싱글턴 7개 리스트:
- HookSystem (1)
- SchedulerService (1)
- SharedServices (1 factory)
- MCP Manager (1)
- SessionStore (1)
- LaneQueue (1)
- PolicyChain (1)

### 하단: Trade-off 바

"IPC 레이턴시(~ms)를 수용하고 상태 일관성을 확보한다. LLM 호출(~s) 대비 무시 가능."

## 관련 참조

- sot-master-narrative.md N14 (SharedServices Gateway) → 완료 후 교체
- sot-numbers.md → Bootstrap 경로 2→1 반영
- S09 architecture → GeodeRuntime 중앙 소유 모델 반영
- S10 agentic-loop → AgenticLoop는 채널이 생성하는 실행 단위로 프레이밍 변경
- S20 security-gateway → Gateway는 serve의 채널 중 하나로 변경
- Appendix Box 19 (Long-Running Safety) → 스케줄러 Stuck 맥락 추가 가능

## 제작 시점

Unified Daemon 리팩토링 PR이 머지된 후.
현재 진행 중(scheduler-extract worktree).
Before/After를 정확히 기술하려면 After가 확정되어야 한다.
