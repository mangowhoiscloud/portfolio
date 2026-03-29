"use client";

import { ScrollReveal } from "../scroll-reveal";

/* ── 3 entry points ── */
const entries = [
  {
    id: "repl",
    label: "REPL",
    sub: "Interactive CLI",
    color: "#4ECDC4",
    desc: "Typer 기반 대화형 CLI. 슬래시 명령은 COMMAND_MAP 결정론적 디스패치, 자유 텍스트는 AgenticLoop로 직행. Rich Live Display가 파이프라인 진행을 실시간 렌더링.",
    details: ["Typer + Rich Live", "17 Tools × 5 Category", "NL Router 자연어→CLI"],
  },
  {
    id: "headless",
    label: "Headless",
    sub: "geode serve",
    color: "#818CF8",
    desc: "REPL 없이 데몬 모드 실행. ChannelManager가 Slack/Discord/Telegram 폴러와 Webhook을 동시 가동. hitl_level=0 자율 실행.",
    details: ["ChannelBinding 라우팅", "FastMCP 6 Tools", "Webhook :8765"],
  },
  {
    id: "scheduler",
    label: "Scheduler",
    sub: "AT / EVERY / CRON",
    color: "#F5C542",
    desc: "시간/간격/크론 기반 자동 실행. action_queue에 잡을 투입하고 IsolatedRunner가 데몬 쓰레드에서 크래시 격리 실행.",
    details: ["NL Schedule Parser", "Active Hours (TZ)", "IsolatedRunner 격리"],
  },
];

export function GatewaySection() {
  return (
    <section className="relative py-28 sm:py-32 px-4 sm:px-6">
      <div className="relative z-10 max-w-5xl mx-auto">
        <ScrollReveal>
          <p className="text-sm font-mono font-bold text-[#4ECDC4]/60 uppercase tracking-[0.25em] mb-3">
            Gateway
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white/90 mb-3">
            3 Entry Points, 1 Core
          </h2>
          <p className="text-sm sm:text-base text-[#8B9CC0] max-w-xl mb-8 leading-relaxed">
            대화형 REPL, 데몬 모드 Headless, 시간 기반 Scheduler.
            세 진입점 모두 <code className="text-[#818CF8]/70">bootstrap_geode()</code>로 초기화하고
            <code className="text-[#4ECDC4]/70 ml-1">AgenticLoop.run()</code>으로 수렴합니다.
          </p>
        </ScrollReveal>

        {/* ── Convergence SVG ── */}
        <ScrollReveal delay={0.05}>
          <div className="overflow-x-auto -mx-4 px-4 pb-2 mb-10">
            <svg viewBox="0 0 760 150" className="w-full min-w-[560px]" style={{ maxHeight: 180 }}>
              {[
                { label: "REPL", y: 15, color: "#4ECDC4" },
                { label: "Headless", y: 60, color: "#818CF8" },
                { label: "Scheduler", y: 105, color: "#F5C542" },
              ].map((s) => (
                <g key={s.label}>
                  <rect x={20} y={s.y} width={90} height={32} rx={8}
                    fill="#0A0F1A" stroke={s.color} strokeWidth={0.8} strokeOpacity={0.4} />
                  <text x={65} y={s.y + 20} textAnchor="middle" fill={s.color}
                    fontSize={10} fontFamily="ui-monospace, monospace" fontWeight={700}>
                    {s.label}
                  </text>
                  <path d={`M110,${s.y + 16} C140,${s.y + 16} 160,76 185,76`}
                    stroke={s.color} strokeOpacity={0.3} strokeWidth={1} fill="none" />
                </g>
              ))}

              <rect x={185} y={46} width={130} height={60} rx={10}
                fill="#0C1220" stroke="#F4B8C8" strokeWidth={1} strokeOpacity={0.4} />
              <text x={250} y={70} textAnchor="middle" fill="#F4B8C8"
                fontSize={10} fontFamily="ui-monospace, monospace" fontWeight={700}>
                bootstrap_geode()
              </text>
              <text x={250} y={88} textAnchor="middle" fill="#F4B8C8" fillOpacity={0.4}
                fontSize={8} fontFamily="ui-monospace, monospace">
                env + domain + MCP + skills
              </text>

              <path d="M315,76 C335,76 345,76 365,76" stroke="white" strokeOpacity={0.25} strokeWidth={1.2} fill="none" />
              <text x={340} y={68} textAnchor="middle" fill="white" fillOpacity={0.3} fontSize={12}>→</text>

              <rect x={365} y={41} width={140} height={70} rx={10}
                fill="#0C1220" stroke="#4ECDC4" strokeWidth={1.2} strokeOpacity={0.5} />
              <text x={435} y={68} textAnchor="middle" fill="#4ECDC4"
                fontSize={11} fontFamily="ui-monospace, monospace" fontWeight={700}>
                AgenticLoop
              </text>
              <text x={435} y={86} textAnchor="middle" fill="#4ECDC4" fillOpacity={0.4}
                fontSize={8} fontFamily="ui-monospace, monospace">
                while(tool_use) 50R
              </text>
              <text x={435} y={100} textAnchor="middle" fill="#4ECDC4" fillOpacity={0.3}
                fontSize={7} fontFamily="ui-monospace, monospace">
                5 termination paths
              </text>

              <path d="M505,76 C525,76 535,76 555,76" stroke="white" strokeOpacity={0.25} strokeWidth={1.2} fill="none" />
              <text x={530} y={68} textAnchor="middle" fill="white" fillOpacity={0.3} fontSize={12}>→</text>

              <rect x={555} y={46} width={120} height={60} rx={10}
                fill="#0C1220" stroke="#C084FC" strokeWidth={0.8} strokeOpacity={0.35} />
              <text x={615} y={70} textAnchor="middle" fill="#C084FC"
                fontSize={10} fontFamily="ui-monospace, monospace" fontWeight={600}>
                52 Tools + MCP
              </text>
              <text x={615} y={88} textAnchor="middle" fill="#C084FC" fillOpacity={0.4}
                fontSize={8} fontFamily="ui-monospace, monospace">
                LangGraph Pipeline
              </text>

              <text x={380} y={12} textAnchor="middle" fill="white" fillOpacity={0.25}
                fontSize={9} fontFamily="ui-monospace, monospace" letterSpacing="0.1em">
                ENTRY → BOOTSTRAP → LOOP → EXECUTE
              </text>
            </svg>
          </div>
        </ScrollReveal>

        {/* ── Entry point cards ── */}
        <ScrollReveal delay={0.1}>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {entries.map((e) => (
              <div
                key={e.id}
                className="rounded-xl border px-5 py-5"
                style={{
                  borderColor: `${e.color}15`,
                  background: `linear-gradient(160deg, ${e.color}06, transparent 70%)`,
                }}
              >
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-base font-mono font-bold" style={{ color: e.color }}>{e.label}</span>
                  <span className="text-[10px] font-mono text-white/30">{e.sub}</span>
                </div>
                <p className="text-xs text-[#8B9CC0] leading-relaxed mb-3">{e.desc}</p>
                <div className="space-y-1">
                  {e.details.map((d) => (
                    <div key={d} className="flex items-center gap-2">
                      <div className="w-1 h-1 rounded-full" style={{ background: e.color, opacity: 0.5 }} />
                      <span className="text-[11px] font-mono text-white/40">{d}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
