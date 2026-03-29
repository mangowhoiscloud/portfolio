"use client";

import { useState } from "react";
import { ScrollReveal } from "../scroll-reveal";
import { TabBar } from "../ui/tab-bar";

/* ── Pipeline Verification (GameIP Domain — Output Validation) ── */
const pipelineLayers = [
  {
    tier: 1,
    title: "Per-Agent Guardrails",
    items: ["G1 Schema", "G2 Range", "G3 Grounding", "G4 Consistency"],
    accent: "#34D399",
    description: "모든 에이전트의 매 라운드 출력을 즉시 검증합니다. Haiku가 4가지 규칙으로 게이트킵. 스키마 위반, 범위 이탈, 근거 부재, 내부 모순을 걸러냅니다.",
  },
  {
    tier: 2,
    title: "Confidence Gate",
    items: ["threshold 0.7", "max 5 iterations", "cortex loopback"],
    accent: "#818CF8",
    description: "Scoring 신뢰도가 0.7 미만이면 Cortex부터 자동 재실행합니다. 최대 5회 반복 후에도 미달이면 low-confidence 경고와 함께 결과를 반환합니다.",
  },
  {
    tier: 3,
    title: "Rights Risk Check",
    items: ["IP 권리 검증", "CLEAR/RESTRICTED", "라이선스 체크"],
    accent: "#E87080",
    description: "분석 대상 IP의 권리 상태를 사전 검증합니다. RESTRICTED 또는 UNKNOWN이면 분석을 중단하고 경고를 반환합니다.",
  },
  {
    tier: 4,
    title: "BiasBuster",
    items: ["confirmation", "recency", "anchoring", "position", "verbosity", "self_enhancement"],
    accent: "#F5C542",
    description: "6종 인지 바이어스를 탐지합니다. CV < 0.05(n≥4)이면 앵커링 플래그. Fast path(CV ≥ 0.10, range ≥ 0.5)는 LLM 생략. 4단계 교정: RECOGNIZE → EXPLAIN → ALTER → EVALUATE.",
  },
  {
    tier: 5,
    title: "Cross-LLM Validation",
    items: ["Multi-model", "agreement ≥0.67", "Krippendorff α≥0.80"],
    accent: "#C084FC",
    description: "다른 LLM(Claude vs GPT)과 교차 검증합니다. Agreement coefficient가 0.67 미만이면 합의 실패로 판정하고 재실행합니다.",
  },
  {
    tier: 6,
    title: "Calibration",
    items: ["Golden Set", "per-axis ±0.5", "threshold 80.0"],
    accent: "#60A5FA",
    description: "전문가 주석 Golden Set과 비교하여 분석 정확도를 검증합니다. 축별 허용 오차 ±0.5, 전체 통과 기준 80.0점입니다.",
  },
];

/* ── Agentic Safety (Autonomous Agent — Input Gating) ── */
const agenticLayers = [
  {
    tier: 1,
    title: "Tool Classification",
    items: ["SAFE 13 (auto)", "STANDARD 25 (auto)", "WRITE 10 (gate)", "EXPENSIVE 3 ($)", "DANGEROUS 1 (bash)"],
    accent: "#4ECDC4",
    description: "52개 도구를 5단계로 분류합니다. SAFE/STANDARD는 자동 실행, WRITE/EXPENSIVE/DANGEROUS는 사용자 승인. Action Summary로 도구별 결정적 요약을 제공합니다.",
  },
  {
    tier: 2,
    title: "HITL [Y/n/A]",
    items: ["Y: 1회 승인", "N: 거부 (Ctrl+C 포함)", "A: 세션 전체 Always"],
    accent: "#818CF8",
    description: "모든 승인 프롬프트에 [Y/n/A] 3선택지. A 응답 시 해당 카테고리(bash, write, cost, mcp:서버)가 세션 내 자동 승인. approval_history.jsonl에 결정 이력을 기록하고, 5회 연속 승인 시 자동 승인을 제안합니다.",
  },
  {
    tier: 3,
    title: "HITL Levels (0/1/2)",
    items: ["Level 0: 전체 자율", "Level 1: WRITE만 승인", "Level 2: 전체 승인 (기본값)"],
    accent: "#60A5FA",
    description: "hitl_level로 승인 강도를 3단계 제어합니다. Level 0은 Headless/Scheduler에서 사용(hitl_level=0), Level 2가 REPL 기본값. SubAgent는 STANDARD 도구에 한해 auto_approve=True.",
  },
  {
    tier: 4,
    title: "Bash 3-Layer",
    items: ["41 safe prefixes (auto)", "9 blocking patterns", "non-safe → [Y/n/A]"],
    accent: "#E87080",
    description: "Layer 1: rm -rf /, sudo 등 9개 위험 패턴 무조건 차단. Layer 2: cat, ls, git log 등 41개 읽기 전용 접두사 자동 승인. Layer 3: 나머지 명령 [Y/n/A] 승인. 자원 제한(CPU 30s, FSIZE 50MB).",
  },
  {
    tier: 5,
    title: "Cost + MCP Gate",
    items: ["analyze_ip $1.50", "batch $5.00", "MCP per-server 1회", "steam/arxiv auto"],
    accent: "#F5C542",
    description: "EXPENSIVE 도구는 실행 전 비용 표시 후 [Y/n/A] 확인. MCP는 서버별 첫 호출 시 승인, 이후 세션 내 캐시. steam, arxiv, linkedin-reader는 사전 승인.",
  },
];

