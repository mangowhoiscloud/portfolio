# SOT: S08-S10 Core Architecture Slides

> Source of Truth for PPTX slide production
> Generated: 2026-03-27
> Codebase: GEODE v0.30.0 (185 Python modules, 3249+ tests)

---

## S08 — 6-Layer Architecture

### 1. Architecture Diagram Data — Exact Module Counts

| Layer | Package(s) | .py Count | Key Modules |
|-------|-----------|-----------|-------------|
| **L0: CLI & Agent** | `core/cli/` | 26 | `agentic_loop.py`, `commands.py`, `startup.py`, `pipeline_executor.py`, `bash_tool.py`, `batch.py`, `ui/` (5 UI modules) |
| **L0: Agent** | `core/agent/` | 8 | `agentic_loop.py`, `tool_executor.py`, `error_recovery.py`, `sub_agent.py`, `conversation.py`, `system_prompt.py`, `safety_constants.py` |
| **L1: Infrastructure** | `core/llm/` | 16 | `router.py`, `fallback.py`, `client.py`, `providers/anthropic.py`, `providers/openai.py`, `providers/glm.py`, `token_tracker.py`, `prompt_assembler.py`, `skill_registry.py` |
| **L1: Gateway** | `core/gateway/` | 13 | `channel_manager.py`, `pollers/discord_poller.py`, `pollers/slack_poller.py`, `pollers/telegram_poller.py`, `auth/rotation.py`, `auth/cooldown.py` |
| **L2: Memory** | `core/memory/` | 14 | `agent_memory.py`, `context.py`, `hybrid_session.py`, `organization.py`, `project.py`, `project_journal.py`, `session.py`, `user_profile.py`, `vault.py` |
| **L3: Orchestration** | `core/orchestration/` | 14 | `bootstrap.py`, `task_system.py`, `task_bridge.py`, `planner.py`, `plan_mode.py`, `goal_decomposer.py`, `coalescing.py`, `lane_queue.py`, `stuck_detection.py`, `context_monitor.py`, `hot_reload.py`, `run_log.py`, `isolated_execution.py` |
| **L4: Extensibility — Tools** | `core/tools/` | 13 | `registry.py`, `base.py`, `policy.py`, `analysis.py`, `web_tools.py`, `data_tools.py`, `memory_tools.py`, `signal_tools.py`, `calendar_tools.py`, `output_tools.py`, `document_tools.py`, `profile_tools.py` |
| **L4: Extensibility — MCP** | `core/mcp/` | 18 | `manager.py`, `catalog.py`, `base.py`, `stdio_client.py`, `composite_calendar.py`, `composite_notification.py`, `composite_signal.py`, `slack_adapter.py`, `discord_adapter.py`, `telegram_adapter.py`, `steam_adapter.py` |
| **L4: Extensibility — Skills** | `core/skills/` | 6 | `skills.py`, `plugins.py`, `agents.py`, `reports.py`, `_frontmatter.py` |
| **L4.5: Automation** | `core/automation/` | 13 | `drift.py` (CUSUM), `outcome_tracking.py`, `model_registry.py`, `snapshot.py`, `triggers.py`, `scheduler.py`, `feedback_loop.py`, `expert_panel.py`, `correlation.py`, `nl_scheduler.py`, `calendar_bridge.py`, `predefined.py` |
| **L5: Domain Plugins** | `core/domains/` | 14 | `port.py` (DomainPort Protocol), `loader.py`, `game_ip/adapter.py`, `game_ip/nodes/router.py`, `game_ip/nodes/analysts.py`, `game_ip/nodes/evaluators.py`, `game_ip/nodes/scoring.py`, `game_ip/nodes/signals.py`, `game_ip/nodes/synthesizer.py` |
| **Hooks (Cross-cutting)** | `core/hooks/` | 7 | `system.py`, `discovery.py`, `context_action.py`, `approval_tracker.py`, `plugins/notification_hook/hook.py` |
| **Verification** | `core/verification/` | 7 | `guardrails.py`, `biasbuster.py`, `cross_llm.py`, `calibration.py`, `rights_risk.py`, `stats.py` |
| **Runtime Wiring** | `core/runtime_wiring/` | 5 | `bootstrap.py`, `automation.py`, `infra.py`, `adapters.py` |
| **TOTAL** | | **185** | |

### 2. Layer Architecture from `CLAUDE.md`

```
L0: CLI & AGENT      — Typer CLI, AgenticLoop, SubAgentManager, Batch
L1: INFRASTRUCTURE   — ClaudeAdapter, OpenAIAdapter, MCP Adapters (Ports co-located with consumers)
L2: MEMORY           — Organization > Project > Session + User Profile (4-Tier + Hybrid L1/L2)
L3: ORCHESTRATION    — TaskGraph DAG, PlanMode, CoalescingQueue, LaneQueue (hooks separately extracted)
L4: EXTENSIBILITY    — ToolRegistry(47), PolicyChain, Skills, MCP Catalog(44), Reports
L5: DOMAIN PLUGINS   — DomainPort Protocol, GameIPDomain, LangGraph StateGraph
```

