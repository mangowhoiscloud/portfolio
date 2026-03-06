"use client";

import { T } from "@/lib/i18n";
import { geodeStats } from "@/data/geode/stats";

function HeroStat({
  value,
  labelKo,
  labelEn,
}: {
  value: string;
  labelKo: string;
  labelEn: string;
}) {
  return (
    <div className="flex flex-col items-center gap-1 p-4 bg-secondary/30 rounded-xl border border-border/50 hover:border-[#818CF8]/30 transition-colors">
      <div className="text-2xl md:text-3xl font-bold text-[#818CF8]">
        {value}
      </div>
      <div className="text-xs text-muted-foreground text-center">
        <T ko={labelKo} en={labelEn} />
      </div>
    </div>
  );
}

export function GeodeHeroSection() {
  return (
    <section
      id="overview"
      className="min-h-screen flex flex-col justify-center items-center text-center px-4 md:px-8 pt-24 pb-16 relative overflow-hidden"
    >
      {/* Background glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[200%] h-full bg-gradient-radial from-[#818CF8]/10 via-transparent to-transparent" />
      </div>

      {/* Badge */}
      <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 border border-border/50 rounded-full text-sm text-muted-foreground mb-8 animate-fade-in-up">
        <span className="w-2 h-2 bg-[#818CF8] rounded-full animate-pulse" />
        <T ko="LangGraph Agent System" en="LangGraph Agent System" />
      </div>

      {/* Title */}
      <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold leading-tight mb-6 tracking-tight animate-fade-in-up animation-delay-100">
        <span className="text-[#818CF8]">GEODE</span>
      </h1>

      {/* Subtitle */}
      <p className="text-base md:text-lg text-muted-foreground max-w-2xl mb-12 animate-fade-in-up animation-delay-200">
        <T
          ko="저평가 엔티티를 데이터 기반으로 발굴하는 LangGraph Agent 시스템. 6-Layer 아키텍처, Send API 병렬 분석, 14축 루브릭, Decision Tree 원인 분류를 통해 IP 가치를 체계적으로 평가합니다."
          en="LangGraph Agent system for data-driven discovery of undervalued entities. Systematically evaluates IP value through 6-layer architecture, Send API parallel analysis, 14-axis rubric, and Decision Tree cause classification."
        />
      </p>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 md:gap-4 w-full max-w-5xl animate-fade-in-up animation-delay-300">
        {geodeStats.map((stat) => (
          <HeroStat
            key={stat.labelEn}
            value={stat.value}
            labelKo={stat.labelKo}
            labelEn={stat.labelEn}
          />
        ))}
      </div>
    </section>
  );
}
