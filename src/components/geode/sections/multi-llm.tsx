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
                <svg viewBox="0 0 760 280" className="w-full min-w-[580px]" style={{ maxHeight: 320 }}>
                  <defs>
                    <filter id="glow-merge" x="-30%" y="-30%" width="160%" height="160%">
                      <feGaussianBlur stdDeviation="3" result="blur" />
                      <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
                    </filter>
                    <marker id="arr-gold" viewBox="0 0 7 5" refX="6" refY="2.5" markerWidth="6" markerHeight="5" orient="auto">
                      <path d="M0,0 L7,2.5 L0,5" fill="#F5C542" opacity={0.5} />
                    </marker>
                    <marker id="arr-teal" viewBox="0 0 7 5" refX="6" refY="2.5" markerWidth="6" markerHeight="5" orient="auto">
                      <path d="M0,0 L7,2.5 L0,5" fill="#34D399" opacity={0.5} />
                    </marker>
                    <marker id="arr-indigo" viewBox="0 0 7 5" refX="6" refY="2.5" markerWidth="6" markerHeight="5" orient="auto">
                      <path d="M0,0 L7,2.5 L0,5" fill="#818CF8" opacity={0.5} />
                    </marker>
                  </defs>

                  {/* PRIMARY — Claude Opus 4.6 */}
                  <rect x={20} y={20} width={280} height={150} rx={12} fill="rgba(245,197,66,0.04)" stroke="#F5C542" strokeWidth={1.5} strokeOpacity={0.35} />
                  <text x={160} y={42} textAnchor="middle" fill="#F5C542" fillOpacity={0.7} fontSize={11} fontFamily="ui-monospace, monospace" fontWeight={700}>PRIMARY — Opus 4.6</text>
                  <text x={160} y={58} textAnchor="middle" fill="#F5C542" fillOpacity={0.35} fontSize={9} fontFamily="ui-monospace, monospace">primary_analysts + evaluators</text>
                  <rect x={35} y={70} width={120} height={30} rx={6} fill="#0C1220" stroke="#F5C542" strokeWidth={0.6} strokeOpacity={0.3} />
                  <text x={95} y={89} textAnchor="middle" fill="#F5C542" fillOpacity={0.6} fontSize={9} fontFamily="ui-monospace, monospace">Analyst ×4 (Send)</text>
                  <rect x={165} y={70} width={120} height={30} rx={6} fill="#0C1220" stroke="#F5C542" strokeWidth={0.6} strokeOpacity={0.3} />
                  <text x={225} y={89} textAnchor="middle" fill="#F5C542" fillOpacity={0.6} fontSize={9} fontFamily="ui-monospace, monospace">Eval ×3 + Scoring</text>
                  <rect x={80} y={115} width={160} height={28} rx={6} fill="#0C1220" stroke="#F5C542" strokeWidth={0.6} strokeOpacity={0.25} />
                  <text x={160} y={133} textAnchor="middle" fill="#F5C542" fillOpacity={0.5} fontSize={9} fontFamily="ui-monospace, monospace">Synthesizer + Report</text>

                  {/* SECONDARY — GPT-5.4 */}
                  <rect x={20} y={185} width={280} height={65} rx={12} fill="rgba(52,211,153,0.04)" stroke="#34D399" strokeWidth={1.5} strokeOpacity={0.35} />
                  <text x={160} y={207} textAnchor="middle" fill="#34D399" fillOpacity={0.7} fontSize={11} fontFamily="ui-monospace, monospace" fontWeight={700}>SECONDARY — GPT-5.4</text>
                  <text x={160} y={225} textAnchor="middle" fill="#34D399" fillOpacity={0.35} fontSize={9} fontFamily="ui-monospace, monospace">secondary_analysts · cross-eval</text>

                  {/* SCORE MERGE (glow) */}
                  <rect x={380} y={100} width={140} height={60} rx={12} fill="rgba(129,140,248,0.08)" stroke="#818CF8" strokeWidth={2} strokeOpacity={0.5} filter="url(#glow-merge)" />
                  <text x={450} y={125} textAnchor="middle" fill="#818CF8" fontSize={12} fontFamily="ui-monospace, monospace" fontWeight={700}>Score Merge</text>
                  <text x={450} y={145} textAnchor="middle" fill="#818CF8" fillOpacity={0.5} fontSize={9} fontFamily="ui-monospace, monospace">agreement ≥ 0.67</text>

                  {/* RELIABILITY CHECK */}
                  <rect x={570} y={90} width={170} height={80} rx={12} fill="rgba(192,132,252,0.05)" stroke="#C084FC" strokeWidth={1.5} strokeOpacity={0.35} />
                  <text x={655} y={118} textAnchor="middle" fill="#C084FC" fillOpacity={0.7} fontSize={11} fontFamily="ui-monospace, monospace" fontWeight={700}>Reliability Check</text>
                  <text x={655} y={138} textAnchor="middle" fill="#C084FC" fillOpacity={0.45} fontSize={10} fontFamily="ui-monospace, monospace">Krippendorff α</text>
                  <text x={655} y={155} textAnchor="middle" fill="#C084FC" fillOpacity={0.35} fontSize={9} fontFamily="ui-monospace, monospace">target: α ≥ 0.80</text>

                  {/* Edges */}
                  <path d="M300,95 C340,95 360,120 380,125" stroke="#F5C542" strokeOpacity={0.4} strokeWidth={1.5} fill="none" markerEnd="url(#arr-gold)" />
                  <path d="M300,215 C340,215 360,145 380,140" stroke="#34D399" strokeOpacity={0.4} strokeWidth={1.5} fill="none" markerEnd="url(#arr-teal)" />
                  <path d="M520,130 C540,130 555,130 570,130" stroke="#818CF8" strokeOpacity={0.4} strokeWidth={1.5} fill="none" markerEnd="url(#arr-indigo)" />

                  {/* Supporting models */}
                  <text x={630} y={195} textAnchor="middle" fill="white" fillOpacity={0.25} fontSize={9} fontFamily="ui-monospace, monospace">Supporting:</text>
                  {[
                    { label: "Sonnet 4.6", color: "#818CF8", x: 595, y: 210 },
                    { label: "Haiku 4.5", color: "#818CF8", x: 680, y: 210 },
                    { label: "GLM-5", color: "#34D399", x: 638, y: 238 },
                  ].map((m) => (
                    <g key={m.label}>
                      <rect x={m.x - 38} y={m.y - 10} width={76} height={22} rx={4} fill="#0C1220" stroke={m.color} strokeWidth={0.5} strokeOpacity={0.3} />
                      <text x={m.x} y={m.y + 5} textAnchor="middle" fill={m.color} fillOpacity={0.5} fontSize={8} fontFamily="ui-monospace, monospace">{m.label}</text>
                    </g>
                  ))}
                  <text x={638} y={268} textAnchor="middle" fill="white" fillOpacity={0.2} fontSize={8} fontFamily="ui-monospace, monospace">Judge · Guardrail · Planner</text>
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
                  <rect x={20} y={105} width={150} height={32} rx={6} fill="#0C1220" stroke="#4ECDC4" strokeWidth={0.6} strokeOpacity={0.2} />
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