### 3. Layer Dependency Rules

- **L0 → L1, L2, L3, L4** (CLI/Agent can access all lower layers)
- **L4 → L5** (Extensibility invokes Domain plugins)
- **Hooks: Cross-cutting** — accessible from ALL layers via `from core.hooks import HookSystem, HookEvent`
- **No upward dependencies**: L5 never imports L0-L3 directly

### 4. 3-Tier Abstraction Pattern

```
Orchestration (L3)  →  Agent (L0)  →  Domain (L5)
    PlanMode             AgenticLoop      GameIPDomain
    TaskGraph            SubAgent         LangGraph StateGraph
    CoalescingQueue      ToolExecutor     DomainPort Protocol
```

The 3-Tier pattern separates:
- **Orchestration**: "what to do and when" (DAG scheduling, stuck detection, plan mode)
- **Agent**: "how to execute" (while(tool_use) loop, error recovery, HITL safety)
- **Domain**: "business logic" (game IP analysis pipeline, scoring, classification)

### 5. STAR Narrative — Why 6 Layers?

**Situation**: GEODE started as a monolithic CLI tool (v0.1-v0.18). As capabilities grew (47 tools, 3 LLM providers, MCP, sub-agents, automation), the single-module architecture became unmanageable. `runtime.py` alone reached 1,476 lines.

**Task**: Restructure so that adding a new domain (e.g., financial analysis) does not require touching infrastructure code, and vice versa.

**Action**: Adopted a 6-layer architecture with strict dependency direction (higher layers import lower). Extracted `core/hooks/` as cross-cutting infrastructure. Decomposed `runtime.py` from 1,476 lines to 517 lines + 4 wiring modules.

**Result**: Domain plugin swap requires implementing only `DomainPort` Protocol (12 methods). New tools are added via `definitions.json` + handler function. New MCP servers auto-discovered via catalog. 185 modules with clear ownership boundaries.

### 6. Trade-off Analysis

| Aspect | 6-Layer (Chosen) | Flat / 2-Layer (Rejected) |
|--------|------------------|---------------------------|
| **Pivot ability** | New domain = implement DomainPort Protocol only | New domain = touch every file |
| **Dependency clarity** | Layer violations detectable by import analysis | Circular dependencies accumulate silently |
| **Onboarding** | Must learn layer map (6 layers) | Simpler mental model initially |
| **Overhead** | More files, deeper import chains | Fewer files, faster grep |
| **Concrete win** | `core/hooks/` extraction resolved 26 cross-layer imports that violated L3 boundary | N/A |

---

## S09 — Agentic Loop (`while(tool_use)`)

### 1. The Core Loop — Exact Code

**Class**: `AgenticLoop` in `core/agent/agentic_loop.py`
**Method**: `async def arun(self, user_input: str) -> AgenticResult`
**Sync wrapper**: `def run(self, user_input: str)` calls `asyncio.run(self.arun(user_input))`

The loop condition (from docstring and implementation):

```python
class AgenticLoop:
    """Claude Code-style agentic execution loop.

    while stop_reason == "tool_use":
        execute tools -> feed results back -> continue
    """

    DEFAULT_MAX_ROUNDS = 50
    DEFAULT_MAX_TOKENS = 32768
    WRAP_UP_HEADROOM = 2  # force text response N rounds before max
```

The actual iteration:

```python
for round_idx in range(self.max_rounds):
    is_last_round = round_idx == self.max_rounds - 1

    response = await self._call_llm(system_prompt, messages, round_idx=round_idx)

    if response.stop_reason != "tool_use":
        # end_turn or max_tokens -> extract text, done
        reason = "forced_text" if is_last_round else "natural"
        result = AgenticResult(text=text, ...)
        return self._finalize_and_return(result, ...)

    tool_results = await self._tool_processor.process(response)
    # ... feed tool_results back to messages, continue loop
```

### 2. Key Parameters

| Parameter | Default | Description |
|-----------|---------|-------------|
| `max_rounds` | 50 | Maximum tool_use iterations before forced termination |
| `max_tokens` | 32,768 | Max tokens per LLM response |
| `WRAP_UP_HEADROOM` | 2 | Force text response N rounds before max |
| `ESCALATION_THRESHOLD` | 2 | Consecutive LLM failures before model escalation |
| `model` | `claude-opus-4-6` (ANTHROPIC_PRIMARY) | Primary model |
| `provider` | `"anthropic"` | Provider: "anthropic", "openai", or "glm" |
| `enable_goal_decomposition` | `True` | Auto-decompose compound requests into sub-goal DAGs |

### 3. Termination Reasons (`AgenticResult.termination_reason`)

