"use client";

import { T } from "@/lib/i18n";

interface BlogPost {
  titleKo: string;
  titleEn: string;
  descKo: string;
  descEn: string;
  tag: string;
  color: string;
}

const blogPosts: BlogPost[] = [
  {
    titleKo: "LangGraph로 프로덕션 AI 에이전트 구축하기",
    titleEn: "Building Production AI Agents with LangGraph",
    descKo: "StateGraph, Send API, Clean Context 패턴으로 병렬 분석 파이프라인을 설계하는 방법",
    descEn: "How to design parallel analysis pipelines with StateGraph, Send API, and Clean Context patterns",
    tag: "LangGraph",
    color: "#818CF8",
  },
  {
    titleKo: "에이전트 메모리 아키텍처: 3-Tier 설계",
    titleEn: "Agent Memory Architecture: 3-Tier Design",
    descKo: "Organization → Project → Session 3계층 컨텍스트 관리와 ContextVar 기반 세션 격리",
    descEn: "3-tier context management (Organization → Project → Session) with ContextVar-based session isolation",
    tag: "Memory",
    color: "#34D399",
  },
  {
    titleKo: "에이전트 런타임 아키텍처",
    titleEn: "Agent Runtime Architecture",
    descKo: "Port/Adapter, Factory Pattern, DI Container로 테스트 가능한 에이전트 시스템 구축",
    descEn: "Building testable agent systems with Port/Adapter, Factory Pattern, and DI Container",
    tag: "Architecture",
    color: "#60A5FA",
  },
];

export function GeodeBlogSection() {
  return (
    <section id="blog" className="py-20 px-4 md:px-8">
      <div className="max-w-5xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-12">
          <div className="text-sm font-medium text-[#818CF8] mb-2">05</div>
          <h2 className="text-2xl md:text-3xl font-bold mb-4">
            <T ko="기술 블로그" en="Tech Blog" />
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            <T
              ko="GEODE 설계·구현 과정을 기록한 블로그 포스트입니다."
              en="Blog posts documenting the GEODE design and implementation process."
            />
          </p>
        </div>

        {/* Blog Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {blogPosts.map((post) => (
            <div
              key={post.titleEn}
              className="bg-card border border-border/50 rounded-xl p-5 hover:border-[var(--post-color)]/30 transition-colors"
              style={{ "--post-color": post.color } as React.CSSProperties}
            >
              {/* Tag */}
              <span
                className="inline-block px-2.5 py-0.5 text-[10px] font-medium rounded-full mb-3"
                style={{
                  backgroundColor: `${post.color}20`,
                  color: post.color,
                }}
              >
                {post.tag}
              </span>

              {/* Title */}
              <h3 className="font-semibold text-foreground text-sm mb-2 leading-snug">
                <T ko={post.titleKo} en={post.titleEn} />
              </h3>

              {/* Description */}
              <p className="text-xs text-muted-foreground leading-relaxed">
                <T ko={post.descKo} en={post.descEn} />
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
