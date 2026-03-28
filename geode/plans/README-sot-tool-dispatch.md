# SOT: GEODE Tool Dispatch Layer — Complete Research Document

## Overview

This directory contains a **comprehensive, source-of-truth (SOT)** document describing GEODE's tool dispatch layer — the complete system for routing, authorizing, and executing tools available to the agentic loop.

## Files

### Primary Document
- **`sot-tool-dispatch.md`** (54 KB, 1,436 lines)
  - Complete dispatch architecture from LLM tool_use to execution result
  - 15 major sections covering all dispatch layers
  - 3,225 lines of code analyzed across 6 core modules
  - All code references include file:line numbers for exact location

### Reference
- **`sot-tool-dispatch-index.txt`** (Quick lookup guide)
  - Section breakdown with key points
  - Statistics and cross-references
  - Usage guide for presentations vs. implementation

## What's Covered

### Dispatch Flow (Sections 1-10)
1. **Full pipeline sequence** — LLM response → tool_use parsing → execution → result
2. **Tool classification matrix** — 5 safety tiers (TIER 0-4) across 52 tools
3. **Tool registry** — Registration, lookup, deferred loading mechanism
4. **HITL approval gates** — User confirmation flow [Y/n/A] for write/cost/dangerous tools
5. **Native tool execution** — Handler registration and dispatch
6. **MCP tool execution** — External server lifecycle and tool calling
7. **Bash tool safety** — 3-layer protection (patterns, limits, redaction)
8. **Policy chain** — 6-layer access control (Org → Profile → Mode → Agent → Node → SubAgent)
9. **Error recovery** — 4-stage adaptive chain (retry → alt → fallback → escalate)
10. **Parallel execution** — 5-tier batch approval system for 2+ concurrent tools

### Design & Integration (Sections 11-15)
11. **Design trade-offs** — Why direct LLM tool_use, unified namespace, deferred loading, 3 dispatch routes
12. **Key classes** — Full method signatures for ToolCallProcessor, ToolExecutor, ToolRegistry, PolicyChain, etc.
13. **Integration points** — How dispatch system connects to AgenticLoop, error recovery, policies
14. **Changelog references** — Architectural decisions from v0.22.0 to v0.30.0
15. **File structure** — Module organization and line counts

## Key Statistics

| Metric | Value |
|--------|-------|
| **Total code coverage** | 3,225 lines |
| **Largest module** | tool_executor.py (1,179L) |
| **Tool categories** | 12 (analysis, discovery, memory, external, etc.) |
| **Total tools** | 52 |
| **Safety tiers** | 5 (TIER 0-4) |
| **HITL levels** | 3 (0=autonomous, 1=write-only, 2=full) |
| **Recovery stages** | 4 (retry, alternative, fallback, escalate) |
| **Policy layers** | 6 (org, profile, mode, agent, node, subagent) |

## Core Concepts

### The 5-Tier Safety System
- **TIER 0 (SAFE)**: 6 tools auto-execute immediately (list_ips, memory_search, etc.)
- **TIER 1 (MCP auto-approved)**: 5 external servers (reddit, google-trends, steam, etc.)
- **TIER 2 (EXPENSIVE)**: 5 tools (~$0.15-0.50) require single batch cost confirmation
- **TIER 3 (WRITE)**: 9 tools (memory_save, profile_update, etc.) require per-tool HITL
- **TIER 4 (DANGEROUS)**: 1 tool (run_bash) requires approval + blocked pattern check

### The 4-Stage Error Recovery
When a tool fails twice consecutively:
1. **RETRY** — Execute same tool again with 1s delay
2. **ALTERNATIVE** — Try a different tool from same category
3. **FALLBACK** — Try a cheaper tool (different category, lower cost_tier)
4. **ESCALATE** — Give up and return error (escalated to user)

### The 6-Layer Policy Chain
```
Layer 2: Organization (priority=5)     ← org_id:deny
Layer 1: Profile (priority=10)         ← user_id:no_expensive
Layer 3: Mode-based (priority=100)     ← dry_run:block_llm
Layer 4: Agent-level                   ← (in ToolExecutor)
Layer 5: Node-scope                    ← per-pipeline-node allowlists
Layer 6: Sub-agent                     ← (in SubAgentManager)
```