| Reason | Trigger |
|--------|---------|
| `"natural"` | LLM emits `end_turn` (stop_reason != "tool_use") |
| `"forced_text"` | Hit `max_rounds` limit, forced text extraction |
| `"max_rounds"` | Exceeded iteration budget |
| `"llm_error"` | LLM call failed after escalation attempts |
| `"billing_error"` | API billing/credit error |
| `"user_cancelled"` | User interrupted via Ctrl+C |

### 4. Tool Dispatch Routes — 3 Paths

**Class**: `ToolExecutor` in `core/agent/tool_executor.py`
**Method**: `def execute(self, tool_name: str, tool_input: dict) -> dict`

```python
def execute(self, tool_name, tool_input):
    # 1. Safety gates (HITL approval for dangerous/write/expensive tools)
    gate_result, approved = self._apply_safety_gates(tool_name, tool_input)
    if gate_result is not None:
        return gate_result

    # Route 1: Sub-agent delegation
    if tool_name == "delegate_task":
        return self._execute_delegate(tool_input)

    # Route 2: Registered native handler
    handler = self._handlers.get(tool_name)
    if handler is not None:
        return handler(**tool_input)

    # Route 3: MCP fallback (auto-discovered external tools)
    if self._mcp_manager is not None:
        server = self._mcp_manager.find_server_for_tool(tool_name)
        if server is not None:
            return self._execute_mcp(server, tool_name, tool_input)

    return {"error": f"Unknown tool: '{tool_name}'"}
```

**3 Dispatch Routes:**

| Route | Condition | Handler | Safety Level |
|-------|-----------|---------|-------------|
| **Native (47 tools)** | `self._handlers.get(tool_name)` exists | Python function from `ToolRegistry` | SAFE / STANDARD / WRITE / DANGEROUS |
| **MCP (44 catalog)** | `mcp_manager.find_server_for_tool()` succeeds | `stdio_client` → external server | AUTO_APPROVED (4 servers) or first-call HITL |
| **Bash** | `tool_name == "run_bash"` | `BashTool` with blocked-pattern + safe-prefix filter | 9 blocked patterns, 41 safe prefixes, else HITL |

### 5. LLM Failover Chain

**Config**: `core/config.py`

| Provider | Fallback Chain |
|----------|---------------|
| **Anthropic** | `claude-opus-4-6` -> `claude-sonnet-4-6` |
| **OpenAI** | `gpt-5.4` -> `gpt-5.2` -> `gpt-4.1` |
| **GLM (ZhipuAI)** | `glm-5` -> `glm-5-turbo` -> `glm-4.7-flash` |

**Cross-Provider Fallback** (from `core/llm/router.py`):

```python
CROSS_PROVIDER_FALLBACK = {
    "anthropic": [("openai", "gpt-5.4")],
    "openai":    [("anthropic", "claude-opus-4-6")],
    "glm":       [("openai", "gpt-5.4"), ("anthropic", "claude-opus-4-6")],
}
```

**Mechanism**: `call_with_failover()` (async) iterates models, retries with exponential backoff per model. Non-retryable errors (AuthenticationError, BadRequestError) abort immediately.

### 6. CircuitBreaker Implementation

**Class**: `CircuitBreaker` in `core/llm/fallback.py`

```python
class CircuitBreaker:
    """Thread-safe circuit breaker for LLM API calls."""

    def __init__(self, failure_threshold: int = 5, recovery_timeout: float = 60.0):
        self._lock = threading.Lock()
        self._failures = 0
        self._threshold = failure_threshold
        self._recovery_timeout = recovery_timeout
        self._state: str = "closed"  # closed, open, half-open
```

**States**: `closed` (normal) -> `open` (after 5 failures, blocks calls) -> `half-open` (after 60s cooldown, allows one test call) -> `closed` (on success)

**Thread safety**: `threading.Lock()` protects all state mutations. Required because sub-agents use `ThreadPoolExecutor` with `MAX_CONCURRENT=5`.

### 7. Error Recovery — 4-Stage Strategy Chain

**Class**: `ErrorRecoveryStrategy` in `core/agent/error_recovery.py`

```python
class RecoveryStrategy(StrEnum):
    RETRY = "retry"           # Stage 1: retry with 1s delay
    ALTERNATIVE = "alternative"  # Stage 2: same category, different tool
    FALLBACK = "fallback"     # Stage 3: cheaper cost_tier tool
    ESCALATE = "escalate"     # Stage 4: HITL (always returns failure)
```

**Trigger**: After `MAX_CONSECUTIVE_FAILURES = 2` for the same tool name.
**Safety exclusion**: `run_bash`, `memory_save`, `note_save`, `set_api_key`, `manage_auth` are NEVER auto-recovered.
**Cost tier ordering**: `free (0) < cheap (1) < expensive (2)` — fallback picks cheaper.

**Strategy selection logic**:
- 1st failure: `[RETRY]` only
- 2nd+ failure: `[RETRY, ALTERNATIVE, FALLBACK, ESCALATE]`
- Max 3 total recovery attempts per chain

