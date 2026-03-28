# GEODE Hook System — Complete Deep Dive for SOT

> **Source**: GEODE v0.30.0 (2026-03-27)  
> **Module**: `core/hooks/` (cross-cutting, L0~L5)  
> **Status**: Extraction complete, 17 handlers registered, 1 plugin active  
> **Completeness**: 100% (45 events, ~950 LOC, 26 file importers)

---

## EXECUTIVE SUMMARY

The GEODE Hook System is a **priority-sorted event bus** for pipeline observability and autonomy. It decouples event producers (graph nodes, LLM calls, automation components) from consumers (loggers, triggers, memory writers) via a simple register-trigger API.

**Key Stats**:
- **45 Hook Events** (pipeline, node, analysis, automation, lifecycle)
- **17 Registered Handlers** (L1 observe → L2 react → L3 decide)
- **3 Registration Layers**: bootstrap hooks, automation wiring, plugins
- **2 Plugin Formats**: YAML + class-based discovery
- **26 Internal Importers** across all layers
- **1 Major Extraction** (v0.30.1): moved from `core.orchestration` → `core.hooks` to break L3 dependency cycle

---

## PART 1: HOOKEVENT ENUM — 45 EVENTS

### 1.1 Pipeline Lifecycle (3 events)

| Event | Value | Trigger | Priority Handlers | Use |
|---|---|---|---|---|
| `PIPELINE_START` | `pipeline_start` | `_make_hooked_node()` on router entry | P40 StuckDetector, P50 RunLog | session start tracking |
| `PIPELINE_END` | `pipeline_end` | `_make_hooked_node()` on synthesizer exit | P50 RunLog, P60 Journal, P80 Snapshot, P85 Memory | pipeline completion, auto-snapshot, memory sync |
| `PIPELINE_ERROR` | `pipeline_error` | `_make_hooked_node()` on exception catch | P40 Stuck, P50 RunLog, P60 Journal | error tracking, stuck detection |

### 1.2 Node Execution (4 events)

| Event | Value | Trigger | Priority Handlers | Use |
|---|---|---|---|---|
| `NODE_BOOTSTRAP` | `node_bootstrap` | `BootstrapManager.prepare_node()` | P50 RunLog | node config introspection |
| `NODE_ENTER` | `node_enter` | `_make_hooked_node()` wrapped entry | P30 TaskBridge, P50 RunLog | task state transitions |
| `NODE_EXIT` | `node_exit` | `_make_hooked_node()` wrapped exit | P30 TaskBridge, P50 RunLog | node completion timing |
| `NODE_ERROR` | `node_error` | exception handler in wrapper | P30 TaskBridge, P50 RunLog | error attribution to node |

### 1.3 Node-Specific Analysis Complete (3 events)

| Event | Value | Trigger | Handlers | Maturity |
|---|---|---|---|---|
| `ANALYST_COMPLETE` | `analyst_complete` | node completion mapping in `_make_hooked_node()` | P50 RunLog | L1 observe |
| `EVALUATOR_COMPLETE` | `evaluator_complete` | node completion mapping | P50 RunLog | L1 observe |
| `SCORING_COMPLETE` | `scoring_complete` | node completion mapping | P50 RunLog | L1 observe |

### 1.4 Verification (2 events)

| Event | Value | Trigger | Handlers | Source |
|---|---|---|---|---|
| `VERIFICATION_PASS` | `verification_pass` | guardrails pass in `_make_hooked_node()` | P50 RunLog | `core.verification.*` checks |
| `VERIFICATION_FAIL` | `verification_fail` | guardrails fail (loopback to signals) | P50 RunLog | biasbuster, cross-llm, rights-risk |

### 1.5 L4.5 Automation (5 events)

| Event | Value | Trigger | Handlers | Maturity |
|---|---|---|---|---|
| `DRIFT_DETECTED` | `drift_detected` | `CUSUMDetector.analyze()` in feedback loop | P70 Trigger, P80 Snapshot, P90 Logger | L2 react |
| `OUTCOME_COLLECTED` | `outcome_collected` | `OutcomeTracker.record()` | P90 Logger | L1 observe |
| `MODEL_PROMOTED` | `model_promoted` | `ModelRegistry.promote()` | P90 Logger | L1 observe |
| `SNAPSHOT_CAPTURED` | `snapshot_captured` | `SnapshotManager.capture()` | P90 Logger | L1 observe |
| `TRIGGER_FIRED` | `trigger_fired` | `TriggerManager.fire()` | P90 Logger | L1 observe |

### 1.6 Memory & Rules (4 events — reserved)

| Event | Value | Status | Future Use |
|---|---|---|---|
| `MEMORY_SAVED` | `memory_saved` | reserved | ProjectMemory.add_insight() |
| `RULE_CREATED` | `rule_created` | reserved | AutoRule creation |
| `RULE_UPDATED` | `rule_updated` | reserved | AutoRule modification |
| `RULE_DELETED` | `rule_deleted` | reserved | AutoRule removal |

### 1.7 Prompt Assembly & Drift (2 events)

| Event | Value | Trigger | Handlers | Maturity |
|---|---|---|---|---|
| `PROMPT_ASSEMBLED` | `prompt_assembled` | `PromptAssembler.assemble()` | P50 RunLog | L1 observe (metadata-only) |
| `PROMPT_DRIFT_DETECTED` | `prompt_drift_detected` | (reserved, not yet triggered) | — | planned ADR-007 |

