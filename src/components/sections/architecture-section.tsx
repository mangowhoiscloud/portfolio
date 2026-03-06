"use client";

import { T } from "@/lib/i18n";
import Image from "next/image";

interface DataFlowRow {
  icon: string;
  flow: string;
  pathKo: string;
  pathEn: string;
  protocol: string;
}

const dataFlows: DataFlowRow[] = [
  {
    icon: "🌐",
    flow: "N-S Traffic",
    pathKo: "User → Route53 → ALB → Istio GW → ext-authz → APIs",
    pathEn: "User → Route53 → ALB → Istio GW → ext-authz → APIs",
    protocol: "HTTPS, gRPC",
  },
  {
    icon: "🔄",
    flow: "E-W Sync",
    pathKo: "auth ↔ users, character → users (mTLS Envoy Sidecar)",
    pathEn: "auth ↔ users, character → users (mTLS Envoy Sidecar)",
    protocol: "gRPC",
  },
  {
    icon: "🤖",
    flow: "Scan AI",
    pathKo: "Scan API → RabbitMQ → scan-worker (Vision→Rule→Answer→Reward) → OpenAI API",
    pathEn: "Scan API → RabbitMQ → scan-worker (Vision→Rule→Answer→Reward) → OpenAI API",
    protocol: "AMQP, Celery Chain",
  },
  {
    icon: "💬",
    flow: "Chat Agent",
    pathKo: "Chat API → chat-worker (Intent→TagRetriever→EvalAgent→Fallback) → OpenAI API",
    pathEn: "Chat API → chat-worker (Intent→TagRetriever→EvalAgent→Fallback) → OpenAI API",
    protocol: "Taskiq, LangGraph",
  },
  {
    icon: "🎭",
    flow: "Character Batch",
    pathKo: "scan-worker → character-match → character-worker → users-worker → PostgreSQL",
    pathEn: "scan-worker → character-match → character-worker → users-worker → PostgreSQL",
    protocol: "AMQP, Batch Insert",
  },
  {
    icon: "📡",
    flow: "SSE Event",
    pathKo: "Workers → Redis Streams → Event Router → Pub/Sub → SSE GW → Client",
    pathEn: "Workers → Redis Streams → Event Router → Pub/Sub → SSE GW → Client",
    protocol: "XADD, PUBLISH, SSE",
  },
  {
    icon: "🔔",
    flow: "Auth Relay",
    pathKo: "Auth API → Redis Fallback Outbox → auth-relay → RabbitMQ Fanout → auth-worker",
    pathEn: "Auth API → Redis Fallback Outbox → auth-relay → RabbitMQ Fanout → auth-worker",
    protocol: "Fallback Outbox",
  },
  {
    icon: "🔄",
    flow: "Cache Broadcast",
    pathKo: "RabbitMQ Fanout → ext-authz Blacklist + character-match Catalog Local Cache Sync",
    pathEn: "RabbitMQ Fanout → ext-authz Blacklist + character-match Catalog Local Cache Sync",
    protocol: "AMQP Fanout",
  },
  {
    icon: "📊",
    flow: "Metrics",
    pathKo: "Envoy Sidecars → Prometheus → Grafana / KEDA Autoscaling",
    pathEn: "Envoy Sidecars → Prometheus → Grafana / KEDA Autoscaling",
    protocol: "Prometheus scrape",
  },
  {
    icon: "📝",
    flow: "Logs",
    pathKo: "All Pods (stdout) → Fluent Bit DaemonSet → Elasticsearch → Kibana",
    pathEn: "All Pods (stdout) → Fluent Bit DaemonSet → Elasticsearch → Kibana",
    protocol: "HTTP (ECS format)",
  },
  {
    icon: "🔍",
    flow: "Traces",
    pathKo: "Envoy → OTel Collector → Jaeger (trace_id correlation, Kiali viz)",
    pathEn: "Envoy → OTel Collector → Jaeger (trace_id correlation, Kiali viz)",
    protocol: "OTLP, Zipkin",
  },
];

export function ArchitectureSection() {
  return (
    <section id="architecture" className="py-20 px-4 md:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-12">
          <div className="text-sm font-medium text-accent mb-2">03</div>
          <h2 className="text-2xl md:text-3xl font-bold mb-4">
            <T ko="시스템 아키텍처" en="System Architecture" />
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            <T
              ko="PWA 기반 프론트엔드와 연동되는 24-Node 분산 클러스터 아키텍처입니다."
              en="24-Node distributed cluster architecture integrated with PWA-based frontend."
            />
          </p>
        </div>

        {/* Architecture Diagram */}
        <div className="bg-card border border-border/50 rounded-xl p-6 mb-8">
          <h3 className="text-lg font-semibold mb-4">
            <T ko="🏗️ 전체 시스템 아키텍처" en="🏗️ System Architecture Overview" />
          </h3>

          {/* Architecture Image */}
          <div className="relative w-full aspect-[16/9] mb-6 rounded-xl overflow-hidden bg-black/50">
            <img
              src="https://github.com/user-attachments/assets/af4b4276-08aa-4859-bfc5-9c9135d944ca"
              alt="Eco² System Architecture"
              className="w-full h-full object-contain"
            />
          </div>

          {/* Data Flow Table */}
          <div className="bg-black/30 rounded-xl p-4">
            <h4 className="text-accent font-semibold mb-4">
              <T ko="📊 데이터 흐름 요약" en="📊 Data Flow Summary" />
            </h4>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border/50">
                    <th className="text-left py-2 px-3 font-medium text-muted-foreground w-[15%]">
                      <T ko="흐름" en="Flow" />
                    </th>
                    <th className="text-left py-2 px-3 font-medium text-muted-foreground w-[60%]">
                      <T ko="경로" en="Path" />
                    </th>
                    <th className="text-left py-2 px-3 font-medium text-muted-foreground w-[25%]">
                      <T ko="프로토콜" en="Protocol" />
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {dataFlows.map((row, index) => (
                    <tr
                      key={index}
                      className="border-b border-border/30 hover:bg-white/5"
                    >
                      <td className="py-2 px-3">
                        <span className="mr-1">{row.icon}</span>
                        <strong>{row.flow}</strong>
                      </td>
                      <td className="py-2 px-3 text-muted-foreground text-xs">
                        <T ko={row.pathKo} en={row.pathEn} />
                      </td>
                      <td className="py-2 px-3 text-xs">
                        <span className="px-2 py-0.5 bg-secondary rounded text-foreground">
                          {row.protocol}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
