import { DocsShell } from "@/components/geode-docs/docs-shell";

export const metadata = { title: "Prompt Caching — GEODE Docs" };

export default function Page() {
  return (
    <DocsShell
      slug="runtime/llm/prompt-caching"
      title="Prompt Caching"
      summary="Anthropic ephemeral caching with a STATIC/DYNAMIC boundary, applied at two call sites: the agentic adapter and the router's non-agentic helpers."
    >
      <h2>The boundary marker</h2>
      <p>
        <code>core/agent/system_prompt.py:35</code> defines:
      </p>
      <pre>{`PROMPT_CACHE_BOUNDARY = "__GEODE_PROMPT_CACHE_BOUNDARY__"`}</pre>
      <p>
        <code>build_system_prompt()</code> inserts this marker between two
        sections:
      </p>
      <ul>
        <li>
          <strong>STATIC</strong> (before the marker): router template,
          identity from <code>GEODE.md</code>. Stable across turns.
        </li>
        <li>
          <strong>DYNAMIC</strong> (after the marker): current date, model
          card, project memory (G2-G4), user context. Changes per turn.
        </li>
      </ul>

      <h2>How the adapter splits</h2>
      <p>
        <code>core/llm/providers/anthropic.py:411-433</code> in the agentic
        adapter:
      </p>
      <pre>{`from core.agent.system_prompt import PROMPT_CACHE_BOUNDARY

if PROMPT_CACHE_BOUNDARY in system:
    static_part, dynamic_part = system.split(PROMPT_CACHE_BOUNDARY, 1)
    sys_blocks = [
        {"type": "text", "text": static_part.rstrip(),
         "cache_control": {"type": "ephemeral"}},
        {"type": "text", "text": dynamic_part.lstrip()},
    ]
else:
    sys_blocks = [
        {"type": "text", "text": system,
         "cache_control": {"type": "ephemeral"}},
    ]`}</pre>
      <p>
        The static block gets the cache marker; the dynamic block does not.
        Anthropic then caches the static prefix server-side, and subsequent
        turns within the 5-minute TTL pay only for the dynamic suffix and
        the new user message.
      </p>

      <h2>Non-agentic call sites</h2>
      <p>
        Four call sites in <code>core/llm/router.py</code> (lines 481, 582,
        749, 901) use the simpler helper{" "}
        <code>system_with_cache(system)</code> that wraps the entire system
        prompt as a single ephemeral block. These are the {" "}
        non-agentic LLM calls (single-shot prompts, evaluation calls) that
        do not assemble a STATIC/DYNAMIC structured system prompt.
      </p>

      <h2>What is cached, what is not</h2>
      <table>
        <thead>
          <tr><th>Surface</th><th>Cached</th></tr>
        </thead>
        <tbody>
          <tr>
            <td>Anthropic system prompt — STATIC section</td>
            <td>Yes (ephemeral)</td>
          </tr>
          <tr>
            <td>Anthropic system prompt — DYNAMIC section</td>
            <td>No (changes per turn)</td>
          </tr>
          <tr>
            <td>Anthropic non-agentic system prompt (full)</td>
            <td>Yes (single ephemeral block)</td>
          </tr>
          <tr>
            <td>Anthropic <code>messages</code> array</td>
            <td>No (no rolling cache breakpoints yet — see GAP)</td>
          </tr>
          <tr>
            <td>OpenAI / Codex system prompt</td>
            <td>No explicit GEODE wiring (OpenAI auto-caches server-side)</td>
          </tr>
          <tr>
            <td>GLM system prompt</td>
            <td>Provider-managed</td>
          </tr>
        </tbody>
      </table>

      <h2>Open GAP — messages history caching</h2>
      <p>
        Anthropic allows up to four cache breakpoints per request. GEODE
        currently uses one or two (system block, optionally split). The
        <code>messages</code> array — which can grow large in long-horizon
        agentic loops — is not cached. Hermes&apos;s{" "}
        <code>system_and_3</code> strategy applies <code>cache_control</code>{" "}
        to the last three non-system messages and would close this gap.
      </p>
      <p>
        See the wiki note <em>geode-prompt-evolution §2</em> for the proposed
        implementation.
      </p>

      <h2>Cache invalidation</h2>
      <p>
        The cache key is the byte-for-byte content of the cached block plus
        the model ID. Any change to the static section — e.g. an updated{" "}
        <code>GEODE.md</code> identity, a new IP example list, a router
        template revision — invalidates the cache and pays one full request
        before subsequent turns hit again.
      </p>
      <p>
        This is why prompt drift detection (
        <a href="/geode/docs/runtime/llm/prompt-hashing">Prompt Hashing</a>)
        and prompt caching are tightly coupled in the design: a silent prompt
        change would silently invalidate the cache, and the hash ratchet
        forces such changes to be conscious.
      </p>
    </DocsShell>
  );
}