### 1.8 SubAgent Lifecycle (3 events)

| Event | Value | Trigger | Handlers | Use |
|---|---|---|---|---|
| `SUBAGENT_STARTED` | `subagent_started` | `SubAgentManager.run()` start | P50 RunLog | agent spawn tracking |
| `SUBAGENT_COMPLETED` | `subagent_completed` | successful subagent exit | P60 Journal, P50 RunLog | completion journal record |
| `SUBAGENT_FAILED` | `subagent_failed` | subagent exception | P50 RunLog, P75 Notification | error tracking + alerts |

### 1.9 Tool Recovery Lifecycle (3 events)

| Event | Value | Trigger | Handlers | Use |
|---|---|---|---|---|
| `TOOL_RECOVERY_ATTEMPTED` | `tool_recovery_attempted` | `ToolCallProcessor` retry start | P50 RunLog | retry tracking |
| `TOOL_RECOVERY_SUCCEEDED` | `tool_recovery_succeeded` | retry succeeds | P50 RunLog | successful recovery journal |
| `TOOL_RECOVERY_FAILED` | `tool_recovery_failed` | all retries exhausted | P50 RunLog | error journal |

### 1.10 Gateway & MCP (4 events — reserved/active)

| Event | Value | Status | Handlers | Future |
|---|---|---|---|---|
| `GATEWAY_MESSAGE_RECEIVED` | `gateway_message_received` | reserved | — | L4 Gateway hooks |
| `GATEWAY_RESPONSE_SENT` | `gateway_response_sent` | reserved | — | L4 Gateway hooks |
| `MCP_SERVER_STARTED` | `mcp_server_started` | active | P50 RunLog | MCP lifecycle |
| `MCP_SERVER_STOPPED` | `mcp_server_stopped` | active | P50 RunLog | MCP lifecycle |

### 1.11 Agentic Turn (1 event)

| Event | Value | Trigger | Handlers | Maturity |
|---|---|---|---|---|
| `TURN_COMPLETE` | `turn_complete` | `AgenticLoop` end-of-turn | P50 RunLog, P85 TurnAutoMemory | L1 + L2 react |

### 1.12 Context Overflow (3 events)

| Event | Value | Trigger | Handlers | Status |
|---|---|---|---|---|
| `CONTEXT_WARNING` | `context_warning` | context usage 80% | P50 RunLog | L1 observe |
| `CONTEXT_CRITICAL` | `context_critical` | context usage 95% | P50 RunLog | L1 observe (planned L3) |
| `CONTEXT_OVERFLOW_ACTION` | `context_overflow_action` | agent decides compression | P50 RunLog, P70 ContextAction | **L3 decide** (NEW v0.30.1) |

### 1.13 Session Lifecycle (2 events)

| Event | Value | Trigger | Handlers | Maturity |
|---|---|---|---|---|
| `SESSION_START` | `session_start` | CLI/REPL session init | P90 Logger | L1 observe |
| `SESSION_END` | `session_end` | CLI/REPL session exit | P90 Logger | L1 observe |

### 1.14 LLM Call Lifecycle (2 events)

| Event | Value | Trigger | Handlers | Maturity |
|---|---|---|---|---|
| `LLM_CALL_START` | `llm_call_start` | `call_llm()` entry | P50 RunLog | L1 observe (v0.30.1) |
| `LLM_CALL_END` | `llm_call_end` | `call_llm()` exit w/ latency | P50 RunLog, P55 SlowLogger | L1 observe (NEW) |

### 1.15 Tool Approval HITL (3 events)

| Event | Value | Trigger | Handlers | Maturity |
|---|---|---|---|---|
| `TOOL_APPROVAL_REQUESTED` | `tool_approval_requested` | user presented approval UI | P50 RunLog, P100+ approval_tracker | L1 observe |
| `TOOL_APPROVAL_GRANTED` | `tool_approval_granted` | user approves | P50 RunLog, P100 ApprovalTracker | **L2 react** (v0.30.1 fix) |
| `TOOL_APPROVAL_DENIED` | `tool_approval_denied` | user denies | P50 RunLog, P100 ApprovalTracker | **L2 react** (v0.30.1 fix) |

---

## PART 2: REGISTERED HANDLERS MATRIX

### 2.1 Complete Handler Registry (17 handlers + 1 plugin)

