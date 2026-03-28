"use client";

import { useState } from "react";
import { ScrollReveal } from "../scroll-reveal";

type Mode = "pipeline" | "agentic";

/* ── Pipeline pricing (actually used) ── */
const pipelinePricing = [
  { model: "claude-opus-4-6", role: "전 노드 Primary", input: "$5.00", output: "$25.00", color: "#F4B8C8" },
  { model: "gpt-5.4", role: "Cross-LLM 검증 Secondary", input: "$2.50", output: "$15.00", color: "#34D399" },
];

/* ── Agentic pricing (failover chain) ── */
const agenticPricing = [
  { model: "claude-opus-4-6", role: "Primary (기본)", input: "$5.00", output: "$25.00", color: "#F4B8C8" },
  { model: "claude-sonnet-4-6", role: "Failover #1", input: "$3.00", output: "$15.00", color: "#818CF8" },
  { model: "gpt-5.4", role: "Cross-Provider Failover", input: "$2.50", output: "$15.00", color: "#34D399" },
  { model: "glm-5", role: "Budget / Cross-Provider", input: "$0.72", output: "$2.30", color: "#F5C542" },
  { model: "claude-haiku-4-5", role: "Token Guard (budget)", input: "$1.00", output: "$5.00", color: "#4ECDC4" },
];

