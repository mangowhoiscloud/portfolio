"use client";

import { T } from "@/lib/i18n";

interface Layer {
  id: string;
  level: string;
  titleKo: string;
  titleEn: string;
  descKo: string;
  descEn: string;
  color: string;
  items: string[];
}

const layers: Layer[] = [
  {
    id: "extensibility",
    level: "L5",
    titleKo: "확장성",
    titleEn: "EXTENSIBILITY",
    descKo: "Custom Agents, Plugins, Reports",
    descEn: "Custom Agents, Plugins, Reports",
    color: "#A78BFA",
    items: ["Skill Registry", "Plugin System", "Report Templates"],
  },
  {
    id: "automation",
    level: "L4.5",
    titleKo: "자동화",
    titleEn: "AUTOMATION",
    descKo: "Trigger Manager, Snapshot, CUSUM",
    descEn: "Trigger Manager, Snapshot, CUSUM",
    color: "#F472B6",
    items: ["CUSUM", "FeedbackLoop", "Expert Panel", "Scheduler"],
  },
  {
    id: "orchestration",
    level: "L4",
    titleKo: "오케스트레이션",
    titleEn: "ORCHESTRATION",
    descKo: "Planner, Plan Mode, Task System, Hooks",
    descEn: "Planner, Plan Mode, Task System, Hooks",
    color: "#818CF8",
    items: ["Hooks", "TaskSystem", "Planner", "Bootstrap"],
  },
  {
    id: "agentic-core",
    level: "L3",
    titleKo: "에이전틱 코어",
    titleEn: "AGENTIC CORE",
    descKo: "Agent Loop, Analysts×4, Evaluators×3",
    descEn: "Agent Loop, Analysts×4, Evaluators×3",
    color: "#60A5FA",
    items: ["StateGraph", "Send API", "4 Analysts", "3 Evaluators"],
  },
  {
    id: "memory",
    level: "L2",
    titleKo: "메모리",
    titleEn: "MEMORY",
    descKo: "Organization > Project > Session",
    descEn: "Organization > Project > Session",
    color: "#34D399",
    items: ["ContextVar", "YAML", "Port/Adapter"],
  },
  {
    id: "foundation",
    level: "L1",
    titleKo: "파운데이션",
    titleEn: "FOUNDATION",
    descKo: "MonoLake, LLM Clients, APIs, Skills",
    descEn: "MonoLake, LLM Clients, APIs, Skills",
    color: "#FBBF24",
    items: ["Claude Opus", "Pydantic", "Typer", "Rich"],
  },
];

export function GeodeArchitectureSection() {
  return (
    <section id="architecture" className="py-20 px-4 md:px-8">
      <div className="max-w-5xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-12">
          <div className="text-sm font-medium text-[#818CF8] mb-2">01</div>
          <h2 className="text-2xl md:text-3xl font-bold mb-4">
            <T ko="6-Layer 아키텍처" en="6-Layer Architecture" />
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            <T
              ko="관심사 분리 원칙에 따라 6개 레이어로 구성된 에이전트 시스템입니다."
              en="Agent system organized in 6 layers following the separation of concerns principle."
            />
          </p>
        </div>

        {/* Layer Stack */}
        <div className="space-y-3">
          {layers.map((layer, index) => (
            <div
              key={layer.id}
              className="group bg-card border border-border/50 rounded-xl p-4 md:p-5 hover:border-[var(--layer-color)]/40 transition-all duration-300"
              style={{ "--layer-color": layer.color } as React.CSSProperties}
            >
              <div className="flex flex-col md:flex-row md:items-center gap-3 md:gap-6">
                {/* Level badge */}
                <div
                  className="shrink-0 w-16 h-8 rounded-md flex items-center justify-center text-xs font-bold text-white"
                  style={{ backgroundColor: `${layer.color}40`, color: layer.color }}
                >
                  {layer.level}
                </div>

                {/* Title + Description */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-foreground">
                      <T ko={layer.titleKo} en={layer.titleEn} />
                    </h3>
                    <span className="text-xs text-muted-foreground hidden md:inline">
                      — <T ko={layer.descKo} en={layer.descEn} />
                    </span>
                  </div>
                </div>

                {/* Tech badges */}
                <div className="flex flex-wrap gap-1.5">
                  {layer.items.map((item) => (
                    <span
                      key={item}
                      className="px-2 py-0.5 text-[10px] rounded-md border"
                      style={{
                        borderColor: `${layer.color}30`,
                        color: layer.color,
                        backgroundColor: `${layer.color}10`,
                      }}
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