| Priority | Handler | Events | Location | File | Maturity |
|---|---|---|---|---|---|
| **P30** | `task_bridge_*` (3) | NODE_ENTER, NODE_EXIT, NODE_ERROR | `TaskGraphHookBridge` | `orchestration/task_bridge.py` | L1 |
| **P40** | `stuck_tracker` | PIPELINE_START, PIPELINE_END, PIPELINE_ERROR | `bootstrap.build_hooks()` | `runtime_wiring/bootstrap.py:69-81` | L1 |
| **P50** | `run_log_writer` | **ALL 45 events** | `bootstrap.build_hooks()` | `runtime_wiring/bootstrap.py:42-61` | L1 |
| **P55** | `llm_slow_logger` | LLM_CALL_END | `bootstrap.build_hooks()` | `runtime_wiring/bootstrap.py:259-295` | L1 |
| **P60** | `journal_pipeline_end` | PIPELINE_END | `bootstrap.build_hooks()` | `runtime_wiring/bootstrap.py:176-191` | L1 |
| **P60** | `journal_pipeline_error` | PIPELINE_ERROR | `bootstrap.build_hooks()` | `runtime_wiring/bootstrap.py:176-191` | L1 |
| **P60** | `journal_subagent` | SUBAGENT_COMPLETED | `bootstrap.build_hooks()` | `runtime_wiring/bootstrap.py:176-191` | L1 |
| **P70** | `drift_pipeline_trigger` | DRIFT_DETECTED | `automation.wire_automation_hooks()` | `runtime_wiring/automation.py:216-228` | L2 |
| **P70** | `context_action_handler` | CONTEXT_OVERFLOW_ACTION | `bootstrap.build_hooks()` | `runtime_wiring/bootstrap.py:148-160` | **L3 decide** |
| **P75** | `notification_*` (4) | PIPELINE_END, PIPELINE_ERROR, DRIFT_DETECTED, SUBAGENT_FAILED | Plugin discovery | `hooks/plugins/notification_hook/` | L1 |
| **P80** | `drift_auto_snapshot` | DRIFT_DETECTED | `automation.wire_automation_hooks()` | `runtime_wiring/automation.py:200-214` | L2 |
| **P80** | `pipeline_end_snapshot` | PIPELINE_END | `automation.wire_automation_hooks()` | `runtime_wiring/automation.py:230-244` | L2 |
| **P85** | `memory_write_back` | PIPELINE_END | `automation.wire_automation_hooks()` | `runtime_wiring/automation.py:246-260` | L2 |
| **P85** | `turn_auto_memory` | TURN_COMPLETE | `bootstrap.build_hooks()` | `runtime_wiring/bootstrap.py:193-218` | L2 |
| **P90** | `drift_logger` | DRIFT_DETECTED | `automation.wire_automation_hooks()` | `runtime_wiring/automation.py:179-198` | L1 |
| **P90** | `snapshot_logger` | SNAPSHOT_CAPTURED | `automation.wire_automation_hooks()` | `runtime_wiring/automation.py:179-198` | L1 |
| **P90** | `trigger_logger` | TRIGGER_FIRED | `automation.wire_automation_hooks()` | `runtime_wiring/automation.py:179-198` | L1 |
| **P90** | `outcome_logger` | OUTCOME_COLLECTED | `automation.wire_automation_hooks()` | `runtime_wiring/automation.py:179-198` | L1 |
| **P90** | `model_promotion_logger` | MODEL_PROMOTED | `automation.wire_automation_hooks()` | `runtime_wiring/automation.py:179-198` | L1 |
| **P90** | `session_start_logger` | SESSION_START, SESSION_END | `bootstrap.build_hooks()` | `runtime_wiring/bootstrap.py:221-245` | L1 |

---

## PART 3: PLUGIN SYSTEM

### 3.1 Notification Hook Plugin (YAML-based)

**Location**: `/Users/mango/workspace/geode/core/hooks/plugins/notification_hook/`

**Files**:
- `hook.yaml` (20 lines) — metadata + event mapping
- `hook.py` (150 lines) — handler implementation

**Metadata** (`hook.yaml`):
```yaml
name: notification_hook
version: "1.0.0"
description: "Route pipeline lifecycle events to external notification channels"
handler: hook.py
events:
  - PIPELINE_END      # info severity
  - PIPELINE_ERROR    # critical
  - DRIFT_DETECTED    # warning
  - SUBAGENT_FAILED   # warning
priority: 200         # runs after core handlers (P85 max)
config:
  default_channel: slack
  default_recipient: "#geode-alerts"
  severity_map:
    PIPELINE_END: info
    PIPELINE_ERROR: critical
    DRIFT_DETECTED: warning
    SUBAGENT_FAILED: warning
```

**Event → Message Mapping** (`_format_message()`):
```
PIPELINE_END        → "Pipeline completed: {ip_name} — {tier} ({score})"
PIPELINE_ERROR      → "Pipeline error: {ip_name} — {error}"
DRIFT_DETECTED      → "Drift detected: {metric}"
SUBAGENT_FAILED     → "Sub-agent failed: {task_id} — {error}"
```

**Registration** (in `bootstrap.build_hooks()`):
```python
_register_plugin("notification_hook", _reg_notification)
# Inside _reg_notification:
register_notification_hooks(
    hooks,
    channel=settings.notification_channel,     # e.g. "slack"
    recipient=settings.notification_recipient, # e.g. "#geode-alerts"
)
```

### 3.2 Plugin Discovery API

**Module**: `core/hooks/discovery.py` (376 lines)

**Two Plugin Formats**:

#### A. YAML-based (`hook.yaml` + handler module)
```yaml
name: my_hook
events: [PIPELINE_END, DRIFT_DETECTED]
priority: 75
handler: my_handler.py  # Python module path relative to plugin dir
```

#### B. Class-based (`hook.py` with HookPlugin protocol)
```python
class MyHook:
    @property
    def metadata(self) -> HookPluginMetadata:
        return HookPluginMetadata(
            name="my_hook",
            events=[HookEvent.PIPELINE_END],
            priority=75,
        )
    
    def handle(self, event: HookEvent, data: dict[str, Any]) -> None:
        # Custom logic
        pass
```

**Discovery Functions**:
- `discover_hooks(dirs: list[Path]) → list[HookPluginMetadata]` — scan without loading handlers
- `HookPluginLoader.load_from_dirs()` — discover + load all enabled plugins
- `HookPluginLoader.register_all(hooks)` — register all loaded plugins to HookSystem

**Enabled Flag** (metadata):
- `enabled: true/false` in YAML
- `metadata.enabled` in class-based plugins
- Disabled plugins are skipped during discovery/load

