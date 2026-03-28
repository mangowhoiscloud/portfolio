# GEODE Tool Dispatch Layer — Comprehensive SOT

**Document**: Complete dispatch architecture from LLM tool_use to execution result  
**Coverage**: Tool classification, routing decision tree, HITL gates, error recovery, deferred loading  
**Scope**: 3,225 lines across 6 core modules  
**Files**: tool_executor.py (1179L) + registry.py (401L) + policy.py (431L) + bash_tool.py (173L) + mcp/manager.py (580L) + error_recovery.py (461L)

---

## 1. DISPATCH FLOW — FROM LLM RESPONSE TO EXECUTION

### 1.1 Full Pipeline Sequence

```
┌─────────────────────────────────────────────────────────────────────┐
│ 1. LLM RESPONSE (Anthropic API)                                     │
│    └─ Returns: ContentBlock[] with tool_use elements                │
└──────────────────────────────┬──────────────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────────────┐
│ 2. ToolCallProcessor.process(response) [ASYNC]                     │
│    └─ File: core/agent/tool_executor.py:806                        │
│    └─ Input: response.content with tool_use blocks                 │
│    └─ Output: list[dict] with tool_results (JSON serialized)       │
│                                                                      │
│    ▼ Classification                                                 │
│    if len(tool_blocks) <= 1 → _execute_sequential()                │
│    else → _execute_parallel() with 5-tier dispatch                 │
└──────────────────────────────┬──────────────────────────────────────┘
                               │
          ┌────────────────────┼────────────────────┐
          │                    │                    │
          ▼                    ▼                    ▼
    SEQUENTIAL         PARALLEL TIERED         PARALLEL TIERED
    [Single tool]      [2+ tools]              [2+ tools]
    Direct to          Tier 0-1: batch         Tier 2: cost gate
    _execute_single()  Tier 2: cost gate       Tier 3-4: seq
                       Tier 3-4: sequential
          │                    │                    │
          └────────────────────┴────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────────────┐
│ 3. ToolCallProcessor._execute_single(block) [ASYNC]                │
│    └─ File: core/agent/tool_executor.py:874                        │
│    └─ Per-tool failure tracking (_consecutive_failures)            │
│    └─ Check: fail_count >= MAX_CONSECUTIVE_FAILURES (2)            │
│       YES → _attempt_recovery() (adaptive chain)                   │
│       NO  → ToolExecutor.execute()                                 │
└──────────────────────────────┬──────────────────────────────────────┘
                               │
                ┌──────────────┴──────────────┐
                │                             │
                ▼                             ▼
          RECOVERY PATH              NORMAL EXECUTION PATH
    _attempt_recovery()               ToolExecutor.execute()
    [Retry → Alt → Fallback]         [HITL gates + dispatch]
                │                             │
                └──────────────┬──────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────────────┐
│ 4. ToolExecutor.execute(tool_name, tool_input) [SYNC]              │
│    └─ File: core/agent/tool_executor.py:239                        │
│    └─ Returns: dict[str, Any]                                      │
│                                                                      │
│    Step 4.1: _apply_safety_gates()                                 │
│    ├─ DANGEROUS tools (run_bash) → _execute_dangerous()            │
│    ├─ WRITE tools (memory_save, etc) → _confirm_write() HITL       │
│    └─ EXPENSIVE tools (analyze_ip) → _confirm_cost() HITL          │
│                                                                      │
│    Step 4.2: Classify and dispatch                                 │
│    ├─ if tool_name == "run_bash" → _execute_bash()                 │
│    ├─ if handler in registry → execute handler (SYNC)              │
│    ├─ if MCP tool (no handler) → _execute_mcp()                    │
│    └─ else → error: "Unknown tool"                                 │
└──────────────────────────────┬──────────────────────────────────────┘
                               │
         ┌─────────────────────┼─────────────────────┐
         │                     │                     │
         ▼                     ▼                     ▼
    BASH PATH            NATIVE TOOL PATH        MCP PATH
    _execute_bash()      handler(**tool_input)  _execute_mcp()
    3-layer safety       Spinner wrapper        MCP manager
                         ToolSearchTool?        call_tool()
         │                     │                     │
         └─────────────────────┼─────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────────────┐
│ 5. Result Processing                                                │
│    └─ _serialize_tool_result(result, block_id)                     │
│    └─ _guard_tool_result() → token truncation (small-ctx models)   │
│    └─ JSON serialize → tool_result ContentBlock                    │
│                                                                      │
│    Return: {"type": "tool_result", "tool_use_id": "...", ...}      │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 2. TOOL CLASSIFICATION MATRIX

### 2.1 Safety Tier System (Per ToolCallProcessor._classify_tier)

| **TIER** | **Category** | **Tools** | **Execution** | **Gate** | **Order** |
|----------|-------------|-----------|---------------|----------|-----------|
| **0** | SAFE | list_ips, search_ips, show_help, check_status, read_document | Immediate | None | Parallel |
| **1** | MCP Auto-Approved | reddit, google-trends, steam (in AUTO_APPROVED_MCP_SERVERS) | Immediate | Per-server once | Parallel |
| **2** | EXPENSIVE | analyze_ip, compare_ips, batch_analyze, generate_report (~$0.15 each) | Batch gate | Batch cost prompt [Y/n] | Parallel (if approved) |
| **3** | WRITE | memory_save, note_save, set_api_key, manage_auth, profile_update, calendar_create_event | Individual gate | HITL per-tool [Y/n/A] | Sequential |
| **4** | DANGEROUS | run_bash | Individual gate | HITL + blocked patterns | Sequential |

### 2.2 Tool Categories (definitions.json — 52 tools, 12 categories)

```
CATEGORY              COUNT  TOOLS
─────────────────────────────────────────────────────────
analysis              8      analyze_ip, compare_ips, generate_report, batch_analyze,
                             rate_result, accept_result, reject_result, rerun_node

calendar              3      calendar_list_events, calendar_create_event, calendar_sync_scheduler

data                  1      generate_data

discovery             5      list_ips, search_ips, show_help, check_status, read_document

external              7      run_bash, youtube_search, reddit_sentiment, steam_info,
                             google_trends, web_fetch, general_web_search

memory                5      memory_search, memory_save, manage_rule, note_save, note_read

model                 5      switch_model, set_api_key, manage_auth, install_mcp_server,
                             manage_context

notification          1      send_notification

