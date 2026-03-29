"use client";

import { useEffect, useState, useRef } from "react";
import { ScrollReveal } from "../scroll-reveal";

/* ── Terminal scenarios (geode.html 실제 출력 기반) ── */
type Line = { type: string; text: string; input?: boolean };

const scenarios: { tab: string; lines: Line[] }[] = [
  {
    tab: "agentic",
    lines: [
      { type: "prompt", text: "$ uv run geode", input: true },
      { type: "status", text: "● GEODE v0.34 Interactive REPL" },
      { type: "prompt", text: "> 이 프로젝트의 테스트 커버리지 분석해줘", input: true },
      { type: "tool", text: "  ▸ run_bash: pytest --cov=core --cov-report=term" },
      { type: "exec", text: "  ✓ 3,344 passed · coverage 78% · 12.3s" },
      { type: "tool", text: "  ▸ memory_search: 이전 커버리지 기록" },
      { type: "exec", text: "  ✓ 3건 발견 · 최근: 72% (3일 전)" },
      { type: "done", text: "  커버리지 72% → 78% (+6%). core/hooks/ 미커버 모듈 3개 확인." },
    ],
  },
  {
    tab: "plan-mode",
    lines: [
      { type: "prompt", text: "> CHANGELOG 정리하고 v0.35.0 릴리즈 준비해", input: true },
      { type: "status", text: '  ● plan: "v0.35.0 릴리즈" 생성 (3 steps)' },
      { type: "phase", text: "  1. CHANGELOG [Unreleased] → [0.35.0] 정리" },
      { type: "phase", text: "  2. pyproject.toml + CLAUDE.md 버전 동기화" },
      { type: "phase", text: "  3. git tag v0.35.0 + PR 생성" },
      { type: "prompt", text: "  approve? [y/n/edit] > y", input: true },
      { type: "tool", text: "  ▸ run_bash: sed -i 's/Unreleased/0.35.0/' ..." },
      { type: "tool", text: "  ▸ note_save: CHANGELOG.md 갱신" },
      { type: "exec", text: "  ✓ 3/3 steps · PR #524 created" },
    ],
  },
  {
    tab: "game-ip",
    lines: [
      { type: "prompt", text: '> Cowboy Bebop 분석해줘', input: true },
      { type: "tool", text: '  ▸ analyze_ip: "Cowboy Bebop" mode=full' },
      { type: "exec", text: "  ✓ score: 68.4 A · 14축 완료 · 4.1s" },
      { type: "prompt", text: "> Berserk 점수만 보여줘", input: true },
      { type: "tool", text: '  ▸ analyze_ip: "Berserk" mode=scoring' },
      { type: "exec", text: "  ✓ score: 81.2 S · quick mode · 1.8s" },
      { type: "prompt", text: '> 두 IP 비교해줘', input: true },
      { type: "tool", text: '  ▸ compare_ips: ["Berserk", "Cowboy Bebop"]' },
      { type: "exec", text: "  ✓ Berserk S(81.2) vs Cowboy Bebop A(68.4)" },
      { type: "done", text: "✓ session: 3 calls · $3.12 · 9.5s" },
    ],
  },
];

const colorMap: Record<string, string> = {
  prompt: "text-white/70",
  status: "text-[#34D399]",
  phase: "text-[#818CF8]",
  tool: "text-[#F5C542]",
  exec: "text-[#4ECDC4]",
  verify: "text-[#C084FC]",
  done: "text-[#34D399] font-bold",
  error: "text-[#E87080]",
  token: "text-[#7A8CA8]",
};

const tabLabels: Record<string, string> = {
  agentic: "Agentic Loop",
  "plan-mode": "Plan Mode",
  "game-ip": "Game IP",
};

/* ── Orbital Cycle ── */
const STEPS = [
  { label: "THINK", color: "#818CF8" },
  { label: "SELECT", color: "#F5C542" },
  { label: "EXECUTE", color: "#4ECDC4" },
  { label: "VERIFY", color: "#C084FC" },
] as const;

const SIZE = 260;
const CX = SIZE / 2;
const CY = SIZE / 2;
const R = 88;
const ANGLES = [-90, 0, 90, 180];

