"use client";

import { useState } from "react";
import { ScrollReveal } from "../scroll-reveal";

/* ── PSM 6-Weight Components ── */
const weights = [
  { name: "Exposure Lift", w: 0.25, color: "#F5C542" },
  { name: "Quality", w: 0.20, color: "#818CF8" },
  { name: "Recovery", w: 0.18, color: "#4ECDC4" },
  { name: "Growth", w: 0.12, color: "#34D399" },
  { name: "Momentum", w: 0.20, color: "#C084FC" },
  { name: "Developer", w: 0.05, color: "#60A5FA" },
];

/* ── Tiers ── */
const tiers = [
  { tier: "S", threshold: "≥ 80", color: "#F5C542" },
  { tier: "A", threshold: "≥ 60", color: "#818CF8" },
  { tier: "B", threshold: "≥ 40", color: "#4ECDC4" },
  { tier: "C", threshold: "< 40", color: "#5A6A8A" },
];

/* ── 14-axis evaluators ── */
const evaluators = [
  { name: "Quality Judge", axes: 8, labels: "A–C, B1, C1–C2, M, N", color: "#818CF8" },
  { name: "Hidden Value", axes: 3, labels: "D, E, F", color: "#4ECDC4" },
  { name: "Community Momentum", axes: 3, labels: "J, K, L", color: "#C084FC" },
];