planning              6      delegate_task, create_plan, approve_plan, reject_plan,
                             modify_plan, list_plans

profile               4      profile_show, profile_update, profile_preference, profile_learn

scheduling            2      schedule_job, trigger_event

task                  5      task_create, task_update, task_get, task_list, task_stop
─────────────────────────────────────────────────────────
TOTAL                 52
```

### 2.3 Safety-Level Lookup Tables

**SAFE_TOOLS** (core/agent/safety_constants.py — auto-execute)
```python
{list_ips, search_ips, show_help, memory_search, check_status, read_document}
```

**WRITE_TOOLS** (core/agent/safety_constants.py — HITL confirmation)
```python
{
    memory_save, note_save, set_api_key, manage_auth, profile_update,
    profile_preference, profile_learn, calendar_create_event,
    calendar_sync_scheduler
}
```

**EXPENSIVE_TOOLS** (core/agent/safety_constants.py — cost gate)
```python
{
    analyze_ip: 0.15,       # claude-opus-4-6 + gpt-5.4, ~8 LLM calls
    compare_ips: 0.20,
    batch_analyze: 0.50,
    generate_report: 0.20,
    rate_result: 0.15,
}
```

**DANGEROUS_TOOLS** (core/agent/safety_constants.py — always requires approval)
```python
{run_bash}
```

**AUTO_APPROVED_MCP_SERVERS** (core/agent/safety_constants.py — no first-call gate)
```python
{reddit, google-trends, youtube, steam, slack}
```

---

## 3. TOOL REGISTRY & LOOKUP

### 3.1 ToolRegistry Lifecycle

**Location**: `/Users/mango/workspace/geode/core/tools/registry.py`

```python
class ToolRegistry:
    def __init__(self) -> None:
        self._tools: dict[str, Tool] = {}

    def register(self, tool: Tool) -> None:
        """Register a tool by name."""
        if tool.name in self._tools:
            raise ValueError(f"Tool '{tool.name}' already registered")
        self._tools[tool.name] = tool

    def execute(self, name: str, *, policy: PolicyChain | None = None,
                mode: str = "full_pipeline", **kwargs: Any) -> dict[str, Any]:
        """Execute tool with optional policy check."""
        tool = self._tools.get(name)
        if tool is None:
            raise KeyError(f"Tool '{name}' not found")
        if policy is not None and not policy.is_allowed(name, mode=mode):
            raise PermissionError(f"Tool '{name}' blocked by policy")
        return tool.execute(**kwargs)

    def to_anthropic_tools(self, *, policy: PolicyChain | None = None,
                          mode: str = "full_pipeline") -> list[dict[str, Any]]:
        """Convert to Anthropic API tool_use format."""
        allowed_names = self.list_tools(policy=policy, mode=mode)
        return [
            {
                "name": tool.name,
                "description": tool.description,
                "input_schema": tool.parameters,
            }
            for tool in self._tools.values()
            if tool.name in allowed_names
        ]
```

### 3.2 Deferred Loading (to_anthropic_tools_with_defer)

**Purpose**: Reduce context tokens by ~85% when tool count > defer_threshold (default 10)

**Mechanism**:
```python
def to_anthropic_tools_with_defer(
    self, *,
    policy: PolicyChain | None = None,
    mode: str = "full_pipeline",
    defer_threshold: int = 10,
    mcp_tools: list[dict[str, Any]] | None = None,
) -> list[dict[str, Any]]:
    """Return tool definitions with optional deferred loading."""
    
    native_tools = self.to_anthropic_tools(policy=policy, mode=mode)
    
    # Merge MCP tools (dedup by name)
    all_tools = list(native_tools)
    if mcp_tools:
        all_tools.extend([t for t in mcp_tools if t["name"] not in {...}])
    
    if len(all_tools) <= defer_threshold:
        return all_tools  # All tools inline
    
    # DEFERRED MODE: separate core tools from rest
    always_loaded = [t for t in all_tools 
                     if t["name"] in ALWAYS_LOADED_TOOLS]
    deferred = [t | {"defer_loading": True}
                for t in all_tools
                if t["name"] not in ALWAYS_LOADED_TOOLS]
    
    # Insert ToolSearchTool meta-tool
    tool_search = {
        "name": "tool_search",
        "description": f"Search tools. Categories: {category_str}",
        "input_schema": {
            "type": "object",
            "properties": {"query": {"type": "string"}},
            "required": ["query"],
        },
    }
    
    return [tool_search, *always_loaded, *deferred]
```

**ALWAYS_LOADED_TOOLS** (core tools never deferred):
```python
frozenset({
    "list_ips",        # discovery
    "search_ips",      # discovery
    "analyze_ip",      # analysis (expensive but essential)
    "memory_search",   # memory
    "show_help",       # discovery
    "general_web_search",  # external
})
```

**2-Hop Retrieval Pattern** (with tool_search deferred loading):
1. **Hop 1**: LLM calls `tool_search(query="image analysis tools")`
   - Returns: `{"matched": True, "tools": [...]}`
2. **Hop 2**: LLM calls discovered tool (e.g., `batch_analyze(...)`)
   - Tool is now in context (Anthropic cached schema)

---

## 4. HITL APPROVAL GATES

### 4.1 HITL Flow (ToolExecutor._apply_safety_gates)

```
ToolExecutor.execute(tool_name, tool_input)
    │
    ├─ Is tool_name in DANGEROUS_TOOLS?
    │   YES → _execute_dangerous() [ALWAYS requires approval]
    │         └─ _execute_bash() [run_bash only]
    │            ├─ BashTool.validate(command) [blocked patterns]
    │            ├─ if safe read-only (ls, cat, etc) → skip HITL
    │            ├─ else → _request_approval() [Y/n/A]
    │            │   ├─ hitl_level 0 (autonomous) → skip
    │            │   ├─ hitl_level 1 (write-only) → skip for bash
    │            │   ├─ hitl_level 2 (full) → prompt user
    │            │   └─ A (always) → add "bash" to _always_approved_categories
    │            └─ BashTool.execute() [with resource limits]
    │
    ├─ Is tool_name in WRITE_TOOLS?
    │   YES → _confirm_write(tool_name, tool_input) [HITL approval]
    │         ├─ Print: [warning]Write operation requires approval[/warning]
    │         ├─ hitl_level check (0 skip, 2 prompt)
    │         ├─ "write" in _always_approved_categories?
    │         ├─ _prompt_with_always() → [Y/n/A]
    │         └─ A → add "write" to _always_approved_categories
    │         └─ Return: True/False (allowed/denied)
    │
    ├─ Is tool_name in EXPENSIVE_TOOLS?
    │   YES → _confirm_cost() [cost gate + HITL]
    │         ├─ Show: estimated_cost, pipeline model, timestamp
    │         ├─ hitl_level check (0/1 skip, 2 prompt)
    │         ├─ "cost" in _always_approved_categories?
    │         ├─ _prompt_with_always() → [Proceed? Y/n/A]
    │         └─ Return: True/False
    │
    └─ Dispatch based on tool_name
        ├─ If "run_bash" → _execute_bash() [done above]
        ├─ If handler registered → execute handler (SYNC)
        │   └─ Wrapped in spinner (_tool_spinner) if approved via HITL
        ├─ Else if MCP server found → _execute_mcp()
        │   └─ MCP approval per-server (once per session)
        └─ Else → error: Unknown tool
