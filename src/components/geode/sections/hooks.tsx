"use client";

import { useState } from "react";
import { ScrollReveal } from "../scroll-reveal";
import { useLocale, t } from "../locale-context";

/* ── Maturity Levels ── */
const levels = [
  {
    id: "L1", name: "OBSERVE", color: "#60A5FA",
    descKo: "기록만, 상태 변경 없음",
    descEn: "Logging only, no state mutation",
    handlers: [
      { name: "TaskGraphBridge", priority: "P30", eventsKo: "NODE_ENTER/EXIT/ERROR", eventsEn: "NODE_ENTER/EXIT/ERROR" },
      { name: "StuckDetector", priority: "P40", eventsKo: "PIPELINE_START/END/ERROR", eventsEn: "PIPELINE_START/END/ERROR" },
      { name: "RunLog", priority: "P50", eventsKo: "ALL 46 events → JSONL", eventsEn: "ALL 46 events → JSONL" },
      { name: "LLM Lifecycle", priority: "P55", eventsKo: "LLM_CALL_START/END", eventsEn: "LLM_CALL_START/END" },
      { name: "JournalHook", priority: "P60", eventsKo: "END/ERROR → runs.jsonl", eventsEn: "END/ERROR → runs.jsonl" },
      { name: "TableLoggers ×5", priority: "P90", eventsKo: "Automation events", eventsEn: "Automation events" },
    ],
    status: "complete",
  },
  {
    id: "L2", name: "REACT", color: "#4ECDC4",
    descKo: "이벤트에 자동 반응, 상태 변경",
    descEn: "Auto-react to events, mutate state",
    handlers: [
      { name: "drift_pipeline_trigger", priority: "P70", eventsKo: "DRIFT → 재분석 트리거", eventsEn: "DRIFT → re-analysis trigger" },
      { name: "drift_auto_snapshot", priority: "P80", eventsKo: "DRIFT → 상태 캡처", eventsEn: "DRIFT → state capture" },
      { name: "pipeline_end_snapshot", priority: "P80", eventsKo: "PIPELINE_END → 스냅샷", eventsEn: "PIPELINE_END → snapshot" },
      { name: "turn_auto_memory", priority: "P85", eventsKo: "TURN_COMPLETE → 인사이트 저장", eventsEn: "TURN_COMPLETE → save insights" },
      { name: "memory_write_back", priority: "P85", eventsKo: "PIPELINE_END → MEMORY.md", eventsEn: "PIPELINE_END → MEMORY.md" },
    ],
    status: "frontier",
  },
  {
    id: "L3", name: "DECIDE", color: "#F5C542",
    descKo: "Hook이 행동 방향을 결정",
    descEn: "Hooks determine action direction",
    handlers: [
      { name: "context_action", priority: "P50", eventsKo: "CONTEXT_CRITICAL → 압축 전략 위임", eventsEn: "CONTEXT_CRITICAL → delegate compaction strategy" },
      { name: "session_start", priority: "\u2014", eventsKo: "SESSION_START → 동적 프롬프트 보강", eventsEn: "SESSION_START → dynamic prompt augmentation" },
    ],
    status: "partial",
  },
  {
    id: "L4", name: "AUTONOMY", color: "#C084FC",
    descKo: "패턴에서 규칙을 자율 학습",
    descEn: "Self-learn rules from patterns",
    handlers: [
      { name: "tool-approval", priority: "\u2014", eventsKo: "HITL 승인 이력 → 자동 승인 룰 학습", eventsEn: "HITL approval history → learn auto-approve rules" },
      { name: "model-switched", priority: "\u2014", eventsKo: "전환 사유 기록 → 자동 전환 정책", eventsEn: "Record switch reasons → auto-switch policy" },
      { name: "filesystem-plugin", priority: "\u2014", eventsKo: ".geode/hooks/ 자동 발견 + 등록", eventsEn: ".geode/hooks/ auto-discovery + registration" },
    ],
    status: "planned",
  },
];

