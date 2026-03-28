"use client";

import { useState } from "react";
import { ScrollReveal } from "../scroll-reveal";


/* ── GameIP Pipeline DAG (9-node, code-verified) ── */
function PipelineDag() {
  const W = 840;
  const H = 260;
  const yMid = 120;
  const nR = 26; // node radius
  const aR = 22; // analyst radius

  // X positions for main flow
  const xRouter = 45;
  const xSignals = 135;
  const xAnalysts = 270;
  const xEval = 400;
  const xScoring = 500;
  const xVerify = 600;
  const xSynth = 720;
  // Gather (loopback) shown as arc below

  // Analyst Y positions
  const aY = [35, 85, 140, 195];

  function edge(x1: number, y1: number, x2: number, y2: number) {
    const dx = (x2 - x1) * 0.4;
    return `M${x1},${y1} C${x1 + dx},${y1} ${x2 - dx},${y2} ${x2},${y2}`;
  }

  return (
    <div className="w-full overflow-x-auto -mx-6 px-6 pb-4">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full min-w-[640px]" style={{ maxHeight: 300 }}>
        <defs>
          <linearGradient id="nodeGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#121A2E" />
            <stop offset="100%" stopColor="#080E1A" />
          </linearGradient>
        </defs>        {/* ── Edges ── */}
        <g stroke="white" strokeOpacity={0.2} strokeWidth={1.2} fill="none">
          {/* Router → Signals */}
          <path d={`M${xRouter + nR},${yMid} C${(xRouter + nR + xSignals - nR) / 2},${yMid - 4} ${(xRouter + nR + xSignals - nR) / 2},${yMid - 4} ${xSignals - nR},${yMid}`} />
          {/* Signals → 4 Analysts (fan-out) */}
          {aY.map((y) => (
            <path key={`s-${y}`} d={edge(xSignals + nR, yMid, xAnalysts - aR, y)} />
          ))}
          {/* 4 Analysts → Evaluators (fan-in) */}
          {aY.map((y) => (
            <path key={`e-${y}`} d={edge(xAnalysts + aR, y, xEval - nR, yMid)} />
          ))}
          {/* Eval → Scoring → Verify → Synth */}
          <path d={`M${xEval + nR},${yMid} C${(xEval + nR + xScoring - nR) / 2},${yMid - 4} ${(xEval + nR + xScoring - nR) / 2},${yMid - 4} ${xScoring - nR},${yMid}`} />
          <path d={`M${xScoring + nR},${yMid} C${(xScoring + nR + xVerify - nR) / 2},${yMid - 4} ${(xScoring + nR + xVerify - nR) / 2},${yMid - 4} ${xVerify - nR},${yMid}`} />
          <path d={`M${xVerify + nR},${yMid} C${(xVerify + nR + xSynth - nR) / 2},${yMid - 4} ${(xVerify + nR + xSynth - nR) / 2},${yMid - 4} ${xSynth - nR},${yMid}`} stroke="#34D399" strokeOpacity={0.2} />
        </g>

        {/* Confidence loopback: Verify → Gather → Signals */}
        <path
          d={`M${xVerify},${yMid + nR + 4} C${xVerify},${yMid + 65} ${xSignals},${yMid + 65} ${xSignals},${yMid + nR + 4}`}
          fill="none" stroke="#E87080" strokeOpacity={0.15} strokeWidth={1} strokeDasharray="4 4" className="animate-flow"
        />
        <text x={(xVerify + xSignals) / 2} y={yMid + 72} textAnchor="middle" fill="#E87080" fillOpacity={0.45} fontSize={9} fontFamily="ui-monospace, monospace">
          confidence &lt; 0.7 → gather → loopback (max 5)
        </text>

        {/* Labels */}
        <text x={(xSignals + xAnalysts) / 2} y={14} textAnchor="middle" fill="#F5C542" fillOpacity={0.45} fontSize={9} fontFamily="ui-monospace, monospace">Send API (fan-out ×4)</text>
        <text x={(xAnalysts + xEval) / 2} y={14} textAnchor="middle" fill="#818CF8" fillOpacity={0.45} fontSize={9} fontFamily="ui-monospace, monospace">fan-in ×3</text>

        {/* ── Nodes ── */}
        {/* Router */}
        <circle cx={xRouter} cy={yMid} r={nR} fill="url(#nodeGrad)" stroke="#4ECDC4" strokeWidth={1} strokeOpacity={0.4} />
        <text x={xRouter} y={yMid - 2} textAnchor="middle" fill="#4ECDC4" fontSize={9} fontFamily="ui-monospace, monospace" fontWeight={600}>Router</text>
        <text x={xRouter} y={yMid + 10} textAnchor="middle" fill="#7A8CA8" fontSize={8} fontFamily="ui-monospace, monospace">Memory</text>

        {/* Signals */}
        <circle cx={xSignals} cy={yMid} r={nR} fill="url(#nodeGrad)" stroke="#F5C542" strokeWidth={1} strokeOpacity={0.4} />
        <text x={xSignals} y={yMid - 2} textAnchor="middle" fill="#F5C542" fontSize={9} fontFamily="ui-monospace, monospace" fontWeight={600}>Signals</text>
        <text x={xSignals} y={yMid + 10} textAnchor="middle" fill="#7A8CA8" fontSize={8} fontFamily="ui-monospace, monospace">MCP</text>

        {/* 4 Analysts */}
        {["Market", "Creative", "Audience", "Risk"].map((name, i) => (
          <g key={name}>
            <circle cx={xAnalysts} cy={aY[i]} r={aR} fill="url(#nodeGrad)" stroke="#F5C542" strokeWidth={0.7} strokeOpacity={0.35} />
            <text x={xAnalysts} y={aY[i] + 1} textAnchor="middle" dominantBaseline="central" fill="#F5C542" fillOpacity={0.8} fontSize={8} fontFamily="ui-monospace, monospace" fontWeight={600}>{name}</text>
          </g>
        ))}

        {/* Evaluators */}
        <circle cx={xEval} cy={yMid} r={nR} fill="url(#nodeGrad)" stroke="#818CF8" strokeWidth={1} strokeOpacity={0.4} />
        <text x={xEval} y={yMid - 2} textAnchor="middle" fill="#818CF8" fontSize={9} fontFamily="ui-monospace, monospace" fontWeight={600}>Eval ×3</text>
        <text x={xEval} y={yMid + 10} textAnchor="middle" fill="#7A8CA8" fontSize={8} fontFamily="ui-monospace, monospace">Cross</text>

        {/* Scoring */}
        <circle cx={xScoring} cy={yMid} r={nR} fill="url(#nodeGrad)" stroke="#C084FC" strokeWidth={1} strokeOpacity={0.4} />
        <text x={xScoring} y={yMid - 2} textAnchor="middle" fill="#C084FC" fontSize={9} fontFamily="ui-monospace, monospace" fontWeight={600}>Scoring</text>
        <text x={xScoring} y={yMid + 10} textAnchor="middle" fill="#7A8CA8" fontSize={8} fontFamily="ui-monospace, monospace">PSM</text>

        {/* Verification */}
        <circle cx={xVerify} cy={yMid} r={nR} fill="url(#nodeGrad)" stroke="#34D399" strokeWidth={1} strokeOpacity={0.4} />
        <text x={xVerify} y={yMid - 2} textAnchor="middle" fill="#34D399" fontSize={9} fontFamily="ui-monospace, monospace" fontWeight={600}>Verify</text>
        <text x={xVerify} y={yMid + 10} textAnchor="middle" fill="#7A8CA8" fontSize={8} fontFamily="ui-monospace, monospace">6-Layer</text>

        {/* Synthesizer */}
        <circle cx={xSynth} cy={yMid} r={nR} fill="url(#nodeGrad)" stroke="#F4B8C8" strokeWidth={1} strokeOpacity={0.4} />
        <text x={xSynth} y={yMid - 2} textAnchor="middle" fill="#F4B8C8" fontSize={9} fontFamily="ui-monospace, monospace" fontWeight={600}>Synth</text>
        <text x={xSynth} y={yMid + 10} textAnchor="middle" fill="#7A8CA8" fontSize={8} fontFamily="ui-monospace, monospace">Report</text>
      </svg>
    </div>
  );
}