```

### 4.2 HITL Level Constants

| **Level** | **Name** | **Behavior** |
|-----------|----------|-------------|
| **0** | Autonomous | All approvals skipped (for batch automation) |
| **1** | Write-only | Write tools require approval; bash/cost skipped |
| **2** | Full (default) | All safety gates active (interactive CLI) |

### 4.3 Session-Level "Always" Approval

```python
# In ToolExecutor.__init__:
self._always_approved_categories: set[str] = set()

# When user types "A" (Always):
response = self._prompt_with_always(label, detail)
if response == "a":
    self._always_approved_categories.add("bash")      # or "write", "cost"
    # All subsequent bash/write/cost tools skip HITL for this session
```

---

## 5. NATIVE TOOL EXECUTION PATH

### 5.1 Handler Registration & Dispatch

**Location**: `core/agent/tool_executor.py:157`

```python
class ToolExecutor:
    def __init__(self, *, action_handlers: dict[str, Callable] | None = None, ...):
        self._handlers: dict[str, Callable[..., dict[str, Any]]] = action_handlers or {}
    
    def register(self, tool_name: str, handler: Callable) -> None:
        self._handlers[tool_name] = handler

    def execute(self, tool_name: str, tool_input: dict[str, Any]) -> dict[str, Any]:
        # ... HITL gates ...
        
        handler = self._handlers.get(tool_name)
        if handler is None:
            # Fall back to MCP
            if self._mcp_manager is not None:
                server = self._mcp_manager.find_server_for_tool(tool_name)
                if server is not None:
                    return self._execute_mcp(server, tool_name, tool_input)
            return {"error": f"Unknown tool: '{tool_name}'"}
        
        try:
            if approved_via_hitl:
                with _tool_spinner(f"Executing {tool_name}..."):
                    raw = handler(**tool_input)
            else:
                raw = handler(**tool_input)
            
            if raw is None:
                return {"error": f"Tool '{tool_name}' returned None"}
            if not isinstance(raw, dict):
                return {"result": raw}
            return raw
        except Exception as exc:
            return {"error": str(exc)}
```

**Handler Pattern**:
```python
def handle_memory_search(**kwargs) -> dict[str, Any]:
    query = kwargs.get("query", "")
    if not query:
        return {"error": "query required"}
    # ... implementation ...
    return {"results": [...]}

executor.register("memory_search", handle_memory_search)
```

---

## 6. MCP TOOL EXECUTION PATH

### 6.1 MCP Server Manager

**Location**: `/Users/mango/workspace/geode/core/mcp/manager.py`

```python
class MCPServerManager:
    def __init__(self, config_path: Path | None = None):
        self._servers: dict[str, dict[str, Any]] = {}      # server configs
        self._clients: dict[str, StdioMCPClient] = {}       # active clients
    
    def startup(self, *, on_progress=None) -> int:
        """Load config + connect all servers in parallel."""
        if not self._servers:
            self.load_config()  # Priority: toml + json fallback
        connected = self._connect_all(on_progress=on_progress)
        self._install_signal_handlers()  # SIGTERM cleanup
        return connected
    
    def shutdown(self) -> None:
        """Graceful close all servers."""
        self.close_all()
        self._uninstall_signal_handlers()
    
    def load_config(self) -> int:
        """Load MCP config from 3 sources (priority order):
        
        1. ~/.geode/config.toml [mcp.servers]     (global user)
        2. {workspace}/.geode/config.toml         (project override)
        3. .claude/mcp_servers.json                (legacy fallback)
        """
        # Load from TOML first (highest priority)
        for config_toml in [GLOBAL_CONFIG_TOML, PROJECT_CONFIG_TOML]:
            if config_toml.exists():
                with open(config_toml, "rb") as f:
                    toml_data = tomllib.load(f)
                    mcp_section = toml_data.get("mcp", {}).get("servers", {})
                    for name, cfg in mcp_section.items():
                        self._servers[name] = {
                            "command": cfg["command"],
                            "args": cfg.get("args", []),
                            "env": cfg.get("env", {}),
                        }
        
        # Fallback to JSON (entries not already in _servers)
        if self._config_path.exists():
            file_servers = json.loads(self._config_path.read_text())
            for name, cfg in file_servers.items():
                if name not in self._servers:
                    self._servers[name] = cfg
        
        return len(self._servers)
    
    def call_tool(self, server: str, tool_name: str,
                  tool_input: dict[str, Any]) -> dict[str, Any]:
        """Call a tool on a specific MCP server."""
        client = self._get_client(server)
        if client is None or not client.is_connected():
            return {"error": f"Server '{server}' not connected"}
        
        result = client.call_tool(tool_name, tool_input)
        # Normalize camelCase inputSchema → snake_case
        return _normalise_mcp_tool(result)
    
    def find_server_for_tool(self, tool_name: str) -> str | None:
        """Return server name that provides tool_name."""
        for server, client in self._clients.items():
            if client.has_tool(tool_name):
                return server
        return None