export function ScoringSection() {
  return (
    <section className="relative py-28 sm:py-32 px-4 sm:px-6">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(245,197,66,0.015)_0%,transparent_60%)] pointer-events-none" />
      <div className="relative z-10 max-w-5xl mx-auto">
        <ScrollReveal>
          <p className="text-sm font-mono font-bold text-[#F5C542]/60 uppercase tracking-[0.25em] mb-3">
            Scoring
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white/90 mb-2">
            PSM 6-Weight Composite
          </h2>
          <p className="text-lg text-white/40 font-semibold mb-4">14축 루브릭 × 3 Evaluator</p>
          <p className="text-sm sm:text-base text-[#8B9CC0] max-w-xl mb-10 leading-relaxed">
            4명의 Analyst가 Send API clean context(이전 분석 결과를 보지 않는 격리 환경)에서 14축을 독립 평가하고,
            3명의 Evaluator가 교차 집계합니다. 6개 가중치로 합산 후 Confidence Multiplier(0.7 + 0.3 × confidence/100)를 적용하여 Tier를 산출합니다.
            confidence &lt; 0.7이면 Gather 노드로 loopback하여 최대 5회 반복합니다.
          </p>
        </ScrollReveal>

        {/* ── Radar-style weight visualization ── */}
        <ScrollReveal delay={0.1}>
          <div className="grid grid-cols-1 md:grid-cols-[1fr_1fr] gap-8 mb-8">
            {/* SVG radar-like chart */}
            <div className="flex justify-center">
              <svg viewBox="0 0 300 300" className="w-full max-w-[280px]">
                {/* Radar sweep animation */}
                <circle cx={150} cy={150} r={0} fill="none" stroke="#818CF8" strokeWidth={1} strokeOpacity={0}>
                  <animate attributeName="r" values="0;110" dur="3s" repeatCount="indefinite" />
                  <animate attributeName="stroke-opacity" values="0.2;0" dur="3s" repeatCount="indefinite" />
                </circle>
                <circle cx={150} cy={150} r={0} fill="none" stroke="#4ECDC4" strokeWidth={0.8} strokeOpacity={0}>
                  <animate attributeName="r" values="0;110" dur="3s" begin="1.5s" repeatCount="indefinite" />
                  <animate attributeName="stroke-opacity" values="0.15;0" dur="3s" begin="1.5s" repeatCount="indefinite" />
                </circle>

                {/* Hexagonal grid */}
                {[0.33, 0.66, 1.0].map((scale) => (
                  <polygon
                    key={scale}
                    points={weights.map((_, i) => {
                      const angle = (Math.PI * 2 * i) / 6 - Math.PI / 2;
                      const r = 110 * scale;
                      return `${150 + r * Math.cos(angle)},${150 + r * Math.sin(angle)}`;
                    }).join(" ")}
                    fill="none" stroke="white" strokeOpacity={0.06} strokeWidth={1}
                  />
                ))}
                {/* Axis lines */}
                {weights.map((_, i) => {
                  const angle = (Math.PI * 2 * i) / 6 - Math.PI / 2;
                  return (
                    <line key={i} x1={150} y1={150} x2={150 + 110 * Math.cos(angle)} y2={150 + 110 * Math.sin(angle)} stroke="white" strokeOpacity={0.06} strokeWidth={1} />
                  );
                })}
                {/* Weight fill polygon */}
                <polygon
                  points={weights.map((w, i) => {
                    const angle = (Math.PI * 2 * i) / 6 - Math.PI / 2;
                    const r = 110 * (w.w / 0.25);
                    return `${150 + r * Math.cos(angle)},${150 + r * Math.sin(angle)}`;
                  }).join(" ")}
                  fill="#818CF8" fillOpacity={0.12} stroke="#818CF8" strokeOpacity={0.4} strokeWidth={1.5}
                />
                {/* Weight vertex dots */}
                {weights.map((w, i) => {
                  const angle = (Math.PI * 2 * i) / 6 - Math.PI / 2;
                  const r = 110 * (w.w / 0.25);
                  return (
                    <circle key={`dot-${i}`} cx={150 + r * Math.cos(angle)} cy={150 + r * Math.sin(angle)} r={3} fill={w.color} fillOpacity={0.6} />
                  );
                })}
                {/* Labels */}
                {weights.map((w, i) => {
                  const angle = (Math.PI * 2 * i) / 6 - Math.PI / 2;
                  const lx = 150 + 130 * Math.cos(angle);
                  const ly = 150 + 130 * Math.sin(angle);
                  return (
                    <g key={w.name}>
                      <text x={lx} y={ly - 5} textAnchor="middle" fill={w.color} fontSize={9} fontFamily="ui-monospace, monospace" fontWeight={600}>{w.name}</text>
                      <text x={lx} y={ly + 8} textAnchor="middle" fill={w.color} fillOpacity={0.4} fontSize={10} fontFamily="ui-monospace, monospace" fontWeight={700}>{(w.w * 100).toFixed(0)}%</text>
                    </g>
                  );
                })}
              </svg>
            </div>

            {/* Formula + Tiers */}
            <div className="space-y-5">
              <div className="rounded-xl border border-white/[0.04] px-5 py-4">
                <div className="text-xs font-mono text-[#7A8CA8] mb-2">Composite Formula</div>
                <code className="text-sm text-white/70 leading-relaxed block">
                  Base = Σ(weight<sub>i</sub> × score<sub>i</sub>)<br />
                  Final = Base × (0.7 + 0.3 × confidence/100)
                </code>
              </div>
              <div className="flex gap-2">
                {tiers.map((t) => (
                  <div key={t.tier} className="flex-1 text-center px-3 py-2.5 rounded-lg border border-white/[0.04]">
                    <div className="text-xl font-bold" style={{ color: t.color }}>{t.tier}</div>
                    <div className="text-[11px] font-mono text-[#7A8CA8]">{t.threshold}</div>
                  </div>
                ))}
              </div>
              <div className="space-y-2">
                {evaluators.map((e) => (
                  <div key={e.name} className="flex items-center gap-3 px-4 py-2 rounded-lg border border-white/[0.04]" style={{ background: `${e.color}03` }}>
                    <span className="text-sm font-semibold" style={{ color: e.color }}>{e.name}</span>
                    <span className="text-xs text-[#7A8CA8]">{e.axes}축 ({e.labels})</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </ScrollReveal>

        {/* Fixture results */}
        <ScrollReveal delay={0.2}>
          <div className="mt-8 rounded-xl border border-white/[0.04] px-5 py-4">
            <div className="text-sm font-semibold text-white/70 mb-3">Fixture 분석 결과</div>
            <div className="space-y-2 font-mono text-sm">
              {[
                { name: "Berserk", score: "81.2", tier: "S", color: "#F5C542" },
                { name: "Cowboy Bebop", score: "68.4", tier: "A", color: "#818CF8" },
                { name: "Ghost in the Shell", score: "51.7", tier: "B", color: "#4ECDC4" },
              ].map((f) => (
                <div key={f.name} className="flex items-center justify-between px-3 py-2 rounded-lg border border-white/[0.03]">
                  <span className="text-white/60">{f.name}</span>
                  <div className="flex items-center gap-3">
                    <span style={{ color: f.color }} className="font-bold">{f.score}</span>
                    <span className="text-xs px-1.5 py-0.5 rounded" style={{ color: f.color, background: `${f.color}12` }}>{f.tier}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