### 8. STAR Narrative — Why LLM Direct Tool Selection (No NL Router)?

**Situation**: GEODE v0.1-v0.18 had an `NLRouter` (`core/cli/nl_router.py`) that used regex + heuristics to classify user intent and route to specific pipelines. As tool count grew to 47+, the router became a maintenance bottleneck — every new tool needed new routing rules.

**Task**: Determine whether to maintain the NL Router or let the LLM handle tool selection directly.

**Action**: In v0.19.1 (2026-03-18), completely removed `nl_router.py` (and 1,224 lines of router tests). All free-text input routes directly to `AgenticLoop.run()`. The LLM sees all 47 tool definitions and autonomously chooses via `tool_use` API.

**Result**: Zero routing maintenance overhead. New tools are added by appending to `definitions.json` — the LLM discovers them automatically. Multi-intent requests ("analyze and compare") work naturally via sequential tool_use calls.

**CHANGELOG entry (v0.19.1)**:
> "NL Router 이중 라우팅 제거 — 모든 자유 텍스트 AgenticLoop 직행. ip_names.py, system_prompt.py 분리 추출"

### 9. Trade-off: LLM Direct vs NL Router

| Aspect | LLM Direct (Chosen) | NL Router (Rejected) |
|--------|---------------------|---------------------|
| **New tool onboarding** | Add to definitions.json only | Edit router + regex + tests |
| **Multi-intent** | Native (sequential tool_use) | Required compound intent parsing |
| **Latency** | 1 LLM call (includes tool decision) | 2 calls (router + execution) |
| **Reliability** | LLM understands context, rarely misroutes | Regex-based, brittle on edge cases |
| **Cost** | Full tool definitions in every prompt (~tokens) | Smaller prompts for routing |
| **Controllability** | LLM is a black box for tool selection | Deterministic routing rules |

---

## S10 — Hook System (Cross-Cutting Nervous System)

### 1. HookEvent Enum — Complete List (40 Events)

**Source**: `core/hooks/system.py` — `class HookEvent(Enum)`

#### Category: Pipeline (3 events)

| Event | Value | Source | Description |
|-------|-------|--------|-------------|
| `PIPELINE_START` | `pipeline_start` | `_make_hooked_node` (router node) | Pipeline execution begins |
| `PIPELINE_END` | `pipeline_end` | `_make_hooked_node` (synthesizer) | Pipeline completes successfully |
| `PIPELINE_ERROR` | `pipeline_error` | `_make_hooked_node` (exception) | Pipeline fails with error |

#### Category: Node (4 events)

| Event | Value | Source | Description |
|-------|-------|--------|-------------|
| `NODE_BOOTSTRAP` | `node_bootstrap` | `BootstrapManager` | Node initialization |
| `NODE_ENTER` | `node_enter` | `_make_hooked_node` | Node execution starts |
| `NODE_EXIT` | `node_exit` | `_make_hooked_node` | Node execution completes |
| `NODE_ERROR` | `node_error` | `_make_hooked_node` | Node fails with exception |

#### Category: Analysis (3 events)

| Event | Value | Source | Description |
|-------|-------|--------|-------------|
| `ANALYST_COMPLETE` | `analyst_complete` | Node completion mapping | Analyst node finished |
| `EVALUATOR_COMPLETE` | `evaluator_complete` | Node completion mapping | Evaluator node finished |
| `SCORING_COMPLETE` | `scoring_complete` | Node completion mapping | Scoring node finished |

#### Category: Verification (2 events)

| Event | Value | Source | Description |
|-------|-------|--------|-------------|
| `VERIFICATION_PASS` | `verification_pass` | Guardrails pass | Verification passed |
| `VERIFICATION_FAIL` | `verification_fail` | Guardrails fail | Verification failed |

#### Category: Automation / L4.5 (6 events)

| Event | Value | Source | Description |
|-------|-------|--------|-------------|
| `DRIFT_DETECTED` | `drift_detected` | `CUSUMDetector` | Statistical drift detected |
| `OUTCOME_COLLECTED` | `outcome_collected` | `OutcomeTracker` | Feedback cycle outcome recorded |
| `MODEL_PROMOTED` | `model_promoted` | `ModelRegistry` | Model version promoted to new stage |
| `SNAPSHOT_CAPTURED` | `snapshot_captured` | `SnapshotManager` | Pipeline state snapshot taken |
| `TRIGGER_FIRED` | `trigger_fired` | `TriggerManager` | Scheduled/event trigger activated |
| `POST_ANALYSIS` | `post_analysis` | (reserved) | Post-analysis phase |

#### Category: Memory Autonomy (4 events)

| Event | Value | Source | Description |
|-------|-------|--------|-------------|
| `MEMORY_SAVED` | `memory_saved` | (planned) | Memory persist event |
| `RULE_CREATED` | `rule_created` | (planned) | Automation rule created |
| `RULE_UPDATED` | `rule_updated` | (planned) | Automation rule updated |
| `RULE_DELETED` | `rule_deleted` | (planned) | Automation rule deleted |