```

### 6.2 MCP Dispatch in ToolExecutor

**Location**: `core/agent/tool_executor.py:400`

```python
def _execute_mcp(self, server: str, tool_name: str,
                 tool_input: dict[str, Any]) -> dict[str, Any]:
    """Execute MCP tool with per-server approval gate."""
    
    # Per-server approval cache (once per session)
    if server in AUTO_APPROVED_MCP_SERVERS:
        self._mcp_approved_servers.add(server)
    
    mcp_category = f"mcp:{server}"
    if mcp_category in self._always_approved_categories:
        self._mcp_approved_servers.add(server)
    
    if self._hitl_level <= 1:  # Autonomous/write-only
        self._mcp_approved_servers.add(server)
    
    # First call to this server → require approval
    if not self._auto_approve and server not in self._mcp_approved_servers:
        if not self._confirm_mcp(server, tool_name):
            return {"error": "User denied MCP tool execution", "denied": True}
        self._mcp_approved_servers.add(server)
    
    # Execute with spinner
    with _tool_spinner(f"Calling {server}/{tool_name}..."):
        result = self._mcp_manager.call_tool(server, tool_name, tool_input)
    
    # Redact secrets from result
    for key in ("stdout", "stderr", "output", "content", "text", "result"):
        if key in result and isinstance(result[key], str):
            result[key] = redact_secrets(result[key])
    
    return result
```

---

## 7. BASH TOOL — 3-LAYER SAFETY

### 7.1 BashTool Architecture

**Location**: `/Users/mango/workspace/geode/core/cli/bash_tool.py`

```python
class BashTool:
    """Shell execution with blocked patterns + HITL + resource limits."""
    
    def __init__(self, *, working_dir: str | None = None):
        self._working_dir = working_dir
    
    def validate(self, command: str) -> BashResult | None:
        """LAYER 1: Check blocked patterns (always blocked).
        
        Blocked patterns (regex):
            - rm -rf /        (root deletion)
            - sudo            (privilege escalation)
            - > /etc/         (system config modification)
            - curl|wget | sh  (remote code execution)
            - mkfs.           (filesystem wipe)
            - dd if=...of=/dev/ (device modification)
            - chmod -R 777 /  (permission escalation)
            - fork bomb (:|(){...|..&;})
        """
        for pattern in _BLOCKED_PATTERNS:
            if pattern.search(command):
                return BashResult(
                    blocked=True,
                    error=f"Blocked: matches dangerous pattern",
                    command=command,
                )
        return None
    
    def execute(self, command: str, *, timeout: int = 30) -> BashResult:
        """LAYER 2: Execute with resource limits.
        
        Resource limits (preexec_fn):
            - RLIMIT_CPU: 30s (hard cap)
            - RLIMIT_FSIZE: 50 MB (output file size)
            - RLIMIT_NPROC: 64 (child processes)
        
        Output limits:
            - stdout: 10,000 chars max
            - stderr: 5,000 chars max
        """
        blocked = self.validate(command)
        if blocked:
            return blocked
        
        try:
            result = subprocess.run(
                command,
                shell=True,
                capture_output=True,
                text=True,
                timeout=timeout,
                cwd=self._working_dir,
                preexec_fn=_set_resource_limits if os.name != "nt" else None,
            )
            return BashResult(
                stdout=result.stdout[:10_000],
                stderr=result.stderr[:5_000],
                returncode=result.returncode,
                command=command,
            )
        except subprocess.TimeoutExpired:
            return BashResult(error=f"Timeout after {timeout}s", returncode=-1)
        except OSError as exc:
            return BashResult(error=str(exc), returncode=-1)
    
    def to_tool_result(self, result: BashResult) -> dict[str, Any]:
        """LAYER 3: Redact secrets before returning to LLM.
        
        Uses core.cli.redaction.redact_secrets() to mask:
            - API keys
            - OAuth tokens
            - Database passwords
        """
        if result.blocked:
            return {"error": result.error, "blocked": True}
        if result.denied:
            return {"error": "User denied execution", "denied": True}
        if result.error:
            return {"error": redact_secrets(result.error), "returncode": result.returncode}
        
        out = {"returncode": result.returncode}
        if result.stdout:
            out["stdout"] = redact_secrets(result.stdout)
        if result.stderr:
            out["stderr"] = redact_secrets(result.stderr)
        return out
```

### 7.2 SAFE_BASH_PREFIXES (Skip HITL for read-only commands)

```python
SAFE_BASH_PREFIXES = [
    "ls ", "ls\t", "ls\n",
    "cat ", "head ", "tail ",
    "pwd",
    "find ", "locate ",
    "grep ", "rg ",
    "git status", "git log", "git diff", "git branch",
    "ps ", "top ",
    "date",
    "which ",
]
```

---

## 8. POLICY CHAIN — 6-LAYER TOOL ACCESS CONTROL

### 8.1 PolicyChain Architecture

**Location**: `/Users/mango/workspace/geode/core/tools/policy.py`

```python
class PolicyChain:
    """Chain of policies applied in priority order.
    
    Layers (priority: lower number = higher priority):
      1. Organization (priority=5)     — org-level restrictions
      2. Profile (priority=10)         — user preferences
      3. Mode-based (priority=100)     — pipeline mode (dry_run, etc)
      4. Agent-level (not in PolicyChain, handled in ToolExecutor)
      5. Node-scope (not in PolicyChain, in NodeScopePolicy)
      6. Sub-agent (not in PolicyChain, handled in SubAgentManager)
    """
    
    def __init__(self):
        self._policies: list[ToolPolicy] = []
    
    def add_policy(self, policy: ToolPolicy) -> None:
        self._policies.append(policy)
        self._policies.sort(key=lambda p: p.priority)  # Lower = higher priority
    
    def filter_tools(self, tool_names: list[str], *,
                     mode: str = "full_pipeline") -> list[str]:
        """Filter tool names through all applicable policies.
        
        A tool is allowed only if it passes EVERY matching policy.
        """
        applicable = [p for p in self._policies if p.mode in (mode, "*")]
        
        result = []
        for name in tool_names:
            if all(p.is_allowed(name) for p in applicable):
                result.append(name)
        return result
    
    def is_allowed(self, tool_name: str, *, mode: str = "full_pipeline") -> bool:
        applicable = [p for p in self._policies if p.mode in (mode, "*")]
        return all(p.is_allowed(tool_name) for p in applicable)
    
    def audit_check(self, tool_name: str, *, mode: str = "full_pipeline",
                   user: str = "") -> PolicyAuditResult:
        """Detailed audit trail of which policies allowed/blocked."""
        applicable = [p for p in self._policies if p.mode in (mode, "*")]
        evaluations = []
        allowed = True
        
        for p in applicable:
            result = p.is_allowed(tool_name)
            evaluations.append({
                "policy": p.name,
                "mode": p.mode,
                "priority": p.priority,
                "allowed": result,
            })
            if not result:
                allowed = False
        
        return PolicyAuditResult(
            tool_name=tool_name,
            mode=mode,
            allowed=allowed,
            evaluations=evaluations,
            user=user,
        )
