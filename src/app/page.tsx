import Link from "next/link";

const projects = [
  {
    id: "geode",
    title: "GEODE",
    subtitle: "Long-running Autonomous Execution Harness",
    description: "범용 자율 실행 에이전트 하네스",
    status: "v0.28.1",
    color: "#818CF8",
  },
  {
    id: "reode",
    title: "REODE",
    subtitle: "Java Migration Harness",
    description: "DomainPort 기반 Spring Boot 자동 마이그레이션",
    status: "coming soon",
    color: "#34D399",
  },
  {
    id: "eco2",
    title: "ECO2",
    subtitle: "Distributed Cluster Platform",
    description: "24-Node Kubernetes 비동기 분산 클러스터",
    status: "coming soon",
    color: "#F5C542",
  },
];

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center gap-16 px-6">
      <div className="text-center space-y-4">
        <h1 className="text-5xl font-extrabold tracking-tight font-[family-name:var(--font-inter)]">
          Jihwan Ryu
        </h1>
        <p className="text-lg text-white/50 font-[family-name:var(--font-fira-code)]">
          Backend · Agentic AI · Infrastructure
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl w-full">
        {projects.map((p) => (
          <Link
            key={p.id}
            href={`/${p.id}`}
            className="group block rounded-2xl border border-white/[0.06] bg-white/[0.02] p-8 transition-all duration-300 hover:border-white/[0.12] hover:bg-white/[0.04] hover:-translate-y-1"
          >
            <div
              className="text-xs font-mono font-medium mb-3 opacity-60"
              style={{ color: p.color }}
            >
              {p.status}
            </div>
            <h2
              className="text-2xl font-bold mb-1 tracking-tight"
              style={{ color: p.color }}
            >
              {p.title}
            </h2>
            <p className="text-sm text-white/40 font-mono mb-4">
              {p.subtitle}
            </p>
            <p className="text-sm text-white/60 leading-relaxed">
              {p.description}
            </p>
          </Link>
        ))}
      </div>
    </main>
  );
}