function OrbitalCycle() {
  const [activePhase, setActivePhase] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { threshold: 0.3 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isVisible) return;
    const interval = setInterval(() => {
      setActivePhase((p) => (p + 1) % 4);
    }, 1500);
    return () => clearInterval(interval);
  }, [isVisible]);

  return (
    <div ref={containerRef} className="relative mx-auto" style={{ width: SIZE, height: SIZE }}>
      <svg viewBox={`0 0 ${SIZE} ${SIZE}`} className="w-full h-full">
        {/* Orbit ring */}
        <circle
          cx={CX} cy={CY} r={R}
          fill="none" stroke="white" strokeOpacity={0.05}
          strokeWidth={1} strokeDasharray="4 6"
        />

        {/* Direction dots */}
        {[-45, 45, 135, 225].map((deg) => {
          const rad = (deg * Math.PI) / 180;
          return (
            <circle
              key={deg}
              cx={CX + R * Math.cos(rad)}
              cy={CY + R * Math.sin(rad)}
              r={1.2}
              fill="white"
              fillOpacity={0.18}
            />
          );
        })}

        {/* Nodes */}
        {STEPS.map((step, i) => {
          const rad = (ANGLES[i] * Math.PI) / 180;
          const x = CX + R * Math.cos(rad);
          const y = CY + R * Math.sin(rad);
          const isActive = activePhase === i;

          return (
            <g key={step.label}>
              {isActive && (
                <circle cx={x} cy={y} r={28} fill={step.color} fillOpacity={0.18}>
                  <animate
                    attributeName="fill-opacity"
                    values="0.03;0.09;0.03"
                    dur="2s"
                    repeatCount="indefinite"
                  />
                </circle>
              )}
              <circle
                cx={x} cy={y} r={22}
                fill="#0A0F1A"
                stroke={step.color}
                strokeWidth={isActive ? 1.5 : 0.5}
                strokeOpacity={isActive ? 0.7 : 0.2}
                style={{ transition: "stroke-width 0.4s, stroke-opacity 0.4s" }}
              />
              <text
                x={x} y={y + 1}
                textAnchor="middle"
                dominantBaseline="central"
                fill={step.color}
                fontSize={9}
                fontFamily="ui-monospace, monospace"
                fontWeight={600}
                opacity={isActive ? 1 : 0.45}
                style={{ transition: "opacity 0.4s" }}
              >
                {step.label}
              </text>
            </g>
          );
        })}

        {/* Center pulse */}
        <circle cx={CX} cy={CY} r={0} fill="none" stroke="#4ECDC4" strokeWidth={0.8} strokeOpacity={0}>
          <animate attributeName="r" values="0;88" dur="3s" repeatCount="indefinite" />
          <animate attributeName="stroke-opacity" values="0.15;0" dur="3s" repeatCount="indefinite" />
        </circle>

        {/* Center label */}
        <text x={CX} y={CY - 4} textAnchor="middle" fill="white" fillOpacity={0.25} fontSize={9} fontFamily="ui-monospace, monospace">
          while
        </text>
        <text x={CX} y={CY + 9} textAnchor="middle" fill="white" fillOpacity={0.35} fontSize={10} fontFamily="ui-monospace, monospace" fontWeight={600}>
          (tool_use)
        </text>
      </svg>
    </div>
  );
}

