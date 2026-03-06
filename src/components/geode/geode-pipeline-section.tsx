"use client";

import { T } from "@/lib/i18n";
import { GeodePipelineDiagram } from "@/components/diagrams/geode-pipeline-diagram";

export function GeodePipelineSection() {
  return (
    <section id="pipeline" className="py-20 px-4 md:px-8 bg-secondary/30">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-12">
          <div className="text-sm font-medium text-[#818CF8] mb-2">02</div>
          <h2 className="text-2xl md:text-3xl font-bold mb-4">
            <T ko="파이프라인 아키텍처" en="Pipeline Architecture" />
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            <T
              ko="LangGraph StateGraph 기반 13-노드 파이프라인. Send API로 4명의 분석가를 Clean Context에서 병렬 실행합니다."
              en="13-node pipeline based on LangGraph StateGraph. Send API executes 4 analysts in parallel with Clean Context."
            />
          </p>
        </div>

        {/* Pipeline Diagram */}
        <GeodePipelineDiagram />

        {/* Legend */}
        <div className="flex flex-wrap justify-center gap-4 mt-6 text-xs text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-full bg-indigo-400/50 border border-indigo-400" />
            <T ko="메인 흐름" en="Main Flow" />
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-full bg-amber-400/50 border border-amber-400" />
            <T ko="Fan-in 병합" en="Fan-in Merge" />
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-8 h-0 border-t border-dashed border-pink-400" />
            <T ko="Feedback Loop" en="Feedback Loop" />
          </div>
        </div>
      </div>
    </section>
  );
}