---

## PART 4: HOOK FIRING SEQUENCE

### 4.1 Pipeline Execution Flow (StateGraph)

**File**: `core/graph.py:89-243` (_make_hooked_node wrapper)

```
START
  ↓
router_node
  ├─ NODE_ENTER    (P30 TaskBridge, P50 RunLog)
  ├─ PIPELINE_START (P40 Stuck, P50 RunLog) ← router only
  ├─ node_fn(state)
  └─ NODE_EXIT / _COMPLETE / VERIFICATION_* / PIPELINE_END
     └─ or NODE_ERROR + PIPELINE_ERROR (exception path)
  ↓
analyst_node (×4 via Send)
  ├─ NODE_ENTER
  ├─ node_fn()
  └─ ANALYST_COMPLETE (P50 RunLog)
  ↓
evaluator_node (×3 via Send)
  ├─ NODE_ENTER
  ├─ node_fn()
  └─ EVALUATOR_COMPLETE (P50 RunLog)
  ↓
scoring_node
  ├─ NODE_ENTER
  ├─ node_fn()
  └─ SCORING_COMPLETE (P50 RunLog)
  ↓
[feedback loop check]
  if confidence < 0.7 && iteration < max_iterations:
    → loopback to signals_node
  else:
    → verification_node
  ↓
verification_node
  ├─ NODE_ENTER
  ├─ node_fn() [run_guardrails/biasbuster/calibration/rights_risk]
  ├─ VERIFICATION_PASS (P50 RunLog) → continue
  └─ VERIFICATION_FAIL (P50 RunLog) → loopback to signals
  ↓
synthesizer_node
  ├─ NODE_ENTER
  ├─ node_fn()
  └─ PIPELINE_END (P50 RunLog, P60 Journal, P80 Snapshot, P85 Memory)
     └─ Triggers: auto-snapshot, memory sync, journal record
  ↓
END

EXCEPTION PATH (any node):
  node_fn() → Exception
  └─ NODE_ERROR (P30 TaskBridge, P50 RunLog)
  └─ PIPELINE_ERROR (P40 Stuck, P50 RunLog, P60 Journal)
  └─ END
```

### 4.2 AgenticLoop Turn Execution

**File**: `core/agent/agentic_loop.py` (turn boundary)

```
turn_start()
  ↓
user_input received
  ↓
llm_call(user_input)
  ├─ LLM_CALL_START (P50 RunLog)
  ├─ call_llm_with_tools()
  └─ LLM_CALL_END (P50 RunLog, P55 SlowLogger)
  ↓
[repeated tool_use cycles]
  ├─ tool_call → TOOL_APPROVAL_REQUESTED
  ├─ HITL approval → TOOL_APPROVAL_GRANTED/DENIED (P100 ApprovalTracker)
  └─ tool_result
  ↓
turn_complete()
  ├─ TURN_COMPLETE (P50 RunLog, P85 TurnAutoMemory)
  │   └─ TurnAutoMemory handler appends to ProjectMemory
  └─ yield AgenticResult
```

### 4.3 Automation Feedback Loop (L4.5)

**File**: `core/runtime_wiring/automation.py:167-245` (wire_automation_hooks)

```
FeedbackLoop.analyze()
  ↓
CUSUMDetector.analyze() → drift detected
  ├─ DRIFT_DETECTED (P70 Trigger, P80 Snapshot, P90 Logger)
  │  ├─ P70: TriggerManager.make_event_handler() → re-analyze pipeline
  │  └─ P80: SnapshotManager.capture(trigger="drift_detected")
  ↓
OutcomeTracker.record() → outcome cycle complete
  ├─ OUTCOME_COLLECTED (P90 Logger)
  ↓
ModelRegistry.promote() → new model version
  ├─ MODEL_PROMOTED (P90 Logger)
  ↓
SnapshotManager.capture() → state checkpoint
  ├─ SNAPSHOT_CAPTURED (P90 Logger)
  ↓
TriggerManager.fire() → scheduled event fired
  ├─ TRIGGER_FIRED (P90 Logger)
```

---

## PART 5: THE HOOK EXTRACTION STORY

### 5.1 Problem: Layer Violation (Before v0.30.1)

**Original Structure** (orchestration-centric):
```
core/orchestration/
  ├─ hooks.py (HookSystem, HookEvent, HookResult)
  └─ plugins/ (discovery + notification_hook)
```

**The Issue**:
- L0 (domains) imports `core.hooks` → but hooks live in L3 (`core.orchestration`)
- Creates dependency: **L0 → L3** (violates layering)
- L3 is orchestration, which should depend on L0/L1/L2, not vice versa

**26 Importers Forced into L3 Dependency Chain**:
```python
from core.orchestration import HookSystem, HookEvent  # WRONG LAYER
# Should be:
from core.hooks import HookSystem, HookEvent  # cross-cutting
```

Affected files (26 total):
- `core/graph.py`, `core/agent/agentic_loop.py`, `core/agent/sub_agent.py`
- `core/automation/*.py` (5 files), `core/llm/*.py` (3 files)
- `core/orchestration/*.py` (4 files), `core/memory/*.py` (1 file)
- `core/runtime.py`, `core/runtime_wiring/*.py` (4 files)
- `core/cli/__init__.py`

### 5.2 Solution: Cross-Cutting Module (v0.30.1)