export function MultiLlmSection() {
  const [mode, setMode] = useState<Mode>("pipeline");

  return (
    <section className="relative py-28 sm:py-32 px-4 sm:px-6">
      <div className="relative z-10 max-w-5xl mx-auto">
        <ScrollReveal>
          <p className="text-sm font-mono font-bold text-[#F4B8C8]/60 uppercase tracking-[0.25em] mb-3">
            Multi-LLM
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white/90 mb-2">
            LLM Resilience
          </h2>
          <p className="text-sm sm:text-base text-[#8B9CC0] max-w-xl mb-8 leading-relaxed">
            파이프라인과 에이전트 루프에서 LLM을 다르게 운용합니다.
            Port/Adapter DI 패턴으로 런타임에 프로바이더를 교체하고,
            프로바이더 장애 시 자동 failover합니다.
          </p>
        </ScrollReveal>

        {/* ── Mode toggle ── */}
        <ScrollReveal delay={0.05}>
          <div className="flex gap-2 mb-8">
            <button
              onClick={() => setMode("pipeline")}
              className="px-4 py-2 rounded-lg text-xs font-mono font-bold transition-all duration-300"
              style={{
                color: mode === "pipeline" ? "#C084FC" : "#5A6A8A",
                background: mode === "pipeline" ? "rgba(192,132,252,0.08)" : "transparent",
                border: `1px solid ${mode === "pipeline" ? "rgba(192,132,252,0.2)" : "rgba(255,255,255,0.04)"}`,
              }}
            >
              Pipeline. LLM-as-Judge
              <span className="ml-2 text-[10px] opacity-50">Opus + GPT Cross</span>
            </button>
            <button
              onClick={() => setMode("agentic")}
              className="px-4 py-2 rounded-lg text-xs font-mono font-bold transition-all duration-300"
              style={{
                color: mode === "agentic" ? "#4ECDC4" : "#5A6A8A",
                background: mode === "agentic" ? "rgba(78,205,196,0.08)" : "transparent",
                border: `1px solid ${mode === "agentic" ? "rgba(78,205,196,0.2)" : "rgba(255,255,255,0.04)"}`,
              }}
            >
              Agentic Loop. Resilient Failover
              <span className="ml-2 text-[10px] opacity-50">5 Models · 3 Providers</span>
            </button>
          </div>
        </ScrollReveal>

        <ScrollReveal delay={0.1}>
          {/* ── Pipeline: LLM-as-Judge ── */}
          {mode === "pipeline" && (
            <div>
              <div className="overflow-x-auto -mx-4 px-4 pb-2 mb-6">
                <svg viewBox="0 0 800 170" className="w-full min-w-[600px]" style={{ maxHeight: 200 }}>
                  {/* Opus Primary group */}
                  <rect x={15} y={15} width={460} height={120} rx={12} fill="none" stroke="#F4B8C8" strokeOpacity={0.15} strokeWidth={1} strokeDasharray="6 4" />
                  <text x={245} y={10} textAnchor="middle" fill="#F4B8C8" fillOpacity={0.5} fontSize={10} fontFamily="ui-monospace, monospace" fontWeight={700}>claude-opus-4-6 (Primary)</text>

                  {/* Pipeline nodes — evenly spaced */}
                  {[
                    { x: 60, label: "Router" },
                    { x: 155, label: "Analyst×4" },
                    { x: 255, label: "Eval×3" },
                    { x: 345, label: "Scoring" },
                    { x: 435, label: "Synth" },
                  ].map((n, i) => (
                    <g key={n.label}>
                      <rect x={n.x - 36} y={40} width={72} height={38} rx={8} fill="#0A0F1A" stroke="#F4B8C8" strokeWidth={0.8} strokeOpacity={0.4} />
                      <text x={n.x} y={63} textAnchor="middle" fill="#F4B8C8" fontSize={10} fontFamily="ui-monospace, monospace" fontWeight={600}>{n.label}</text>
                      {i < 4 && <path d={`M${n.x + 36},59 C${n.x + 45},56 ${n.x + 55},56 ${n.x + 59},59`} stroke="white" strokeOpacity={0.15} strokeWidth={1} fill="none" />}
                    </g>
                  ))}

                  {/* Arrow: Pipeline → Verification */}
                  <path d="M471,59 C490,55 510,55 530,59" stroke="white" strokeOpacity={0.2} strokeWidth={1} fill="none" />

                  {/* Cross-LLM Verification group */}
                  <rect x={520} y={15} width={265} height={120} rx={12} fill="none" stroke="#34D399" strokeOpacity={0.15} strokeWidth={1} strokeDasharray="6 4" />
                  <text x={652} y={10} textAnchor="middle" fill="#34D399" fillOpacity={0.5} fontSize={10} fontFamily="ui-monospace, monospace" fontWeight={700}>Cross-LLM Verification</text>

                  {/* Opus + GPT side by side */}
                  <rect x={535} y={40} width={85} height={38} rx={8} fill="#0A0F1A" stroke="#F4B8C8" strokeWidth={0.8} strokeOpacity={0.4} />
                  <text x={577} y={56} textAnchor="middle" fill="#F4B8C8" fontSize={10} fontFamily="ui-monospace, monospace" fontWeight={600}>Opus 4.6</text>
                  <text x={577} y={70} textAnchor="middle" fill="#F4B8C8" fillOpacity={0.4} fontSize={8} fontFamily="ui-monospace, monospace">primary</text>

                  <rect x={635} y={40} width={85} height={38} rx={8} fill="#0A0F1A" stroke="#34D399" strokeWidth={0.8} strokeOpacity={0.4} />
                  <text x={677} y={56} textAnchor="middle" fill="#34D399" fontSize={10} fontFamily="ui-monospace, monospace" fontWeight={600}>GPT-5.4</text>
                  <text x={677} y={70} textAnchor="middle" fill="#34D399" fillOpacity={0.4} fontSize={8} fontFamily="ui-monospace, monospace">secondary</text>

                  {/* Agreement — below, clear spacing */}
                  <rect x={560} y={95} width={155} height={32} rx={8} fill="#0A0F1A" stroke="#818CF8" strokeWidth={0.8} strokeOpacity={0.4} />
                  <text x={637} y={115} textAnchor="middle" fill="#818CF8" fontSize={10} fontFamily="ui-monospace, monospace" fontWeight={600}>Agreement ≥ 0.67 · α ≥ 0.80</text>

                  {/* Converge arrows from Opus+GPT to Agreement */}
                  <path d="M577,78 C577,86 610,90 637,95" stroke="#818CF8" strokeOpacity={0.15} strokeWidth={0.8} fill="none" />
                  <path d="M677,78 C677,86 660,90 637,95" stroke="#818CF8" strokeOpacity={0.15} strokeWidth={0.8} fill="none" />

                  {/* Bottom annotation */}
                  <text x={400} y={160} textAnchor="middle" fill="white" fillOpacity={0.2} fontSize={9} fontFamily="ui-monospace, monospace">
                    Opus 전 노드 Primary + GPT-5.4 Cross-LLM Secondary
                  </text>
                </svg>
              </div>

              {/* Pipeline pricing */}
              <div className="overflow-x-auto -mx-4 px-4">
                <table className="w-full text-xs font-mono border-collapse min-w-[400px]">
                  <thead>
                    <tr className="border-b border-white/[0.06]">
                      <th className="text-left py-2 px-3 text-[#7A8CA8]">Model</th>
                      <th className="text-left py-2 px-3 text-[#7A8CA8]">역할</th>
                      <th className="text-right py-2 px-2 text-[#7A8CA8]">Input</th>
                      <th className="text-right py-2 px-2 text-[#7A8CA8]">Output</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pipelinePricing.map((p) => (
                      <tr key={p.model} className="border-b border-white/[0.03]">
                        <td className="py-2 px-3" style={{ color: p.color }}>{p.model}</td>
                        <td className="py-2 px-3 text-white/50">{p.role}</td>
                        <td className="text-right py-2 px-2 text-white/40">{p.input}</td>
                        <td className="text-right py-2 px-2 text-white/40">{p.output}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ── Agentic Loop: Resilient Failover ── */}
          {mode === "agentic" && (
            <div>
              <div className="overflow-x-auto -mx-4 px-4 pb-2 mb-6">
                <svg viewBox="0 0 720 170" className="w-full min-w-[540px]" style={{ maxHeight: 200 }}>
                  {/* Failover chain: 4 boxes in a row */}
                  {[
                    { x: 20, w: 130, label: "Opus 4.6", sub: "Primary", color: "#F4B8C8" },
                    { x: 190, w: 130, label: "Sonnet 4.6", sub: "Anthropic Failover", color: "#818CF8" },
                    { x: 360, w: 130, label: "GPT-5.4", sub: "Cross-Provider", color: "#34D399" },
                    { x: 530, w: 110, label: "GLM-5", sub: "Budget", color: "#F5C542" },
                  ].map((m, i) => (
                    <g key={m.label}>
                      <rect x={m.x} y={40} width={m.w} height={50} rx={10} fill="#0A0F1A" stroke={m.color} strokeWidth={i === 0 ? 1 : 0.7} strokeOpacity={i === 0 ? 0.4 : 0.25} />
                      <text x={m.x + m.w / 2} y={60} textAnchor="middle" fill={m.color} fontSize={11} fontFamily="ui-monospace, monospace" fontWeight={700}>{m.label}</text>
                      <text x={m.x + m.w / 2} y={78} textAnchor="middle" fill={m.color} fillOpacity={0.35} fontSize={9} fontFamily="ui-monospace, monospace">{m.sub}</text>
                      {i < 3 && (
                        <>
                          <line x1={m.x + m.w} y1={65} x2={[190, 360, 530][i]} y2={65} stroke="#E87080" strokeOpacity={0.2} strokeWidth={1} strokeDasharray="3 3" />
                          <text x={m.x + m.w + ([190, 360, 530][i] - m.x - m.w) / 2} y={56} textAnchor="middle" fill="#E87080" fillOpacity={0.35} fontSize={8} fontFamily="ui-monospace, monospace">fail</text>
                        </>
                      )}
                    </g>
                  ))}

                  {/* Title */}
                  <text x={360} y={22} textAnchor="middle" fill="white" fillOpacity={0.4} fontSize={10} fontFamily="ui-monospace, monospace" fontWeight={700}>
                    LLM Resilience. 런타임 프로바이더 교체
                  </text>

                  {/* Bottom: Haiku + retry policy */}
                  <rect x={20} y={105} width={150} height={32} rx={6} fill="#0A0F1A" stroke="#4ECDC4" strokeWidth={0.6} strokeOpacity={0.2} />
                  <text x={95} y={125} textAnchor="middle" fill="#4ECDC4" fillOpacity={0.5} fontSize={9} fontFamily="ui-monospace, monospace">Haiku 4.5 Token Guard</text>

                  <text x={430} y={125} textAnchor="middle" fill="white" fillOpacity={0.45} fontSize={9} fontFamily="ui-monospace, monospace">
                    max 3 retries · exp backoff 2s~30s · MODEL_SWITCHED hook
                  </text>
                </svg>
              </div>

              {/* Agentic pricing */}
              <div className="overflow-x-auto -mx-4 px-4">
                <table className="w-full text-xs font-mono border-collapse min-w-[400px]">
                  <thead>
                    <tr className="border-b border-white/[0.06]">
                      <th className="text-left py-2 px-3 text-[#7A8CA8]">Model</th>
                      <th className="text-left py-2 px-3 text-[#7A8CA8]">역할</th>
                      <th className="text-right py-2 px-2 text-[#7A8CA8]">Input</th>
                      <th className="text-right py-2 px-2 text-[#7A8CA8]">Output</th>
                    </tr>
                  </thead>
                  <tbody>
                    {agenticPricing.map((p) => (
                      <tr key={p.model} className="border-b border-white/[0.03]">
                        <td className="py-2 px-3" style={{ color: p.color }}>{p.model}</td>
                        <td className="py-2 px-3 text-white/50">{p.role}</td>
                        <td className="text-right py-2 px-2 text-white/40">{p.input}</td>
                        <td className="text-right py-2 px-2 text-white/40">{p.output}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Port/Adapter explanation */}
              <div className="mt-4 flex flex-wrap gap-1.5">
                {["ClaudeAgenticAdapter", "OpenAIAgenticAdapter", "GlmAgenticAdapter", "update_model() 런타임 교체", "MODEL_SWITCHED hook"].map((t) => (
                  <span key={t} className="px-2 py-0.5 rounded text-[11px] font-mono text-[#4ECDC4]/70 bg-[#4ECDC4]/06 border border-[#4ECDC4]/12">{t}</span>
                ))}
              </div>
            </div>
          )}
        </ScrollReveal>
      </div>
    </section>
  );
}