#### Category: Prompt (2 events)

| Event | Value | Source | Description |
|-------|-------|--------|-------------|
| `PROMPT_ASSEMBLED` | `prompt_assembled` | `PromptAssembler` | System prompt assembled (metadata only, secure) |
| `PROMPT_DRIFT_DETECTED` | `prompt_drift_detected` | (reserved) | Prompt content drift |

#### Category: SubAgent (3 events)

| Event | Value | Source | Description |
|-------|-------|--------|-------------|
| `SUBAGENT_STARTED` | `subagent_started` | `SubAgentManager` | Sub-agent spawned |
| `SUBAGENT_COMPLETED` | `subagent_completed` | `SubAgentManager` | Sub-agent finished |
| `SUBAGENT_FAILED` | `subagent_failed` | `SubAgentManager` | Sub-agent failed |

#### Category: Tool Recovery (3 events)

| Event | Value | Source | Description |
|-------|-------|--------|-------------|
| `TOOL_RECOVERY_ATTEMPTED` | `tool_recovery_attempted` | `ToolCallProcessor` | Recovery chain started |
| `TOOL_RECOVERY_SUCCEEDED` | `tool_recovery_succeeded` | `ToolCallProcessor` | Recovery succeeded |
| `TOOL_RECOVERY_FAILED` | `tool_recovery_failed` | `ToolCallProcessor` | Recovery failed |

#### Category: Gateway (2 events)

| Event | Value | Source | Description |
|-------|-------|--------|-------------|
| `GATEWAY_MESSAGE_RECEIVED` | `gateway_message_received` | (planned) | Inbound message from Slack/Discord/Telegram |
| `GATEWAY_RESPONSE_SENT` | `gateway_response_sent` | (planned) | Outbound response sent |

#### Category: MCP (2 events)

| Event | Value | Source | Description |
|-------|-------|--------|-------------|
| `MCP_SERVER_STARTED` | `mcp_server_started` | (reserved) | MCP server process started |
| `MCP_SERVER_STOPPED` | `mcp_server_stopped` | (reserved) | MCP server process stopped |

#### Category: Turn (1 event)

| Event | Value | Source | Description |
|-------|-------|--------|-------------|
| `TURN_COMPLETE` | `turn_complete` | `AgenticLoop` | Agentic turn finished (user_input, tools, result) |

#### Category: Context (3 events)

| Event | Value | Source | Description |
|-------|-------|--------|-------------|
| `CONTEXT_WARNING` | `context_warning` | (reserved) | Context usage > 80% |
| `CONTEXT_CRITICAL` | `context_critical` | (planned) | Context usage > 95% |
| `CONTEXT_OVERFLOW_ACTION` | `context_overflow_action` | `AgenticLoop._check_context_overflow` | Decide compression strategy |

#### Category: Session (2 events)

| Event | Value | Source | Description |
|-------|-------|--------|-------------|
| `SESSION_START` | `session_start` | REPL bootstrap | Session begins |
| `SESSION_END` | `session_end` | REPL exit | Session ends |

**Summary**: 40 events across 13 categories.

| Category | Count | Status |
|----------|-------|--------|
| Pipeline | 3 | Active |
| Node | 4 | Active |
| Analysis | 3 | Active |
| Verification | 2 | Active |
| Automation | 6 | Active (5) + Reserved (1) |
| Memory | 4 | Planned |
| Prompt | 2 | Active (1) + Reserved (1) |
| SubAgent | 3 | Active |
| Tool Recovery | 3 | Active |
| Gateway | 2 | Planned |
| MCP | 2 | Reserved |
| Turn | 1 | Active |
| Context | 3 | Active (1) + Planned (1) + Reserved (1) |
| Session | 2 | Active |

### 2. HookSystem Class — Key Code

```python
class HookSystem:
    def __init__(self) -> None:
        self._hooks: dict[HookEvent, list[_RegisteredHook]] = {}
        self._lock = threading.Lock()

    def register(self, event, handler, *, name=None, priority=100) -> None:
        """Register handler. Lower priority number = runs first."""
        # Protected by self._lock. Sorted by priority after insert.

    def trigger(self, event, data=None) -> list[HookResult]:
        """Fire all handlers for event. Errors in one don't stop others."""
        # Copies hook list under lock, then executes without lock held.

    def trigger_with_result(self, event, data=None) -> list[HookResult]:
        """Like trigger(), but captures handler return values in HookResult.data."""
        # Enables feedback hooks (e.g. CONTEXT_OVERFLOW_ACTION -> strategy dict)
```

**Thread safety**: `threading.Lock()` protects `self._hooks` dict. Hook list is copied under lock, then executed without lock held (non-blocking).

**Error isolation**: Each handler is wrapped in try/except. One handler failure logs a warning but does NOT prevent subsequent handlers from executing.

### 3. Plugin Discovery System

**Module**: `core/hooks/discovery.py` — `HookPluginLoader`

