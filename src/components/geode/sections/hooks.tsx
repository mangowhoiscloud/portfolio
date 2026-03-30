"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { ScrollReveal } from "../scroll-reveal";
import { SectionHeader } from "../ui/section-header";
import { useLocale, t } from "../locale-context";

/* ── Inner ring: 8 event categories ── */
const categories = [
  { name: "Pipeline", count: 3, color: "#E87080" },
  { name: "Node", count: 4, color: "#F4B8C8" },
  { name: "Analysis", count: 3, color: "#818CF8" },
  { name: "Verification", count: 2, color: "#34D399" },
  { name: "Automation", count: 6, color: "#F5C542" },
  { name: "SubAgent", count: 3, color: "#C084FC" },
  { name: "Ctx+Sess+LLM", count: 6, color: "#60A5FA" },
  { name: "Tool+Memory", count: 7, color: "#4ECDC4" },
];

/* ── Outer ring: 8 handlers sorted by priority ── */
const handlers = [
  { name: "TaskBridge", p: 30, color: "#60A5FA" },
  { name: "StuckDetect", p: 40, color: "#60A5FA" },
  { name: "RunLog", p: 50, color: "#60A5FA" },
  { name: "Journal", p: 60, color: "#34D399" },
  { name: "DriftTrigger", p: 70, color: "#4ECDC4" },
  { name: "Snapshot", p: 80, color: "#4ECDC4" },
  { name: "MemWriteBack", p: 85, color: "#4ECDC4" },
  { name: "Notification", p: 200, color: "#F5C542" },
];

/* Indices of handlers hit by PIPELINE_END ripple */
const rippleTargets = [2, 3, 5, 6, 7]; // RunLog, Journal, Snapshot, MemWriteBack, Notification

/* Polar helper */
function polar(cx: number, cy: number, r: number, angleDeg: number) {
  const rad = (angleDeg - 90) * (Math.PI / 180);
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
}

