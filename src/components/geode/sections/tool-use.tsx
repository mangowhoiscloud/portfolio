"use client";

import { useState } from "react";
import { ScrollReveal } from "../scroll-reveal";
import { TabBar } from "../ui/tab-bar";

/* ── 5-Route Dispatch ── */
const routes = [
  { id: "bash",   label: "Bash",  count: "38 safe prefixes", color: "#E87080", desc: "PolicyChain 3-layer 방어. safe prefix(cat, ls, git...)는 자동 실행, 위험 패턴(rm -rf /, sudo)은 차단, 나머지는 HITL 승인." },
  { id: "native", label: "Tool",  count: "52 native",        color: "#4ECDC4", desc: "definitions.json에 등록된 52개 도구. 12개 카테고리(Analysis, Memory, Planning 등). ToolExecutor가 handler dict에서 디스패치." },
  { id: "mcp",    label: "MCP",   count: "44 catalog",       color: "#818CF8", desc: "MCPServerManager auto-discovery. Anthropic format 자동 정규화. steam/arxiv/linkedin은 사전 승인, 나머지는 서버별 1회 승인." },
  { id: "skill",  label: "Skill", count: "3-tier disclosure", color: "#C084FC", desc: "Progressive Disclosure: T1 메타데이터(system prompt) → T2 본문(lazy load) → T3 context:fork(격리 서브에이전트). 4 scope 우선순위." },
  { id: "dag",    label: "DAG",   count: "13-node pipeline",  color: "#F5C542", desc: "analyze_ip 호출 시 LangGraph StateGraph 13노드 파이프라인 실행. Router → Analyst×4(Send API) → Evaluator×3 → Scoring → Synthesizer." },
];

/* ── 5-Tier Safety ── */
const tiers = [
  { tier: "T0", name: "SAFE",      count: 13, color: "#34D399", gate: "없음",         exec: "asyncio.gather 즉시 병렬", examples: "list_ips, search_ips, memory_search, web_fetch" },
  { tier: "T1", name: "STANDARD",  count: 25, color: "#60A5FA", gate: "없음",         exec: "자동 실행. 서브에이전트 위임 가능", examples: "schedule_job, delegate_task, create_plan" },
  { tier: "T2", name: "WRITE",     count: 10, color: "#F5C542", gate: "HITL 승인",    exec: "영속 상태 변경. 명시적 확인 필요", examples: "memory_save, set_api_key, profile_update" },
  { tier: "T3", name: "EXPENSIVE", count: 3,  color: "#F4B8C8", gate: "비용 확인",    exec: "실행 전 비용 표시. Always 가능", examples: "analyze_ip($1.50), batch($5.00), compare($3.00)" },
  { tier: "T4", name: "DANGEROUS", count: 1,  color: "#E87080", gate: "패턴+HITL",    exec: "safe prefix만 자동. 나머지 항상 승인", examples: "run_bash" },
];

/* ── Tool Categories ── */
const categories = [
  { name: "Analysis",     count: 8, color: "#4ECDC4" },
  { name: "External",     count: 7, color: "#F5C542" },
  { name: "Planning",     count: 6, color: "#818CF8" },
  { name: "Discovery",    count: 5, color: "#60A5FA" },
  { name: "Memory",       count: 5, color: "#F4B8C8" },
  { name: "Model",        count: 5, color: "#C084FC" },
  { name: "Task",         count: 5, color: "#34D399" },
  { name: "Profile",      count: 4, color: "#E87080" },
  { name: "Calendar",     count: 3, color: "#F5C542" },
  { name: "Scheduling",   count: 2, color: "#818CF8" },
  { name: "Notification", count: 1, color: "#60A5FA" },
  { name: "Data",         count: 1, color: "#4ECDC4" },
];

type Tab = "routes" | "safety" | "inventory";