/* ── Terminal: input lines typed, output lines appear line-by-line ── */
function TypingTerminal() {
  const [activeTab, setActiveTab] = useState(0);
  const [visibleLines, setVisibleLines] = useState(0);
  const [currentChars, setCurrentChars] = useState(0);
  const [typingDone, setTypingDone] = useState(false); // true = current line fully revealed
  const containerRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const startedRef = useRef(false);

  const lines = scenarios[activeTab].lines;

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !startedRef.current) {
          startedRef.current = true;
          playLines(scenarios[0].lines);
        }
      },
      { threshold: 0.3 },
    );
    if (containerRef.current) observer.observe(containerRef.current);
    return () => {
      observer.disconnect();
      cleanup();
    };
  }, []);

  function cleanup() {
    if (timerRef.current) clearTimeout(timerRef.current);
    if (intervalRef.current) clearInterval(intervalRef.current);
  }

  function switchTab(idx: number) {
    cleanup();
    setActiveTab(idx);
    setVisibleLines(0);
    setCurrentChars(0);
    setTypingDone(false);
    playLines(scenarios[idx].lines);
  }

  function playLines(target: Line[]) {
    let lineIdx = 0;

    function nextLine() {
      if (lineIdx >= target.length) return;

      const line = target[lineIdx];

      if (line.input) {
        // Type character by character
        let charIdx = 0;
        setVisibleLines(lineIdx);
        setCurrentChars(0);
        setTypingDone(false);

        intervalRef.current = setInterval(() => {
          charIdx += 2;
          if (charIdx >= line.text.length) {
            if (intervalRef.current) clearInterval(intervalRef.current);
            setVisibleLines(lineIdx + 1);
            setCurrentChars(0);
            setTypingDone(true);
            lineIdx++;
            timerRef.current = setTimeout(nextLine, 500);
          } else {
            setCurrentChars(charIdx);
          }
        }, 30);
      } else {
        // Output line: appear instantly
        setVisibleLines(lineIdx + 1);
        setCurrentChars(0);
        setTypingDone(true);
        lineIdx++;
        timerRef.current = setTimeout(nextLine, 120);
      }
    }

    nextLine();
  }

  return (
    <div
      ref={containerRef}
      className="rounded-xl border border-white/[0.04] bg-[#060B14] overflow-hidden max-h-[460px]"
    >
      {/* Tab bar */}
      <div className="flex items-center gap-0 border-b border-white/[0.04] px-3">
        {scenarios.map((s, i) => (
          <button
            key={s.tab}
            onClick={() => switchTab(i)}
            className="px-3 py-2 text-[10px] font-mono transition-colors duration-200"
            style={{
              color: activeTab === i ? "#4ECDC4" : "#5A6A8A",
              borderBottom: activeTab === i ? "1px solid #4ECDC4" : "1px solid transparent",
            }}
          >
            {tabLabels[s.tab]}
          </button>
        ))}
      </div>

      {/* Terminal content */}
      <div className="p-5 font-mono text-[12.5px] leading-[1.9]">
        <div className="flex items-center gap-1.5 mb-4">
          <div className="w-2.5 h-2.5 rounded-full bg-[#E87080]/60" />
          <div className="w-2.5 h-2.5 rounded-full bg-[#F5C542]/60" />
          <div className="w-2.5 h-2.5 rounded-full bg-[#34D399]/60" />
          <span className="ml-3 text-[10px] text-white/25">geode — {scenarios[activeTab].tab}</span>
        </div>
        {lines.map((line, i) => {
          if (i > visibleLines) return null;

          const isCurrentLine = i === visibleLines;
          const isInput = line.input;

          // Input line being typed
          if (isCurrentLine && isInput && !typingDone) {
            return (
              <div key={`${activeTab}-${i}`} className={`${colorMap[line.type] || "text-white/50"} whitespace-pre`}>
                {line.text.slice(0, currentChars)}
                <span className="animate-pulse">▌</span>
              </div>
            );
          }

          // Fully revealed line
          if (i < visibleLines) {
            return (
              <div key={`${activeTab}-${i}`} className={`${colorMap[line.type] || "text-white/50"} whitespace-pre`}>
                {line.text}
              </div>
            );
          }

          return null;
        })}
      </div>
    </div>
  );
}

/* ── Stats ── */
const loopStats = [
  { value: "∞", label: "while True", sub: "" },
  { value: "8", label: "Safety Guards", sub: "convergence · time budget · stuck · HITL" },
  { value: "3", label: "Modes", sub: "REPL · Headless Daemon(Slack) · Scheduler" },
  { value: "5", label: "Tool Routes", sub: "Bash · Tool · MCP · Skill · DAG" },
];

/* ── 5+3 Safety Guards ── */
const guards = [
  { name: "수렴 감지", trigger: "동일 에러 4회 연속", effect: "break", color: "#E87080" },
  { name: "시간 예산", trigger: "wall-clock 만료 (Karpathy P3)", effect: "wrap-up → end", color: "#F5C542" },
  { name: "컨텍스트 80%", trigger: "Provider별 자동 압축 (Anthropic compact_20260112 / OpenAI client-side)", effect: "요약 후 계속", color: "#818CF8" },
  { name: "컨텍스트 95%", trigger: "긴급 프루닝 + UI 알림", effect: "최근 N개만 유지", color: "#C084FC" },
  { name: "StuckDetector", trigger: "2시간 무응답", effect: "세션 자동 해제", color: "#4ECDC4" },
  { name: "비용 자동 정지", trigger: "세션당 비용 상한 초과", effect: "자동 정지 (v0.32)", color: "#F4B8C8" },
  { name: "래칫 에러 감지", trigger: "결과 악화 패턴 (Karpathy P4)", effect: "롤백", color: "#60A5FA" },
  { name: "다양성 강제", trigger: "동일 도구 5회 연속 호출", effect: "다른 경로 시도", color: "#34D399" },
];

