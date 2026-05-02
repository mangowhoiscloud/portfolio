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
            "자율 에이전트를 컴퓨팅의 운영체제로 다루는 실험입니다.",
            "An experiment that treats the autonomous agent as the operating system of LLM-driven compute."
          )}
        </p>

        <div className="mt-10 space-y-5 text-[var(--ink-2)] leading-[1.75] text-[16px]">
          <p>
            {t(locale,
              "GEODE는 LLM 위에서 동작하는 자율 에이전트를 운영체제로 보는 관점에서 시작했습니다. 시스템은 4계층으로 구성되어 있습니다. 모델이 커널, 런타임이 시스템콜과 드라이버, 하네스가 셸과 init, 에이전트가 항상 동작하는 실행 루프를 담당합니다.",
              "GEODE started from the view that the autonomous agent on top of an LLM can be treated as an operating system. The system is organized in four layers: the model handles the kernel, the runtime handles syscalls and drivers, the harness handles the shell and init, and the agent runs the always-on execution loop."
            )}
          </p>
          <p>
            {t(locale,
              "이 구조 위에서 두 도메인을 검증했습니다. Game IP의 가치를 추론하는 분석 파이프라인을 in-tree 플러그인으로 구현했고, Java 1.8 → 22 마이그레이션 에이전트를 별도 fork로 분리했습니다. 마이그레이션은 5,523개 파일을 5시간 48분 만에 처리했고, 빌드 테스트는 83개 모듈 모두 통과했습니다. 새로운 도메인을 추가할 때는 어댑터 하나만 새로 구현하면 됩니다.",
              "Two domains have been validated on this structure. A Game IP valuation pipeline was implemented as an in-tree plugin, and a Java 1.8 → 22 migration agent was separated into its own fork. The migration processed 5,523 files in 5 hours 48 minutes, with all 83 build modules passing. Adding a new domain requires only implementing a new adapter."
            )}
          </p>
          <p>
            {t(locale,
              "운영체제 자체를 빌드하는 라인도 동일한 패턴을 사용합니다. 카르파시의 P4 ratchet은 한쪽에서 프롬프트 해시 20개를 잠그고, 다른 쪽에서 CI 5단계를 잠급니다. 시스템 출력의 안정성을 보장하는 디시플린이 시스템 빌드 과정의 안정성을 보장하는 디시플린과 같은 형태입니다.",
              "The build pipeline for the operating system itself follows the same pattern. The Karpathy P4 ratchet locks 20 prompt hashes on one side and 5 CI stages on the other. The discipline that ensures output correctness has the same shape as the discipline that ensures build correctness."
            )}
          </p>
          <p>
            {t(locale,
              "이 작업은 안드레이 카르파시가 2023년 ‘Intro to Large Language Models’ 강연에서 제시한 LLM-OS 다이어그램의 구체적인 구현 사례입니다.",
              "This is one concrete implementation of the LLM-OS diagram Andrej Karpathy presented in his 2023 talk “Intro to Large Language Models.”"
            )}
          </p>
        </div>

        <div className="mt-8 rounded border border-[var(--rule)] bg-[var(--code-bg)] px-4 py-3 font-mono text-[12.5px] leading-relaxed text-[var(--code-text)]">
          <span className="opacity-50">$</span> uv run geode analyze &quot;Cowboy Bebop&quot; --dry-run{"\n"}
          <span className="opacity-50">→</span> A · 68.4 · undermarketed
        </div>

        <p className="mt-6 font-mono text-[12px] text-[var(--ink-3)]">
          GEODE v0.65.0 · 236 모듈 · 4,380 테스트 · 64회 릴리스 · 핀 고정 프롬프트 20개 · 단독 개발
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

      {/* Mascot — sits naturally on the warm dark substrate */}
      <div className="max-w-3xl mx-auto mt-20 flex items-center gap-3 text-[var(--ink-3)]">
        <Image
          src="/portfolio/images/geode-idle.png"
          alt="Geodi"
          width={40}
          height={40}
        />
        <span className="font-mono text-[11px]">
          {t(locale, "Geodi — GEODE 마스코트", "Geodi — GEODE mascot")}
        </span>
      </div>
    </section>
  );
}