```

### 8.2 Policy Builder (6-Layer Construction)

```python
def build_6layer_chain(
    *,
    profile: ProfilePolicy | None = None,
    org: OrgPolicy | None = None,
    mode_policies: list[ToolPolicy] | None = None,
) -> PolicyChain:
    """Build complete 6-layer chain.
    
    Execution order (priority):
      Layer 2: Org (priority=5, highest)
      Layer 1: Profile (priority=10)
      Layer 3: Mode (priority=100, default)
      Layers 4-6: Handled in ToolExecutor/NodeScopePolicy/SubAgentManager
    """
    chain = PolicyChain()
    
    if org:
        for p in org.to_policies():
            chain.add_policy(p)
    
    if profile:
        for p in profile.to_policies():
            chain.add_policy(p)
    
    if mode_policies:
        for p in mode_policies:
            chain.add_policy(p)
    
    return chain
```

### 8.3 Node-Scope Policy (Layer 5)

```python
# Default per-node tool allowlists (Layer 5)
NODE_TOOL_ALLOWLISTS: dict[str, list[str]] = {
    "analyst": ["memory_search", "memory_get", "query_monolake"],
    "evaluator": ["memory_search", "memory_get", "steam_info", "reddit_sentiment"],
    "scoring": ["memory_search", "psm_calculate"],
    "synthesizer": ["memory_search", "memory_get", "explain_score"],
    "verification": ["memory_search", "memory_get"],
}

class NodeScopePolicy:
    """Filter available tools based on executing node."""
    
    def filter(self, tool_names: list[str], *, node: str | None = None) -> list[str]:
        """Return only tools allowed for *node*."""
        if node is None:
            return tool_names
        
        allowlist = self._allowlists.get(node)
        if allowlist is None:
            # Try prefix match (e.g., "analyst_*" → "analyst")
            for prefix, allowed in self._allowlists.items():
                if node.startswith(prefix):
                    allowlist = allowed
                    break
        
        if allowlist is None:
            return tool_names  # Unrestricted
        
        filtered = [t for t in tool_names if t in allowlist]
        return filtered
```

---

## 9. ERROR RECOVERY — 4-STAGE STRATEGY CHAIN

### 9.1 ErrorRecoveryStrategy Lifecycle

**Location**: `/Users/mango/workspace/geode/core/agent/error_recovery.py`

```python
class ErrorRecoveryStrategy:
    """Adaptive error recovery with 4-stage chain.
    
    Triggered when: tool_name fails MAX_CONSECUTIVE_FAILURES (2) times.
    
    Stages (in order):
        1. RETRY         — retry same tool with 1s delay
        2. ALTERNATIVE   — try different tool in same category
        3. FALLBACK      — try cheaper tool (lower cost_tier)
        4. ESCALATE      — escalate to user (always returns failure)
    """
    
    def __init__(self, executor: ToolExecutor, *,
                 max_recovery_attempts: int = 3,
                 retry_base_delay: float = 1.0):
        self._executor = executor
        self._max_recovery_attempts = max_recovery_attempts
        self._retry_base_delay = retry_base_delay
        self._tool_defs = _load_tool_definitions()
        self._category_map = _build_category_map(self._tool_defs)
        self._cost_tier_map = _build_cost_tier_map(self._tool_defs)
    
    def recover(self, tool_name: str, tool_input: dict[str, Any],
                failure_count: int) -> RecoveryResult:
        """Execute adaptive recovery chain for a failed tool.
        
        Args:
            tool_name: The tool that failed
            tool_input: Original parameters
            failure_count: How many consecutive failures (2+)
        
        Returns:
            RecoveryResult with success/failure + attempts log
        """
        # Check if tool is recoverable
        if not self.is_recoverable(tool_name):
            return RecoveryResult(
                recovered=False,
                final_result={
                    "error": f"Tool '{tool_name}' not eligible for recovery (safety-gated)",
                    "recovery_skipped": True,
                },
            )
        
        # Select recovery strategies
        attempts = []
        strategies = self._select_strategies(tool_name, failure_count)
        
        for strategy in strategies:
            if len(attempts) >= self._max_recovery_attempts:
                break
            
            attempt = self._execute_strategy(strategy, tool_name, tool_input)
            attempts.append(attempt)
            
            if attempt.success:
                return RecoveryResult(
                    recovered=True,
                    final_result=attempt.result,
                    attempts=attempts,
                    strategy_used=strategy,
                )
        
        # All strategies exhausted
        return RecoveryResult(
            recovered=False,
            final_result={
                "error": f"Recovery exhausted after {len(attempts)} attempt(s)",
                "recovery_exhausted": True,
                "strategies_tried": [a.strategy.value for a in attempts],
            },
            attempts=attempts,
        )
    
    def is_recoverable(self, tool_name: str) -> bool:
        """Check if tool can be auto-recovered.
        
        Excluded tools (safety preservation):
            - run_bash (DANGEROUS)
            - memory_save (WRITE)
            - note_save (WRITE)
            - set_api_key (WRITE)
            - manage_auth (WRITE)
        """
        return tool_name not in _EXCLUDED_TOOLS
```

### 9.2 Recovery Stages

**Stage 1: RETRY**
```python
def _try_retry(self, tool_name: str, tool_input: dict[str, Any],
               start: float) -> RecoveryAttempt:
    """Retry the same tool once with brief delay."""
    delay = self._retry_base_delay  # 1.0 second
    log.info("Recovery[retry]: retrying '%s' after %.1fs", tool_name, delay)
    time.sleep(delay)
    
    result = self._executor.execute(tool_name, tool_input)
    elapsed = (time.monotonic() - start) * 1000
    success = not (isinstance(result, dict) and result.get("error"))
    
    return RecoveryAttempt(
        strategy=RecoveryStrategy.RETRY,
        tool_name=tool_name,
        success=success,
        result=result,
        duration_ms=elapsed,
    )
