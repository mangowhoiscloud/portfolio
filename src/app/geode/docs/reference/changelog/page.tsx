import { DocsShell } from "@/components/geode-docs/docs-shell";

export const metadata = { title: "Changelog — GEODE Docs" };

export default function Page() {
  return (
    <DocsShell
      slug="reference/changelog"
      title="Changelog"
      summary="Selected version highlights. The authoritative changelog is CHANGELOG.md in the repository."
    >
      <h2>Unreleased</h2>
      <p style={{opacity: 0.6}}>(empty)</p>

      <h2>v0.65.0 — 2026-05-02</h2>
      <ul>
        <li>
          <strong>fix(login)</strong> <code>manage_login</code> verdict
          shadowing — healthy PAYG / OAuth profiles were reported as{" "}
          <code>eligible: false / reason: provider_mismatch</code> in the
          tool result and the <code>/login</code> dashboard, even though{" "}
          <code>resolve_routing</code> still used them via equivalence-class
          fallback. The verdict-aggregation loop in{" "}
          <code>core/cli/tool_handlers.py:handle_manage_login</code> keyed{" "}
          <code>verdict_index[(name, profile.provider)]</code> while
          iterating <code>evaluate_eligibility(prov)</code> once per unique
          provider; mismatch verdicts shadowed the real verdict via dict-key
          collision. Set iteration order is hash-dependent, so the visible
          symptom was non-deterministic. Fix: skip cross-provider iterations,
          mirroring the same filter applied in{" "}
          <code>credential_breadcrumb.format</code> since v0.51.0. Regression
          test:{" "}
          <code>tests/test_manage_login_tool.py::TestVerdictPerOwnProvider</code>.
          See <a href="/geode/docs/harness/cli">CLI &amp; Slash Commands</a>{" "}
          for the full story. (PR #866)
        </li>
        <li>
          <strong>feat(llm)</strong> Anthropic <code>apply_messages_cache_control()</code>{" "}
          — Hermes <code>system_and_3</code> parity. Fills the remaining
          breakpoint slots so that messages-array history is also cached.
          New <code>MAX_MESSAGE_CACHE_BREAKPOINTS = 3</code> constant; 19 new
          test cases. (PR #864)
        </li>
      </ul>

      <h2>v0.64.0 — 2026-04-29</h2>
      <ul>
        <li>
          <strong>Plugin namespace split.</strong>{" "}
          <code>core/domains/game_ip/</code> →{" "}
          <code>plugins/game_ip/</code>. Hatch wheel ships both top-level
          packages. 72 import statements rewritten across 36 files; quality
          gates extended to cover <code>plugins/</code>.
        </li>
      </ul>

      <h2>v0.63.0 — 2026-04-29</h2>
      <ul>
        <li>
          <strong>Lifecycle commands.</strong> <code>/stop</code>,{" "}
          <code>/clean</code>, <code>/uninstall</code>, <code>/status</code>{" "}
          land alongside the existing slash commands.
        </li>
      </ul>

      <h2>v0.62.0 — 2026-04-28</h2>
      <ul>
        <li>
          <strong>Live test harness.</strong>{" "}
          <code>tests/test_e2e_live_reasoning_depth.py</code> runs the
          full pipeline against real providers (5 cases). Marker:{" "}
          <code>-m live</code>; default-deselected.
        </li>
      </ul>

      <h2>v0.60.0 — 2026-04-28</h2>
      <ul>
        <li>
          <strong>R3-mini PAYG OpenAI Responses parity.</strong>{" "}
          <code>include=[reasoning.encrypted_content]</code> +{" "}
          <code>summary=&quot;auto&quot;</code> for gpt-5.x.
        </li>
      </ul>

      <h2>v0.56.0 — 2026-04-26</h2>
      <ul>
        <li>
          <strong>Anthropic adaptive thinking <code>xhigh</code> on Opus 4.7.</strong>{" "}
          <code>output_config.effort=&quot;xhigh&quot;</code> +{" "}
          <code>display=&quot;summarized&quot;</code> on Opus 4.7. Older
          models downgrade to <code>max</code>.
        </li>
      </ul>

      <h2>v0.50.x — Karpathy P4 ratchet</h2>
      <ul>
        <li>
          <strong>Prompt hash ratchet introduced.</strong> 20{" "}
          <code>_PINNED_HASHES</code> entries; CI breaks on drift. See{" "}
          <a href="/geode/docs/runtime/llm/prompt-hashing">Prompt Hashing</a>.
        </li>
      </ul>

      <h2>Authoritative source</h2>
      <p>
        <code>github.com/mangowhoiscloud/geode/blob/main/CHANGELOG.md</code>{" "}
        is the source of truth. This page is a curated highlight reel for
        readers who want the shape of the project&apos;s evolution rather
        than the per-feature granularity.
      </p>
    </DocsShell>
  );
}