/* ── Concentric Rings (Onion) ── */
function OnionDiagram({
  layers,
  activeLayer,
  onHover,
}: {
  layers: typeof pipelineLayers;
  activeLayer: number;
  onHover: (i: number) => void;
}) {
  const SIZE = 300;
  const CX = SIZE / 2;
  const CY = SIZE / 2;
  const count = layers.length;
  // Generate radii dynamically based on layer count
  const baseR = 30;
  const step = count <= 5 ? 24 : 20;
  const radii = layers.map((_, i) => baseR + i * step);

  return (
    <div className="relative mx-auto" style={{ width: SIZE, height: SIZE }}>
      <svg viewBox={`0 0 ${SIZE} ${SIZE}`} className="w-full h-full">
        {layers
          .slice()
          .reverse()
          .map((layer, ri) => {
            const i = count - 1 - ri;
            const r = radii[i];
            const isActive = activeLayer === i;

            return (
              <g key={layer.tier}>
                <circle
                  cx={CX}
                  cy={CY}
                  r={r}
                  fill={isActive ? layer.accent : "transparent"}
                  fillOpacity={isActive ? 0.06 : 0}
                  stroke={layer.accent}
                  strokeWidth={isActive ? 1.5 : 0.6}
                  strokeOpacity={isActive ? 0.6 : 0.2}
                  style={{ transition: "all 0.4s ease", cursor: "pointer" }}
                  onMouseEnter={() => onHover(i)}
                />
                <text
                  x={CX}
                  y={CY - r + 12}
                  textAnchor="middle"
                  fill={layer.accent}
                  fontSize={8}
                  fontFamily="ui-monospace, monospace"
                  fontWeight={600}
                  opacity={isActive ? 0.9 : 0.25}
                  style={{ transition: "opacity 0.3s", pointerEvents: "none" }}
                >
                  L{layer.tier}
                </text>
              </g>
            );
          })}

        {/* Center pulse */}
        <circle cx={CX} cy={CY} r={0} fill="none" stroke="#34D399" strokeWidth={0.8} strokeOpacity={0}>
          <animate attributeName="r" values="0;{radii[radii.length - 1]}" dur="4s" repeatCount="indefinite" />
          <animate attributeName="stroke-opacity" values="0.15;0" dur="4s" repeatCount="indefinite" />
        </circle>

        <text x={CX} y={CY - 5} textAnchor="middle" fill="white" fillOpacity={0.3} fontSize={9} fontFamily="ui-monospace, monospace">
          Agent
        </text>
        <text x={CX} y={CY + 8} textAnchor="middle" fill="white" fillOpacity={0.25} fontSize={10} fontFamily="ui-monospace, monospace" fontWeight={600}>
          Output
        </text>
      </svg>
    </div>
  );
}

/* ── Ratchet Workflow (Dev Quality) ── */
const ratchetSteps = [
  { id: 0, name: "Board + Worktree",  color: "#818CF8", desc: "Backlog → In Progress. git worktree로 격리 환경 할당. .owner 파일로 세션 소유권 보장." },
  { id: 1, name: "GAP Audit",         color: "#60A5FA", desc: "코드 실측으로 이미 구현된 항목 제거. Fully/Partially/Not Implemented 3분류." },
  { id: 2, name: "Plan + Socratic",   color: "#4ECDC4", desc: "Socratic 5Q 게이트. Q1 이미 존재? Q2 안 하면 뭐가 깨져? Q3 측정 가능? Q4 최소 구현? Q5 3+ 시스템 공통?" },
  { id: 3, name: "Implement + Test",  color: "#34D399", desc: "코드 변경 → 3 Quality Gates 반복. ruff(lint 0) + mypy(type 0) + pytest(3,344+ pass)." },
  { id: 4, name: "E2E Verify",        color: "#F5C542", desc: "dry-run으로 기존 결과 불변 확인. Cowboy Bebop A(68.4). 대규모 변경 시 4-persona 검증팀 투입." },
  { id: 5, name: "Docs-Sync",         color: "#C084FC", desc: "CHANGELOG + 4곳 버전 동기화(CHANGELOG, CLAUDE.md, README, pyproject.toml). 측정값 재검증." },
  { id: 6, name: "PR",                color: "#F4B8C8", desc: "feature → develop → main. HEREDOC PR. CI 5/5 필수. Why 근거 포함." },
  { id: 7, name: "Rebuild",           color: "#E87080", desc: "geode serve 종료 → uv tool install → 버전 확인 → serve 재시작." },
  { id: 8, name: "Board + Clear",     color: "#818CF8", desc: "In Progress → Done. 워크트리 정리. 컨텍스트 클리어." },
];

