"use client";

import { ScrollReveal, ScrollRevealGroup, revealChild } from "../scroll-reveal";
import { motion } from "framer-motion";
import { useLocale, t } from "../locale-context";

/* ── 4-Layer Architecture (v0.36.0) ── */
const layers = [
  {
    id: "Model",
    name: "Model",
    detail: "ClaudeAdapter · OpenAIAdapter · GLMAdapter, 3-Provider Failover, CircuitBreaker",
    color: "#818CF8",
    modules: "core/llm",
  },
  {
    id: "Runtime",
    name: "Runtime",
    detail: "ToolRegistry(52) + MCP(41) + Skills(Progressive Disclosure) + Memory(4-tier)",
    color: "#4ECDC4",
    modules: "core/tools, core/mcp, core/skills, core/memory",
  },
  {
    id: "Harness",
    name: "Harness",
    detail: "SessionLane → Lane(\"global\", max=8) → PolicyChain 6-Layer → IsolatedRunner",
    sub: "SessionMode(IPC / DAEMON / SCHEDULER) · _HEADLESS_DENIED_TOOLS",
    color: "#F5C542",
    modules: "core/orchestration, core/runtime_wiring",
  },
  {
    id: "Agent",
    name: "Agent",
    detail: "AgenticLoop(while tool_use) → SubAgentManager(depth=1, max=5)",
    sub: "thin CLI → serve → CLIPoller / Gateway / Scheduler",
    color: "#F4B8C8",
    modules: "core/agent, core/cli, core/gateway",
  },
];