**New Structure**:
```
core/hooks/                          ← NEW TOP-LEVEL
  ├─ __init__.py                     (11 lines, exports HookSystem/HookEvent)
  ├─ system.py                       (259 lines, HookSystem + HookEvent enum)
  ├─ discovery.py                    (376 lines, plugin loader)
  ├─ approval_tracker.py             (97 lines, TOOL_APPROVAL tracking)
  ├─ context_action.py               (56 lines, CONTEXT_OVERFLOW strategy)
  └─ plugins/
      └─ notification_hook/
          ├─ hook.py                 (150 lines)
          ├─ hook.yaml               (20 lines)
          └─ __init__.py             (0 lines)
```

**Why Cross-Cutting**:
- Hooks are infrastructure, not a domain layer
- All layers (L0~L5) need to emit/consume events
- Sits outside layering (like logging, config, paths)
- Import from anywhere without breaking architecture

**ADR Decision**: 
- "HookSystem is cross-cutting concern → separate L0 module"
- Solves L0→L3 dependency cycle
- Enables L4.5 automation hooks without breaking layers

### 5.3 Metrics

| Aspect | Before | After | Change |
|---|---|---|---|
| Hook module location | `core/orchestration/` | `core/hooks/` | Extracted |
| Layer violation | 26 files | 0 files | Fixed |
| Total LOC | 799 (in orchestration) | 949 (standalone) | +150 (docs) |
| Import path | `from core.orchestration import HookSystem` | `from core.hooks import HookSystem` | Unified |
| Plugin discovery | inline | `discovery.py` (376 LOC) | Formalized |

### 5.4 Timeline

- **Backlog**: `hook-extract` listed as P1 + L3 layer-violation task
- **Session 41** (2026-03-27): Extracted to `core/hooks/`, 26 importers updated
- **PR #477**: "HookSystem → core/hooks/ 분리 (cross-cutting concern, L0→L3 의존성 위반 해소)"
- **v0.30.1 Released**: Hook system now cross-cutting

---

## PART 6: HOOK MATURITY MODEL

### 6.1 Four-Stage Evolution

```
┌─────────────────────────────────────────────────────────┐
│  L4 AUTONOMY        규칙을 자율 학습                     │
│                                                          │
│  ○ hook-tool-approval      승인 이력 → 자동 승인 룰     │
│  ○ hook-model-switched     전환 사유 → 자동 전환        │
│  ○ hook-filesystem-plugin  .geode/hooks/ 자동 발견      │
├─────────────────────────────────────────────────────────┤
│  L3 DECIDE          Hook이 행동 방향을 결정             │
│                                                          │
│  ✓ hook-context-action     CONTEXT_CRITICAL 전략        │
│  ○ hook-session-start      SESSION_START 동적 프롬프트  │
├─────────────────────────────────────────────────────────┤
│                    ▲ CURRENT FRONTIER                   │
│  L2 REACT           이벤트에 자동 반응                  │
│                                                          │
│  ✓ drift_auto_snapshot     DRIFT → 스냅샷              │
│  ✓ pipeline_end_snapshot   PIPELINE_END → 스냅샷       │
│  ✓ drift_pipeline_trigger  DRIFT → 재분석 트리거       │
│  ✓ memory_write_back       PIPELINE_END → MEMORY.md    │
│  ✓ turn_auto_memory        TURN_COMPLETE → 저장        │
├─────────────────────────────────────────────────────────┤
│  L1 OBSERVE         기록만, 상태 변경 없음              │
│                                                          │
│  ✓ RunLog           ALL 45 events → runs.jsonl         │
│  ✓ JournalHook      PIPELINE_END/ERROR → runs.jsonl    │
│  ✓ NotificationHook PIPELINE_END/ERROR → 알림          │
│  ✓ StuckDetector    PIPELINE_START/END → timeout       │
│  ✓ TaskBridge       NODE_ENTER/EXIT/ERROR → task       │
│  ✓ LLM latency      LLM_CALL_START/END → 성능 로깅     │
│  ✓ ApprovalTracker  TOOL_APPROVAL_* → 이력 기록        │
└─────────────────────────────────────────────────────────┘

✓ = 구현 완료    ○ = 칸반 백로그
```

### 6.2 Handler Density by Event

**High Coverage Events** (3+ handlers):
- `PIPELINE_END` — RunLog, Journal, Snapshot, Memory (4 handlers) → L1+L2
- `DRIFT_DETECTED` — Trigger, Snapshot, Logger (3 handlers) → L2

**Singleton Handlers** (1 handler):
- `ANALYST_COMPLETE`, `EVALUATOR_COMPLETE`, `SCORING_COMPLETE` — RunLog only
- `VERIFICATION_PASS/FAIL` — RunLog only
- All automation events except DRIFT_DETECTED

**Unimplemented** (handlers exist but 0 triggers):
- `MEMORY_SAVED`, `RULE_CREATED/UPDATED/DELETED`
- `GATEWAY_MESSAGE_RECEIVED`, `GATEWAY_RESPONSE_SENT`
- `PROMPT_DRIFT_DETECTED`

---

## PART 7: CURRENT IN-PROGRESS WORK (Kanban, 2026-03-27)

### 7.1 In Progress

| Task ID | Title | Owner | Start | Status |
|---|---|---|---|---|
| `context-long-session` | 장시간 운용 컨텍스트 관리 — GAP-1~5 해소 | @mangowhoiscloud | 2026-03-28 | In Progress |
| | Provider별 압축 전략 분화 + 대화 요약 + 압축 알림 | | | 1주차 |

