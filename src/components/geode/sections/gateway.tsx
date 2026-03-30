"use client";

import { ScrollReveal } from "../scroll-reveal";
import { SectionHeader } from "../ui/section-header";
import { useLocale, t } from "../locale-context";

/* ── 3 session modes (v0.37.0 thin-only architecture) ── */
const modes = [
  {
    id: "ipc",
    label: "CLI (IPC)",
    sub: "SessionMode.IPC",
    color: "#4ECDC4",
    descKo: "thin CLI가 Unix socket(~/.geode/cli.sock)으로 serve에 접속. serve가 미실행이면 자동 시작(pidfile lock, TOCTOU 방지). line-delimited JSON 프로토콜. hitl=0, WRITE 허용, DANGEROUS 차단.",
    descEn: "thin CLI connects to serve via Unix socket (~/.geode/cli.sock). Auto-starts serve if not running (pidfile lock, TOCTOU prevention). Line-delimited JSON protocol. hitl=0, WRITE allowed, DANGEROUS blocked.",
    detailsKo: ["IPCClient + CLIPoller", "auto-start serve", "chmod 0o600 보안"],
    detailsEn: ["IPCClient + CLIPoller", "auto-start serve", "chmod 0o600 security"],
  },
  {
    id: "daemon",
    label: "Daemon",
    sub: "SessionMode.DAEMON",
    color: "#818CF8",
    descKo: "Slack/Discord/Telegram 폴러가 외부 메시지를 수신. config.toml [gateway] pollers에서 동적 등록(_POLLER_REGISTRY). hitl=0, quiet 모드, DANGEROUS 차단.",
    descEn: "Slack/Discord/Telegram pollers receive external messages. Dynamically registered via config.toml [gateway] pollers (_POLLER_REGISTRY). hitl=0, quiet mode, DANGEROUS blocked.",
    detailsKo: ["Config-driven pollers", "ChannelBinding 라우팅", "SessionLane 동시성"],
    detailsEn: ["Config-driven pollers", "ChannelBinding routing", "SessionLane concurrency"],
  },
  {
    id: "scheduler",
    label: "Scheduler",
    sub: "SessionMode.SCHEDULER",
    color: "#F5C542",
    descKo: "serve 내부에서 SchedulerService가 AT/EVERY/CRON 잡을 실행. hitl=0, quiet, 300s 시간 제한. fcntl.flock으로 jobs.json 동시 접근 방지. stuck job 10분 탐지.",
    descEn: "SchedulerService runs AT/EVERY/CRON jobs inside serve. hitl=0, quiet, 300s time cap. fcntl.flock prevents concurrent jobs.json access. Stuck job detection at 10 min.",
    detailsKo: ["serve 내장 데몬", "300s time cap", "fcntl.flock 잡 잠금"],
    detailsEn: ["Built-in serve daemon", "300s time cap", "fcntl.flock job locking"],
  },
];