**Two plugin formats**:

**Format 1: Class-based (`hook.py`)**
```python
# .geode/hooks/my_hook/hook.py
class MyHook:
    @property
    def metadata(self) -> HookPluginMetadata:
        return HookPluginMetadata(
            name="my_hook",
            events=[HookEvent.PIPELINE_END],
            priority=75,
        )
    def handle(self, event: HookEvent, data: dict) -> None:
        pass  # Custom logic
```

**Format 2: YAML-based (`hook.yaml`)**
```yaml
# .geode/hooks/my_hook/hook.yaml
name: my_hook
events: [pipeline_end, pipeline_error]
priority: 75
handler: handler.py   # Python module path relative to plugin dir
enabled: true
requires:
  packages: [requests]
```

**Discovery flow**: `HookPluginLoader.load_from_dirs(dirs)` scans directories, loads plugins, then `register_all(hooks)` registers each plugin's `handle()` method for its declared events at its declared priority.

**Existing plugin**: `core/hooks/plugins/notification_hook/` — routes PIPELINE_END, PIPELINE_ERROR, DRIFT_DETECTED, SUBAGENT_FAILED to Slack/Discord/Telegram via `NotificationPort` adapter.

### 4. Registered Handlers — Complete Priority Table

**Source**: `core/runtime_wiring/bootstrap.py` (`build_hooks()`) + `core/runtime_wiring/automation.py` (`wire_automation_hooks()`)

| Priority | Handler Name | Events | Registration Site | Maturity |
|----------|-------------|--------|-------------------|----------|
| **30** | `task_bridge_*` | `NODE_ENTER`, `NODE_EXIT`, `NODE_ERROR` | `TaskGraphHookBridge.register()` | L1 Observe |
| **40** | `stuck_tracker` | `PIPELINE_START`, `PIPELINE_END`, `PIPELINE_ERROR` | `bootstrap.build_hooks()` | L1 Observe |
| **50** | `run_log_writer` | **ALL 40 events** | `bootstrap.build_hooks()` | L1 Observe |
| **50** | `context_action_handler` | `CONTEXT_OVERFLOW_ACTION` | `bootstrap.build_hooks()` | L3 Decide |
| **60** | `journal_pipeline_end` | `PIPELINE_END` | `bootstrap.build_hooks()` | L1 Observe |
| **60** | `journal_pipeline_error` | `PIPELINE_ERROR` | `bootstrap.build_hooks()` | L1 Observe |
| **60** | `journal_subagent` | `SUBAGENT_COMPLETED` | `bootstrap.build_hooks()` | L1 Observe |
| **70** | `drift_pipeline_trigger` | `DRIFT_DETECTED` | `automation.wire_automation_hooks()` | L2 React |
| **80** | `drift_auto_snapshot` | `DRIFT_DETECTED` | `automation.wire_automation_hooks()` | L2 React |
| **80** | `pipeline_end_snapshot` | `PIPELINE_END` | `automation.wire_automation_hooks()` | L2 React |
| **85** | `memory_write_back` | `PIPELINE_END` | `automation.wire_automation_hooks()` | L2 React |
| **85** | `turn_auto_memory` | `TURN_COMPLETE` | `bootstrap.build_hooks()` | L2 React |
| **90** | `drift_logger` | `DRIFT_DETECTED` | `automation.wire_automation_hooks()` | L1 Observe |
| **90** | `snapshot_logger` | `SNAPSHOT_CAPTURED` | `automation.wire_automation_hooks()` | L1 Observe |
| **90** | `trigger_logger` | `TRIGGER_FIRED` | `automation.wire_automation_hooks()` | L1 Observe |
| **90** | `outcome_logger` | `OUTCOME_COLLECTED` | `automation.wire_automation_hooks()` | L1 Observe |
| **90** | `model_promotion_logger` | `MODEL_PROMOTED` | `automation.wire_automation_hooks()` | L1 Observe |
| **90** | `session_start_logger` | `SESSION_START` | `bootstrap.build_hooks()` | L1 Observe |
| **90** | `session_end_logger` | `SESSION_END` | `bootstrap.build_hooks()` | L1 Observe |
| **200** | `notification_pipeline_end` | `PIPELINE_END` | `notification_hook plugin` | L1 Observe |
| **200** | `notification_pipeline_error` | `PIPELINE_ERROR` | `notification_hook plugin` | L1 Observe |
| **200** | `notification_drift_detected` | `DRIFT_DETECTED` | `notification_hook plugin` | L1 Observe |
| **200** | `notification_subagent_failed` | `SUBAGENT_FAILED` | `notification_hook plugin` | L1 Observe |

**Total registered handlers**: 23

### 5. Hook Maturity Model (4 Levels)

