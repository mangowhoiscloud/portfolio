"use client";

import { T } from "@/lib/i18n";
import { cn } from "@/lib/utils";

interface CycleNodeProps {
  icon: string;
  title: string;
  subtitleKo: string;
  subtitleEn: string;
  tooltipKo: string;
  tooltipEn: string;
  position: "top" | "right" | "bottom" | "left";
  onClick?: () => void;
}

function CycleNode({
  icon,
  title,
  subtitleKo,
  subtitleEn,
  tooltipKo,
  tooltipEn,
  position,
  onClick,
}: CycleNodeProps) {
  const positionClasses = {
    top: "top-0 left-1/2 -translate-x-1/2 -translate-y-1/2",
    right: "right-0 top-1/2 translate-x-1/2 -translate-y-1/2",
    bottom: "bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2",
    left: "left-0 top-1/2 -translate-x-1/2 -translate-y-1/2",
  };

  return (
    <div
      className={cn(
        "absolute z-10 group cursor-pointer",
        positionClasses[position]
      )}
      onClick={onClick}
    >
      <div className="bg-card border border-border/50 rounded-xl p-4 text-center hover:border-accent/50 transition-all hover:shadow-lg hover:shadow-accent/10 min-w-[120px]">
        <div className="text-3xl mb-2">{icon}</div>
        <div className="font-semibold text-foreground text-sm">{title}</div>
        <div className="text-xs text-muted-foreground">
          <T ko={subtitleKo} en={subtitleEn} />
        </div>
      </div>
      {/* Tooltip */}
      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-popover border border-border rounded-lg text-xs opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-20">
        <T ko={tooltipKo} en={tooltipEn} />
      </div>
    </div>
  );
}

function LifecycleStep({
  number,
  title,
  desc,
  isFeedback,
}: {
  number: string;
  title: string;
  desc: string;
  isFeedback?: boolean;
}) {
  return (
    <div
      className={cn(
        "flex items-center gap-2 px-3 py-2 rounded-lg",
        isFeedback ? "bg-accent/20" : "bg-secondary/50"
      )}
    >
      <div
        className={cn(
          "w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold",
          isFeedback
            ? "bg-accent text-accent-foreground"
            : "bg-primary text-primary-foreground"
        )}
      >
        {number}
      </div>
      <div>
        <div className="font-medium text-sm">{title}</div>
        <div className="text-xs text-muted-foreground">{desc}</div>
      </div>
    </div>
  );
}

function SSOTItem({ icon, label }: { icon: string; label: string }) {
  return (
    <div className="flex items-center gap-2 px-3 py-2 bg-secondary/50 rounded-lg">
      <span className="text-lg">{icon}</span>
      <span className="text-sm font-medium">{label}</span>
    </div>
  );
}

function RAGItem({
  icon,
  label,
  descKo,
  descEn,
  color,
}: {
  icon: string;
  label: string;
  descKo: string;
  descEn: string;
  color?: string;
}) {
  return (
    <div
      className="flex items-center gap-2 px-3 py-2 rounded-lg"
      style={{ background: color || "rgba(229,168,59,0.15)" }}
    >
      <span className="text-lg">{icon}</span>
      <span className="font-medium text-sm">{label}</span>
      <span className="text-xs text-muted-foreground">
        <T ko={descKo} en={descEn} />
      </span>
    </div>
  );
}

function SkillBadge({ name, desc }: { name: string; desc: string }) {
  return (
    <div className="bg-purple-500/15 px-2 py-1.5 rounded-md text-center">
      <div className="font-semibold text-purple-400 text-xs">{name}</div>
      <div className="text-[10px] text-muted-foreground">{desc}</div>
    </div>
  );
}

