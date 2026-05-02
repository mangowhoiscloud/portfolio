"use client";

import { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import Link from "next/link";
import { useLocale, t } from "../locale-context";

const stats = [
  { value: "∞", label: "while True", sub: "" },
  { value: "8", label: "Safety Guards", sub: "convergence · time budget · stuck · HITL" },
  { value: "3", label: "Modes", sub: "IPC(thin CLI) · Daemon(Slack) · Scheduler" },
  { value: "5", label: "Tool Routes", sub: "Bash · Tool · MCP · Skill · DAG" },
];

const videoTabs = [
  { id: "demo", labelKo: "에이전트 및 스케폴드(생산 체계) 시연", labelEn: "Agent & Scaffold Demo", src: "https://www.youtube.com/embed/1IftYShGxak", title: "GEODE Agent Demo" },
  { id: "computer-use", labelKo: "Computer-use (탐색적 작업, 파일 R/W, 일정관리)", labelEn: "Computer-use (Exploratory Tasks, File R/W, Scheduling)", src: "https://www.youtube.com/embed/BKg3D6pXwss", title: "GEODE Computer-use Demo" },
  { id: "intro", labelKo: "개발자 소개 / 구조 설명 / 발전사", labelEn: "Introduction / Architecture / History", src: "https://www.youtube.com/embed/Qt3jsR5zOcQ", title: "GEODE Introduction" },
];

export function HeroSection() {
  const locale = useLocale();
  const [activeVideo, setActiveVideo] = useState("demo");
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden pt-16">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] rounded-full bg-[radial-gradient(ellipse,rgba(129,140,248,0.06)_0%,transparent_70%)]" />
        <div className="absolute top-1/3 left-1/3 w-[500px] h-[400px] rounded-full bg-[radial-gradient(ellipse,rgba(244,184,200,0.04)_0%,transparent_70%)] animate-drift" />
      </div>

      <div className="relative z-10 flex flex-col items-center gap-5 px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="text-center"
        >
          <h1 className="text-[clamp(3.5rem,10vw,7rem)] font-black tracking-[-0.04em] leading-none bg-gradient-to-b from-white via-white/90 to-white/40 bg-clip-text text-transparent">
            GEODE
          </h1>
          <div className="mt-3 flex items-center justify-center gap-3">
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#4ECDC4]/20 bg-[#4ECDC4]/5 text-xs font-mono text-[#4ECDC4]/80">
              <span className="w-1.5 h-1.5 rounded-full bg-[#4ECDC4] animate-pulse" />
              v0.65.0
            </span>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          className="animate-float -my-1"
        >
          <Image
            src="/portfolio/images/geode-hero.png"
            alt="Geodi"
            width={800}
            height={533}
            priority
            className="w-full max-w-[520px] drop-shadow-[0_0_100px_rgba(244,184,200,0.2)]"
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-center max-w-lg"
        >
          <p className="text-lg text-[#8B9CC0]">LLM is the new compute. The agent is its OS.</p>
          <p className="text-sm text-white/45 mt-1.5 max-w-xl text-center leading-relaxed">
            {t(locale,
              "GEODE v0.65.0 — 자기 자신의 스캐폴드로 만들어진 에이전틱 OS. 두 도메인이 동일 하네스 위에서 검증 완료: 게임 IP 가치 추론(Game IP plugin), Java 1.8→22 자동 마이그레이션 (5,523 files / 83-83 builds / 5h48m / $388). Andrej Karpathy의 LLM OS 다이어그램(Intro to LLMs, 2023) 의 한 가지 구현.",
              "GEODE v0.65.0 — an agentic OS, built by its own scaffold. Two domains proven on the same harness: Game IP valuation (in-tree plugin) and Java 1.8→22 migration (5,523 files / 83-83 builds / 5h48m / $388). One implementation of Karpathy's LLM OS sketch (Intro to LLMs, 2023)."
            )}
          </p>
          <pre className="mt-4 inline-block text-left rounded-lg border border-white/[0.06] bg-[#060D1B] px-4 py-3 font-mono text-[12px] leading-relaxed text-[#C8D8F0]">
            <span className="text-white/40">$</span>{" "}<span className="text-[#4ECDC4]">uv run geode</span>{" "}<span className="text-[#FFD8A8]/80">analyze &quot;Cowboy Bebop&quot; --dry-run</span>{"\n"}
            <span className="text-white/35">→</span>{" "}<span className="text-white/75">A · 68.4 · undermarketed</span>
          </pre>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="flex flex-wrap items-center justify-center gap-6 sm:gap-10 mt-6"
        >
          {stats.map((s) => (
            <div key={s.label} className="text-center">
              <div className="text-3xl font-extrabold tracking-tight text-white/90">
                {s.value}
              </div>
              <div className="text-[10px] font-mono text-[#7A8CA8] uppercase tracking-widest mt-1">
                {s.label}
              </div>
              <div className="text-[11px] font-mono text-white/25 mt-0.5">
                {s.sub}
              </div>
            </div>
          ))}
        </motion.div>

        {/* YouTube videos (tabbed) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.7 }}
          className="w-full max-w-4xl mt-8 mb-2"
        >
          <div className="flex justify-center gap-2 mb-3 flex-wrap">
            {videoTabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveVideo(tab.id)}
                className="px-4 py-2 text-xs font-mono font-bold transition-all duration-300 whitespace-nowrap shrink-0"
                style={{
                  color: activeVideo === tab.id ? "#4ECDC4" : "#5A6A8A",
                  borderBottom: `2px solid ${activeVideo === tab.id ? "#4ECDC4" : "transparent"}`,
                }}
              >
                {locale === "en" ? tab.labelEn : tab.labelKo}
              </button>
            ))}
          </div>
          {videoTabs.map((tab) => (
            <div key={tab.id} className="max-w-2xl mx-auto" style={{ display: activeVideo === tab.id ? "block" : "none" }}>
              <div className="relative rounded-xl overflow-hidden border border-white/[0.06]" style={{ paddingBottom: "56.25%" }}>
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
        </motion.div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.75 }} className="flex items-center justify-center gap-3 mt-4 mb-16">
          <Link
            href="https://github.com/mangowhoiscloud/geode"
            target="_blank"
            className="inline-flex items-center justify-center gap-2 w-[120px] py-2 rounded-lg border border-white/[0.06] text-xs font-mono text-[#7A8CA8] hover:text-[#8B9CC0] hover:border-white/[0.12] transition-all duration-300"
          >
            <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor"><path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0016 8c0-4.42-3.58-8-8-8z"/></svg>
            Source
          </Link>
          <Link
            href="https://rooftopsnow.tistory.com/category/Harness"
            target="_blank"
            className="inline-flex items-center justify-center gap-2 w-[120px] py-2 rounded-lg border border-white/[0.06] text-xs font-mono text-[#7A8CA8] hover:text-[#8B9CC0] hover:border-white/[0.12] transition-all duration-300"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"/></svg>
            Dev Blog
          </Link>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <div className="w-5 h-8 rounded-full border border-white/10 flex items-start justify-center p-1.5">
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
            className="w-1 h-1.5 rounded-full bg-white/30"
          />
        </div>
      </motion.div>
    </section>
  );
}