/* ── Coverage Matrix (46 events × 4 levels) ── */
const coverageRows = [
  { group: "Pipeline", count: 3, L1: "5 handlers", L2: "2 handlers", L3: "—", L4: "—" },
  { group: "Node", count: 4, L1: "2 handlers", L2: "—", L3: "—", L4: "—" },
  { group: "Analysis", count: 3, L1: "RunLog", L2: "—", L3: "—", L4: "—" },
  { group: "Verification", count: 2, L1: "RunLog", L2: "—", L3: "—", L4: "—" },
  { group: "Automation", count: 6, L1: "6 handlers", L2: "2 handlers", L3: "—", L4: "—" },
  { group: "Turn", count: 1, L1: "RunLog", L2: "AutoMemory", L3: "—", L4: "—" },
  { group: "SubAgent", count: 3, L1: "2 handlers", L2: "—", L3: "—", L4: "—" },
  { group: "Context", count: 3, L1: "RunLog", L2: "—", L3: "○ planned", L4: "—" },
  { group: "Gateway", count: 2, L1: "—", L2: "—", L3: "—", L4: "—" },
  { group: "MCP", count: 2, L1: "RunLog", L2: "—", L3: "—", L4: "—" },
  { group: "Tool Recovery", count: 3, L1: "RunLog", L2: "—", L3: "—", L4: "—" },
  { group: "Memory", count: 4, L1: "—", L2: "—", L3: "—", L4: "—" },
  { group: "Prompt", count: 2, L1: "RunLog", L2: "—", L3: "—", L4: "—" },
  { group: "LLM", count: 2, L1: "Lifecycle", L2: "—", L3: "—", L4: "—" },
  { group: "Tool Approval", count: 3, L1: "Tracker", L2: "—", L3: "—", L4: "○ planned" },
  { group: "Session", count: 2, L1: "Logger", L2: "—", L3: "—", L4: "—" },
  { group: "Model Switch", count: 1, L1: "Logger", L2: "—", L3: "—", L4: "○ planned" },
];

/* ── Event sources for architecture SVG ── */
const eventSources = [
  { label: "StateGraph", sub: "NODE_*", color: "#4ECDC4", y: 30 },
  { label: "AgenticLoop", sub: "TURN_*", color: "#F4B8C8", y: 75 },
  { label: "PromptAsm", sub: "PROMPT_*", color: "#818CF8", y: 120 },
  { label: "Automation", sub: "DRIFT/TRIGGER", color: "#F5C542", y: 165 },
  { label: "SubAgent", sub: "SUBAGENT_*", color: "#C084FC", y: 210 },
  { label: "Gateway", sub: "GATEWAY_*", color: "#60A5FA", y: 255 },
];

const handlerChain = [
  { label: "P30", name: "TaskBridge", color: "#60A5FA", y: 30 },
  { label: "P40", name: "StuckDetect", color: "#60A5FA", y: 65 },
  { label: "P50", name: "RunLog", color: "#60A5FA", y: 100 },
  { label: "P60", name: "Journal", color: "#60A5FA", y: 135 },
  { label: "P70", name: "DriftTrigger", color: "#4ECDC4", y: 170 },
  { label: "P80", name: "Snapshot", color: "#4ECDC4", y: 205 },
  { label: "P85", name: "AutoMemory", color: "#4ECDC4", y: 240 },
  { label: "P90", name: "TableLog", color: "#60A5FA", y: 275 },
];

const statusLabel: Record<string, { text: string; color: string }> = {
  complete: { text: "COMPLETE", color: "#34D399" },
  frontier: { text: "FRONTIER", color: "#4ECDC4" },
  partial: { text: "PARTIAL", color: "#F5C542" },
  planned: { text: "PLANNED", color: "#C084FC" },
};

