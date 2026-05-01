import { DocsShell } from "@/components/geode-docs/docs-shell";

export const metadata = { title: "4-Layer Stack — GEODE Docs" };

export default function Page() {
  return (
    <DocsShell
      slug="architecture/overview"
      title="4-Layer Stack"
      summary="GEODE's architecture splits into four layers, each with distinct responsibilities and replaceability boundaries."
    >
      <pre>{`Layer 4 — Agent      AgenticLoop, while(tool_use), error recovery
Layer 3 — Harness    CLI, Gateway, IPC, Hooks, Lifecycle, UI
Layer 2 — Runtime    LLM router, providers, prompts, tools, MCP, memory, skills
Layer 1 — Model      Anthropic / OpenAI / Codex Plus / GLM (3 chains, 9 models)`}</pre>

      <h2>Layer 1 — Model</h2>
      <p>
        The model layer is the only layer with external network calls. GEODE
        uses three provider fallback chains:
      </p>
      <ul>
        <li><strong>Anthropic</strong>: Opus 4.7 → Opus 4.6 → Sonnet 4.6 → Haiku 4.5</li>
        <li><strong>OpenAI Responses / Codex Plus</strong>: gpt-5.5 → gpt-5.4 → gpt-5.4-mini → gpt-5-mini</li>
        <li><strong>GLM</strong>: GLM-4.5+ with the <code>thinking</code> field enabled</li>
      </ul>
      <p>
        Adaptive thinking depth (effort: <code>low</code>, <code>medium</code>,{" "}
        <code>high</code>, <code>max</code>, <code>xhigh</code>) is
        provider-specific but exposed uniformly through the LLM router.
      </p>

      <h2>Layer 2 — Runtime</h2>
      <p>
        The runtime layer holds all of the cross-cutting machinery: prompt
        assembly, tool registry, MCP server orchestration, multi-tier memory,
        skill discovery, and verification guardrails. It exposes a single
        coherent interface to the harness above.
      </p>
      <p>
        Notable subsystems (see <a href="/geode/docs/architecture/system-index">System Index</a>):
      </p>
      <ul>
        <li><code>core/llm/</code> — 15 modules, the prompt + provider router</li>
        <li><code>core/tools/</code> — 16 modules, 56 tools, deferred loading</li>
        <li><code>core/mcp/</code> — 20 modules, 16 servers, 25K token guard</li>
        <li><code>core/memory/</code> — 14 modules, 5-tier context</li>
        <li><code>core/hooks/</code> — 7 modules, 58 lifecycle events</li>
      </ul>

      <h2>Layer 3 — Harness</h2>
      <p>
        The harness is what users see: the CLI, the daemon (<code>geode serve</code>),
        the IPC bridge between thin client and daemon, lifecycle bootstrap,
        and the hook system that makes the rest of GEODE observable.
      </p>
      <p>
        Slash commands (<code>/model</code>, <code>/skip</code>,{" "}
        <code>/resume</code>, <code>/clear</code>, <code>/stop</code>,{" "}
        <code>/status</code>) live here, dispatched by{" "}
        <code>core/cli/commands.py</code>.
      </p>

      <h2>Layer 4 — Agent</h2>
      <p>
        The agent is a thin layer that owns one primitive:{" "}
        <code>while (response.has_tool_use)</code>. <code>AgenticLoop</code>{" "}
        in <code>core/agent/loop.py</code> drives the multi-turn execution,
        delegating prompt assembly, tool execution, and error recovery to the
        runtime layer below.
      </p>
      <p>
        See <a href="/geode/docs/architecture/agentic-loop">Agentic Loop</a> for
        the loop&apos;s exact semantics.
      </p>

      <h2>Replaceability boundary</h2>
      <p>
        Each layer can in principle be swapped without touching the layers
        above:
      </p>
      <ul>
        <li>Adding a new provider means a new file in <code>core/llm/providers/</code> — Layer 1 only.</li>
        <li>Adding a tool means a new tool definition in <code>core/tools/</code> — Layer 2 only.</li>
        <li>Adding a slash command means a new command in <code>core/cli/</code> — Layer 3 only.</li>
        <li>Changing loop semantics is the rare Layer 4 change and is gated by review.</li>
      </ul>
    </DocsShell>
  );
}