export function ArchitectureSection() {
  const locale = useLocale();
  return (
    <section className="relative py-28 sm:py-32 px-4 sm:px-6">
      <div className="relative z-10 max-w-6xl mx-auto">
        <ScrollReveal>
          <div className="flex flex-col md:flex-row md:items-end md:gap-12 mb-6">
            <div>
              <p className="text-xs font-mono font-bold text-[#818CF8]/80 uppercase tracking-[0.2em] mb-2">Architecture</p>
              <h2 className="text-4xl sm:text-5xl font-black tracking-tight text-white/95">
                4-Layer Stack
              </h2>
            </div>
            <p className="text-sm text-[#A0B4D4] max-w-md leading-relaxed mt-3 md:mt-0 md:pb-1">
              {t(locale,
                "191개 모듈, 3,433+ 테스트. Model → Runtime → Harness → Agent 4계층.",
                "191 modules, 3,433+ tests. Four layers: Model → Runtime → Harness → Agent."
              )}
              <code className="text-[#818CF8]/70 ml-1">{t(locale,
                "GeodeRuntime.create_session(mode)로 부팅.",
                "Boots via GeodeRuntime.create_session(mode)."
              )}</code>
            </p>
          </div>
        </ScrollReveal>

        {/* ── 4-Layer vertical SVG ── */}
        <ScrollReveal delay={0.05}>
          <div className="overflow-x-auto -mx-4 px-4 pb-2 mb-6">
            <svg viewBox="0 0 800 280" className="w-full min-w-[640px]" style={{ maxHeight: 310 }}>
              {/* Bidirectional arrows between layers */}
              {[0, 1, 2].map((i) => {
                const y1 = 35 + i * 68;
                const y2 = y1 + 68;
                return (
                  <g key={`arrow-${i}`}>
                    <line x1={400} y1={y1 + 48} x2={400} y2={y2 + 4} stroke="white" strokeOpacity={0.12} strokeWidth={1} />
                    <text x={408} y={y1 + 62} fill="white" fillOpacity={0.2} fontSize={10}>↕</text>
                  </g>
                );
              })}

              {/* 4 layer bars */}
              {layers.map((layer, i) => {
                const y = 8 + i * 68;
                const barWidth = 700 - i * 30;
                const x = (800 - barWidth) / 2;
                return (
                  <g key={layer.id}>
                    <rect x={x} y={y} width={barWidth} height={48} rx={10}
                      fill="#0C1220" stroke={layer.color} strokeWidth={1} strokeOpacity={0.4} />
                    {/* Layer name */}
                    <text x={x + 20} y={y + 20} fill={layer.color}
                      fontSize={12} fontFamily="ui-monospace, monospace" fontWeight={800}>
                      {layer.name}
                    </text>
                    {/* Detail */}
                    <text x={x + 20} y={y + 36} fill={layer.color} fillOpacity={0.45}
                      fontSize={8} fontFamily="ui-monospace, monospace">
                      {layer.detail.length > 85 ? layer.detail.slice(0, 82) + "..." : layer.detail}
                    </text>
                    {/* Sub detail (right-aligned) */}
                    {layer.sub && (
                      <text x={x + barWidth - 15} y={y + 20} textAnchor="end" fill={layer.color} fillOpacity={0.3}
                        fontSize={7} fontFamily="ui-monospace, monospace">
                        {layer.sub}
                      </text>
                    )}
                  </g>
                );
              })}

              {/* HookSystem cross-cutting bar (right side) */}
              <rect x={760} y={8} width={28} height={268} rx={6}
                fill="none" stroke="#4ECDC4" strokeWidth={0.8} strokeOpacity={0.2} strokeDasharray="4 3" />
              <text x={774} y={145} textAnchor="middle" fill="#4ECDC4" fillOpacity={0.3}
                fontSize={7} fontFamily="ui-monospace, monospace"
                style={{ writingMode: "vertical-rl" } as React.CSSProperties}>
                HOOKS · 46 EVENTS
              </text>

              {/* DomainPort cross-cutting bar (left side) */}
              <rect x={12} y={76} width={28} height={200} rx={6}
                fill="none" stroke="#C084FC" strokeWidth={0.8} strokeOpacity={0.15} strokeDasharray="4 3" />
              <text x={26} y={178} textAnchor="middle" fill="#C084FC" fillOpacity={0.25}
                fontSize={7} fontFamily="ui-monospace, monospace"
                style={{ writingMode: "vertical-rl" } as React.CSSProperties}>
                DOMAIN PORT
              </text>
            </svg>
          </div>
        </ScrollReveal>

        {/* ── Layer detail cards ── */}
        <ScrollRevealGroup className="space-y-2" stagger={0.06}>
          {layers.map((layer) => (
            <motion.div
              key={layer.id}
              variants={revealChild}
              className="group relative flex items-start gap-4 px-5 py-4 rounded-xl border border-white/[0.05] cursor-default transition-all duration-300 hover:translate-x-1"
              style={{ background: `linear-gradient(90deg, ${layer.color}08, transparent 50%)` }}
            >
              <div
                className="shrink-0 w-16 text-center text-[11px] font-mono font-bold py-1.5 rounded"
                style={{ color: layer.color, background: `${layer.color}10` }}
              >
                {layer.id}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-semibold text-white/80 mb-0.5">{layer.detail}</div>
                {layer.sub && (
                  <div className="text-xs text-[#9BB0CC] mt-0.5">{layer.sub}</div>
                )}
              </div>
              <div className="text-[10px] font-mono text-white/15 hidden lg:block shrink-0">{layer.modules}</div>
            </motion.div>
          ))}
        </ScrollRevealGroup>

        {/* Cross-cutting concerns */}
        <ScrollReveal delay={0.4}>
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="flex items-center gap-3 px-4 py-3 rounded-xl border border-dashed border-[#4ECDC4]/15 bg-[#4ECDC4]/[0.02]">
              <span className="text-[#4ECDC4] text-base">⟂</span>
              <div>
                <span className="text-sm font-medium text-[#4ECDC4]/70">HookSystem</span>
                <span className="text-xs text-[#9BB0CC] ml-2">{t(locale, "46 events, 4계층 수직 관통", "46 events, cross-cuts all 4 layers")}</span>
              </div>
            </div>
            <div className="flex items-center gap-3 px-4 py-3 rounded-xl border border-dashed border-[#C084FC]/15 bg-[#C084FC]/[0.02]">
              <span className="text-[#C084FC] text-base">⟂</span>
              <div>
                <span className="text-sm font-medium text-[#C084FC]/70">DomainPort</span>
                <span className="text-xs text-[#9BB0CC] ml-2">{t(locale, "Protocol 직교. GameIP, REODE 교체 가능", "Orthogonal protocol. Swappable: GameIP, REODE")}</span>
              </div>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