export function AgentDrivenSection() {
  return (
    <section id="methodology" className="py-20 px-4 md:px-8">
      <div className="max-w-5xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-12">
          <div className="text-sm font-medium text-accent mb-2">01</div>
          <h2 className="text-2xl md:text-3xl font-bold mb-4">
            Agent-Driven Development
          </h2>
          <p className="text-muted-foreground max-w-3xl mx-auto text-sm leading-relaxed">
            <T
              ko="Anthropic의 Claude Code 개발론을 적용한 Context-First Development입니다. 구조화된 문서(foundations/plans/reports)와 18개 Skills가 Agent의 Self-RAG 컨텍스트로 축적되며, 각 세션의 결과가 다음 세션의 컨텍스트가 되는 재귀적 개선 루프를 형성합니다."
              en="Context-First Development applying Anthropic's Claude Code methodology. Structured documents and 18 Skills accumulate as Agent's Self-RAG context, forming a recursive improvement loop where each session's results become the next session's context."
            />
          </p>
        </div>

        {/* Cycle Diagram */}
        <div className="relative w-full max-w-md mx-auto aspect-square mb-12">
          {/* Circle path */}
          <div className="absolute inset-8 border-2 border-dashed border-border/50 rounded-full" />

          {/* Animated dot on path */}
          <div className="absolute inset-8 rounded-full">
            <div className="absolute w-3 h-3 bg-accent rounded-full animate-[spin_8s_linear_infinite] origin-center"
                 style={{ top: '50%', left: '50%', transform: 'translate(-50%, -50%) translateY(-100%)' }} />
          </div>

          {/* Center */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center cursor-pointer group">
            <div className="bg-card border border-border/50 rounded-xl p-4 hover:border-accent/50 transition-all">
              <div className="text-3xl mb-1">🔁</div>
              <div className="text-sm font-semibold">Recursive</div>
              <div className="text-sm font-semibold">Self-Improvement</div>
              <div className="text-xs text-accent mt-1">
                <T ko="💡 클릭하여 상세 보기" en="💡 Click for details" />
              </div>
            </div>
          </div>

          {/* Nodes */}
          <CycleNode
            icon="🧑‍💻"
            title="Developer"
            subtitleKo="설계 & 리뷰"
            subtitleEn="Design & Review"
            tooltipKo="류지환 | Backend Engineer"
            tooltipEn="Jihwan Ryu | Backend Engineer"
            position="top"
          />
          <CycleNode
            icon="🤖"
            title="AI Agent"
            subtitleKo="구현 & 디버깅"
            subtitleEn="Implement & Debug"
            tooltipKo="Cursor + Claude Code, 18개 Skills"
            tooltipEn="Cursor + Claude Code, 18 Skills"
            position="right"
          />
          <CycleNode
            icon="☸️"
            title="Cluster"
            subtitleKo="Runtime Environment"
            subtitleEn="Runtime Environment"
            tooltipKo="24-Node K8s + Self-RAG"
            tooltipEn="24-Node K8s + Self-RAG"
            position="bottom"
          />
          <CycleNode
            icon="📊"
            title="Observability"
            subtitleKo="피드백 수집"
            subtitleEn="Feedback"
            tooltipKo="EFK + Jaeger + Prometheus"
            tooltipEn="EFK + Jaeger + Prometheus"
            position="left"
          />
        </div>

        {/* Development Lifecycle */}
        <div className="bg-card border border-border/50 rounded-xl p-6 mb-6">
          <h3 className="text-lg font-semibold mb-4">
            <T ko="🔄 Development Lifecycle" en="🔄 Development Lifecycle" />
          </h3>
          <div className="flex flex-wrap items-center justify-center gap-2">
            <LifecycleStep number="1" title="Research" desc="Foundations" />
            <span className="text-muted-foreground hidden sm:inline">→</span>
            <LifecycleStep number="2" title="Design" desc="Plans" />
            <span className="text-muted-foreground hidden sm:inline">→</span>
            <LifecycleStep number="3" title="Implement" desc="Agent + Code" />
            <span className="text-muted-foreground hidden sm:inline">→</span>
            <LifecycleStep number="4" title="Deploy" desc="GitOps" />
            <span className="text-muted-foreground hidden sm:inline">→</span>
            <LifecycleStep
              number="∞"
              title="Feedback"
              desc="Reports → Loop"
              isFeedback
            />
          </div>
        </div>

        {/* Single Source of Truth */}
        <div className="bg-card border border-border/50 rounded-xl p-6 mb-6">
          <h3 className="text-lg font-semibold mb-4">
            <T ko="🎯 Single Source of Truth" en="🎯 Single Source of Truth" />
          </h3>
          <div className="flex flex-wrap items-center justify-center gap-2">
            <SSOTItem icon="📝" label="Codebase" />
            <span className="text-muted-foreground">→</span>
            <SSOTItem icon="🔄" label="GitOps" />
            <span className="text-muted-foreground">→</span>
            <SSOTItem icon="☸️" label="Cluster State" />
            <span className="text-muted-foreground">→</span>
            <SSOTItem icon="📊" label="Observability" />
          </div>
        </div>

        {/* Self-RAG Knowledge Base */}
        <div className="bg-card border border-border/50 rounded-xl p-6">
          <h3 className="text-lg font-semibold mb-4">
            <T ko="🧠 Self-RAG Knowledge Base" en="🧠 Self-RAG Knowledge Base" />
          </h3>

          {/* docs/ section */}
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xl">📁</span>
              <span className="font-semibold text-accent">docs/</span>
              <span className="text-xs text-muted-foreground">
                <T
                  ko="— 프로젝트 의사결정 아카이브"
                  en="— Project decision archive"
                />
              </span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
              <RAGItem
                icon="📚"
                label="Foundations"
                descKo="근원 기술 21편"
                descEn="21 core tech"
              />
              <RAGItem
                icon="🔧"
                label="Applied"
                descKo="응용 기술 10편"
                descEn="10 applied"
              />
              <RAGItem
                icon="📋"
                label="Plans"
                descKo="설계 문서 10편"
                descEn="10 ADRs"
              />
              <RAGItem
                icon="📈"
                label="Reports"
                descKo="결과 기록 17편"
                descEn="17 reports"
              />
              <RAGItem
                icon="🔥"
                label="Troubleshooting"
                descKo="트러블슈팅 16편"
                descEn="16 issues"
                color="rgba(239,68,68,0.15)"
              />
            </div>
          </div>

          {/* .claude/skills/ section */}
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xl">🛠️</span>
              <span className="font-semibold text-purple-400">
                .claude/skills/
              </span>
              <span className="text-xs text-muted-foreground">
                <T
                  ko="— 18개 도메인 전문성 모듈"
                  en="— 18 domain expertise modules"
                />
              </span>
            </div>
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
              <SkillBadge name="langgraph" desc="pipeline" />
              <SkillBadge name="chat-agent" desc="flow" />
              <SkillBadge name="event-driven" desc="architecture" />
              <SkillBadge name="clean-arch" desc="CQRS" />
              <SkillBadge name="k8s-debug" desc="kubectl" />
              <SkillBadge name="redis" desc="patterns" />
              <SkillBadge name="postgres" desc="schema" />
              <SkillBadge name="grpc" desc="service" />
              <SkillBadge name="rag" desc="pipeline" />
              <SkillBadge name="prompt" desc="engineering" />
              <SkillBadge name="celery" desc="rabbitmq" />
              <SkillBadge name="+6 more" desc="skills" />
            </div>
          </div>

          {/* Explanation */}
          <div className="p-4 bg-black/30 rounded-xl border-l-4 border-accent">
            <p className="text-sm text-muted-foreground leading-relaxed">
              <T
                ko="docs/는 프로젝트 의사결정과 기술 근거를 담은 아카이브이고, .claude/skills/는 AI Agent에게 도메인 전문성을 부여하는 모듈로 코딩 에이전트의 온보딩을 가속합니다."
                en="docs/ is an archive of project decisions, while .claude/skills/ are modules that grant domain expertise to AI Agents, accelerating coding agent onboarding."
              />
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
