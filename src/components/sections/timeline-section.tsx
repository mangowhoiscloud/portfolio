"use client";

import { T } from "@/lib/i18n";
import { cn } from "@/lib/utils";

interface TimelineItemData {
  date: string;
  icon: string;
  titleKo: string;
  titleEn: string;
  descKo: string;
  descEn: string;
  highlight?: boolean;
  color?: string;
}

const timelineData: TimelineItemData[] = [
  {
    date: "2025.10.30 - 11.20",
    icon: "🏗️",
    titleKo: "14-nodes 클러스터 구축 & GitOps",
    titleEn: "14-node Cluster Setup & GitOps",
    descKo:
      "AWS 14-nodes Kubernetes 클러스터 구축, ArgoCD App-of-Apps + Sync Wave 패턴 적용",
    descEn:
      "Built AWS 14-node Kubernetes cluster, applied ArgoCD App-of-Apps + Sync Wave patterns",
  },
  {
    date: "2025.11.20 - 11.30",
    icon: "🖥️",
    titleKo: "7개 도메인 서버 개발",
    titleEn: "7 Domain Server Development",
    descKo:
      "Auth, Character, Chat, Scan, Location, Users, Image 7개 마이크로서비스 개발",
    descEn:
      "Developed 7 microservices: Auth, Character, Chat, Scan, Location, Users, Image",
  },
  {
    date: "2025.12.01 - 12.02",
    icon: "🏆",
    titleKo: "FE-BE 연동 & 새싹톤 본선 우수상",
    titleEn: "FE-BE Integration & SeSACTHON Excellence Award",
    descKo:
      "프론트엔드-백엔드 연동, 2025 AI 새싹톤 본선 우수상 수상 (Top 4)",
    descEn:
      "Frontend-Backend integration, 2025 AI SeSACTHON Finals Excellence Award (Top 4)",
  },
  {
    date: "2025.12.08 - 12.17",
    icon: "🕸️",
    titleKo: "Istio Service Mesh & Auth Offloading",
    titleEn: "Istio Service Mesh & Auth Offloading",
    descKo:
      "Istio Sidecar Injection, ext-authz 서버 개발, gRPC 마이그레이션, RPS 1,200+ 달성",
    descEn:
      "Istio Sidecar Injection, ext-authz server, gRPC migration, achieved RPS 1,200+",
  },
  {
    date: "2025.12.18 - 12.25",
    icon: "📨",
    titleKo: "RabbitMQ + Celery 비동기 아키텍처",
    titleEn: "RabbitMQ + Celery Async Architecture",
    descKo:
      "AI 파이프라인 비동기화, 4단계 Celery Chain 구현, Gevent Pool 전환",
    descEn: "Async AI pipeline, 4-stage Celery Chain, Gevent Pool migration",
  },
  {
    date: "2025.12.20 - 12.22",
    icon: "📊",
    titleKo: "Observability 스택 구축",
    titleEn: "Observability Stack Setup",
    descKo:
      "ECK 기반 EFK 스택, OpenTelemetry 분산 트레이싱, Kiali 시각화",
    descEn:
      "ECK-based EFK stack, OpenTelemetry distributed tracing, Kiali visualization",
  },
  {
    date: "2025.12.26 - 01.01",
    icon: "🌊",
    titleKo: "Event Relay Layer & 부하 테스트",
    titleEn: "Event Relay Layer & Load Testing",
    descKo:
      "Streams + Pub/Sub + State KV 3-Tier 아키텍처, 500 VU SLA, 600 VU 포화지점 도출",
    descEn:
      "Streams + Pub/Sub + State KV 3-tier architecture, 500 VU SLA, 600 VU saturation point",
  },
  {
    date: "2025.12.31 - 2026.01.13",
    icon: "🏛️",
    titleKo: "Clean Architecture 마이그레이션",
    titleEn: "Clean Architecture Migration",
    descKo:
      "7개 도메인 점진적 마이그레이션, DIP/Port & Adapter/CQRS 적용, Info 서비스 추가 개발 (뉴스 피드)",
    descEn:
      "Incremental migration of 7 domains, DIP/Port & Adapter/CQRS, Info service addition (News Feed)",
  },
  {
    date: "2026.01.13 - 01.25",
    icon: "🤖",
    titleKo: "Chat 도메인 Agentic Workflow 전환",
    titleEn: "Chat Domain Agentic Workflow Transition",
    descKo:
      "LangGraph 기반 Multi-Agent 아키텍처로 Chat 도메인 고도화, 도구 호출 + 상태 관리 + 스트리밍 통합",
    descEn:
      "Upgrading Chat domain to LangGraph-based Multi-Agent architecture, Tool calling + State management + Streaming integration",
    highlight: true,
    color: "var(--accent-teal)",
  },
];

interface TimelineItemProps {
  item: TimelineItemData;
  index: number;
}

function TimelineItem({ item, index }: TimelineItemProps) {
  const isLeft = index % 2 === 0;

  return (
    <div
      className={cn(
        "relative flex items-center gap-4 md:gap-8",
        "md:w-1/2",
        isLeft ? "md:mr-auto md:pr-8" : "md:ml-auto md:pl-8"
      )}
    >
      {/* Timeline dot */}
      <div
        className={cn(
          "absolute top-1/2 -translate-y-1/2 w-3 h-3 rounded-full border-2 border-background z-10",
          item.highlight ? "bg-accent-teal" : "bg-accent"
        )}
        style={{
          left: isLeft ? "auto" : "-6px",
          right: isLeft ? "-6px" : "auto",
        }}
      />

      {/* Content */}
      <div
        className={cn(
          "flex-1 p-4 bg-card rounded-xl border border-border/50 hover:border-accent/30 transition-colors",
          item.highlight && "border-accent-teal/30"
        )}
      >
        <div
          className={cn(
            "text-xs font-medium mb-2",
            item.highlight ? "text-accent-teal" : "text-accent"
          )}
        >
          {item.date}
        </div>
        <div className="flex items-center gap-2 mb-2">
          <span className="text-lg">{item.icon}</span>
          <h3 className="font-semibold text-foreground">
            <T ko={item.titleKo} en={item.titleEn} />
          </h3>
        </div>
        <p className="text-sm text-muted-foreground">
          <T ko={item.descKo} en={item.descEn} />
        </p>
      </div>
    </div>
  );
}

export function TimelineSection() {
  return (
    <section id="timeline" className="py-20 px-4 md:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-12">
          <div className="text-sm font-medium text-accent mb-2">03</div>
          <h2 className="text-2xl md:text-3xl font-bold mb-4">
            <T ko="개발 여정" en="Development Journey" />
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            <T
              ko="클러스터 구축부터 Agentic Workflow까지, 3개월간의 고도화 기록"
              en="From cluster setup to Agentic Workflow, 3 months of evolution"
            />
          </p>
        </div>

        {/* Timeline */}
        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-px bg-border/50 -translate-x-1/2" />

          {/* Items */}
          <div className="space-y-8">
            {timelineData.map((item, index) => (
              <TimelineItem key={index} item={item} index={index} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
