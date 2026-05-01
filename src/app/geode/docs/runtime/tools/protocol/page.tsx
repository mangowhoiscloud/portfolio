import { DocsShell } from "@/components/geode-docs/docs-shell";

export const metadata = { title: "Tool Protocol — GEODE Docs" };

export default function Page() {
  return (
    <DocsShell
      slug="runtime/tools/protocol"
      title="Tool Protocol"
      summary="Tool protocol, registry, deferred loading. 56 tools (24 always-on + 32 deferred), single JSON SOT."
    >
      <h2>The protocol</h2>
      <p>
        <code>core/tools/base.py:35</code> defines <code>Tool</code> as a
        Protocol class. Every tool — native, MCP, plugin — implements:
      </p>
      <pre>{`class Tool(Protocol):
    name: str
    description: str
    input_schema: dict[str, Any]
    async def execute(self, **kwargs) -> Any: ...`}</pre>

      <h2>Single source of truth</h2>
      <p>
        <code>core/tools/definitions.json</code> centralizes tool metadata
        (name, description, schema, always-on flag). Handlers live in
        category modules (<code>core/tools/file_tools.py</code>,{" "}
        <code>core/tools/memory_tools.py</code>, etc.) and are wired into
        the registry by name.
      </p>

      <h2>Deferred loading</h2>
      <p>
        With 56 tools, sending all definitions on every LLM call would burn
        ~10K tokens of input per turn. GEODE splits the catalog:
      </p>
      <table>
        <thead><tr><th>Tier</th><th>Count</th><th>Behaviour</th></tr></thead>
        <tbody>
          <tr><td>Always-on</td><td>24</td><td>Sent on every LLM call (Read, Write, Edit, Bash, Grep, Glob, etc.)</td></tr>
          <tr><td>Deferred</td><td>32</td><td>Discoverable via <code>tool_search</code>, loaded on demand</td></tr>
        </tbody>
      </table>
      <p>
        The pattern is borrowed from Claude Code&apos;s tool deferred-loading
        design.
      </p>

      <h2>Tool execution lifecycle (Hook events)</h2>
      <ul>
        <li><code>TOOL_EXEC_START</code> — before <code>execute()</code></li>
        <li><code>TOOL_EXEC_END</code> — after success</li>
        <li><code>TOOL_EXEC_FAILED</code> — exception path</li>
        <li><code>TOOL_RECOVERY_START</code> / <code>TOOL_RECOVERY_END</code> — retry path</li>
        <li><code>TOOL_APPROVAL_REQUEST</code> / <code>GRANTED</code> / <code>DENIED</code> — HITL gate</li>
      </ul>

      <h2>4-tier safety</h2>
      <p>
        Tools are tagged with a safety tier in <code>definitions.json</code>:
      </p>
      <ol>
        <li><strong>Read-only</strong> — Read, Grep, Glob, Search → no approval</li>
        <li><strong>Local mutation</strong> — Edit, Write → in-CWD allow-listed</li>
        <li><strong>Side-effect</strong> — Bash, message-send → HITL approval</li>
        <li><strong>Destructive</strong> — rm -rf, force push → confirmation required</li>
      </ol>

      <h2>Categories</h2>
      <ul>
        <li><strong>FileTools</strong> — Read, Write, Edit, Glob, Grep</li>
        <li><strong>MemoryTools</strong> — memory_search, memory_get, memory_save</li>
        <li><strong>DataTools</strong> — query_monolake, IP profile lookup</li>
        <li><strong>ComputerUse</strong> — provider-agnostic desktop automation (PyAutoGUI)</li>
        <li><strong>MCP</strong> — exposed via <code>core/mcp/</code> service (16 servers, 25K guard)</li>
      </ul>
    </DocsShell>
  );
}