```

**Stage 2: ALTERNATIVE (same category)**
```python
def _try_alternative(self, tool_name: str, tool_input: dict[str, Any],
                     start: float) -> RecoveryAttempt:
    """Try a different tool from the same category."""
    alt_name = self._find_alternative(tool_name)
    if alt_name is None:
        return RecoveryAttempt(
            strategy=RecoveryStrategy.ALTERNATIVE,
            tool_name=tool_name,
            success=False,
            result={"error": f"No alternative for '{tool_name}'"},
            duration_ms=(time.monotonic() - start) * 1000,
        )
    
    log.info("Recovery[alternative]: trying '%s' instead of '%s'",
             alt_name, tool_name)
    
    result = self._executor.execute(alt_name, tool_input)
    elapsed = (time.monotonic() - start) * 1000
    success = not (isinstance(result, dict) and result.get("error"))
    
    return RecoveryAttempt(
        strategy=RecoveryStrategy.ALTERNATIVE,
        tool_name=alt_name,
        success=success,
        result=result,
        duration_ms=elapsed,
    )
```

**Stage 3: FALLBACK (cheaper cost tier)**
```python
def _try_fallback(self, tool_name: str, tool_input: dict[str, Any],
                  start: float) -> RecoveryAttempt:
    """Try a cheaper tool from any category.
    
    Cost tier ordering: free → cheap → expensive
    """
    fallback_name = self._find_fallback(tool_name)
    if fallback_name is None:
        return RecoveryAttempt(
            strategy=RecoveryStrategy.FALLBACK,
            tool_name=tool_name,
            success=False,
            result={"error": f"No cheaper fallback for '{tool_name}'"},
            duration_ms=(time.monotonic() - start) * 1000,
        )
    
    log.info("Recovery[fallback]: trying cheaper '%s' instead of '%s'",
             fallback_name, tool_name)
    
    result = self._executor.execute(fallback_name, tool_input)
    elapsed = (time.monotonic() - start) * 1000
    success = not (isinstance(result, dict) and result.get("error"))
    
    return RecoveryAttempt(
        strategy=RecoveryStrategy.FALLBACK,
        tool_name=fallback_name,
        success=success,
        result=result,
        duration_ms=elapsed,
    )
```

**Stage 4: ESCALATE (to user, always fails)**
```python
def _try_escalate(self, tool_name: str, _tool_input: dict[str, Any],
                  start: float) -> RecoveryAttempt:
    """Escalate to user — always returns failure to signal HITL needed."""
    log.info("Recovery[escalate]: escalating '%s' to user", tool_name)
    
    return RecoveryAttempt(
        strategy=RecoveryStrategy.ESCALATE,
        tool_name=tool_name,
        success=False,
        result={
            "error": f"Tool '{tool_name}' requires manual intervention",
            "escalated": True,
        },
        duration_ms=(time.monotonic() - start) * 1000,
    )
```

### 9.3 Strategy Selection Logic

```python
def _select_strategies(self, tool_name: str,
                       failure_count: int) -> list[RecoveryStrategy]:
    """Determine which strategies to try based on failure context.
    
    First failure:  try RETRY only
    Second+ failure: try RETRY → ALTERNATIVE → FALLBACK → ESCALATE
    """
    strategies: list[RecoveryStrategy] = [RecoveryStrategy.RETRY]
    
    if failure_count >= 2:
        if self._has_alternatives(tool_name):
            strategies.append(RecoveryStrategy.ALTERNATIVE)
        if self._has_fallback(tool_name):
            strategies.append(RecoveryStrategy.FALLBACK)
        strategies.append(RecoveryStrategy.ESCALATE)
    
    return strategies
```

---

## 10. PARALLEL EXECUTION ARCHITECTURE

### 10.1 ToolCallProcessor._execute_parallel (5-tier system)

**Location**: `core/agent/tool_executor.py:961`

```python
async def _execute_parallel(self, tool_blocks: list[Any]) -> list[dict[str, Any]]:
    """Execute 2+ tool blocks with tiered batch approval.
    
    Tier 0 (SAFE):           auto-execute immediately
    Tier 1 (MCP auto-approved): auto-execute immediately
    Tier 2 (EXPENSIVE):      batch cost gate → parallel
    Tier 3 (WRITE):          individual approval → sequential
    Tier 4 (DANGEROUS):      individual approval → sequential
    """
    
    # Step 1: Classify blocks into tiers
    tiered: dict[int, list[tuple[int, Any]]] = {0: [], 1: [], 2: [], 3: [], 4: []}
    for idx, block in enumerate(tool_blocks):
        tier = self._classify_tier(block.name, self._mcp_manager)
        tiered[tier].append((idx, block))
    
    # Pre-allocate result slots (maintain order)
    results: list[dict[str, Any] | None] = [None] * len(tool_blocks)
    
    # Step 2: Batch cost approval for TIER 2 (EXPENSIVE)
    tier2_approved = True
    if tiered[2]:
        tier2_approved = await self._batch_cost_approval([b for _, b in tiered[2]])
    
    # Step 3: Build parallel pool (TIER 0 + 1 + approved TIER 2)
    parallel_items: list[tuple[int, Any]] = []
    parallel_items.extend(tiered[0])
    parallel_items.extend(tiered[1])
    
    if tier2_approved:
        parallel_items.extend(tiered[2])
        # Set auto_approve flag temporarily for this batch
    else:
        for idx, block in tiered[2]:
            results[idx] = self._make_denial_result(block, "User denied batch cost approval")
    
    # Step 4: Execute parallel pool with asyncio.gather
    if parallel_items:
        gathered = await asyncio.gather(
            *[self._safe_execute_single(block) for _, block in parallel_items]
        )
        
        for (idx, _block), result in zip(parallel_items, gathered):
            results[idx] = result
    
    # Step 5: Execute TIER 3-4 (WRITE/DANGEROUS) sequentially
    sequential_items = list(tiered[3]) + list(tiered[4])
    for idx, block in sequential_items:
        results[idx] = await self._execute_single(block)
    
    return [r for r in results if r is not None]
