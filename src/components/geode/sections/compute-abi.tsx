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
          <div className="text-[10px] font-mono uppercase tracking-[0.22em] text-[#7A8CA8] mb-3">
            {t(locale, "§ 4A. COMPUTE ABI — R1~R9 REASONING WIRE", "§ 4A. COMPUTE ABI — R1~R9 REASONING WIRE")}
          </div>
          <h2 className="font-display font-bold tracking-tight text-3xl md:text-4xl text-white/90 leading-tight">
            {t(locale, "네 개의 CPU. 한 ABI.", "Four CPUs. One ABI.")}
          </h2>
          <p className="mt-4 text-white/55 max-w-3xl leading-relaxed text-[15px]">
            {t(
              locale,
              "v0.55 ~ v0.62 동안 9-cycle reasoning depth audit (R1~R9). 4 프로바이더의 reasoning wire kwargs 를 정렬해서 모델별 thinking 깊이가 일관되게 노출되도록 했다. R6 (v0.57) 는 thinking summary 를 IPC 로 흘려서 \"thinking…\" 이 사용자에게 보이게 한다. R9 (v0.62) 는 라이브 와이어 테스트로 검증.",
              "From v0.55 through v0.62, a 9-cycle reasoning depth audit (R1~R9) aligned reasoning wire kwargs across 4 providers so that thinking depth is uniformly exposed across models. R6 (v0.57) surfaces thinking summaries via IPC to the user. R9 (v0.62) validates with live wire tests."
            )}
          </p>
        </div>

        <div className="rounded-lg border border-white/[0.06] overflow-x-auto">
          <table className="w-full text-[13px]">
            <thead>
              <tr className="border-b border-white/[0.08] bg-white/[0.02]">
                <th className="text-left p-3 font-mono uppercase tracking-wider text-[10px] text-white/45">
                  {t(locale, "Provider / 모델", "Provider / Model")}
                </th>
                <th className="text-left p-3 font-mono uppercase tracking-wider text-[10px] text-white/45">
                  Effort
                </th>
                <th className="text-left p-3 font-mono uppercase tracking-wider text-[10px] text-white/45">
                  Summary surface
                </th>
                <th className="text-left p-3 font-mono uppercase tracking-wider text-[10px] text-white/45">
                  Multi-turn replay
                </th>
                <th className="text-left p-3 font-mono uppercase tracking-wider text-[10px] text-white/45">
                  GEODE
                </th>
              </tr>
            </thead>
            <tbody>
              {wires.map((w, i) => (
                <tr key={i} className="border-b border-white/[0.04] hover:bg-white/[0.015] transition-colors align-top">
                  <td className="p-3">
                    <div className="text-[#F0F0FF] font-medium">{w.provider}</div>
                    <div className="text-white/45 text-[12px] mt-0.5">{w.model}</div>
                  </td>
                  <td className="p-3 font-mono text-[11.5px] text-[#7BD2FF]/85">{w.effortKwarg}</td>
                  <td className="p-3 font-mono text-[11.5px] text-[#7BD2FF]/85">{w.summaryKwarg}</td>
                  <td className="p-3 font-mono text-[11.5px] text-[#FFD8A8]/80">{w.replay}</td>
                  <td className="p-3">
                    <div className="font-mono text-[11px] text-[#4ECDC4]/80">{w.geode}</div>
                    <div className="text-white/45 text-[11px] mt-1 leading-snug">{w.note}</div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p className="mt-6 text-white/55 max-w-3xl leading-relaxed text-[14px]">
          {t(
            locale,
            "GLM 의 thinking 필드 활성화는 frontier 어디에도 없다. Hermes 는 GLM 을 generic chat_completions 로 라우팅, OpenClaw 는 GLM 플러그인 부재, Claude Code 는 Anthropic 전용. R2 (v0.58.0) 는 이 차원에서 GEODE 가 leader.",
            "GLM thinking field activation is absent across the frontier. Hermes routes GLM through generic chat_completions; OpenClaw has no GLM plugin; Claude Code is Anthropic-only. On this dimension, R2 (v0.58.0) makes GEODE the leader."
          )}
        </p>
      </div>
    </section>
  );
}