const qualityGates = [
  { gate: "Lint",  cmd: "uv run ruff check core/ tests/", criteria: "0 errors",    color: "#34D399" },
  { gate: "Type",  cmd: "uv run mypy core/",              criteria: "0 errors",    color: "#818CF8" },
  { gate: "Test",  cmd: 'uv run pytest tests/ -m "not live"', criteria: "3,344+ pass", color: "#4ECDC4" },
  { gate: "E2E",   cmd: 'geode analyze "Cowboy Bebop" --dry-run', criteria: "A (68.4)", color: "#F5C542" },
];

/* ── Section ── */
export function VerificationSection() {
  const [mode, setMode] = useState<"pipeline" | "agentic" | "ratchet">("pipeline");
  const [activeLayer, setActiveLayer] = useState(0);

  const layers = mode === "pipeline" ? pipelineLayers : agenticLayers;
  const active = layers[activeLayer];

  function switchMode(m: "pipeline" | "agentic" | "ratchet") {
    setMode(m);
    setActiveLayer(0);
  }

  return (
    <section className="relative py-28 sm:py-32 px-4 sm:px-6">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(52,211,153,0.015)_0%,transparent_60%)] pointer-events-none" />
      <div className="relative z-10 max-w-5xl mx-auto">
        {/* Geodi focus */}
        <div className="absolute top-8 right-8 opacity-[0.08] pointer-events-none hidden md:block">
          <img src="/portfolio/images/geode-focus.png" alt="" width={48} height={48} />
        </div>        <ScrollReveal>
          <p className="text-sm font-mono font-bold text-[#34D399]/60 uppercase tracking-[0.25em] mb-3">
            Verification
          </p>
          <h2 className="text-4xl font-bold tracking-tight text-white/90 mb-3">
            Dual Trust Model
          </h2>
          <p className="text-[#A0B4D4] max-w-lg mb-8 leading-relaxed">
            GEODE는 두 가지 신뢰 모델을 병행합니다.
            자율 에이전트는 <span className="text-[#4ECDC4]/80">실행 전 입력을 차단</span>하고,
            분석 파이프라인은 <span className="text-[#C084FC]/80">실행 후 출력을 검증</span>합니다.
          </p>
        </ScrollReveal>

        {/* Mode switcher */}
        <ScrollReveal delay={0.05}>
          <TabBar
            variant="pill"
            tabs={[
              { id: "agentic", label: "Agentic Safety", color: "#4ECDC4" },
              { id: "pipeline", label: "Pipeline Verification", color: "#C084FC" },
              { id: "ratchet", label: "Ratchet", color: "#F5C542" },
            ]}
            activeId={mode}
            onSelect={(id) => switchMode(id as "pipeline" | "agentic" | "ratchet")}
          />
        </ScrollReveal>

        {mode !== "ratchet" ? (
          <ScrollReveal delay={0.1}>
            <div className="grid grid-cols-1 md:grid-cols-[260px_1fr] gap-8 items-center">
              {/* Left — Onion diagram */}
              <OnionDiagram layers={layers} activeLayer={activeLayer} onHover={setActiveLayer} />

              {/* Right — Active layer detail */}
              <div className="space-y-4">
                {/* Layer selector tabs */}
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {layers.map((layer, i) => (
                    <button
                      key={layer.tier}
                      onMouseEnter={() => setActiveLayer(i)}
                      onClick={() => setActiveLayer(i)}
                      className="px-2.5 py-1.5 rounded-lg text-[10px] font-mono font-bold transition-all duration-300"
                      style={{
                        color: activeLayer === i ? active.accent : "#5A6A8A",
                        background: activeLayer === i ? `${layer.accent}10` : "transparent",
                        border: `1px solid ${activeLayer === i ? `${layer.accent}25` : "transparent"}`,
                      }}
                    >
                      L{layer.tier}
                    </button>
                  ))}
                </div>

                {/* Detail card */}
                <div
                  className="rounded-xl border px-5 py-4 transition-all duration-300"
                  style={{
                    borderColor: `${active.accent}15`,
                    background: `linear-gradient(135deg, ${active.accent}05, transparent 60%)`,
                  }}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <span className="font-semibold text-sm" style={{ color: `${active.accent}D0` }}>
                      {active.title}
                    </span>
                  </div>
                  <p className="text-sm text-[#A0B4D4] leading-relaxed mb-3">
                    {active.description}
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {active.items.map((item) => (
                      <span
                        key={item}
                        className="px-2 py-0.5 rounded text-[11px] font-mono"
                        style={{
                          color: `${active.accent}80`,
                          background: `${active.accent}08`,
                          border: `1px solid ${active.accent}15`,
                        }}
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </ScrollReveal>
        ) : (
          /* ── Ratchet Workflow ── */
          <ScrollReveal delay={0.1}>
            <div>
              {/* Workflow pipeline SVG */}
              <div className="overflow-x-auto -mx-4 px-4 pb-2 mb-8">
                <svg viewBox="0 0 820 80" className="w-full min-w-[700px]" style={{ maxHeight: 100 }}>
                  {ratchetSteps.map((s, i) => {
                    const x = 5 + i * 90;
                    return (
                      <g key={s.id}>
                        <rect x={x} y={18} width={78} height={38} rx={8}
                          fill="#0C1220" stroke={s.color} strokeWidth={0.8} strokeOpacity={0.45} />
                        <text x={x + 39} y={34} textAnchor="middle" fill={s.color}
                          fontSize={7} fontFamily="ui-monospace, monospace" fontWeight={700}>
                          {s.id}
                        </text>
                        <text x={x + 39} y={47} textAnchor="middle" fill={s.color} fillOpacity={0.6}
                          fontSize={6.5} fontFamily="ui-monospace, monospace">
                          {s.name.length > 12 ? s.name.split(" ").slice(0, 2).join(" ") : s.name}
                        </text>
                        {i < 8 && (
                          <path d={`M${x + 78},37 L${x + 83},37`}
                            stroke="white" strokeOpacity={0.15} strokeWidth={0.8} />
                        )}
                      </g>
                    );
                  })}
                  {/* Loopback: 8 → 0 */}
                  <path d="M815,56 C820,70 5,70 5,56" fill="none"
                    stroke="#F5C542" strokeOpacity={0.2} strokeWidth={0.8} strokeDasharray="3 2" />
                  <text x={410} y={75} textAnchor="middle" fill="#F5C542" fillOpacity={0.35}
                    fontSize={6} fontFamily="ui-monospace, monospace">next iteration</text>
                </svg>
              </div>

              {/* Step details */}
              <div className="space-y-2 mb-8">
                {ratchetSteps.map((s) => (
                  <div key={s.id} className="flex items-start gap-3 px-4 py-2.5 rounded-lg border border-white/[0.04]"
                    style={{ background: `${s.color}03` }}>
                    <span className="shrink-0 w-6 h-6 rounded flex items-center justify-center text-[10px] font-mono font-bold"
                      style={{ color: s.color, background: `${s.color}10` }}>{s.id}</span>
                    <span className="text-sm font-medium text-white/70 w-[130px] sm:w-[150px] shrink-0">{s.name}</span>
                    <span className="text-sm text-[#9BB0CC]">{s.desc}</span>
                  </div>
                ))}
              </div>

              {/* Quality Gates */}
              <div className="rounded-xl border border-white/[0.04] px-5 py-4">
                <div className="text-sm font-semibold text-white/70 mb-3">Quality Gates (Step 3 반복)</div>
                <div className="space-y-2">
                  {qualityGates.map((g) => (
                    <div key={g.gate} className="flex items-center gap-4 px-3 py-2 rounded-lg border border-white/[0.03]"
                      style={{ background: `${g.color}03` }}>
                      <span className="shrink-0 w-10 text-center text-xs font-mono font-bold" style={{ color: g.color }}>{g.gate}</span>
                      <code className="text-xs font-mono text-white/40 flex-1">{g.cmd}</code>
                      <span className="shrink-0 text-xs font-mono font-bold" style={{ color: g.color }}>{g.criteria}</span>
                    </div>
                  ))}
                </div>
                <p className="text-xs text-[#9BB0CC] font-mono mt-3">
                  CANNOT: lint/type/test 실패 상태로 커밋 금지. 플레이스홀더(XXXX) 금지. 측정값만 기록.
                </p>
              </div>
            </div>
          </ScrollReveal>
        )}
      </div>
    </section>
  );
}