/* ── REODE DAGs (3 pipelines) ── */
type ReodePipeline = "migration" | "spring" | "porting";

function ReodeDag() {
  const [pipe, setPipe] = useState<ReodePipeline>("spring");

  return (
    <div>
      {/* Sub-toggle */}
      <div className="flex gap-1.5 mb-3">
        {([
          { id: "spring" as ReodePipeline, label: "Spring Migration", sub: "7-node + startup_verify" },
          { id: "migration" as ReodePipeline, label: "Migration", sub: "6-node" },
          { id: "porting" as ReodePipeline, label: "Porting", sub: "4-node" },
        ]).map((p) => (
          <button key={p.id} onClick={() => setPipe(p.id)}
            className="px-2.5 py-1 rounded text-[10px] font-mono transition-all duration-200"
            style={{
              color: pipe === p.id ? "#34D399" : "#5A6A8A",
              background: pipe === p.id ? "rgba(52,211,153,0.06)" : "transparent",
              border: `1px solid ${pipe === p.id ? "rgba(52,211,153,0.15)" : "transparent"}`,
            }}
          >
            {p.label}
          </button>
        ))}
      </div>

      {/* Spring Migration — 7-node with startup_verify */}
      {pipe === "spring" && (
        <div className="w-full overflow-x-auto -mx-6 px-6 pb-4">
          <svg viewBox="0 0 840 230" className="w-full min-w-[640px]" style={{ maxHeight: 270 }}>
            {/* Main flow edges */}
            {[
              [80, 175], [195, 290], [310, 405], [425, 520], [540, 640], [660, 755],
            ].map(([x1, x2], i) => (
              <path key={`se-${i}`} d={`M${x1},115 C${(x1 + x2) / 2},108 ${(x1 + x2) / 2},108 ${x2},115`} stroke="white" strokeOpacity={0.22} strokeWidth={1.2} fill="none" />
            ))}
            {/* Fix → Transform loopback */}
            <path d="M530,88 C530,45 310,40 310,88" stroke="#E87080" strokeOpacity={0.25} strokeWidth={1.2} strokeDasharray="5 4" fill="none" className="animate-flow" />
            <text x={420} y={38} textAnchor="middle" fill="#E87080" fillOpacity={0.45} fontSize={9} fontFamily="ui-monospace, monospace">fix loop</text>
            {/* Startup → Fix (fail) */}
            <path d="M640,88 C640,55 545,55 545,88" stroke="#F5C542" strokeOpacity={0.25} strokeWidth={1} strokeDasharray="4 3" fill="none" />

            {/* Nodes — r=28, consistent sizing */}
            {[
              { x: 55, label: "Assess", sub: "Spring", color: "#60A5FA" },
              { x: 170, label: "Plan", sub: "Recipe", color: "#818CF8" },
              { x: 285, label: "Transform", sub: "Sonnet", color: "#4ECDC4" },
              { x: 400, label: "Validate", sub: "Haiku", color: "#F5C542" },
              { x: 515, label: "Fix", sub: "Architect", color: "#E87080" },
              { x: 630, label: "Startup", sub: "verify", color: "#34D399" },
              { x: 755, label: "Measure", sub: "score", color: "#34D399" },
            ].map((n) => (
              <g key={n.label}>
                <circle cx={n.x} cy={115} r={28} fill="#0C1220" stroke={n.color} strokeWidth={1} strokeOpacity={0.4} />
                <text x={n.x} y={112} textAnchor="middle" fill={n.color} fontSize={10} fontFamily="ui-monospace, monospace" fontWeight={700}>{n.label}</text>
                <text x={n.x} y={126} textAnchor="middle" fill={n.color} fillOpacity={0.4} fontSize={8} fontFamily="ui-monospace, monospace">{n.sub}</text>
              </g>
            ))}

            {/* 4-class routing */}
            <text x={460} y={180} textAnchor="middle" fill="white" fillOpacity={0.25} fontSize={9} fontFamily="ui-monospace, monospace">
              4-Class Error Routing: CONFIG · CODE · BEHAVIOR · ENV
            </text>
            <text x={630} y={200} textAnchor="middle" fill="#34D399" fillOpacity={0.35} fontSize={9} fontFamily="ui-monospace, monospace">
              startup_verify: java_app_start → health check → HTTP 200
            </text>
          </svg>
        </div>
      )}

      {/* Migration — 6-node */}
      {pipe === "migration" && (
        <div className="w-full overflow-x-auto -mx-6 px-6 pb-4">
          <svg viewBox="0 0 740 200" className="w-full min-w-[560px]" style={{ maxHeight: 240 }}>
            {/* Main flow */}
            {[
              [85, 195], [225, 335], [365, 475], [505, 600],
            ].map(([x1, x2], i) => (
              <path key={`me-${i}`} d={`M${x1},100 C${(x1 + x2) / 2},93 ${(x1 + x2) / 2},93 ${x2},100`} stroke="white" strokeOpacity={0.22} strokeWidth={1.2} fill="none" />
            ))}
            {/* Validate → Measure (success path) */}
            <path d="M505,100 C560,93 600,93 660,100" stroke="#34D399" strokeOpacity={0.22} strokeWidth={1.2} fill="none" />
            {/* Fix → Validate loopback */}
            <path d="M580,72 C580,40 460,35 460,72" stroke="#E87080" strokeOpacity={0.25} strokeWidth={1.2} strokeDasharray="5 4" fill="none" className="animate-flow" />
            <text x={520} y={30} textAnchor="middle" fill="#E87080" fillOpacity={0.45} fontSize={9} fontFamily="ui-monospace, monospace">fix loop</text>

            {/* Nodes */}
            {[
              { x: 60, label: "Assess", color: "#60A5FA" },
              { x: 200, label: "Plan", color: "#818CF8" },
              { x: 340, label: "Transform", color: "#4ECDC4" },
              { x: 480, label: "Validate", color: "#F5C542" },
              { x: 600, label: "Fix", color: "#E87080" },
              { x: 690, label: "Measure", color: "#34D399" },
            ].map((n) => (
              <g key={n.label}>
                <circle cx={n.x} cy={100} r={28} fill="#0C1220" stroke={n.color} strokeWidth={1} strokeOpacity={0.4} />
                <text x={n.x} y={104} textAnchor="middle" dominantBaseline="central" fill={n.color} fontSize={10} fontFamily="ui-monospace, monospace" fontWeight={700}>{n.label}</text>
              </g>
            ))}
            <text x={600} y={148} textAnchor="middle" fill="#E87080" fillOpacity={0.35} fontSize={9} fontFamily="ui-monospace, monospace">Architect → Editor</text>
          </svg>
        </div>
      )}

      {/* Porting — 4-node */}
      {pipe === "porting" && (
        <div className="w-full overflow-x-auto -mx-6 px-6 pb-4">
          <svg viewBox="0 0 580 180" className="w-full min-w-[440px]" style={{ maxHeight: 220 }}>
            {/* Main flow */}
            {[
              [95, 195], [280, 370], [460, 520],
            ].map(([x1, x2], i) => (
              <path key={`pe-${i}`} d={`M${x1},90 C${(x1 + x2) / 2},83 ${(x1 + x2) / 2},83 ${x2},90`} stroke="white" strokeOpacity={0.22} strokeWidth={1.2} fill="none" />
            ))}
            {/* Retry loopback */}
            <path d="M420,62 C420,30 240,25 240,62" stroke="#4ECDC4" strokeOpacity={0.28} strokeWidth={1.2} strokeDasharray="5 4" fill="none" className="animate-flow" />
            <text x={330} y={22} textAnchor="middle" fill="#4ECDC4" fillOpacity={0.4} fontSize={9} fontFamily="ui-monospace, monospace">retry loop</text>

            {/* Nodes */}
            {[
              { x: 65, label: "Analyze", color: "#60A5FA" },
              { x: 235, label: "Map Types", color: "#818CF8" },
              { x: 405, label: "Generate", color: "#4ECDC4" },
              { x: 535, label: "Verify", color: "#34D399" },
            ].map((n) => (
              <g key={n.label}>
                <circle cx={n.x} cy={90} r={28} fill="#0C1220" stroke={n.color} strokeWidth={1} strokeOpacity={0.4} />
                <text x={n.x} y={94} textAnchor="middle" dominantBaseline="central" fill={n.color} fontSize={10} fontFamily="ui-monospace, monospace" fontWeight={700}>{n.label}</text>
              </g>
            ))}
            <text x={290} y={150} textAnchor="middle" fill="white" fillOpacity={0.25} fontSize={9} fontFamily="ui-monospace, monospace">Language Porting: Java ↔ Go ↔ Python</text>
          </svg>
        </div>
      )}
    </div>
  );
}

