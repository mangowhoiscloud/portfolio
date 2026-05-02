"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useLocale, t } from "../locale-context";

const videoTabs = [
  { id: "demo", labelKo: "에이전트 및 스캐폴드 시연", labelEn: "Agent & Scaffold demo", src: "https://www.youtube.com/embed/1IftYShGxak", title: "GEODE Agent Demo" },
  { id: "computer-use", labelKo: "Computer-use", labelEn: "Computer-use", src: "https://www.youtube.com/embed/BKg3D6pXwss", title: "GEODE Computer-use Demo" },
  { id: "intro", labelKo: "개발자 소개 / 구조 / 발전사", labelEn: "Introduction / architecture / history", src: "https://www.youtube.com/embed/Qt3jsR5zOcQ", title: "GEODE Introduction" },
];

export function HeroSection() {
  const locale = useLocale();
  const [activeVideo, setActiveVideo] = useState("demo");
  return (
    <section className="relative pt-24 pb-20 px-6">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-baseline justify-between mb-12">
          <span className="font-mono text-[11px] tracking-[0.18em] uppercase text-[var(--ink-3)]">
            GEODE / portfolio
          </span>
          <span className="font-mono text-[11px] text-[var(--ink-3)] border border-[var(--rule)] rounded px-2 py-0.5">
            v0.65.0
          </span>
        </div>

        <h1 className="font-display tracking-tight text-[var(--ink)] text-[clamp(3rem,8vw,5rem)] leading-[1.02] font-semibold">
          GEODE
        </h1>
        <p className="mt-4 font-display text-[clamp(1.25rem,2.5vw,1.6rem)] text-[var(--ink-1)] leading-snug">
          {t(locale,
            "LLM은 새로운 컴퓨트, 자율 에이전트는 그것의 OS.",
            "LLM is the new compute. The agent is its OS."
          )}
        </p>

        <div className="mt-10 space-y-5 text-[var(--ink-2)] leading-[1.75] text-[16px]">
          <p>
            {t(locale,
              "GEODE는 자율 에이전트를 컴퓨팅의 OS로 본다. 4계층 스택 — 모델, 런타임, 하네스, 에이전트 — 위에서 두 도메인이 동일 하네스로 동작한다. Game IP 가치 추론은 in-tree 플러그인으로, Java 1.8→22 마이그레이션은 fork로. 도메인은 플러그인이다.",
              "GEODE treats the autonomous agent as the OS for an LLM-driven compute substrate. Two domains run on the same harness across a four-layer stack — Game IP valuation as an in-tree plugin, Java 1.8 → 22 migration as a fork. The domain is a plugin."
            )}
          </p>
          <p>
            {t(locale,
              "Andrej Karpathy가 2023년 “Intro to Large Language Models”에서 LLM OS 다이어그램을 그렸다. GEODE는 그 다이어그램을 프로덕션 코드로 만든 한 가지 구현이다. 자기 자신의 스캐폴드로 부팅되고, 자기 자신의 디시플린으로 출시된다.",
              "Andrej Karpathy sketched the LLM OS in his 2023 talk “Intro to Large Language Models”. GEODE is one production-grade implementation of that diagram — booted by its own scaffold, shipped by its own discipline."
            )}
          </p>
        </div>

        <div className="mt-8 rounded border border-[var(--rule)] bg-[var(--code-bg)] px-4 py-3 font-mono text-[12.5px] leading-relaxed text-[var(--code-text)]">
          <span className="opacity-50">$</span> uv run geode analyze &quot;Cowboy Bebop&quot; --dry-run{"\n"}
          <span className="opacity-50">→</span> A · 68.4 · undermarketed
        </div>

        <p className="mt-6 font-mono text-[12px] text-[var(--ink-3)]">
          v0.65.0 · 236 modules · 4380+ tests · 64+ releases · 20 pinned prompts · solo
        </p>

        <div className="mt-10 flex items-center gap-3">
          <Link
            href="https://github.com/mangowhoiscloud/geode"
            target="_blank"
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded border border-[var(--rule)] hover:border-[var(--acc-artifact)] text-[13px] font-mono text-[var(--ink-1)] hover:text-[var(--acc-artifact)] transition-colors"
          >
            Source
          </Link>
          <Link
            href="https://rooftopsnow.tistory.com/category/Harness"
            target="_blank"
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded border border-[var(--rule)] hover:border-[var(--acc-artifact)] text-[13px] font-mono text-[var(--ink-1)] hover:text-[var(--acc-artifact)] transition-colors"
          >
            Dev Blog
          </Link>
          <Link
            href="/geode/docs"
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded border border-[var(--rule)] hover:border-[var(--acc-artifact)] text-[13px] font-mono text-[var(--ink-1)] hover:text-[var(--acc-artifact)] transition-colors"
          >
            Docs
          </Link>
          <Link
            href="/geode/scaffold"
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded border border-[var(--rule)] hover:border-[var(--acc-line)] text-[13px] font-mono text-[var(--ink-1)] hover:text-[var(--acc-line)] transition-colors"
          >
            Scaffold
          </Link>
        </div>
      </div>

      {/* video tabs (kept) */}
      <div className="max-w-4xl mx-auto mt-20">
        <div className="flex justify-center gap-2 mb-3 flex-wrap">
          {videoTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveVideo(tab.id)}
              className="px-4 py-2 text-[12px] font-mono transition-colors whitespace-nowrap"
              style={{
                color: activeVideo === tab.id ? "var(--acc-artifact)" : "var(--ink-3)",
                borderBottom: `2px solid ${activeVideo === tab.id ? "var(--acc-artifact)" : "transparent"}`,
              }}
            >
              {locale === "en" ? tab.labelEn : tab.labelKo}
            </button>
          ))}
        </div>
        {videoTabs.map((tab) => (
          <div key={tab.id} className="max-w-2xl mx-auto" style={{ display: activeVideo === tab.id ? "block" : "none" }}>
            <div className="relative rounded overflow-hidden border border-[var(--rule)]" style={{ paddingBottom: "56.25%" }}>
              <iframe
                className="absolute inset-0 w-full h-full"
                src={tab.src}
                title={tab.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>
        ))}
      </div>

      {/* mascot demoted: small, static, low-key */}
      <div className="max-w-3xl mx-auto mt-20 flex items-center gap-3 text-[var(--ink-3)]">
        <Image
          src="/portfolio/images/geode-idle.png"
          alt="Geodi"
          width={36}
          height={36}
          className="opacity-60"
        />
        <span className="font-mono text-[11px]">
          {t(locale, "Geodi — GEODE 의 마스코트", "Geodi — GEODE's mascot")}
        </span>
      </div>
    </section>
  );
}