export function GatewaySection() {
  const locale = useLocale();
  return (
    <section className="relative py-28 sm:py-32 px-4 sm:px-6">
      <div className="relative z-10 max-w-5xl mx-auto">
        <SectionHeader
          variant="side"
          label="Gateway"
          labelColor="#4ECDC4"
          title="Unified Daemon"
          description={t(locale,
            "REPL과 serve가 각각 HookSystem, Scheduler를 독자적으로 생성하여 이벤트 미수신, jobs.json 경합, 스케줄러의 터미널 침범이 발생했습니다. GeodeRuntime이 모든 상태를 단일 소유하도록 전환하고, CLI는 IPC thin client로 변경했습니다.",
            "REPL and serve each created their own HookSystem and Scheduler, causing missed events, jobs.json contention, and scheduler terminal invasion. Resolved by having GeodeRuntime own all state, with CLI becoming an IPC thin client."
          )}
        />

        {/* ── Thin-only architecture SVG ── */}
        <ScrollReveal delay={0.05}>
          <div className="overflow-x-auto -mx-4 px-4 pb-2 mb-10">
            <svg viewBox="0 0 800 180" className="w-full min-w-[640px]" style={{ maxHeight: 210 }}>
              {/* thin CLI */}
              <rect x={15} y={20} width={100} height={40} rx={8}
                fill="#0A0F1A" stroke="#4ECDC4" strokeWidth={0.8} strokeOpacity={0.4} />
              <text x={65} y={37} textAnchor="middle" fill="#4ECDC4"
                fontSize={9} fontFamily="ui-monospace, monospace" fontWeight={700}>geode (thin)</text>
              <text x={65} y={51} textAnchor="middle" fill="#4ECDC4" fillOpacity={0.4}
                fontSize={7} fontFamily="ui-monospace, monospace">IPCClient</text>

              {/* Unix socket arrow */}
              <path d="M115,40 C140,40 155,40 175,40" stroke="#4ECDC4" strokeOpacity={0.3} strokeWidth={1} strokeDasharray="4 3" fill="none" />
              <text x={145} y={32} textAnchor="middle" fill="#4ECDC4" fillOpacity={0.3}
                fontSize={6} fontFamily="ui-monospace, monospace">cli.sock</text>

              {/* geode serve (large central box) */}
              <rect x={175} y={10} width={420} height={155} rx={12}
                fill="#0C1220" stroke="#F4B8C8" strokeWidth={1} strokeOpacity={0.3} />
              <text x={385} y={28} textAnchor="middle" fill="#F4B8C8"
                fontSize={10} fontFamily="ui-monospace, monospace" fontWeight={700}>
                geode serve (GeodeRuntime)
              </text>

              {/* Inside serve: SharedServices */}
              <rect x={190} y={38} width={150} height={55} rx={8}
                fill="#0A0F1A" stroke="#818CF8" strokeWidth={0.6} strokeOpacity={0.25} />
              <text x={265} y={55} textAnchor="middle" fill="#818CF8" fillOpacity={0.7}
                fontSize={8} fontFamily="ui-monospace, monospace" fontWeight={600}>SharedServices</text>
              <text x={265} y={70} textAnchor="middle" fill="#818CF8" fillOpacity={0.35}
                fontSize={6.5} fontFamily="ui-monospace, monospace">ONE Hook + MCP + Skills</text>
              <text x={265} y={82} textAnchor="middle" fill="#818CF8" fillOpacity={0.25}
                fontSize={6.5} fontFamily="ui-monospace, monospace">create_session(mode)</text>

              {/* Inside serve: SessionLane + Lane */}
              <rect x={355} y={38} width={115} height={55} rx={8}
                fill="#0A0F1A" stroke="#F5C542" strokeWidth={0.6} strokeOpacity={0.25} />
              <text x={412} y={55} textAnchor="middle" fill="#F5C542" fillOpacity={0.7}
                fontSize={8} fontFamily="ui-monospace, monospace" fontWeight={600}>SessionLane</text>
              <text x={412} y={70} textAnchor="middle" fill="#F5C542" fillOpacity={0.35}
                fontSize={6.5} fontFamily="ui-monospace, monospace">per-key Sem(1)</text>
              <text x={412} y={82} textAnchor="middle" fill="#F5C542" fillOpacity={0.25}
                fontSize={6.5} fontFamily="ui-monospace, monospace">Lane(global, 8)</text>

              {/* Inside serve: AgenticLoop */}
              <rect x={485} y={38} width={95} height={55} rx={8}
                fill="#0A0F1A" stroke="#4ECDC4" strokeWidth={0.6} strokeOpacity={0.25} />
              <text x={532} y={55} textAnchor="middle" fill="#4ECDC4" fillOpacity={0.7}
                fontSize={8} fontFamily="ui-monospace, monospace" fontWeight={600}>AgenticLoop</text>
              <text x={532} y={70} textAnchor="middle" fill="#4ECDC4" fillOpacity={0.35}
                fontSize={6.5} fontFamily="ui-monospace, monospace">while(tool_use)</text>
              <text x={532} y={82} textAnchor="middle" fill="#4ECDC4" fillOpacity={0.25}
                fontSize={6.5} fontFamily="ui-monospace, monospace">time_budget_s</text>

              {/* 3 pollers inside serve */}
              {[
                { label: "CLIPoller", y: 105, color: "#4ECDC4", mode: "IPC" },
                { label: "Gateway", y: 125, color: "#818CF8", mode: "DAEMON" },
                { label: "Scheduler", y: 145, color: "#F5C542", mode: "SCHEDULER" },
              ].map((p) => (
                <g key={p.label}>
                  <rect x={200} y={p.y} width={80} height={18} rx={5}
                    fill="#0A0F1A" stroke={p.color} strokeWidth={0.5} strokeOpacity={0.3} />
                  <text x={240} y={p.y + 12} textAnchor="middle" fill={p.color} fillOpacity={0.6}
                    fontSize={7} fontFamily="ui-monospace, monospace" fontWeight={600}>{p.label}</text>
                  <text x={295} y={p.y + 12} fill={p.color} fillOpacity={0.3}
                    fontSize={6} fontFamily="ui-monospace, monospace">{p.mode}</text>
                  {/* Arrow to SessionLane */}
                  <path d={`M340,${p.y + 9} L355,${p.y + 9}`} stroke={p.color} strokeOpacity={0.2} strokeWidth={0.8} />
                </g>
              ))}

              {/* Arrows: SessionLane → AgenticLoop */}
              <path d="M470,65 L485,65" stroke="white" strokeOpacity={0.15} strokeWidth={0.8} />

              {/* External connections (left side) */}
              <rect x={15} y={70} width={100} height={30} rx={7}
                fill="#0A0F1A" stroke="#818CF8" strokeWidth={0.6} strokeOpacity={0.3} />
              <text x={65} y={88} textAnchor="middle" fill="#818CF8" fillOpacity={0.5}
                fontSize={8} fontFamily="ui-monospace, monospace">Slack / Discord</text>
              <path d="M115,85 C145,85 155,130 175,130" stroke="#818CF8" strokeOpacity={0.2} strokeWidth={0.8} fill="none" />

              <rect x={15} y={115} width={100} height={30} rx={7}
                fill="#0A0F1A" stroke="#F5C542" strokeWidth={0.6} strokeOpacity={0.3} />
              <text x={65} y={133} textAnchor="middle" fill="#F5C542" fillOpacity={0.5}
                fontSize={8} fontFamily="ui-monospace, monospace">Cron / AT / EVERY</text>
              <path d="M115,130 C145,130 155,148 175,148" stroke="#F5C542" strokeOpacity={0.2} strokeWidth={0.8} fill="none" />

              {/* Top label */}
              <text x={400} y={6} textAnchor="middle" fill="white" fillOpacity={0.2}
                fontSize={7} fontFamily="ui-monospace, monospace" letterSpacing="0.08em">
                ALL PATHS: acquire_all(key, [&quot;session&quot;, &quot;global&quot;]) → create_session(mode) → AgenticLoop
              </text>

              {/* Result output */}
              <rect x={620} y={45} width={95} height={40} rx={8}
                fill="#0A0F1A" stroke="#34D399" strokeWidth={0.6} strokeOpacity={0.3} />
              <text x={667} y={62} textAnchor="middle" fill="#34D399" fillOpacity={0.6}
                fontSize={8} fontFamily="ui-monospace, monospace" fontWeight={600}>Result</text>
              <text x={667} y={76} textAnchor="middle" fill="#34D399" fillOpacity={0.3}
                fontSize={6.5} fontFamily="ui-monospace, monospace">→ channel</text>
              <path d="M580,65 L620,65" stroke="white" strokeOpacity={0.15} strokeWidth={0.8} />
            </svg>
          </div>
        </ScrollReveal>

        {/* ── Session mode cards ── */}
        <ScrollReveal delay={0.1}>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {modes.map((m) => (
              <div
                key={m.id}
                className="rounded-xl border px-5 py-5"
                style={{
                  borderColor: `${m.color}15`,
                  background: `linear-gradient(160deg, ${m.color}06, transparent 70%)`,
                }}
              >
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-base font-mono font-bold" style={{ color: m.color }}>{m.label}</span>
                  <span className="text-[9px] font-mono text-white/25">{m.sub}</span>
                </div>
                <p className="text-xs text-[#A0B4D4] leading-relaxed mb-3">{locale === "en" ? m.descEn : m.descKo}</p>
                <div className="space-y-1">
                  {(locale === "en" ? m.detailsEn : m.detailsKo).map((d) => (
                    <div key={d} className="flex items-center gap-2">
                      <div className="w-1 h-1 rounded-full" style={{ background: m.color, opacity: 0.5 }} />
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
