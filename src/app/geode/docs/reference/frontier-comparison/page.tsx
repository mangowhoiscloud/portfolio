import { DocsShell } from "@/components/geode-docs/docs-shell";

export const metadata = { title: "Frontier Comparison — GEODE Docs" };

export default function Page() {
  return (
    <DocsShell
      slug="reference/frontier-comparison"
      title="Frontier Comparison"
      summary="GEODE side-by-side with Hermes Agent, OpenClaw, and Claude Code on six axes: definition, assembly, hashing, caching, observability, and security."
    >
      <h2>Definition layer</h2>
      <table>
        <thead><tr><th>Axis</th><th>GEODE</th><th>Hermes</th><th>OpenClaw</th><th>Claude Code</th></tr></thead>
        <tbody>
          <tr><td>Source location</td><td><code>core/llm/prompts/*.md</code></td><td><code>agent/prompt_builder.py</code> (Python const)</td><td><code>src/agents/system-prompt.ts</code> (TS const)</td><td><code>constants/prompts.ts</code> (TS const)</td></tr>
          <tr><td>Build time</td><td>Module import</td><td>Session start (cached)</td><td>Per-call modular</td><td>Per-turn dynamic</td></tr>
          <tr><td>User memory</td><td>5-tier <code>~/.geode/memory/</code></td><td>Frozen JSON snapshot</td><td>Workspace HEARTBEAT.md</td><td>CLAUDE.md (4-tier)</td></tr>
        </tbody>
      </table>

      <h2>Assembly</h2>
      <table>
        <thead><tr><th>Axis</th><th>GEODE</th><th>Hermes</th><th>OpenClaw</th><th>Claude Code</th></tr></thead>
        <tbody>
          <tr><td>Result type</td><td><code>AssembledPrompt(frozen=True)</code></td><td><code>str</code> cached</td><td>String returned</td><td><code>TextBlockParam[]</code></td></tr>
          <tr><td>Override policy</td><td>Append-only by default</td><td>Append via param</td><td>Append via param</td><td>5-priority chain</td></tr>
          <tr><td>Skill format</td><td>Markdown blocks</td><td>XML <code>&lt;available_skills&gt;</code></td><td>XML <code>&lt;available_skills&gt;</code></td><td>XML registry</td></tr>
          <tr><td>Truncation event log</td><td><code>truncation_events</code> in hook</td><td>Logger only</td><td>Report object</td><td>Not tracked</td></tr>
        </tbody>
      </table>

      <h2>Hashing &amp; integrity</h2>
      <table>
        <thead><tr><th>Axis</th><th>GEODE</th><th>Hermes</th><th>OpenClaw</th><th>Claude Code</th></tr></thead>
        <tbody>
          <tr><td>Algorithm</td><td>SHA-256[:12]</td><td>None</td><td>SHA-256 (full)</td><td>SHA-256[:3]</td></tr>
          <tr><td>Pin / CI gate</td><td><strong>Yes</strong> — <code>_PINNED_HASHES</code> × 20</td><td>None</td><td>Detection only</td><td>None (attribution only)</td></tr>
          <tr><td>Normalization</td><td>UTF-8 / json sort_keys</td><td>mtime + size manifest</td><td>CRLF strip + sort + lowercase</td><td>(model, toolNames, sysLen) tuple</td></tr>
        </tbody>
      </table>

      <h2>Caching</h2>
      <table>
        <thead><tr><th>Axis</th><th>GEODE</th><th>Hermes</th><th>OpenClaw</th><th>Claude Code</th></tr></thead>
        <tbody>
          <tr><td>Anthropic ephemeral</td><td>Yes — system + STATIC/DYNAMIC</td><td>Yes — system_and_3</td><td>Yes — boundary marker</td><td>Yes — global/org scope</td></tr>
          <tr><td>Boundary marker</td><td><code>__GEODE_PROMPT_CACHE_BOUNDARY__</code></td><td>None</td><td><code>&lt;!-- OPENCLAW_CACHE_BOUNDARY --&gt;</code></td><td><code>__SYSTEM_PROMPT_DYNAMIC_BOUNDARY__</code></td></tr>
          <tr><td>Messages history cache</td><td>No (open GAP)</td><td>Yes — last 3</td><td>Yes — last user message</td><td>Yes — last user blocks</td></tr>
          <tr><td>Breakpoints used / 4</td><td>1-2</td><td>4</td><td>2-3</td><td>3-4</td></tr>
        </tbody>
      </table>

      <h2>Observability</h2>
      <table>
        <thead><tr><th>Axis</th><th>GEODE</th><th>Hermes</th><th>OpenClaw</th><th>Claude Code</th></tr></thead>
        <tbody>
          <tr><td>Primary channel</td><td><code>PROMPT_ASSEMBLED</code> hook payload</td><td>60-char preview log</td><td><code>cache-trace.ts</code> JSONL</td><td><code>logEvent('tengu_*')</code> telemetry</td></tr>
          <tr><td>External tracing</td><td>LangSmith opt-in</td><td>None</td><td>Self JSONL</td><td>Self telemetry</td></tr>
          <tr><td>Prompt text in trace</td><td>Hashes only</td><td>Stored in session DB</td><td>Hashes by default</td><td>Not in telemetry</td></tr>
        </tbody>
      </table>

      <h2>Security</h2>
      <table>
        <thead><tr><th>Axis</th><th>GEODE</th><th>Hermes</th><th>OpenClaw</th><th>Claude Code</th></tr></thead>
        <tbody>
          <tr><td>Prompt-injection scan</td><td>None (open GAP)</td><td><strong>11 patterns</strong> + invisible Unicode</td><td>Path/URL sanitization</td><td>Trusts user intent</td></tr>
          <tr><td>Frozen result</td><td><code>frozen=True</code></td><td>Convention</td><td>Convention</td><td>Convention</td></tr>
          <tr><td>Override security</td><td>Append-only by default</td><td>Append-only</td><td>Append-only</td><td>Priority chain</td></tr>
        </tbody>
      </table>

      <h2>Why GEODE was the only one to ratchet</h2>
      <p>
        GEODE&apos;s prompts live in markdown files. Hermes, OpenClaw, and
        Claude Code keep prompts as inline strings inside their respective
        TypeScript or Python source. Inline strings are subject to
        autoformatter noise, IDE renames, and merge-conflict resolutions in
        ways that fight a hashlib-based ratchet. External markdown makes the
        file the unit of change, and the hash becomes meaningful.
      </p>
      <p>
        The cost: GEODE pays one extra step (the re-pin) for every
        intentional prompt change, but gets a CI-enforced guarantee that
        unintentional changes never ship.
      </p>
    </DocsShell>
  );
}