```
L4 AUTONOMY    Pattern -> autonomous rule learning
  (backlog)    hook-tool-approval: HITL history -> auto-approve rules
               hook-model-switched: switch reasons -> auto-switch policy
               hook-filesystem-plugin: .geode/hooks/ auto-discovery

L3 DECIDE      Hook decides action direction
  (frontier)   context_action_handler: CONTEXT_CRITICAL -> compression strategy

L2 REACT       Auto-react to events
  (active)     turn_auto_memory (P85): TURN_COMPLETE -> insight saved
               drift_auto_snapshot (P80): DRIFT -> state capture
               memory_write_back (P85): PIPELINE_END -> MEMORY.md
               pipeline_end_snapshot (P80): PIPELINE_END -> snapshot
               drift_pipeline_trigger (P70): DRIFT -> re-analysis pipeline

L1 OBSERVE     Record only, no state change
  (active)     TaskGraphBridge (P30): NODE_ENTER/EXIT/ERROR
               StuckDetector (P40): PIPELINE_START/END/ERROR
               RunLog (P50): ALL 40 events -> JSONL
               JournalHook (P60): END/ERROR/SUBAGENT -> journal
               NotificationHook (P200): END/ERROR -> Slack/external alerts
               TableLoggers x5 (P90): Automation events -> structured logging
```

### 6. Ripple Pattern — One Event Triggers Multiple Maturity Levels

Same event fires L1 (observe) + L2 (react) handlers simultaneously.
Priority ordering ensures observation before reaction.

```
PIPELINE_END    -> P50  RunLog           (L1 OBSERVE — record to JSONL)
                -> P60  JournalHook      (L1 OBSERVE — write runs.jsonl)
                -> P80  SnapshotCapture  (L2 REACT  — auto-snapshot)
                -> P85  MemoryWriteBack  (L2 REACT  — write MEMORY.md)
                -> P200 Notification     (L1 OBSERVE — Slack alert)

DRIFT_DETECTED  -> P70  DriftTrigger     (L2 REACT  — re-analysis)
                -> P80  DriftSnapshot    (L2 REACT  — debug capture)
                -> P90  DriftLogger      (L1 OBSERVE — structured log)
                -> P200 Notification     (L1 OBSERVE — Slack alert)

TURN_COMPLETE   -> P50  RunLog           (L1 OBSERVE — event record)
                -> P85  TurnAutoMemory   (L2 REACT  — insight saved)
```

### 7. Event Firing Sequence During Pipeline Run

```
1.  NODE_BOOTSTRAP          (bootstrap_mgr exists)
2.  PromptAssembler inject  (state["_prompt_assembler"])
3.  NODE_ENTER              (every node)
4.  PIPELINE_START          (router node only)
5.  node_fn(state) execute
6a. NODE_EXIT               (success)
6b. ANALYST_COMPLETE        (analyst nodes)
6b. EVALUATOR_COMPLETE      (evaluator nodes)
6b. SCORING_COMPLETE        (scoring node)
6c. VERIFICATION_PASS/FAIL  (verification node)
6d. PIPELINE_END            (synthesizer node)
--- or on exception ---
6e. NODE_ERROR + PIPELINE_ERROR  (both triggered)
```

AgenticLoop turn boundary:
```
1. user_input received
2. LLM call -> tool_use iteration
3. Turn termination decision
4. TURN_COMPLETE (text, user_input, tool_calls, rounds)
```

### 8. STAR Narrative — Why Extract Hooks from L3?

**Situation**: HookSystem originally lived inside `core/orchestration/` (L3). As hook usage grew, 26 consumers across L0 (CLI), L1 (LLM), L2 (Memory), and L4 (Tools) all imported from `core.orchestration`. This created a dependency violation: lower layers (L0) and peer layers (L1, L2, L4) all importing from L3 (Orchestration).

**Task**: Resolve the cross-layer dependency violation without breaking the 26 existing import sites.

**Action**: Extracted `HookSystem`, `HookEvent`, `HookResult`, `HookPluginLoader`, and `plugins/` into a new top-level module `core/hooks/`. Updated all 26 consumers to `from core.hooks import HookSystem, HookEvent`. Declared hooks as a "cross-cutting concern" — accessible from any layer, owned by no specific layer.

**Result**: Layer dependency graph is now clean. `core/hooks/` has zero imports from L0-L5 (only stdlib + yaml). Any layer can import hooks without creating upward dependencies.

**CHANGELOG entry (v0.30.0 [Unreleased])**:
> "`core/hooks/` 신설 — HookSystem/HookEvent/HookResult + HookPluginLoader + plugins/를 `core/orchestration/`에서 분리. Cross-cutting concern이므로 별도 최상위 모듈로. 26개 소비자 `from core.hooks import HookSystem` 경로 통일. L0~L4가 L3(orchestration)에 의존하던 레이어 위반 해소."

### 9. Trade-off Analysis — Observer Pattern