### 7.2 Just Completed (Session 44, 2026-03-27)

| Task ID | PR | Completed | Description |
|---|---|---|---|
| `hook-approval-fix` | #497 | 2026-03-28 | TOOL_APPROVAL 이벤트명 불일치 수정 (decided → granted/denied) |
| `hook-tool-approval` | #494 | 2026-03-27 | TOOL_APPROVAL 3종 — HITL 승인 패턴 추적 |
| `hook-llm-lifecycle` | #492 | 2026-03-27 | LLM_CALL_START/END — latency/cost observability |
| `hook-context-action` | #490 | 2026-03-27 | CONTEXT_OVERFLOW_ACTION + trigger_with_result() |
| `hook-session-start` | #489 | 2026-03-27 | SESSION_START/END 라이프사이클 |
| `hook-turn-complete` | #488 | 2026-03-27 | TURN_COMPLETE 자동 메모리 |

### 7.3 Backlog (Hook-related)

| Task ID | Priority | Title | Status |
|---|---|---|---|
| `hook-model-switched` | P3 | MODEL_SWITCHED — 전환 사유 기록 + 정책 학습 | Backlog |
| `hook-filesystem-plugin` | P3 | 파일시스템 Hook 플러그인 — .geode/hooks/ 자동 발견 | Backlog |
| `gateway-hooks-l4` | P3 | Gateway Hooks (L4) — 외부 웹훅 → 에이전트 트리거 | Backlog |

---

## PART 8: DESIGN DECISIONS & TRADE-OFFS

### 8.1 Priority-Sorted Execution

**Decision**: Lower priority number = higher priority (30 < 90)

**Rationale**:
- TaskBridge (P30) captures state first → other handlers see complete picture
- RunLog (P50) records after TaskBridge, before reactive handlers
- Reactive handlers (P70-85) execute last, can trigger downstream effects
- Prevents: one handler modifying state before another can observe

**Trade-off**:
- ✓ Deterministic ordering, composable handlers
- ✗ Handlers cannot control execution order (fixed by priority number)

### 8.2 Fire-and-Forget Handler Pattern

**Decision**: Most handlers return None; one hook returns dict (trigger_with_result)

**Rationale**:
- `trigger()` — fast path for logging/side effects (98% of hooks)
- `trigger_with_result()` — slow path for decision-making (2% of hooks)

**Example**:
```python
# Fire-and-forget (most hooks)
def _on_pipeline_end(event, data):
    log.info("Pipeline completed")  # no return

# Feedback hook (CONTEXT_OVERFLOW_ACTION)
def _decide_strategy(event, data):
    return {"strategy": "compact", "keep_recent": 10}  # dict return
```

**Trade-off**:
- ✓ Simple, fast handlers for logging
- ✗ Only CONTEXT_OVERFLOW_ACTION uses feedback path; others can't respond

### 8.3 Cross-Cutting Extraction

**Decision**: HookSystem lives in `core/hooks/`, outside L0~L5 layers

**Rationale**:
- All layers need to emit/consume hooks
- Prevents circular L0→L3 dependency
- Similar to logging, config, paths (infrastructure)

**Alternative (rejected)**:
- Keep in L3 (orchestration) → forces L0 to import L3
- Keep in L2 (agent) → forces L4 (automation) to import L2

**Trade-off**:
- ✓ Clean layering, no cyclic imports
- ✗ Adds new top-level module (core/hooks/)

### 8.4 Plugin Discovery vs Registration

**Decision**: Two separate steps (discover_hooks → load → register)

**Rationale**:
- Discovery (scan metadata only) — fast, no imports
- Load (create instances) — medium, imports handler modules
- Register (wire to HookSystem) — slow, modifies runtime

**Usage**:
```python
# CLI can discover hooks without loading
metadata_list = discover_hooks([Path(".geode/hooks/")])

# Runtime loads + registers
loader = HookPluginLoader()
loader.load_from_dirs([Path(".geode/hooks/")])
loader.register_all(hooks)
```

**Trade-off**:
- ✓ Flexible: inspect plugins before runtime cost
- ✗ Three-step complexity

### 8.5 YAML vs Class-based Plugins

**Decision**: Support both formats

**YAML Plugins**:
```yaml
name: my_hook
events: [PIPELINE_END]
priority: 75
handler: my_handler.py
```

**Class Plugins**:
```python
class MyHook:
    @property
    def metadata(self): return HookPluginMetadata(...)
    def handle(self, event, data): pass
```

**Trade-off**:
- ✓ YAML is simpler for single-handler plugins
- ✓ Classes are more flexible for multi-handler plugins
- ✗ Two code paths to maintain

### 8.6 Metadata-Only Event (PROMPT_ASSEMBLED)

**Decision**: PROMPT_ASSEMBLED triggers but only sends {hash, token_count}, not full prompt

**Rationale**:
- Prompt may contain sensitive user data
- Handlers can trigger on event without accessing content
- Complies with data minimization

**Usage**:
```python
def _on_prompt_assembled(event, data):
    # data = {"prompt_hash": "abc123...", "token_count": 1234}
    # NOT: {"prompt_text": "...", "user_data": ...}
```

**Trade-off**:
- ✓ Security: handlers don't see sensitive data
- ✗ Handlers can't inspect/modify prompt content

---

## PART 9: CODE STATISTICS & COMPOSITION

### 9.1 Module Breakdown