export function ToolUseSection() {
  const [activeTab, setActiveTab] = useState<Tab>("routes");
  const [activeRoute, setActiveRoute] = useState(0);

  return (
    <section className="relative py-28 sm:py-32 px-4 sm:px-6">
      <div className="relative z-10 max-w-5xl mx-auto">
        <ScrollReveal>
          <p className="text-sm font-mono font-bold text-[#4ECDC4]/60 uppercase tracking-[0.25em] mb-3">
            Tool Use
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white/90 mb-3">
            5-Route Dispatch + 5-Tier Safety
          </h2>
          <p className="text-sm sm:text-base text-[#A0B4D4] max-w-xl mb-8 leading-relaxed">
            LLM이 <code className="text-[#4ECDC4]/70">tool_use</code>를 반환하면
            ToolExecutor가 5개 경로(Bash, Native, MCP, Skill, DAG)로 디스패치합니다.
            6-Layer PolicyChain이 모든 호출을 게이트하고,
            5-Tier 안전 분류가 병렬/순차 실행을 결정합니다.
          </p>
        </ScrollReveal>

        {/* ── Dispatch Flow SVG ── */}
        <ScrollReveal delay={0.05}>
          <div className="overflow-x-auto -mx-4 px-4 pb-2 mb-8">
            <svg viewBox="0 0 800 200" className="w-full min-w-[640px]" style={{ maxHeight: 230 }}>
              {/* LLM box */}
              <rect x={15} y={65} width={90} height={70} rx={10}
                fill="#0C1220" stroke="#818CF8" strokeWidth={1.2} strokeOpacity={0.5} />
              <text x={60} y={90} textAnchor="middle" fill="#818CF8"
                fontSize={10} fontFamily="ui-monospace, monospace" fontWeight={700}>LLM</text>
              <text x={60} y={107} textAnchor="middle" fill="#818CF8" fillOpacity={0.4}
                fontSize={8} fontFamily="ui-monospace, monospace">tool_use block</text>
              <text x={60} y={122} textAnchor="middle" fill="#818CF8" fillOpacity={0.3}
                fontSize={7} fontFamily="ui-monospace, monospace">name + input</text>

              {/* Arrow → ToolExecutor */}
              <path d="M105,100 C120,100 130,100 145,100" stroke="white" strokeOpacity={0.2} strokeWidth={1} fill="none" />

              {/* ToolExecutor */}
              <rect x={145} y={55} width={120} height={90} rx={10}
                fill="#0C1220" stroke="#F4B8C8" strokeWidth={1} strokeOpacity={0.45} />
              <text x={205} y={80} textAnchor="middle" fill="#F4B8C8"
                fontSize={9} fontFamily="ui-monospace, monospace" fontWeight={700}>ToolExecutor</text>
              <text x={205} y={96} textAnchor="middle" fill="#F4B8C8" fillOpacity={0.45}
                fontSize={7} fontFamily="ui-monospace, monospace">PolicyChain 6-Layer</text>
              <text x={205} y={110} textAnchor="middle" fill="#F4B8C8" fillOpacity={0.35}
                fontSize={7} fontFamily="ui-monospace, monospace">Safety Gate</text>
              <text x={205} y={124} textAnchor="middle" fill="#F4B8C8" fillOpacity={0.25}
                fontSize={7} fontFamily="ui-monospace, monospace">HITL Approval</text>

              {/* 5 route branches */}
              {routes.map((r, i) => {
                const y = 18 + i * 38;
                return (
                  <g key={r.id}>
                    <path d={`M265,100 C290,100 300,${y + 14} 320,${y + 14}`}
                      stroke={r.color} strokeOpacity={0.3} strokeWidth={1} fill="none" />
                    <rect x={320} y={y} width={90} height={28} rx={7}
                      fill="#0A0F1A" stroke={r.color} strokeWidth={0.8} strokeOpacity={activeRoute === i ? 0.6 : 0.3}
                      style={{ cursor: "pointer", transition: "stroke-opacity 0.3s" }}
                      onMouseEnter={() => setActiveRoute(i)} />
                    <text x={365} y={y + 17} textAnchor="middle" fill={r.color}
                      fillOpacity={activeRoute === i ? 1 : 0.6}
                      fontSize={9} fontFamily="ui-monospace, monospace" fontWeight={700}>{r.label}</text>
                  </g>
                );
              })}

              {/* Converge arrows → Result */}
              {routes.map((r, i) => {
                const y = 18 + i * 38;
                return (
                  <path key={`arr-${r.id}`} d={`M410,${y + 14} C430,${y + 14} 440,100 460,100`}
                    stroke={r.color} strokeOpacity={0.2} strokeWidth={0.8} fill="none" />
                );
              })}

              {/* Result box */}
              <rect x={460} y={65} width={110} height={70} rx={10}
                fill="#0C1220" stroke="#34D399" strokeWidth={1} strokeOpacity={0.4} />
              <text x={515} y={90} textAnchor="middle" fill="#34D399"
                fontSize={9} fontFamily="ui-monospace, monospace" fontWeight={700}>tool_result</text>
              <text x={515} y={107} textAnchor="middle" fill="#34D399" fillOpacity={0.4}
                fontSize={7} fontFamily="ui-monospace, monospace">JSON serialize</text>
              <text x={515} y={122} textAnchor="middle" fill="#34D399" fillOpacity={0.3}
                fontSize={7} fontFamily="ui-monospace, monospace">token guard</text>

              {/* Arrow → back to LLM */}
              <path d="M570,100 C590,100 600,100 620,100" stroke="white" strokeOpacity={0.2} strokeWidth={1} fill="none" />

              {/* Continue box */}
              <rect x={620} y={70} width={100} height={60} rx={10}
                fill="#0C1220" stroke="#818CF8" strokeWidth={0.8} strokeOpacity={0.35} />
              <text x={670} y={93} textAnchor="middle" fill="#818CF8"
                fontSize={9} fontFamily="ui-monospace, monospace" fontWeight={600}>LLM</text>
              <text x={670} y={110} textAnchor="middle" fill="#818CF8" fillOpacity={0.4}
                fontSize={7} fontFamily="ui-monospace, monospace">continue loop</text>

              {/* Loopback arrow */}
              <path d="M670,130 C670,170 60,170 60,135" fill="none"
                stroke="#4ECDC4" strokeOpacity={0.15} strokeWidth={1} strokeDasharray="4 3" />
              <text x={370} y={185} textAnchor="middle" fill="#4ECDC4" fillOpacity={0.3}
                fontSize={7} fontFamily="ui-monospace, monospace">while(tool_use) → next round</text>

              {/* Top label */}
              <text x={400} y={10} textAnchor="middle" fill="white" fillOpacity={0.2}
                fontSize={8} fontFamily="ui-monospace, monospace" letterSpacing="0.1em">
                LLM → EXECUTOR → 5 ROUTES → RESULT → LLM (LOOP)
              </text>
            </svg>
          </div>
        </ScrollReveal>

        {/* ── Tab bar ── */}
        <ScrollReveal delay={0.08}>
          <TabBar
            variant="underline"
            tabs={[
              { id: "routes", label: "5-Route Dispatch", color: "#4ECDC4" },
              { id: "safety", label: "5-Tier Safety", color: "#E87080" },
              { id: "inventory", label: "52 Tools Inventory", color: "#818CF8" },
            ]}
            activeId={activeTab}
            onSelect={(id) => setActiveTab(id as Tab)}
          />
        </ScrollReveal>

        <ScrollReveal delay={0.1}>
          {/* ── 5-Route Dispatch ── */}
          {activeTab === "routes" && (
            <div className="space-y-2">
              {routes.map((r, i) => (
                <div key={r.id}
                  className="flex items-start gap-4 px-4 py-3 rounded-lg border transition-all duration-200"
                  style={{
                    borderColor: activeRoute === i ? `${r.color}20` : "rgba(255,255,255,0.04)",
                    background: activeRoute === i ? `${r.color}05` : `${r.color}02`,
                  }}
                  onMouseEnter={() => setActiveRoute(i)}
                >
                  <div className="shrink-0 w-16 text-center">
                    <div className="text-sm font-mono font-bold" style={{ color: r.color }}>{r.label}</div>
                    <div className="text-[9px] font-mono text-white/25 mt-0.5">{r.count}</div>
                  </div>
                  <p className="text-sm text-[#A0B4D4] leading-relaxed">{r.desc}</p>
                </div>
              ))}
            </div>
          )}

          {/* ── 5-Tier Safety ── */}
          {activeTab === "safety" && (
            <div>
              {/* Tier spectrum bar */}
              <div className="flex gap-1 mb-6 rounded-lg overflow-hidden">
                {tiers.map((t) => (
                  <div key={t.tier} className="flex-1 py-2 text-center" style={{ background: `${t.color}12` }}>
                    <div className="text-[10px] font-mono font-bold" style={{ color: t.color }}>{t.tier}</div>
                    <div className="text-[9px] font-mono text-white/30">{t.count}</div>
                  </div>
                ))}
              </div>

              <div className="space-y-2">
                {tiers.map((t) => (
                  <div key={t.tier} className="rounded-lg border border-white/[0.04] px-4 py-3" style={{ background: `${t.color}03` }}>
                    <div className="flex items-center gap-3 mb-1.5">
                      <span className="text-sm font-mono font-bold" style={{ color: t.color }}>{t.tier} {t.name}</span>
                      <span className="text-[10px] font-mono text-white/30">{t.count} tools</span>
                      <span className="ml-auto px-2 py-0.5 rounded text-[10px] font-mono"
                        style={{ color: t.color, background: `${t.color}10` }}>{t.gate}</span>
                    </div>
                    <p className="text-xs text-[#A0B4D4] mb-1">{t.exec}</p>
                    <code className="text-[10px] font-mono text-white/20">{t.examples}</code>
                  </div>
                ))}
              </div>

              {/* Approval mechanism */}
              <div className="mt-4 rounded-lg border border-white/[0.04] px-4 py-3">
                <div className="text-xs font-semibold text-white/50 mb-2">Session-Level Always Approval</div>
                <p className="text-xs text-[#9BB0CC]">
                  승인 프롬프트에서 <code className="text-[#4ECDC4]/50">A</code>(Always) 응답 시
                  해당 카테고리(bash, write, cost, mcp:서버명) 전체가 세션 내 자동 승인.
                </p>
              </div>
            </div>
          )}

          {/* ── 52 Tools Inventory ── */}
          {activeTab === "inventory" && (
            <div>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 mb-4">
                {categories.map((c) => (
                  <div key={c.name} className="rounded-lg border border-white/[0.04] px-3 py-2.5 text-center"
                    style={{ background: `${c.color}04` }}>
                    <div className="text-lg font-bold" style={{ color: c.color }}>{c.count}</div>
                    <div className="text-[10px] font-mono text-white/40">{c.name}</div>
                  </div>
                ))}
              </div>

              {/* MCP + total summary */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="rounded-lg border border-white/[0.04] px-4 py-3" style={{ background: "#4ECDC404" }}>
                  <div className="text-2xl font-bold text-[#4ECDC4]">52</div>
                  <div className="text-[10px] font-mono text-white/30">Native Tools</div>
                  <div className="text-[9px] font-mono text-white/15 mt-1">12 categories</div>
                </div>
                <div className="rounded-lg border border-white/[0.04] px-4 py-3" style={{ background: "#818CF804" }}>
                  <div className="text-2xl font-bold text-[#818CF8]">44</div>
                  <div className="text-[10px] font-mono text-white/30">MCP Servers</div>
                  <div className="text-[9px] font-mono text-white/15 mt-1">3 auto-approved</div>
                </div>
                <div className="rounded-lg border border-white/[0.04] px-4 py-3" style={{ background: "#C084FC04" }}>
                  <div className="text-2xl font-bold text-[#C084FC]">96+</div>
                  <div className="text-[10px] font-mono text-white/30">Total Toolset</div>
                  <div className="text-[9px] font-mono text-white/15 mt-1">native + MCP + skills</div>
                </div>
              </div>
            </div>
          )}
        </ScrollReveal>
      </div>
    </section>
  );
}
