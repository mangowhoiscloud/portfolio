import { DocsShell } from "@/components/geode-docs/docs-shell";

export const metadata = { title: "Prompt System — GEODE Docs" };

export default function Page() {
  return (
    <DocsShell
      slug="runtime/llm/prompt-system"
      title="Prompt System"
      summary="GEODE's prompt subsystem: 5 layers, 17 templates, 3 axes datasets, 20 pinned hashes, ephemeral cache, and an append-only assembler."
    >
      <h2>Five layers</h2>
      <pre>{`1. Templates Layer       core/llm/prompts/*.md           — 17 base + extended sections
2. Axes Layer            plugins/game_ip/config/         — 14 evaluation axes + 4 analyst directives
                          evaluator_axes.yaml
3. Hash Versioning       core/llm/prompts/__init__.py    — SHA-256[:12] x 20 pinned entries
4. Assembly              core/llm/prompt_assembler.py    — base + skill + memory + bootstrap
                                                          (6 phases, append-only by default)
5. Skill Injection       core/skills/skill_registry.py   — frontmatter + body, 5-tier discovery`}</pre>

      <h2>Source of truth</h2>
      <p>
        Prompt text lives in markdown files (<code>analyst.md</code>,{" "}
        <code>evaluator.md</code>, <code>synthesizer.md</code>,{" "}
        <code>biasbuster.md</code>, <code>router.md</code>,{" "}
        <code>cross_llm.md</code>, <code>commentary.md</code>, etc.) and one
        YAML file (<code>evaluator_axes.yaml</code>) that holds the structured
        evaluation rubrics.
      </p>
      <p>
        At import time, <code>core/llm/prompts/__init__.py</code> reads each
        template into a Python constant (<code>ANALYST_SYSTEM</code>,{" "}
        <code>EVALUATOR_SYSTEM</code>, etc.), computes its SHA-256[:12] hash,
        and exposes the registry as <code>PROMPT_VERSIONS</code>.
      </p>

      <h2>Drift detection</h2>
      <p>
        A parallel dictionary, <code>_PINNED_HASHES</code>, holds the expected
        hash for each of the 20 entries. The function{" "}
        <code>verify_prompt_integrity()</code> compares live hashes against
        pinned hashes and returns a list of drifts. CI calls this with{" "}
        <code>raise_on_drift=True</code>, breaking the build on any mismatch.
      </p>
      <p>
        See <a href="/geode/docs/runtime/llm/prompt-hashing">Prompt Hashing</a>{" "}
        for the re-pin workflow when prompts are intentionally changed.
      </p>

      <h2>Assembly</h2>
      <p>
        Pipeline nodes do not call <code>.format()</code> on templates
        directly. They call <code>PromptAssembler.assemble()</code> which
        runs six phases:
      </p>
      <ol>
        <li>Override (append-only by default)</li>
        <li>Skill injection (priority sort, max 3, body cap 500 chars)</li>
        <li>Memory context (<code>_llm_summary</code> primary, fallback path)</li>
        <li>Bootstrap extras (max 5 instructions, 100 chars each)</li>
        <li>Budget observability (warn at 4000 chars)</li>
        <li>Hash + Hook fire (<code>PROMPT_ASSEMBLED</code> event)</li>
      </ol>
      <p>
        The result is an immutable <code>AssembledPrompt</code> dataclass with{" "}
        <code>frozen=True</code> — once built, no code path can modify it.
      </p>

      <h2>Caching</h2>
      <p>
        For Anthropic, <code>build_system_prompt()</code> in{" "}
        <code>core/agent/system_prompt.py</code> inserts a boundary marker (
        <code>__GEODE_PROMPT_CACHE_BOUNDARY__</code>) between the static
        section (router template + identity) and the dynamic section (date,
        model card, memory). The Anthropic adapter splits at this marker and
        applies <code>cache_control: ephemeral</code> to the static block
        only. See <a href="/geode/docs/runtime/llm/prompt-caching">Prompt Caching</a>.
      </p>

      <h2>Observability</h2>
      <p>
        The <code>PROMPT_ASSEMBLED</code> hook event carries metadata only —
        node name, role type, base and assembled hashes, fragment list, and
        conditional fields like <code>skill_hashes</code> and{" "}
        <code>truncation_events</code>. The original prompt text is not in
        the payload, so external observers (LangSmith, custom hook handlers)
        do not see prompt content through this channel.
      </p>
      <p>
        LangSmith integration is opt-in via <code>LANGCHAIN_TRACING_V2=true</code>{" "}
        and an API key. When enabled, five LLM call sites in{" "}
        <code>core/llm/router.py</code> are wrapped with{" "}
        <code>@maybe_traceable</code>.
      </p>

      <h2>Why this design</h2>
      <ul>
        <li>
          <strong>External markdown</strong> makes prompts a first-class
          versioned artifact. <code>git diff</code> on a prompt change is
          unambiguous.
        </li>
        <li>
          <strong>Hash ratchet</strong> turns prompt changes from invisible
          edits into mandatory, reviewable code changes (re-pin required).
        </li>
        <li>
          <strong>Frozen result</strong> prevents accidental mutation between
          assembly and LLM call.
        </li>
        <li>
          <strong>Append-only override</strong> blocks prompt-injection
          channels (env, config, untrusted state) from replacing the system
          prompt entirely.
        </li>
      </ul>
    </DocsShell>
  );
}
