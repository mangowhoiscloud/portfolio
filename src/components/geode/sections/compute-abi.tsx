"use client";

import { useLocale, t } from "../locale-context";

const wires = [
  {
    provider: "Anthropic",
    model: "Opus 4.7",
    effortKwarg: "output_config.effort = \"xhigh\"",
    summaryKwarg: "thinking.display = \"summarized\"",
    replay: "thinking blocks (always-replayed)",
    geode: "v0.56.0 R4-mini",
    note: "Opus 4.7 only; 4.6 / Sonnet 4.6 reject xhigh → downgrade to max",
  },
  {
    provider: "OpenAI Responses (PAYG)",
    model: "gpt-5.5",
    effortKwarg: "reasoning.effort = \"high\" / \"xhigh\"",
    summaryKwarg: "reasoning.summary = \"auto\"",
    replay: "include=[\"reasoning.encrypted_content\"]",
    geode: "v0.60.0 R3-mini",
    note: "store=False explicit; matches Codex Plus parity",
  },
  {
    provider: "OpenAI Codex Plus (subscription)",
    model: "gpt-5.5 / gpt-5.4 / mini",
    effortKwarg: "reasoning.effort",
    summaryKwarg: "(server adds reasoning_summaries)",
    replay: "codex_reasoning_items sidecar replay",
    geode: "v0.55.0 R1",
    note: "shared inject_reasoning_replay() walker (also used by R3-mini PAYG)",
  },
  {
    provider: "GLM (Zhipu)",
    model: "GLM-4.5+ family",
    effortKwarg: "(hybrid binary)",
    summaryKwarg: "extra_body.thinking.type = \"enabled\"",
    replay: "message.reasoning_content (clear_thinking=False)",
    geode: "v0.58.0 R2",
    note: "GEODE-only globally — Hermes / OpenClaw / Claude Code don't activate this field",
  },
];

export function ComputeAbiSection() {
  const locale = useLocale();
  return (
    <section className="relative py-24 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-10">
          <div className="text-[10px] font-mono uppercase tracking-[0.22em] text-[var(--ink-3)] mb-3">
            {t(locale, "§ 4A. COMPUTE ABI — R1~R9 REASONING WIRE", "§ 4A. COMPUTE ABI — R1~R9 REASONING WIRE")}
          </div>
          <h2 className="font-display font-bold tracking-tight text-3xl md:text-4xl text-[var(--ink-1)] leading-tight">
            {t(locale, "네 개의 CPU. 한 ABI.", "Four CPUs. One ABI.")}
          </h2>
          <p className="mt-4 text-[var(--ink-2)] max-w-3xl leading-relaxed text-[15px]">
            {t(
              locale,
              "v0.55부터 v0.62 사이, 아홉 사이클의 reasoning depth audit이 진행됐다. 네 프로바이더가 reasoning을 와이어에 실어 보내는 방식이 제각각이라서, 같은 모델이 어디에 붙느냐에 따라 사용자에게 보이는 사고 깊이가 달랐다. R1부터 R9까지의 사이클이 그 차이를 메웠다. R6은 모델이 사고하는 동안 요약을 IPC로 흘려 사용자가 ‘thinking…’을 실시간으로 보게 했고, R9은 그 모든 변경을 라이브 와이어 테스트로 한 번 더 묶었다.",
              "Between v0.55 and v0.62, nine cycles of a reasoning-depth audit shipped. The four providers carry reasoning differently on the wire, and the same model exposed unequal thinking depth depending on which adapter it sat behind. The R1 → R9 cycles closed those gaps. R6 streams a thinking summary over IPC so the user sees a live ‘thinking…’ band; R9 binds the whole sequence under live wire tests."
            )}
          </p>
        </div>

        <div className="rounded-lg border border-[var(--rule)] overflow-x-auto">
          <table className="w-full text-[13px]">
            <thead>
              <tr className="border-b border-[var(--rule)] bg-[var(--paper-2)]">
                <th className="text-left p-3 font-mono uppercase tracking-wider text-[10px] text-[var(--ink-2)]">
                  {t(locale, "Provider / 모델", "Provider / Model")}
                </th>
                <th className="text-left p-3 font-mono uppercase tracking-wider text-[10px] text-[var(--ink-2)]">
                  Effort
                </th>
                <th className="text-left p-3 font-mono uppercase tracking-wider text-[10px] text-[var(--ink-2)]">
                  Summary surface
                </th>
                <th className="text-left p-3 font-mono uppercase tracking-wider text-[10px] text-[var(--ink-2)]">
                  Multi-turn replay
                </th>
                <th className="text-left p-3 font-mono uppercase tracking-wider text-[10px] text-[var(--ink-2)]">
                  GEODE
                </th>
              </tr>
            </thead>
            <tbody>
              {wires.map((w, i) => (
                <tr key={i} className="border-b border-[var(--rule-soft)] hover:bg-[var(--paper-2)] transition-colors align-top">
                  <td className="p-3">
                    <div className="text-[var(--ink-1)] font-medium">{w.provider}</div>
                    <div className="text-[var(--ink-2)] text-[12px] mt-0.5">{w.model}</div>
                  </td>
                  <td className="p-3 font-mono text-[11.5px] text-[var(--acc-artifact)]">{w.effortKwarg}</td>
                  <td className="p-3 font-mono text-[11.5px] text-[var(--acc-artifact)]">{w.summaryKwarg}</td>
                  <td className="p-3 font-mono text-[11.5px] text-[var(--acc-artifact)]/85">{w.replay}</td>
                  <td className="p-3">
                    <div className="font-mono text-[11px] text-[var(--acc-artifact)]">{w.geode}</div>
                    <div className="text-[var(--ink-2)] text-[11px] mt-1 leading-snug">{w.note}</div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p className="mt-6 text-[var(--ink-2)] max-w-3xl leading-relaxed text-[14px]">
          {t(
            locale,
            "GLM의 thinking 필드를 켜 둔 시스템은 프론티어 어디에도 없다. Hermes는 GLM을 일반 chat_completions로 흘려보내고, OpenClaw는 GLM 플러그인을 가지고 있지 않으며, Claude Code는 Anthropic만을 본다. 이 한 줄짜리 차원에서, v0.58.0의 R2가 GEODE를 앞에 세운다.",
            "No frontier system actually turns GLM's thinking field on. Hermes routes GLM through a generic chat_completions transport; OpenClaw has no GLM plugin; Claude Code is Anthropic-only. On this single dimension, v0.58.0's R2 puts GEODE in front."
          )}
        </p>
      </div>
    </section>
  );
}
