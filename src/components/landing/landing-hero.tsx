"use client";

import { LanguageToggle, T } from "@/lib/i18n";

export function LandingHero() {
  return (
    <section className="min-h-[70vh] flex flex-col justify-center items-center text-center px-4 md:px-8 pt-16 pb-8 relative overflow-hidden">
      {/* Background: split glow (amber left, indigo right) */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 -translate-x-1/2 w-[80%] h-full bg-gradient-radial from-[#E5A83B]/6 via-transparent to-transparent" />
        <div className="absolute top-0 right-1/4 translate-x-1/2 w-[80%] h-full bg-gradient-radial from-[#818CF8]/6 via-transparent to-transparent" />
      </div>

      {/* Language toggle - top right */}
      <div className="absolute top-6 right-6">
        <LanguageToggle />
      </div>

      {/* Badge */}
      <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 border border-border/50 rounded-full text-sm text-muted-foreground mb-8 animate-fade-in-up">
        <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
        <T ko="Backend & AI Engineer" en="Backend & AI Engineer" />
      </div>

      {/* Name */}
      <h1 className="text-5xl md:text-7xl lg:text-8xl font-extrabold leading-tight mb-6 tracking-tight animate-fade-in-up animation-delay-100">
        <T ko="류지환" en="Jihwan Ryu" />
      </h1>

      {/* Subtitle */}
      <p className="text-base md:text-lg text-muted-foreground max-w-2xl mb-4 animate-fade-in-up animation-delay-200 leading-relaxed">
        <T
          ko="프로덕션 급 분산 시스템과 LLM 기반 에이전트 파이프라인을 설계·구현합니다."
          en="Designing and building production-grade distributed systems and LLM-powered agent pipelines."
        />
      </p>

      {/* Links */}
      <div className="flex items-center gap-4 animate-fade-in-up animation-delay-300">
        <a
          href="https://github.com/mangowhoiscloud"
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          GitHub
        </a>
        <span className="text-border">·</span>
        <a
          href="https://rooftopsnow.tistory.com/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <T ko="기술 블로그" en="Tech Blog" />
        </a>
      </div>
    </section>
  );
}