```

---

## 11. DESIGN TRADE-OFFS & DECISIONS

### 11.1 Why Direct LLM tool_use Instead of NL Router?

**Decision**: Use `response.content[].type == "tool_use"` directly (no NL router)

**Rationale**:
- **Simplicity**: Anthropic API native tool_use is explicit and deterministic
- **Latency**: Zero routing hop (no intermediate LLM call to classify intent)
- **Reliability**: Tool names come directly from LLM JSON, no parsing/inference
- **Context**: Saves prompt tokens (no router instruction)

**Trade-off**: 
- LLM may call wrong tool occasionally → handled by error recovery chain
- No intent classification layer (e.g., detecting harmful intent early)

**Removed (v0.26.0+)**: NL Router experiment removed. See CHANGELOG.md.

### 11.2 Why Unified Tool List Instead of Separate Namespaces?

**Decision**: Single flat tool namespace (no "native:memory_search" vs "mcp:slack_post")

**Rationale**:
- **LLM UX**: Simpler descriptions, fewer mental models
- **Discovery**: ToolSearchTool searches both native + MCP uniformly
- **Execution**: dispatch router checks registry first, then MCP fallback
- **Backward compat**: No namespace-aware tool calling code needed

**Trade-off**:
- Name collisions possible (mitigated by dedup in to_anthropic_tools_with_defer)
- Can't easily distinguish tool sources in LLM response

### 11.3 Why Deferred Loading Instead of Always Loading?

**Decision**: Default deferred_threshold=10 (defer all but 6 core + tool_search)

**Rationale**:
- **Context savings**: ~85% reduction (~4000 → 600 tokens for 52 tools)
- **2-hop retrieval**: LLM calls tool_search first, then discovered tool
- **Smart loading**: ALWAYS_LOADED_TOOLS (analyze_ip, memory_search) always present

**Trade-off**:
- Extra hop (tool_search call) adds latency
- tool_search must be updated when new tools added
- Older LLMs may struggle with "find tool then call it" pattern

**When deferred_threshold = 0**: Disables deferral entirely.

### 11.4 Why 3 Dispatch Routes Instead of Single Executor?

**Routes**:
1. **ToolExecutor.execute() → registry handler** (native tools)
2. **ToolExecutor._execute_mcp()** (MCP server tools)
3. **ToolExecutor._execute_bash()** (shell with HITL + blocked patterns)

**Rationale**:
- **Safety separation**: bash has unique resource limits + blocked patterns
- **MCP isolation**: external servers managed separately (lifecycle, approval)
- **Native optimization**: registry handlers directly callable (no RPC overhead)

**Trade-off**:
- 3 code paths to maintain (mitigated by unified HITL gate in _apply_safety_gates)
- Routing logic can become complex (found by looking up registry, then MCP, then error)

---

## 12. KEY CLASSES & METHOD SIGNATURES

### 12.1 ToolCallProcessor (async orchestrator)

```python
# File: core/agent/tool_executor.py:756
class ToolCallProcessor:
    async def process(self, response: Any) -> list[dict[str, Any]]:
        """Parse tool_use blocks, dispatch sequentially/parallel."""
    
    async def _execute_single(self, block: Any) -> dict[str, Any]:
        """Execute single tool with failure tracking + recovery."""
    
    async def _execute_parallel(self, tool_blocks: list[Any]) -> list[dict[str, Any]]:
        """5-tier parallel dispatch (safety-based batching)."""
    
    @staticmethod
    def _classify_tier(tool_name: str, mcp_manager: Any | None = None) -> int:
        """Return 0-4 based on safety level."""
    
    async def _batch_cost_approval(self, blocks: list[Any]) -> bool:
        """Single prompt for all EXPENSIVE tools."""
    
    async def _attempt_recovery(
        self, tool_name: str, tool_input: dict[str, Any], fail_count: int
    ) -> dict[str, Any]:
        """Run ErrorRecoveryStrategy chain."""
```

### 12.2 ToolExecutor (sync dispatcher)

```python
# File: core/agent/tool_executor.py:82
class ToolExecutor:
    def __init__(self, *, action_handlers: dict[str, Callable] | None = None,
                 bash_tool: BashTool | None = None, hitl_level: int = 2, ...):
        """Initialize with handlers, bash tool, and approval settings."""
    
    def execute(self, tool_name: str, tool_input: dict[str, Any]) -> dict[str, Any]:
        """Route tool call through safety gates + dispatch."""
    
    def _apply_safety_gates(
        self, tool_name: str, tool_input: dict[str, Any]
    ) -> tuple[dict[str, Any] | None, bool]:
        """Return (rejection_result, approved_via_hitl)."""
    
    def _execute_bash(self, tool_input: dict[str, Any]) -> dict[str, Any]:
        """Shell execution (3-layer safety)."""
    
    def _execute_mcp(self, server: str, tool_name: str,
                     tool_input: dict[str, Any]) -> dict[str, Any]:
        """Call external MCP server tool."""
    
    def _confirm_write(self, tool_name: str, tool_input: dict[str, Any]) -> bool:
        """HITL write approval [Y/n/A]."""
    
    def _confirm_cost(self, tool_name: str, estimated_cost: float) -> bool:
        """HITL cost confirmation [Y/n/A]."""
    
    def _request_approval(self, command: str, reason: str) -> bool:
        """HITL bash approval [Y/n/A]."""
```

### 12.3 ToolRegistry (tool management)

```python
# File: core/tools/registry.py:143
class ToolRegistry:
    def register(self, tool: Tool) -> None:
        """Register tool by name."""
    
    def execute(
        self, name: str, *,
        policy: PolicyChain | None = None,
        mode: str = "full_pipeline",
        **kwargs: Any
    ) -> dict[str, Any]:
        """Execute tool with policy check."""
    
    def to_anthropic_tools(
        self, *,
        policy: PolicyChain | None = None,
        mode: str = "full_pipeline"
    ) -> list[dict[str, Any]]:
        """Convert to Anthropic API tool_use format."""
    
    def to_anthropic_tools_with_defer(
        self, *,
        policy: PolicyChain | None = None,
        mode: str = "full_pipeline",
        defer_threshold: int = 10,
        mcp_tools: list[dict[str, Any]] | None = None
    ) -> list[dict[str, Any]]:
        """Return tools with optional deferred loading."""
```

### 12.4 PolicyChain (6-layer access control)

```python
# File: core/tools/policy.py:64
class PolicyChain:
    def add_policy(self, policy: ToolPolicy) -> None:
        """Add policy (sorted by priority)."""
    
    def filter_tools(
        self, tool_names: list[str], *, mode: str = "full_pipeline"
    ) -> list[str]:
        """Filter tools through all applicable policies."""
    
    def is_allowed(
        self, tool_name: str, *, mode: str = "full_pipeline"
    ) -> bool:
        """Check if single tool allowed."""
    
    def audit_check(
        self, tool_name: str, *, mode: str = "full_pipeline", user: str = ""
    ) -> PolicyAuditResult:
        """Return full audit trail."""

