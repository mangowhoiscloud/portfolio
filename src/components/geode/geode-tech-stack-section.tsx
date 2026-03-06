"use client";

import { T } from "@/lib/i18n";
import { geodeTechCategories } from "@/data/geode/tech-stack";

export function GeodeTechStackSection() {
  return (
    <section id="tech" className="py-20 px-4 md:px-8 bg-secondary/30">
      <div className="max-w-5xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-12">
          <div className="text-sm font-medium text-[#818CF8] mb-2">04</div>
          <h2 className="text-2xl md:text-3xl font-bold mb-4">
            <T ko="기술 스택" en="Tech Stack" />
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            <T
              ko="GEODE 에이전트 시스템에서 활용한 주요 기술들입니다."
              en="Key technologies used in the GEODE agent system."
            />
          </p>
        </div>

        {/* Tech Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {geodeTechCategories.map((category) => (
            <div
              key={category.title}
              className="bg-card border border-border/50 rounded-xl p-5"
            >
              <h4 className="text-sm font-semibold text-[#818CF8] mb-3">
                {category.title}
              </h4>
              <div className="flex flex-wrap gap-2">
                {category.items.map((item) => (
                  <span
                    key={item}
                    className="px-2.5 py-1 bg-secondary text-foreground text-xs rounded-md"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