| Aspect | Observer/Hook Pattern (Chosen) | Direct Coupling (Rejected) |
|--------|-------------------------------|---------------------------|
| **Extensibility** | New handler = `hooks.register()`, zero core changes | New behavior = edit pipeline code |
| **Plugin system** | YAML/class-based external plugins in `.geode/hooks/` | No external extension possible |
| **Overhead** | Priority sort on register, lock on trigger, try/except per handler | Zero overhead — direct function calls |
| **Debugging** | `hooks.list_hooks()` introspection, RunLog captures all events | Stack trace shows direct call chain |
| **Thread safety** | `threading.Lock()` required (sub-agents use ThreadPoolExecutor) | No lock needed if single-threaded |
| **Error isolation** | One handler crash does not stop others | One crash propagates up call stack |
| **Concrete numbers** | 40 events, 23 handlers, 13 categories, 4 maturity levels | N/A |

### 10. Design Principles (from `docs/architecture/hook-system.md`)

1. **Non-blocking execution**: One handler exception does not stop others
2. **Priority-sorted**: Lower number = higher priority (30 -> 90 -> 200)
3. **Metadata-only emission**: `PROMPT_ASSEMBLED` sends hash + stats only (security)
4. **`HookResult` return**: All handler success/failure results introspectable
5. **Cross-cutting**: `core/hooks/` is independent module — importable from any layer
6. **Maturity evolution**: Same event gets L1 (observe) -> L2 (react) -> L3 (decide) -> L4 (autonomy) handlers progressively
7. **Plugin extension**: External extension via `.geode/hooks/` directory, no core modifications

### 11. `trigger_with_result()` — Feedback Hooks

A unique capability: hooks that return data to the caller.

```python
def trigger_with_result(self, event, data=None) -> list[HookResult]:
    """If a handler returns a dict, it's stored in HookResult.data."""
```

**Use case**: `CONTEXT_OVERFLOW_ACTION` handler returns `{"strategy": "prune", "keep_recent": 5}`. The `AgenticLoop._check_context_overflow` method reads this to decide compression strategy. This makes hook handlers into extensible decision-makers, not just observers.

### 12. `ApprovalTracker` — L4 Autonomy Preview

**Module**: `core/hooks/approval_tracker.py`

Records HITL approval decisions to `~/.geode/approval_history.jsonl`. After 5 consecutive approvals with no denials in 30 days, `suggest_auto_approve()` returns True. This is the first step toward L4 Autonomy — the system learns from human decisions.

---

## Cross-Slide Connections

### S08 -> S09 Connection
The 6-layer architecture (S08) defines WHERE things live. The AgenticLoop (S09) is the execution primitive that TRAVERSES layers: L0 (loop control) -> L1 (LLM call) -> L4 (tool dispatch) -> L5 (domain execution).

### S09 -> S10 Connection
The AgenticLoop fires `TURN_COMPLETE` at every turn boundary. `ToolCallProcessor` fires `TOOL_RECOVERY_*` events. The LLM failover chain in S09 has a corresponding `CircuitBreaker` that could be wired to MCP_SERVER_* events. The loop IS the heartbeat; hooks ARE the nervous system.

### S08 -> S10 Connection
Hook extraction from L3 was an architectural decision (S08) that created the cross-cutting `core/hooks/` module (S10). The 6-layer structure REQUIRES hooks to be outside any specific layer because ALL layers need them. This is the architectural proof that hooks are truly cross-cutting infrastructure.

---

## Key File Paths

| File | Role |
|------|------|
| `core/hooks/system.py` | HookEvent enum (40), HookSystem class, HookResult, _RegisteredHook |
| `core/hooks/discovery.py` | HookPluginLoader, YAML + class-based plugin discovery |
| `core/hooks/context_action.py` | CONTEXT_OVERFLOW_ACTION handler (L3 Decide) |
| `core/hooks/approval_tracker.py` | HITL approval learning (L4 Autonomy preview) |
| `core/hooks/plugins/notification_hook/hook.py` | External notification routing |
| `core/agent/agentic_loop.py` | AgenticLoop class, while(tool_use) loop |
| `core/agent/tool_executor.py` | ToolExecutor (3-route dispatch), ToolCallProcessor |
| `core/agent/error_recovery.py` | ErrorRecoveryStrategy (4-stage chain) |
| `core/llm/router.py` | resolve_agentic_adapter(), CROSS_PROVIDER_FALLBACK, call_with_failover() |
| `core/llm/fallback.py` | CircuitBreaker, retry_with_backoff_generic() |
| `core/config.py` | ANTHROPIC_FALLBACK_CHAIN, OPENAI_FALLBACK_CHAIN, GLM_FALLBACK_CHAIN |
| `core/runtime_wiring/bootstrap.py` | build_hooks() — registers 10+ core handlers |
| `core/runtime_wiring/automation.py` | wire_automation_hooks() — registers 12+ automation handlers |
| `docs/architecture.md` | 6-layer diagram, agentic loop flow, tool execution hierarchy |
| `docs/architecture/hook-system.md` | Hook maturity model, ripple pattern, complete handler table |
| `CLAUDE.md` | Architecture overview, layer descriptions, conventions |