/* ── Hook Architecture SVG ── */
function HookArchitectureDiagram() {
  const W = 840;
  const H = 310;
  const SRC_X = 80;
  const HUB_X = 350;
  const CHAIN_X = 640;

  return (
    <div className="w-full overflow-x-auto -mx-4 px-4 pb-2 mb-10">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full min-w-[600px]" style={{ maxHeight: 350 }}>
        {/* Column labels */}
        <text x={SRC_X} y={16} textAnchor="middle" fill="white" fillOpacity={0.4} fontSize={10} fontFamily="ui-monospace, monospace" fontWeight={700}>Event Sources</text>
        <text x={HUB_X} y={16} textAnchor="middle" fill="white" fillOpacity={0.4} fontSize={10} fontFamily="ui-monospace, monospace" fontWeight={700}>HookSystem</text>
        <text x={CHAIN_X} y={16} textAnchor="middle" fill="white" fillOpacity={0.4} fontSize={10} fontFamily="ui-monospace, monospace" fontWeight={700}>Handler Chain</text>

        {/* Event source boxes */}
        {eventSources.map((s) => (
          <g key={s.label}>
            <rect x={SRC_X - 62} y={s.y} width={125} height={36} rx={8} fill="#0C1220" stroke={s.color} strokeWidth={0.7} strokeOpacity={0.3} />
            <text x={SRC_X} y={s.y + 15} textAnchor="middle" fill={s.color} fontSize={10} fontFamily="ui-monospace, monospace" fontWeight={600}>{s.label}</text>
            <text x={SRC_X} y={s.y + 28} textAnchor="middle" fill={s.color} fillOpacity={0.45} fontSize={8} fontFamily="ui-monospace, monospace">{s.sub}</text>
            {/* Arrow to hub left edge — stops at hub rect boundary */}
            <path d={`M${SRC_X + 63},${s.y + 18} C${SRC_X + 100},${s.y + 18} ${HUB_X - 100},${H / 2 - 35 + (s.y / (H - 40)) * 70} ${HUB_X - 55},${H / 2 - 35 + (s.y / (H - 40)) * 70}`} stroke={s.color} strokeOpacity={0.2} strokeWidth={1} fill="none" />
          </g>
        ))}

        {/* HookSystem hub pulse */}
        <circle cx={HUB_X} cy={H / 2} r={0} fill="none" stroke="#4ECDC4" strokeWidth={0.8} strokeOpacity={0}>
          <animate attributeName="r" values="0;80" dur="3s" repeatCount="indefinite" />
          <animate attributeName="stroke-opacity" values="0.12;0" dur="3s" repeatCount="indefinite" />
        </circle>
        {/* HookSystem hub */}
        <rect x={HUB_X - 65} y={H / 2 - 35} width={130} height={70} rx={12} fill="#0C1220" stroke="#4ECDC4" strokeWidth={1.2} strokeOpacity={0.35} />
        <text x={HUB_X} y={H / 2 - 10} textAnchor="middle" fill="#4ECDC4" fontSize={11} fontFamily="ui-monospace, monospace" fontWeight={700}>HookSystem</text>
        <text x={HUB_X} y={H / 2 + 6} textAnchor="middle" fill="#4ECDC4" fillOpacity={0.4} fontSize={9} fontFamily="ui-monospace, monospace">register()</text>
        <text x={HUB_X} y={H / 2 + 20} textAnchor="middle" fill="#4ECDC4" fillOpacity={0.4} fontSize={9} fontFamily="ui-monospace, monospace">trigger()</text>

        {/* Hub right edge to handler chain — enter from hub rect right side */}
        {handlerChain.map((h) => (
          <path key={h.label} d={`M${HUB_X + 65},${H / 2 - 35 + (h.y / (H - 40)) * 70} C${HUB_X + 100},${H / 2 - 35 + (h.y / (H - 40)) * 70} ${CHAIN_X - 110},${h.y + 14} ${CHAIN_X - 75},${h.y + 14}`} stroke={h.color} strokeOpacity={0.18} strokeWidth={1} fill="none" />
        ))}

        {/* Handler chain (priority sorted) */}
        {handlerChain.map((h, i) => (
          <g key={h.label}>
            <rect x={CHAIN_X - 75} y={h.y} width={155} height={28} rx={6} fill="#0C1220" stroke={h.color} strokeWidth={0.7} strokeOpacity={0.25} />
            <text x={CHAIN_X - 48} y={h.y + 18} fill={h.color} fillOpacity={0.5} fontSize={9} fontFamily="ui-monospace, monospace" fontWeight={700}>{h.label}</text>
            <text x={CHAIN_X + 10} y={h.y + 18} fill="white" fillOpacity={0.5} fontSize={9} fontFamily="ui-monospace, monospace">{h.name}</text>
            {/* Maturity indicator */}
            <circle cx={CHAIN_X + 68} cy={h.y + 14} r={3} fill={h.color} fillOpacity={0.45} />
            {/* Chain connector */}
            {i < handlerChain.length - 1 && (
              <line x1={CHAIN_X} y1={h.y + 28} x2={CHAIN_X} y2={handlerChain[i + 1].y} stroke="white" strokeOpacity={0.04} strokeWidth={1} strokeDasharray="2 3" />
            )}
          </g>
        ))}

        {/* L1/L2 boundary removed — 시인성 해침 */}
      </svg>
    </div>
  );
}