/* ── Section ── */
export function LoopSection() {
  return (
    <section className="relative py-28 sm:py-32 px-4 sm:px-6">
      <div className="relative z-10 max-w-5xl mx-auto">
        <ScrollReveal>
          <p className="text-sm font-mono font-bold text-[#4ECDC4]/60 uppercase tracking-[0.25em] mb-3">
            AgenticLoop
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white/90 mb-2">
            while True: Long-running Agent
          </h2>
          <p className="text-lg text-white/40 font-semibold mb-4">
            for range(50) → while True + 5 Guards
          </p>
          <p className="text-sm sm:text-base text-[#8B9CC0] max-w-xl mb-12 leading-relaxed">
            턴 제한이 아니라, 에이전트와 인프라가 함께 종료를 결정합니다.
            LLM이 <code className="text-[#4ECDC4]/70">tool_use</code>를 반환하는 한 궤도는 멈추지 않으며,
            수렴 감지 · 시간 예산 · 컨텍스트 압축 · StuckDetector 5개 가드가 무한 루프를 방지합니다.
          </p>
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-[0.8fr_1.4fr] gap-8 items-start">
          {/* Left — Orbital + Stats */}
          <ScrollReveal>
            <div className="space-y-6">
              <OrbitalCycle />

              <div className="grid grid-cols-2 gap-3 text-center">
                {loopStats.map((s) => (
                  <div
                    key={s.label}
                    className="rounded-lg border border-white/[0.04] bg-white/[0.01] px-3 py-3"
                  >
                    <div className="text-xl font-bold text-white/80">{s.value}</div>
                    <div className="text-[11px] font-mono text-[#7A8CA8] uppercase">{s.label}</div>
                    {s.sub && <div className="text-[9px] font-mono text-[#4ECDC4]/50 mt-0.5">{s.sub}</div>}
                  </div>
                ))}
              </div>
            </div>
          </ScrollReveal>

          {/* Right — Terminal replay + RECORD */}
          <ScrollReveal delay={0.15}>
            <TypingTerminal />
            <div className="mt-4 rounded-xl border border-white/[0.06] bg-white/[0.01] px-5 py-3.5">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-mono font-bold text-[#E87080]/70 uppercase tracking-widest">RECORD</span>
                <span className="text-[10px] font-mono text-white/25">REODE · Opus 4.6</span>
              </div>
              <div className="flex items-center justify-center gap-6 mb-2">
                {[
                  { value: "1,153", unit: "turns" },
                  { value: "5h 30m", unit: "duration" },
                  { value: "$388", unit: "cost" },
                ].map((m) => (
                  <div key={m.unit} className="text-center">
                    <div className="text-base font-bold text-white/85">{m.value}</div>
                    <div className="text-[9px] font-mono text-[#7A8CA8] uppercase">{m.unit}</div>
                  </div>
                ))}
              </div>
              <div className="text-[10px] font-mono text-white/30 text-center">5,133 file migration · Java 1.8 → 22</div>
              <div className="text-[9px] font-mono text-[#34D399]/50 text-center mt-0.5">83/83 Tests · Build · Service E2E 무중단 성공</div>
            </div>
          </ScrollReveal>
        </div>

        {/* ── 5 Safety Guards ── */}
        <ScrollReveal delay={0.2}>
          <div className="mt-10">
            <p className="text-sm font-mono font-bold text-[#E87080]/60 uppercase tracking-[0.25em] mb-4">
              Safety Guards
            </p>
            <div className="space-y-2">
              {guards.map((g) => (
                <div key={g.name} className="flex items-center gap-4 px-4 py-2.5 rounded-lg border border-white/[0.04]" style={{ background: `${g.color}03` }}>
                  <span className="shrink-0 w-2 h-2 rounded-full" style={{ background: g.color }} />
                  <span className="text-sm font-semibold text-white/80 w-[100px] sm:w-[120px] shrink-0">{g.name}</span>
                  <span className="text-sm text-[#7A8CA8] flex-1">{g.trigger}</span>
                  <span className="text-xs font-mono shrink-0" style={{ color: g.color }}>{g.effect}</span>
                </div>
              ))}
            </div>
            <p className="text-xs text-[#7A8CA8] font-mono mt-3">
              Wrap-Up Headroom: 만료 30초 전부터 tool_choice=none → 결과 정리 후 자연 종료
            </p>

            {/* Failure modes */}
            <div className="mt-6 rounded-xl border border-white/[0.04] px-5 py-4">
              <div className="text-sm font-semibold text-white/70 mb-3">Failure Recovery</div>
              <div className="space-y-1.5 text-sm">
                {[
                  { scenario: "LLM 전체 장애", recovery: "Cross-provider failover (Anthropic → OpenAI → GLM)", color: "#E87080" },
                  { scenario: "MCP 서버 미응답", recovery: "spawn retry + graceful skip", color: "#F5C542" },
                  { scenario: "컨텍스트 오버플로우", recovery: "80% compaction → 95% emergency prune → UI 알림", color: "#818CF8" },
                  { scenario: "도구 연속 실패 ≥2", recovery: "adaptive recovery chain + 모델 에스컬레이션", color: "#C084FC" },
                ].map((f) => (
                  <div key={f.scenario} className="flex items-start gap-3">
                    <span className="shrink-0 w-1.5 h-1.5 rounded-full mt-1.5" style={{ background: f.color }} />
                    <div>
                      <span className="text-white/60">{f.scenario}</span>
                      <span className="text-[#7A8CA8] ml-2">{f.recovery}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
