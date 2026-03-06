"use client";

import Link from "next/link";
import { T } from "@/lib/i18n";
import { motion } from "framer-motion";

interface ProjectCardData {
  href: string;
  title: string;
  subtitleKo: string;
  subtitleEn: string;
  descKo: string;
  descEn: string;
  accentColor: string;
  techBadges: string[];
  stats: { value: string; labelKo: string; labelEn: string }[];
}

const projects: ProjectCardData[] = [
  {
    href: "/eco2",
    title: "Eco²",
    subtitleKo: "Multi-LLM Agent 분산 클러스터",
    subtitleEn: "Multi-LLM Agent Distributed Cluster",
    descKo: "LangGraph, OpenAI AgentSDK, Gemini SDK 기반 멀티에이전트 파이프라인을 24-Node Kubernetes 클러스터에서 운영. Event Bus Layer로 VU 50→500(x10), RPM 60→528(x8.8) 확장 달성.",
    descEn: "Operating multi-agent pipelines on a 24-Node Kubernetes cluster using LangGraph, OpenAI AgentSDK, and Gemini SDK. Event Bus Layer achieved VU 50→500(x10), RPM 60→528(x8.8) scaling.",
    accentColor: "#E5A83B",
    techBadges: ["Kubernetes", "LangGraph", "FastAPI", "Redis Streams", "RabbitMQ", "Istio"],
    stats: [
      { value: "24", labelKo: "클러스터 노드", labelEn: "Cluster Nodes" },
      { value: "528", labelKo: "RPM SLA", labelEn: "RPM SLA" },
      { value: "8", labelKo: "기술 도메인", labelEn: "Tech Domains" },
    ],
  },
  {
    href: "/geode",
    title: "GEODE",
    subtitleKo: "저평가 IP 발굴 에이전트 시스템",
    subtitleEn: "Undervalued IP Discovery Agent System",
    descKo: "LangGraph StateGraph 기반 6-Layer 에이전트 아키텍처. Send API로 4명의 분석가를 Clean Context에서 병렬 실행하고, 14축 루브릭과 Decision Tree로 IP 가치를 체계적으로 평가.",
    descEn: "6-Layer agent architecture based on LangGraph StateGraph. Send API executes 4 analysts in parallel with Clean Context, systematically evaluating IP value with 14-axis rubric and Decision Tree.",
    accentColor: "#818CF8",
    techBadges: ["LangGraph", "Claude Opus", "Pydantic", "Typer", "Rich", "pytest"],
    stats: [
      { value: "6", labelKo: "아키텍처 레이어", labelEn: "Arch Layers" },
      { value: "14", labelKo: "루브릭 축", labelEn: "Rubric Axes" },
      { value: "98", labelKo: "테스트 통과", labelEn: "Tests Passing" },
    ],
  },
];

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.15, delayChildren: 0.1 },
  },
};

const item = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" as const } },
};

function ProjectCard({ project }: { project: ProjectCardData }) {
  return (
    <motion.div variants={item}>
      <Link href={project.href} className="block group">
        <div
          className="relative overflow-hidden rounded-2xl bg-card border border-border/50 p-8 md:p-10 transition-all duration-300 hover:border-[var(--card-accent)]/30 hover:-translate-y-1 hover:shadow-lg"
          style={{ "--card-accent": project.accentColor } as React.CSSProperties}
        >
          {/* Glow on hover */}
          <div
            className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
            style={{
              background: `radial-gradient(ellipse at top, ${project.accentColor}08 0%, transparent 60%)`,
            }}
          />

          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2
                className="text-2xl md:text-3xl font-extrabold tracking-tight"
                style={{ color: project.accentColor }}
              >
                {project.title}
              </h2>
              <p className="text-sm text-muted-foreground mt-1">
                <T ko={project.subtitleKo} en={project.subtitleEn} />
              </p>
            </div>
            <span
              className="text-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 -translate-x-2 group-hover:translate-x-0"
              style={{ color: project.accentColor }}
            >
              →
            </span>
          </div>

          {/* Description */}
          <p className="text-sm text-muted-foreground leading-relaxed mb-6">
            <T ko={project.descKo} en={project.descEn} />
          </p>

          {/* Tech Badges */}
          <div className="flex flex-wrap gap-2 mb-6">
            {project.techBadges.map((badge) => (
              <span
                key={badge}
                className="px-2.5 py-1 text-xs rounded-md border"
                style={{
                  borderColor: `${project.accentColor}25`,
                  color: `${project.accentColor}CC`,
                  backgroundColor: `${project.accentColor}08`,
                }}
              >
                {badge}
              </span>
            ))}
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 pt-6 border-t border-border/50">
            {project.stats.map((stat) => (
              <div key={stat.labelEn} className="text-center">
                <div
                  className="text-xl md:text-2xl font-bold"
                  style={{ color: project.accentColor }}
                >
                  {stat.value}
                </div>
                <div className="text-[10px] text-muted-foreground mt-0.5">
                  <T ko={stat.labelKo} en={stat.labelEn} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

export function LandingProjects() {
  return (
    <section className="px-4 md:px-8 pb-24">
      <div className="max-w-5xl mx-auto">
        {/* Section label */}
        <div className="text-center mb-10">
          <h2 className="text-sm font-medium text-muted-foreground tracking-widest uppercase">
            <T ko="프로젝트" en="Projects" />
          </h2>
        </div>

        {/* Project Cards */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8"
          variants={container}
          initial="hidden"
          animate="show"
        >
          {projects.map((project) => (
            <ProjectCard key={project.title} project={project} />
          ))}
        </motion.div>
      </div>
    </section>
  );
}