/* ── DAG Viewer with toggle ── */
function DagViewer() {
  const [activeDag, setActiveDag] = useState<"gameip" | "reode">("gameip");

  return (
    <ScrollReveal delay={0.2}>
      <div className="flex gap-2 mb-4">
        <button
          onClick={() => setActiveDag("gameip")}
          className="px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all duration-300"
          style={{
            color: activeDag === "gameip" ? "#C084FC" : "#5A6A8A",
            background: activeDag === "gameip" ? "rgba(192,132,252,0.08)" : "transparent",
            border: `1px solid ${activeDag === "gameip" ? "rgba(192,132,252,0.2)" : "rgba(255,255,255,0.04)"}`,
          }}
        >
          GameIP DAG
          <span className="ml-2 text-[10px] opacity-50">7-node fan-out/in</span>
        </button>
        <button
          onClick={() => setActiveDag("reode")}
          className="px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all duration-300"
          style={{
            color: activeDag === "reode" ? "#34D399" : "#5A6A8A",
            background: activeDag === "reode" ? "rgba(52,211,153,0.08)" : "transparent",
            border: `1px solid ${activeDag === "reode" ? "rgba(52,211,153,0.2)" : "rgba(255,255,255,0.04)"}`,
          }}
        >
          REODE DAG
          <span className="ml-2 text-[10px] opacity-50">6-node fix loop</span>
        </button>
      </div>

      {activeDag === "gameip" && <PipelineDag />}
      {activeDag === "reode" && <ReodeDag />}
    </ScrollReveal>
  );
}