def build_6layer_chain(
    *, profile: ProfilePolicy | None = None,
    org: OrgPolicy | None = None,
    mode_policies: list[ToolPolicy] | None = None
) -> PolicyChain:
    """Build complete 6-layer policy chain."""
```

### 12.5 BashTool (shell execution)

```python
# File: core/cli/bash_tool.py:79
class BashTool:
    def validate(self, command: str) -> BashResult | None:
        """LAYER 1: Check blocked patterns."""
    
    def execute(self, command: str, *, timeout: int = 30) -> BashResult:
        """LAYER 2: Execute with resource limits."""
    
    def to_tool_result(self, result: BashResult) -> dict[str, Any]:
        """LAYER 3: Redact secrets."""
```

### 12.6 MCPServerManager (MCP lifecycle)

```python
# File: core/mcp/manager.py:87
class MCPServerManager:
    def startup(
        self, *, on_progress: Callable[[int, int, str], None] | None = None
    ) -> int:
        """Load config + connect all servers in parallel."""
    
    def shutdown(self) -> None:
        """Graceful close all servers."""
    
    def load_config(self) -> int:
        """Load from config.toml (global + project) + json fallback."""
    
    def call_tool(self, server: str, tool_name: str,
                  tool_input: dict[str, Any]) -> dict[str, Any]:
        """Call tool on specific server."""
    
    def find_server_for_tool(self, tool_name: str) -> str | None:
        """Return server that provides tool."""
```

### 12.7 ErrorRecoveryStrategy (4-stage recovery)

```python
# File: core/agent/error_recovery.py:126
class ErrorRecoveryStrategy:
    def is_recoverable(self, tool_name: str) -> bool:
        """Check if tool eligible for auto-recovery."""
    
    def recover(
        self, tool_name: str, tool_input: dict[str, Any], failure_count: int
    ) -> RecoveryResult:
        """Run recovery chain (retry → alt → fallback → escalate)."""
    
    def _select_strategies(
        self, tool_name: str, failure_count: int
    ) -> list[RecoveryStrategy]:
        """Determine strategies based on failure count."""
    
    def _execute_strategy(
        self, strategy: RecoveryStrategy,
        tool_name: str, tool_input: dict[str, Any]
    ) -> RecoveryAttempt:
        """Run single recovery strategy."""
    
    def _try_retry(self, tool_name: str, ...) -> RecoveryAttempt:
        """Stage 1: Retry with 1s delay."""
    
    def _try_alternative(self, tool_name: str, ...) -> RecoveryAttempt:
        """Stage 2: Alternative in same category."""
    
    def _try_fallback(self, tool_name: str, ...) -> RecoveryAttempt:
        """Stage 3: Cheaper cost tier."""
    
    def _try_escalate(self, tool_name: str, ...) -> RecoveryAttempt:
        """Stage 4: Escalate to user (always fails)."""
```

---

## 13. INTEGRATION POINTS

### 13.1 How ToolCallProcessor Integrates with AgenticLoop

```
AgenticLoop.run_agentic_turn()
    │
    ├─ call LLM with available tools
    │  └─ ToolRegistry.to_anthropic_tools_with_defer(policy=chain, mode=mode)
    │
    ├─ LLM returns response with tool_use blocks
    │
    ├─ ToolCallProcessor.process(response) [ASYNC]
    │  └─ orchestrates all tool executions (seq/parallel)
    │
    └─ Feed tool_results back to LLM for next round
```

### 13.2 How ToolExecutor Integrates with ToolCallProcessor

```
ToolCallProcessor._execute_single(block)
    │
    └─ ToolExecutor.execute(block.name, block.input) [SYNC in to_thread]
       │
       ├─ _apply_safety_gates() [HITL prompts]
       ├─ dispatch (bash/native/mcp)
       └─ return dict result
```

### 13.3 How PolicyChain Integrates with ToolRegistry

```
GeodeRuntime.create()
    │
    ├─ build_6layer_chain() → PolicyChain
    │
    ├─ ToolRegistry.to_anthropic_tools(policy=chain, mode=mode)
    │  └─ filters tool list before sending to LLM
    │
    └─ ToolExecutor checks policy again at execution time
       └─ ToolRegistry.execute(name, policy=chain, mode=mode)
```

---

## 14. CHANGELOG REFERENCES

Key architectural decisions documented in `/Users/mango/workspace/geode/CHANGELOG.md`:

- **v0.30.0**: MCPRegistry deleted, MCPServerManager handles config directly
- **v0.29.0**: LLM Provider Module split (router + providers), native tools injected
- **v0.26.0**: AgenticLoop → ToolCallProcessor extracted, thread safety + error handling
- **v0.25.1**: MCP lazy parallel connection (_connect_all via ThreadPoolExecutor)
- **v0.24.0**: MCPServerManager singleton pattern, per-server approval cache
- **v0.22.0**: Sandbox hardening (resource limits, secret redaction), PolicyChain L1-2 wiring

---

## 15. FILE PATHS & STRUCTURE

```
/Users/mango/workspace/geode/
├─ core/agent/
│  ├─ tool_executor.py           (1,179 lines)
│  │   └─ ToolExecutor, ToolCallProcessor
│  └─ error_recovery.py          (461 lines)
│      └─ ErrorRecoveryStrategy, RecoveryStrategy
├─ core/tools/
│  ├─ registry.py                (401 lines)
│  │   └─ ToolRegistry, ToolSearchTool
│  ├─ policy.py                  (431 lines)
│  │   └─ PolicyChain, ToolPolicy, ProfilePolicy, OrgPolicy
│  └─ definitions.json           (52 tools)
├─ core/cli/
│  └─ bash_tool.py               (173 lines)
│      └─ BashTool, BashResult
├─ core/mcp/
│  └─ manager.py                 (580 lines)
│      └─ MCPServerManager, _normalise_mcp_tool()
└─ core/agent/
   └─ safety_constants.py        (lookup tables)
       └─ SAFE_TOOLS, WRITE_TOOLS, EXPENSIVE_TOOLS, DANGEROUS_TOOLS
```

---

**End of Document**
