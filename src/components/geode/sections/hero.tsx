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
            "LLM이 새 컴퓨트라면, 그 위의 운영체제는 자율 에이전트다.",
            "If the LLM is the new compute, the autonomous agent is its operating system."
          )}
        </p>

        <div className="mt-10 space-y-5 text-[var(--ink-2)] leading-[1.75] text-[16px]">
          <p>
            {t(locale,
              "GEODE는 그 운영체제를 프로덕션 코드로 옮겨 놓은 결과물이다. 모델이 커널을, 런타임이 시스템콜과 드라이버를, 하네스가 셸과 init을, 에이전트가 항상 도는 루프를 맡는다. 책임이 네 층으로 갈라져 있어서 위 계층은 아래의 변경을 신경 쓸 일이 없다.",
              "GEODE is one attempt to move that operating system into production code. The model takes the kernel, the runtime takes syscalls and drivers, the harness takes the shell and init, and the agent takes the always-running loop. The four layers keep their concerns separate, so a change one floor down does not ripple up."
            )}
          </p>
          <p>
            {t(locale,
              "같은 하네스 위에서 두 도메인이 검증을 마쳤다. 게임 IP의 가치를 추론하는 플러그인이 트리 안에 산다. Java 1.8을 22로 끌어올린 마이그레이션 에이전트는 fork 한 번으로 갈라져 나갔다. 5,523개 파일을 5시간 48분에 처리했고, 빌드는 83/83 통과했다. 도메인을 갈아끼우는 일에는 어댑터 한 장이면 충분했다.",
              "Two domains have shipped on the same harness. A game-IP valuation plugin lives in-tree. A Java 1.8→22 migration agent was carved out as a fork and ran on its own; it touched 5,523 files in five hours and forty-eight minutes, and the build came back 83 of 83. Swapping the domain took a single adapter."
            )}
          </p>
          <p>
            {t(locale,
              "이 운영체제는 자기 자신의 스캐폴드로 만들어졌다. 카르파시의 P4 ratchet이 한쪽에서는 프롬프트 해시 20개를 잠그고, 다른 쪽에서는 CI 5단계를 잠근다. 같은 패턴이 두 스코프에서 나란히 작동한다. 안드레이 카르파시가 2023년 “Intro to Large Language Models”에서 그린 LLM OS의 윤곽 — 그 그림을 코드로 옮긴 하나의 구현이다.",
              "The operating system was built by its own scaffold. The P4 ratchet from Karpathy's playbook locks twenty prompt hashes on one side and the five CI jobs on the other. The same pattern runs in two scopes at once. Andrej Karpathy sketched the LLM-OS in his 2023 talk; this is one attempt to render that sketch as code."
            )}
          </p>
        </div>

        <div className="mt-8 rounded border border-[var(--rule)] bg-[var(--code-bg)] px-4 py-3 font-mono text-[12.5px] leading-relaxed text-[var(--code-text)]">
          <span className="opacity-50">$</span> uv run geode analyze &quot;Cowboy Bebop&quot; --dry-run{"\n"}
          <span className="opacity-50">→</span> A · 68.4 · undermarketed
        </div>

        <p className="mt-6 font-mono text-[12px] text-[var(--ink-3)]">
          GEODE v0.65.0 · 236 모듈 · 4380 테스트 · 64회 릴리스 · 핀 고정 프롬프트 20개 · 단독 운영
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
          {t(locale, "Geodi — GEODE 의 마스코트", "Geodi — GEODE's mascot")}
        </span>
      </div>
    </section>
  );
}