export function HooksSection() {
  const locale = useLocale();
  const [activeLevel, setActiveLevel] = useState(1);

  return (
    <section className="relative py-28 sm:py-32 px-4 sm:px-6">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(78,205,196,0.015)_0%,transparent_60%)] pointer-events-none" />
      <div className="relative z-10 max-w-5xl mx-auto">
        <ScrollReveal>
          <p className="text-sm font-mono font-bold text-[#4ECDC4]/60 uppercase tracking-[0.25em] mb-3">
            Hook System
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white/90 mb-2">
            {t(locale, "이벤트 기반 리플 패턴", "Event-Driven Ripple Pattern")}
          </h2>
          <p className="text-lg sm:text-xl text-white/50 font-semibold mb-4">
            46 Events × 4 Maturity
          </p>
          <p className="text-sm sm:text-base text-[#A0B4D4] max-w-xl mb-10 leading-relaxed">
            {t(locale,
              "6개 이벤트 소스에서 발생한 46개 이벤트가 HookSystem을 거쳐 우선순위 순으로 정렬된 핸들러 체인을 관통합니다. 하나의 이벤트가 L1(관측)과 L2(반응)를 동시에 지나가는 것이 리플 패턴입니다.",
              "46 events from 6 event sources pass through HookSystem into a priority-sorted handler chain. A single event traversing both L1 (observe) and L2 (react) simultaneously is the ripple pattern."
            )}
          </p>
        </ScrollReveal>

        {/* ── Architecture Diagram: Sources → HookSystem → Handler Chain ── */}
        <ScrollReveal delay={0.1}>
          <HookArchitectureDiagram />
        </ScrollReveal>

        {/* ── Maturity Level Selector ── */}
        <ScrollReveal delay={0.15}>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
            {levels.map((lv, i) => {
              const isActive = activeLevel === i;
              const st = statusLabel[lv.status];
              return (
                <button
                  key={lv.id}
                  onClick={() => setActiveLevel(i)}
                  className="text-left px-4 py-3 rounded-xl border transition-all duration-300"
                  style={{
                    borderColor: isActive ? `${lv.color}30` : "rgba(255,255,255,0.04)",
                    background: isActive ? `${lv.color}08` : "transparent",
                  }}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-mono font-bold" style={{ color: lv.color }}>{lv.id}</span>
                    <span className="text-sm font-semibold text-white/80">{lv.name}</span>
                  </div>
                  <div className="text-xs text-[#9BB0CC] mb-2">{locale === "en" ? lv.descEn : lv.descKo}</div>
                  <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded" style={{ color: st.color, background: `${st.color}15` }}>
                    {st.text}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Handler list */}
          <div className="space-y-2 mb-6">
            {levels[activeLevel].handlers.map((h) => (
              <div key={h.name} className="flex items-center gap-4 px-4 py-2.5 rounded-lg border border-white/[0.04]" style={{ background: `${levels[activeLevel].color}03` }}>
                <span className="shrink-0 w-10 text-center text-[11px] font-mono font-bold" style={{ color: levels[activeLevel].color }}>{h.priority}</span>
                <span className="text-sm font-medium text-white/80 w-[160px] shrink-0">{h.name}</span>
                <span className="text-sm text-[#9BB0CC]">{locale === "en" ? h.eventsEn : h.eventsKo}</span>
              </div>
            ))}
          </div>
        </ScrollReveal>

        {/* ── Coverage Matrix ── */}
        <ScrollReveal delay={0.2}>
          <p className="text-sm font-mono font-bold text-[#818CF8]/60 uppercase tracking-[0.25em] mb-4">
            Coverage Matrix
          </p>
          <p className="text-sm text-[#9BB0CC] mb-5">
            {t(locale,
              "46개 이벤트 × 4 성숙도 레벨. L1 OBSERVE 90%+ 커버, L2 REACT frontier 확장 중, L3/L4 계획 단계.",
              "46 events × 4 maturity levels. L1 OBSERVE 90%+ coverage, L2 REACT frontier expanding, L3/L4 planned."
            )}
          </p>
          <div className="overflow-x-auto -mx-4 px-4">
            <table className="w-full text-xs font-mono border-collapse min-w-[540px]">
              <thead>
                <tr>
                  <th className="text-left py-2 px-3 text-[#9BB0CC] font-semibold border-b border-white/[0.06]">{t(locale, "이벤트 그룹", "Event Group")}</th>
                  <th className="text-center py-2 px-2 border-b border-white/[0.06]" style={{ color: "#60A5FA" }}>L1</th>
                  <th className="text-center py-2 px-2 border-b border-white/[0.06]" style={{ color: "#4ECDC4" }}>L2</th>
                  <th className="text-center py-2 px-2 border-b border-white/[0.06]" style={{ color: "#F5C542" }}>L3</th>
                  <th className="text-center py-2 px-2 border-b border-white/[0.06]" style={{ color: "#C084FC" }}>L4</th>
                </tr>
              </thead>
              <tbody>
                {coverageRows.map((r) => (
                  <tr key={r.group} className="border-b border-white/[0.03] hover:bg-white/[0.01] transition-colors">
                    <td className="py-2 px-3 text-white/60">
                      {r.group} <span className="text-white/20">({r.count})</span>
                    </td>
                    {[r.L1, r.L2, r.L3, r.L4].map((cell, ci) => {
                      const colors = ["#60A5FA", "#4ECDC4", "#F5C542", "#C084FC"];
                      const isActive = cell !== "—";
                      const isPlanned = cell.includes("planned");
                      return (
                        <td key={ci} className="text-center py-2 px-2">
                          {isActive ? (
                            <span style={{ color: isPlanned ? `${colors[ci]}60` : `${colors[ci]}90`, fontSize: 10 }}>
                              {isPlanned ? "○" : "✓"} {cell.replace("○ planned", "")}
                            </span>
                          ) : (
                            <span className="text-white/10">—</span>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Observability stack */}
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-3">
            {(locale === "en" ? [
              { name: "RunLog", desc: "Full JSONL recording of all 46 events. Per-session append-only.", color: "#60A5FA" },
              { name: "JournalHook", desc: "Structures pipeline completion/error/sub-agent results into runs.jsonl.", color: "#34D399" },
              { name: "LangSmith", desc: "Traces all nodes via @traceable decorator. Optionally enabled.", color: "#F5C542" },
            ] : [
              { name: "RunLog", desc: "46개 이벤트 전수 JSONL 기록. 세션별 append-only.", color: "#60A5FA" },
              { name: "JournalHook", desc: "파이프라인 완료/에러/서브에이전트 결과를 runs.jsonl에 구조화.", color: "#34D399" },
              { name: "LangSmith", desc: "@traceable 데코레이터로 전 노드 트레이스. 선택적 활성화.", color: "#F5C542" },
            ]).map((o) => (
              <div key={o.name} className="rounded-lg border border-white/[0.04] px-4 py-3" style={{ background: `${o.color}03` }}>
                <div className="text-sm font-semibold mb-1" style={{ color: o.color }}>{o.name}</div>
                <div className="text-xs text-[#A0B4D4] leading-relaxed">{o.desc}</div>
              </div>
            ))}
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