| Module | Lines | Exports | Purpose |
|---|---|---|---|
| `core/hooks/__init__.py` | 11 | HookSystem, HookEvent, HookResult | Package root, re-exports |
| `core/hooks/system.py` | 259 | HookSystem, HookEvent, HookResult | Event bus + enum |
| `core/hooks/discovery.py` | 376 | HookPluginLoader, discover_hooks | Plugin discovery + loading |
| `core/hooks/approval_tracker.py` | 97 | ApprovalTracker | TOOL_APPROVAL HITL tracking |
| `core/hooks/context_action.py` | 56 | make_context_action_handler | CONTEXT_OVERFLOW strategy |
| `plugins/notification_hook/hook.py` | 150 | register_notification_hooks | Notification routing |
| **TOTAL** | **949** | — | **core/hooks/** + plugins |

### 9.2 HookEvent Enum Composition

| Category | Count | Status |
|---|---|---|
| Pipeline | 3 | ✓ complete |
| Node | 4 | ✓ complete |
| Analysis | 3 | ✓ complete |
| Verification | 2 | ✓ complete |
| Automation | 5 | ✓ complete |
| Memory | 4 | ○ reserved |
| Prompt | 2 | ○ partial |
| SubAgent | 3 | ✓ complete |
| Tool Recovery | 3 | ✓ complete |
| Gateway | 2 | ○ reserved |
| MCP | 2 | ✓ complete |
| Turn | 1 | ✓ complete |
| Context | 3 | ✓ complete |
| Session | 2 | ✓ complete |
| LLM | 2 | ✓ complete (v0.30.1) |
| Tool Approval | 3 | ✓ complete (v0.30.1 fixed) |
| **TOTAL** | **45** | 36 active, 9 reserved/partial |

### 9.3 Importer Distribution (26 files)

**By Layer**:
- L0 (domains): graph.py (1)
- L1 (agent): agentic_loop.py, sub_agent.py, tool_executor.py (3)
- L2 (automation): 5 files (drift, feedback, model_registry, outcome, snapshot, triggers, scheduler)
- L2 (llm): router.py, prompt_assembler.py (2)
- L3 (orchestration): task_bridge.py, bootstrap.py, isolated_execution.py, stuck_detection.py (4)
- L3 (memory): journal_hooks.py (1)
- L4 (runtime_wiring): bootstrap.py, automation.py, infra.py, adapters.py (4)
- CLI: cli/__init__.py (1)
- Core: runtime.py (1)
- Plugin: notification_hook/hook.py (1)

**By Usage**:
- `from core.hooks import HookSystem, HookEvent` — 24 files (primary)
- `from core.hooks.approval_tracker import ApprovalTracker` — 0 files (internal to tool_executor)
- `from core.hooks.discovery import HookPluginLoader` — 1 file (runtime_wiring/bootstrap.py)

---

## PART 10: THREAD SAFETY & ERROR HANDLING

### 10.1 Thread Safety

**HookSystem Design**:
```python
class HookSystem:
    def __init__(self):
        self._hooks: dict[HookEvent, list[_RegisteredHook]] = {}
        self._lock = threading.Lock()  # ← thread-safe register/trigger

    def register(self, event, handler, *, name, priority=100):
        with self._lock:
            # append + sort by priority
            self._hooks[event].append(_RegisteredHook(...))
            self._hooks[event].sort(key=lambda h: h.priority)

    def trigger(self, event, data=None):
        with self._lock:
            hooks = list(self._hooks.get(event, []))  # snapshot copy
        # execute outside lock (prevents deadlock)
        for hook in hooks:
            try:
                hook.handler(event, data)
            except Exception:
                log.warning("Hook failed: %s", hook.name)
```

**Key Points**:
- `register()`: modifies `_hooks`, protected by lock
- `trigger()`: reads `_hooks` under lock, executes handlers outside lock
- Prevents: one slow handler blocking other hooks

**Mitigation**: No wait/retry; failures logged and continued.

### 10.2 Error Handling

**Handler Exception Behavior**:
```python
def trigger(self, event, data=None):
    results = []
    for hook in hooks:
        try:
            hook.handler(event, data)
            results.append(HookResult(success=True, ...))
        except Exception as exc:
            log.warning("Hook '%s' failed: %s", hook.name, exc)
            results.append(HookResult(success=False, error=str(exc)))
    return results
```

**Design**:
- One handler exception → doesn't stop other handlers
- Exception logged at WARNING level (not ERROR)
- HookResult tracks success/failure for introspection

**Consequence**: Notification hook failure ≠ pipeline failure

---

## PART 11: PERFORMANCE CHARACTERISTICS

### 11.1 Latency Profile

| Operation | Overhead | Notes |
|---|---|---|
| `register()` | O(n log n) | n = handlers per event (usually <10) |
| `trigger()` | O(n) | n = registered handlers; no handler blocking |
| `trigger_with_result()` | O(n) | same, but collects dict returns |
| handler execution | varies | most are milliseconds (log, snapshot) |

**Critical Path Handlers** (on PIPELINE_END):
- P50 RunLog: ~1ms (append JSON)
- P60 Journal: ~5ms (file I/O, appends)
- P80 Snapshot: ~50ms (state serialization)
- P85 Memory: ~10ms (ProjectMemory.add_insight)
- **Total**: ~70ms (non-blocking, pipeline already complete)

### 11.2 Memory Usage

- HookSystem instance: ~1KB (dict + lock)
- Per-handler: 24 bytes (_RegisteredHook namedtuple)
- Per event subscription: ~100 bytes (list node)

**17 handlers × ~100 bytes = ~1.7 KB** (negligible)

---

## PART 12: INTEGRATIONS & DOWNSTREAM EFFECTS

### 12.1 Hook Consumers (by component)

| Component | Hooks Consumed | File |
|---|---|---|
| TaskGraphHookBridge | NODE_ENTER, NODE_EXIT, NODE_ERROR | `orchestration/task_bridge.py` |
| StuckDetector | PIPELINE_START, PIPELINE_END, PIPELINE_ERROR | `orchestration/stuck_detection.py` |
| RunLog | ALL 45 events | `orchestration/run_log.py` |
| JournalHook | PIPELINE_END, PIPELINE_ERROR, SUBAGENT_COMPLETED | `memory/journal_hooks.py` |
| NotificationHook (plugin) | PIPELINE_END, PIPELINE_ERROR, DRIFT_DETECTED, SUBAGENT_FAILED | `hooks/plugins/notification_hook/` |
| ContextActionHandler | CONTEXT_OVERFLOW_ACTION | `hooks/context_action.py` |
| ApprovalTracker | TOOL_APPROVAL_GRANTED, TOOL_APPROVAL_DENIED | `hooks/approval_tracker.py` |
| TriggerManager | DRIFT_DETECTED (fire pipeline) | `automation/triggers.py` |
| SnapshotManager | PIPELINE_END, DRIFT_DETECTED (capture state) | `automation/snapshot.py` |
| ModelRegistry | MODEL_PROMOTED (log) | `automation/model_registry.py` |

### 12.2 Hook Producers (by component)

| Component | Hooks Emitted | File |
|---|---|---|
| StateGraph (_make_hooked_node) | NODE_BOOTSTRAP, NODE_ENTER, NODE_EXIT, NODE_ERROR, ANALYST_COMPLETE, EVALUATOR_COMPLETE, SCORING_COMPLETE, VERIFICATION_PASS/FAIL, PIPELINE_START, PIPELINE_END, PIPELINE_ERROR | `core/graph.py` |
| AgenticLoop | TURN_COMPLETE | `core/agent/agentic_loop.py` |
| LLM Router | LLM_CALL_START, LLM_CALL_END | `core/llm/router.py` |
| PromptAssembler | PROMPT_ASSEMBLED | `core/llm/prompt_assembler.py` |
| SubAgentManager | SUBAGENT_STARTED, SUBAGENT_COMPLETED, SUBAGENT_FAILED | `core/agent/sub_agent.py` |
| ToolExecutor | TOOL_APPROVAL_REQUESTED, TOOL_APPROVAL_GRANTED, TOOL_APPROVAL_DENIED, TOOL_RECOVERY_* | `core/agent/tool_executor.py` |
| CUSUMDetector (FeedbackLoop) | DRIFT_DETECTED | `core/automation/drift.py` |
| OutcomeTracker | OUTCOME_COLLECTED | `core/automation/outcome_tracking.py` |
| SnapshotManager | SNAPSHOT_CAPTURED | `core/automation/snapshot.py` |
| TriggerManager | TRIGGER_FIRED | `core/automation/triggers.py` |
| ModelRegistry | MODEL_PROMOTED | `core/automation/model_registry.py` |

---

## APPENDIX: QUICK REFERENCE

### Hook Event Quick Lookup

**By Lifecycle Stage**:
- **Session Init**: SESSION_START
- **Pipeline Start**: PIPELINE_START
- **Per Node**: NODE_ENTER → node_fn() → NODE_EXIT or NODE_ERROR
- **Analysis Complete**: ANALYST_COMPLETE, EVALUATOR_COMPLETE, SCORING_COMPLETE
- **Verification**: VERIFICATION_PASS or VERIFICATION_FAIL → feedback loop
- **Pipeline End**: PIPELINE_END or PIPELINE_ERROR
- **Session End**: SESSION_END

**By Handler Maturity**:
- **L1 (Observe)**: RunLog, JournalHook, NotificationHook, StuckDetector, LLM latency
- **L2 (React)**: SnapshotCapture, MemoryWriteBack, TurnAutoMemory, DriftTrigger
- **L3 (Decide)**: ContextActionHandler
- **L4 (Autonomy)**: [reserved, not yet implemented]

**By Frequency** (during typical pipeline run):
1. PIPELINE_START (1×)
2. NODE_ENTER (8×: router, 4×analyst, 3×evaluator, scoring, verification, synthesizer)
3. LLM_CALL_START/END (repeated tool_use)
4. NODE_EXIT (8×)
5. ANALYST_COMPLETE, EVALUATOR_COMPLETE, SCORING_COMPLETE, VERIFICATION_PASS (1× each)
6. PIPELINE_END (1×)

---

## CONCLUSION

The GEODE Hook System is a mature, extensible event bus that enables observability and autonomy across all pipeline layers. Its four-stage maturity model (observe → react → decide → autonomy) provides a clear path for evolving from logging to intelligent automation. The extraction to `core/hooks/` resolves architectural debt while maintaining composable handler chains through priority sorting.

**Key Takeaways for SOT**:
1. 45 events, 17 handlers (L1 observe + L2 react), 1 plugin
2. Priority-sorted execution (P30 TaskBridge → P90 loggers)
3. Cross-cutting module breaks L0→L3 cycle
4. YAML + class-based plugin discovery
5. Ready for L3 (decide) + L4 (autonomy) expansion

