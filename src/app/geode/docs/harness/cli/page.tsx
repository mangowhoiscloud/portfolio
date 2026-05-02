import { DocsShell } from "@/components/geode-docs/docs-shell";

export const metadata = { title: "CLI & Slash Commands — GEODE Docs" };

export default function Page() {
  return (
    <DocsShell
      slug="harness/cli"
      title="CLI & Slash Commands"
      summary="Thin client → IPC → serve daemon. 30 modules, 15+ slash commands. Auto-starts the daemon on first call."
    >
      <h2>Two-process architecture</h2>
      <pre>{`User
  │
  ▼
geode CLI  (thin client, ~30 modules)
  │
  │  IPC (unix socket / stdio)
  ▼
geode serve  (daemon, hosts AgenticLoop + state)
  │
  ▼
LLM provider`}</pre>
      <p>
        The thin CLI keeps startup latency low and makes one-shot commands
        feel instant. The daemon owns the long-lived state (AgenticLoop
        context, MCP server processes, scheduler) so that{" "}
        <code>/resume</code> and multi-turn flows do not have to re-bootstrap.
      </p>

      <h2>Auto-start</h2>
      <p>
        On first <code>geode</code> invocation if the daemon is not running,
        the CLI spawns it and proxies. <code>geode serve</code> is the
        explicit start; <code>/stop</code> shuts it down cleanly.
      </p>

      <h2>Top-level commands</h2>
      <pre>{`geode                                      # interactive REPL
geode "summarize the latest AI research"   # NL one-shot
geode analyze "Cowboy Bebop" --dry-run     # game_ip plugin
geode analyze "Berserk" --verbose          # full run with API
geode serve                                # start daemon
geode version                              # version
geode skill list / skill view / skill manage`}</pre>

      <h2>Slash commands (REPL)</h2>
      <table>
        <thead><tr><th>Command</th><th>Effect</th></tr></thead>
        <tbody>
          <tr><td><code>/login</code></td><td>Auth dashboard — Plans, Profiles, Routing. Subcommands: <code>oauth &lt;provider&gt;</code>, <code>set-key &lt;plan-id&gt; &lt;key&gt;</code>, <code>use &lt;plan-id&gt;</code>, <code>route</code>, <code>quota</code>. LLM-agentic counterpart: <code>manage_login</code> tool.</td></tr>
          <tr><td><code>/model &lt;name&gt;</code></td><td>Switch active model. Triggers <code>MODEL_SWITCHED</code> hook + system-prompt rebuild.</td></tr>
          <tr><td><code>/skip</code></td><td>Skip the current pending tool call (used during HITL approval).</td></tr>
          <tr><td><code>/resume</code></td><td>Restore the last session&apos;s message history + state.</td></tr>
          <tr><td><code>/clear</code></td><td>Reset in-process context. Persists nothing.</td></tr>
          <tr><td><code>/stop</code></td><td>Halt the daemon. Saves session if configured.</td></tr>
          <tr><td><code>/clean</code></td><td>Remove temp artifacts (cache, IPC sockets).</td></tr>
          <tr><td><code>/uninstall</code></td><td>Remove GEODE state directories (with confirmation).</td></tr>
          <tr><td><code>/status</code></td><td>Show daemon, model, MCP server, hook status.</td></tr>
          <tr><td><code>/help</code></td><td>Inline help.</td></tr>
        </tbody>
      </table>

      <h2><code>manage_login</code> agentic tool</h2>
      <p>
        The LLM-agentic counterpart of <code>/login</code>. Wired in{" "}
        <code>core/cli/tool_handlers.py:882-955</code>. Subcommands mirror the
        slash command (<code>status</code>, <code>add</code>, <code>oauth</code>,{" "}
        <code>set-key</code>, <code>use</code>, <code>route</code>,{" "}
        <code>remove</code>, <code>quota</code>). Returns a structured snapshot
        — <code>plans</code>, <code>profiles</code>, <code>routing</code> —
        so the agent can self-diagnose auth state and remediate without a
        round trip to the user.
      </p>

      <h3>v0.65.0 fix — verdict shadowing (PR #866)</h3>
      <p>
        Pre-v0.65.0 the verdict-aggregation loop in{" "}
        <code>handle_manage_login</code> keyed{" "}
        <code>verdict_index[(name, profile.provider)]</code> while iterating{" "}
        <code>evaluate_eligibility(prov)</code> once per unique provider in
        the store. Because each iteration evaluates <em>every</em> profile
        and emits <code>PROVIDER_MISMATCH</code> for non-matching providers,
        those mismatch verdicts share the dict key with the real verdict and
        the last set-iteration <em>shadows</em> it. With Python set
        iteration order being hash-dependent, healthy PAYG / OAuth profiles
        surfaced as <code>eligible: false / reason: provider_mismatch</code>{" "}
        in the LLM tool result and the dashboard — even though{" "}
        <code>resolve_routing</code> would still use them via equivalence-class
        fallback. Fix: skip cross-provider iterations
        (<code>if v.reason is ProfileRejectReason.PROVIDER_MISMATCH: continue</code>),
        mirroring the same filter that{" "}
        <code>core/auth/credential_breadcrumb.format</code> has applied since
        v0.51.0. Regression test:{" "}
        <code>tests/test_manage_login_tool.py::TestVerdictPerOwnProvider</code>.
      </p>

      <h2>Files</h2>
      <ul>
        <li><code>core/cli/commands.py:41</code> — <code>ModelProfile</code> + slash command dispatch</li>
        <li><code>core/cli/agentic_loop.py</code> — REPL bootstrap + AgenticLoop wiring</li>
        <li><code>core/cli/result_cache.py</code> — 24h TTL cache with content hash</li>
        <li><code>core/cli/effort_picker.py</code> — interactive effort selector</li>
      </ul>

      <h2>Bash integration</h2>
      <p>
        <code>geode-exec</code> runs a one-shot agent command in the current
        shell, capturing output as a normal Unix tool. Useful for cron and
        scripting.
      </p>
    </DocsShell>
  );
}
