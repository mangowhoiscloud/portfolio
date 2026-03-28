"use client";

import { ScrollReveal } from "../scroll-reveal";

const phases = [
  { id: 1, name: "Collection", color: "#60A5FA", desc: "자동 스코어, 휴먼 레이팅, 전문가 피드백 수집. 통계적 파워 분석(최소 n=10, 권장 n=30)으로 충분한 샘플 확보.", detail: "auto scores + human ratings + expert feedback" },
  { id: 2, name: "Analysis", color: "#818CF8", desc: "Spearman 상관계수(파워 게이트: n<10이면 스킵) + CUSUM 드리프트 감지. 4개 메트릭(spearman_rho, human_llm_alpha, precision@10, tier_accuracy) 모니터링.", detail: "Spearman + CUSUM drift on 4 metrics" },
  { id: 3, name: "Improvement", color: "#F5C542", desc: "rho<0.5이면 가중치 재조정, 드리프트 감지 시 베이스라인 재보정 제안. 선택적 승인 게이트 적용 후 반영.", detail: "retune weights, recalibrate baselines" },
  { id: 4, name: "Validation", color: "#34D399", desc: "개선안의 기대 vs 실제 메트릭 향상 검증. 각 후보별 품질 기준 충족 여부 확인.", detail: "expected vs actual metric improvement" },
  { id: 5, name: "RLAIF", color: "#C084FC", desc: "AI 피드백이 휴먼 피드백을 보강. 전문가 레이팅으로 합성 선호 쌍 생성, 4개 헌법 원칙(정확성, 보정 일관성, 공정성, 투명성) 체크.", detail: "synthetic pairs + 4 constitutional checks" },
];

export function FeedbackSection() {
  return (
    <section className="relative py-28 sm:py-32 px-4 sm:px-6">
      <div className="relative z-10 max-w-5xl mx-auto">
        <ScrollReveal>
          <p className="text-sm font-mono font-bold text-[#F5C542]/60 uppercase tracking-[0.25em] mb-3">
            Feedback Loop
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white/90 mb-2">
            5-Phase Self-Improvement
          </h2>
          <p className="text-sm sm:text-base text-[#8B9CC0] max-w-xl mb-8 leading-relaxed">
            파이프라인 실행 결과를 수집, 분석, 개선, 검증, RLAIF 5단계로 순환하여
            스코어링 정확도를 자율적으로 개선합니다. 성공 시 ModelRegistry에 프로모션합니다.
          </p>
        </ScrollReveal>

        {/* 5-Phase SVG */}
        <ScrollReveal delay={0.1}>
          <div className="overflow-x-auto -mx-4 px-4 pb-2 mb-8">
            <svg viewBox="0 0 780 160" className="w-full min-w-[580px]" style={{ maxHeight: 190 }}>
              {phases.map((p, i) => {
                const x = 40 + i * 148;
                return (
                  <g key={p.id}>
                    <rect x={x} y={20} width={128} height={70} rx={10} fill="#0A0F1A" stroke={p.color} strokeWidth={0.8} strokeOpacity={0.3} />
                    <text x={x + 64} y={45} textAnchor="middle" fill={p.color} fontSize={11} fontFamily="ui-monospace, monospace" fontWeight={700}>{p.name}</text>
                    <text x={x + 64} y={62} textAnchor="middle" fill={p.color} fillOpacity={0.35} fontSize={8} fontFamily="ui-monospace, monospace">Phase {p.id}</text>
                    {i < 4 && (
                      <path d={`M${x + 128},55 C${x + 134},50 ${x + 142},50 ${x + 148},55`} stroke="white" strokeOpacity={0.12} strokeWidth={1} fill="none" />
                    )}
                  </g>
                );
              })}
              {/* Loopback */}
              <path d="M768,90 C770,130 400,140 40,130 C38,110 38,100 40,90" fill="none" stroke="#F5C542" strokeOpacity={0.12} strokeWidth={1} strokeDasharray="4 4" className="animate-flow" />
              <text x={404} y={135} textAnchor="middle" fill="#F5C542" fillOpacity={0.25} fontSize={9} fontFamily="ui-monospace, monospace">cycle → ModelRegistry promotion</text>
            </svg>
          </div>
        </ScrollReveal>

        {/* Phase details */}
        <ScrollReveal delay={0.15}>
          <div className="space-y-2">
            {phases.map((p) => (
              <div key={p.id} className="flex items-start gap-4 px-4 py-3 rounded-lg border border-white/[0.04]" style={{ background: `${p.color}03` }}>
                <span className="shrink-0 w-7 text-center text-[11px] font-mono font-bold mt-0.5" style={{ color: p.color }}>{p.id}</span>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-semibold text-white/80">{p.name}</span>
                    <span className="text-[10px] font-mono text-[#7A8CA8]">{p.detail}</span>
                  </div>
                  <p className="text-sm text-[#8B9CC0] leading-relaxed">{p.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </ScrollReveal>

        {/* CUSUM Drift Detection */}
        <ScrollReveal delay={0.2}>
          <div className="mt-8 rounded-xl border border-white/[0.04] px-5 py-4">
            <div className="text-sm font-semibold text-white/70 mb-3">CUSUM Drift Detection</div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
              {[
                { zone: "NONE", range: "< 2.5", color: "#34D399", desc: "정상. 드리프트 미감지." },
                { zone: "WARNING", range: "2.5 ~ 4.0", color: "#F5C542", desc: "모니터링 강화. PSI 0.10~0.25." },
                { zone: "CRITICAL", range: "≥ 4.0", color: "#E87080", desc: "DRIFT_DETECTED hook 발화. 재분석 트리거." },
              ].map((z) => (
                <div key={z.zone} className="rounded-lg border border-white/[0.04] px-4 py-3" style={{ background: `${z.color}04` }}>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="w-2 h-2 rounded-full" style={{ background: z.color }} />
                    <span className="text-sm font-mono font-bold" style={{ color: z.color }}>{z.zone}</span>
                    <span className="text-xs font-mono text-[#7A8CA8] ml-auto">{z.range}</span>
                  </div>
                  <div className="text-xs text-[#8B9CC0]">{z.desc}</div>
                </div>
              ))}
            </div>
            <div className="text-xs text-[#7A8CA8] font-mono">
              4 metrics: spearman_rho(0.50) · human_llm_alpha(0.80) · precision@10(0.60) · tier_accuracy(0.70)
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