/* ── Concentric Ring SVG ── */
function RippleRingSVG() {
  const [ripple, setRipple] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const CX = 300, CY = 200, R_INNER = 100, R_OUTER = 170;

  useEffect(() => {
    const fire = () => { setRipple(true); setTimeout(() => setRipple(false), 2800); };
    fire();
    timerRef.current = setInterval(fire, 4000);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, []);

  /* Positions */
  const catPos = categories.map((_, i) => polar(CX, CY, R_INNER, (360 / 8) * i));
  const hdrPos = handlers.map((_, i) => polar(CX, CY, R_OUTER, (360 / 8) * i));
  const pipelineIdx = 0; // Pipeline is first category
  const src = catPos[pipelineIdx];

  return (
    <div className="w-full flex flex-col items-center mb-8">
      <svg viewBox="0 0 600 400" className="w-full max-w-[560px]">
        {/* Subtle dashed orbit rings */}
        <circle cx={CX} cy={CY} r={R_INNER} fill="none" stroke="white" strokeOpacity={0.04} strokeDasharray="4 6" />
        <circle cx={CX} cy={CY} r={R_OUTER} fill="none" stroke="white" strokeOpacity={0.04} strokeDasharray="4 6">
          <animateTransform attributeName="transform" type="rotate" from={`0 ${CX} ${CY}`} to={`360 ${CX} ${CY}`} dur="1200s" repeatCount="indefinite" />
        </circle>

        {/* Center hub pulse */}
        <circle cx={CX} cy={CY} r={0} fill="none" stroke="#4ECDC4" strokeWidth={0.8}>
          <animate attributeName="r" values="0;38" dur="3s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.18;0" dur="3s" repeatCount="indefinite" />
        </circle>
        <circle cx={CX} cy={CY} r={22} fill="#0F1A2E" stroke="#4ECDC4" strokeWidth={1.2} strokeOpacity={0.5} />
        <text x={CX} y={CY - 3} textAnchor="middle" fill="#4ECDC4" fontSize={7} fontFamily="ui-monospace,monospace" fontWeight={700}>Hook</text>
        <text x={CX} y={CY + 7} textAnchor="middle" fill="#4ECDC4" fontSize={7} fontFamily="ui-monospace,monospace" fontWeight={700}>System</text>

        {/* Inner ring: category dots */}
        {categories.map((cat, i) => {
          const p = catPos[i];
          const r = 4 + cat.count * 1.2;
          const isPipelinePulse = ripple && i === pipelineIdx;
          return (
            <g key={cat.name}>
              <circle cx={p.x} cy={p.y} r={r} fill={cat.color} fillOpacity={isPipelinePulse ? 0.9 : 0.35}>
                {isPipelinePulse && <animate attributeName="r" values={`${r};${r * 1.5};${r}`} dur="0.6s" fill="freeze" />}
                {isPipelinePulse && <animate attributeName="fill-opacity" values="0.9;0.5;0.35" dur="0.6s" fill="freeze" />}
              </circle>
              <text x={p.x} y={p.y + r + 11} textAnchor="middle" fill={cat.color} fillOpacity={0.7} fontSize={7} fontFamily="ui-monospace,monospace">{cat.name}</text>
              <text x={p.x} y={p.y + r + 19} textAnchor="middle" fill="white" fillOpacity={0.25} fontSize={6} fontFamily="ui-monospace,monospace">({cat.count})</text>
            </g>
          );
        })}

        {/* Outer ring: handler dots */}
        {handlers.map((h, i) => {
          const p = hdrPos[i];
          const isTarget = ripple && rippleTargets.includes(i);
          const delay = rippleTargets.indexOf(i) * 0.2;
          return (
            <g key={h.name}>
              <circle cx={p.x} cy={p.y} r={6} fill={h.color} fillOpacity={isTarget ? 0.85 : 0.25}>
                {isTarget && <animate attributeName="fill-opacity" values="0.25;0.85;0.25" dur="0.5s" begin={`${0.5 + delay}s`} fill="freeze" />}
              </circle>
              <text x={p.x} y={p.y - 10} textAnchor="middle" fill={h.color} fillOpacity={0.7} fontSize={7} fontFamily="ui-monospace,monospace">{h.name}</text>
              <text x={p.x} y={p.y + 15} textAnchor="middle" fill="white" fillOpacity={0.2} fontSize={6} fontFamily="ui-monospace,monospace">P{h.p}</text>
            </g>
          );
        })}

        {/* Ripple arcs: Pipeline → hub → each target handler */}
        {ripple && rippleTargets.map((ti, idx) => {
          const dst = hdrPos[ti];
          return (
            <g key={`arc-${ti}`}>
              <line x1={src.x} y1={src.y} x2={CX} y2={CY} stroke="#E87080" strokeWidth={1} opacity={0}>
                <animate attributeName="opacity" values="0;0.4;0" dur="1.5s" begin={`${idx * 0.2}s`} fill="freeze" />
              </line>
              <line x1={CX} y1={CY} x2={dst.x} y2={dst.y} stroke={handlers[ti].color} strokeWidth={1} opacity={0}>
                <animate attributeName="opacity" values="0;0.35;0" dur="1.5s" begin={`${0.3 + idx * 0.2}s`} fill="freeze" />
              </line>
            </g>
          );
        })}
      </svg>
      <p className="text-[11px] text-white/25 font-mono mt-1">40 events (inner) → HookSystem → 12 handlers (outer)</p>
    </div>
  );
}

/* ── Ripple Chain steps ── */
const chainSteps = [
  { p: 50, name: "RunLog", desc: "JSONL append" },
  { p: 60, name: "Journal", desc: "runs.jsonl + learned" },
  { p: 80, name: "Snapshot", desc: "state capture" },
  { p: 85, name: "MemoryWriteBack", desc: "MEMORY.md" },
  { p: 200, name: "Notification", desc: "Slack/Discord" },
];

/* ── Maturity tiers ── */
const tiers = [
  { id: "L1", name: "OBSERVE", color: "#60A5FA", status: "complete", desc: "All 40 events logged. RunLog JSONL." },
  { id: "L2", name: "REACT", color: "#4ECDC4", status: "frontier", desc: "DRIFT: snapshot + reanalysis. PIPELINE_END: MEMORY.md." },
  { id: "L3", name: "DECIDE", color: "#F5C542", status: "partial", desc: "CONTEXT_OVERFLOW: compaction strategy feedback." },
  { id: "L4", name: "AUTONOMY", color: "#C084FC", status: "planned", desc: "HITL pattern: auto-approve rules. .geode/hooks/ plugins." },
];

const statusColors: Record<string, string> = {
  complete: "#34D399", frontier: "#4ECDC4", partial: "#F5C542", planned: "#C084FC",
};

/* ── Main export ── */
export function HooksSection() {
  const locale = useLocale();
  const [showTiers, setShowTiers] = useState(false);

  return (
    <section className="relative py-28 sm:py-32 px-4 sm:px-6">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(78,205,196,0.015)_0%,transparent_60%)] pointer-events-none" />
      <div className="relative z-10 max-w-5xl mx-auto">

        {/* 1. Header */}
        <SectionHeader
          variant="quote"
          labelColor="#4ECDC4"
          title={t(locale, "이벤트 기반 리플 패턴", "Event-Driven Ripple Pattern")}
        />

        {/* 2. Problem statement */}
        <ScrollReveal>
          <p className="text-sm sm:text-base text-[#A0B4D4] max-w-2xl mb-10 leading-relaxed">
            {t(locale,
              "비결정적 LLM 시스템은 모든 경로를 테스트할 수 없습니다. Hook은 결합 없이 관측성과 반응성을 제공합니다.",
              "Non-deterministic LLM systems cannot test every path. Hooks provide observability and reactivity without coupling."
            )}
          </p>
        </ScrollReveal>

        {/* 3. Concentric ring SVG */}
        <ScrollReveal delay={0.1}>
          <RippleRingSVG />
        </ScrollReveal>

        {/* 4. Two cards */}
        <ScrollReveal delay={0.15}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
            {/* Left: Ripple Chain */}
            <div className="rounded-xl border px-5 py-4" style={{ borderColor: "#4ECDC420", background: "#4ECDC405" }}>
              <p className="text-sm font-semibold text-[#4ECDC4] mb-3">Ripple Chain: PIPELINE_END</p>
              <div className="space-y-2">
                {chainSteps.map((s, i) => (
                  <div key={s.name} className="flex items-center gap-2 text-xs">
                    <span className="shrink-0 w-5 h-5 rounded-full bg-[#4ECDC4]/10 text-[#4ECDC4] flex items-center justify-center text-[10px] font-bold">{i + 1}</span>
                    <span className="font-mono text-[10px] text-white/30 w-7">P{s.p}</span>
                    <span className="font-medium text-white/70">{s.name}</span>
                    <span className="text-white/30 ml-auto">{s.desc}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: Trade-off */}
            <div className="rounded-xl border px-5 py-4" style={{ borderColor: "#F5C54220", background: "#F5C54205" }}>
              <p className="text-sm font-semibold text-[#F5C542] mb-3">Trade-off</p>
              <p className="text-xs text-[#A0B4D4] leading-relaxed">
                {t(locale,
                  "39개 이벤트: fire-and-forget (성능 우선). 1개 이벤트(CONTEXT_OVERFLOW_ACTION): trigger_with_result (피드백 필수). Agent가 계속하기 전에 압축 전략이 필요하기 때문.",
                  "39 events: fire-and-forget (performance first). 1 event (CONTEXT_OVERFLOW_ACTION): trigger_with_result (feedback required). Because the agent needs the compaction strategy before continuing."
                )}
              </p>
            </div>
          </div>
        </ScrollReveal>

        {/* 5. Maturity Tiers (collapsible) */}
        <ScrollReveal delay={0.2}>
          <button
            onClick={() => setShowTiers(!showTiers)}
            className="text-xs font-mono font-bold text-white/40 hover:text-white/60 border border-white/[0.06] rounded-lg px-4 py-2 mb-4 transition-colors"
          >
            {showTiers ? "▾" : "▸"} {t(locale, "성숙도 단계 보기", "View Maturity Tiers")}
          </button>

          {showTiers && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="space-y-2 overflow-hidden">
              {tiers.map((tier) => (
                <div key={tier.id} className="flex items-center gap-3 rounded-lg border border-white/[0.04] px-4 py-2.5">
                  <span className="text-xs font-mono font-bold w-6" style={{ color: tier.color }}>{tier.id}</span>
                  <span className="text-xs font-semibold text-white/70 w-24">{tier.name}</span>
                  <span className="text-xs text-[#A0B4D4] flex-1">{tier.desc}</span>
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded" style={{ color: statusColors[tier.status], background: `${statusColors[tier.status]}15` }}>
                    {tier.status.toUpperCase()}
                  </span>
                </div>
              ))}
            </motion.div>
          )}
        </ScrollReveal>
      </div>
    </section>
  );
}