### The 3-Layer Bash Safety
1. **Blocked patterns** (regex check)
   - `rm -rf /`, `sudo`, `curl|sh`, `mkfs`, `fork bomb`, etc.
2. **Resource limits** (preexec_fn)
   - CPU: 30s hard cap
   - FSIZE: 50 MB output limit
   - NPROC: 64 child processes max
3. **Secret redaction** (before LLM context)
   - Mask API keys, OAuth tokens, passwords

### Deferred Loading (2-Hop Retrieval)
When tool count > 10:
- **Hop 1**: LLM calls `tool_search(query="...")`  → Returns matching tools
- **Hop 2**: LLM calls discovered tool with full schema  → Executes

Saves ~85% context tokens (52 tools: ~4000 → ~600 tokens).

## Code References

All major concepts have exact code locations:

| Concept | File | Lines |
|---------|------|-------|
| Tool dispatch | tool_executor.py | 239, 806, 961 |
| Safety gates | tool_executor.py | 161, 356, 400 |
| Tool registry | registry.py | 143, 181, 220 |
| Policy chain | policy.py | 64, 319 |
| Bash safety | bash_tool.py | 79, 85, 97, 137 |
| MCP manager | mcp/manager.py | 87, 110, 261 |
| Error recovery | error_recovery.py | 126, 159, 220 |
| Parallel exec | tool_executor.py | 756, 961 |

## For Different Audiences

### Presentation/Slide Creators
Start with:
- Section 1: Full dispatch flow diagram
- Section 2: Tool classification tables
- Section 4: HITL decision tree
- Section 9: Error recovery 4-stage flow
- Section 10: Parallel execution 5-tier system
- Section 11: Trade-offs analysis

### Implementation/Debuggers
Focus on:
- Section 3: ToolRegistry API
- Section 5: Native tool handler pattern
- Section 6: MCP integration
- Section 7: Bash safety layers
- Section 8: Policy chain construction
- Section 12: Full method signatures

### Architecture Decision Makers
Review:
- Section 11: Design rationale & trade-offs
- Section 13: Integration patterns
- Section 14: CHANGELOG references
- Section 15: File structure

## Key Files in GEODE

```
/Users/mango/workspace/geode/
├─ core/agent/
│  ├─ tool_executor.py      (1,179 lines) ← Main dispatch
│  ├─ error_recovery.py       (461 lines) ← 4-stage recovery
│  └─ safety_constants.py     (lookup tables)
├─ core/tools/
│  ├─ registry.py            (401 lines) ← Tool management
│  ├─ policy.py              (431 lines) ← 6-layer access control
│  └─ definitions.json       (52 tools)
├─ core/cli/
│  └─ bash_tool.py           (173 lines) ← 3-layer shell safety
└─ core/mcp/
   └─ manager.py             (580 lines) ← MCP lifecycle
```

## Document Quality

- ✓ Comprehensive coverage (15 major sections)
- ✓ Exact code references (file:line numbers)
- ✓ Complete method signatures with parameters
- ✓ Visual flow diagrams (ASCII art)
- ✓ Lookup tables and matrices
- ✓ Design rationale and trade-offs
- ✓ Integration points documented
- ✓ Quick index for navigation

## How to Use This Document

1. **First time**: Read Section 1 (full pipeline) to understand overall flow
2. **Deep dive**: Select relevant sections based on your interest (see "For Different Audiences")
3. **Reference**: Use sot-tool-dispatch-index.txt for quick section lookup
4. **Implementation**: Jump to Section 12 for full method signatures
5. **Design discussion**: Section 11 covers all major architectural decisions

## Related Documents

Other SOT documents in `/Users/mango/workspace/portfolio/geode/plans/`:
- `sot-hook-system-deep.md` — Hook lifecycle, 42 hook events, handler wiring
- `sot-s01-s03-opening.md` — Portfolio opening sequence (S1-S3)
- `sot-s04-s07-scaffold.md` — Portfolio scaffold components (S4-S7)
- `sot-s08-s10-core.md` — Core portfolio architecture (S8-S10)
- `sot-s11-s15-agent-detail.md` — Agent system detail (S11-S15)
- `sot-s16-s24-remaining.md` — Remaining architecture (S16-S24)

---

**Created**: 2026-03-28  
**Scope**: 3,225 lines of code across 6 core modules  
**Status**: Complete and verified against source code
