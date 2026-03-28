"use client";

import { useState } from "react";
import { ScrollReveal } from "../scroll-reveal";

type Mode = "react" | "plan";

export function ReasoningSection() {
  const [mode, setMode] = useState<Mode>("react");

  return (
    <section className="relative py-28 sm:py-32 px-4 sm:px-6">
      <div className="relative z-10 max-w-5xl mx-auto">
        <ScrollReveal>
          <p className="text-sm font-mono font-bold text-[#818CF8]/60 uppercase tracking-[0.25em] mb-3">
            Reasoning
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white/90 mb-2">
            ReAct · Plan-and-Execute
          </h2>
          <p className="text-sm sm:text-base text-[#8B9CC0] max-w-xl mb-8 leading-relaxed">
            안쪽 루프(L1-L2)는 ReAct로 매 턴마다 관측→추론→행동을 반복하고,
            바깥 레이어(L4)는 Plan-and-Execute로 복잡한 요청을 구조화된 계획으로 분할합니다.
            v0.32부터 복잡한 요청(3+ 단계, 고비용)은 자동으로 create_plan을 호출하는 Plan-first 패턴을 채택했습니다.
          </p>
        </ScrollReveal>

        {/* Mode toggle */}
        <ScrollReveal delay={0.05}>
          <div className="flex gap-2 mb-8">
            <button
              onClick={() => setMode("react")}
              className="px-4 py-2 rounded-lg text-xs font-mono font-bold transition-all duration-300"
              style={{
                color: mode === "react" ? "#4ECDC4" : "#5A6A8A",
                background: mode === "react" ? "rgba(78,205,196,0.08)" : "transparent",
                border: `1px solid ${mode === "react" ? "rgba(78,205,196,0.2)" : "rgba(255,255,255,0.04)"}`,
              }}
            >
              ReAct Loop
              <span className="ml-2 text-[10px] opacity-50">L1-L2 Inner</span>
            </button>
            <button
              onClick={() => setMode("plan")}
              className="px-4 py-2 rounded-lg text-xs font-mono font-bold transition-all duration-300"
              style={{
                color: mode === "plan" ? "#F5C542" : "#5A6A8A",
                background: mode === "plan" ? "rgba(245,197,66,0.08)" : "transparent",
                border: `1px solid ${mode === "plan" ? "rgba(245,197,66,0.2)" : "rgba(255,255,255,0.04)"}`,
              }}
            >
              Plan-and-Execute
              <span className="ml-2 text-[10px] opacity-50">L4 Outer</span>
            </button>
          </div>
        </ScrollReveal>

        <ScrollReveal delay={0.1}>
          {/* ── ReAct ── */}
          {mode === "react" && (
            <div>
              <div className="overflow-x-auto -mx-4 px-4 pb-2 mb-6">
                <svg viewBox="0 0 700 220" className="w-full min-w-[520px]" style={{ maxHeight: 250 }}>
                  {/* OBSERVE */}
                  <rect x={40} y={60} width={130} height={60} rx={10} fill="#0A0F1A" stroke="#60A5FA" strokeWidth={1} strokeOpacity={0.4} />
                  <text x={105} y={83} textAnchor="middle" fill="#60A5FA" fontSize={12} fontFamily="ui-monospace, monospace" fontWeight={700}>OBSERVE</text>
                  <text x={105} y={100} textAnchor="middle" fill="#60A5FA" fillOpacity={0.35} fontSize={9} fontFamily="ui-monospace, monospace">LLM call + context</text>

                  <line x1={170} y1={90} x2={230} y2={90} stroke="white" strokeOpacity={0.22} strokeWidth={1} />

                  {/* ACT */}
                  <rect x={230} y={60} width={130} height={60} rx={10} fill="#0A0F1A" stroke="#4ECDC4" strokeWidth={1} strokeOpacity={0.4} />
                  <text x={295} y={83} textAnchor="middle" fill="#4ECDC4" fontSize={12} fontFamily="ui-monospace, monospace" fontWeight={700}>ACT</text>
                  <text x={295} y={100} textAnchor="middle" fill="#4ECDC4" fillOpacity={0.35} fontSize={9} fontFamily="ui-monospace, monospace">tool execution</text>

                  <line x1={360} y1={90} x2={420} y2={90} stroke="white" strokeOpacity={0.22} strokeWidth={1} />

                  {/* REFLECT */}
                  <rect x={420} y={60} width={130} height={60} rx={10} fill="#0A0F1A" stroke="#C084FC" strokeWidth={1} strokeOpacity={0.4} />
                  <text x={485} y={83} textAnchor="middle" fill="#C084FC" fontSize={12} fontFamily="ui-monospace, monospace" fontWeight={700}>REFLECT</text>
                  <text x={485} y={100} textAnchor="middle" fill="#C084FC" fillOpacity={0.35} fontSize={9} fontFamily="ui-monospace, monospace">result → context</text>

                  {/* Loop-back */}
                  <path d="M485,120 C485,165 295,175 105,165 C105,150 105,135 105,120" fill="none" stroke="#F5C542" strokeOpacity={0.28} strokeWidth={1.5} strokeDasharray="6 4" className="animate-flow" />
                  <text x={295} y={180} textAnchor="middle" fill="#F5C542" fillOpacity={0.35} fontSize={9} fontFamily="ui-monospace, monospace">while(tool_use), max 50 rounds</text>

                  {/* GoalDecomposer fork */}
                  <rect x={560} y={40} width={110} height={50} rx={8} fill="#0A0F1A" stroke="#F4B8C8" strokeWidth={0.7} strokeOpacity={0.2} />
                  <text x={615} y={60} textAnchor="middle" fill="#F4B8C8" fontSize={9} fontFamily="ui-monospace, monospace" fontWeight={600}>GoalDecomposer</text>
                  <text x={615} y={75} textAnchor="middle" fill="#F4B8C8" fillOpacity={0.45} fontSize={8} fontFamily="ui-monospace, monospace">복합 요청 분해</text>
                  <line x1={550} y1={65} x2={560} y2={65} stroke="#F4B8C8" strokeOpacity={0.22} strokeWidth={1} />

                  {/* Tool tiers */}
                  <text x={295} y={40} textAnchor="middle" fill="#4ECDC4" fillOpacity={0.30} fontSize={8} fontFamily="ui-monospace, monospace">
                    SAFE(auto) · STANDARD(auto) · WRITE(HITL) · DANGEROUS(gate)
                  </text>

                  {/* Error recovery */}
                  <text x={295} y={210} textAnchor="middle" fill="#E87080" fillOpacity={0.4} fontSize={8} fontFamily="ui-monospace, monospace">
                    consecutive failure ≥ 2 → adaptive recovery chain
                  </text>
                </svg>
              </div>
              <p className="text-sm text-[#8B9CC0] leading-relaxed">
                매 라운드마다 LLM이 관측(OBSERVE)하고, 도구를 선택·실행(ACT)하고, 결과를 컨텍스트에 반영(REFLECT)합니다.
                복합 요청이면 GoalDecomposer가 sub-goal로 분해하여 시스템 프롬프트에 주입합니다.
              </p>
            </div>
          )}

          {/* ── Plan-and-Execute (simplified, full detail in Orchestration/PlanMode tab) ── */}
          {mode === "plan" && (
            <div>
              <div className="overflow-x-auto -mx-4 px-4 pb-2 mb-6">
                <svg viewBox="0 0 700 130" className="w-full min-w-[500px]" style={{ maxHeight: 150 }}>
                  {/* Planner → 6 routes → PlanMode lifecycle */}
                  {[
                    { label: "Planner", x: 60, color: "#60A5FA", sub: "6 routes" },
                    { label: "CREATE", x: 180, color: "#818CF8", sub: "template" },
                    { label: "APPROVE", x: 310, color: "#F5C542", sub: "HITL gate" },
                    { label: "EXECUTE", x: 440, color: "#4ECDC4", sub: "TaskSystem" },
                    { label: "DONE", x: 560, color: "#34D399", sub: "scorecard" },
                  ].map((s, i) => (
                    <g key={s.label}>
                      <rect x={s.x - 50} y={30} width={100} height={50} rx={8} fill="#0A0F1A" stroke={s.color} strokeWidth={0.8} strokeOpacity={0.4} />
                      <text x={s.x} y={52} textAnchor="middle" fill={s.color} fontSize={11} fontFamily="ui-monospace, monospace" fontWeight={700}>{s.label}</text>
                      <text x={s.x} y={68} textAnchor="middle" fill={s.color} fillOpacity={0.35} fontSize={8} fontFamily="ui-monospace, monospace">{s.sub}</text>
                      {i < 4 && <line x1={s.x + 50} y1={55} x2={[180, 310, 440, 560][i] - 50} y2={55} stroke="white" strokeOpacity={0.1} strokeWidth={1} />}
                    </g>
                  ))}
                  {/* Templates */}
                  <text x={620} y={45} fill="#F5C542" fillOpacity={0.4} fontSize={9} fontFamily="ui-monospace, monospace">full $1.50</text>
                  <text x={620} y={60} fill="#818CF8" fillOpacity={0.4} fontSize={9} fontFamily="ui-monospace, monospace">prospect $0.80</text>
                  {/* REJECT */}
                  <path d="M310,80 C310,100 290,105 245,105 C200,105 180,100 180,80" fill="none" stroke="#E87080" strokeOpacity={0.15} strokeWidth={1} strokeDasharray="3 3" />
                  <text x={245} y={118} textAnchor="middle" fill="#E87080" fillOpacity={0.4} fontSize={8} fontFamily="ui-monospace, monospace">REJECTED → re-plan</text>
                </svg>
              </div>
              <p className="text-sm text-[#8B9CC0] leading-relaxed">
                Planner가 요청을 6개 Route로 분류하고, PlanMode가 DRAFT → APPROVE(HITL) → EXECUTE 생애주기를 관리합니다.
                REJECTED되면 CREATE로 복귀합니다. 상세 PlanMode 다이어그램은 Orchestration 섹션 참조.
                REJECTED되면 CREATE로 복귀하여 재계획합니다.
              </p>
            </div>
          )}
        </ScrollReveal>
      </div>
    </section>
  );
}
