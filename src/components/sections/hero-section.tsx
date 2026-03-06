"use client";

import { useEffect, useState } from "react";
import { T } from "@/lib/i18n";

interface HeroStatProps {
  value: string | React.ReactNode;
  labelKo: string;
  labelEn: string;
  href?: string;
  onClick?: () => void;
}

function HeroStat({ value, labelKo, labelEn, href, onClick }: HeroStatProps) {
  const ValueWrapper = href ? "a" : onClick ? "button" : "div";
  const valueProps = href
    ? { href, target: "_blank", rel: "noopener noreferrer" }
    : onClick
      ? { onClick }
      : {};

  return (
    <div className="flex flex-col items-center gap-1 p-4 bg-secondary/30 rounded-xl border border-border/50 hover:border-accent/30 transition-colors">
      <ValueWrapper
        {...valueProps}
        className="text-2xl md:text-3xl font-bold text-accent cursor-pointer hover:text-accent-light transition-colors"
      >
        {value}
      </ValueWrapper>
      <div className="text-xs text-muted-foreground text-center">
        <T ko={labelKo} en={labelEn} />
      </div>
    </div>
  );
}

export function HeroSection() {
  const [devDays, setDevDays] = useState<number | null>(null);
  const [serviceDays, setServiceDays] = useState<number | null>(null);

  useEffect(() => {
    const devStart = new Date("2024-10-31");
    const serviceStart = new Date("2024-12-02");
    const now = new Date();

    setDevDays(
      Math.floor((now.getTime() - devStart.getTime()) / (1000 * 60 * 60 * 24))
    );
    setServiceDays(
      Math.floor(
        (now.getTime() - serviceStart.getTime()) / (1000 * 60 * 60 * 24)
      )
    );
  }, []);

  return (
    <section
      id="overview"
      className="min-h-screen flex flex-col justify-center items-center text-center px-4 md:px-8 pt-24 pb-16 relative overflow-hidden"
    >
      {/* Background glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[200%] h-full bg-gradient-radial from-accent/10 via-transparent to-transparent" />
      </div>

      {/* Badge */}
      <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 border border-border/50 rounded-full text-sm text-muted-foreground mb-8 animate-fade-in-up">
        <span className="w-2 h-2 bg-primary rounded-full animate-pulse" />
        <T
          ko="🏆 2025 AI 새싹톤 우수상"
          en="🏆 2025 AI SeSACTHON Excellence Award"
        />
      </div>

      {/* Title */}
      <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold leading-tight mb-6 tracking-tight animate-fade-in-up animation-delay-100">
        <span className="text-accent">이코에코(Eco²)</span>
        <br />
        <span>Backend Portfolio</span>
      </h1>

      {/* Subtitle */}
      <p className="text-base md:text-lg text-muted-foreground max-w-2xl mb-12 animate-fade-in-up animation-delay-200">
        <T
          ko="LangGraph, OpenAI AgentSDK, Gemini SDK 기반 멀티에이전트 파이프라인을 설계·개발 운영 중입니다. LLM API의 고레이턴시에 대응하기 위해 Event Bus Layer를 설계 개발, VU 50→500(x10), RPM 60→528(x8.8) 확장을 달성했습니다."
          en="Designing and operating multi-agent pipelines based on LangGraph, OpenAI AgentSDK, and Gemini SDK. Designed Event Bus Layer to handle LLM API high latency, achieving VU 50→500(x10), RPM 60→528(x8.8) scaling."
        />
      </p>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 md:gap-4 w-full max-w-5xl animate-fade-in-up animation-delay-300">
        <HeroStat
          value="24"
          labelKo="클러스터 노드"
          labelEn="Cluster Nodes"
          onClick={() => {
            /* TODO: open modal */
          }}
        />
        <HeroStat
          value="2,500 VU"
          labelKo="1,477 RPS Baseline"
          labelEn="1,477 RPS Baseline"
          href="https://snapshots.raintank.io/dashboard/snapshot/JbEhJRXD1vCt77ZOfCxy9N72wXJ3ZyKj?orgId=0&refresh=10s"
        />
        <HeroStat
          value="300 VU"
          labelKo="SLA 528 RPM (Scan SSE)"
          labelEn="SLA 528 RPM (Scan SSE)"
          href="https://snapshots.raintank.io/dashboard/snapshot/9LbgErvCS0N94vDc9NwO15kVAk7eLzLM"
        />
        <HeroStat
          value="100+ · 76+"
          labelKo="개발 기록 · Knowledge Base"
          labelEn="Dev Logs · Knowledge Base"
          href="https://rooftopsnow.tistory.com/"
        />
        <HeroStat
          value={devDays !== null ? `${devDays}일차` : "-일차"}
          labelKo="개발 기간 (10.31~)"
          labelEn="Development (10.31~)"
          href="https://github.com/eco2-team/backend"
        />
        <HeroStat
          value={serviceDays !== null ? `${serviceDays}일차` : "-일차"}
          labelKo="서비스 기간 (12.02~)"
          labelEn="Live Service (12.02~)"
          href="https://frontend.dev.growbin.app"
        />
      </div>
    </section>
  );
}