export function DomainDagSection() {
  return (
    <section className="relative py-32 px-6 overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(192,132,252,0.02)_0%,transparent_70%)] pointer-events-none" />

      <div className="relative z-10 max-w-5xl mx-auto">
        {/* Geodi discover */}
        <div className="absolute top-8 right-8 opacity-[0.08] pointer-events-none hidden md:block">
          <img src="/portfolio/images/geode-discover.png" alt="" width={48} height={48} />
        </div>        <ScrollReveal>
          <p className="text-sm font-mono font-bold text-[#C084FC]/60 uppercase tracking-[0.25em] mb-3">
            L5 Domain Plugin
          </p>
          <h2 className="text-4xl font-bold tracking-tight text-white/90 mb-3">
            DomainPort Protocol
          </h2>
          <p className="text-[#8B9CC0] max-w-xl mb-4 leading-relaxed">
            파이프라인은 <span className="text-white/70 font-medium">교체 가능한 플러그인</span>입니다.
            DomainPort 프로토콜을 구현하기만 하면, 어떤 분석 도메인이든
            GEODE Runtime 위에서 동일한 자율 실행 흐름을 탑니다.
          </p>
        </ScrollReveal>

        {/* Two domain plugins */}
        <ScrollReveal delay={0.1}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-12">
            {/* GameIP — active plugin */}
            <div className="rounded-xl border border-[#C084FC]/10 bg-[#C084FC]/[0.02] p-6">
              <div className="flex items-center gap-2 mb-3">
                <span className="px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-[#C084FC]/10 text-[#C084FC]/80 border border-[#C084FC]/20">
                  ACTIVE
                </span>
                <span className="text-sm font-semibold text-white/80">GameIPDomain</span>
              </div>
              <p className="text-sm text-[#8B9CC0] leading-relaxed mb-4">
                게임/IP 저평가 분석 파이프라인.
                14축 루브릭 다면 평가 + PSM 인과추론 6종 원인 분류.
                LangGraph StateGraph 기반 7-node DAG.
              </p>
              <div className="space-y-1.5 font-mono text-[11px]">
                <div className="flex justify-between">
                  <span className="text-white/50">Berserk</span>
                  <span><span className="text-[#F5C542]">81.2</span> <span className="text-[#7A8CA8]">S</span></span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/50">Cowboy Bebop</span>
                  <span><span className="text-[#818CF8]">68.4</span> <span className="text-[#7A8CA8]">A</span></span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/50">Ghost in the Shell</span>
                  <span><span className="text-[#4ECDC4]">51.7</span> <span className="text-[#7A8CA8]">B</span></span>
                </div>
              </div>
            </div>

            {/* REODE — domain pivot */}
            <div className="rounded-xl border border-[#34D399]/10 bg-[#34D399]/[0.02] p-6">
              <div className="flex items-center gap-2 mb-3">
                <span className="px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-[#34D399]/10 text-[#34D399]/80 border border-[#34D399]/20">
                  PIVOT
                </span>
                <span className="text-sm font-semibold text-white/80">REODE</span>
              </div>
              <p className="text-sm text-[#8B9CC0] leading-relaxed mb-4">
                Java 1.8→22 + Spring 4.3→6.1 자동 마이그레이션.
                5,523파일 엔터프라이즈 프로젝트 83/83 테스트 통과.
                에러 4분류 라우팅 + Architect/Editor 분리.
                5시간 30분, 1,153턴 자율 수행.
              </p>
              <div className="flex flex-wrap gap-1.5">
                {["DomainPort", "4-Class Router", "Architect/Editor", "83/83 pass"].map((tag) => (
                  <span key={tag} className="px-2 py-0.5 rounded text-[10px] font-mono text-[#34D399]/60 bg-[#34D399]/5 border border-[#34D399]/10">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </ScrollReveal>

        {/* ── DAG Visualizations — toggle ── */}
        <DagViewer />
      </div>
    </section>
  );
}
